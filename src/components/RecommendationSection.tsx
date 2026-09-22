import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import ProductCard from "@/components/ProductCard";

const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

export default async function RecommendationSection() {
    // Pobieramy z bazy produkty, które mają być pokazane
    // w sekcji Recommendation zgodnie z Figmą.
    const products = await prisma.product.findMany({
        where: {
            name: {
                in: [
                    "Logitech G502 Hero",
                    "Sony WH-CH510",
                    "AOC 24G2E",
                    "Razer Huntsman Elite",
                    "ROG Swift PG259QN",
                    "JBL Tune 500",
                ],
            },
        },
        include: {
            category: true,
        },
    });

    // Kolejność produktów zgodna z Figmą.
    const recommendationOrder = [
        "Logitech G502 Hero",
        "Sony WH-CH510",
        "AOC 24G2E",
        "Razer Huntsman Elite",
        "ROG Swift PG259QN",
        "JBL Tune 500",
    ];

    // findMany() nie gwarantuje kolejności z tablicy "in",
    // dlatego ustawiamy ją tutaj.
    const sortedProducts = recommendationOrder
        .map((name) =>
            products.find((product) => product.name === name)
        )
        .filter((product) => product !== undefined);

    return (
        <section className="w-full">
            {/* Nagłówek sekcji */}
            <div className="mb-8 flex items-center justify-between">
                <h2 className="text-2xl font-medium text-white">
                    Recommendation
                </h2>

                <a
                    href="/products"
                    className="text-sm text-orange-500 hover:text-orange-400"
                >
                    See All →
                </a>
            </div>

            {/* Karty produktów */}
            <div className="flex gap-8 overflow-x-auto overflow-y-hidden">
                {sortedProducts.map((product) => (
                    <ProductCard
                        key={product.id}
                        id={product.id}
                        name={product.name}
                        category={product.category.name}
                        price={product.price.toString()}
                        oldPrice={product.oldPrice?.toString()}
                        imageUrl={product.imageUrl}
                    />
                ))}
            </div>
        </section>
    );
}