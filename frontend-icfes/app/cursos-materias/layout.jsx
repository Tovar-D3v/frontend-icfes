"use client";

import { useState } from "react";
import { TopHeader } from "@/components/navigation/top-header";
import { TopHeaderRight } from "@/components/navigation/top-header-right";
import { BottomNav } from "@/components/navigation/bottom-nav";
import { LeftNav } from "@/components/navigation/left-nav";

export default function CursosMateriasLayout({ children }) {

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* TOP HEADER IPHONE Y TABLETS */}

      <div className="flex-1 flex flex-col lg:flex-row min-h-0">
        <main className="container max-w-2xl mx-auto px-4 flex-1 flex flex-col overflow-auto min-h-0">
          {children}
        </main>
      </div>

    </div>
  );
}