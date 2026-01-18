import { Trophy, Crown, TrendingUp } from "lucide-react";
import { MOCK_LEAGUE_USERS, LEAGUES } from "@/lib/constants";
import { getRankingColegio } from "@/services/estudiante/apiRankingService";
import Avatar from "react-nice-avatar";
import { useEffect, useState } from "react";

export function LeagueScreen() {
  const [rankingData, setRankingData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    getRankingColegio()
      .then((data) => {
        if (!mounted) return;
        setRankingData(data);
      })
      .catch((err) => {
        if (!mounted) return;
        setError(err);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => (mounted = false);
  }, []);

  const users = rankingData?.ranking ?? [];
  const currentUser = users.find((u) => u.es_usuario_actual);
  const currentLeague = currentUser
    ? LEAGUES.find((l) => currentUser.exp >= l.minXp && currentUser.exp <= l.maxXp) ||
      LEAGUES.find((l) => l.name === currentUser.liga)
    : null;
  const nextLeague = currentUser
    ? LEAGUES.find((l) => l.minXp > (currentUser.exp ?? 0))
    : null;

  if (loading) return <div className=" min-h-screen flex flex-col justify-center items-center">Cargando ranking...</div>;
  if (error) return <div>Error al cargar el ranking.</div>;
  if (!currentUser || !currentLeague) {
    return <div>Error: No se pudo cargar la información de la liga.</div>;
  }

  const initials = (name = "") =>
    (name || "")
      .split(" ")
      .filter(Boolean)
      .map((p) => p[0]?.toUpperCase())
      .slice(0, 2)
      .join("");

  const parseAvatarStyle = (s) => {
    if (!s) return null;
    try {
      return JSON.parse(s.replace(/'/g, '"'));
    } catch (e) {
      return null;
    }
  };

  return (
    <div className="px-3 py-3 pb-24">
      <div className=" rounded-2xl p-6">
        <div className="flex justify-center items-center ">
          {LEAGUES.map((league, index) => (
            <div key={league.name} className="flex flex-col items-center">
              <div
                className={`w-32 h-32 rounded-2xl flex items-center justify-center p-3 `}
              >
                <img
                  src={league.icon}
                  alt={league.name}
                  className={`${
                    league.name === currentLeague.name
                      ? "w-28 h-28"
                      : "w-20 h-20"
                  }`}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">{currentLeague.name}</h2>
          <p className=" text-sm">
            {rankingData?.colegio ?? ""} — {rankingData?.total_estudiantes ?? ""} estudiantes
          </p>
        </div>
      </div>

      <div className=" ">
        <div className="space-y-2">
          {users.map((user) => (
            <div
              key={user.username}
              className={`flex items-center gap-3 p-3 py-2 rounded-xl transition-all ${
                user.es_usuario_actual
                  ? "bg-primary/10 border-2 border-primary"
                  : "bg-accent hover:bg-accent/70"
              }`}
            >
              <div className="w-8 h-8 flex items-center justify-center font-bold text-foreground">
                {user.posicion === 1 ? (
                  <img
                    src="https://d35aaqx5ub95lt.cloudfront.net/images/leagues/9e4f18c0bc42c7508d5fa5b18346af11.svg"
                    alt=""
                  />
                ) : user.posicion === 2 ? (
                  <img
                    src="https://d35aaqx5ub95lt.cloudfront.net/images/leagues/cc7b8f8582e9cfb88408ab851ec2e9bd.svg"
                    alt=""
                  />
                ) : user.posicion === 3 ? (
                  <img
                    src="https://d35aaqx5ub95lt.cloudfront.net/images/leagues/eef523c872b71178ef5acb2442d453a2.svg"
                    alt=""
                  />
                ) : (
                  `${user.posicion}`
                )}
              </div>

              <div className="w-12 h-12 rounded-full overflow-hidden flex items-center justify-center font-bold text-primary bg-muted-foreground/20">
                {user.avatar_style ? (
                  (() => {
                    const cfg = parseAvatarStyle(user.avatar_style);
                    return cfg ? (
                      <Avatar {...cfg} className="w-12 h-12" />
                    ) : (
                      <span>{initials(user.nombre_completo)}</span>
                    );
                  })()
                ) : (
                  <span>{initials(user.nombre_completo)}</span>
                )}
              </div>

              <div className="flex-1">
                <div
                  className={`font-bold ${
                    user.es_usuario_actual ? "text-primary" : "text-foreground"
                  }`}
                >
                  {user.nombre_completo}
                </div>
                <div className="text-sm text-muted-foreground">
                  {user.exp} XP
                </div>
              </div>

              {user.es_usuario_actual && (
                <div className="px-2 py-1 bg-primary text-white text-xs font-bold rounded-full">
                  Tú
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
