import "dotenv/config";
import { NextRequest, NextResponse } from "next/server";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

export async function POST(request: NextRequest) {
    const body = await request.json();

    const { firstName, email, password } = body;
    const normalizedFirstName = firstName?.trim();
    const normalizedEmail = email?.trim().toLowerCase();

    if (!normalizedFirstName || !normalizedEmail || !password) {
        return NextResponse.json(
            {
                message: "All fields are required",
            },
            {
                status: 400,
            }
        );
    }

    const existingUser = await prisma.user.findUnique({
        where: {
            email: normalizedEmail,
        },
    });

    if (existingUser) {
        return NextResponse.json(
            {
                message: "User already exists",
            },
            {
                status: 409,
            }
        );
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
        data: {
            firstName: normalizedFirstName,
            email: normalizedEmail,
            passwordHash,
        },
    });

    return NextResponse.json(
        {
            message: "User registered successfully",
            userId: user.id,
            email: user.email,
        },
        {
            status: 201,
        }
    );
}