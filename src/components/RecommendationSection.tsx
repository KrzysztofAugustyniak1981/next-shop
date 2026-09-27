import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";

const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

type RandomProduct = {
    id: number;
};

export default async function RecommendationSection() {
    const randomProducts = await prisma.$queryRaw<RandomProduct[]>`
        SELECT id
        FROM "Product"
        ORDER BY RANDOM()
        LIMIT 6
    `;

    const productIds = randomProducts.map(
        (product) => product.id
    );

    const products = await prisma.product.findMany({
        where: {
            id: {
                in: productIds,
            },
        },
        include: {
            category: true,
        },
    });

    const selectedProducts = productIds
        .map((id) =>
            products.find((product) => product.id === id)
        )
        .filter((product) => product !== undefined);

    return (
        <section className="w-full">
            <div className="mb-8 flex items-center justify-between">
                <h2 className="text-2xl font-medium text-white">
                    Recommendation
                </h2>

                <Link
                    href="/products"
                    className="text-sm text-orange-500 hover:text-orange-400"
                >
                    See All →
                </Link>
            </div>

            <div className="scrollbar-hide flex gap-8 overflow-x-auto overflow-y-hidden">
                {selectedProducts.map((product) => (
                    <ProductCard
                        key={product.id}
                        id={product.id}
                        name={product.name}
                        category={product.category.name}
                        price={product.price.toString()}
                        oldPrice={product.oldPrice?.toString()}
                        imageUrl={product.imageUrl}
                        stock={product.stock}
                    />
                ))}
            </div>
        </section>
    );
}