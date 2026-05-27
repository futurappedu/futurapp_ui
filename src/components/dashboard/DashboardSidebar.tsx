import { LayoutDashboard, Compass, ListChecks, GraduationCap, FileText, Lock } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

interface NavItem {
  label: string;
  icon: typeof LayoutDashboard;
  path: string | null;
  badge?: string;
  locked?: boolean;
}

const navItems: NavItem[] = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/test_home" },
  { label: "Exploración", icon: Compass, path: "/scholarship_search" },
  { label: "Mi Shortlist", icon: ListChecks, path: null, badge: "0/5" },
  { label: "Becas", icon: GraduationCap, path: null, locked: true },
  { label: "Aplicaciones", icon: FileText, path: null, locked: true },
];

interface DashboardSidebarProps {
  userName: string;
  completionPercent: number;
}

export function DashboardSidebar({ userName, completionPercent }: DashboardSidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <aside className="hidden lg:flex w-64 shrink-0 border-r border-border bg-surface flex-col sticky top-0 h-screen">
      <div className="p-6">
        <div className="font-display text-2xl font-extrabold tracking-tight text-brand-accent italic">
          UniMatch
        </div>
        <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground mt-1 font-bold">
          By International Learning
        </p>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        {navItems.map((it) => {
          const Icon = it.icon;
          const isActive = it.path === location.pathname;
          return (
            <button
              key={it.label}
              onClick={() => it.path && navigate(it.path)}
              disabled={!it.path}
              className={[
                "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors text-left",
                isActive
                  ? "bg-gray-100 text-foreground font-semibold"
                  : "text-muted-foreground hover:bg-gray-100/60 font-medium",
                !it.path ? "opacity-50 cursor-default" : "cursor-pointer",
              ].join(" ")}
            >
              <Icon className="size-4 shrink-0" strokeWidth={2} />
              <span>{it.label}</span>
              {it.badge && (
                <span className="ml-auto bg-brand-accent text-brand-accent-foreground text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                  {it.badge}
                </span>
              )}
              {it.locked && <Lock className="ml-auto size-3" />}
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border">
        <div className="bg-brand-deep text-brand-deep-foreground rounded-2xl p-4">
          <p className="text-xs text-white/60 mb-2">Perfil del Estudiante</p>
          <p className="text-sm font-semibold truncate">{userName}</p>
          <div className="mt-3 h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full bg-brand-accent rounded-full transition-all" style={{ width: `${completionPercent}%` }} />
          </div>
          <p className="text-[10px] mt-2 text-white/60 font-mono">{completionPercent}% perfil completado</p>
        </div>
      </div>
    </aside>
  );
}
