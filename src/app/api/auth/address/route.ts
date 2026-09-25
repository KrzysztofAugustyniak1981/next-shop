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
                message: "Not authenticated",
            },
            {
                status: 401,
            }
        );
    }

    try {
        const sessionData = await verifySessionToken(
            session.value
        );

        const userId = Number(sessionData.userId);

        const user = await prisma.user.findUnique({
            where: {
                id: userId,
            },
            select: {
                firstName: true,
                address: true,
                country: true,
                province: true,
                city: true,
                postalCode: true,
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
            address: user,
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

export async function PUT(request: Request) {
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

    const body = await request.json();

    const address = body.address?.trim();
    const country = body.country?.trim();
    const province = body.province?.trim();
    const city = body.city?.trim();
    const postalCode = body.postalCode?.trim();

    if (
        !address ||
        !country ||
        !province ||
        !city ||
        !postalCode
    ) {
        return NextResponse.json(
            {
                message: "All address fields are required",
            },
            {
                status: 400,
            }
        );
    }

    const updatedUser = await prisma.user.update({
        where: {
            id: userId,
        },
        data: {
            address,
            country,
            province,
            city,
            postalCode,
        },
        select: {
            firstName: true,
            address: true,
            country: true,
            province: true,
            city: true,
            postalCode: true,
        },
    });

    return NextResponse.json({
        message: "Address saved successfully",
        address: updatedUser,
    });
}