import LoginForm from "@/components/LoginForm";


export default function LoginPage() {
    return (
        <main className="flex-1 bg-[#1A1A1A]">
            <div className="mx-auto w-full max-w-[1340px] px-6">
                <div className="flex h-[120px] items-center justify-between border-b border-[#383B42]">
                    <div className="text-2xl font-semibold">
                        <span className="text-[#F29145]">Nexus</span>
                        <span className="text-white">Hub</span>
                    </div>

                    <button
                        type="button"
                        className="h-[54px] rounded-[6px] bg-[#F29145] px-8 text-sm text-[#1A1A1A]"
                    >
                        Sign In
                    </button>
                </div>
                <div className="flex justify-center py-20">
                    <LoginForm />
                </div>
            </div>
        </main>
    );
}