import "dotenv/config";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import { verifySessionToken } from "@/lib/auth";

const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

type OrderItemInput = {
    productId: number;
    quantity: number;
};

export async function POST(request: NextRequest) {
    const cookieStore = await cookies();
    const session = cookieStore.get("session");

    if (!session) {
        return NextResponse.json(
            {
                message: "You must be logged in",
            },
            {
                status: 401,
            }
        );
    }

    let userId: number;

    try {
        const sessionData = await verifySessionToken(session.value);
        userId = Number(sessionData.userId);
    } catch {
        return NextResponse.json(
            {
                message: "Invalid session",
            },
            {
                status: 401,
            }
        );
    }

    const body = await request.json();

    const items: OrderItemInput[] = body.items;
    const productProtection = body.productProtection === true;

    if (!items || items.length === 0) {
        return NextResponse.json(
            {
                message: "Cart is empty",
            },
            {
                status: 400,
            }
        );
    }

    const hasInvalidQuantity = items.some(
        (item) =>
            !Number.isInteger(item.quantity) ||
            item.quantity <= 0
    );

    if (hasInvalidQuantity) {
        return NextResponse.json(
            {
                message: "Invalid product quantity",
            },
            {
                status: 400,
            }
        );
    }

    const productIds = items.map((item) => item.productId);

    const products = await prisma.product.findMany({
        where: {
            id: {
                in: productIds,
            },
        },
    });

    if (products.length !== productIds.length) {
        return NextResponse.json(
            {
                message: "One or more products were not found",
            },
            {
                status: 400,
            }
        );
    }

    let totalAmount = 0;

    const insufficientStockItem = items.find((item) => {
        const product = products.find(
            (product) => product.id === item.productId
        );

        return product && item.quantity > product.stock;
    });

    if (insufficientStockItem) {
        const product = products.find(
            (product) => product.id === insufficientStockItem.productId
        );

        return NextResponse.json(
            {
                message: `Not enough stock for product: ${product?.name}`,
            },
            {
                status: 400,
            }
        );
    }

    const orderItems = items.map((item) => {
        const product = products.find(
            (product) => product.id === item.productId
        );

        if (!product) {
            throw new Error("Product not found");
        }



        totalAmount += Number(product.price) * item.quantity;

        return {
            productId: product.id,
            quantity: item.quantity,
            priceAtPurchase: product.price,
        };
    });

    if (productProtection) {
        totalAmount += 1;
    }

    const order = await prisma.$transaction(async (tx) => {
        const createdOrder = await tx.order.create({
            data: {
                userId,
                status: "pending",
                totalAmount,
                productProtection,
                items: {
                    create: orderItems,
                },
            },
            include: {
                items: true,
            },
        });

        for (const item of items) {
            await tx.product.update({
                where: {
                    id: item.productId,
                },
                data: {
                    stock: {
                        decrement: item.quantity,
                    },
                },
            });
        }

        return createdOrder;
    });

    return NextResponse.json(
        {
            message: "Order created successfully",
            orderId: order.id,
        },
        {
            status: 201,
        }
    );
}