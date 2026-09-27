import RegisterForm from "@/components/RegisterForm";

export default function RegisterPage() {
    return (
        <main className="flex-1 bg-[#1A1A1A]">
            <div className="mx-auto w-full max-w-[1440px] px-4 py-12 md:px-10 md:py-20">
                <div className="flex justify-center">
                    <RegisterForm />
                </div>
            </div>
        </main>
    );
}