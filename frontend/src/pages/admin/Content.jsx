import { useEffect, useState } from "react";
import api, { formatApiError } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Loader2, Save, FileText } from "lucide-react";

export default function Content() {
  const [blocks, setBlocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedKey, setSelectedKey] = useState(null);
  const [form, setForm] = useState(null);
  const [arJson, setArJson] = useState("");
  const [enJson, setEnJson] = useState("");
  const [saving, setSaving] = useState(false);
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

  useEffect(() => { load(); }, []);

  const selectKey = (key, source = blocks) => {
    const b = source.find((x) => x.key === key);
    if (!b) return;
    setSelectedKey(key);
    setForm({ active: b.active });
    setArJson(JSON.stringify(b.ar || {}, null, 2));
    setEnJson(JSON.stringify(b.en || {}, null, 2));
  };

  const save = async () => {
    setSaving(true);
    try {
      let ar, en;
      try { ar = JSON.parse(arJson || "{}"); } catch { throw new Error("JSON العربي غير صالح"); }
      try { en = JSON.parse(enJson || "{}"); } catch { throw new Error("JSON الإنجليزي غير صالح"); }
      await api.put(`/admin/content/${selectedKey}`, { key: selectedKey, ar, en, active: form.active });
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

  return (
    <div data-testid="admin-content-page">
      <div className="mb-6 flex justify-between items-end flex-wrap gap-3">
        <div>
          <h1 className="text-3xl font-bold">إدارة المحتوى</h1>
          <p className="text-white/50 text-sm mt-1">تحرير نصوص وصور أقسام الموقع (ثنائي اللغة)</p>
        </div>
        <Button onClick={() => setCreating(!creating)} variant="outline" className="border-white/10 bg-transparent text-white hover:bg-white/5" data-testid="content-new-btn">
          قسم جديد
        </Button>
      </div>

      {creating && (
        <div className="mb-4 bg-white/[0.03] border border-white/[0.06] rounded-2xl p-4 flex gap-2">
          <Input placeholder="مفتاح القسم (مثال: home_about_v2)" value={newKey} onChange={(e) => setNewKey(e.target.value)} className="bg-white/[0.04] border-white/10 text-white" />
          <Button onClick={createNew} className="bg-[#f47424] hover:bg-[#f47424]/90">إنشاء</Button>
        </div>
      )}

      {loading ? (
        <div className="text-center py-10 text-white/40"><Loader2 className="w-5 h-5 animate-spin inline" /></div>
      ) : (
        <div className="grid grid-cols-12 gap-4">
          <aside className="col-span-12 md:col-span-3 bg-white/[0.03] border border-white/[0.06] rounded-2xl p-2 h-fit">
            {blocks.map((b) => (
              <button
                key={b.key}
                onClick={() => selectKey(b.key)}
                className={`w-full text-right px-3 py-2 rounded-lg text-sm flex items-center gap-2 transition ${
                  b.key === selectedKey ? "bg-[#f47424]/15 text-[#f47424]" : "text-white/70 hover:bg-white/[0.04]"
                }`}
                data-testid={`content-nav-${b.key}`}
              >
                <FileText className="w-4 h-4" />
                <span className="truncate">{b.key}</span>
              </button>
            ))}
            {blocks.length === 0 && <div className="p-4 text-xs text-white/40 text-center">لا توجد أقسام بعد.</div>}
          </aside>

          <div className="col-span-12 md:col-span-9">
            {form && selectedKey ? (
              <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6">
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <div className="text-xs text-white/40 mb-1">المفتاح</div>
                    <h2 className="text-xl font-bold">{selectedKey}</h2>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <Switch checked={form.active} onCheckedChange={(v) => setForm({ ...form, active: v })} />
                      <Label className="text-white/70 text-sm">نشط</Label>
                    </div>
                    <Button variant="ghost" onClick={remove} className="text-rose-300 hover:bg-rose-500/10">حذف</Button>
                  </div>
                </div>

                <Tabs defaultValue="ar">
                  <TabsList className="bg-white/[0.04] border border-white/[0.06]">
                    <TabsTrigger value="ar">العربية</TabsTrigger>
                    <TabsTrigger value="en">English</TabsTrigger>
                  </TabsList>
                  <TabsContent value="ar" className="mt-3">
                    <Label className="text-white/70 text-sm mb-2 block">محتوى عربي (JSON)</Label>
                    <Textarea rows={18} value={arJson} onChange={(e) => setArJson(e.target.value)} className="bg-[#0a0a0b] border-white/10 text-white font-mono text-sm" dir="ltr" data-testid="content-ar-editor" />
                  </TabsContent>
                  <TabsContent value="en" className="mt-3">
                    <Label className="text-white/70 text-sm mb-2 block">English content (JSON)</Label>
                    <Textarea rows={18} value={enJson} onChange={(e) => setEnJson(e.target.value)} className="bg-[#0a0a0b] border-white/10 text-white font-mono text-sm" dir="ltr" data-testid="content-en-editor" />
                  </TabsContent>
                </Tabs>

                <div className="pt-4">
                  <Button onClick={save} disabled={saving} className="bg-[#f47424] hover:bg-[#f47424]/90" data-testid="content-save-btn">
                    {saving ? <Loader2 className="w-4 h-4 animate-spin ml-1" /> : <Save className="w-4 h-4 ml-1" />}
                    حفظ التعديلات
                  </Button>
                </div>
              </div>
            ) : (
              <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-10 text-center text-white/50">
                اختر قسماً من القائمة لبدء التحرير.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
