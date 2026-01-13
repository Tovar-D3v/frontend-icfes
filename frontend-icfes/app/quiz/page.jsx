"use client";

import React, { Suspense } from "react";
import QuizPageClient from "./QuizPageClient";

export default function Page() {
  return (
    <Suspense fallback={<div className="text-center py-20 min-h-screen flex justify-center flex-col">Cargando Nivel...</div>}>
      <QuizPageClient />
    </Suspense>
  );
}