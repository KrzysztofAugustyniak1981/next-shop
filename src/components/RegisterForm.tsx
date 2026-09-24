"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";


export default function RegisterForm() {
    const [firstName, setFirstName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const router = useRouter();

    async function handleRegister() {
        setError("");
        setSuccess("");

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        const response = await fetch("/api/auth/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                firstName,
                email,
                password,
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            setError(data.message);
            return;
        }

        setSuccess(data.message);

        setTimeout(() => {
            router.push("/login");
        }, 2000);
    }


    return (
        <div className="w-full max-w-[448px]">
            <div className="text-center text-3xl font-semibold">
                <span className="text-[#F29145]">Nexus</span>
                <span className="text-white">Hub</span>
            </div>

            <div className="mt-8 rounded-[6px] border border-[#383B42] bg-[#262626] p-6">
                <h1 className="border-b border-[#383B42] pb-6 text-xl text-white">
                    Register
                </h1>

                <div className="mt-8">
                    <label
                        htmlFor="firstName"
                        className="mb-3 block text-sm text-white"
                    >
                        First name
                    </label>

                    <input
                        id="firstName"
                        type="text"
                        value={firstName}
                        onChange={(event) => setFirstName(event.target.value)}
                        placeholder="First name"
                        className="h-[54px] w-full rounded-[6px] border border-[#616674] bg-[#262626] px-5 text-sm text-white outline-none placeholder:text-[#9CA0AA] focus:border-[#F29145]"
                    />
                </div>

                <div className="mt-5">
                    <label
                        htmlFor="email"
                        className="mb-3 block text-sm text-white"
                    >
                        Email
                    </label>

                    <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        placeholder="Email"
                        className="h-[54px] w-full rounded-[6px] border border-[#616674] bg-[#262626] px-5 text-sm text-white outline-none placeholder:text-[#9CA0AA] focus:border-[#F29145]"
                    />
                </div>

                <div className="mt-5">
                    <label
                        htmlFor="password"
                        className="mb-3 block text-sm text-white"
                    >
                        Password
                    </label>

                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        placeholder="Password"
                        className="h-[54px] w-full rounded-[6px] border border-[#616674] bg-[#262626] px-5 text-sm text-white outline-none placeholder:text-[#9CA0AA] focus:border-[#F29145]"
                    />
                </div>

                <div className="mt-5">
                    <label
                        htmlFor="confirmPassword"
                        className="mb-3 block text-sm text-white"
                    >
                        Confirm password
                    </label>

                    <input
                        id="confirmPassword"
                        type="password"
                        value={confirmPassword}
                        onChange={(event) =>
                            setConfirmPassword(event.target.value)
                        }
                        placeholder="Confirm password"
                        className="h-[54px] w-full rounded-[6px] border border-[#616674] bg-[#262626] px-5 text-sm text-white outline-none placeholder:text-[#9CA0AA] focus:border-[#F29145]"
                    />
                </div>

                <button
                    type="button"
                    onClick={handleRegister}
                    className="mt-8 h-[54px] w-full rounded-[6px] bg-[#F29145] text-sm text-[#1A1A1A]"
                >
                    Register
                </button>
                {error && (
                    <p className="mt-4 text-sm text-red-400">
                        {error}
                    </p>
                )}

                {success && (
                    <p className="mt-4 text-sm text-green-400">
                        {success}
                    </p>
                )}
            </div>
        </div>
    );
}