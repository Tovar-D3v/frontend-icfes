"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
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

  // parse asignación seleccionada (si existe) para rutas de profesor
  let asignacion_seleccionada = null;
  if (typeof window !== "undefined") {
    try {
      const raw = localStorage.getItem("asignacion_seleccionada");
      asignacion_seleccionada = raw ? JSON.parse(raw) : null;
    } catch (e) {
      asignacion_seleccionada = null;
    }
  }
  const asignacionId = asignacion_seleccionada?.asignacion_id ?? null;
  const cursoId = asignacion_seleccionada?.curso_id ?? null;

  const normalized = role?.toLowerCase() ?? "";

  let currentScreen = "";

  // Ajuste: detectar rutas reales (estudiantes y profesores)
  if (
    pathname === "/" ||
    pathname.startsWith("/home") ||
    pathname.startsWith("/subjects")
  ) {
    currentScreen = "subjects";
  } else if (pathname === "/dashboard" || pathname.startsWith("/dashboard")) {
    currentScreen = "dashboard";
  } else if (
    pathname.startsWith("/liga-estudiantes") ||
    pathname.startsWith("/liga")
  ) {
    currentScreen = "league";
  } else if (
    pathname.startsWith("/estudiantes") ||
    pathname.startsWith("/listado-estudiantes")
  ) {
    currentScreen = "estudiantes";
  } else if (pathname.startsWith("/analisis")) {
    currentScreen = "analysis";
  } else if (pathname.startsWith("/perfil")) {
    currentScreen = "profile";
  } else if (pathname.startsWith("/chat-ia-profesores")) {
    currentScreen = "chat-ia-profesores";
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

        {/* Si es profesor, usar mismas rutas/iconos que NavProfesores; si no, mostrar navegación de estudiantes */}
        {role === "PROFESOR" && (
          <div className="flex flex-col gap-3">
            <NavButtonLeft
              iconSrc="https://d35aaqx5ub95lt.cloudfront.net/vendor/fbe0c187341c280e161f76fb4cbda1d7.svg"
              label="Inicio"
              active={currentScreen === "dashboard"}
              onClick={() => {
                router.push(asignacionId ? `/dashboard/${asignacionId}` : "/dashboard");
              }}
            />
            <NavButtonLeft
              iconSrc="https://d35aaqx5ub95lt.cloudfront.net/vendor/d1f31f71a5b1d513184cc278d910cb33.svg"
              label="Liga"
              active={currentScreen === "league"}
              onClick={() => {
                router.push(cursoId ? `/liga-estudiantes/${cursoId}` : "/liga-estudiantes");
              }}
            />
            <NavButtonLeft
              iconSrc="https://d35aaqx5ub95lt.cloudfront.net/images/profile/48b8884ac9d7513e65f3a2b54984c5c4.svg"
              label="Estudiantes"
              active={currentScreen === "estudiantes"}
              onClick={() => {
                router.push(cursoId ? `/listado-estudiantes/${cursoId}` : "/estudiantes");
              }}
            />
            <NavButtonLeft
              iconSrc={"https://careers.duolingo.com/8cecd2f961a125291dc5.svg"}
              label={"Chat IA"}
              active={currentScreen === "chat-ia-profesores"}
              onClick={() => {
                router.push("/chat-ia-profesores");
              }}
            />
            <NavButtonLeft
              iconSrc="https://res.cloudinary.com/dulrdwjul/image/upload/v1765422409/27_sin_ti%CC%81tulo_20251210215809_jdgpgr.png"
              label="Perfil"
              active={currentScreen === "profile"}
              onClick={() => {
                router.push("/perfil");
              }}
            />
          </div>
        )} 
        {role === "ESTUDIANTE" && (
          <div className="flex flex-col gap-3">
            <NavButtonLeft
              iconSrc="https://d35aaqx5ub95lt.cloudfront.net/vendor/fbe0c187341c280e161f76fb4cbda1d7.svg"
              label="Inicio"
              active={currentScreen === "subjects"}
              onClick={() => {
                router.push("/home");
              }}
            />
            <NavButtonLeft
              iconSrc="https://d35aaqx5ub95lt.cloudfront.net/vendor/d1f31f71a5b1d513184cc278d910cb33.svg"
              label="Liga"
              active={currentScreen === "league"}
              onClick={() => {
                router.push("/liga");
              }}
            />
            <NavButtonLeft
              iconSrc="https://d35aaqx5ub95lt.cloudfront.net/images/goals/2b5a211d830a24fab92e291d50f65d1d.svg"
              label="Análisis"
              active={currentScreen === "analysis"}
              onClick={() => {
                router.push("/analisis");
              }}
            />
            <NavButtonLeft
              iconSrc="https://res.cloudinary.com/dulrdwjul/image/upload/v1765422409/27_sin_ti%CC%81tulo_20251210215809_jdgpgr.png"
              label="Perfil"
              active={currentScreen === "profile"}
              onClick={() => {
                router.push("/perfil");
              }}
            />
          </div>
        )}
      </div>
    </aside>
  );
}
