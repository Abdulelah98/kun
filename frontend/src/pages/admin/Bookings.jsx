import { useEffect, useState } from "react";
import api, { formatApiError } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import { Check, X, Loader2, Trash2, Phone, Mail, Building2, CalendarDays } from "lucide-react";

const STATUS_META = {
  pending: { label: "قيد المراجعة", cls: "bg-amber-500/15 text-amber-500 border-amber-500/30 dark:text-amber-300" },
  confirmed: { label: "مؤكد", cls: "bg-emerald-500/15 text-emerald-600 border-emerald-500/30 dark:text-emerald-300" },
  rejected: { label: "مرفوض", cls: "bg-rose-500/15 text-rose-600 border-rose-500/30 dark:text-rose-300" },
  cancelled: { label: "ملغي", cls: "bg-[var(--muted)] text-[var(--muted-foreground)] border-[var(--border)]" },
};

const TYPE_LABEL = {
  desk: "مكتب مشترك",
  office: "مكتب خاص",
  meeting_room: "قاعة اجتماعات",
};

function DetailsCell({ b }) {
  const d = b.details || {};
  if (b.type === "desk") {
    return <span className="inline-flex items-center gap-1"><Building2 className="w-3 h-3" />عدد المكاتب: <b>{d.num_desks ?? "-"}</b></span>;
  }
  if (b.type === "office") {
    return <span className="inline-flex items-center gap-1"><Building2 className="w-3 h-3" />المكتب: <b>{d.office_name || d.office_id || "-"}</b></span>;
  }
  if (b.type === "meeting_room") {
    return (
      <div className="space-y-0.5">
        <div className="inline-flex items-center gap-1"><Building2 className="w-3 h-3" />القاعة: <b>{d.room_name || d.room_id || "-"}</b></div>
        <div className="inline-flex items-center gap-1 text-[11px] opacity-70"><CalendarDays className="w-3 h-3" />{d.date} — {d.time_slot}</div>
      </div>
    );
  }
  return null;
}

