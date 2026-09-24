"use client";

import { createContext, useContext, useState, useEffect } from "react";

type User = {
    id: number;
    email: string;
};

type AuthContextType = {
    user: User | null;
    login: (user: User) => void;
    logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        async function checkSession() {
            const response = await fetch("/api/auth/me");

            if (!response.ok) {
                setUser(null);
                return;
            }

            const data = await response.json();

            setUser(data.user);
        }

        checkSession();
    }, []);

    function login(user: User) {
        setUser(user);
    }

    function logout() {
        setUser(null);
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                login,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error("useAuth must be used inside AuthProvider");
    }

    return context;
}