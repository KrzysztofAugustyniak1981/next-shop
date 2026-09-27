import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import BrandCard from "@/components/BrandCard";
import Link from "next/link";

const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

const brandImages: Record<
    string,
    {
        image: string;
        width: number;
        height: number;
    }
> = {
    ROG: {
        image: "/brands/rog.svg",
        width: 78.04,
        height: 46,
    },
    Logitech: {
        image: "/brands/logitech.svg",
        width: 46,
        height: 46,
    },
    JBL: {
        image: "/brands/jbl.svg",
        width: 82.88,
        height: 46,
    },
    AOC: {
        image: "/brands/aoc.svg",
        width: 136.8,
        height: 46,
    },
    Razer: {
        image: "/brands/razer.svg",
        width: 45.53,
        height: 46,
    },
    Rexus: {
        image: "/brands/rexus.svg",
        width: 46,
        height: 46,
    },
    Sony: {
        image: "/brands/sony.svg",
        width: 80,
        height: 46,
    },
};

export default async function BrandSection() {
    const brands = await prisma.brand.findMany({
        orderBy: {
            id: "asc",
        },
    });

    return (
        <section className="w-full">
            <div className="mb-8 flex items-center justify-between">
                <h2 className="text-2xl font-medium text-white">
                    Brand
                </h2>

                <Link
                    href="/products"
                    className="text-sm text-orange-500 hover:text-orange-400"
                >
                    See All →
                </Link>
            </div>

            <div className="scrollbar-hide flex gap-8 overflow-x-auto overflow-y-hidden">
                {brands.map((brand) => {
                    const brandData = brandImages[brand.name];

                    if (!brandData) {
                        return null;
                    }

                    return (
                        <BrandCard
                            key={brand.id}
                            name={brand.name}
                            image={brandData.image}
                            width={brandData.width}
                            height={brandData.height}
                        />
                    );
                })}
            </div>
        </section>
    );
}