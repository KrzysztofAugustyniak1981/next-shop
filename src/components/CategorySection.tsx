import Link from "next/link";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

import MouseIcon from "@/components/icons/MouseIcon";
import MonitorIcon from "@/components/icons/MonitorIcon";
import HeadphoneIcon from "@/components/icons/HeadphoneIcon";
import KeyboardIcon from "@/components/icons/KeyboardIcon";
import WebcamIcon from "@/components/icons/WebcamIcon";

const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

const categoryIcons = {
    Mouse: MouseIcon,
    Monitor: MonitorIcon,
    Headphone: HeadphoneIcon,
    Keyboard: KeyboardIcon,
    Webcam: WebcamIcon,
};

type CategoryName = keyof typeof categoryIcons;

export default async function CategorySection() {
    const categories = await prisma.category.findMany({
        orderBy: {
            id: "asc",
        },
    });

    return (
        <section className="flex flex-col gap-8">
            <h2 className="text-2xl font-medium text-white">
                Category
            </h2>

            <div className="scrollbar-hide flex gap-4 overflow-x-auto md:justify-between md:overflow-x-hidden">
                {categories.map((category) => {
                    const Icon =
                        categoryIcons[
                            category.name as CategoryName
                        ];

                    if (!Icon) {
                        return null;
                    }

                    return (
                        <Link
                            key={category.id}
                            href={`/products?category=${encodeURIComponent(
                                category.name
                            )}`}
                            className="flex h-[190px] w-[220px] shrink-0 flex-col items-center justify-center gap-6 rounded-[6px] border border-[#616674] bg-[#262626] p-3 transition-colors hover:border-[#F29145]"
                        >
                            <Icon />

                            <span className="text-white">
                                {category.name}
                            </span>
                        </Link>
                    );
                })}
            </div>
        </section>
    );
}