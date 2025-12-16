import { Lightbulb } from "lucide-react";

export function AnalysisScreen({ analytics }) {
  return (
    <div className="space-y-4 px-3 py-3">
      <h2 className="text-2xl font-bold text-foreground">Análisis de Rendimiento</h2>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-card border border-border rounded-2xl p-4">
          <div className="text-3xl font-bold text-primary">{analytics.accuracy}%</div>
          <div className="text-sm text-muted-foreground">Precisión</div>
        </div>

        <div className="bg-card border border-border rounded-2xl p-4">
          <div className="text-3xl font-bold text-foreground">{analytics.totalAttempts}</div>
          <div className="text-sm text-muted-foreground">Intentos</div>
        </div>
      </div>

      <div className="bg-card border border-border rounded-2xl p-4">
        <div className="font-bold text-foreground mb-2">Tema más débil</div>
        <div className="text-muted-foreground">{analytics.weakestTopic}</div>
      </div>

      <div className="bg-primary/10 border border-primary rounded-2xl p-4">
        <div className="flex gap-2">
          <Lightbulb className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
          <div>
            <div className="font-bold text-primary mb-1">Consejo</div>
            <div className="text-sm text-foreground">{analytics.advice}</div>
          </div>
        </div>
      </div>
    </div>
  );
}