export default function Bookings() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [busyId, setBusyId] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const params = {};
      if (statusFilter !== "all") params.status = statusFilter;
      if (typeFilter !== "all") params.type = typeFilter;
      const { data } = await api.get("/admin/bookings", { params });
      setItems(data);
    } catch (e) {
      toast.error(formatApiError(e));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter, typeFilter]);

  const updateStatus = async (id, status) => {
    setBusyId(id);
    try {
      const { data } = await api.patch(`/admin/bookings/${id}`, { status });
      // Backend returns {success, message, data: booking}. Keep backward-compat if older shape.
      const updated = data && data.data ? data.data : data;
      const msg = (data && data.message) ||
        (status === "confirmed" ? "تم تأكيد الحجز" :
         status === "rejected" ? "تم رفض الحجز" :
         "تم تحديث الحالة");
      // Optimistic inline update without full refetch
      setItems((prev) => prev.map((b) => (b.id === id ? { ...b, ...updated } : b)));
      toast.success(msg);
    } catch (e) {
      // Only log real errors, don't swallow successes
      // eslint-disable-next-line no-console
      console.error("Booking status update failed", e);
      toast.error(formatApiError(e));
    } finally {
      setBusyId(null);
    }
  };

  const remove = async (id) => {
    if (!window.confirm("هل تريد حذف هذا الحجز نهائياً؟")) return;
    setBusyId(id);
    try {
      await api.delete(`/admin/bookings/${id}`);
      setItems((prev) => prev.filter((b) => b.id !== id));
      toast.success("تم الحذف");
    } catch (e) {
      toast.error(formatApiError(e));
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div data-testid="admin-bookings-page">
      <div className="mb-6 flex items-end justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-bold">الحجوزات</h1>
          <p className="text-[var(--muted-foreground)] text-sm mt-1">إدارة جميع طلبات الحجز</p>
        </div>
        <div className="flex gap-2">
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[170px] bg-[var(--accent)] border-[var(--border)]">
              <SelectValue placeholder="النوع" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">كل الأنواع</SelectItem>
              <SelectItem value="desk">مكتب مشترك</SelectItem>
              <SelectItem value="office">مكتب خاص</SelectItem>
              <SelectItem value="meeting_room">قاعة اجتماعات</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[170px] bg-[var(--accent)] border-[var(--border)]">
              <SelectValue placeholder="الحالة" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">كل الحالات</SelectItem>
              <SelectItem value="pending">قيد المراجعة</SelectItem>
              <SelectItem value="confirmed">مؤكد</SelectItem>
              <SelectItem value="rejected">مرفوض</SelectItem>
              <SelectItem value="cancelled">ملغي</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-[var(--border)] hover:bg-transparent">
              <TableHead className="text-[var(--muted-foreground)]">النوع</TableHead>
              <TableHead className="text-[var(--muted-foreground)]">الاسم</TableHead>
              <TableHead className="text-[var(--muted-foreground)]">التواصل</TableHead>
              <TableHead className="text-[var(--muted-foreground)]">التفاصيل</TableHead>
              <TableHead className="text-[var(--muted-foreground)]">التاريخ</TableHead>
              <TableHead className="text-[var(--muted-foreground)]">الحالة</TableHead>
              <TableHead className="text-[var(--muted-foreground)] text-left">إجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={7} className="text-center py-10 text-[var(--muted-foreground)]">
                <Loader2 className="w-5 h-5 animate-spin inline" />
              </TableCell></TableRow>
            ) : items.length === 0 ? (
              <TableRow><TableCell colSpan={7} className="text-center py-10 text-[var(--muted-foreground)]">
                لا توجد حجوزات.
              </TableCell></TableRow>
            ) : items.map((b) => {
              const meta = STATUS_META[b.status] || STATUS_META.pending;
              return (
                <TableRow key={b.id} className="border-[var(--border)]" data-testid={`booking-row-${b.id}`}>
                  <TableCell className="text-sm">{TYPE_LABEL[b.type] || b.type}</TableCell>
                  <TableCell className="font-semibold">{b.name}</TableCell>
                  <TableCell className="text-xs space-y-1">
                    <div className="flex items-center gap-1"><Phone className="w-3 h-3" />{b.phone}</div>
                    <div className="flex items-center gap-1 opacity-70"><Mail className="w-3 h-3" />{b.email}</div>
                  </TableCell>
                  <TableCell className="text-xs max-w-[260px]">
                    <DetailsCell b={b} />
                  </TableCell>
                  <TableCell className="text-xs opacity-70">
                    {new Date(b.created_at).toLocaleString("ar-SA")}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={meta.cls}>{meta.label}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1.5 justify-start">
                      {b.status !== "confirmed" && (
                        <Button size="icon" variant="ghost" disabled={busyId === b.id}
                          onClick={() => updateStatus(b.id, "confirmed")}
                          className="h-8 w-8 text-emerald-500 hover:bg-emerald-500/10"
                          data-testid={`booking-confirm-${b.id}`}>
                          {busyId === b.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                        </Button>
                      )}
                      {b.status !== "rejected" && (
                        <Button size="icon" variant="ghost" disabled={busyId === b.id}
                          onClick={() => updateStatus(b.id, "rejected")}
                          className="h-8 w-8 text-rose-500 hover:bg-rose-500/10"
                          data-testid={`booking-reject-${b.id}`}>
                          <X className="w-4 h-4" />
                        </Button>
                      )}
                      <Button size="icon" variant="ghost" disabled={busyId === b.id}
                        onClick={() => remove(b.id)}
                        className="h-8 w-8 text-[var(--muted-foreground)] hover:text-rose-500 hover:bg-rose-500/10"
                        data-testid={`booking-delete-${b.id}`}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
