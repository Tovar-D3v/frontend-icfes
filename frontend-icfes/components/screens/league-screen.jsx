import { Trophy, Crown, TrendingUp } from "lucide-react";
import { MOCK_LEAGUE_USERS, LEAGUES } from "@/lib/constants";

export function LeagueScreen() {
  const currentUser = MOCK_LEAGUE_USERS.find((u) => u.isCurrentUser);
  const currentLeague = currentUser
    ? LEAGUES.find(
        (l) => currentUser.xp >= l.minXp && currentUser.xp <= l.maxXp
      )
    : null;
  const nextLeague = currentUser
    ? LEAGUES.find((l) => l.minXp > currentUser.xp)
    : null;


  if (!currentUser || !currentLeague) {
    return <div>Error: No se pudo cargar la información de la liga.</div>;
  }

  return (
    <div className="px-3 py-3 pb-24">
      {/* Nueva sección de ligas con diseño mejorado */}
      <div className=" rounded-2xl p-6">
        {/* Iconos de ligas */}
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
          <h2 className="text-2xl font-bold mb-2">División Oro</h2>
          <p className=" text-sm">
            Los primeros 10 avanzan a la siguiente división
          </p>
          <div className="mt-1 px-4 py-1 rounded-full text-xl font-bold inline-block">
            4 días
          </div>
        </div>
      </div>

      <div className=" ">
        <div className="space-y-2">
          {MOCK_LEAGUE_USERS.map((user, index) => (
            <div
              key={user.id}
              className={`flex items-center gap-3 p-3 py-2 rounded-xl transition-all ${
                user.isCurrentUser
                  ? "bg-primary/10 border-2 border-primary"
                  : "bg-accent hover:bg-accent/70"
              }`}
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

              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-primary bg-muted-foreground/20`}
              >
                {user.avatar}
              </div>

              <div className="flex-1">
                <div
                  className={`font-bold ${
                    user.isCurrentUser ? "text-primary" : "text-foreground"
                  }`}
                >
                  {user.name}
                </div>
                <div className="text-sm text-muted-foreground">
                  {user.xp} XP
                </div>
              </div>

              {user.isCurrentUser && (
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
