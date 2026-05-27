import { type LucideIcon } from "lucide-react";

export type PillarStatus = "done" | "in_progress" | "next" | "locked";

interface PillarCardProps {
  icon: LucideIcon;
  iconBg: string;
  iconColor: string;
  title: string;
  description: string;
  progress: number;
  status: PillarStatus;
  onAction?: () => void;
}

export function PillarCard({
  icon: Icon,
  iconBg,
  iconColor,
  title,
  description,
  progress,
  status,
  onAction,
}: PillarCardProps) {
  const isNext = status === "next";
  const isLocked = status === "locked";
  const isDone = status === "done";

  return (
    <div
      className={[
        "relative bg-surface border rounded-2xl p-5 transition-all",
        isNext
          ? "border-brand-accent/40 shadow-card"
          : "border-border shadow-card hover:border-brand-accent/40",
        isLocked ? "bg-surface-muted border-dashed opacity-70" : "",
      ].join(" ")}
    >
      {isNext && (
        <span className="absolute -top-2 right-4 bg-brand-accent text-brand-accent-foreground text-[10px] font-bold px-2 py-0.5 rounded-md tracking-wider">
          SIGUIENTE
        </span>
      )}

      <div
        className="size-10 rounded-xl flex items-center justify-center mb-4"
        style={{ backgroundColor: iconBg, color: iconColor }}
      >
        <Icon className="size-5" strokeWidth={2} />
      </div>

      <h3 className="font-display font-bold text-[15px] leading-tight text-foreground mb-1">{title}</h3>
      <p className="text-xs text-muted-foreground mb-4 leading-relaxed">{description}</p>

      {isNext ? (
        <button
          onClick={onAction}
          className="w-full py-2 bg-brand-accent text-brand-accent-foreground text-xs font-bold rounded-lg hover:opacity-90 transition-opacity"
        >
          Continuar quiz
        </button>
      ) : isLocked ? (
        <p className="text-[10px] text-muted-foreground font-medium">Próximamente disponible</p>
      ) : (
        <div className="flex items-center gap-2">
          <div className="flex-1 h-1 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all"
              style={{
                width: `${progress}%`,
                backgroundColor: isDone ? "hsl(var(--match-green))" : "hsl(var(--brand-accent))",
              }}
            />
          </div>
          <span
            className={[
              "text-[10px] font-bold uppercase tracking-wider",
              isDone ? "text-match-green" : "text-muted-foreground",
            ].join(" ")}
          >
            {isDone ? "Listo" : `${progress}%`}
          </span>
        </div>
      )}
    </div>
  );
}
