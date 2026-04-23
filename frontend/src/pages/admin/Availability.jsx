import { useEffect, useState } from "react";
import api, { formatApiError } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Loader2, Save, Plus, Trash2 } from "lucide-react";

const DAYS = [
  { val: 0, ar: "الأحد" },
  { val: 1, ar: "الإثنين" },
  { val: 2, ar: "الثلاثاء" },
  { val: 3, ar: "الأربعاء" },
  { val: 4, ar: "الخميس" },
  { val: 5, ar: "الجمعة" },
  { val: 6, ar: "السبت" },
];

export default function Availability() {
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);
  const [newBlockedDate, setNewBlockedDate] = useState("");
  const [newBlockDate, setNewBlockDate] = useState("");
  const [newBlockSlot, setNewBlockSlot] = useState("");

  const load = async () => {
    try {
      const { data } = await api.get("/admin/availability");
      setForm(data);
    } catch (e) {
      toast.error(formatApiError(e));
    }
  };

  useEffect(() => { load(); }, []);

  if (!form) return <div className="text-center py-10 text-[var(--muted-foreground)]"><Loader2 className="w-5 h-5 animate-spin inline" /></div>;

  const toggleDay = (v) => {
    const days = new Set(form.working_days || []);
    if (days.has(v)) days.delete(v); else days.add(v);
    setForm({ ...form, working_days: Array.from(days).sort() });
  };

  const addBlockedDate = () => {
    if (!newBlockedDate) return;
    setForm({ ...form, blocked_dates: [...new Set([...(form.blocked_dates || []), newBlockedDate])] });
    setNewBlockedDate("");
  };

  const removeBlockedDate = (d) => setForm({ ...form, blocked_dates: form.blocked_dates.filter((x) => x !== d) });

  const addBlockedSlot = () => {
    if (!newBlockDate || !newBlockSlot) return;
    const item = { date: newBlockDate, slot: newBlockSlot };
    setForm({ ...form, blocked_slots: [...(form.blocked_slots || []), item] });
    setNewBlockDate("");
    setNewBlockSlot("");
  };

  const removeBlockedSlot = (idx) => setForm({ ...form, blocked_slots: form.blocked_slots.filter((_, i) => i !== idx) });

  const save = async () => {
    setSaving(true);
    try {
      const body = {
        ...form,
        all_day: !!form.all_day,
        working_days: (form.working_days || []).map(Number),
        slot_minutes: Number(form.slot_minutes || 60),
      };
      const { data } = await api.put("/admin/availability", body);
      setForm(data);
      toast.success("تم حفظ إعدادات التوفر");
    } catch (e) {
      toast.error(formatApiError(e));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div data-testid="admin-availability-page" className="max-w-4xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">أوقات العمل والتوفر</h1>
        <p className="text-[var(--muted-foreground)] text-sm mt-1">تحكم في الأيام والساعات المتاحة للحجز. الافتراضي: 24/7</p>
      </div>

      <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6 space-y-6">
        {/* Working days */}
        <div>
          <Label className="text-[var(--foreground)] mb-3 block text-base font-semibold">أيام العمل</Label>
          <div className="flex flex-wrap gap-2">
            {DAYS.map((d) => {
              const on = (form.working_days || []).includes(d.val);
              return (
                <button
                  key={d.val}
                  type="button"
                  onClick={() => toggleDay(d.val)}
                  data-testid={`avail-day-${d.val}`}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold border transition ${
                    on
                      ? "bg-[#f47424] text-white border-[#f47424]"
                      : "bg-[var(--accent)] text-[var(--foreground)] border-[var(--border)] hover:border-[#f47424]/50"
                  }`}
                >
                  {d.ar}
                </button>
              );
            })}
          </div>
        </div>

        {/* Working hours */}
        <div className="space-y-4">
          <div className="flex items-center justify-between rounded-xl border border-[var(--border)] bg-[var(--accent)]/50 p-4">
            <div>
              <Label className="text-[var(--foreground)] text-base font-semibold">يوم كامل (24 ساعة)</Label>
              <p className="text-xs text-[var(--muted-foreground)] mt-0.5">تفعيل الخيار يعرض جميع ساعات اليوم (24 فترة) في التقويم ويتجاهل أوقات البداية والنهاية.</p>
            </div>
            <Switch
              checked={!!form.all_day}
              onCheckedChange={(v) => setForm({ ...form, all_day: v })}
              data-testid="avail-all-day"
              className="data-[state=checked]:bg-[#f47424]"
            />
          </div>

          <div className={`grid grid-cols-1 md:grid-cols-3 gap-4 transition-opacity ${form.all_day ? "opacity-50 pointer-events-none" : ""}`}>
            <div>
              <Label className="text-[var(--muted-foreground)] mb-1.5 block">بداية الدوام</Label>
              <Input type="time" value={form.start_time} onChange={(e) => setForm({ ...form, start_time: e.target.value })}
                className="bg-[var(--accent)] border-[var(--border)]" data-testid="avail-start" disabled={!!form.all_day} />
            </div>
            <div>
              <Label className="text-[var(--muted-foreground)] mb-1.5 block">نهاية الدوام</Label>
              <Input type="time" value={form.end_time} onChange={(e) => setForm({ ...form, end_time: e.target.value })}
                className="bg-[var(--accent)] border-[var(--border)]" data-testid="avail-end" disabled={!!form.all_day} />
            </div>
            <div>
              <Label className="text-[var(--muted-foreground)] mb-1.5 block">مدة الفترة (دقيقة)</Label>
              <Input type="number" min={15} step={15} value={form.slot_minutes}
                onChange={(e) => setForm({ ...form, slot_minutes: e.target.value })}
                className="bg-[var(--accent)] border-[var(--border)]" />
            </div>
          </div>
        </div>

        {/* Blocked whole dates */}
        <div>
          <Label className="text-[var(--foreground)] mb-2 block text-base font-semibold">أيام مغلقة</Label>
          <div className="flex gap-2 mb-2">
            <Input type="date" value={newBlockedDate} onChange={(e) => setNewBlockedDate(e.target.value)}
              className="bg-[var(--accent)] border-[var(--border)] max-w-[220px]" data-testid="avail-new-blocked-date" />
            <Button type="button" onClick={addBlockedDate} variant="outline" className="border-[var(--border)] bg-transparent" data-testid="avail-add-blocked-date">
              <Plus className="w-4 h-4 ml-1" />إضافة
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {(form.blocked_dates || []).map((d) => (
              <span key={d} className="inline-flex items-center gap-2 bg-rose-500/15 border border-rose-500/30 text-rose-400 px-3 py-1 rounded-full text-sm">
                {d}
                <button onClick={() => removeBlockedDate(d)} className="opacity-70 hover:opacity-100"><Trash2 className="w-3 h-3" /></button>
              </span>
            ))}
            {(form.blocked_dates || []).length === 0 && <span className="text-xs text-[var(--muted-foreground)]">لا توجد أيام مغلقة.</span>}
          </div>
        </div>

        {/* Blocked specific slots */}
        <div>
          <Label className="text-[var(--foreground)] mb-2 block text-base font-semibold">أوقات مغلقة (تاريخ + ساعة)</Label>
          <div className="flex gap-2 mb-2 flex-wrap">
            <Input type="date" value={newBlockDate} onChange={(e) => setNewBlockDate(e.target.value)} className="bg-[var(--accent)] border-[var(--border)] max-w-[200px]" />
            <Input type="time" value={newBlockSlot} onChange={(e) => setNewBlockSlot(e.target.value)} className="bg-[var(--accent)] border-[var(--border)] max-w-[160px]" />
            <Button type="button" onClick={addBlockedSlot} variant="outline" className="border-[var(--border)] bg-transparent">
              <Plus className="w-4 h-4 ml-1" />إضافة موعد
            </Button>
          </div>
          <div className="space-y-1">
            {(form.blocked_slots || []).map((s, i) => (
              <div key={i} className="flex items-center justify-between bg-[var(--accent)] border border-[var(--border)] rounded-lg px-3 py-2 text-sm">
                <span>{s.date} — {s.slot}</span>
                <button onClick={() => removeBlockedSlot(i)} className="text-rose-500 hover:opacity-100 opacity-70"><Trash2 className="w-4 h-4" /></button>
              </div>
            ))}
            {(form.blocked_slots || []).length === 0 && <span className="text-xs text-[var(--muted-foreground)]">لا توجد مواعيد مغلقة.</span>}
          </div>
        </div>

        <div className="pt-2">
          <Button onClick={save} disabled={saving} className="bg-[#f47424] hover:bg-[#f47424]/90 text-white" data-testid="avail-save-btn">
            {saving ? <Loader2 className="w-4 h-4 animate-spin ml-1" /> : <Save className="w-4 h-4 ml-1" />}
            حفظ الإعدادات
          </Button>
        </div>
      </div>
    </div>
  );
}
