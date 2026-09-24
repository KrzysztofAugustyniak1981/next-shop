import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifySessionToken } from "@/lib/auth";
import LogoutButton from "@/components/LogoutButton";

export default async function ProfilePage() {
    const cookieStore = await cookies();
    const session = cookieStore.get("session");

    if (!session) {
        redirect("/login");
    }

    let user;

    try {
        user = await verifySessionToken(session.value);
    } catch {
        redirect("/login");
    }

    return (
        <main className="min-h-screen bg-[#1A1A1A] px-6 py-20 text-white">
            <div className="mx-auto max-w-[1200px]">
                <h1 className="text-3xl font-semibold">
                    My Profile
                </h1>

                <div className="mt-8">
                    <p>User ID: {String(user.userId)}</p>
                    <p>Email: {String(user.email)}</p>
                </div>
                <LogoutButton />
            </div>
        </main>
    );
}