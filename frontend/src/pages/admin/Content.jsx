import { useEffect, useState } from "react";
import api, { formatApiError } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Loader2, Save, FileText, Plus, Home, Info, Briefcase, Phone } from "lucide-react";
import MediaPicker from "@/components/admin/MediaPicker";

const PAGES = [
  { slug: "home_hero", title: "الصفحة الرئيسية — الهيدر", page: "home", icon: Home },
  { slug: "home_about", title: "الصفحة الرئيسية — من نحن", page: "home", icon: Home },
  { slug: "services_overview", title: "الخدمات — نظرة عامة", page: "services", icon: Briefcase },
  { slug: "about_main", title: "من نحن", page: "about", icon: Info },
  { slug: "contact_info", title: "تواصل معنا", page: "contact", icon: Phone },
];

const PAGE_LABEL = { home: "الرئيسية", services: "الخدمات", about: "من نحن", contact: "تواصل", other: "أخرى" };

export default function Content() {
  const [blocks, setBlocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedKey, setSelectedKey] = useState(null);
  const [form, setForm] = useState(null);
  const [ar, setAr] = useState({});
  const [en, setEn] = useState({});
  const [saving, setSaving] = useState(false);
  const [mode, setMode] = useState("json");
  const [arJson, setArJson] = useState("");
  const [enJson, setEnJson] = useState("");
  const [creating, setCreating] = useState(false);
  const [newKey, setNewKey] = useState("");

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/admin/content");
      setBlocks(data);
      if (data.length && !selectedKey) selectKey(data[0].key, data);
    } catch (e) { toast.error(formatApiError(e)); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); /* eslint-disable-next-line */ }, []);

  const selectKey = (key, source = blocks) => {
    const b = source.find((x) => x.key === key);
    if (!b) return;
    setSelectedKey(key);
    setForm({ active: b.active });
    setAr(b.ar || {});
    setEn(b.en || {});
    setArJson(JSON.stringify(b.ar || {}, null, 2));
    setEnJson(JSON.stringify(b.en || {}, null, 2));
  };

  useEffect(() => { setArJson(JSON.stringify(ar, null, 2)); }, [ar]);
  useEffect(() => { setEnJson(JSON.stringify(en, null, 2)); }, [en]);

  const save = async () => {
    setSaving(true);
    try {
      let arToSave = ar, enToSave = en;
      if (mode === "json") {
        try { arToSave = JSON.parse(arJson || "{}"); } catch { throw new Error("JSON العربي غير صالح"); }
        try { enToSave = JSON.parse(enJson || "{}"); } catch { throw new Error("JSON الإنجليزي غير صالح"); }
      }
      await api.put(`/admin/content/${selectedKey}`, { key: selectedKey, ar: arToSave, en: enToSave, active: form.active });
      toast.success("تم الحفظ");
      load();
    } catch (e) { toast.error(e.message || formatApiError(e)); }
    finally { setSaving(false); }
  };

  const remove = async () => {
    if (!selectedKey || !window.confirm(`حذف قسم ${selectedKey} نهائياً؟`)) return;
    try {
      await api.delete(`/admin/content/${selectedKey}`);
      toast.success("تم الحذف");
      setSelectedKey(null);
      setForm(null);
      load();
    } catch (e) { toast.error(formatApiError(e)); }
  };

  const createNew = async () => {
    if (!newKey) return;
    try {
      await api.put(`/admin/content/${newKey}`, { key: newKey, ar: {}, en: {}, active: true });
      toast.success("تم الإنشاء");
      setCreating(false);
      setNewKey("");
      await load();
      selectKey(newKey);
    } catch (e) { toast.error(formatApiError(e)); }
  };

  const groupedBlocks = (() => {
    const map = {};
    for (const p of PAGES) map[p.page] = { icon: p.icon, items: [] };
    map["other"] = { icon: FileText, items: [] };
    for (const b of blocks) {
      const known = PAGES.find((p) => p.slug === b.key);
      if (known) map[known.page].items.push({ ...b, meta: known });
      else map["other"].items.push({ ...b, meta: { title: b.key } });
    }
    return map;
  })();

  return (
    <div data-testid="admin-content-page">
      <div className="mb-6 flex justify-between items-end flex-wrap gap-3">
        <div>
          <h1 className="text-3xl font-bold">إدارة المحتوى</h1>
          <p className="text-[var(--muted-foreground)] text-sm mt-1">تحرير نصوص وصور أقسام الموقع (ثنائي اللغة) — مُصنَّف حسب الصفحة</p>
        </div>
        <Button onClick={() => setCreating(!creating)} variant="outline" className="border-[var(--border)] bg-transparent" data-testid="content-new-btn">
          <Plus className="w-4 h-4 ml-1" /> قسم جديد
        </Button>
      </div>

      {creating && (
        <div className="mb-4 bg-[var(--card)] border border-[var(--border)] rounded-2xl p-4 flex gap-2">
          <Input placeholder="مفتاح القسم (مثال: home_gallery)" value={newKey} onChange={(e) => setNewKey(e.target.value)} className="bg-[var(--accent)] border-[var(--border)]" />
          <Button onClick={createNew} className="bg-[#f47424] hover:bg-[#f47424]/90 text-white">إنشاء</Button>
        </div>
      )}

      {loading ? (
        <div className="text-center py-10 text-[var(--muted-foreground)]"><Loader2 className="w-5 h-5 animate-spin inline" /></div>
      ) : (
        <div className="grid grid-cols-12 gap-4">
          <aside className="col-span-12 md:col-span-3 bg-[var(--card)] border border-[var(--border)] rounded-2xl p-2 h-fit">
            {Object.entries(groupedBlocks).map(([page, group]) => {
              if (!group.items.length) return null;
              const Icon = group.icon;
              return (
                <div key={page} className="mb-3">
                  <div className="flex items-center gap-1.5 px-3 py-1 text-[11px] uppercase font-bold text-[var(--muted-foreground)] tracking-wider">
                    <Icon className="w-3 h-3" />{PAGE_LABEL[page]}
                  </div>
                  {group.items.map((b) => (
                    <button
                      key={b.key}
                      onClick={() => selectKey(b.key)}
                      className={`w-full text-right px-3 py-2 rounded-lg text-sm flex items-center gap-2 transition ${
                        b.key === selectedKey ? "bg-[#f47424]/15 text-[#f47424]" : "text-[var(--muted-foreground)] hover:bg-[var(--accent)]"
                      }`}
                      data-testid={`content-nav-${b.key}`}
                    >
                      <FileText className="w-4 h-4" />
                      <span className="truncate">{b.meta?.title || b.key}</span>
                    </button>
                  ))}
                </div>
              );
            })}
            {blocks.length === 0 && <div className="p-4 text-xs text-[var(--muted-foreground)] text-center">لا توجد أقسام بعد.</div>}
          </aside>

          <div className="col-span-12 md:col-span-9">
            {form && selectedKey ? (
              <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6">
                <div className="flex items-center justify-between mb-5 gap-3 flex-wrap">
                  <div>
                    <div className="text-xs text-[var(--muted-foreground)] mb-1">المفتاح</div>
                    <h2 className="text-xl font-bold">{selectedKey}</h2>
                  </div>
                  <div className="flex items-center gap-3 flex-wrap">
                    <div className="flex items-center gap-2">
                      <Switch checked={form.active} onCheckedChange={(v) => setForm({ ...form, active: v })} />
                      <Label className="text-sm">القسم مفعّل</Label>
                    </div>
                    <div className="flex rounded-lg border border-[var(--border)] overflow-hidden opacity-0 pointer-events-none hidden">
                      <button onClick={() => setMode("structured")} className={`px-3 py-1.5 text-xs font-semibold ${mode === "structured" ? "bg-[#f47424] text-white" : "bg-transparent"}`}>منظم</button>
                      <button onClick={() => setMode("json")} className={`px-3 py-1.5 text-xs font-semibold ${mode === "json" ? "bg-[#f47424] text-white" : "bg-transparent"}`}>JSON</button>
                    </div>
                    <Button variant="ghost" onClick={remove} className="text-rose-500 hover:bg-rose-500/10">حذف</Button>
                  </div>
                </div>

                <Tabs defaultValue="ar">
                  <TabsList className="bg-[var(--accent)] border border-[var(--border)]">
                    <TabsTrigger value="ar">العربية</TabsTrigger>
                    <TabsTrigger value="en">English</TabsTrigger>
                  </TabsList>
                  <TabsContent value="ar" className="mt-3">
                    <Label className="text-sm mb-2 block">محتوى عربي (JSON)</Label>
                    <Textarea rows={18} value={arJson} onChange={(e) => setArJson(e.target.value)} className="bg-[var(--accent)] border-[var(--border)] font-mono text-sm" dir="ltr" data-testid="content-ar-editor" />
                    <p className="text-[11px] text-[var(--muted-foreground)] mt-2">نصيحة: لإدراج رابط صورة، افتح <span className="font-semibold">"مكتبة الصور"</span> وانسخ رابط الصورة ثم الصقه.</p>
                  </TabsContent>
                  <TabsContent value="en" className="mt-3">
                    <Label className="text-sm mb-2 block">English content (JSON)</Label>
                    <Textarea rows={18} value={enJson} onChange={(e) => setEnJson(e.target.value)} className="bg-[var(--accent)] border-[var(--border)] font-mono text-sm" dir="ltr" data-testid="content-en-editor" />
                  </TabsContent>
                </Tabs>

                <div className="pt-4">
                  <Button onClick={save} disabled={saving} className="bg-[#f47424] hover:bg-[#f47424]/90 text-white" data-testid="content-save-btn">
                    {saving ? <Loader2 className="w-4 h-4 animate-spin ml-1" /> : <Save className="w-4 h-4 ml-1" />}
                    حفظ التعديلات
                  </Button>
                </div>
              </div>
            ) : (
              <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-10 text-center text-[var(--muted-foreground)]">
                اختر قسماً من القائمة لبدء التحرير.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
