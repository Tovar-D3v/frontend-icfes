"use client";

import { useState } from "react";
import { TopHeader } from "@/components/navigation/top-header";
import { BottomNav } from "@/components/navigation/bottom-nav";

export default function HomeLayout({ children }) {

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* TOP HEADER */}
      <TopHeader
      />

      {/* PAGE CONTENT */}
      <main className="container max-w-2xl mx-auto px-4 flex-1 flex flex-col overflow-hidden">
        {children}
      </main>

      {/* BOTTOM NAV */}
      <BottomNav
      />
    </div>
  );
}