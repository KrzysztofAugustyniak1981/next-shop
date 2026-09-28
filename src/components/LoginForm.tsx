"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";

type LoginFormData = {
    email: string;
    password: string;
    savePassword: boolean;
};

export default function LoginForm() {
    const [step, setStep] = useState<1 | 2>(1);
    const [showPassword, setShowPassword] = useState(false);
    const [serverError, setServerError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const { login } = useAuth();
    const router = useRouter();

    const {
        register,
        handleSubmit,
        trigger,
        formState: { errors, isSubmitting },
    } = useForm<LoginFormData>({
        defaultValues: {
            email: "",
            password: "",
            savePassword: true,
        },
    });

    async function handleContinue() {
        const emailIsValid = await trigger("email");

        if (emailIsValid) {
            setStep(2);
            setServerError("");
        }
    }

    async function onSubmit(data: LoginFormData) {
        setServerError("");
        setSuccessMessage("");

        try {
            const response = await fetch("/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: data.email,
                    password: data.password,
                }),
            });

            const responseData = await response.json();

            if (!response.ok) {
                setServerError(
                    responseData.message || "Invalid email or password."
                );
                return;
            }

            login({
                id: responseData.userId,
                email: responseData.email,
            });

            setSuccessMessage("You have been successfully signed in.");

            setTimeout(() => {
                router.push("/");
            }, 1000);
        } catch {
            setServerError("Something went wrong. Please try again.");
        }
    }

    return (
        <div className="w-full max-w-[448px]">
            <div className="text-center text-3xl font-semibold">
                <span className="text-[#F29145]">Nexus</span>
                <span className="text-white">Hub</span>
            </div>

            <form
                onSubmit={handleSubmit(onSubmit)}
                className="mt-8 rounded-[6px] border border-[#383B42] bg-[#262626] p-6"
            >
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
                                placeholder="Email or Mobile phone Number"
                                {...register("email", {
                                    required: "Email is required.",
                                    pattern: {
                                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                        message: "Enter a valid email address.",
                                    },
                                })}
                                className="h-[54px] w-full rounded-[6px] border border-[#616674] bg-[#262626] px-5 text-sm text-white outline-none placeholder:text-[#9CA0AA] focus:border-[#F29145]"
                            />

                            {errors.email && (
                                <p className="mt-2 text-sm text-red-400">
                                    {errors.email.message}
                                </p>
                            )}
                        </div>

                        <button
                            type="button"
                            onClick={handleContinue}
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
                                    placeholder="Password"
                                    {...register("password", {
                                        required: "Password is required.",
                                    })}
                                    className="h-[54px] w-full rounded-[6px] border border-[#616674] bg-[#262626] px-5 pr-12 text-sm text-white outline-none placeholder:text-[#9CA0AA] focus:border-[#F29145]"
                                />

                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowPassword((current) => !current)
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

                            {errors.password && (
                                <p className="mt-2 text-sm text-red-400">
                                    {errors.password.message}
                                </p>
                            )}
                        </div>

                        <div className="mt-4 flex items-center justify-between">
                            <label className="flex items-center gap-2 text-xs text-white">
                                <input
                                    type="checkbox"
                                    {...register("savePassword")}
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
                            type="submit"
                            disabled={isSubmitting || Boolean(successMessage)}
                            className="mt-8 h-[54px] w-full rounded-[6px] bg-[#F29145] text-sm text-[#1A1A1A] disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {isSubmitting ? "Signing in..." : "Sign In"}
                        </button>

                        {serverError && (
                            <div
                                role="alert"
                                className="mt-4 rounded-[6px] border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-400"
                            >
                                {serverError}
                            </div>
                        )}

                        {successMessage && (
                            <div
                                role="status"
                                className="mt-4 rounded-[6px] border border-green-500/40 bg-green-500/10 px-4 py-3 text-sm text-green-400"
                            >
                                {successMessage}
                            </div>
                        )}
                    </>
                )}
            </form>
        </div>
    );
}