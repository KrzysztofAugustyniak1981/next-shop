"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";

type UserAddress = {
    firstName: string;
    address: string | null;
    country: string | null;
    province: string | null;
    city: string | null;
    postalCode: string | null;
};

export default function CheckoutPage() {
    const router = useRouter();

    const {
        cartItems,
        updateQuantity,
        clearCart,
    } = useCart();

    const [productProtection, setProductProtection] =
        useState(false);

    const [addressMode, setAddressMode] = useState<
        "existing" | "new"
    >("existing");

    const [savedAddress, setSavedAddress] =
        useState<UserAddress | null>(null);

    const [address, setAddress] = useState("");
    const [country, setCountry] = useState("");
    const [province, setProvince] = useState("");
    const [city, setCity] = useState("");
    const [postalCode, setPostalCode] = useState("");

    const [addressMessage, setAddressMessage] =
        useState("");

    useEffect(() => {
        const loadAddress = async () => {
            const response = await fetch(
                "/api/auth/address"
            );

            if (!response.ok) {
                return;
            }

            const data = await response.json();

            setSavedAddress(data.address);

            if (!data.address.address) {
                setAddressMode("new");
            }
        };

        loadAddress();
    }, []);

    const productTotal = cartItems.reduce(
        (sum, item) =>
            sum + item.price * item.quantity,
        0
    );

    const protectionPrice =
        productProtection ? 1 : 0;

    const grandTotal =
        productTotal + protectionPrice;

    const handleSaveAddress = async () => {
        setAddressMessage("");

        const response = await fetch(
            "/api/auth/address",
            {
                method: "PUT",
                headers: {
                    "Content-Type":
                        "application/json",
                },
                body: JSON.stringify({
                    address,
                    country,
                    province,
                    city,
                    postalCode,
                }),
            }
        );

        const data = await response.json();

        if (!response.ok) {
            setAddressMessage(data.message);
            return;
        }

        setSavedAddress(data.address);

        setAddressMessage(
            "Address saved successfully"
        );

        setAddressMode("existing");
    };

    const handlePlaceOrder = async () => {
        if (cartItems.length === 0) {
            return;
        }

        if (!savedAddress?.address) {
            setAddressMessage(
                "Please add your address before placing the order"
            );

            setAddressMode("new");
            return;
        }

        const response = await fetch("/api/orders", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                items: cartItems.map((item) => ({
                    productId: item.id,
                    quantity: item.quantity,
                })),
                productProtection,
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            alert(data.message);
            return;
        }

        clearCart();

        router.push(
            `/order-success/${data.orderId}`
        );
    };

    return (
        <main className="min-h-screen bg-[#1A1A1A] text-white">
            <div className="mx-auto max-w-[1440px] px-4 py-10 md:px-10">
                <div className="mb-10 flex items-center gap-3 text-xs text-gray-400">
                    <span>Home</span>
                    <span>›</span>
                    <span>Product</span>
                    <span>›</span>
                    <span className="text-white">
                        Checkout
                    </span>
                </div>

                <div className="flex flex-col gap-12 lg:flex-row lg:items-start">
                    <div className="flex min-w-0 flex-1 flex-col gap-10">
                        <section>
                            <h1 className="mb-4 text-lg font-medium">
                                Your Order
                            </h1>

                            <div className="overflow-hidden rounded-[6px] border border-[#383B42] bg-[#262626]">
                                {cartItems.map((item) => (
                                    <div
                                        key={item.id}
                                        className="border-b border-[#383B42] p-6"
                                    >
                                        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
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
                                                <h2 className="font-medium">
                                                    {item.name}
                                                </h2>

                                                <span className="mt-3 inline-block rounded-[4px] bg-[#F26B0A] px-3 py-1 text-xs">
                                                    Product
                                                </span>

                                                <p className="mt-4 text-xl">
                                                    $
                                                    {item.price.toFixed(
                                                        2
                                                    )}
                                                </p>
                                            </div>

                                            <button
                                                type="button"
                                                className="text-sm text-[#F29145]"
                                            >
                                                Write Note
                                            </button>

                                            <div className="flex h-10 items-center rounded-[6px] border border-[#616674]">
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        updateQuantity(
                                                            item.id,
                                                            item.quantity -
                                                                1
                                                        )
                                                    }
                                                    className="h-full px-4"
                                                >
                                                    −
                                                </button>

                                                <span className="min-w-8 text-center text-sm">
                                                    {
                                                        item.quantity
                                                    }
                                                </span>

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        updateQuantity(
                                                            item.id,
                                                            item.quantity +
                                                                1
                                                        )
                                                    }
                                                    className="h-full px-4"
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                <label className="flex cursor-pointer items-start justify-between gap-6 p-6">
                                    <div className="flex items-start gap-3">
                                        <input
                                            type="checkbox"
                                            checked={
                                                productProtection
                                            }
                                            onChange={(event) =>
                                                setProductProtection(
                                                    event.target
                                                        .checked
                                                )
                                            }
                                            className="mt-1 h-5 w-5 accent-[#F29145]"
                                        />

                                        <div>
                                            <p className="text-sm">
                                                Product Protection
                                            </p>

                                            <p className="mt-2 text-xs text-gray-400">
                                                The claim process
                                                is easy and instant,
                                                valid for 6 months
                                            </p>
                                        </div>
                                    </div>

                                    <span className="text-sm">
                                        $1
                                    </span>
                                </label>
                            </div>
                        </section>

                        <section>
                            <h2 className="mb-4 text-lg font-medium">
                                Address
                            </h2>

                            <div className="rounded-[6px] border border-[#383B42] bg-[#262626] p-6">
                                <div className="grid grid-cols-2 border-b border-[#383B42]">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setAddressMode(
                                                "existing"
                                            )
                                        }
                                        className={`pb-4 text-sm ${
                                            addressMode ===
                                            "existing"
                                                ? "border-b border-[#F29145] text-[#F29145]"
                                                : "text-gray-400"
                                        }`}
                                    >
                                        Existing Address
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setAddressMode(
                                                "new"
                                            )
                                        }
                                        className={`pb-4 text-sm ${
                                            addressMode ===
                                            "new"
                                                ? "border-b border-[#F29145] text-[#F29145]"
                                                : "text-gray-400"
                                        }`}
                                    >
                                        New Address
                                    </button>
                                </div>

                                {addressMode ===
                                "existing" ? (
                                    <div className="mt-6">
                                        {savedAddress?.address ? (
                                            <>
                                                <div className="flex items-center gap-3">
                                                    <span className="text-xs text-gray-300">
                                                        Address
                                                    </span>

                                                    <span className="rounded-[4px] bg-[#F26B0A] px-3 py-1 text-xs">
                                                        Main Address
                                                    </span>
                                                </div>

                                                <p className="mt-4 text-sm">
                                                    {
                                                        savedAddress.address
                                                    }
                                                </p>

                                                <div className="mt-8 grid grid-cols-2 gap-6 md:grid-cols-4">
                                                    <div>
                                                        <p className="text-xs text-gray-400">
                                                            Country
                                                        </p>

                                                        <p className="mt-2 text-sm">
                                                            {
                                                                savedAddress.country
                                                            }
                                                        </p>
                                                    </div>

                                                    <div>
                                                        <p className="text-xs text-gray-400">
                                                            Province
                                                        </p>

                                                        <p className="mt-2 text-sm">
                                                            {
                                                                savedAddress.province
                                                            }
                                                        </p>
                                                    </div>

                                                    <div>
                                                        <p className="text-xs text-gray-400">
                                                            City
                                                        </p>

                                                        <p className="mt-2 text-sm">
                                                            {
                                                                savedAddress.city
                                                            }
                                                        </p>
                                                    </div>

                                                    <div>
                                                        <p className="text-xs text-gray-400">
                                                            Postal Code
                                                        </p>

                                                        <p className="mt-2 text-sm">
                                                            {
                                                                savedAddress.postalCode
                                                            }
                                                        </p>
                                                    </div>
                                                </div>
                                            </>
                                        ) : (
                                            <div>
                                                <p className="text-sm text-gray-400">
                                                    You do not
                                                    have a saved
                                                    address yet.
                                                </p>

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setAddressMode(
                                                            "new"
                                                        )
                                                    }
                                                    className="mt-4 text-sm text-[#F29145]"
                                                >
                                                    Add Address
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="mt-6">
                                        <div className="grid gap-4 md:grid-cols-2">
                                            <input
                                                type="text"
                                                value={
                                                    country
                                                }
                                                onChange={(
                                                    event
                                                ) =>
                                                    setCountry(
                                                        event
                                                            .target
                                                            .value
                                                    )
                                                }
                                                placeholder="Country"
                                                className="rounded-[4px] border border-[#616674] bg-transparent px-4 py-3 text-sm outline-none focus:border-[#F29145]"
                                            />

                                            <input
                                                type="text"
                                                value={
                                                    province
                                                }
                                                onChange={(
                                                    event
                                                ) =>
                                                    setProvince(
                                                        event
                                                            .target
                                                            .value
                                                    )
                                                }
                                                placeholder="Province"
                                                className="rounded-[4px] border border-[#616674] bg-transparent px-4 py-3 text-sm outline-none focus:border-[#F29145]"
                                            />

                                            <input
                                                type="text"
                                                value={city}
                                                onChange={(
                                                    event
                                                ) =>
                                                    setCity(
                                                        event
                                                            .target
                                                            .value
                                                    )
                                                }
                                                placeholder="City"
                                                className="rounded-[4px] border border-[#616674] bg-transparent px-4 py-3 text-sm outline-none focus:border-[#F29145]"
                                            />

                                            <input
                                                type="text"
                                                value={
                                                    postalCode
                                                }
                                                onChange={(
                                                    event
                                                ) =>
                                                    setPostalCode(
                                                        event
                                                            .target
                                                            .value
                                                    )
                                                }
                                                placeholder="Postal Code"
                                                className="rounded-[4px] border border-[#616674] bg-transparent px-4 py-3 text-sm outline-none focus:border-[#F29145]"
                                            />
                                        </div>

                                        <textarea
                                            value={address}
                                            onChange={(event) =>
                                                setAddress(
                                                    event.target
                                                        .value
                                                )
                                            }
                                            placeholder="Input Complete Address"
                                            rows={4}
                                            className="mt-4 w-full resize-none rounded-[4px] border border-[#616674] bg-transparent px-4 py-3 text-sm outline-none focus:border-[#F29145]"
                                        />

                                        {addressMessage && (
                                            <p className="mt-4 text-sm text-[#F29145]">
                                                {
                                                    addressMessage
                                                }
                                            </p>
                                        )}

                                        <button
                                            type="button"
                                            onClick={
                                                handleSaveAddress
                                            }
                                            className="mt-6 rounded-[4px] bg-[#F29145] px-6 py-3 text-sm font-medium text-[#1A1A1A]"
                                        >
                                            Save Address
                                        </button>
                                    </div>
                                )}
                            </div>
                        </section>

                        <section>
                            <h2 className="mb-4 text-lg font-medium">
                                Shipping
                            </h2>

                            <div className="flex min-h-[76px] items-center rounded-[6px] border border-[#383B42] bg-[#262626] px-6">
                                <span className="mr-4 text-green-400">
                                    ♡
                                </span>

                                <span className="text-sm">
                                    NexusHub Courier
                                </span>
                            </div>
                        </section>

                        <section>
                            <h2 className="mb-4 text-lg font-medium">
                                Payment Method
                            </h2>

                            <div className="flex min-h-[76px] items-center rounded-[6px] border border-[#383B42] bg-[#262626] px-6">
                                <span className="mr-4 rounded bg-white px-2 py-1 text-xs font-semibold text-black">
                                    Pay
                                </span>

                                <span className="text-sm">
                                    Apple Pay
                                </span>
                            </div>
                        </section>
                    </div>

                    <aside className="w-full rounded-[6px] border border-[#383B42] bg-[#262626] p-6 lg:w-[423px] lg:shrink-0">
                        <h2 className="text-sm font-medium">
                            Total Product
                        </h2>

                        <div className="mt-6 space-y-4 border-b border-[#383B42] pb-6 text-sm">
                            <div className="flex justify-between gap-4">
                                <span className="text-gray-300">
                                    Total Product Price
                                </span>

                                <span>
                                    $
                                    {productTotal.toFixed(
                                        2
                                    )}
                                </span>
                            </div>

                            <div className="flex justify-between gap-4">
                                <span className="text-gray-300">
                                    Total Product Protection
                                </span>

                                <span>
                                    $
                                    {protectionPrice.toFixed(
                                        2
                                    )}
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center justify-between py-6">
                            <span className="text-sm">
                                Grand total
                            </span>

                            <span className="text-2xl font-medium">
                                ${grandTotal.toFixed(2)}
                            </span>
                        </div>

                        <button
                            type="button"
                            onClick={handlePlaceOrder}
                            disabled={
                                cartItems.length === 0
                            }
                            className="w-full rounded-[4px] bg-[#F29145] px-6 py-4 text-sm font-medium text-[#1A1A1A] disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            Pay Now
                        </button>
                    </aside>
                </div>
            </div>
        </main>
    );
}