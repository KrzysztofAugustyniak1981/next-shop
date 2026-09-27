import Link from "next/link";

export default function RegisterSuccessPage() {
    return (
        <main className="flex min-h-[620px] flex-1 flex-col bg-[#1A1A1A] text-white">
            <div className="mx-auto w-full max-w-[1340px] px-6">
                <div className="flex h-[120px] items-center justify-between border-b border-[#383B42]">
                    <div className="text-xl font-semibold">
                        <span className="text-[#F29145]">Nexus</span>
                        <span className="text-white">Hub</span>
                    </div>

                    <Link
                        href="/login"
                        className="rounded-[4px] bg-[#F29145] px-8 py-4 text-sm font-medium text-[#1A1A1A]"
                    >
                        Sign In
                    </Link>
                </div>

                <section className="flex flex-col items-center justify-center py-24 text-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-green-400 text-3xl text-green-400">
                        ✓
                    </div>

                    <h1 className="mt-8 text-3xl font-semibold">
                        Thank you!
                    </h1>

                    <p className="mt-4 text-sm text-gray-300">
                        You have successfully register
                    </p>

                    <p className="mt-6 max-w-[600px] text-sm text-gray-400">
                        Please check your e-mail for further information.
                        Let&apos;s exploring our products and enjoy many gifts.
                    </p>

                    <p className="mt-4 text-sm text-gray-400">
                        Having problem?{" "}
                        <span className="text-[#F29145]">
                            Contact us
                        </span>
                    </p>
                </section>
            </div>
        </main>
    );
}