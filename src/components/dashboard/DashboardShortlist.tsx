import { Plus, Lock } from "lucide-react";

const TOTAL_SLOTS = 5;

export function DashboardShortlist() {
  const filled = 0;

  return (
    <div className="bg-brand-deep text-brand-deep-foreground rounded-3xl p-6 sticky top-8">
      <div className="flex items-baseline justify-between mb-1">
        <h2 className="font-display text-lg font-bold">Mi Shortlist</h2>
        <span className="text-[11px] text-white/50 font-mono tabular-nums">
          {filled}/{TOTAL_SLOTS}
        </span>
      </div>
      <p className="text-xs text-white/60 mb-6 leading-relaxed">
        Define tus 5 opciones finales para desbloquear requisitos, fechas y tu plan de aplicación.
      </p>

      <ol className="space-y-2.5">
        {Array.from({ length: TOTAL_SLOTS }).map((_, i) => (
          <li key={i}>
            <div className="w-full flex items-center gap-3 p-3 bg-white/[0.03] rounded-xl border border-dashed border-white/15">
              <span className="size-6 flex items-center justify-center rounded bg-white/10 text-[10px] font-bold text-white/50 shrink-0">
                {i + 1}
              </span>
              <span className="text-xs font-medium text-white/40 italic">
                Selecciona una universidad…
              </span>
              <Plus className="ml-auto size-4 text-white/30 shrink-0" />
            </div>
          </li>
        ))}
      </ol>

      <button
        disabled
        className="w-full mt-6 py-3 bg-white text-brand-deep rounded-xl text-xs font-bold disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        <Lock className="size-3.5" />
        Desbloquear calendario de aplicación
      </button>
      <p className="text-[10px] text-center text-white/50 mt-3 leading-relaxed">
        Faltan {TOTAL_SLOTS - filled} selecciones para activar la etapa 2.
      </p>
    </div>
  );
}
