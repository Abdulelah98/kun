import { useEffect, useState } from "react";
import api, { formatApiError } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";
import MediaPicker, { resolveMediaUrl } from "@/components/admin/MediaPicker";

const EMPTY = {
  name: "",
  name_en: "",
  capacity: 1,
  price: 0,
  currency: "ريال/ساعة",
  image: "",
  images: [],
  description: "",
  description_en: "",
  order: 0,
  active: true,
  booked_slots: [],
};

export default function MeetingRooms() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/admin/meeting-rooms");
      setItems(data);
    } catch (e) { toast.error(formatApiError(e)); }
    finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const save = async () => {
    setSaving(true);
    try {
      const body = {
        ...form,
        capacity: Number(form.capacity),
        price: Number(form.price),
        order: Number(form.order),
        images: Array.isArray(form.images) ? form.images : (typeof form.images === "string" ? form.images.split("\n").map((s) => s.trim()).filter(Boolean) : []),
        booked_slots: typeof form.booked_slots === "string" ? form.booked_slots.split("\n").map((s) => s.trim()).filter(Boolean) : form.booked_slots,
      };
      if (editing) await api.put(`/admin/meeting-rooms/${editing.id}`, body);
      else await api.post("/admin/meeting-rooms", body);
      toast.success("تم الحفظ");
      setOpen(false);
      load();
    } catch (e) { toast.error(formatApiError(e)); }
    finally { setSaving(false); }
  };

  const remove = async (id) => {
    if (!window.confirm("حذف هذه القاعة؟")) return;
    try { await api.delete(`/admin/meeting-rooms/${id}`); toast.success("تم الحذف"); load(); }
    catch (e) { toast.error(formatApiError(e)); }
  };

  return (
    <div data-testid="admin-rooms-page">
      <div className="mb-6 flex justify-between items-end flex-wrap gap-3">
        <div>
          <h1 className="text-3xl font-bold">قاعات الاجتماعات</h1>
          <p className="text-white/50 text-sm mt-1">إدارة القاعات المتاحة للحجز بالساعة</p>
        </div>
        <Button onClick={() => { setEditing(null); setForm(EMPTY); setOpen(true); }} className="bg-[#f47424] hover:bg-[#f47424]/90" data-testid="room-add-btn">
          <Plus className="w-4 h-4 ml-1" /> إضافة قاعة
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-10 text-white/40"><Loader2 className="w-5 h-5 animate-spin inline" /></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {items.map((it) => (
            <div key={it.id} className="bg-white/[0.03] border border-white/[0.06] rounded-2xl overflow-hidden flex" data-testid={`room-card-${it.id}`}>
              {it.image && <div className="w-40 bg-white/5 shrink-0"><img src={resolveMediaUrl(it.image)} alt="" className="w-full h-full object-cover" /></div>}
              <div className="flex-1 p-4">
                <div className="font-bold">{it.name}</div>
                <div className="text-xs text-white/50 mb-2">{it.name_en}</div>
                <div className="text-sm text-white/70 mb-3">
                  <div>السعة: {it.capacity}</div>
                  <div>{it.price} {it.currency}</div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => { setEditing(it); setForm({ ...EMPTY, ...it, images: it.images || [], booked_slots: it.booked_slots || [] }); setOpen(true); }}
                    className="flex-1 border-white/10 bg-transparent text-white hover:bg-white/5">
                    <Pencil className="w-3.5 h-3.5 ml-1" /> تعديل
                  </Button>
                  <Button size="icon" variant="ghost" onClick={() => remove(it.id)} className="text-white/50 hover:text-rose-400 hover:bg-rose-500/10">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent dir="rtl" className="bg-[#0F2537] border-white/10 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle className="text-right">{editing ? "تعديل قاعة" : "قاعة جديدة"}</DialogTitle></DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FI label="الاسم (عربي)" v={form.name} s={(v) => setForm({ ...form, name: v })} />
            <FI label="الاسم (إنجليزي)" v={form.name_en} s={(v) => setForm({ ...form, name_en: v })} />
            <FI label="السعة" type="number" v={form.capacity} s={(v) => setForm({ ...form, capacity: v })} />
            <FI label="السعر" type="number" v={form.price} s={(v) => setForm({ ...form, price: v })} />
            <FI label="الوحدة" v={form.currency} s={(v) => setForm({ ...form, currency: v })} />
            <FI label="الترتيب" type="number" v={form.order} s={(v) => setForm({ ...form, order: v })} />
            <div className="md:col-span-2">
              <Label className="text-white/70">الصورة الرئيسية</Label>
              <div className="mt-2"><MediaPicker value={form.image} onChange={(v) => setForm({ ...form, image: v })} label="اختيار الصورة" /></div>
            </div>
            <div className="md:col-span-2">
              <Label className="text-white/70">صور إضافية</Label>
              <div className="mt-2"><MediaPicker value={Array.isArray(form.images) ? form.images : []} onChange={(v) => setForm({ ...form, images: v })} multiple label="أضف صور" /></div>
            </div>
            <div className="md:col-span-2">
              <Label className="text-white/70">المواعيد المحجوزة (YYYY-MM-DDTHH:MM سطر لكل موعد)</Label>
              <Textarea rows={3} value={Array.isArray(form.booked_slots) ? form.booked_slots.join("\n") : form.booked_slots}
                onChange={(e) => setForm({ ...form, booked_slots: e.target.value })}
                className="bg-white/[0.04] border-white/10 text-white mt-1" />
            </div>
            <div className="flex items-center gap-3">
              <Switch checked={form.active} onCheckedChange={(v) => setForm({ ...form, active: v })} />
              <Label className="text-white/80">نشط (معروض)</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)} className="border-white/10 bg-transparent text-white">إلغاء</Button>
            <Button onClick={save} disabled={saving} className="bg-[#f47424] hover:bg-[#f47424]/90" data-testid="room-save-btn">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : "حفظ"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function FI({ label, v, s, type = "text" }) {
  return (
    <div>
      <Label className="text-white/70">{label}</Label>
      <Input type={type} value={v ?? ""} onChange={(e) => s(e.target.value)} className="bg-white/[0.04] border-white/10 text-white mt-1" />
    </div>
  );
}
