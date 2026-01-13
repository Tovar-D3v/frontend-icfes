"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export function AuthSelection() {
  return (
    <div className="flex flex-col items-center justify-between min-h-screen w-full px-6 py-7">
      {/* Logo */}
      <motion.div
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="mb-8 flex gap-3 items-center text-center justify-center"
      >
        <div className="w-16 rounded-xl flex items-center justify-center">
          <img
            src="https://d35aaqx5ub95lt.cloudfront.net/images/practiceHub/2c76c04c8e99125ccda0b74b11ac468e.svg"
            alt="logo-500-icfes"
          />
        </div>
        <span className="text-3xl font-extrabold text-background mt-3">
          +500 ICFES
        </span>
      </motion.div>

      {/* Illustration */}
      <motion.div
        initial={{ y: 60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
        className="flex justify-center flex-col items-center"
      >
        <div className="w-80 flex justify-center items-center">
          <img
            src="https://res.cloudinary.com/dulrdwjul/image/upload/v1765248171/Gemini_Generated_Image_n6g44mn6g44mn6g4_20251208130627_akqnlq.png"
            className="w-full"
          />
        </div>

        <div className="text-center max-w-sm">
          <h2 className="text-2xl font-bold text-gray-800">
            ¡La forma divertida y efectiva de prepararte para el ICFES!
          </h2>
        </div>
      </motion.div>

      {/* Buttons */}
      <motion.div
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.9, ease: "easeOut", delay: 0.4 }}
        className="w-full max-w-sm space-y-4"
      >
        <Link
          href="/login"
          className="w-full inline-flex items-center justify-center bg-white hover:bg-gray-100 text-blue-400 font-bold py-4 px-6 rounded-sm shadow-[0_4px_0_#0003] border-2 border-border text-lg transition-all"
        >
          YA TENGO UNA CUENTA
        </Link>

        <Link
          href="/register"
          className="flex gap-4 bg-primary hover:bg-primary/90 p-4 w-full rounded-sm shadow-[0_4px_0_#58a701] items-center justify-center text-lg font-bold text-white"
        >
          REGISTRATE AHORA
        </Link>
      </motion.div>
    </div>
  );
}
