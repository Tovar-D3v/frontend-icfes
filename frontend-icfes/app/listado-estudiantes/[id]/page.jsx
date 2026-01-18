"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { getListadoEstudiantes } from "../../../services/profesor/listado-estudiantes";

export default function ListadoEstudiantesPage() {
  const { id } = useParams();
  const router = useRouter();
  const [estudiantesData, setEstudiantesData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!id) return;

    setLoading(true);
    setError(null);

    getListadoEstudiantes(id)
      .then((data) => {
        // Ordenar por XP descendente
        const ordenados = [...data].sort(
          (a, b) => (b.total_exp ?? 0) - (a.total_exp ?? 0)
        );
        setEstudiantesData(ordenados);
      })
      .catch((err) => {
        setError(err?.message ?? "Error al cargar estudiantes");
      })
      .finally(() => setLoading(false));
  }, [id]);

  const estudiantesFiltrados = useMemo(() => {
    if (!search.trim()) return estudiantesData;

    const q = search.trim().toLowerCase();
    return estudiantesData.filter((est) => {
      const username = String(est.usuario__username ?? "").toLowerCase();
      const firstName = String(est.usuario__first_name ?? "").trim().toLowerCase();
      const lastName = String(est.usuario__last_name ?? "").trim().toLowerCase();
      const displayName =
        (firstName || lastName)
          ? `${firstName}${firstName && lastName ? " " : ""}${lastName}`
          : username;

      return displayName.includes(q) || username.includes(q);
    });
  }, [estudiantesData, search]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );

  if (error)
    return <div className="p-4 text-destructive">Error: {error}</div>;

  return (
    <div className="flex flex-col gap-4 pb-24 mt-7 mb-24">
      {/* Header */}
      <div className="flex flex-col gap-1 items-start">
        <h1 className="text-xl font-extrabold">Listado de estudiantes</h1>
        <span className="text-sm text-muted-foreground">
          {estudiantesFiltrados.length} / {estudiantesData.length} estudiantes
        </span>
      </div>

      {/* Search */}
      <div className="card-base bg-card flex items-center gap-3 w-full">
        <Search className="w-5 h-5 text-muted-foreground" />
        <input
          type="text"
          placeholder="Buscar por nombre o usuario..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-transparent outline-none text-sm"
        />
      </div>

      {/* Listado */}
      <div className="flex flex-col gap-3">
        {estudiantesFiltrados.length === 0 && (
          <div className="text-sm text-muted-foreground">
            No se encontraron estudiantes con ese criterio.
          </div>
        )}

        {estudiantesFiltrados.map((est, index) => {
          const username = String(est.usuario__username ?? "");
          const firstName = String(est.usuario__first_name ?? "").trim();
          const lastName = String(est.usuario__last_name ?? "").trim();
          const displayName =
            (firstName || lastName)
              ? `${firstName}${firstName && lastName ? " " : ""}${lastName}`
              : username;
          const avatarInitial = displayName.charAt(0) || "?";
          const promedio = est.promedio_materia;

          return (
            <div
              key={est.usuario__id ?? username}
              role="button"
              tabIndex={0}
              onClick={() =>
                router.push(
                  `/listado-estudiantes/${id}/detalles-estudiante/${est.usuario__id ?? username}`
                )
              }
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  router.push(
                    `/listado-estudiantes/${id}/detalles-estudiante/${est.usuario__id ?? username}`
                  );
                }
              }}
              className="flex items-center gap-3 p-3 py-2 rounded-xl bg-accent hover:bg-accent/70 transition-all cursor-pointer"
            >
              {/* Posición */}
              <div className="w-8 h-8 flex items-center justify-center font-bold text-foreground">
                {index === 0 ? (
                  <img
                    src="https://d35aaqx5ub95lt.cloudfront.net/images/leagues/9e4f18c0bc42c7508d5fa5b18346af11.svg"
                    alt=""
                  />
                ) : index === 1 ? (
                  <img
                    src="https://d35aaqx5ub95lt.cloudfront.net/images/leagues/cc7b8f8582e9cfb88408ab851ec2e9bd.svg"
                    alt=""
                  />
                ) : index === 2 ? (
                  <img
                    src="https://d35aaqx5ub95lt.cloudfront.net/images/leagues/eef523c872b71178ef5acb2442d453a2.svg"
                    alt=""
                  />
                ) : (
                  `${index + 1}`
                )}
              </div>

              {/* Avatar */}
              <div className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-primary bg-muted-foreground/20 uppercase">
                {avatarInitial}
              </div>

              {/* Info */}
              <div className="flex-1">
                <div className="font-bold">{displayName}</div>
                <div className="text-sm text-muted-foreground">
                  Promedio:{" "}
                  {typeof promedio === "number"
                    ? promedio.toFixed(1)
                    : "0.0"}
                </div>
              </div>

              {/* XP */}
              <div className="flex items-center gap-1 font-bold gap-2">
                <img src="https://d35aaqx5ub95lt.cloudfront.net/images/profile/01ce3a817dd01842581c3d18debcbc46.svg" alt="" className="w-4" />
                {est.total_exp} XP
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
