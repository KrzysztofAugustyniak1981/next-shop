"use client";

import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { useRouter } from "next/navigation";

type RegisterFormData = {
    firstName: string;
    email: string;
    mobileNumber: string;
    password: string;
    confirmPassword: string;
    country: string;
    acceptedTerms: boolean;
};

export default function RegisterForm() {
    const router = useRouter();

    const [serverError, setServerError] = useState("");

    const {
        register,
        handleSubmit,
        control,
        formState: { errors, isSubmitting },
    } = useForm<RegisterFormData>({
        defaultValues: {
            firstName: "",
            email: "",
            mobileNumber: "",
            password: "",
            confirmPassword: "",
            country: "Poland",
            acceptedTerms: false,
        },
    });

    const password = useWatch({
        control,
        name: "password",
    });

    async function onSubmit(formData: RegisterFormData) {
        setServerError("");

        try {
            const response = await fetch("/api/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    firstName: formData.firstName,
                    email: formData.email,
                    password: formData.password,
                    mobileNumber: formData.mobileNumber,
                    country: formData.country,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                setServerError(data.message || "Registration failed.");
                return;
            }

            router.push("/register-success");
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
                    Create Account
                </h1>

                <div className="mt-6">
                    <label
                        htmlFor="firstName"
                        className="mb-2 block text-sm text-white"
                    >
                        First Name
                    </label>

                    <input
                        id="firstName"
                        type="text"
                        placeholder="Your First Name"
                        {...register("firstName", {
                            required: "Please enter your first name.",
                        })}
                        className="h-[54px] w-full rounded-[4px] border border-[#616674] bg-[#262626] px-4 text-sm text-white outline-none placeholder:text-[#9CA0AA] focus:border-[#F29145]"
                    />

                    {errors.firstName && (
                        <p className="mt-2 text-xs text-red-400">
                            {errors.firstName.message}
                        </p>
                    )}
                </div>

                <div className="mt-5">
                    <label
                        htmlFor="email"
                        className="mb-2 block text-sm text-white"
                    >
                        Email
                    </label>

                    <input
                        id="email"
                        type="email"
                        placeholder="Your Email"
                        {...register("email", {
                            required: "Please enter your email address.",
                            pattern: {
                                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                message: "Please enter a valid email address.",
                            },
                        })}
                        className="h-[54px] w-full rounded-[4px] border border-[#616674] bg-[#262626] px-4 text-sm text-white outline-none placeholder:text-[#9CA0AA] focus:border-[#F29145]"
                    />

                    {errors.email && (
                        <p className="mt-2 text-xs text-red-400">
                            {errors.email.message}
                        </p>
                    )}
                </div>

                <div className="mt-5">
                    <label
                        htmlFor="mobileNumber"
                        className="mb-2 block text-sm text-white"
                    >
                        Mobile Number
                    </label>

                    <input
                        id="mobileNumber"
                        type="tel"
                        placeholder="+48 123 456 789"
                        {...register("mobileNumber", {
                            required: "Please enter your phone number.",
                        })}
                        className="h-[54px] w-full rounded-[4px] border border-[#616674] bg-[#262626] px-4 text-sm text-white outline-none placeholder:text-[#9CA0AA] focus:border-[#F29145]"
                    />

                    {errors.mobileNumber && (
                        <p className="mt-2 text-xs text-red-400">
                            {errors.mobileNumber.message}
                        </p>
                    )}
                </div>

                <div className="mt-5">
                    <label
                        htmlFor="password"
                        className="mb-2 block text-sm text-white"
                    >
                        Password
                    </label>

                    <input
                        id="password"
                        type="password"
                        placeholder="Password"
                        {...register("password", {
                            required: "Please enter your password.",
                            minLength: {
                                value: 8,
                                message:
                                    "Password must contain at least 8 characters.",
                            },
                        })}
                        className="h-[54px] w-full rounded-[4px] border border-[#616674] bg-[#262626] px-4 text-sm text-white outline-none placeholder:text-[#9CA0AA] focus:border-[#F29145]"
                    />

                    {errors.password ? (
                        <p className="mt-2 text-xs text-red-400">
                            {errors.password.message}
                        </p>
                    ) : (
                        <p className="mt-2 text-xs leading-4 text-[#9CA0AA]">
                            Password must contain at least 8 characters.
                        </p>
                    )}
                </div>

                <div className="mt-5">
                    <label
                        htmlFor="confirmPassword"
                        className="mb-2 block text-sm text-white"
                    >
                        Confirm Password
                    </label>

                    <input
                        id="confirmPassword"
                        type="password"
                        placeholder="Confirm Password"
                        {...register("confirmPassword", {
                            required: "Please confirm your password.",
                            validate: (value) =>
                                value === password ||
                                "Passwords do not match.",
                        })}
                        className="h-[54px] w-full rounded-[4px] border border-[#616674] bg-[#262626] px-4 text-sm text-white outline-none placeholder:text-[#9CA0AA] focus:border-[#F29145]"
                    />

                    {errors.confirmPassword && (
                        <p className="mt-2 text-xs text-red-400">
                            {errors.confirmPassword.message}
                        </p>
                    )}
                </div>

                <div className="mt-5">
                    <label
                        htmlFor="country"
                        className="mb-2 block text-sm text-white"
                    >
                        Country or region
                    </label>

                    <select
                        id="country"
                        {...register("country", {
                            required: "Please select your country.",
                        })}
                        className="h-[54px] w-full rounded-[4px] border border-[#616674] bg-[#262626] px-4 text-sm text-white outline-none focus:border-[#F29145]"
                    >
                        <option value="Poland">Poland</option>
                        <option value="Germany">Germany</option>
                        <option value="United Kingdom">
                            United Kingdom
                        </option>
                        <option value="United States">
                            United States
                        </option>
                    </select>

                    {errors.country && (
                        <p className="mt-2 text-xs text-red-400">
                            {errors.country.message}
                        </p>
                    )}
                </div>

                <label className="mt-6 flex cursor-pointer items-start gap-3">
                    <input
                        type="checkbox"
                        {...register("acceptedTerms", {
                            required:
                                "Please accept the Conditions of Use and Privacy Notice.",
                        })}
                        className="mt-1 h-4 w-4 accent-[#F29145]"
                    />

                    <span className="text-xs leading-5 text-[#C5C7CE]">
                        By creating an account and check, you agree to the{" "}
                        <span className="text-[#F29145]">
                            Conditions of Use
                        </span>{" "}
                        and{" "}
                        <span className="text-[#F29145]">
                            Privacy Notice
                        </span>
                        .
                    </span>
                </label>

                {errors.acceptedTerms && (
                    <p className="mt-2 text-xs text-red-400">
                        {errors.acceptedTerms.message}
                    </p>
                )}

                {serverError && (
                    <p className="mt-4 text-sm text-red-400">
                        {serverError}
                    </p>
                )}

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="mt-6 h-[54px] w-full rounded-[4px] bg-[#F29145] text-sm font-medium text-[#1A1A1A] transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {isSubmitting
                        ? "Creating Account..."
                        : "Create Account"}
                </button>
            </form>
        </div>
    );
}