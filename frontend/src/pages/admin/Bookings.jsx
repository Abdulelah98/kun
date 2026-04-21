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
import { Check, X, Loader2, Trash2, Phone, Mail } from "lucide-react";

const STATUS_META = {
  pending: { label: "قيد المراجعة", cls: "bg-amber-500/15 text-amber-300 border-amber-500/30" },
  confirmed: { label: "مؤكد", cls: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30" },
  rejected: { label: "مرفوض", cls: "bg-rose-500/15 text-rose-300 border-rose-500/30" },
  cancelled: { label: "ملغي", cls: "bg-white/10 text-white/50 border-white/10" },
};

const TYPE_LABEL = {
  desk: "مكتب مشترك",
  office: "مكتب خاص",
  meeting_room: "قاعة اجتماعات",
};

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
      await api.patch(`/admin/bookings/${id}`, { status });
      toast.success("تم تحديث الحالة");
      load();
    } catch (e) {
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
      toast.success("تم الحذف");
      load();
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
          <p className="text-white/50 text-sm mt-1">إدارة جميع طلبات الحجز</p>
        </div>
        <div className="flex gap-2">
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[170px] bg-white/[0.04] border-white/10 text-white">
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
            <SelectTrigger className="w-[170px] bg-white/[0.04] border-white/10 text-white">
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

      <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-white/[0.06] hover:bg-transparent">
              <TableHead className="text-white/60">النوع</TableHead>
              <TableHead className="text-white/60">الاسم</TableHead>
              <TableHead className="text-white/60">التواصل</TableHead>
              <TableHead className="text-white/60">التفاصيل</TableHead>
              <TableHead className="text-white/60">التاريخ</TableHead>
              <TableHead className="text-white/60">الحالة</TableHead>
              <TableHead className="text-white/60 text-left">إجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={7} className="text-center py-10 text-white/40">
                <Loader2 className="w-5 h-5 animate-spin inline" />
              </TableCell></TableRow>
            ) : items.length === 0 ? (
              <TableRow><TableCell colSpan={7} className="text-center py-10 text-white/40">
                لا توجد حجوزات.
              </TableCell></TableRow>
            ) : items.map((b) => {
              const meta = STATUS_META[b.status] || STATUS_META.pending;
              return (
                <TableRow key={b.id} className="border-white/[0.06]" data-testid={`booking-row-${b.id}`}>
                  <TableCell className="text-sm">{TYPE_LABEL[b.type] || b.type}</TableCell>
                  <TableCell className="font-semibold">{b.name}</TableCell>
                  <TableCell className="text-xs space-y-1">
                    <div className="flex items-center gap-1 text-white/70"><Phone className="w-3 h-3" />{b.phone}</div>
                    <div className="flex items-center gap-1 text-white/50"><Mail className="w-3 h-3" />{b.email}</div>
                  </TableCell>
                  <TableCell className="text-xs text-white/70 max-w-[220px]">
                    {b.type === "desk" && `عدد المكاتب: ${b.details?.num_desks}`}
                    {b.type === "office" && `مكتب: ${b.details?.office_id}`}
                    {b.type === "meeting_room" && (
                      <>
                        <div>قاعة: {b.details?.room_id}</div>
                        <div>{b.details?.date} — {b.details?.time_slot}</div>
                      </>
                    )}
                  </TableCell>
                  <TableCell className="text-xs text-white/50">
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
                          className="h-8 w-8 text-emerald-400 hover:bg-emerald-500/10"
                          data-testid={`booking-confirm-${b.id}`}>
                          <Check className="w-4 h-4" />
                        </Button>
                      )}
                      {b.status !== "rejected" && (
                        <Button size="icon" variant="ghost" disabled={busyId === b.id}
                          onClick={() => updateStatus(b.id, "rejected")}
                          className="h-8 w-8 text-rose-400 hover:bg-rose-500/10"
                          data-testid={`booking-reject-${b.id}`}>
                          <X className="w-4 h-4" />
                        </Button>
                      )}
                      <Button size="icon" variant="ghost" disabled={busyId === b.id}
                        onClick={() => remove(b.id)}
                        className="h-8 w-8 text-white/40 hover:text-rose-400 hover:bg-rose-500/10"
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
