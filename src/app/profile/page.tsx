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
            id: true,
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

    return (
        <main className="min-h-screen bg-[#1A1A1A] text-white">
            <div className="mx-auto max-w-[1440px] px-4 py-10 md:px-10">
                <div className="mb-10 flex items-center gap-2 text-sm">
                    <Link
                        href="/"
                        className="text-gray-500 transition hover:text-orange-500"
                    >
                        Home
                    </Link>

                    <span className="text-gray-600">›</span>
                    <span className="text-gray-300">Profile</span>
                </div>

                <div className="grid gap-8 lg:grid-cols-[320px_1fr]">
                    <aside className="h-fit rounded-[6px] border border-[#383B42] bg-[#262626] p-6">
                        <div className="flex flex-col items-center text-center">
                            <Image
                                src="/images/avatar.svg"
                                alt="Profile"
                                width={80}
                                height={80}
                                className="rounded-full"
                            />

                            <h1 className="mt-5 text-lg font-semibold">
                                {user.firstName}
                            </h1>

                            <p className="mt-2 text-sm text-gray-400">
                                {user.email}
                            </p>
                        </div>

                        <div className="my-6 border-t border-[#383B42]" />

                        <LogoutButton />
                    </aside>

                    <section className="min-w-0">
                        <div className="mb-8 border-b border-[#383B42]">
                            <div className="mx-auto w-fit border-b-2 border-[#F26B0A] px-8 pb-4">
                                <h2 className="text-sm font-medium text-[#F26B0A]">
                                    Transaction
                                </h2>
                            </div>
                        </div>

                        {user.orders.length === 0 ? (
                            <div className="rounded-[6px] border border-[#383B42] bg-[#262626] p-8 text-center">
                                <p className="text-gray-400">
                                    You don&apos;t have any orders yet.
                                </p>

                                <Link
                                    href="/products"
                                    className="mt-5 inline-block rounded-[4px] bg-[#F29145] px-6 py-3 text-sm font-semibold text-[#1A1A1A]"
                                >
                                    Start Shopping
                                </Link>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {user.orders.map((order) => {
                                    const formattedDate =
                                        order.createdAt.toLocaleDateString(
                                            "en-CA"
                                        );

                                    const formattedTime =
                                        order.createdAt.toLocaleTimeString(
                                            "en-GB",
                                            {
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            }
                                        );

                                    return (
                                        <Link
                                            key={order.id}
                                            href={`/order-success/${order.id}`}
                                            className="block rounded-[6px] border border-[#383B42] bg-[#262626] p-5 transition hover:border-[#F26B0A]"
                                        >
                                            <div className="flex gap-4">
                                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#3A2B20] text-xl text-[#F26B0A]">
                                                    🛍
                                                </div>

                                                <div className="min-w-0 flex-1">
                                                    <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-start">
                                                        <div>
                                                            <p className="text-xs text-gray-400">
                                                                {formattedDate}{" "}
                                                                {formattedTime}
                                                            </p>

                                                            <p className="mt-2 text-sm font-medium">
                                                                Your order nr{" "}
                                                                <span className="text-[#F26B0A]">
                                                                    #{order.id}
                                                                </span>
                                                            </p>
                                                        </div>

                                                        <div className="text-left sm:text-right">
                                                            <p className="text-lg font-semibold">
                                                                $
                                                                {Number(
                                                                    order.totalAmount
                                                                ).toFixed(2)}
                                                            </p>

                                                            <span className="mt-1 inline-block rounded-[4px] bg-green-700 px-3 py-1 text-xs text-green-100">
                                                                Success
                                                            </span>
                                                        </div>
                                                    </div>

                                                    <div className="mt-4 space-y-2 border-t border-[#383B42] pt-4">
                                                        {order.items.map(
                                                            (item) => (
                                                                <div
                                                                    key={item.id}
                                                                    className="flex items-center justify-between gap-4 text-sm"
                                                                >
                                                                    <div className="flex min-w-0 items-center gap-2">
                                                                        <span className="text-[#F26B0A]">
                                                                            •
                                                                        </span>

                                                                        <span className="truncate text-gray-300">
                                                                            {item.product.name}
                                                                        </span>
                                                                    </div>

                                                                    <span className="shrink-0 text-gray-400">
                                                                        x{item.quantity}
                                                                    </span>
                                                                </div>
                                                            )
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    );
                                })}
                            </div>
                        )}
                    </section>
                </div>
            </div>
        </main>
    );
}