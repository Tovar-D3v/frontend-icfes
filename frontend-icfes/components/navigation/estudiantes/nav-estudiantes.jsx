import React, { useState, useEffect } from "react";
import { NavButton } from "../nav-button";

export function NavEstudiantes({ router, pathname }) {
  let currentScreen = "";
  if (
    pathname === "/" ||
    pathname.startsWith("/home") ||
    pathname.startsWith("/subjects")
  ) {
    currentScreen = "subjects";
  } else if (pathname.startsWith("/liga")) {
    currentScreen = "league";
  } else if (pathname.startsWith("/analisis")) {
    currentScreen = "analysis";
  } else if (pathname.startsWith("/perfil")) {
    currentScreen = "profile";
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background border-t border-border-secundary z-50 shadow-lg py-3">
      <div className="container max-w-2xl mx-auto">
        <div className="flex items-center justify-around">
          <NavButton
            iconSrc="https://d35aaqx5ub95lt.cloudfront.net/vendor/fbe0c187341c280e161f76fb4cbda1d7.svg"
            label="Inicio"
            active={currentScreen === "subjects" || currentScreen === "units"}
            onClick={() => {
              router.push("/home");
            }}
          />
          <NavButton
            iconSrc="https://d35aaqx5ub95lt.cloudfront.net/vendor/d1f31f71a5b1d513184cc278d910cb33.svg"
            label="Liga"
            active={currentScreen === "league"}
            onClick={() => {
              router.push("/liga");
            }}
          />
          <NavButton
            iconSrc="https://d35aaqx5ub95lt.cloudfront.net/images/goals/2b5a211d830a24fab92e291d50f65d1d.svg"
            label="Análisis"
            active={currentScreen === "analysis"}
            onClick={() => {
              router.push("/analisis");
            }}
          />

          <NavButton
            iconSrc="https://d35aaqx5ub95lt.cloudfront.net/vendor/e93ac282acf802a6258c761d3e9f9888.svg"
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
