"use client";

import React, { useEffect, useState } from "react";
import { NavButton } from "./nav-button";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { NavEstudiantes } from "./estudiantes/nav-estudiantes"
import { NavProfesores } from "./profesores/nav-profesores"
import { useAuth } from "@/context/auth-context";

export function BottomNav() {
  const router = useRouter();
  const pathname = usePathname();
  const [role, setRole] = useState(null);
  const { user, accessToken, setTokens, logout } = useAuth();

  useEffect(() => {
    if (typeof window === "undefined") return;
    const r = localStorage.getItem("role");
    setRole(r);

    const onStorage = (e) => {
      if (e.key === "role") setRole(e.newValue);
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const normalized = role?.toLowerCase() ?? "";

  if (normalized.includes("profesor")) {
    return <NavProfesores router={router} pathname={pathname} />;
  }

  if (normalized.includes("estudiante")) {
    return <NavEstudiantes router={router} pathname={pathname} />;
  }

  return null;
}