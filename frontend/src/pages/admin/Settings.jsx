import { useEffect, useState } from "react";
import api, { formatApiError } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Loader2, Save, Info } from "lucide-react";

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
      <p className="text-white/50 text-sm mb-6">معلومات التواصل، روابط التواصل الاجتماعي، وبيانات الخريطة (تظهر في الـ Footer وصفحة "تواصل معنا")</p>

      <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6 space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <F label="رقم الهاتف" v={form.phone} s={(v) => setF("phone", v)} hint="يظهر في الـ Footer وصفحة تواصل معنا — قابل للنقر للاتصال" />
          <F label="رقم الواتساب" v={form.whatsapp} s={(v) => setF("whatsapp", v)} hint="يستخدم لزر الواتساب الأخضر في صفحة تواصل معنا" />
          <F label="البريد الإلكتروني" v={form.email} s={(v) => setF("email", v)} hint="بريد التواصل العام — يظهر في الـ Footer وصفحة تواصل معنا" />
          <F label="بريد إشعارات الإدارة" v={form.admin_notify_email} s={(v) => setF("admin_notify_email", v)} hint="يستلم إشعارات الحجوزات الجديدة ورسائل تواصل معنا (للأدمن فقط، لا يظهر للزائر)" />
          <F label="العنوان (عربي)" v={form.address_ar} s={(v) => setF("address_ar", v)} hint="يظهر للزوار في الوضع العربي — Footer + صفحة تواصل" />
          <F label="Address (English)" v={form.address_en} s={(v) => setF("address_en", v)} hint="يظهر للزوار في الوضع الإنجليزي" />
          <F label="خط العرض (Latitude)" type="number" v={form.map_lat} s={(v) => setF("map_lat", v)} hint="إحداثيات الخريطة الافتراضية إذا لم يتم لصق رابط iframe" />
          <F label="خط الطول (Longitude)" type="number" v={form.map_lng} s={(v) => setF("map_lng", v)} hint="نفس الشيء — Latitude + Longitude → خريطة Google تلقائية" />
        </div>

        <div>
          <Label className="text-white/70 mb-1.5 block">رابط iframe الخريطة (Google Maps embed)</Label>
          <Textarea
            rows={3}
            value={form.map_embed || ""}
            onChange={(e) => setF("map_embed", e.target.value)}
            placeholder='<iframe src="https://www.google.com/maps/embed?pb=..." ...></iframe> — أو الصق رابط src فقط'
            className="bg-white/[0.04] border-white/10 text-white"
          />
          <Hint>اختياري. إذا تم لصق رابط هنا فسيتم استخدامه بدلاً من خط الطول/العرض. ادخل إلى Google Maps → شارك → "تضمين خريطة" وانسخ الرابط داخل src.</Hint>
        </div>

        <div className="pt-2">
          <div className="text-sm font-semibold text-white/80 mb-1">وسائل التواصل الاجتماعي</div>
          <p className="text-xs text-white/40 mb-3">روابط كاملة (مثل https://instagram.com/kun_sa) — تظهر كأيقونات في الـ Footer وصفحة تواصل معنا. اتركها فارغة لإخفاء الأيقونة.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <F label="Twitter / X" v={(form.social || {}).twitter || ""} s={(v) => setSoc("twitter", v)} placeholder="https://twitter.com/Kun__sa" />
            <F label="Instagram" v={(form.social || {}).instagram || ""} s={(v) => setSoc("instagram", v)} placeholder="https://instagram.com/kun__work" />
            <F label="LinkedIn" v={(form.social || {}).linkedin || ""} s={(v) => setSoc("linkedin", v)} placeholder="https://linkedin.com/company/kun" />
            <F label="Snapchat" v={(form.social || {}).snapchat || ""} s={(v) => setSoc("snapchat", v)} placeholder="https://snapchat.com/add/kun_sa" />
          </div>
        </div>

        <div className="pt-2 flex items-start gap-2 bg-blue-500/5 border border-blue-500/15 rounded-lg p-3 text-xs text-blue-200/80">
          <Info size={14} className="flex-shrink-0 mt-0.5" />
          <div>
            <strong className="text-blue-200">أين تظهر هذه الإعدادات؟</strong>
            <ul className="mt-1.5 space-y-1 list-disc list-inside">
              <li><strong>Footer</strong>: الهاتف، البريد، العنوان، أيقونات السوشال ميديا (في كل صفحات الموقع)</li>
              <li><strong>صفحة تواصل معنا</strong>: نفس البيانات + زر الواتساب + الخريطة</li>
              <li><strong>إشعارات الإدارة</strong>: عند تقديم زائر لطلب حجز/رسالة، يصل إيميل إلى "بريد إشعارات الإدارة"</li>
            </ul>
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

function F({ label, v, s, type = "text", hint, placeholder }) {
  return (
    <div>
      <Label className="text-white/70 mb-1.5 block">{label}</Label>
      <Input
        type={type}
        value={v ?? ""}
        placeholder={placeholder}
        onChange={(e) => s(e.target.value)}
        className="bg-white/[0.04] border-white/10 text-white placeholder:text-white/25"
      />
      {hint ? <Hint>{hint}</Hint> : null}
    </div>
  );
}

function Hint({ children }) {
  return <p className="text-[11px] text-white/40 mt-1.5 leading-relaxed">{children}</p>;
}
