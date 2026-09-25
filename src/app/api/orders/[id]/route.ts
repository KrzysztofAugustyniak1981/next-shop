import "dotenv/config";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import { verifySessionToken } from "@/lib/auth";

const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

type RouteContext = {
    params: Promise<{
        id: string;
    }>;
};

export async function GET(
    request: Request,
    context: RouteContext
) {
    const cookieStore = await cookies();
    const session = cookieStore.get("session");

    if (!session) {
        return NextResponse.json(
            {
                message: "Not authenticated",
            },
            {
                status: 401,
            }
        );
    }

    let userId: number;

    try {
        const sessionData = await verifySessionToken(
            session.value
        );

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

    const { id } = await context.params;
    const orderId = Number(id);

    if (!Number.isInteger(orderId)) {
        return NextResponse.json(
            {
                message: "Invalid order ID",
            },
            {
                status: 400,
            }
        );
    }

    const order = await prisma.order.findFirst({
        where: {
            id: orderId,
            userId,
        },
        include: {
            items: {
                include: {
                    product: true,
                },
            },
        },
    });

    if (!order) {
        return NextResponse.json(
            {
                message: "Order not found",
            },
            {
                status: 404,
            }
        );
    }

    return NextResponse.json({
        order,
    });
}