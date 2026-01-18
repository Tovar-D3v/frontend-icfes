"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { getRendimientoCurso } from "../../../services/profesor/rendimiento-curso";
import { RendimientoCurso } from "../../profesores-dashboard/rendimiento-curso";


export default function DashboardProfesor() {

  const [rendimientoCurso, setRendimientoCurso] = useState(null);
  const params = useParams();

  useEffect(() => {
    async function fetchRendimiento() {
      try {
        const id = params?.id;
        if (!id) return;
        const data = await getRendimientoCurso(id);
        setRendimientoCurso(data);
      } catch (error) {
        console.error("Error fetching rendimiento del curso:", error);
      }
    }

    fetchRendimiento();
  }, [params?.id]);


  return (
    <div className="flex-1 overflow-auto min-h-screen px-4 py-6 space-y-6 mb-24 lg:mb-0">
      
      <RendimientoCurso rendimientoCurso={rendimientoCurso} />
    </div>
  );
}
