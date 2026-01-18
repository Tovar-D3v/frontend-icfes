"use client";

import React, { useState, useEffect } from "react";
import { NavButton } from "../nav-button";

export function NavProfesores({ router, pathname }) {
  let currentScreen = "";

  // leer y parsear asignación seleccionada de localStorage (si existe)
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

  if (
    pathname === "/dashboard" ||
    pathname.startsWith("/dashboard")
  ) {
    currentScreen = "dashboard";
  } else if (pathname.startsWith("/liga-estudiantes") || pathname.startsWith("/liga")) {
    currentScreen = "liga";
  } else if (
    pathname.startsWith("/estudiantes") ||
    pathname.startsWith("/listado-estudiantes")
  ) {
    currentScreen = "estudiantes";
  } else if (pathname.startsWith("/perfil")) {
    currentScreen = "profile";
  } else if (pathname.startsWith("/chat-ia-profesores")) {
    currentScreen = "chat-ia-profesores";
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background border-t border-border-secundary z-50 shadow-lg py-3">
      <div className="container max-w-2xl mx-auto">
        <div className="flex items-center justify-around">
          <NavButton
            iconSrc="https://d35aaqx5ub95lt.cloudfront.net/vendor/fbe0c187341c280e161f76fb4cbda1d7.svg"
            label="Inicio"
            active={currentScreen === "dashboard"}
            onClick={() => {
              router.push(asignacionId ? `/dashboard/${asignacionId}` : "/dashboard");
            }}
          />
          <NavButton
            iconSrc="https://d35aaqx5ub95lt.cloudfront.net/vendor/d1f31f71a5b1d513184cc278d910cb33.svg"
            label="Liga"
            active={currentScreen === "liga"}
            onClick={() => {
              router.push(cursoId ? `/liga-estudiantes/${cursoId}` : "/liga-estudiantes");
            }}
          />
          <NavButton
            iconSrc="https://d35aaqx5ub95lt.cloudfront.net/images/profile/48b8884ac9d7513e65f3a2b54984c5c4.svg"
            label="Estudiantes"
            active={currentScreen === "estudiantes"}
            onClick={() => {
              router.push(cursoId ? `/listado-estudiantes/${cursoId}` : "/estudiantes");
            }}
          />
          <NavButton
            iconSrc={"https://careers.duolingo.com/8cecd2f961a125291dc5.svg"}
            label="Chat IA"
            active={currentScreen === "chat-ia-profesores"}
            onClick={() => {
              router.push("/chat-ia-profesores");
            }}
          />

          <NavButton
            iconSrc="https://res.cloudinary.com/dulrdwjul/image/upload/v1765422409/27_sin_ti%CC%81tulo_20251210215809_jdgpgr.png"
            label="Perfil"
            active={currentScreen === "profile"}
            onClick={() => {
              router.push("/perfil");
            }}
          />
        </div>
      </div>
    </nav>
  );
}
