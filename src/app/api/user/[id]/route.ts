import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

import { verifySessionToken } from "@/lib/auth";

const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("session")?.value;

        if (!token) {
            return NextResponse.json(
                { message: "Unauthorized." },
                { status: 401 }
            );
        }

        const session = await verifySessionToken(token);
        const sessionUserId = Number(session.userId);

        const { id } = await params;
        const requestedUserId = Number(id);

        if (
            !Number.isInteger(requestedUserId) ||
            requestedUserId <= 0
        ) {
            return NextResponse.json(
                { message: "Invalid user ID." },
                { status: 400 }
            );
        }

        if (sessionUserId !== requestedUserId) {
            return NextResponse.json(
                { message: "Forbidden." },
                { status: 403 }
            );
        }

        const user = await prisma.user.findUnique({
            where: {
                id: requestedUserId,
            },
            select: {
                id: true,
                firstName: true,
                email: true,
                address: true,
                country: true,
                province: true,
                city: true,
                postalCode: true,
                createdAt: true,
                orders: {
                    orderBy: {
                        createdAt: "desc",
                    },
                    select: {
                        id: true,
                        createdAt: true,
                        status: true,
                        totalAmount: true,
                        productProtection: true,
                    },
                },
            },
        });

        if (!user) {
            return NextResponse.json(
                { message: "User not found." },
                { status: 404 }
            );
        }

        return NextResponse.json(user);
    } catch {
        return NextResponse.json(
            { message: "Unauthorized." },
            { status: 401 }
        );
    }
}