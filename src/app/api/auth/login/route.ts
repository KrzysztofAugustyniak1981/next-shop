import "dotenv/config";
import { NextRequest, NextResponse } from "next/server";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { createSessionToken } from "@/lib/auth";

const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

export async function POST(request: NextRequest) {
    const body = await request.json();

    const { email, password } = body;
    const normalizedEmail = email?.trim().toLowerCase();

    const user = await prisma.user.findUnique({
        where: {
            email: normalizedEmail,
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

    const isPasswordCorrect = await bcrypt.compare(
        password,
        user.passwordHash
    );

    if (!isPasswordCorrect) {
        return NextResponse.json(
            {
                message: "Invalid password",
            },
            {
                status: 401,
            }
        );
    }

    const token = await createSessionToken({
        userId: user.id,
        email: user.email,
    });

    const response = NextResponse.json({
        message: "Login successful",
        userId: user.id,
        email: user.email,
    });

    response.cookies.set("session", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7,
        path: "/",
    });

    return response;
}