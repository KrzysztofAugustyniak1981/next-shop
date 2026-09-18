import BrandCard from "@/components/BrandCard";

export default function BrandSection() {
    return (
        <section className="w-full">
            <div className="mb-8 flex items-center justify-between">
                <h2 className="text-2xl font-medium text-white">
                    Brand
                </h2>

                <a
                    href="/products"
                    className="text-sm text-orange-500 hover:text-orange-400"
                >
                    See All →
                </a>
            </div>

            <div className="scrollbar-hide flex gap-8 overflow-x-auto overflow-y-hidden md:overflow-x-hidden">
                <BrandCard
                    name="ROG"
                    image="/brands/rog.svg"
                    width={78.04}
                    height={46}
                />

                <BrandCard
                    name="Logitech"
                    image="/brands/logitech.svg"
                    width={46}
                    height={46}
                />

                <BrandCard
                    name="JBL"
                    image="/brands/jbl.svg"
                    width={82.88}
                    height={46}
                />

                <BrandCard
                    name="AOC"
                    image="/brands/aoc.svg"
                    width={136.8}
                    height={46}
                />

                <BrandCard
                    name="Razer"
                    image="/brands/razer.svg"
                    width={45.53}
                    height={46}
                />

                <BrandCard
                    name="Rexus"
                    image="/brands/rexus.svg"
                    width={46}
                    height={46}
                />
            </div>
        </section>
    );
}