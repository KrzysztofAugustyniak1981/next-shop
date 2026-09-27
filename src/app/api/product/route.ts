import { NextRequest, NextResponse } from "next/server";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient, Prisma } from "@prisma/client";

const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);

        const category = searchParams.get("category");
        const minPrice = searchParams.get("minPrice");
        const maxPrice = searchParams.get("maxPrice");
        const sort = searchParams.get("sort") || "latest";

        const page = Math.max(
            Number(searchParams.get("page")) || 1,
            1
        );

        const limit = Math.min(
            Math.max(
                Number(searchParams.get("limit")) || 9,
                1
            ),
            100
        );

        const skip = (page - 1) * limit;

        const where: Prisma.ProductWhereInput = {};

        if (category) {
            where.category = {
                name: category,
            };
        }

        if (minPrice || maxPrice) {
            where.price = {};

            if (minPrice) {
                where.price.gte = Number(minPrice);
            }

            if (maxPrice) {
                where.price.lte = Number(maxPrice);
            }
        }

        let orderBy: Prisma.ProductOrderByWithRelationInput = {
            id: "desc",
        };

        if (sort === "price-low") {
            orderBy = {
                price: "asc",
            };
        }

        if (sort === "price-high") {
            orderBy = {
                price: "desc",
            };
        }

        if (sort === "latest") {
            orderBy = {
                id: "desc",
            };
        }

        const [products, total] = await prisma.$transaction([
            prisma.product.findMany({
                where,
                include: {
                    brand: true,
                    category: true,
                },
                orderBy,
                skip,
                take: limit,
            }),

            prisma.product.count({
                where,
            }),
        ]);

        const totalPages = Math.ceil(total / limit);

        return NextResponse.json({
            products,
            pagination: {
                page,
                limit,
                total,
                totalPages,
            },
        });
    } catch (error) {
        console.error("Failed to fetch products:", error);

        return NextResponse.json(
            {
                message: "Failed to fetch products.",
            },
            {
                status: 500,
            }
        );
    }
}