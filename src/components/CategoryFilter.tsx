"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function CategoryFilter() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const currentCategory = searchParams.get("category") || "All";

    const [isOpen, setIsOpen] = useState(true);

    const [showMore, setShowMore] = useState(
        currentCategory === "Webcam"
    );

    const categories = [
        "All",
        "Mouse",
        "Headphone",
        "Keyboard",
        "Monitor",
    ];

    const visibleCategories = showMore
        ? [...categories, "Webcam"]
        : categories;

    function handleCategoryChange(category: string) {
        const params = new URLSearchParams(searchParams.toString());

        if (category === "All") {
            params.delete("category");
        } else {
            params.set("category", category);
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
                    Category
                </span>

                <span className="text-white">
                    {isOpen ? "⌃" : "⌄"}
                </span>
            </button>

            {isOpen && (
                <>
                    <div className="flex flex-col gap-3">
                        {visibleCategories.map((category) => (
                            <label
                                key={category}
                                className="flex cursor-pointer items-center gap-3 text-sm text-white"
                            >
                                <input
                                    type="checkbox"
                                    checked={currentCategory === category}
                                    onChange={() =>
                                        handleCategoryChange(category)
                                    }
                                    className="h-5 w-5 cursor-pointer accent-orange-500"
                                />

                                <span>{category}</span>
                            </label>
                        ))}
                    </div>

                    <button
                        type="button"
                        onClick={() =>
                            setShowMore((previous) => !previous)
                        }
                        className="flex items-center gap-4 text-left text-sm text-white"
                    >
                        <span>
                            {showMore ? "Show Less" : "Load More"}
                        </span>

                        <span>
                            {showMore ? "−" : "+"}
                        </span>
                    </button>
                </>
            )}
        </div>
    );
}