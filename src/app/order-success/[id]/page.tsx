import "dotenv/config";
import Image from "next/image";
import Link from "next/link";
import { cookies } from "next/headers";
import { redirect, notFound } from "next/navigation";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import { verifySessionToken } from "@/lib/auth";

const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

type OrderSuccessPageProps = {
    params: Promise<{
        id: string;
    }>;
};

export default async function OrderSuccessPage({
    params,
}: OrderSuccessPageProps) {
    const cookieStore = await cookies();
    const session = cookieStore.get("session");

    if (!session) {
        redirect("/login");
    }

    let userId: number;

    try {
        const sessionData = await verifySessionToken(
            session.value
        );

        userId = Number(sessionData.userId);
    } catch {
        redirect("/login");
    }

    const { id } = await params;
    const orderId = Number(id);

    if (!Number.isInteger(orderId)) {
        notFound();
    }

    const order = await prisma.order.findFirst({
        where: {
            id: orderId,
            userId,
        },
        include: {
            items: {
                include: {
                    product: true,
                },
            },
        },
    });

    if (!order) {
        notFound();
    }

    const productTotal = order.items.reduce(
        (sum, item) =>
            sum +
            Number(item.priceAtPurchase) *
                item.quantity,
        0
    );

    const protectionPrice =
        order.productProtection ? 1 : 0;

    const formattedDate =
        order.createdAt.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });

    return (
        <main className="min-h-screen bg-[#1A1A1A] px-4 py-12 text-white">
            <div className="mx-auto w-full max-w-[640px] rounded-[6px] border border-[#383B42] bg-[#262626] p-6">
                <div className="flex flex-col items-center text-center">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-green-400 text-3xl text-green-400">
                        ✓
                    </div>

                    <h1 className="mt-6 text-xl font-semibold">
                        Thanks for Your Order!
                    </h1>

                    <p className="mt-3 text-xs text-gray-400">
                        Order #{order.id}
                    </p>
                </div>

                <div className="mt-8 border-b border-[#383B42] pb-6">
                    <p className="text-sm font-medium">
                        Transaction Date
                    </p>

                    <p className="mt-3 text-sm text-gray-300">
                        {formattedDate}
                    </p>
                </div>

                <div className="border-b border-[#383B42] py-6">
                    <p className="text-sm font-medium">
                        Payment Method
                    </p>

                    <p className="mt-3 text-sm text-gray-300">
                        Apple Pay
                    </p>
                </div>

                <div className="border-b border-[#383B42] py-6">
                    <p className="text-sm font-medium">
                        Shipping Method
                    </p>

                    <p className="mt-3 text-sm text-gray-300">
                        NexusHub Courier
                    </p>
                </div>

                <div className="border-b border-[#383B42] py-6">
                    <h2 className="text-sm font-medium">
                        Your Order
                    </h2>

                    <div className="mt-4 space-y-4">
                        {order.items.map((item) => (
                            <div
                                key={item.id}
                                className="flex items-center gap-4 rounded-[4px] border border-[#383B42] p-4"
                            >
                                <div className="relative h-[100px] w-[100px] shrink-0 overflow-hidden rounded-[4px] bg-white">
                                    <Image
                                        src={
                                            item.product
                                                .imageUrl ||
                                            "/images/product-mouse.png"
                                        }
                                        alt={
                                            item.product.name
                                        }
                                        fill
                                        sizes="100px"
                                        className="object-contain p-2"
                                    />
                                </div>

                                <div className="min-w-0 flex-1">
                                    <p className="font-medium">
                                        {
                                            item.product
                                                .name
                                        }
                                    </p>

                                    <span className="mt-2 inline-block rounded-[4px] bg-[#F26B0A] px-3 py-1 text-xs">
                                        Product
                                    </span>

                                    <p className="mt-3 text-lg">
                                        $
                                        {Number(
                                            item.priceAtPurchase
                                        ).toFixed(2)}
                                    </p>
                                </div>

                                <p className="text-sm text-gray-300">
                                    x{item.quantity}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="space-y-4 border-b border-[#383B42] py-6 text-sm">
                    <div className="flex items-center justify-between gap-4">
                        <span className="text-gray-300">
                            Total Product Price
                        </span>

                        <span>
                            ${productTotal.toFixed(2)}
                        </span>
                    </div>

                    <div className="flex items-center justify-between gap-4">
                        <span className="text-gray-300">
                            Total Product Protection
                        </span>

                        <span>
                            $
                            {protectionPrice.toFixed(
                                2
                            )}
                        </span>
                    </div>
                </div>

                <div className="flex items-center justify-between border-b border-[#383B42] py-6">
                    <span className="text-sm font-medium">
                        Grand total
                    </span>

                    <span className="text-2xl font-semibold">
                        $
                        {Number(
                            order.totalAmount
                        ).toFixed(2)}
                    </span>
                </div>

                <div className="flex items-center justify-between py-6">
                    <span className="text-sm font-medium">
                        Status
                    </span>

                    <span className="rounded-[4px] bg-green-700 px-3 py-1 text-xs text-green-100">
                        Success
                    </span>
                </div>

                <Link
                    href="/products"
                    className="block w-full rounded-[4px] bg-[#F29145] px-6 py-4 text-center text-sm font-semibold text-[#1A1A1A]"
                >
                    Continue Shopping
                </Link>
            </div>
        </main>
    );
}