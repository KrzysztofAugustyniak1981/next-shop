"use client";

import { useState } from "react";

type ProductDescriptionProps = {
    description: string;
};

export default function ProductDescription({
    description,
}: ProductDescriptionProps) {
    const [expanded, setExpanded] = useState(false);

    const shouldShowButton = description.length > 80;

    return (
        <div className="mt-8">
            <p
                className={`text-sm leading-6 text-gray-300 ${
                    !expanded && shouldShowButton
                        ? "line-clamp-2"
                        : ""
                }`}
            >
                {description}
            </p>

            {shouldShowButton && (
                <button
                    type="button"
                    onClick={() =>
                        setExpanded((current) => !current)
                    }
                    className="mt-1 text-sm text-[#F26B0A] hover:text-orange-400"
                >
                    {expanded ? "View Less" : "View More"}
                </button>
            )}
        </div>
    );
}