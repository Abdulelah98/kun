import { NavLink, Outlet, useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  CalendarCheck,
  MessagesSquare,
  Building2,
  Presentation,
  Users2,
  Sliders,
  FileText,
  LogOut,
  Loader2,
  Sofa,
  ExternalLink,
  Image as ImageIcon,
  Clock,
  Moon,
  Sun,
} from "lucide-react";
import { toast } from "sonner";

const NAV = [
  { to: "/admin", label: "نظرة عامة", icon: LayoutDashboard, end: true, roles: ["admin", "staff"] },
  { to: "/admin/bookings", label: "الحجوزات", icon: CalendarCheck, roles: ["admin", "staff"] },
  { to: "/admin/availability", label: "أوقات العمل", icon: Clock, roles: ["admin"] },
  { to: "/admin/messages", label: "الرسائل", icon: MessagesSquare, roles: ["admin", "staff"] },
  { to: "/admin/offices", label: "المكاتب الخاصة", icon: Building2, roles: ["admin"] },
  { to: "/admin/meeting-rooms", label: "قاعات الاجتماعات", icon: Presentation, roles: ["admin"] },
  { to: "/admin/shared-desks", label: "المكاتب المشتركة", icon: Sofa, roles: ["admin"] },
  { to: "/admin/media", label: "مكتبة الصور", icon: ImageIcon, roles: ["admin"] },
  { to: "/admin/content", label: "إدارة المحتوى", icon: FileText, roles: ["admin"] },
  { to: "/admin/settings", label: "الإعدادات", icon: Sliders, roles: ["admin"] },
  { to: "/admin/users", label: "المستخدمون", icon: Users2, roles: ["admin"] },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const { theme, toggle: toggleTheme } = useTheme();
  const navigate = useNavigate();

  if (user === null) {
    return (
      <div className="min-h-screen bg-[var(--background)] flex items-center justify-center">
        <Loader2 className="w-6 h-6 text-[var(--muted-foreground)] animate-spin" />
      </div>
    );
  }
  if (user === false) return <Navigate to="/admin/login" replace />;

  const role = user.role;
  const visibleNav = NAV.filter((i) => i.roles.includes(role));

  const doLogout = async () => {
    await logout();
    toast.success("تم تسجيل الخروج");
    navigate("/admin/login", { replace: true });
  };

  return (
    <div dir="rtl" className="min-h-screen bg-[var(--background)] text-[var(--foreground)] font-cairo flex">
      <aside className="w-64 shrink-0 border-l border-[var(--border)] bg-[var(--card)] h-screen sticky top-0 flex flex-col">
        <div className="px-5 py-5 border-b border-[var(--border)] flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-[#f47424] flex items-center justify-center text-white font-black text-lg">K</div>
            <div>
              <div className="text-sm font-bold leading-tight">KUN Admin</div>
              <div className="text-[11px] text-[var(--muted-foreground)]">لوحة التحكم</div>
            </div>
          </div>
          <button
            onClick={toggleTheme}
            data-testid="theme-toggle-btn"
            aria-label={theme === "dark" ? "الوضع الفاتح" : "الوضع الداكن"}
            className="w-9 h-9 rounded-lg border border-[var(--border)] flex items-center justify-center hover:bg-[var(--accent)] transition"
          >
            {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {visibleNav.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              data-testid={`admin-nav-${to.replace(/\//g, "-")}`}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition ${
                  isActive
                    ? "bg-[#f47424]/15 text-[#f47424] border border-[#f47424]/25"
                    : "text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--accent)]"
                }`
              }
            >
              <Icon className="w-4 h-4" />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="p-3 border-t border-[var(--border)] space-y-2">
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--accent)]"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            عرض الموقع
          </a>
          <div className="px-3 py-2 rounded-lg bg-[var(--accent)] border border-[var(--border)]">
            <div className="text-xs font-semibold truncate">{user.name}</div>
            <div className="text-[11px] text-[var(--muted-foreground)] truncate">{user.email}</div>
            <div className="text-[10px] text-[#f47424] mt-0.5 uppercase tracking-wider">{user.role}</div>
          </div>
          <Button
            onClick={doLogout}
            variant="ghost"
            className="w-full justify-start text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--accent)]"
            data-testid="admin-logout-btn"
          >
            <LogOut className="w-4 h-4 ml-2" />
            تسجيل الخروج
          </Button>
        </div>
      </aside>

      <main className="flex-1 min-w-0">
        <div className="max-w-7xl mx-auto px-8 py-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
