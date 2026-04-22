import { useEffect, useMemo, useState, useCallback } from "react";
import api, { formatApiError } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import {
  Loader2,
  Save,
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
  ChevronRight,
  GripVertical,
  Eye,
  EyeOff,
} from "lucide-react";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import MediaPicker from "@/components/admin/MediaPicker";
import { PAGES, PAGE_BLOCKS } from "./contentSchema";

const ICONS = { home: Home, info: Info, briefcase: Briefcase, phone: Phone, box: Box, globe: Globe, building: Building2 };

// ===================== Field renderer =====================
function LeafField({ field, value, onChange }) {
  switch (field.type) {
    case "textarea":
      return <Textarea rows={3} value={value ?? ""} onChange={(e) => onChange(e.target.value)} className="bg-[var(--accent)] border-[var(--border)]" />;
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
      return <Input type="number" value={value ?? 0} onChange={(e) => onChange(Number(e.target.value))} className="bg-[var(--accent)] border-[var(--border)]" />;
    default:
      return <Input value={value ?? ""} onChange={(e) => onChange(e.target.value)} className="bg-[var(--accent)] border-[var(--border)]" />;
  }
}

function ListItemEditor({ itemSchema, item, onChange }) {
  const setField = (k, v) => onChange({ ...(item || {}), [k]: v });
  return (
    <div className="space-y-3">
      {itemSchema.map((f) => (
        <div key={f.key}>
          <Label className="text-sm font-semibold mb-1.5 block">{f.label}</Label>
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
        <div className="text-xs text-[var(--muted-foreground)] bg-[var(--accent)] border border-[var(--border)] border-dashed rounded-lg px-3 py-4 text-center">لا توجد عناصر بعد.</div>
      )}
      {items.map((it, i) => (
        <div key={i} className="bg-[var(--accent)] border border-[var(--border)] rounded-lg p-3">
          <div className="flex items-center gap-1 mb-3 pb-2 border-b border-[var(--border)]">
            <span className="text-xs font-bold text-[var(--muted-foreground)]">#{i + 1}</span>
            <div className="flex-1" />
            <button type="button" onClick={() => move(i, i - 1)} disabled={i === 0} className="p-1 opacity-60 hover:opacity-100 disabled:opacity-20"><ChevronUp className="w-3.5 h-3.5" /></button>
            <button type="button" onClick={() => move(i, i + 1)} disabled={i === items.length - 1} className="p-1 opacity-60 hover:opacity-100 disabled:opacity-20"><ChevronDown className="w-3.5 h-3.5" /></button>
            <button type="button" onClick={() => removeItem(i)} className="p-1 text-rose-500 opacity-70 hover:opacity-100"><Trash2 className="w-3.5 h-3.5" /></button>
          </div>
          <ListItemEditor itemSchema={field.itemSchema} item={it} onChange={(nv) => updateItem(i, nv)} />
        </div>
      ))}
      <Button type="button" size="sm" variant="outline" onClick={addItem} className="border-[var(--border)] bg-transparent w-full"><Plus className="w-3.5 h-3.5 ml-1" />إضافة عنصر</Button>
    </div>
  );
}

function SectionFormBody({ schema, value, onChange }) {
  const setField = (k, v) => onChange({ ...(value || {}), [k]: v });
  return (
    <div className="space-y-4">
      {schema.fields.map((f) => (
        <div key={f.key}>
          <Label className="text-sm font-bold mb-1 block">{f.label}</Label>
          {f.help && <div className="text-[11px] text-[var(--muted-foreground)] mb-2">{f.help}</div>}
          {f.type === "list"
            ? <ListField field={f} value={(value || {})[f.key]} onChange={(v) => setField(f.key, v)} />
            : <LeafField field={f} value={(value || {})[f.key]} onChange={(v) => setField(f.key, v)} />}
        </div>
      ))}
    </div>
  );
}

// ===================== Sortable section card =====================
function SortableSection({ schema, state, setState, lang, onSave, onDelete }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: schema.key });
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.6 : 1 };
  const s = state || { ar: {}, en: {}, active: true, expanded: false, dirty: false, saving: false };

  const update = (patch) => setState({ ...s, ...patch, dirty: true });
  const updateLang = (lng, obj) => setState({ ...s, [lng]: obj, dirty: true });

  return (
    <div ref={setNodeRef} style={style} className={`bg-[var(--card)] border rounded-2xl overflow-hidden transition ${s.active ? "border-[var(--border)]" : "border-[var(--border)] opacity-60"}`}>
      <div className="flex items-center gap-2 p-3 bg-[var(--accent)]/50 border-b border-[var(--border)]">
        <button {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing p-1 opacity-50 hover:opacity-100 touch-none" title="اسحب لإعادة الترتيب" data-testid={`section-drag-${schema.key}`}>
          <GripVertical className="w-4 h-4" />
        </button>
        <button onClick={() => setState({ ...s, expanded: !s.expanded })} className="flex-1 flex items-center gap-2 text-right">
          <ChevronRight className={`w-4 h-4 transition-transform ${s.expanded ? "rotate-90" : ""}`} />
          <div className="flex-1">
            <div className="font-bold text-sm">{schema.title}</div>
            {schema.description && <div className="text-[11px] text-[var(--muted-foreground)]">{schema.description}</div>}
          </div>
        </button>
        <div className="flex items-center gap-2 flex-shrink-0">
          {s.dirty && <span className="text-[10px] text-amber-500 font-semibold">• غير محفوظ</span>}
          <button
            onClick={() => update({ active: !s.active })}
            title={s.active ? "إخفاء القسم" : "إظهار القسم"}
            className={`p-1.5 rounded-md transition ${s.active ? "text-emerald-500 hover:bg-emerald-500/10" : "text-[var(--muted-foreground)] hover:bg-[var(--accent)]"}`}
            data-testid={`section-toggle-${schema.key}`}
          >
            {s.active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {s.expanded && (
        <div className="p-5">
          <SectionFormBody schema={schema} value={lang === "ar" ? s.ar : s.en} onChange={(nv) => updateLang(lang, nv)} />
          <div className="mt-5 flex items-center justify-end gap-2 pt-4 border-t border-[var(--border)]">
            <Button variant="ghost" size="sm" onClick={() => onDelete(schema.key)} className="text-rose-500 hover:bg-rose-500/10">
              <Trash2 className="w-3.5 h-3.5 ml-1" />حذف
            </Button>
            <Button onClick={() => onSave(schema.key)} disabled={s.saving || !s.dirty} size="sm" className="bg-[#f47424] hover:bg-[#f47424]/90 text-white" data-testid={`section-save-${schema.key}`}>
              {s.saving ? <Loader2 className="w-3.5 h-3.5 animate-spin ml-1" /> : <Save className="w-3.5 h-3.5 ml-1" />}
              حفظ القسم
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

// ===================== Page =====================
export default function Content() {
  const [activePage, setActivePage] = useState(PAGES[0].id);
  const [lang, setLang] = useState("ar");
  const [blocks, setBlocks] = useState({}); // key -> doc from API
  const [states, setStates] = useState({}); // key -> local editor state
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/admin/content");
      const map = {};
      for (const b of data) map[b.key] = b;
      setBlocks(map);

      // Initialize editor states for every schema key (merge with DB)
      const init = {};
      for (const schema of PAGE_BLOCKS) {
        const doc = map[schema.key];
        init[schema.key] = {
          ar: doc?.ar || {},
          en: doc?.en || {},
          active: doc?.active ?? true,
          order: doc?.order ?? PAGE_BLOCKS.findIndex((p) => p.key === schema.key),
          expanded: false,
          dirty: false,
          saving: false,
        };
      }
      setStates(init);
    } catch (e) {
      toast.error(formatApiError(e));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  // Sections for current page — sorted by `order` from states
  const pageSections = useMemo(() => {
    return PAGE_BLOCKS
      .filter((s) => s.page === activePage)
      .sort((a, b) => (states[a.key]?.order ?? 0) - (states[b.key]?.order ?? 0));
  }, [activePage, states]);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }), useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }));

  const onDragEnd = async (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = pageSections.findIndex((s) => s.key === active.id);
    const newIndex = pageSections.findIndex((s) => s.key === over.id);
    const reordered = arrayMove(pageSections, oldIndex, newIndex);

    const newStates = { ...states };
    reordered.forEach((s, idx) => {
      newStates[s.key] = { ...newStates[s.key], order: idx };
    });
    setStates(newStates);

    // Persist
    try {
      await api.post("/admin/content/reorder", reordered.map((s, idx) => ({ key: s.key, order: idx })));
      toast.success("تم حفظ الترتيب");
    } catch (e) {
      toast.error(formatApiError(e));
      load();
    }
  };

  const setSectionState = (key, s) => setStates((prev) => ({ ...prev, [key]: s }));

  const saveSection = async (key) => {
    const s = states[key];
    if (!s) return;
    setSectionState(key, { ...s, saving: true });
    try {
      await api.put(`/admin/content/${key}`, {
        key,
        ar: s.ar,
        en: s.en,
        active: s.active,
        order: s.order ?? 0,
      });
      toast.success("تم الحفظ");
      setSectionState(key, { ...s, saving: false, dirty: false });
      // refresh base blocks
      const { data } = await api.get(`/admin/content/${key}`).catch(() => ({ data: null }));
      if (data) setBlocks((prev) => ({ ...prev, [key]: data }));
    } catch (e) {
      toast.error(formatApiError(e));
      setSectionState(key, { ...s, saving: false });
    }
  };

  const deleteSection = async (key) => {
    if (!window.confirm("حذف هذا القسم؟ سيعود الموقع لاستخدام القيم الافتراضية.")) return;
    try {
      await api.delete(`/admin/content/${key}`);
      toast.success("تم الحذف");
      load();
    } catch (e) {
      toast.error(formatApiError(e));
    }
  };

  const saveAllOnPage = async () => {
    const dirtyKeys = pageSections.filter((s) => states[s.key]?.dirty).map((s) => s.key);
    if (!dirtyKeys.length) return toast.info("لا يوجد تغييرات جديدة");
    for (const k of dirtyKeys) await saveSection(k);
    toast.success(`تم حفظ ${dirtyKeys.length} قسم`);
  };

  return (
    <div data-testid="admin-content-page">
      <div className="mb-6 flex items-end justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-3xl font-bold">إدارة محتوى الموقع</h1>
          <p className="text-[var(--muted-foreground)] text-sm mt-1">محرر بصري كامل — اختر صفحة، رتّب الأقسام بالسحب، عدّل النصوص والصور، ثم احفظ.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex rounded-lg border border-[var(--border)] overflow-hidden">
            <button onClick={() => setLang("ar")} className={`px-3 py-1.5 text-xs font-semibold ${lang === "ar" ? "bg-[#f47424] text-white" : "bg-transparent"}`}>العربية</button>
            <button onClick={() => setLang("en")} className={`px-3 py-1.5 text-xs font-semibold ${lang === "en" ? "bg-[#f47424] text-white" : "bg-transparent"}`}>English</button>
          </div>
          <Button onClick={saveAllOnPage} className="bg-[#f47424] hover:bg-[#f47424]/90 text-white" data-testid="save-all-btn">
            <Save className="w-4 h-4 ml-1" />حفظ جميع التعديلات
          </Button>
        </div>
      </div>

      {/* Page tabs */}
      <Tabs value={activePage} onValueChange={setActivePage} className="mb-5">
        <TabsList className="bg-[var(--card)] border border-[var(--border)] flex-wrap h-auto p-1">
          {PAGES.map((p) => {
            const Icon = ICONS[p.icon] || Home;
            return (
              <TabsTrigger key={p.id} value={p.id} className="gap-1.5 data-[state=active]:bg-[#f47424] data-[state=active]:text-white" data-testid={`page-tab-${p.id}`}>
                <Icon className="w-3.5 h-3.5" />{p.label}
              </TabsTrigger>
            );
          })}
        </TabsList>
      </Tabs>

      {loading ? (
        <div className="text-center py-12 text-[var(--muted-foreground)]"><Loader2 className="w-5 h-5 animate-spin inline" /></div>
      ) : pageSections.length === 0 ? (
        <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-10 text-center text-[var(--muted-foreground)]">لا توجد أقسام في هذه الصفحة.</div>
      ) : (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
          <SortableContext items={pageSections.map((s) => s.key)} strategy={verticalListSortingStrategy}>
            <div className="space-y-3">
              {pageSections.map((schema) => (
                <SortableSection
                  key={schema.key}
                  schema={schema}
                  state={states[schema.key]}
                  setState={(s) => setSectionState(schema.key, s)}
                  lang={lang}
                  onSave={saveSection}
                  onDelete={deleteSection}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      <div className="mt-6 text-center text-xs text-[var(--muted-foreground)]">
        <p>
          <GripVertical className="w-3 h-3 inline ml-1" />
          اسحب المقبض الأيمن لكل قسم لإعادة الترتيب · اضغط <Eye className="w-3 h-3 inline" /> لإظهار/إخفاء القسم من الموقع
        </p>
      </div>
    </div>
  );
}
