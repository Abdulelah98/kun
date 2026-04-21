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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Loader2, Trash2, Eye, Phone, Mail } from "lucide-react";

const STATUS_META = {
  new: { label: "جديد", cls: "bg-rose-500/15 text-rose-300 border-rose-500/30" },
  read: { label: "تمت القراءة", cls: "bg-sky-500/15 text-sky-300 border-sky-500/30" },
  replied: { label: "تم الرد", cls: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30" },
  archived: { label: "مؤرشف", cls: "bg-white/10 text-white/50 border-white/10" },
};

export default function Messages() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [busyId, setBusyId] = useState(null);
  const [selected, setSelected] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const params = {};
      if (statusFilter !== "all") params.status = statusFilter;
      const { data } = await api.get("/admin/messages", { params });
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
  }, [statusFilter]);

  const updateStatus = async (id, status) => {
    setBusyId(id);
    try {
      await api.patch(`/admin/messages/${id}`, { status });
      toast.success("تم التحديث");
      load();
    } catch (e) {
      toast.error(formatApiError(e));
    } finally {
      setBusyId(null);
    }
  };

  const remove = async (id) => {
    if (!window.confirm("حذف هذه الرسالة نهائياً؟")) return;
    setBusyId(id);
    try {
      await api.delete(`/admin/messages/${id}`);
      toast.success("تم الحذف");
      load();
    } catch (e) {
      toast.error(formatApiError(e));
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div data-testid="admin-messages-page">
      <div className="mb-6 flex items-end justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-bold">الرسائل</h1>
          <p className="text-white/50 text-sm mt-1">رسائل نموذج التواصل</p>
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[170px] bg-white/[0.04] border-white/10 text-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">كل الرسائل</SelectItem>
            <SelectItem value="new">جديد</SelectItem>
            <SelectItem value="read">مقروء</SelectItem>
            <SelectItem value="replied">تم الرد</SelectItem>
            <SelectItem value="archived">مؤرشف</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-3">
        {loading ? (
          <div className="text-center py-10 text-white/40"><Loader2 className="w-5 h-5 animate-spin inline" /></div>
        ) : items.length === 0 ? (
          <div className="text-center py-10 text-white/40 bg-white/[0.02] rounded-2xl border border-white/[0.06]">لا توجد رسائل.</div>
        ) : items.map((m) => {
          const meta = STATUS_META[m.status] || STATUS_META.new;
          return (
            <div key={m.id} className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-5 flex gap-4 items-start" data-testid={`message-row-${m.id}`}>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="font-semibold">{m.name}</span>
                  <Badge variant="outline" className={meta.cls}>{meta.label}</Badge>
                  <span className="text-xs text-white/40">{m.service_type}</span>
                </div>
                <div className="text-xs text-white/50 flex gap-4 mb-2">
                  <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{m.phone}</span>
                  <span className="flex items-center gap-1"><Mail className="w-3 h-3" />{m.email}</span>
                  <span>{new Date(m.created_at).toLocaleString("ar-SA")}</span>
                </div>
                <p className="text-sm text-white/80 line-clamp-2">{m.message}</p>
              </div>
              <div className="flex gap-1.5 shrink-0">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => { setSelected(m); if (m.status === "new") updateStatus(m.id, "read"); }}>
                      <Eye className="w-4 h-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent dir="rtl" className="bg-[#0F2537] border-white/10 text-white max-w-xl">
                    <DialogHeader>
                      <DialogTitle className="text-right">رسالة من {selected?.name}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-3 text-sm">
                      <div><span className="text-white/50">الخدمة:</span> {selected?.service_type}</div>
                      <div><span className="text-white/50">الهاتف:</span> {selected?.phone}</div>
                      <div><span className="text-white/50">البريد:</span> {selected?.email}</div>
                      <div className="pt-3 border-t border-white/10 whitespace-pre-wrap">{selected?.message}</div>
                      <div className="flex gap-2 pt-4">
                        <Button size="sm" onClick={() => updateStatus(selected.id, "replied")} className="bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30">وضع علامة تم الرد</Button>
                        <Button size="sm" variant="outline" onClick={() => updateStatus(selected.id, "archived")} className="border-white/10 bg-transparent text-white/70">أرشفة</Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
                <Button size="icon" variant="ghost" disabled={busyId === m.id}
                  onClick={() => remove(m.id)}
                  className="h-8 w-8 text-white/40 hover:text-rose-400 hover:bg-rose-500/10"
                  data-testid={`message-delete-${m.id}`}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
