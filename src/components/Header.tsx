"use client";

import Link from "next/link";
import Image from "next/image";
import CartIcon from "./icons/CartIcon";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";

export default function Header() {
    const { cartItems } = useCart();
    const { user } = useAuth();

    const cartCount = cartItems.reduce(
        (total, item) => total + item.quantity,
        0
    );

    return (
        <header className="w-full bg-[#1A1A1A] text-white">
            <div className="mx-auto flex max-w-[1440px] flex-col gap-6 px-4 py-6 md:gap-10 md:px-10 md:py-8">

                {/* Top row */}
                <div className="flex h-11 items-center justify-between">
                    <Link href="/" className="text-xl font-bold">
                        <span className="text-orange-500">Devstock</span>
                        <span className="text-white">Hub</span>
                    </Link>

                    <div className="flex items-center gap-6">
                        <Link
                            href="/cart"
                            aria-label="Cart"
                            className="relative"
                        >
                            <CartIcon />

                            {cartCount > 0 && (
                                <span className="absolute -right-3 -top-3 flex h-5 min-w-5 items-center justify-center rounded-full bg-orange-500 px-1 text-xs font-bold text-white">
                                    {cartCount}
                                </span>
                            )}
                        </Link>

                        <Link
                            href={user ? "/profile" : "/login"}
                            aria-label="Profile"
                        >
                            <Image
                                src="/images/avatar.svg"
                                alt="Profile"
                                width={40}
                                height={40}
                                className="rounded-full"
                            />
                        </Link>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex items-center gap-10 border-b border-[#2A2A2A] pb-8">
                    <Link
                        href="/"
                        className="text-sm text-orange-500"
                    >
                        Home
                    </Link>

                    <Link
                        href="/products"
                        className="text-sm text-gray-400 hover:text-orange-500"
                    >
                        Product
                    </Link>

                    <Link
                        href="/contact"
                        className="text-sm text-gray-400 hover:text-orange-500"
                    >
                        Contact
                    </Link>
                </nav>

            </div>
        </header>
    );
}