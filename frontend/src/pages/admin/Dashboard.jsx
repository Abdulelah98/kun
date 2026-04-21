import { useEffect, useState } from "react";
import api from "@/lib/api";
import { CalendarCheck, MessagesSquare, Building2, Clock, CheckCircle2, Mail } from "lucide-react";

function StatCard({ label, value, sub, icon: Icon, accent }) {
  return (
    <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6 hover:border-white/10 transition">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-xs text-white/50 mb-2">{label}</div>
          <div className="text-3xl font-bold">{value}</div>
          {sub && <div className="text-xs text-white/40 mt-2">{sub}</div>}
        </div>
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${accent}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.get("/admin/stats").then((r) => setStats(r.data)).catch(() => {});
  }, []);

  return (
    <div data-testid="admin-dashboard">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">نظرة عامة</h1>
        <p className="text-white/50 text-sm mt-1">ملخص نشاط منصة KUN</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard
          label="إجمالي الحجوزات"
          value={stats?.bookings?.total ?? "—"}
          icon={CalendarCheck}
          accent="bg-[#f47424]/10 text-[#f47424]"
        />
        <StatCard
          label="حجوزات قيد المراجعة"
          value={stats?.bookings?.pending ?? "—"}
          icon={Clock}
          accent="bg-amber-500/10 text-amber-400"
        />
        <StatCard
          label="حجوزات مؤكدة"
          value={stats?.bookings?.confirmed ?? "—"}
          icon={CheckCircle2}
          accent="bg-emerald-500/10 text-emerald-400"
        />
        <StatCard
          label="إجمالي الرسائل"
          value={stats?.messages?.total ?? "—"}
          icon={MessagesSquare}
          accent="bg-sky-500/10 text-sky-400"
        />
        <StatCard
          label="رسائل جديدة"
          value={stats?.messages?.new ?? "—"}
          icon={Mail}
          accent="bg-rose-500/10 text-rose-400"
        />
        <StatCard
          label="المكاتب المتاحة"
          value={`${stats?.offices?.available ?? "—"}/${stats?.offices?.total ?? "—"}`}
          icon={Building2}
          accent="bg-violet-500/10 text-violet-400"
        />
      </div>
    </div>
  );
}
