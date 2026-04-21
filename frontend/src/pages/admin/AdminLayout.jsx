import { NavLink, Outlet, useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
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
} from "lucide-react";
import { toast } from "sonner";

const NAV = [
  { to: "/admin", label: "نظرة عامة", icon: LayoutDashboard, end: true, roles: ["admin", "staff"] },
  { to: "/admin/bookings", label: "الحجوزات", icon: CalendarCheck, roles: ["admin", "staff"] },
  { to: "/admin/messages", label: "الرسائل", icon: MessagesSquare, roles: ["admin", "staff"] },
  { to: "/admin/offices", label: "المكاتب الخاصة", icon: Building2, roles: ["admin"] },
  { to: "/admin/meeting-rooms", label: "قاعات الاجتماعات", icon: Presentation, roles: ["admin"] },
  { to: "/admin/shared-desks", label: "المكاتب المشتركة", icon: Sofa, roles: ["admin"] },
  { to: "/admin/content", label: "إدارة المحتوى", icon: FileText, roles: ["admin"] },
  { to: "/admin/settings", label: "الإعدادات", icon: Sliders, roles: ["admin"] },
  { to: "/admin/users", label: "المستخدمون", icon: Users2, roles: ["admin"] },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (user === null) {
    return (
      <div className="min-h-screen bg-[#0a0a0b] flex items-center justify-center">
        <Loader2 className="w-6 h-6 text-white/60 animate-spin" />
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
    <div dir="rtl" className="min-h-screen bg-[#0a0a0b] text-white font-cairo flex">
      {/* Sidebar */}
      <aside className="w-64 shrink-0 border-l border-white/[0.06] bg-[#0f0f11] h-screen sticky top-0 flex flex-col">
        <div className="px-5 py-5 border-b border-white/[0.06]">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-[#f47424] flex items-center justify-center text-white font-black text-lg">K</div>
            <div>
              <div className="text-sm font-bold leading-tight">KUN Admin</div>
              <div className="text-[11px] text-white/40">لوحة التحكم</div>
            </div>
          </div>
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
                    : "text-white/70 hover:text-white hover:bg-white/[0.04]"
                }`
              }
            >
              <Icon className="w-4 h-4" />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="p-3 border-t border-white/[0.06] space-y-2">
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-white/50 hover:text-white hover:bg-white/[0.04]"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            عرض الموقع
          </a>
          <div className="px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.06]">
            <div className="text-xs font-semibold truncate">{user.name}</div>
            <div className="text-[11px] text-white/40 truncate">{user.email}</div>
            <div className="text-[10px] text-[#f47424] mt-0.5 uppercase tracking-wider">{user.role}</div>
          </div>
          <Button
            onClick={doLogout}
            variant="ghost"
            className="w-full justify-start text-white/70 hover:text-white hover:bg-white/[0.05]"
            data-testid="admin-logout-btn"
          >
            <LogOut className="w-4 h-4 ml-2" />
            تسجيل الخروج
          </Button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 min-w-0">
        <div className="max-w-7xl mx-auto px-8 py-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
