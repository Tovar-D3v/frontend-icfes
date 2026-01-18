"use client";

import { useState } from "react";
import { TopHeader } from "@/components/navigation/top-header";
import { TopHeaderRight } from "@/components/navigation/top-header-right";
import { BottomNav } from "@/components/navigation/bottom-nav";
import { LeftNav } from "@/components/navigation/left-nav";

export default function DashboardIdLayout({ children }) {

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* TOP HEADER IPHONE Y TABLETS */}
      <div className="lg:hidden sticky top-0 z-50">
        <TopHeader />
      </div>

      {/* LAYOUT: left nav | main | right header (en desktop) */}
      <div className="flex-1 flex flex-col lg:flex-row min-h-0">
        {/* LEFT NAV - Desktop (solo lg+) */}
        <aside className="hidden lg:block lg:w-72 lg:sticky lg:top-0 lg:h-screen">
          <LeftNav />
        </aside>

        {/* PAGE CONTENT */}
        <main className="container max-w-2xl mx-auto px-2 flex-1 flex flex-col overflow-auto min-h-0 lg:pt-0">
          {children}
        </main>

        {/* TOPHEADER PC */}
        <aside className="hidden lg:flex lg:w-1/3 lg:items-start lg:justify-start">
          <TopHeaderRight />
        </aside>
      </div>

      {/* BOTTOM NAV - visible en phone y tablet (oculto en lg+) */}
      <div className="lg:hidden">
        <BottomNav />
      </div>
    </div>
  );
}