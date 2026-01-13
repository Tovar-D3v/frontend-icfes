"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Flame } from "lucide-react";
import { getRankingColegio } from "../../../services/profesor/ranking-colegio";
import { LEAGUES } from "@/lib/constants";

function getLeagueInfo(nombreLiga) {
  return LEAGUES.find((l) => l.name === nombreLiga);
}

export default function LigaEstudiantesPage() {
  const { id } = useParams();
  const [rankingData, setRankingData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;

    const stored = localStorage.getItem("asignacion_seleccionada");
    if (!stored) {
      setError("No hay asignación seleccionada");
      return;
    }

    let asignacion;
    try {
      asignacion = JSON.parse(stored);
    } catch {
      setError("Asignación inválida");
      return;
    }

    if (!asignacion?.curso_id) {
      setError("No se encontró curso");
      return;
    }

    setLoading(true);

    getRankingColegio(asignacion.curso_id)
      .then(setRankingData)
      .catch((err) => setError(err?.message ?? String(err)))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );

  if (error) return <div className="p-4 text-destructive">Error: {error}</div>;

  if (!rankingData) return null;

  return (
    <div className="flex flex-col gap-6 pb-24">
      {/* Header */}
      

      {/* Podio */}
      <div className="flex justify-center gap-6 mt-5">
        {rankingData.ranking.slice(0, 3).map((est) => {
          const league = getLeagueInfo(est.liga);
          return (
            <div
              key={est.username}
              className="flex flex-col items-center gap-2"
            >
              <img
                src={league?.icon}
                alt={league?.name}
                className="w-24 h-24"
              />
              <span className="font-bold">{est.nombre || est.username}</span>
              <span className="text-sm text-muted-foreground">
                {est.exp_total} XP
              </span>
            </div>
          );
        })}
      </div>

      <div className="flex flex-col gap-1 w-full items-center">
        <h1 className="text-xl font-extrabold">Liga de estudiantes</h1>
        <span className="text-sm text-muted-foreground">
          {rankingData.colegio}
        </span>
        <span>{rankingData.total_estudiantes} estudiantes</span>
      </div>

      {/* Ranking */}
      <div className="flex flex-col gap-3">
        {rankingData.ranking.map((est, index) => {
          const league = getLeagueInfo(est.liga);
          const esTop = est.posicion <= 3;

          return (
            <div
              key={est.username}
              className={`flex items-center gap-3 p-3 py-2 rounded-xl transition-all bg-accent hover:bg-accent/70`}
            >
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

              {/* Avatar simple */}
              <div className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-primary bg-muted-foreground/20 capitalize">
                {(est.nombre || est.username)[0]}
              </div>

              {/* Info */}
              <div className="flex-1">
                <div className="font-bold">{est.nombre || est.username}</div>
                <div className="text-sm text-muted-foreground">
                  {est.curso} · Nivel {est.nivel}
                </div>
              </div>

              {/* XP */}
              <div className="text-right">
                <div className="font-bold">{est.exp_total} XP</div>
                <div className="text-xs text-muted-foreground">
                  Liga {est.liga}
                </div>
              </div>

              <div className="w-8 text-center font-bold">
                {esTop ? (
                  <img
                    src={league?.icon}
                    alt={league?.name}
                    className="w-8 h-8"
                  />
                ) : (
                  est.posicion
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
