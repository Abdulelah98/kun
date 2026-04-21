import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, Lock, Mail, ShieldCheck } from "lucide-react";

export default function AdminLogin() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  if (user && user !== false) {
    return <Navigate to="/admin" replace />;
  }

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const res = await login(email, password);
    setLoading(false);
    if (res.ok) {
      toast.success("تم تسجيل الدخول بنجاح");
      navigate("/admin", { replace: true });
    } else {
      toast.error(res.error || "فشل تسجيل الدخول");
    }
  };

  return (
    <div dir="rtl" className="min-h-screen bg-[#0a0a0b] text-white flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#f47424]/10 border border-[#f47424]/30 mb-4">
            <ShieldCheck className="w-7 h-7 text-[#f47424]" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">لوحة تحكم KUN</h1>
          <p className="text-sm text-white/50 mt-2">تسجيل الدخول للإدارة</p>
        </div>

        <form
          onSubmit={onSubmit}
          className="bg-white/[0.03] border border-white/10 rounded-2xl p-8 backdrop-blur-xl space-y-5"
          data-testid="admin-login-form"
        >
          <div className="space-y-2">
            <Label htmlFor="email" className="text-white/80">البريد الإلكتروني</Label>
            <div className="relative">
              <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              <Input
                id="email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-white/[0.04] border-white/10 text-white pr-10 placeholder:text-white/30"
                placeholder="admin@kun.com"
                data-testid="admin-login-email"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-white/80">كلمة المرور</Label>
            <div className="relative">
              <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              <Input
                id="password"
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-white/[0.04] border-white/10 text-white pr-10 placeholder:text-white/30"
                placeholder="••••••••"
                data-testid="admin-login-password"
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-[#f47424] hover:bg-[#f47424]/90 text-white h-11 text-base font-semibold rounded-xl"
            data-testid="admin-login-submit"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "تسجيل الدخول"}
          </Button>
        </form>

        <p className="text-center text-xs text-white/30 mt-6">
          وصول مقتصر على فريق الإدارة فقط
        </p>
      </div>
    </div>
  );
}
