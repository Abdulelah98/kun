import { useEffect, useMemo, useState } from "react";
import api, { formatApiError } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from "sonner";
import {
  Loader2,
  Save,
  FileText,
  Home,
  Info,
  Briefcase,
  Phone,
  Box,
  Globe,
  Building2,
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
  Code2,
} from "lucide-react";
import MediaPicker from "@/components/admin/MediaPicker";
import { PAGES, PAGE_BLOCKS, getBlockByKey } from "./contentSchema";

const ICONS = { home: Home, info: Info, briefcase: Briefcase, phone: Phone, box: Box, globe: Globe, building: Building2 };

// ===================== Leaf field renderer (no recursion) =====================
function LeafField({ field, value, onChange }) {
  switch (field.type) {
    case "textarea":
      return (
        <Textarea
          rows={4}
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value)}
          className="bg-[var(--accent)] border-[var(--border)]"
        />
      );
    case "image":
      return <MediaPicker value={value || ""} onChange={onChange} label="اختيار صورة" />;
    case "images":
      return <MediaPicker value={Array.isArray(value) ? value : []} onChange={onChange} multiple label="اختر صوراً" />;
    case "boolean":
      return (
        <div className="flex items-center gap-2 pt-1">
          <Switch checked={!!value} onCheckedChange={onChange} />
          <span className="text-xs text-[var(--muted-foreground)]">{value ? "مفعل" : "معطل"}</span>
        </div>
      );
    case "number":
      return (
        <Input
          type="number"
          value={value ?? 0}
          onChange={(e) => onChange(Number(e.target.value))}
          className="bg-[var(--accent)] border-[var(--border)]"
        />
      );
    default:
      return (
        <Input
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value)}
          className="bg-[var(--accent)] border-[var(--border)]"
        />
      );
  }
}

// ===================== List item editor (one fixed depth) =====================
function ListItemEditor({ itemSchema, item, onChange }) {
  const setField = (k, v) => onChange({ ...(item || {}), [k]: v });
  return (
    <div className="space-y-3">
      {itemSchema.map((f) => (
        <div key={f.key}>
          <Label className="text-[var(--foreground)] text-sm font-semibold mb-1.5 block">{f.label}</Label>
          {f.help && <div className="text-[11px] text-[var(--muted-foreground)] mb-1.5">{f.help}</div>}
          <LeafField field={f} value={(item || {})[f.key]} onChange={(v) => setField(f.key, v)} />
        </div>
      ))}
    </div>
  );
}

function ListField({ field, value, onChange }) {
  const items = Array.isArray(value) ? value : [];
  const addItem = () => {
    const tmpl = Object.fromEntries(field.itemSchema.map((f) => [f.key, f.type === "boolean" ? false : f.type === "number" ? 0 : f.type === "images" ? [] : ""]));
    onChange([...items, tmpl]);
  };
  const removeItem = (i) => onChange(items.filter((_, j) => j !== i));
  const move = (from, to) => {
    if (to < 0 || to >= items.length) return;
    const copy = [...items];
    const [it] = copy.splice(from, 1);
    copy.splice(to, 0, it);
    onChange(copy);
  };
  const updateItem = (i, nv) => onChange(items.map((it, j) => (j === i ? nv : it)));

  return (
    <div className="space-y-3">
      {items.length === 0 && (
        <div className="text-xs text-[var(--muted-foreground)] bg-[var(--accent)] border border-[var(--border)] border-dashed rounded-lg px-3 py-4 text-center">
          لا توجد عناصر بعد.
        </div>
      )}
      {items.map((it, i) => (
        <div key={i} className="bg-[var(--accent)] border border-[var(--border)] rounded-lg p-3">
          <div className="flex items-center gap-1 mb-3 pb-2 border-b border-[var(--border)]">
            <span className="text-xs font-bold text-[var(--muted-foreground)]">#{i + 1}</span>
            <div className="flex-1" />
            <button type="button" onClick={() => move(i, i - 1)} disabled={i === 0} className="p-1 opacity-60 hover:opacity-100 disabled:opacity-20" title="أعلى">
              <ChevronUp className="w-3.5 h-3.5" />
            </button>
            <button type="button" onClick={() => move(i, i + 1)} disabled={i === items.length - 1} className="p-1 opacity-60 hover:opacity-100 disabled:opacity-20" title="أسفل">
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
            <button type="button" onClick={() => removeItem(i)} className="p-1 text-rose-500 opacity-70 hover:opacity-100" title="حذف">
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
          <ListItemEditor itemSchema={field.itemSchema} item={it} onChange={(nv) => updateItem(i, nv)} />
        </div>
      ))}
      <Button type="button" size="sm" variant="outline" onClick={addItem} className="border-[var(--border)] bg-transparent w-full">
        <Plus className="w-3.5 h-3.5 ml-1" />
        إضافة عنصر
      </Button>
    </div>
  );
}

