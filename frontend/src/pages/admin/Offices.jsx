import { useEffect, useState } from "react";
import api, { formatApiError } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
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

const EMPTY = {
  name: "",
  name_en: "",
  capacity: 1,
  price: 0,
  currency: "ريال/شهر",
  available: true,
  reserved_until: "",
  image: "",
  images: [],
  description: "",
  description_en: "",
  order: 0,
  active: true,
};

export default function Offices() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/admin/offices");
      setItems(data);
    } catch (e) { toast.error(formatApiError(e)); }
    finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const openNew = () => { setEditing(null); setForm(EMPTY); setOpen(true); };
  const openEdit = (it) => { setEditing(it); setForm({ ...EMPTY, ...it, images: it.images || [], reserved_until: it.reserved_until || "" }); setOpen(true); };

  const save = async () => {
    setSaving(true);
    try {
      const body = {
        ...form,
        capacity: Number(form.capacity),
        price: Number(form.price),
        order: Number(form.order),
        reserved_until: form.reserved_until || null,
        images: typeof form.images === "string" ? form.images.split("\n").map((s) => s.trim()).filter(Boolean) : form.images,
      };
      if (editing) await api.put(`/admin/offices/${editing.id}`, body);
      else await api.post("/admin/offices", body);
      toast.success("تم الحفظ");
      setOpen(false);
      load();
    } catch (e) { toast.error(formatApiError(e)); }
    finally { setSaving(false); }
  };

  const remove = async (id) => {
    if (!window.confirm("حذف هذا المكتب؟")) return;
    try {
      await api.delete(`/admin/offices/${id}`);
      toast.success("تم الحذف");
      load();
    } catch (e) { toast.error(formatApiError(e)); }
  };

  return (
    <div data-testid="admin-offices-page">
      <div className="mb-6 flex justify-between items-end flex-wrap gap-3">
        <div>
          <h1 className="text-3xl font-bold">المكاتب الخاصة</h1>
          <p className="text-white/50 text-sm mt-1">إدارة المكاتب الخاصة المعروضة على الموقع</p>
        </div>
        <Button onClick={openNew} className="bg-[#f47424] hover:bg-[#f47424]/90" data-testid="office-add-btn">
          <Plus className="w-4 h-4 ml-1" /> إضافة مكتب
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-10 text-white/40"><Loader2 className="w-5 h-5 animate-spin inline" /></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((it) => (
            <div key={it.id} className="bg-white/[0.03] border border-white/[0.06] rounded-2xl overflow-hidden" data-testid={`office-card-${it.id}`}>
              {it.image && <div className="aspect-[16/9] bg-white/5"><img src={it.image} alt="" className="w-full h-full object-cover" /></div>}
              <div className="p-4">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <div className="font-bold">{it.name}</div>
                    <div className="text-xs text-white/50">{it.name_en}</div>
                  </div>
                  <div className="flex flex-col gap-1 items-end">
                    <Badge variant="outline" className={it.available ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/30" : "bg-rose-500/15 text-rose-300 border-rose-500/30"}>
                      {it.available ? "متاح" : "محجوز"}
                    </Badge>
                    {!it.active && <Badge variant="outline" className="bg-white/10 text-white/50 border-white/10">غير نشط</Badge>}
                  </div>
                </div>
                <div className="text-sm text-white/70 mb-3">
                  <div>السعة: {it.capacity} أشخاص</div>
                  <div>السعر: {it.price} {it.currency}</div>
                  {it.reserved_until && <div className="text-xs text-amber-300">محجوز حتى: {it.reserved_until}</div>}
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => openEdit(it)} className="flex-1 border-white/10 bg-transparent text-white hover:bg-white/5">
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
        <DialogContent dir="rtl" className="bg-[#121214] border-white/10 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle className="text-right">{editing ? "تعديل مكتب" : "مكتب جديد"}</DialogTitle></DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="الاسم (عربي)" value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
            <Field label="الاسم (إنجليزي)" value={form.name_en} onChange={(v) => setForm({ ...form, name_en: v })} />
            <Field label="السعة" type="number" value={form.capacity} onChange={(v) => setForm({ ...form, capacity: v })} />
            <Field label="السعر" type="number" value={form.price} onChange={(v) => setForm({ ...form, price: v })} />
            <Field label="العملة/الوحدة" value={form.currency} onChange={(v) => setForm({ ...form, currency: v })} />
            <Field label="الترتيب" type="number" value={form.order} onChange={(v) => setForm({ ...form, order: v })} />
            <Field label="محجوز حتى (YYYY-MM-DD)" value={form.reserved_until || ""} onChange={(v) => setForm({ ...form, reserved_until: v })} />
            <Field label="الصورة الرئيسية (URL)" value={form.image} onChange={(v) => setForm({ ...form, image: v })} />
            <div className="md:col-span-2">
              <Label className="text-white/70">صور إضافية (URL سطر لكل صورة)</Label>
              <Textarea rows={4} value={Array.isArray(form.images) ? form.images.join("\n") : form.images}
                onChange={(e) => setForm({ ...form, images: e.target.value })}
                className="bg-white/[0.04] border-white/10 text-white mt-1" />
            </div>
            <div className="md:col-span-2">
              <Label className="text-white/70">الوصف</Label>
              <Textarea rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="bg-white/[0.04] border-white/10 text-white mt-1" />
            </div>
            <div className="flex items-center gap-3">
              <Switch checked={form.available} onCheckedChange={(v) => setForm({ ...form, available: v })} />
              <Label className="text-white/80">متاح للحجز</Label>
            </div>
            <div className="flex items-center gap-3">
              <Switch checked={form.active} onCheckedChange={(v) => setForm({ ...form, active: v })} />
              <Label className="text-white/80">نشط (معروض)</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)} className="border-white/10 bg-transparent text-white">إلغاء</Button>
            <Button onClick={save} disabled={saving} className="bg-[#f47424] hover:bg-[#f47424]/90" data-testid="office-save-btn">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : "حفظ"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Field({ label, value, onChange, type = "text" }) {
  return (
    <div>
      <Label className="text-white/70">{label}</Label>
      <Input type={type} value={value ?? ""} onChange={(e) => onChange(e.target.value)} className="bg-white/[0.04] border-white/10 text-white mt-1" />
    </div>
  );
}
