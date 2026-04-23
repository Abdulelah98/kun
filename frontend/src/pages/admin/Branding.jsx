import { useEffect, useState } from "react";
import api, { formatApiError } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, Save, Palette, Undo2, RefreshCw } from "lucide-react";
import MediaPicker from "@/components/admin/MediaPicker";
import { useBrandingActions } from "@/contexts/BrandingContext";

const DEFAULT_COLORS = {
  primary_color: "#f47424",
  primary_hover: "#d9641d",
  secondary_color: "#0A1128",
  accent_color: "#EDF0F4",
};

function ColorInput({ label, help, value, onChange, testId }) {
  return (
    <div>
      <Label className="text-sm font-bold mb-1 block">{label}</Label>
      {help && <div className="text-[11px] text-[var(--muted-foreground)] mb-2">{help}</div>}
      <div className="flex items-center gap-3">
        <input
          type="color"
          value={value || "#000000"}
          onChange={(e) => onChange(e.target.value)}
          className="w-14 h-11 rounded-md border border-[var(--border)] cursor-pointer bg-transparent"
          data-testid={`${testId}-color`}
        />
        <Input
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder="#f47424"
          className="flex-1 bg-[var(--accent)] border-[var(--border)] font-mono uppercase"
          data-testid={`${testId}-text`}
        />
        <div
          className="w-11 h-11 rounded-md border border-[var(--border)]"
          style={{ backgroundColor: value || "transparent" }}
          title="معاينة"
        />
      </div>
    </div>
  );
}