// ===================== Top-level structured editor =====================
function StructuredEditor({ schema, value, onChange }) {
  const setField = (k, v) => onChange({ ...(value || {}), [k]: v });
  return (
    <div className="space-y-5">
      {schema.fields.map((f) => (
        <div key={f.key} className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-4">
          <Label className="text-[var(--foreground)] text-sm font-bold mb-1 block">{f.label}</Label>
          {f.help && <div className="text-[11px] text-[var(--muted-foreground)] mb-2">{f.help}</div>}
          {f.type === "list" ? (
            <ListField field={f} value={(value || {})[f.key]} onChange={(v) => setField(f.key, v)} />
          ) : (
            <LeafField field={f} value={(value || {})[f.key]} onChange={(v) => setField(f.key, v)} />
          )}
        </div>
      ))}
    </div>
  );
}

// ===================== Page =====================
export default function Content() {
  const [blocks, setBlocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedKey, setSelectedKey] = useState(null);
  const [active, setActive] = useState(true);
  const [ar, setAr] = useState({});
  const [en, setEn] = useState({});
  const [saving, setSaving] = useState(false);
  const [mode, setMode] = useState("structured");
  const [arJson, setArJson] = useState("{}");
  const [enJson, setEnJson] = useState("{}");

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/admin/content");
      setBlocks(data);
      if (!selectedKey) selectKey(PAGE_BLOCKS[0].key, data);
    } catch (e) {
      toast.error(formatApiError(e));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const selectKey = (key, source = blocks) => {
    setSelectedKey(key);
    const existing = source.find((x) => x.key === key);
    if (existing) {
      setActive(existing.active ?? true);
      setAr(existing.ar || {});
      setEn(existing.en || {});
      setArJson(JSON.stringify(existing.ar || {}, null, 2));
      setEnJson(JSON.stringify(existing.en || {}, null, 2));
    } else {
      // Not saved yet — start empty
      setActive(true);
      setAr({});
      setEn({});
      setArJson("{}");
      setEnJson("{}");
    }
  };

  useEffect(() => { setArJson(JSON.stringify(ar, null, 2)); }, [ar]);
  useEffect(() => { setEnJson(JSON.stringify(en, null, 2)); }, [en]);

  const currentSchema = useMemo(() => getBlockByKey(selectedKey), [selectedKey]);

  const save = async () => {
    if (!selectedKey) return;
    setSaving(true);
    try {
      let arToSave = ar;
      let enToSave = en;
      if (mode === "json") {
        try { arToSave = JSON.parse(arJson || "{}"); } catch { throw new Error("JSON العربي غير صالح"); }
        try { enToSave = JSON.parse(enJson || "{}"); } catch { throw new Error("JSON الإنجليزي غير صالح"); }
      }
      await api.put(`/admin/content/${selectedKey}`, {
        key: selectedKey,
        ar: arToSave,
        en: enToSave,
        active,
      });
      toast.success("تم الحفظ");
      load();
    } catch (e) {
      toast.error(e.message || formatApiError(e));
    } finally {
      setSaving(false);
    }
  };

  // Group schemas by page
  const grouped = useMemo(() => {
    const map = {};
    for (const p of PAGES) map[p.id] = { label: p.label, icon: ICONS[p.icon] || FileText, items: [] };
    for (const s of PAGE_BLOCKS) {
      if (!map[s.page]) map[s.page] = { label: s.page, icon: FileText, items: [] };
      const existing = blocks.find((b) => b.key === s.key);
      map[s.page].items.push({ ...s, saved: !!existing, active: existing?.active });
    }
    return map;
  }, [blocks]);

  return (
    <div data-testid="admin-content-page">
      <div className="mb-6 flex justify-between items-end flex-wrap gap-3">
        <div>
          <h1 className="text-3xl font-bold">إدارة المحتوى</h1>
          <p className="text-[var(--muted-foreground)] text-sm mt-1">
            كل نص وكل صورة في الموقع قابلة للتعديل من هنا (عربي + إنجليزي)
          </p>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-10 text-[var(--muted-foreground)]">
          <Loader2 className="w-5 h-5 animate-spin inline" />
        </div>
      ) : (
        <div className="grid grid-cols-12 gap-4">
          {/* Sidebar by page */}
          <aside className="col-span-12 md:col-span-4 lg:col-span-3 bg-[var(--card)] border border-[var(--border)] rounded-2xl p-2 h-fit sticky top-4 max-h-[calc(100vh-2rem)] overflow-y-auto">
            {Object.entries(grouped).map(([pid, g]) => {
              if (!g.items.length) return null;
              const Icon = g.icon;
              return (
                <div key={pid} className="mb-3">
                  <div className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] uppercase font-bold text-[var(--muted-foreground)] tracking-wider">
                    <Icon className="w-3 h-3" /> {g.label}
                  </div>
                  {g.items.map((b) => (
                    <button
                      key={b.key}
                      onClick={() => selectKey(b.key)}
                      className={`w-full text-right px-3 py-2 rounded-lg text-sm flex items-center gap-2 transition ${
                        b.key === selectedKey ? "bg-[#f47424]/15 text-[#f47424]" : "text-[var(--muted-foreground)] hover:bg-[var(--accent)]"
                      }`}
                      data-testid={`content-nav-${b.key}`}
                    >
                      <FileText className="w-4 h-4 flex-shrink-0" />
                      <span className="truncate flex-1">{b.title}</span>
                      {b.saved ? (
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" title="محفوظ" />
                      ) : (
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500" title="غير محفوظ بعد" />
                      )}
                    </button>
                  ))}
                </div>
              );
            })}
          </aside>

          {/* Editor */}
          <div className="col-span-12 md:col-span-8 lg:col-span-9">
            {!currentSchema ? (
              <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-10 text-center text-[var(--muted-foreground)]">
                اختر قسماً من القائمة لبدء التحرير.
              </div>
            ) : (
              <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6">
                <div className="flex items-start justify-between mb-5 gap-3 flex-wrap pb-4 border-b border-[var(--border)]">
                  <div>
                    <div className="text-xs text-[var(--muted-foreground)] mb-0.5">القسم</div>
                    <h2 className="text-xl font-bold">{currentSchema.title}</h2>
                    {currentSchema.description && (
                      <p className="text-xs text-[var(--muted-foreground)] mt-1">{currentSchema.description}</p>
                    )}
                    <div className="text-[10px] text-[var(--muted-foreground)] mt-1 font-mono">{currentSchema.key}</div>
                  </div>
                  <div className="flex items-center gap-3 flex-wrap">
                    <div className="flex items-center gap-2">
                      <Switch checked={active} onCheckedChange={setActive} />
                      <Label className="text-sm">القسم مفعّل</Label>
                    </div>
                    <button
                      type="button"
                      onClick={() => setMode(mode === "structured" ? "json" : "structured")}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[var(--border)] text-xs hover:bg-[var(--accent)]"
                      title={mode === "structured" ? "عرض JSON" : "عرض منظم"}
                    >
                      <Code2 className="w-3.5 h-3.5" />
                      {mode === "structured" ? "عرض JSON" : "عرض منظم"}
                    </button>
                  </div>
                </div>

                <Tabs defaultValue="ar">
                  <TabsList className="bg-[var(--accent)] border border-[var(--border)]">
                    <TabsTrigger value="ar">العربية</TabsTrigger>
                    <TabsTrigger value="en">English</TabsTrigger>
                  </TabsList>
                  <TabsContent value="ar" className="mt-4">
                    {mode === "structured" ? (
                      <StructuredEditor schema={currentSchema} value={ar} onChange={setAr} />
                    ) : (
                      <Textarea rows={20} value={arJson} onChange={(e) => setArJson(e.target.value)} className="bg-[var(--accent)] border-[var(--border)] font-mono text-xs" dir="ltr" />
                    )}
                  </TabsContent>
                  <TabsContent value="en" className="mt-4">
                    {mode === "structured" ? (
                      <StructuredEditor schema={currentSchema} value={en} onChange={setEn} />
                    ) : (
                      <Textarea rows={20} value={enJson} onChange={(e) => setEnJson(e.target.value)} className="bg-[var(--accent)] border-[var(--border)] font-mono text-xs" dir="ltr" />
                    )}
                  </TabsContent>
                </Tabs>

                <div className="mt-6 flex justify-end gap-2">
                  <Button onClick={save} disabled={saving} className="bg-[#f47424] hover:bg-[#f47424]/90 text-white" data-testid="content-save-btn">
                    {saving ? <Loader2 className="w-4 h-4 animate-spin ml-1" /> : <Save className="w-4 h-4 ml-1" />}
                    حفظ التعديلات
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
