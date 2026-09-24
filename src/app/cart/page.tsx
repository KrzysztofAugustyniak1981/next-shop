"use client";

import Image from "next/image";
import { useCart } from "@/context/CartContext";
import Link from "next/link";

export default function CartPage() {
    const {
        cartItems,
        updateQuantity,
        removeFromCart,
        clearCart,
    } = useCart();

    const cartTotal = cartItems.reduce(
        (total, item) => total + item.price * item.quantity,
        0
    );

    return (
        <main className="min-h-screen bg-[#1A1A1A] text-white">
            <div className="mx-auto max-w-[1440px] px-4 py-10 md:px-10">
                <h1 className="text-2xl font-semibold">
                    Shopping Cart
                </h1>

                <div className="mt-8">
                    {cartItems.length === 0 ? (
                        <div className="rounded-[6px] border border-[#383B42] bg-[#262626] p-8 text-center">
                            <p className="text-lg font-semibold text-white">
                                Your cart is empty
                            </p>

                            <p className="mt-2 text-sm text-gray-400">
                                Add some products to your cart.
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {cartItems.map((item) => (
                                <div
                                    key={item.id}
                                    className="rounded-[6px] border border-[#383B42] bg-[#262626] p-4"
                                >
                                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                                        <div className="relative h-[100px] w-[100px] shrink-0 overflow-hidden rounded-[4px] bg-white">
                                            <Image
                                                src={
                                                    item.imageUrl ||
                                                    "/images/product-mouse.png"
                                                }
                                                alt={item.name}
                                                fill
                                                sizes="100px"
                                                className="object-contain p-2"
                                            />
                                        </div>

                                        <div className="flex-1">
                                            <h2 className="font-semibold">
                                                {item.name}
                                            </h2>

                                            <p className="mt-2 text-sm text-gray-400">
                                                Price: ${item.price.toFixed(2)}
                                            </p>

                                            <div className="mt-4 flex flex-wrap items-center gap-4">
                                                <span className="text-sm text-gray-400">
                                                    Quantity:
                                                </span>

                                                <div className="flex h-10 items-center rounded-[6px] border border-[#616674]">
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            updateQuantity(
                                                                item.id,
                                                                item.quantity - 1
                                                            )
                                                        }
                                                        className="h-full px-4"
                                                    >
                                                        −
                                                    </button>

                                                    <span className="min-w-8 text-center text-sm">
                                                        {item.quantity}
                                                    </span>

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            updateQuantity(
                                                                item.id,
                                                                item.quantity + 1
                                                            )
                                                        }
                                                        className="h-full px-4"
                                                    >
                                                        +
                                                    </button>
                                                </div>

                                                <span className="text-sm text-gray-400">
                                                    Stock: {item.stock}
                                                </span>
                                            </div>

                                            <p className="mt-4 text-sm font-semibold">
                                                Subtotal: $
                                                {(
                                                    item.price * item.quantity
                                                ).toFixed(2)}
                                            </p>

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    removeFromCart(item.id)
                                                }
                                                className="mt-3 text-sm text-[#F26B0A] hover:underline"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {cartItems.length > 0 && (
                        <div className="mt-8 border-t border-[#383B42] pt-6">
                            <div className="flex items-center justify-between">
                                <span className="text-lg font-semibold">
                                    Total
                                </span>

                                <span className="text-2xl font-semibold text-[#F26B0A]">
                                    ${cartTotal.toFixed(2)}
                                </span>
                            </div>

                            <button
                                type="button"
                                onClick={clearCart}
                                className="mt-6 rounded-[4px] border border-[#F26B0A] px-6 py-3 text-sm text-[#F26B0A] transition-colors hover:bg-[#F26B0A] hover:text-white"
                            >
                                Clear Cart
                            </button>
                            <Link
                                href="/checkout"
                                className="mt-4 block w-full rounded-[6px] bg-[#F29145] px-6 py-4 text-center text-sm font-semibold text-[#1A1A1A]"
                            >
                                Proceed to Checkout
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}