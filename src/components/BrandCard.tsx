import Image from "next/image";

type BrandCardProps = {
    name: string;
    image: string;
    width: number;
    height: number;
};

export default function BrandCard({ name, image, width, height }: BrandCardProps) {
    return (
        <div className="flex h-[190px] w-[220px] shrink-0 flex-col items-center justify-center gap-7 rounded-[6px] border border-[#616674] bg-[#262626] p-3">
            <Image
                src={image}
                alt={`${name} logo`}
                width={width}
                height={height}
                className="object-contain"
            />

            <p className="text-base text-white">
                {name}
            </p>
        </div>
    );
}