import React, { useState, useEffect } from "react";
import { X, Heart } from "lucide-react";

export function BarraProgreso({ lives, onExit, progress }) {
    return (
        <div className="mb-6 mt-3 px-3 flex items-center justify-between">
            <button onClick={onExit} className="p-2 hover:bg-accent rounded-lg">
                <X className="w-6 h-6" />
            </button>

            <div className="flex-1 mx-4 h-3 bg-border rounded-full overflow-hidden">
                <div
                    className="h-full bg-duolingo-green transition-all duration-300"
                    style={{ width: `${progress}%` }}
                />
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-red-100 dark:bg-red-900/30 rounded-full">
                <Heart className="w-5 h-5 text-red-500 fill-red-500" />
                <span className="text-sm font-bold text-red-700 dark:text-red-400">
                    {lives}
                </span>
            </div>
        </div>
    )
}