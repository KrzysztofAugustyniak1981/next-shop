"use client";

import { useRouter, useSearchParams } from "next/navigation";

export default function ProductToolbar() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const currentShow = searchParams.get("show") || "9";
    const currentSort = searchParams.get("sort") || "latest";

    function handleShowChange(value: string) {
        const params = new URLSearchParams(searchParams.toString());

        params.set("show", value);
        params.set("page", "1");

        router.push(`/products?${params.toString()}`);
    }

    function handleSortChange(value: string) {
        const params = new URLSearchParams(searchParams.toString());

        params.set("sort", value);
        params.set("page", "1");

        router.push(`/products?${params.toString()}`);
    }

    return (
        <div className="flex flex-wrap items-center gap-x-12 gap-y-4">
            <div className="flex items-center gap-4">
                <span className="text-sm font-semibold text-white">
                    Sort by
                </span>

                <select
                    value={currentSort}
                    onChange={(event) => handleSortChange(event.target.value)}
                    className="h-[44px] rounded-[6px] border border-[#616674] bg-[#262626] px-4 text-sm text-white outline-none"
                >
                    <option value="latest">Latest</option>
                    <option value="price-low">Price: Low</option>
                    <option value="price-high">Price: High</option>
                </select>
            </div>

            <div className="flex items-center gap-4">
                <span className="text-sm font-semibold text-white">
                    Show
                </span>

                <select
                    value={currentShow}
                    onChange={(event) => handleShowChange(event.target.value)}
                    className="h-[44px] rounded-[6px] border border-[#616674] bg-[#262626] px-4 text-sm text-white outline-none"
                >
                    <option value="9">9</option>
                    <option value="12">12</option>
                    <option value="15">15</option>
                </select>
            </div>
        </div>
    );
}