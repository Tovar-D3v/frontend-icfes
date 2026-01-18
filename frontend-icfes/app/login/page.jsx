"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import { LoginForm } from "@/components/auth/login-form";
import { useAuth } from "@/context/auth-context";
import {jwtDecode} from "jwt-decode";

export default function LoginRoutePage() {
  const router = useRouter();
  const { user } = useAuth();

  const handleLogin = (loginResponse) => {
    let currentUser = user;
    if (loginResponse?.access) {
      try {
        currentUser = jwtDecode(loginResponse.access);
      } catch (e) {
        console.warn("No se pudo decodificar el access token:", e);
      }
    }

    const role = currentUser?.role_plain ?? currentUser?.role ?? loginResponse?.role;

    if (currentUser && !currentUser.avatar_style) {
      router.push("/create-avatar");
      return;
    }

    if (role === "ESTUDIANTE") router.push("/home");
    else if (role === "PROFESOR") router.push("/cursos-materias");
    else router.push("/no-encontre");
  };


  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-background px-4 py-8">
        <Link
          href="/"
          className="absolute top-4 right-4 p-2 hover:bg-gray-200 rounded-2xl z-10"
        >
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
    </>
  );
}
