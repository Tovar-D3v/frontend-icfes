"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import { RegisterForm } from "@/components/auth/register-form";

export default function RegisterRoutePage() {
  const router = useRouter();

  const handleRegister = (email, password, name) => {
    if (email && password && name) {
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
          <RegisterForm
            onRegister={handleRegister}
            onSwitchToLogin={() => router.push("/login")}
          />
        </div>
      </div>
    </div>
  );
}