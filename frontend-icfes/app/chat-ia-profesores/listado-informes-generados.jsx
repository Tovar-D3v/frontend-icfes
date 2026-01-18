"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { getListadoInformes } from "@/services/profesor/listado-informes";

export default function ListadoInformesGeneradosPage() {
  const [informes, setInformes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedId, setSelectedId] = useState(null);

  const formatDate = (iso) => {
    try {
      const d = new Date(iso);
      return d.toLocaleString(); // formato local, p.e. "18/1/2026 05:07:03"
    } catch {
      return iso;
    }
  };

  useEffect(() => {
    // cargar selection desde cache (si existe)
    try {
      const stored = localStorage.getItem("informe_seleccionado");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed?.id) setSelectedId(parsed.id);
      }
    } catch (e) {
      console.warn("no se pudo leer informe_seleccionado:", e);
    }
  }, []);

  useEffect(() => {
    const fetchInformes = async () => {
      setLoading(true);
      setError(null);

      try {
        const raw = localStorage.getItem("asignacion_seleccionada");
        if (!raw) {
          setError("No se encontró asignación seleccionada en localStorage.");
          setInformes([]);
          return;
        }

        const item = JSON.parse(raw);
        const asignacion_id = item?.asignacion_id ?? item?.asignacion ?? null;
        if (!asignacion_id) {
          setError("Asignación inválida en localStorage.");
          setInformes([]);
          return;
        }

        const res = await getListadoInformes(asignacion_id);
        // Acomodar por fecha (más reciente primero) y setear lista
        const list = Array.isArray(res) ? res : [];
        list.sort((a, b) => new Date(b.creado_en) - new Date(a.creado_en));
        setInformes(list);
      } catch (err) {
        console.error("Error al obtener listado de informes:", err);
        setError("Error al cargar informes.");
        setInformes([]);
      } finally {
        setLoading(false);
      }
    };

    fetchInformes();
  }, []);

  const handleSelect = (inf) => {
    setSelectedId(inf.id);
    try {
      localStorage.setItem("informe_seleccionado", JSON.stringify({ id: inf.id }));
    } catch (e) {
      console.warn("no se pudo guardar informe_seleccionado:", e);
    }
    // Notificar otras partes (chat) del cambio
    window.dispatchEvent(new CustomEvent("informeSeleccionado", { detail: inf }));
  };

  return (
    <div className="p-4 w-full">
      <h1 className="text-lg font-semibold mb-4">Informes Generados</h1>

      {loading && <p>Cargando...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && informes.length === 0 && (
        <p className="text-gray-500">No hay informes generados para la asignación seleccionada.</p>
      )}

      {!loading && informes.length > 0 && (
        <div className="flex flex-col gap-4 w-full">
          {informes.map((inf) => {
            const fecha = formatDate(inf.creado_en);
            const nombre = `Informe-${fecha.replace(/[:\/,\s]/g, "-")}`;
            const isSelected = selectedId === inf.id;
            return (
              <div
                key={inf.id}
                role="button"
                onClick={() => handleSelect(inf)}
                className={`w-full border-card px-4 py-2 flex flex-col gap-2 rounded-xl cursor-pointer ${
                  isSelected ? "quiz-option-selected" : ""
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">{nombre}</div>
                    <div className="text-xs text-gray-500">Creado: {fecha}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
