"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";
import CartIcon from "@/components/icons/CartIcon";

type ProductDetailCardProps = {
    id: number;
    name: string;
    price: number;
    imageUrl: string | null;
    stock: number;
};

export default function ProductDetailCard({
    id,
    name,
    price,
    imageUrl,
    stock,
}: ProductDetailCardProps) {
    const [quantity, setQuantity] = useState(1);

    const { addToCart } = useCart();

    function handleAddToCart() {
        addToCart({
            id,
            name,
            price,
            imageUrl,
            quantity,
            stock,
        });
    }

    return (
        <div className="flex w-full flex-col gap-8 rounded-[6px] border border-[#383B42] bg-[#262626] p-6 lg:w-[423px] lg:shrink-0">
            <div>
                <p className="text-sm text-gray-400">
                    Colors
                </p>

                <div className="mt-3 flex gap-3">
                    <button
                        type="button"
                        className="flex h-12 w-12 items-center justify-center rounded-[4px] bg-white text-black"
                    >
                        ✓
                    </button>

                    <button
                        type="button"
                        className="h-12 w-12 rounded-[4px] border border-[#383B42] bg-[#1A1A1A]"
                    />
                </div>
            </div>

            <div>
                <p className="text-sm text-gray-400">
                    Quantity
                </p>

                <div className="mt-3 flex items-center gap-4">
                    <div className="flex h-[52px] items-center rounded-[6px] border border-[#616674]">
                        <button
                            type="button"
                            onClick={() =>
                                setQuantity((previous) =>
                                    Math.max(1, previous - 1)
                                )
                            }
                            className="h-full px-4 text-lg"
                        >
                            −
                        </button>

                        <span className="min-w-8 text-center text-sm">
                            {quantity}
                        </span>

                        <button
                            type="button"
                            onClick={() =>
                                setQuantity((previous) =>
                                    Math.min(stock, previous + 1)
                                )
                            }
                            className="h-full px-4 text-lg"
                        >
                            +
                        </button>
                    </div>

                    <span className="text-sm text-white">
                        Stock : {stock}
                    </span>
                </div>
            </div>

            <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">
                    Subtotal
                </span>

                <span className="text-2xl font-semibold text-white">
                    ${(price * quantity).toFixed(2)}
                </span>
            </div>

            <button
                type="button"
                onClick={handleAddToCart}
                className="flex h-[52px] w-full items-center justify-center gap-3 rounded-[4px] border border-[#F26B0A] text-sm text-[#F26B0A] transition-colors hover:bg-[#F26B0A] hover:text-white"
            >
                <span>Add to Cart</span>
                <CartIcon />
            </button>
        </div>
    );
}