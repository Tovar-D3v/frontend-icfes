"use client";

import { useParams, useRouter } from "next/navigation";
import { UnitsScreen } from "@/components/screens/units-screen";
import { useEffect, useState } from "react";
import { getMaterias } from "@/services/subjectsService";
import { getUnitsBySubject } from "@/services/unitsService";

export default function SubjectUnitsPage() {
  const { id } = useParams();
  const router = useRouter();

  if (!id)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );

  return <UnitsScreen idMateria={id} onBack={() => router.push("/home")} />;
}
