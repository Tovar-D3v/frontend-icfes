"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import { LoginForm } from "@/components/auth/login-form";

export default function LoginRoutePage() {
    const router = useRouter();

    const handleLogin = (email, password) => {
        if (email && password) {
            router.push("/home");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background px-4 py-8">
            <Link href="/" className="absolute top-4 right-4 p-2 hover:bg-gray-200 rounded-2xl z-10">
                <X className="w-6 h-6 text-gray-400" />
            </Link>
            <div className="relative w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg">


                <div className="pt-6">
                    <LoginForm
                        onLogin={handleLogin}
                        onSwitchToRegister={() => router.push("/register")}
                    />
                </div>
            </div>
        </div>
    );
}