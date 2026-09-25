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

export async function GET() {
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

    try {
        const sessionData = await verifySessionToken(session.value);
        const userId = Number(sessionData.userId);

        const user = await prisma.user.findUnique({
            where: {
                id: userId,
            },
            select: {
                id: true,
                firstName: true,
                email: true,
                orders: {
                    orderBy: {
                        createdAt: "desc",
                    },
                    include: {
                        items: {
                            include: {
                                product: true,
                            },
                        },
                    },
                },
            },
        });

        if (!user) {
            return NextResponse.json(
                {
                    message: "User not found",
                },
                {
                    status: 404,
                }
            );
        }

        return NextResponse.json({
            user,
        });
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
}