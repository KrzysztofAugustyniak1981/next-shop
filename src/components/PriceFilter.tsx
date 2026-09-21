"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function PriceFilter() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [isOpen, setIsOpen] = useState(true);

    const [minPrice, setMinPrice] = useState(
        searchParams.get("minPrice") || ""
    );

    const [maxPrice, setMaxPrice] = useState(
        searchParams.get("maxPrice") || ""
    );

    function applyPriceFilter() {
        const params = new URLSearchParams(searchParams.toString());

        if (minPrice) {
            params.set("minPrice", minPrice);
        } else {
            params.delete("minPrice");
        }

        if (maxPrice) {
            params.set("maxPrice", maxPrice);
        } else {
            params.delete("maxPrice");
        }

        params.set("page", "1");

        router.push(`/products?${params.toString()}`);
    }

    return (
        <div className="flex flex-col gap-4">
            <button
                type="button"
                onClick={() => setIsOpen((previous) => !previous)}
                className="flex w-full items-center justify-between"
            >
                <span className="text-sm font-semibold text-white">
                    price
                </span>

                <span className="text-white">
                    {isOpen ? "⌃" : "⌄"}
                </span>
            </button>

            {isOpen && (
                <div className="flex flex-col gap-3">
                    <div className="flex h-[52px] overflow-hidden rounded-[6px] border border-[#616674]">
                        <input
                            type="text"
                            inputMode="decimal"
                            value={minPrice}
                            onChange={(event) =>
                                setMinPrice(event.target.value)
                            }
                            onBlur={applyPriceFilter}
                            onKeyDown={(event) => {
                                if (event.key === "Enter") {
                                    applyPriceFilter();
                                }
                            }}
                            placeholder="$ 10.00"
                            className="min-w-0 flex-1 bg-[#262626] px-4 text-sm text-white outline-none placeholder:text-gray-400"
                        />

                        <div className="flex w-[90px] items-center justify-between border-l border-[#616674] bg-[#262626] px-3 text-sm">
                            <span>USD</span>
                            <span>⌄</span>
                        </div>
                    </div>

                    <div className="flex h-[52px] overflow-hidden rounded-[6px] border border-[#616674]">
                        <input
                            type="text"
                            inputMode="decimal"
                            value={maxPrice}
                            onChange={(event) =>
                                setMaxPrice(event.target.value)
                            }
                            onBlur={applyPriceFilter}
                            onKeyDown={(event) => {
                                if (event.key === "Enter") {
                                    applyPriceFilter();
                                }
                            }}
                            placeholder="$ Max Price"
                            className="min-w-0 flex-1 bg-[#262626] px-4 text-sm text-white outline-none placeholder:text-gray-400"
                        />

                        <div className="flex w-[90px] items-center justify-between border-l border-[#616674] bg-[#262626] px-3 text-sm">
                            <span>USD</span>
                            <span>⌄</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}