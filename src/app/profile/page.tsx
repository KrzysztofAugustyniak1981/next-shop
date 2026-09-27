import "dotenv/config";
import Image from "next/image";
import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import { verifySessionToken } from "@/lib/auth";
import LogoutButton from "@/components/LogoutButton";

const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

export default async function ProfilePage() {
    const cookieStore = await cookies();
    const session = cookieStore.get("session");

    if (!session) {
        redirect("/login");
    }

    let userId: number;

    try {
        const sessionData = await verifySessionToken(session.value);
        userId = Number(sessionData.userId);
    } catch {
        redirect("/login");
    }

    const user = await prisma.user.findUnique({
        where: {
            id: userId,
        },
        select: {
            firstName: true,
            email: true,
            orders: {
                orderBy: {
                    createdAt: "desc",
                },
                include: {
                    items: {
                        include: {
                            product: true,
                        },
                    },
                },
            },
        },
    });

    if (!user) {
        redirect("/login");
    }

    function formatDate(date: Date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        const hours = String(date.getHours()).padStart(2, "0");
        const minutes = String(date.getMinutes()).padStart(2, "0");

        return `${year}-${month}-${day} ${hours}:${minutes}`;
    }

    function createOrderNumber(orderId: number) {
        return `INV/${String(orderId).padStart(6, "0")}/TSR`;
    }

    return (
        <main className="min-h-[500px] bg-[#1A1A1A] text-white">
            <div className="mx-auto w-full max-w-[1440px] px-4 py-10 md:px-10">
                {/* Breadcrumb */}
                <div className="flex items-center gap-3 text-sm">
                    <Link
                        href="/"
                        className="text-[#9CA0AA] transition-colors hover:text-[#F26B0A]"
                    >
                        Home
                    </Link>

                    <span className="text-[#616674]">›</span>

                    <span className="text-white">Profile</span>
                </div>

                {/* Profile content */}
                <div className="mt-12 grid gap-8 lg:grid-cols-[300px_1fr] lg:gap-12">
                    {/* User card */}
                    <section className="h-fit rounded-[6px] border border-[#383B42] bg-[#262626] p-6">
                        <div className="flex items-center gap-5">
                            <div className="relative h-[64px] w-[64px] shrink-0 overflow-hidden rounded-full">
                                <Image
                                    src="/images/avatar.svg"
                                    alt="Profile"
                                    fill
                                    sizes="64px"
                                    className="object-cover"
                                />
                            </div>

                            <div className="min-w-0">
                                <p className="font-semibold text-white">
                                    {user.firstName}
                                </p>

                                <p className="mt-2 truncate text-sm text-[#B7BBC4]">
                                    {user.email}
                                </p>
                            </div>
                        </div>

                        <div className="my-6 border-t border-[#383B42]" />

                        <LogoutButton />
                    </section>

                    {/* Transactions */}
                    <section>
                        <div className="border-b border-[#383B42]">
                            <div className="mx-auto w-fit border-b-2 border-[#F26B0A] px-24 pb-4 text-sm text-[#F26B0A]">
                                Transaction
                            </div>
                        </div>

                        {user.orders.length === 0 ? (
                            <div className="mt-6 rounded-[6px] border border-[#383B42] bg-[#262626] p-8 text-center">
                                <p className="text-sm text-[#B7BBC4]">
                                    You don&apos;t have any transactions yet.
                                </p>
                            </div>
                        ) : (
                            <div className="mt-6 space-y-4">
                                {user.orders.map((order) => (
                                    <Link
                                        key={order.id}
                                        href={`/order-success/${order.id}`}
                                        className="block rounded-[6px] border border-[#383B42] bg-[#262626] p-5 transition-colors hover:border-[#F26B0A]"
                                    >
                                        <div className="flex gap-5">
                                            {/* Bag icon */}
                                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#3A2B20] text-[#F26B0A]">
                                                <svg
                                                    width="18"
                                                    height="18"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <path
                                                        d="M6 8H18L19 20H5L6 8Z"
                                                        stroke="currentColor"
                                                        strokeWidth="1.5"
                                                        strokeLinejoin="round"
                                                    />

                                                    <path
                                                        d="M9 9V6C9 4.34315 10.3431 3 12 3C13.6569 3 15 4.34315 15 6V9"
                                                        stroke="currentColor"
                                                        strokeWidth="1.5"
                                                        strokeLinecap="round"
                                                    />
                                                </svg>
                                            </div>

                                            <div className="min-w-0 flex-1">
                                                <p className="text-sm text-[#B7BBC4]">
                                                    {formatDate(order.createdAt)}
                                                </p>

                                                <p className="mt-3 text-sm text-white">
                                                    Your order nr{" "}
                                                    <span className="font-medium">
                                                        {createOrderNumber(order.id)}
                                                    </span>
                                                </p>

                                                {order.items.length > 0 && (
                                                    <ul className="mt-2 space-y-1 pl-5">
                                                        {order.items.map((item) => (
                                                            <li
                                                                key={item.id}
                                                                className="list-disc text-sm text-white marker:text-white"
                                                            >
                                                                {item.product.name}

                                                                {item.quantity > 1 && (
                                                                    <span className="ml-2 text-[#B7BBC4]">
                                                                        x{item.quantity}
                                                                    </span>
                                                                )}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                )}
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </section>
                </div>
            </div>
        </main>
    );
}