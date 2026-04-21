import { useEffect, useState } from "react";
import api, { formatApiError } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Loader2, Save } from "lucide-react";
import MediaPicker from "@/components/admin/MediaPicker";

export default function SharedDesks() {
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get("/admin/shared-desks").then((r) => setForm(r.data)).catch((e) => toast.error(formatApiError(e)));
  }, []);

  if (!form) return <div className="text-center py-10 text-white/40"><Loader2 className="w-5 h-5 animate-spin inline" /></div>;

  const save = async () => {
    setSaving(true);
    try {
      const body = {
        ...form,
        price: Number(form.price),
        total_seats: Number(form.total_seats),
        available_seats: Number(form.available_seats),
        occupied_seats: Number(form.occupied_seats),
      };
      const { data } = await api.put("/admin/shared-desks", body);
      setForm(data);
      toast.success("تم الحفظ");
    } catch (e) { toast.error(formatApiError(e)); }
    finally { setSaving(false); }
  };

  const setF = (k, v) => setForm({ ...form, [k]: v });

  return (
    <div data-testid="admin-shared-desks-page" className="max-w-3xl">
      <h1 className="text-3xl font-bold mb-1">المكاتب المشتركة</h1>
      <p className="text-white/50 text-sm mb-6">إعدادات عرض المساحة المشتركة</p>

      <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6 space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Row label="السعر"><Input type="number" value={form.price} onChange={(e) => setF("price", e.target.value)} className="bg-white/[0.04] border-white/10 text-white" /></Row>
          <Row label="الوحدة"><Input value={form.currency} onChange={(e) => setF("currency", e.target.value)} className="bg-white/[0.04] border-white/10 text-white" /></Row>
          <Row label="إجمالي المقاعد"><Input type="number" value={form.total_seats} onChange={(e) => setF("total_seats", e.target.value)} className="bg-white/[0.04] border-white/10 text-white" /></Row>
          <Row label="المقاعد المتاحة"><Input type="number" value={form.available_seats} onChange={(e) => setF("available_seats", e.target.value)} className="bg-white/[0.04] border-white/10 text-white" /></Row>
          <Row label="المقاعد المشغولة"><Input type="number" value={form.occupied_seats} onChange={(e) => setF("occupied_seats", e.target.value)} className="bg-white/[0.04] border-white/10 text-white" /></Row>
        </div>
        <Row label="الصورة"><div className="mt-2"><MediaPicker value={form.image} onChange={(v) => setF("image", v)} label="اختيار الصورة" /></div></Row>
        <Row label="الوصف (عربي)"><Textarea rows={3} value={form.description} onChange={(e) => setF("description", e.target.value)} className="bg-white/[0.04] border-white/10 text-white" /></Row>
        <Row label="الوصف (إنجليزي)"><Textarea rows={3} value={form.description_en} onChange={(e) => setF("description_en", e.target.value)} className="bg-white/[0.04] border-white/10 text-white" /></Row>
        <div className="flex items-center gap-3">
          <Switch checked={form.active} onCheckedChange={(v) => setF("active", v)} />
          <Label className="text-white/80">نشط (معروض)</Label>
        </div>

        <div className="pt-3">
          <Button onClick={save} disabled={saving} className="bg-[#f47424] hover:bg-[#f47424]/90" data-testid="shared-desks-save">
            {saving ? <Loader2 className="w-4 h-4 animate-spin ml-1" /> : <Save className="w-4 h-4 ml-1" />}
            حفظ التعديلات
          </Button>
        </div>
      </div>
    </div>
  );
}

function Row({ label, children }) {
  return (
    <div>
      <Label className="text-white/70 mb-1.5 block">{label}</Label>
      {children}
    </div>
  );
}
