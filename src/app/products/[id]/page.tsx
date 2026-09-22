import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import { notFound } from "next/navigation";
import Image from "next/image";

import ProductDetailCard from "@/components/ProductDetailCard";


const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

type ProductDetailsPageProps = {
    params: Promise<{
        id: string;
    }>;
};

export default async function ProductDetailsPage({
    params,
}: ProductDetailsPageProps) {
    const { id } = await params;

    const productId = Number(id);

    const product = await prisma.product.findUnique({
        where: {
            id: productId,
        },
        include: {
            category: true,
            brand: true,
        },
    });

    if (!product) {
        notFound();
    }

    return (
        <main className=" bg-[#1A1A1A] text-white">
            <div className="mx-auto max-w-[1440px] px-6 pb-16 pt-8 sm:px-8 lg:px-10 lg:pb-10">
                <div className="flex items-center gap-4 text-sm">
                    <span className="text-gray-400">Product</span>
                    <span className="text-gray-500">›</span>
                    <span className="text-white">{product.name}</span>
                </div>

                <div className="mt-12 flex flex-col gap-8 lg:flex-row lg:items-start">
                    <div className="w-full lg:w-[422px] lg:shrink-0">
                        <div className="relative h-[320px] w-full overflow-hidden rounded-[6px] border border-[#383B42] bg-white sm:h-[380px] lg:h-[373px]">
                            <Image
                                src={product.imageUrl || "/images/product-mouse.png"}
                                alt={product.name}
                                fill
                                sizes="(max-width: 1024px) 100vw, 422px"
                                className="object-contain p-8"
                                loading="eager"
                            />
                        </div>

                        <div className="mt-4 flex gap-4">
                            {[1, 2, 3].map((thumbnail) => (
                                <div
                                    key={thumbnail}
                                    className={`relative h-[99px] flex-1 overflow-hidden rounded-[4px] bg-white ${thumbnail === 1
                                        ? "border-2 border-[#F26B0A]"
                                        : "border border-[#383B42]"
                                        }`}
                                >
                                    <Image
                                        src={product.imageUrl || "/images/product-mouse.png"}
                                        alt={`${product.name} ${thumbnail}`}
                                        fill
                                        sizes="130px"
                                        className="object-contain p-3"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="min-w-0 w-full lg:w-[427px] lg:shrink-0">
                        <h1 className="text-2xl font-semibold">
                            {product.name}
                        </h1>

                        <span className="mt-4 inline-block rounded-[4px] bg-[#F26B0A] px-2 py-1 text-xs">
                            {product.category.name}
                        </span>

                        <p className="mt-6 text-2xl">
                            ${product.price.toString()}
                        </p>
                        <div className="mt-8">
                            <p className="text-sm leading-6 text-gray-300">
                                {product.description || "No description available."}
                            </p>

                            <button
                                type="button"
                                className="mt-1 text-sm text-[#F26B0A]"
                            >
                                View More
                            </button>
                        </div>

                        <div className="mt-8">
                            <p className="text-sm text-gray-400">
                                Shipping Available
                            </p>

                            <div className="mt-3 w-fit rounded-[6px] border border-[#616674] px-4 py-3">
                                <div className="flex items-start gap-3">
                                    <span className="text-[#22C55E]">✓</span>

                                    <div>
                                        <p className="text-sm text-white">
                                            NexusHub Courier
                                        </p>

                                        <p className="mt-1 text-xs text-gray-400">
                                            Estimated arrival 30 Sep - 3 Oct
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <ProductDetailCard
                        id={product.id}
                        name={product.name}
                        price={Number(product.price)}
                        imageUrl={product.imageUrl}
                        stock={product.stock}
                    />
                </div>
            </div>
        </main>
    );
}