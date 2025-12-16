"use client";

import { useState } from "react";

export default function GuiaLayout({ children }) {

    return (
        <div className="min-h-screen flex flex-col bg-[#0f172a]">

            {/* PAGE CONTENT */}
            <main className="container max-w-2xl mx-auto px-4 flex-1">
                {children}
            </main>

        </div>
    );
}