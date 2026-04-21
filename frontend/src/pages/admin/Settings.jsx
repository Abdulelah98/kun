import { useEffect, useState } from "react";
import api, { formatApiError } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Loader2, Save } from "lucide-react";

export default function Settings() {
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get("/admin/settings").then((r) => setForm({ social: {}, ...r.data })).catch((e) => toast.error(formatApiError(e)));
  }, []);

  if (!form) return <div className="text-center py-10 text-white/40"><Loader2 className="w-5 h-5 animate-spin inline" /></div>;

  const save = async () => {
    setSaving(true);
    try {
      const body = { ...form, map_lat: Number(form.map_lat), map_lng: Number(form.map_lng) };
      const { data } = await api.put("/admin/settings", body);
      setForm({ social: {}, ...data });
      toast.success("تم الحفظ");
    } catch (e) { toast.error(formatApiError(e)); }
    finally { setSaving(false); }
  };

  const setF = (k, v) => setForm({ ...form, [k]: v });
  const setSoc = (k, v) => setForm({ ...form, social: { ...(form.social || {}), [k]: v } });

  return (
    <div data-testid="admin-settings-page" className="max-w-3xl">
      <h1 className="text-3xl font-bold mb-1">الإعدادات العامة</h1>
      <p className="text-white/50 text-sm mb-6">معلومات التواصل وروابط التواصل الاجتماعي وبيانات الخريطة</p>

      <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6 space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <F label="رقم الهاتف" v={form.phone} s={(v) => setF("phone", v)} />
          <F label="رقم الواتساب" v={form.whatsapp} s={(v) => setF("whatsapp", v)} />
          <F label="البريد الإلكتروني" v={form.email} s={(v) => setF("email", v)} />
          <F label="بريد إشعارات الإدارة" v={form.admin_notify_email} s={(v) => setF("admin_notify_email", v)} />
          <F label="العنوان (عربي)" v={form.address_ar} s={(v) => setF("address_ar", v)} />
          <F label="Address (English)" v={form.address_en} s={(v) => setF("address_en", v)} />
          <F label="خط العرض" type="number" v={form.map_lat} s={(v) => setF("map_lat", v)} />
          <F label="خط الطول" type="number" v={form.map_lng} s={(v) => setF("map_lng", v)} />
        </div>

        <div>
          <Label className="text-white/70 mb-1.5 block">رابط iframe الخريطة (Google Maps embed)</Label>
          <Textarea rows={3} value={form.map_embed || ""} onChange={(e) => setF("map_embed", e.target.value)} className="bg-white/[0.04] border-white/10 text-white" />
        </div>

        <div className="pt-2">
          <div className="text-sm font-semibold text-white/80 mb-3">وسائل التواصل الاجتماعي</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <F label="Twitter" v={(form.social || {}).twitter || ""} s={(v) => setSoc("twitter", v)} />
            <F label="Instagram" v={(form.social || {}).instagram || ""} s={(v) => setSoc("instagram", v)} />
            <F label="LinkedIn" v={(form.social || {}).linkedin || ""} s={(v) => setSoc("linkedin", v)} />
            <F label="Snapchat" v={(form.social || {}).snapchat || ""} s={(v) => setSoc("snapchat", v)} />
          </div>
        </div>

        <div className="pt-2">
          <Button onClick={save} disabled={saving} className="bg-[#f47424] hover:bg-[#f47424]/90" data-testid="settings-save-btn">
            {saving ? <Loader2 className="w-4 h-4 animate-spin ml-1" /> : <Save className="w-4 h-4 ml-1" />}
            حفظ التعديلات
          </Button>
        </div>
      </div>
    </div>
  );
}

function F({ label, v, s, type = "text" }) {
  return (
    <div>
      <Label className="text-white/70 mb-1.5 block">{label}</Label>
      <Input type={type} value={v ?? ""} onChange={(e) => s(e.target.value)} className="bg-white/[0.04] border-white/10 text-white" />
    </div>
  );
}
