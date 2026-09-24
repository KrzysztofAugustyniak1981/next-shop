"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function LogoutButton() {
    const router = useRouter();
    const { logout } = useAuth();

    async function handleLogout() {
        const response = await fetch("/api/auth/logout", {
            method: "POST",
        });

        if (!response.ok) {
            return;
        }

        logout();
        router.push("/login");
        router.refresh();
    }

    return (
        <button
            type="button"
            onClick={handleLogout}
            className="mt-8 rounded-[6px] bg-[#F29145] px-6 py-3 text-sm text-[#1A1A1A]"
        >
            Logout
        </button>
    );
}