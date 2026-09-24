"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginForm() {
    const [step, setStep] = useState<1 | 2>(1);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const { login } = useAuth();
    const router = useRouter();


    async function handleLogin() {
        setError("");

        const response = await fetch("/api/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email,
                password,
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            setError(data.message);
            return;
        }

        login({
            id: data.userId,
            email: data.email,
        });

        router.push("/profile");
    }

    return (
        <div className="w-full max-w-[448px]">
            <div className="text-center text-3xl font-semibold">
                <span className="text-[#F29145]">Nexus</span>
                <span className="text-white">Hub</span>
            </div>

            <div className="mt-8 rounded-[6px] border border-[#383B42] bg-[#262626] p-6">
                <h1 className="border-b border-[#383B42] pb-6 text-xl text-white">
                    Sign in
                </h1>

                {step === 1 && (
                    <>
                        <div className="mt-8">
                            <label
                                htmlFor="email"
                                className="mb-4 block text-sm text-white"
                            >
                                Email or mobile phone number
                            </label>

                            <input
                                id="email"
                                type="text"
                                value={email}
                                onChange={(event) => setEmail(event.target.value)}
                                placeholder="Email or Mobile phone Number"
                                className="h-[54px] w-full rounded-[6px] border border-[#616674] bg-[#262626] px-5 text-sm text-white outline-none placeholder:text-[#9CA0AA] focus:border-[#F29145]"
                            />
                        </div>

                        <button
                            type="button"
                            onClick={() => setStep(2)}
                            className="mt-8 h-[54px] w-full rounded-[6px] bg-[#F29145] text-sm text-[#1A1A1A]"
                        >
                            Continue
                        </button>

                        <p className="mt-6 text-sm text-[#C4C4C4]">
                            Don&apos;t have an account?{" "}
                            <Link
                                href="/register"
                                className="text-white hover:text-[#F29145]"
                            >
                                Register
                            </Link>
                        </p>
                    </>
                )}

                {step === 2 && (
                    <>
                        <div className="mt-8">
                            <label
                                htmlFor="password"
                                className="mb-4 block text-sm text-white"
                            >
                                Password
                            </label>

                            <div className="relative">
                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(event) =>
                                        setPassword(event.target.value)
                                    }
                                    placeholder="Password"
                                    className="h-[54px] w-full rounded-[6px] border border-[#616674] bg-[#262626] px-5 pr-12 text-sm text-white outline-none placeholder:text-[#9CA0AA] focus:border-[#F29145]"
                                />

                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowPassword(!showPassword)
                                    }
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9CA0AA] hover:text-white"
                                    aria-label={
                                        showPassword
                                            ? "Hide password"
                                            : "Show password"
                                    }
                                >
                                    ◉
                                </button>
                            </div>
                        </div>

                        <div className="mt-4 flex items-center justify-between">
                            <label className="flex items-center gap-2 text-xs text-white">
                                <input
                                    type="checkbox"
                                    defaultChecked
                                    className="h-4 w-4 accent-[#F29145]"
                                />
                                Save password
                            </label>

                            <button
                                type="button"
                                className="text-xs text-white hover:text-[#F29145]"
                            >
                                Forgot your password?
                            </button>
                        </div>

                        <button
                            type="button"
                            onClick={handleLogin}
                            className="mt-8 h-[54px] w-full rounded-[6px] bg-[#F29145] text-sm text-[#1A1A1A]"
                        >
                            Sign In
                        </button>

                        {error && (
                            <p className="mt-4 text-sm text-red-400">
                                {error}
                            </p>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}