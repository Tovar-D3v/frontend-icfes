"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { NavEstudiantes } from "./estudiantes/nav-estudiantes";
import { NavProfesores } from "./profesores/nav-profesores";
import { NavButtonLeft } from "./nav-button-left";

export function LeftNav() {
  const router = useRouter();
  const pathname = usePathname();
  const [role, setRole] = useState(null);

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

  let currentScreen = "";

  // Ajuste: detectar las rutas reales para profesores
  if (pathname === "/dashboard" || pathname.startsWith("/dashboard")) {
    currentScreen = "dashboard";
  } else if (
    pathname.startsWith("/liga-estudiantes") ||
    pathname.startsWith("/liga")
  ) {
    currentScreen = "liga";
  } else if (pathname.startsWith("/estudiantes")) {
    currentScreen = "estudiantes";
  } else if (pathname.startsWith("/perfil")) {
    currentScreen = "profile";
  }

  return (
    <aside className=" border-r-2 border-border-secundary h-full w-full px-6 py-8">
      <div className="flex flex-col gap-11">
        <div className="">
          <div className="flex items-center gap-2">
            <div className="w-9 rounded-xl flex items-center justify-center">
              <img
                src="https://d35aaqx5ub95lt.cloudfront.net/images/practiceHub/2c76c04c8e99125ccda0b74b11ac468e.svg"
                alt=""
              />
            </div>
            <span className="text-2xl font-extrabold text-foreground">
              +500 ICFES
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <NavButtonLeft
            iconSrc="https://d35aaqx5ub95lt.cloudfront.net/vendor/fbe0c187341c280e161f76fb4cbda1d7.svg"
            label="Inicio"
            active={currentScreen === "dashboard"}
            onClick={() => {
              router.push("/dashboard");
            }}
          />
          <NavButtonLeft
            iconSrc="https://d35aaqx5ub95lt.cloudfront.net/vendor/d1f31f71a5b1d513184cc278d910cb33.svg"
            label="Liga"
            active={currentScreen === "liga"}
            onClick={() => {
              router.push("/liga-estudiantes");
            }}
          />
          <NavButtonLeft
            iconSrc="https://d35aaqx5ub95lt.cloudfront.net/images/goals/2b5a211d830a24fab92e291d50f65d1d.svg"
            label="Estudiantes"
            active={currentScreen === "estudiantes"}
            onClick={() => {
              router.push("/estudiantes");
            }}
          />

          <NavButtonLeft
            iconSrc="https://d35aaqx5ub95lt.cloudfront.net/vendor/e93ac282acf802a6258c761d3e9f9888.svg"
            label="Perfil"
            active={currentScreen === "profile"}
            onClick={() => {
              router.push("/perfil");
            }}
          />
        </div>
      </div>
    </aside>
  );
}
