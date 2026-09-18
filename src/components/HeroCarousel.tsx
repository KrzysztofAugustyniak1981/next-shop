import Image from "next/image";

export default function HeroCarousel() {
    return (
        <section className="w-full">
            <div className="relative h-[360px] w-full overflow-hidden rounded-[6px] border border-[#34363B] bg-[#222327] xl:h-[440px]">
                <div className="absolute left-10 top-1/2 z-10 flex -translate-y-1/2 flex-col items-start gap-6 md:left-[120px]">
                    <div className="flex flex-col gap-4">
                        <h1 className="text-[32px] font-medium text-white">
                            Mouse
                        </h1>

                        <p className="max-w-[433px] text-sm leading-6 text-gray-300">
                            Explore our diverse selection of electronic mice for sale,
                            featuring cutting-edge technology, ergonomic designs,
                            and unbeatable prices. Shop now!
                        </p>
                    </div>

                    <button
                        type="button"
                        className="flex h-[54px] items-center gap-[14px] rounded-[6px] border border-[#F29145] px-5 text-sm text-[#F29145]"
                    >
                        <span>Explore Category</span>
                        <span>→</span>
                    </button>
                </div>

                <Image
                    src="/images/mouse-hero.png"
                    alt="Gaming mouse"
                    width={443}
                    height={853}
                    className="absolute right-[-145px] top-[-100px] h-[400px] w-auto rotate-[-34.55deg] md:right-[150px] md:top-[-160px] md:h-[650px]"
                />

                <button
                    type="button"
                    aria-label="Previous slide"
                    className="absolute left-0 top-1/2 z-20 flex h-[56px] w-[32px] md:h-[74px] md:w-[42px] -translate-y-1/2 items-center justify-center rounded-r-[6px] bg-[#F29145] text-2xl text-[#222327]"
                >
                    ‹
                </button>

                <button
                    type="button"
                    aria-label="Next slide"
                    className="absolute right-0 top-1/2 z-20 flex h-[56px] w-[32px] md:h-[74px] md:w-[42px] -translate-y-1/2 items-center justify-center rounded-l-[6px] bg-[#F29145] text-2xl text-[#222327]"
                >
                    ›
                </button>

            </div>
            <div className="mt-6 flex justify-center gap-3">
                <span className="h-3 w-3 rounded-full bg-[#F29145]" />
                <span className="h-3 w-3 rounded-full bg-[#383B42]" />
                <span className="h-3 w-3 rounded-full bg-[#383B42]" />
                <span className="h-3 w-3 rounded-full bg-[#383B42]" />
                <span className="h-3 w-3 rounded-full bg-[#383B42]" />
            </div>
        </section>
    );
}