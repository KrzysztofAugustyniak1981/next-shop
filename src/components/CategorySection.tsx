import MouseIcon from "@/components/icons/MouseIcon";
import MonitorIcon from "@/components/icons/MonitorIcon";
import HeadphoneIcon from "@/components/icons/HeadphoneIcon";
import KeyboardIcon from "@/components/icons/KeyboardIcon";
import WebcamIcon from "@/components/icons/WebcamIcon";


const categories = [
    {
        name: "Mouse",
        icon: MouseIcon,
    },
    {
        name: "Monitor",
        icon: MonitorIcon,
    },
    {
        name: "Headphone",
        icon: HeadphoneIcon,
    },
    {
        name: "Keyboard",
        icon: KeyboardIcon,
    },
    {
        name: "Webcam",
        icon: WebcamIcon,
    },
];

export default function CategorySection() {
    return (
        <section className="flex flex-col gap-8">
            <h2 className="text-2xl font-medium text-white">
                Category
            </h2>

            <div className="flex justify-between">
                {categories.map((category) => {
                    const Icon = category.icon;

                    return (
                        <div
                            key={category.name}
                            className="flex h-[190px] w-[220px] flex-col items-center justify-center gap-6 rounded-[6px] border border-[#616674] bg-[#262626] p-3"
                        >
                            {Icon && <Icon />}

                            <span className="text-white">
                                {category.name}
                            </span>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}