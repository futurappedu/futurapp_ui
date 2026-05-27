interface MatchCardProps {
  country: string;
  name: string;
  score: number;
  description: string;
  tags?: string[];
  primaryAction: string;
  onPrimaryAction?: () => void;
  secondaryAction?: string;
  onSecondaryAction?: () => void;
}

export function MatchCard({
  country,
  name,
  score,
  description,
  tags,
  primaryAction,
  onPrimaryAction,
  secondaryAction,
  onSecondaryAction,
}: MatchCardProps) {
  return (
    <article className="bg-surface border border-border rounded-2xl p-5 flex gap-5 hover:shadow-elevated transition-shadow">
      <div className="w-32 h-32 rounded-xl shrink-0 bg-gradient-to-br from-brand-deep/20 to-brand-accent/20 flex items-center justify-center border border-border">
        <span className="text-3xl font-display font-extrabold text-brand-accent/40">
          {name.charAt(0)}
        </span>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start gap-4">
          <div className="min-w-0">
            <span className="text-[10px] font-bold text-brand-accent uppercase tracking-[0.18em]">
              {country}
            </span>
            <h3 className="font-display text-xl font-bold mt-1 truncate">{name}</h3>
          </div>
          <div className="text-right shrink-0">
            <div className="font-display text-3xl font-extrabold text-match-green leading-none tabular-nums">
              {score}%
            </div>
            <div className="text-[10px] font-bold text-muted-foreground uppercase mt-1">Match score</div>
          </div>
        </div>
        <p className="text-sm text-muted-foreground mt-2 line-clamp-2 leading-relaxed">{description}</p>
        <div className="flex flex-wrap gap-2 mt-4 items-center">
          <button
            onClick={onPrimaryAction}
            className="px-3 py-1.5 bg-brand-deep text-brand-deep-foreground rounded-lg text-xs font-bold hover:opacity-90 transition-opacity"
          >
            {primaryAction}
          </button>
          {secondaryAction && (
            <button
              onClick={onSecondaryAction}
              className="px-3 py-1.5 border border-border rounded-lg text-xs font-bold hover:bg-gray-50 transition-colors"
            >
              {secondaryAction}
            </button>
          )}
          {tags?.map((t) => (
            <span
              key={t}
              className="px-2 py-1 bg-gray-100 rounded text-[10px] font-medium text-muted-foreground"
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}
