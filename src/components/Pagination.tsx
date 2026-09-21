import Link from "next/link";

type PaginationProps = {
    currentPage: number;
    totalPages: number;
    pageSize: number;
    sort: string;
    category?: string;
    minPrice?: number;
    maxPrice?: number;
};

export default function Pagination({
    currentPage,
    totalPages,
    pageSize,
    sort,
    category,
    minPrice,
    maxPrice,
}: PaginationProps) {
    function createPageUrl(page: number) {
        const params = new URLSearchParams();

        params.set("page", page.toString());
        params.set("show", pageSize.toString());
        params.set("sort", sort);

        if (category) {
            params.set("category", category);
        }

        if (minPrice !== undefined) {
            params.set("minPrice", minPrice.toString());
        }

        if (maxPrice !== undefined) {
            params.set("maxPrice", maxPrice.toString());
        }

        return `/products?${params.toString()}`;
    }

    const previousPage = Math.max(1, currentPage - 1);
    const nextPage = Math.min(totalPages, currentPage + 1);

    return (
        <div className="mt-12 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
                {Array.from({ length: totalPages }, (_, index) => {
                    const page = index + 1;
                    const isActive = currentPage === page;

                    return (
                        <Link
                            key={page}
                            href={createPageUrl(page)}
                            className={`flex h-10 min-w-10 items-center justify-center rounded-[4px] px-3 text-sm ${isActive
                                    ? "bg-[#F26B0A] text-white"
                                    : "text-gray-400 hover:text-white"
                                }`}
                        >
                            {page}
                        </Link>
                    );
                })}
            </div>

            <div className="flex items-center justify-between gap-4 sm:justify-start">
                <Link
                    href={createPageUrl(previousPage)}
                    className={`flex h-10 items-center gap-3 rounded-[4px] border border-[#616674] px-4 text-sm ${currentPage === 1
                            ? "pointer-events-none opacity-40"
                            : "text-white"
                        }`}
                >
                    <span>←</span>
                    <span>Previous</span>
                </Link>

                <Link
                    href={createPageUrl(nextPage)}
                    className={`flex h-10 items-center gap-3 rounded-[4px] border border-[#616674] px-4 text-sm ${currentPage === totalPages
                            ? "pointer-events-none opacity-40"
                            : "text-white"
                        }`}
                >
                    <span>Next</span>
                    <span>→</span>
                </Link>
            </div>
        </div>
    );
}