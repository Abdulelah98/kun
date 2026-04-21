import { useEffect, useState } from "react";
import api, { formatApiError } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Loader2, Shield, User } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export default function Users() {
  const { user: current } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ email: "", password: "", name: "", role: "staff" });
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/admin/users");
      setItems(data);
    } catch (e) { toast.error(formatApiError(e)); }
    finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const openNew = () => { setEditing(null); setForm({ email: "", password: "", name: "", role: "staff" }); setOpen(true); };
  const openEdit = (it) => { setEditing(it); setForm({ email: it.email, password: "", name: it.name, role: it.role }); setOpen(true); };

  const save = async () => {
    setSaving(true);
    try {
      if (editing) {
        const body = { name: form.name, role: form.role };
        if (form.password) body.password = form.password;
        await api.patch(`/admin/users/${editing.id}`, body);
      } else {
        await api.post("/admin/users", form);
      }
      toast.success("تم الحفظ");
      setOpen(false);
      load();
    } catch (e) { toast.error(formatApiError(e)); }
    finally { setSaving(false); }
  };

  const remove = async (it) => {
    if (!window.confirm(`حذف المستخدم ${it.email}؟`)) return;
    try { await api.delete(`/admin/users/${it.id}`); toast.success("تم الحذف"); load(); }
    catch (e) { toast.error(formatApiError(e)); }
  };

  return (
    <div data-testid="admin-users-page">
      <div className="mb-6 flex justify-between items-end flex-wrap gap-3">
        <div>
          <h1 className="text-3xl font-bold">المستخدمون</h1>
          <p className="text-white/50 text-sm mt-1">إدارة حسابات الإدارة والموظفين</p>
        </div>
        <Button onClick={openNew} className="bg-[#f47424] hover:bg-[#f47424]/90" data-testid="user-add-btn">
          <Plus className="w-4 h-4 ml-1" /> إضافة مستخدم
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-10 text-white/40"><Loader2 className="w-5 h-5 animate-spin inline" /></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((it) => (
            <div key={it.id} className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-5" data-testid={`user-card-${it.id}`}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${it.role === "admin" ? "bg-[#f47424]/15 text-[#f47424]" : "bg-sky-500/15 text-sky-300"}`}>
                    {it.role === "admin" ? <Shield className="w-5 h-5" /> : <User className="w-5 h-5" />}
                  </div>
                  <div>
                    <div className="font-bold">{it.name}</div>
                    <div className="text-xs text-white/50">{it.email}</div>
                  </div>
                </div>
                <Badge variant="outline" className={it.role === "admin" ? "bg-[#f47424]/15 text-[#f47424] border-[#f47424]/30" : "bg-sky-500/15 text-sky-300 border-sky-500/30"}>
                  {it.role === "admin" ? "مدير" : "موظف"}
                </Badge>
              </div>
              <div className="flex gap-2 pt-2">
                <Button size="sm" variant="outline" onClick={() => openEdit(it)} className="flex-1 border-white/10 bg-transparent text-white hover:bg-white/5">
                  <Pencil className="w-3.5 h-3.5 ml-1" /> تعديل
                </Button>
                <Button size="icon" variant="ghost" disabled={current?.id === it.id} onClick={() => remove(it)}
                  className="text-white/50 hover:text-rose-400 hover:bg-rose-500/10 disabled:opacity-40">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent dir="rtl" className="bg-[#121214] border-white/10 text-white max-w-md">
          <DialogHeader><DialogTitle className="text-right">{editing ? "تعديل مستخدم" : "مستخدم جديد"}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="text-white/70 mb-1.5 block">الاسم</Label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="bg-white/[0.04] border-white/10 text-white" />
            </div>
            <div>
              <Label className="text-white/70 mb-1.5 block">البريد الإلكتروني</Label>
              <Input type="email" disabled={!!editing} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="bg-white/[0.04] border-white/10 text-white disabled:opacity-60" />
            </div>
            <div>
              <Label className="text-white/70 mb-1.5 block">{editing ? "كلمة مرور جديدة (اختياري)" : "كلمة المرور"}</Label>
              <Input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="bg-white/[0.04] border-white/10 text-white" />
            </div>
            <div>
              <Label className="text-white/70 mb-1.5 block">الدور</Label>
              <Select value={form.role} onValueChange={(v) => setForm({ ...form, role: v })}>
                <SelectTrigger className="bg-white/[0.04] border-white/10 text-white"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">مدير (وصول كامل)</SelectItem>
                  <SelectItem value="staff">موظف (حجوزات + رسائل)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)} className="border-white/10 bg-transparent text-white">إلغاء</Button>
            <Button onClick={save} disabled={saving} className="bg-[#f47424] hover:bg-[#f47424]/90" data-testid="user-save-btn">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : "حفظ"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
