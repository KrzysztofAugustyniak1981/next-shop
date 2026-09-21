import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

import ProductCard from "@/components/ProductCard";
import ProductToolbar from "@/components/ProductToolbar";
import CategoryFilter from "@/components/CategoryFilter";
import PriceFilter from "@/components/PriceFilter";
import Pagination from "@/components/Pagination";

const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

type ProductsPageProps = {
    searchParams: Promise<{
        page?: string;
        show?: string;
        sort?: string;
        category?: string;
        minPrice?: string;
        maxPrice?: string;
    }>;
};

export default async function ProductsPage({
    searchParams,
}: ProductsPageProps) {
    const params = await searchParams;

    const sort = params.sort || "latest";

    const category = params.category;

    const minPrice = params.minPrice
        ? Number(params.minPrice)
        : undefined;

    const maxPrice = params.maxPrice
        ? Number(params.maxPrice)
        : undefined;

    const where = {
        ...(category && {
            category: {
                name: category,
            },
        }),

        ...((minPrice !== undefined || maxPrice !== undefined) && {
            price: {
                ...(minPrice !== undefined && {
                    gte: minPrice,
                }),

                ...(maxPrice !== undefined && {
                    lte: maxPrice,
                }),
            },
        }),
    };

    const allowedPageSizes = [9, 12, 15];

    const requestedPageSize = Number(params.show) || 9;

    const pageSize = allowedPageSizes.includes(requestedPageSize)
        ? requestedPageSize
        : 9;

    const requestedPage = Number(params.page) || 1;
    const currentPage = Math.max(1, requestedPage);

    const totalProducts = await prisma.product.count({
        where,
    });

    const totalPages = Math.ceil(totalProducts / pageSize);

    let orderBy: {
        price?: "asc" | "desc";
        id?: "asc" | "desc";
    };

    if (sort === "price-low") {
        orderBy = {
            price: "asc",
        };
    } else if (sort === "price-high") {
        orderBy = {
            price: "desc",
        };
    } else {
        orderBy = {
            id: "desc",
        };
    }

    const products = await prisma.product.findMany({
        where,
        skip: (currentPage - 1) * pageSize,
        take: pageSize,
        orderBy,
        include: {
            category: true,
        },
    });

    return (
        <main className="min-h-screen bg-[#1A1A1A] text-white">
            <div className="mx-auto flex max-w-[1440px] flex-col lg:flex-row">
                <aside className="flex w-full flex-col gap-[52px] border-b border-[#383B42] p-6 sm:p-8 lg:w-[363px] lg:shrink-0 lg:border-b-0 lg:border-r lg:p-10">
                    <CategoryFilter />
                    <PriceFilter />
                </aside>

                <section className="min-w-0 flex-1 p-6 sm:p-8 lg:p-10">
                    <ProductToolbar />

                    <div className="mt-10 grid grid-cols-1 justify-items-center gap-8 sm:grid-cols-2 xl:grid-cols-3">
                        {products.map((product) => (
                            <ProductCard
                                key={product.id}
                                name={product.name}
                                category={product.category.name}
                                price={product.price.toString()}
                                oldPrice={product.oldPrice?.toString()}
                                imageUrl={product.imageUrl}
                            />
                        ))}
                    </div>

                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        pageSize={pageSize}
                        sort={sort}
                        category={category}
                        minPrice={minPrice}
                        maxPrice={maxPrice}
                    />
                </section>
            </div>
        </main>
    );
}