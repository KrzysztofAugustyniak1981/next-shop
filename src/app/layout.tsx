import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import AppHeader from "@/components/AppHeader";
import Footer from "@/components/Footer";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: {
        default: "NexusHub",
        template: "%s | NexusHub",
    },
    description:
        "NexusHub online store for gaming and computer accessories.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
    return (
        <html
            lang="en"
            className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
        >
            <body className="flex min-h-full flex-col">
                <AuthProvider>
                    <CartProvider>
                        <AppHeader />

                        {children}

                        <Footer />
                    </CartProvider>
                </AuthProvider>
            </body>
        </html>
    );
}