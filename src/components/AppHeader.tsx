"use client"

import { usePathname } from "next/navigation";
import Header from "./Header";

export default function AppHeader() {
    const pathname = usePathname();

    if(pathname === "/login") {
        return null;
    }

    return <Header />
}