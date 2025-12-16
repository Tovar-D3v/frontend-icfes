"use client";

import { useRouter } from "next/navigation";

export function Tarjet({ unidad_id, level, title, description, exp }) {
  const router = useRouter();

  const handleStart = () => {
    console.log("Redirigiendo al quiz con id:", unidad_id);
    router.push(`/quiz?unidad_id=${unidad_id}`);
  };

  return (
    <div className="absolute top-full mt-6 left-1/2 transform -translate-x-1/2 bg-pink-500 rounded-xl p-4 w-72 text-white font-semibold shadow-lg flex flex-col gap-4 z-30">
      <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-b-8 border-b-pink-500"></div>

      <div className="flex flex-col ">
        <p className="text-lg mb-2">{title}</p>
        <p>{description || ""}</p>
        <p className="text-sm">{level || ""}</p>
      </div>

      <button
        onClick={handleStart}
        className="bg-white text-pink-600 font-bold py-2 px-4 rounded-sm w-full shadow-[0_4px_0_#f0c8df] active:shadow-[0_1px_0_#b7e6b7] active:translate-y-[3px] transition-all"
      >
        EMPEZAR +{exp} EXP
      </button>
    </div>
  );
}
