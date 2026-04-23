import { useEffect, useMemo, useState } from "react";
import api from "@/lib/api";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { Clock, CalendarDays, Lock, CheckCircle2, Users, Repeat, Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

// Build HH:MM slots between start/end given a step
function buildSlots(start = "09:00", end = "21:00", step = 60) {
  const [sh, sm] = start.split(":").map(Number);
  const [eh, em] = end.split(":").map(Number);
  const s = sh * 60 + sm;
  const e = eh * 60 + em;
  const out = [];
  for (let t = s; t + step <= e; t += step) {
    const h = String(Math.floor(t / 60)).padStart(2, "0");
    const m = String(t % 60).padStart(2, "0");
    out.push(`${h}:${m}`);
  }
  return out;
}

// "14:00" => "02:00 PM"
function formatTime12(hhmm) {
  if (!hhmm) return "";
  const [hStr, m] = hhmm.split(":");
  let h = Number(hStr);
  const ampm = h >= 12 ? "PM" : "AM";
  h = h % 12 || 12;
  return `${String(h).padStart(2, "0")}:${m} ${ampm}`;
}

function isoDate(d) {
  if (!d) return "";
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/**
 * Visual editor for pre-blocking meeting-room time slots.
 * value: array of "YYYY-MM-DDTHH:MM" strings (admin-blocked)
 * roomId: optional — when provided we also show real customer bookings as disabled
 */
export default function SlotEditor({ value = [], onChange, roomId }) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const [date, setDate] = useState(today);
  const [availability, setAvailability] = useState(null);
  const [customerBooked, setCustomerBooked] = useState([]);

  useEffect(() => {
    api.get("/availability").then((r) => setAvailability(r.data)).catch(() => {});
  }, []);

  // Load real customer bookings for the selected date
  useEffect(() => {
    if (!roomId || !date) { setCustomerBooked([]); return; }
    api
      .get("/booked-slots", { params: { room_id: roomId, date: isoDate(date) } })
      .then((r) => setCustomerBooked(r.data.booked || []))
      .catch(() => setCustomerBooked([]));
  }, [roomId, date]);

  const slots = useMemo(() => {
    if (availability?.all_day) {
      const step = availability.slot_minutes || 60;
      return buildSlots("00:00", "24:00", step);
    }
    return buildSlots(
      availability?.start_time || "09:00",
      availability?.end_time || "21:00",
      availability?.slot_minutes || 60
    );
  }, [availability]);

  const blockedList = Array.isArray(value) ? value : [];
  const blockedForDate = useMemo(() => {
    const prefix = `${isoDate(date)}T`;
    return new Set(blockedList.filter((x) => x.startsWith(prefix)).map((x) => x.slice(prefix.length)));
  }, [blockedList, date]);

  const toggleSlot = (hhmm) => {
    if (customerBooked.includes(hhmm)) return; // can't toggle customer bookings
    const key = `${isoDate(date)}T${hhmm}`;
    const next = blockedList.includes(key)
      ? blockedList.filter((x) => x !== key)
      : [...blockedList, key];
    onChange?.(next);
  };

  const isDateDisabled = (d) => {
    if (!d) return false;
    const t = new Date();
    t.setHours(0, 0, 0, 0);
    if (d < t) return true;
    if (!availability) return false;
    if (!(availability.working_days || []).includes(d.getDay())) return true;
    if ((availability.blocked_dates || []).includes(isoDate(d))) return true;
    return false;
  };

  // Count of blocked slots across all dates
  const totalBlocked = blockedList.length;

  // ------ Recurring template state ------
  const [recurOpen, setRecurOpen] = useState(false);
  const [recurDays, setRecurDays] = useState([]); // 0..6
  const [recurStart, setRecurStart] = useState("14:00");
  const [recurEnd, setRecurEnd] = useState("16:00");
  const [recurWeeks, setRecurWeeks] = useState(4);

  const DAYS = [
    { val: 0, ar: "الأحد" },
    { val: 1, ar: "الإثنين" },
    { val: 2, ar: "الثلاثاء" },
    { val: 3, ar: "الأربعاء" },
    { val: 4, ar: "الخميس" },
    { val: 5, ar: "الجمعة" },
    { val: 6, ar: "السبت" },
  ];

  const toggleRecurDay = (v) => {
    setRecurDays((prev) => (prev.includes(v) ? prev.filter((x) => x !== v) : [...prev, v]));
  };

  const applyRecurring = () => {
    if (recurDays.length === 0) {
      toast.error("اختر يوماً واحداً على الأقل");
      return;
    }
    const step = availability?.slot_minutes || 60;
    const windowSlots = buildSlots(recurStart, recurEnd, step);
    if (windowSlots.length === 0) {
      toast.error("تحقق من وقت البداية والنهاية");
      return;
    }
    const weeks = Math.max(1, Math.min(52, Number(recurWeeks) || 1));
    const base = new Date(date);
    base.setHours(0, 0, 0, 0);

    const newKeys = new Set(blockedList);
    let added = 0;
    for (let w = 0; w < weeks; w++) {
      for (let d = 0; d < 7; d++) {
        const cur = new Date(base);
        cur.setDate(base.getDate() + w * 7 + d);
        if (!recurDays.includes(cur.getDay())) continue;
        // Respect availability.working_days & blocked_dates
        if (availability && !(availability.working_days || []).includes(cur.getDay())) continue;
        const iso = isoDate(cur);
        if (availability && (availability.blocked_dates || []).includes(iso)) continue;
        for (const hhmm of windowSlots) {
          const key = `${iso}T${hhmm}`;
          if (!newKeys.has(key)) {
            newKeys.add(key);
            added++;
          }
        }
      }
    }
    onChange?.(Array.from(newKeys));
    toast.success(`تمت إضافة ${added} فترة إلى الجدول`);
    setRecurOpen(false);
    setRecurDays([]);
  };

  const clearAllBlocked = () => {
    if (blockedList.length === 0) return;
    if (!window.confirm("حذف جميع الفترات المحجوزة من الإدارة؟")) return;
    onChange?.([]);
    toast.success("تم مسح الجدول");
  };

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--accent)] overflow-hidden" data-testid="slot-editor">
      <div className="px-5 py-3 border-b border-[var(--border)] flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2 text-sm font-semibold text-[var(--foreground)]">
          <CalendarDays className="w-4 h-4 text-[#f47424]" />
          جدول الحجز
        </div>
        <div className="flex items-center gap-2">
          {totalBlocked > 0 && (
            <>
              <Badge className="bg-[#f47424]/15 text-[#f47424] border border-[#f47424]/30 hover:bg-[#f47424]/20">
                {totalBlocked} فترة محجوزة
              </Badge>
              <button
                type="button"
                onClick={clearAllBlocked}
                className="text-xs text-rose-500 hover:text-rose-400 flex items-center gap-1"
                data-testid="slot-clear-all"
              >
                <X className="w-3 h-3" /> مسح الكل
              </button>
            </>
          )}
          <Button
            type="button"
            size="sm"
            onClick={() => setRecurOpen((v) => !v)}
            className="bg-[#f47424]/10 text-[#f47424] hover:bg-[#f47424]/20 border border-[#f47424]/30 h-8 px-3 text-xs font-semibold"
            data-testid="slot-recur-toggle"
          >
            <Repeat className="w-3.5 h-3.5 ml-1" />
            قالب متكرر
          </Button>
        </div>
      </div>

      {/* Recurring template panel */}
      {recurOpen && (
        <div
          className="px-5 py-4 border-b border-[var(--border)] bg-[var(--card)]/60"
          data-testid="slot-recur-panel"
        >
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-[#f47424]" />
            <span className="text-sm font-semibold">قالب الحجز المتكرر</span>
            <span className="text-[11px] text-[var(--muted-foreground)]">
              (يبدأ من التاريخ المحدد في التقويم)
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr,auto] gap-4 items-end">
            <div className="space-y-3">
              <div>
                <Label className="text-xs text-[var(--muted-foreground)] mb-2 block">الأيام</Label>
                <div className="flex flex-wrap gap-1.5">
                  {DAYS.map((d) => {
                    const on = recurDays.includes(d.val);
                    return (
                      <button
                        key={d.val}
                        type="button"
                        onClick={() => toggleRecurDay(d.val)}
                        data-testid={`recur-day-${d.val}`}
                        className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition ${
                          on
                            ? "bg-[#f47424] text-white border-[#f47424] shadow-sm shadow-[#f47424]/30"
                            : "bg-[var(--accent)] text-[var(--foreground)] border-[var(--border)] hover:border-[#f47424]/50"
                        }`}
                      >
                        {d.ar}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <Label className="text-xs text-[var(--muted-foreground)] mb-1 block">من</Label>
                  <Input
                    type="time"
                    value={recurStart}
                    onChange={(e) => setRecurStart(e.target.value)}
                    className="bg-[var(--accent)] border-[var(--border)] h-9"
                    data-testid="recur-start"
                  />
                </div>
                <div>
                  <Label className="text-xs text-[var(--muted-foreground)] mb-1 block">إلى</Label>
                  <Input
                    type="time"
                    value={recurEnd}
                    onChange={(e) => setRecurEnd(e.target.value)}
                    className="bg-[var(--accent)] border-[var(--border)] h-9"
                    data-testid="recur-end"
                  />
                </div>
                <div>
                  <Label className="text-xs text-[var(--muted-foreground)] mb-1 block">لمدة (أسابيع)</Label>
                  <Input
                    type="number"
                    min={1}
                    max={52}
                    value={recurWeeks}
                    onChange={(e) => setRecurWeeks(e.target.value)}
                    className="bg-[var(--accent)] border-[var(--border)] h-9"
                    data-testid="recur-weeks"
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Button
                type="button"
                onClick={applyRecurring}
                className="bg-[#f47424] hover:bg-[#d9641d] text-white h-10 font-bold"
                data-testid="recur-apply"
              >
                تطبيق
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setRecurOpen(false)}
                className="border-[var(--border)] bg-transparent h-9 text-xs"
              >
                إلغاء
              </Button>
            </div>
          </div>

          {recurDays.length > 0 && (
            <p className="text-[11px] text-[var(--muted-foreground)] mt-3">
              سيتم إغلاق{" "}
              <span className="text-[#f47424] font-semibold">
                {recurDays.map((v) => DAYS.find((x) => x.val === v).ar).join("، ")}
              </span>{" "}
              من <span className="font-semibold">{formatTime12(recurStart)}</span> إلى{" "}
              <span className="font-semibold">{formatTime12(recurEnd)}</span> لمدة{" "}
              <span className="font-semibold">{recurWeeks}</span> أسبوع.
            </p>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-[auto,1fr] gap-0">
        {/* Calendar */}
        <div className="p-4 border-b md:border-b-0 md:border-l border-[var(--border)] bg-[var(--card)]">
          <Calendar
            mode="single"
            selected={date}
            onSelect={(d) => d && setDate(d)}
            disabled={isDateDisabled}
            className="rounded-xl"
            data-testid="slot-editor-calendar"
            classNames={{
              day_selected:
                "bg-[#f47424] text-white hover:bg-[#d9641d] focus:bg-[#d9641d] focus:text-white shadow-md shadow-[#f47424]/30",
              day_today: "bg-[#f47424]/10 text-[#f47424] font-bold",
            }}
          />
          <div className="mt-3 text-xs text-[var(--muted-foreground)] space-y-1">
            <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-white border border-[var(--border)]" /> متاح</div>
            <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-[#f47424]" /> محجوز (إدارة)</div>
            <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-rose-500/70" /> محجوز (عميل)</div>
          </div>
        </div>

        {/* Slots */}
        <div className="p-5">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-4 h-4 text-[#f47424]" />
            <span className="text-sm font-semibold text-[var(--foreground)]">
              الفترات المتاحة —{" "}
              <span className="text-[var(--muted-foreground)] font-normal">
                {date.toLocaleDateString("ar-EG", { weekday: "long", day: "numeric", month: "long" })}
              </span>
            </span>
          </div>

          {slots.length === 0 ? (
            <div className="text-center py-10 text-sm text-[var(--muted-foreground)]">
              لا توجد فترات متاحة. تحقق من إعدادات التوفر.
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5" data-testid="slot-editor-grid">
              {slots.map((hhmm) => {
                const isCustomer = customerBooked.includes(hhmm);
                const isAdminBlocked = blockedForDate.has(hhmm);
                const label = formatTime12(hhmm);

                const base =
                  "relative group/slot rounded-xl text-sm font-semibold h-14 flex flex-col items-center justify-center transition-all duration-200 border focus:outline-none focus-visible:ring-2 focus-visible:ring-[#f47424]/50";

                let cls = "";
                let pill = null;
                if (isCustomer) {
                  cls = "bg-rose-500/10 border-rose-500/30 text-rose-500 cursor-not-allowed";
                  pill = (
                    <span className="absolute -top-2 -start-2 text-[9px] font-bold bg-rose-500 text-white px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                      <Users className="w-2.5 h-2.5" /> عميل
                    </span>
                  );
                } else if (isAdminBlocked) {
                  cls =
                    "bg-[#f47424] border-[#f47424] text-white shadow-md shadow-[#f47424]/25 hover:brightness-110 hover:-translate-y-0.5";
                  pill = (
                    <span className="absolute -top-2 -start-2 text-[9px] font-bold bg-white text-[#f47424] px-1.5 py-0.5 rounded-full flex items-center gap-0.5 shadow">
                      <CheckCircle2 className="w-2.5 h-2.5" /> محجوز
                    </span>
                  );
                } else {
                  cls =
                    "bg-[var(--card)] border-[var(--border)] text-[var(--foreground)] hover:border-[#f47424] hover:text-[#f47424] hover:shadow-md hover:shadow-[#f47424]/10 hover:-translate-y-0.5";
                }

                return (
                  <button
                    key={hhmm}
                    type="button"
                    disabled={isCustomer}
                    onClick={() => toggleSlot(hhmm)}
                    className={`${base} ${cls}`}
                    data-testid={`slot-${hhmm}`}
                    aria-pressed={isAdminBlocked}
                  >
                    {pill}
                    <span className="leading-tight">{label}</span>
                    <span className="text-[10px] font-normal opacity-70 mt-0.5">
                      {isCustomer ? "محجوز" : isAdminBlocked ? "اضغط للإلغاء" : "متاح"}
                    </span>
                    {!isCustomer && !isAdminBlocked && (
                      <Lock className="absolute bottom-1 end-1 w-3 h-3 opacity-0 group-hover/slot:opacity-40 transition-opacity" />
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
