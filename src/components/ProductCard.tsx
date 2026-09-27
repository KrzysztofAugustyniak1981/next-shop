"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import CartIcon from "@/components/icons/CartIcon";
import { useCart } from "@/context/CartContext";

type ProductCardProps = {
    id: number;
    name: string;
    category: string;
    price: string;
    oldPrice?: string;
    imageUrl?: string | null;
    stock?: number;
};

export default function ProductCard({
    id,
    name,
    category,
    price,
    oldPrice,
    imageUrl,
    stock = 99,
}: ProductCardProps) {
    const { addToCart } = useCart();

    const [notification, setNotification] =
        useState(false);

    function handleAddToCart() {
        addToCart({
            id,
            name,
            price: Number(price),
            imageUrl: imageUrl || "/images/product-mouse.png",
            stock,
            quantity: 1,
        });

        setNotification(true);

        window.setTimeout(() => {
            setNotification(false);
        }, 2500);
    }

    return (
        <>
            <article className="flex h-[386px] w-[300px] shrink-0 flex-col rounded-[6px] border border-[#383B42] bg-[#262626] px-4 pb-5 pt-4">
                <div className="relative h-[204px] w-[268px] overflow-hidden rounded-[4px] bg-white">
                    <button
                        type="button"
                        onClick={handleAddToCart}
                        aria-label={`Add ${name} to cart`}
                        className="absolute left-4 top-4 z-20 flex h-8 w-8 items-center justify-center rounded-[4px] bg-[#262626] transition-colors hover:bg-[#F26B0A]"
                    >
                        <CartIcon />
                    </button>

                    <Link
                        href={`/products/${id}`}
                        className="relative block h-full w-full"
                    >
                        <Image
                            src={
                                imageUrl ||
                                "/images/product-mouse.png"
                            }
                            alt={name}
                            fill
                            sizes="268px"
                            className="object-contain p-6"
                        />
                    </Link>
                </div>

                <div className="mt-[18px] flex h-[76px] flex-col gap-2">
                    <span className="w-fit rounded-[4px] bg-[#F26B0A] px-2 py-1 text-xs text-white">
                        {category}
                    </span>

                    <Link
                        href={`/products/${id}`}
                        className="text-sm text-white hover:text-[#F26B0A]"
                    >
                        {name}
                    </Link>

                    <div className="flex items-center gap-[10px]">
                        <span className="text-2xl font-semibold text-white">
                            ${price}
                        </span>

                        {oldPrice && (
                            <span className="text-sm text-gray-400 line-through">
                                ${oldPrice}
                            </span>
                        )}
                    </div>
                </div>
            </article>

            {notification && (
                <div
                    role="status"
                    className="fixed bottom-6 right-6 z-50 rounded-[6px] border border-[#F29145] bg-[#262626] px-5 py-4 text-sm text-white shadow-xl"
                >
                    <span className="font-medium text-[#F29145]">
                        {name}
                    </span>{" "}
                    added to cart.
                </div>
            )}
        </>
    );
}