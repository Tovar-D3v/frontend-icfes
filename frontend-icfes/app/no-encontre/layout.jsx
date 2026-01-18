"use client";

import { useState } from "react";

export default function NoEncontreLayout({ children }) {

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <main className="container max-w-2xl mx-auto px-4 flex-1">
        {children}
      </main>
    </div>
  );
}
