import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

import { verifySessionToken } from "@/lib/auth";

const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

async function getUserId() {
    const cookieStore = await cookies();
    const token = cookieStore.get("session")?.value;

    if (!token) {
        return null;
    }

    try {
        const session = await verifySessionToken(token);

        const userId = Number(session.userId);

        if (!Number.isInteger(userId)) {
            return null;
        }

        return userId;
    } catch {
        return null;
    }
}

const cartInclude = {
    items: {
        orderBy: {
            id: "asc" as const,
        },
        include: {
            product: true,
        },
    },
};

export async function GET() {
    try {
        const userId = await getUserId();

        if (!userId) {
            return NextResponse.json(
                { message: "Unauthorized." },
                { status: 401 }
            );
        }

        let cart = await prisma.cart.findUnique({
            where: {
                userId,
            },
            include: cartInclude,
        });

        if (!cart) {
            try {
                cart = await prisma.cart.create({
                    data: {
                        userId,
                    },
                    include: cartInclude,
                });
            } catch {
                cart = await prisma.cart.findUnique({
                    where: {
                        userId,
                    },
                    include: cartInclude,
                });
            }
        }

        if (!cart) {
            return NextResponse.json(
                { message: "Failed to create cart." },
                { status: 500 }
            );
        }

        return NextResponse.json(cart);
    } catch (error) {
        console.error("Failed to fetch cart:", error);

        return NextResponse.json(
            { message: "Failed to fetch cart." },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const userId = await getUserId();

        if (!userId) {
            return NextResponse.json(
                { message: "Unauthorized." },
                { status: 401 }
            );
        }

        const body = await request.json();

        const productId = Number(body.productId);
        const requestedQuantity = Number(body.quantity) || 1;

        if (
            !Number.isInteger(productId) ||
            productId <= 0 ||
            !Number.isInteger(requestedQuantity) ||
            requestedQuantity <= 0
        ) {
            return NextResponse.json(
                { message: "Invalid product or quantity." },
                { status: 400 }
            );
        }

        const product = await prisma.product.findUnique({
            where: {
                id: productId,
            },
        });

        if (!product) {
            return NextResponse.json(
                { message: "Product not found." },
                { status: 404 }
            );
        }

        if (product.stock <= 0) {
            return NextResponse.json(
                { message: "Product is out of stock." },
                { status: 400 }
            );
        }

        const cart = await prisma.cart.upsert({
            where: {
                userId,
            },
            update: {},
            create: {
                userId,
            },
        });

        const existingItem = await prisma.cartItem.findUnique({
            where: {
                cartId_productId: {
                    cartId: cart.id,
                    productId,
                },
            },
        });

        const quantity = Math.min(
            (existingItem?.quantity ?? 0) + requestedQuantity,
            product.stock
        );

        await prisma.cartItem.upsert({
            where: {
                cartId_productId: {
                    cartId: cart.id,
                    productId,
                },
            },
            update: {
                quantity,
            },
            create: {
                cartId: cart.id,
                productId,
                quantity: Math.min(
                    requestedQuantity,
                    product.stock
                ),
            },
        });

        const updatedCart = await prisma.cart.findUnique({
            where: {
                id: cart.id,
            },
            include: cartInclude,
        });

        return NextResponse.json(updatedCart);
    } catch (error) {
        console.error("Failed to add product to cart:", error);

        return NextResponse.json(
            { message: "Failed to add product to cart." },
            { status: 500 }
        );
    }
}

export async function PATCH(request: NextRequest) {
    try {
        const userId = await getUserId();

        if (!userId) {
            return NextResponse.json(
                { message: "Unauthorized." },
                { status: 401 }
            );
        }

        const body = await request.json();

        const productId = Number(body.productId);
        const quantity = Number(body.quantity);

        if (
            !Number.isInteger(productId) ||
            productId <= 0 ||
            !Number.isInteger(quantity) ||
            quantity <= 0
        ) {
            return NextResponse.json(
                { message: "Invalid product or quantity." },
                { status: 400 }
            );
        }

        const cart = await prisma.cart.findUnique({
            where: {
                userId,
            },
        });

        if (!cart) {
            return NextResponse.json(
                { message: "Cart not found." },
                { status: 404 }
            );
        }

        const product = await prisma.product.findUnique({
            where: {
                id: productId,
            },
        });

        if (!product) {
            return NextResponse.json(
                { message: "Product not found." },
                { status: 404 }
            );
        }

        const cartItem = await prisma.cartItem.findUnique({
            where: {
                cartId_productId: {
                    cartId: cart.id,
                    productId,
                },
            },
        });

        if (!cartItem) {
            return NextResponse.json(
                { message: "Cart item not found." },
                { status: 404 }
            );
        }

        await prisma.cartItem.update({
            where: {
                id: cartItem.id,
            },
            data: {
                quantity: Math.min(quantity, product.stock),
            },
        });

        const updatedCart = await prisma.cart.findUnique({
            where: {
                id: cart.id,
            },
            include: cartInclude,
        });

        return NextResponse.json(updatedCart);
    } catch (error) {
        console.error("Failed to update cart:", error);

        return NextResponse.json(
            { message: "Failed to update cart." },
            { status: 500 }
        );
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const userId = await getUserId();

        if (!userId) {
            return NextResponse.json(
                { message: "Unauthorized." },
                { status: 401 }
            );
        }

        const cart = await prisma.cart.findUnique({
            where: {
                userId,
            },
        });

        if (!cart) {
            return NextResponse.json({
                items: [],
            });
        }

        const body = await request.json().catch(() => ({}));

        const productId = body.productId
            ? Number(body.productId)
            : null;

        if (productId) {
            await prisma.cartItem.deleteMany({
                where: {
                    cartId: cart.id,
                    productId,
                },
            });
        } else {
            await prisma.cartItem.deleteMany({
                where: {
                    cartId: cart.id,
                },
            });
        }

        const updatedCart = await prisma.cart.findUnique({
            where: {
                id: cart.id,
            },
            include: cartInclude,
        });

        return NextResponse.json(updatedCart);
    } catch (error) {
        console.error("Failed to delete cart item:", error);

        return NextResponse.json(
            { message: "Failed to update cart." },
            { status: 500 }
        );
    }
}