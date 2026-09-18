import Image from "next/image";
import CartIcon from "@/components/icons/CartIcon";

type ProductCardProps = {
    name: string;
    category: string;
    price: string;
    oldPrice?: string;
    imageUrl?: string | null;
};

export default function ProductCard({
    name,
    category,
    price,
    oldPrice,
    imageUrl,
}: ProductCardProps) {
    return (
        <article className="flex h-[386px] w-[300px] shrink-0 flex-col rounded-[6px] border border-[#383B42] bg-[#262626] px-4 pb-5 pt-4">
            
            <div className="relative h-[204px] w-[268px] overflow-hidden rounded-[4px] bg-white">
                
                <div className="absolute left-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-[4px] bg-[#262626]">
                    <CartIcon />
                </div>

                <Image
                    src={imageUrl || "/images/product-mouse.png"}
                    alt={name}
                    fill
                    sizes="268px"
                    className="object-contain p-6"
                />
            </div>

            <div className="mt-[18px] flex h-[76px] flex-col gap-2">
                <span className="w-fit rounded-[4px] bg-[#F26B0A] px-2 py-1 text-xs text-white">
                    {category}
                </span>

                <p className="text-sm text-white">
                    {name}
                </p>

                <div className="flex items-center gap-[10px]">
                    <span className="text-2xl font-semibold text-white">
                        ${price}
                    </span>

                    {oldPrice && (
                        <span className="text-sm text-gray-400 line-through">
                            ${oldPrice}
                        </span>
                    )}
                </div>
            </div>
        </article>
    );
}