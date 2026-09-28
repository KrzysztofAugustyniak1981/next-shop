import { NextResponse } from "next/server";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

export async function GET() {
    try {
        const brands = await prisma.brand.findMany({
            orderBy: {
                id: "asc",
            },
            select: {
                id: true,
                name: true,
            },
        });

        return NextResponse.json(brands);
    } catch (error) {
        console.error("Failed to fetch brands:", error);

        return NextResponse.json(
            { message: "Failed to fetch brands." },
            { status: 500 }
        );
    }
}