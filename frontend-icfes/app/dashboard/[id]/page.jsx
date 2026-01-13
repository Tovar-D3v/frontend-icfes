"use client";

import { useParams, useRouter } from "next/navigation";
import DashboardProfesor from "../../../components/screens/profesores/dashboard-profesor";

export default function DashboardPage() {
  const { id } = useParams();
  const router = useRouter();

  if (!id)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );

  return <DashboardProfesor idCurso={id} />;
}