export default function Branding() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { refresh } = useBrandingActions();

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/admin/branding");
      setData(data);
    } catch (e) {
      toast.error(formatApiError(e));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const update = (patch) => setData((d) => ({ ...(d || {}), ...patch }));

  const save = async () => {
    setSaving(true);
    try {
      const { data: saved } = await api.put("/admin/branding", data);
      setData(saved);
      await refresh(); // apply new colors/logos immediately
      toast.success("تم حفظ الهوية البصرية");
    } catch (e) {
      toast.error(formatApiError(e));
    } finally {
      setSaving(false);
    }
  };

  const resetColors = () => {
    update(DEFAULT_COLORS);
    toast.info("تم استعادة الألوان الافتراضية — لا تنس الحفظ");
  };

  if (loading || !data) {
    return (
      <div className="text-center py-20 text-[var(--muted-foreground)]">
        <Loader2 className="w-6 h-6 animate-spin inline" />
      </div>
    );
  }

  return (
    <div data-testid="admin-branding-page" className="max-w-4xl">
      <div className="mb-8 flex items-end justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Palette className="w-7 h-7 text-[#f47424]" />
            الهوية البصرية
          </h1>
          <p className="text-[var(--muted-foreground)] text-sm mt-1">
            تحكّم بألوان العلامة التجارية والشعارات من مكان واحد — التغييرات تُطبَّق فوراً على كامل الموقع.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={load}
            className="border-[var(--border)] bg-transparent"
            data-testid="branding-reload-btn"
          >
            <RefreshCw className="w-4 h-4 ml-1" />
            تحديث
          </Button>
          <Button
            onClick={save}
            disabled={saving}
            className="bg-[#f47424] hover:bg-[#f47424]/90 text-white"
            data-testid="branding-save-btn"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin ml-1" /> : <Save className="w-4 h-4 ml-1" />}
            حفظ الهوية
          </Button>
        </div>
      </div>

      {/* Colors */}
      <section className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6 mb-6">
        <div className="flex items-center justify-between mb-5 pb-4 border-b border-[var(--border)]">
          <h2 className="text-lg font-bold">ألوان العلامة التجارية</h2>
          <button
            onClick={resetColors}
            className="text-xs text-[var(--muted-foreground)] hover:text-[#f47424] flex items-center gap-1.5"
            data-testid="branding-reset-colors"
          >
            <Undo2 className="w-3.5 h-3.5" />
            استعادة الافتراضي
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <ColorInput
            label="اللون الأساسي (Primary)"
            help="لون العلامة التجارية الأساسي — الأزرار، الروابط، التمييز"
            value={data.primary_color}
            onChange={(v) => update({ primary_color: v })}
            testId="branding-primary"
          />
          <ColorInput
            label="لون التمرير فوق الأساسي (Hover)"
            help="لون أغمق قليلاً من اللون الأساسي"
            value={data.primary_hover}
            onChange={(v) => update({ primary_hover: v })}
            testId="branding-primary-hover"
          />
          <ColorInput
            label="اللون الثانوي (Secondary)"
            help="الأقسام الداكنة — الهيدر، الـFooter، خلفيات التمييز"
            value={data.secondary_color}
            onChange={(v) => update({ secondary_color: v })}
            testId="branding-secondary"
          />
          <ColorInput
            label="لون الخلفية الفاتحة (Accent)"
            help="خلفيات الأقسام الرمادية الفاتحة"
            value={data.accent_color}
            onChange={(v) => update({ accent_color: v })}
            testId="branding-accent"
          />
        </div>

        {/* Preview */}
        <div className="mt-6 rounded-xl overflow-hidden border border-[var(--border)]">
          <div className="text-xs font-semibold px-4 py-2 bg-[var(--accent)] border-b border-[var(--border)]">
            معاينة حيّة
          </div>
          <div className="p-6" style={{ backgroundColor: data.secondary_color }}>
            <p className="text-xs font-bold uppercase tracking-[0.25em] mb-3" style={{ color: data.primary_color }}>
              KUN
            </p>
            <h3 className="text-2xl font-bold text-white mb-4">مساحتك الاحترافية تبدأ من هنا</h3>
            <div className="flex items-center gap-3 flex-wrap">
              <button
                className="px-5 py-2.5 rounded-md text-sm font-bold text-white transition"
                style={{ backgroundColor: data.primary_color }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = data.primary_hover)}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = data.primary_color)}
              >
                زر رئيسي
              </button>
              <button
                className="px-5 py-2.5 rounded-md text-sm font-bold border-2 transition"
                style={{ borderColor: data.primary_color, color: data.primary_color }}
              >
                زر ثانوي
              </button>
              <span
                className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold"
                style={{ backgroundColor: `${data.primary_color}26`, color: data.primary_color }}
              >
                شارة
              </span>
            </div>
          </div>
          <div className="p-4" style={{ backgroundColor: data.accent_color }}>
            <span className="text-xs text-gray-600">قسم بخلفية Accent — مناسب للمحتوى الفرعي</span>
          </div>
        </div>
      </section>

      {/* Logos */}
      <section className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6 mb-6">
        <h2 className="text-lg font-bold mb-1">شعارات الموقع</h2>
        <p className="text-[var(--muted-foreground)] text-sm mb-5 pb-4 border-b border-[var(--border)]">
          يُفضَّل استخدام صيغة SVG أو PNG بخلفية شفافة للحصول على أفضل جودة.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label className="text-sm font-bold mb-1 block">الشعار الأساسي (للخلفيات الداكنة)</Label>
            <p className="text-[11px] text-[var(--muted-foreground)] mb-3">
              يظهر في الـFooter وفي شريط التنقل عند التمرير لأعلى في الصفحة الرئيسية
            </p>
            <MediaPicker
              value={data.logo_primary}
              onChange={(v) => update({ logo_primary: v })}
              label="اختر الشعار"
            />
          </div>

          <div>
            <Label className="text-sm font-bold mb-1 block">الشعار الثانوي (للخلفيات الفاتحة)</Label>
            <p className="text-[11px] text-[var(--muted-foreground)] mb-3">
              يظهر في شريط التنقل على خلفية بيضاء (نسخة داكنة من الشعار)
            </p>
            <MediaPicker
              value={data.logo_alt}
              onChange={(v) => update({ logo_alt: v })}
              label="اختر الشعار الثانوي"
            />
          </div>
        </div>
      </section>

      {/* Admin + Favicon */}
      <section className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6 mb-6">
        <h2 className="text-lg font-bold mb-1">لوحة التحكم و Favicon</h2>
        <p className="text-[var(--muted-foreground)] text-sm mb-5 pb-4 border-b border-[var(--border)]">
          خصّص مظهر لوحة الإدارة والأيقونة الصغيرة في تبويب المتصفح.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label className="text-sm font-bold mb-1 block">شعار لوحة التحكم</Label>
            <p className="text-[11px] text-[var(--muted-foreground)] mb-3">
              يظهر أعلى القائمة الجانبية للوحة التحكم. إذا لم يُحدَّد، يُعرض رمز "K" الافتراضي.
            </p>
            <MediaPicker
              value={data.admin_logo}
              onChange={(v) => update({ admin_logo: v })}
              label="اختر شعار الأدمن"
            />
          </div>

          <div>
            <Label className="text-sm font-bold mb-1 block">Favicon (أيقونة المتصفح)</Label>
            <p className="text-[11px] text-[var(--muted-foreground)] mb-3">
              يُفضَّل صورة مربّعة 32×32 بصيغة PNG أو ICO
            </p>
            <MediaPicker
              value={data.favicon}
              onChange={(v) => update({ favicon: v })}
              label="اختر Favicon"
            />
          </div>
        </div>
      </section>

      {/* Sticky save hint */}
      <div className="text-center text-xs text-[var(--muted-foreground)] pb-6">
        التعديلات لا تُحفظ تلقائياً. اضغط
        <span className="mx-1 font-bold text-[#f47424]">"حفظ الهوية"</span>
        لتطبيقها على الموقع.
      </div>
    </div>
  );
}
