import { useEffect, useRef, useState } from "react";
import api, { formatApiError } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Loader2, Upload, Image as ImageIcon, X, Trash2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

const BACKEND = process.env.REACT_APP_BACKEND_URL;
export const resolveMediaUrl = (url) => {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  if (url.startsWith("/api/")) return `${BACKEND}${url}`;
  return url;
};

/**
 * MediaPicker dialog + button. Opens a library of uploaded images, allows upload, select.
 * Props:
 *  - value: string | string[] (current url or urls)
 *  - onChange: (newValue) => void
 *  - multiple: bool
 *  - label: string
 */
export default function MediaPicker({ value, onChange, multiple = false, label = "اختر صورة" }) {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selected, setSelected] = useState([]);
  const fileRef = useRef(null);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/admin/media");
      setItems(data);
    } catch (e) {
      toast.error(formatApiError(e));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      load();
      setSelected(multiple ? (Array.isArray(value) ? value : []) : value ? [value] : []);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const handleUpload = async (files) => {
    if (!files || !files.length) return;
    setUploading(true);
    try {
      for (const f of files) {
        const fd = new FormData();
        fd.append("file", f);
        await api.post("/admin/media/upload", fd, { headers: { "Content-Type": "multipart/form-data" } });
      }
      toast.success("تم رفع الصور");
      await load();
    } catch (e) {
      toast.error(formatApiError(e));
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const toggleSelect = (url) => {
    if (multiple) {
      setSelected((prev) => (prev.includes(url) ? prev.filter((u) => u !== url) : [...prev, url]));
    } else {
      setSelected([url]);
    }
  };

  const confirm = () => {
    if (multiple) onChange(selected);
    else onChange(selected[0] || "");
    setOpen(false);
  };

  const removeItem = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm("حذف هذه الصورة من المكتبة؟")) return;
    try {
      await api.delete(`/admin/media/${id}`);
      toast.success("تم الحذف");
      load();
    } catch (err) {
      toast.error(formatApiError(err));
    }
  };

  // Preview for current value(s)
  const preview = (() => {
    const urls = multiple ? (Array.isArray(value) ? value : []) : value ? [value] : [];
    return urls;
  })();

  return (
    <div>
      <div className="flex flex-wrap gap-2 items-start">
        {preview.length > 0 ? (
          preview.map((u, i) => (
            <div key={i} className="relative w-24 h-24 rounded-lg overflow-hidden border border-white/10 dark:border-white/10 border-[var(--border)] group">
              <img src={resolveMediaUrl(u)} alt="" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => {
                  if (multiple) onChange(preview.filter((_, j) => j !== i));
                  else onChange("");
                }}
                className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/70 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                aria-label="إزالة"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))
        ) : null}
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="w-24 h-24 rounded-lg border-2 border-dashed border-[var(--border)] text-[var(--muted-foreground)] flex flex-col items-center justify-center gap-1 hover:border-[#f47424] hover:text-[#f47424] transition text-xs"
          data-testid="media-picker-open"
        >
          <ImageIcon className="w-5 h-5" />
          <span>{label}</span>
        </button>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent dir="rtl" className="max-w-4xl max-h-[85vh] overflow-hidden flex flex-col bg-[var(--card)] border-[var(--border)] text-[var(--foreground)]">
          <DialogHeader>
            <DialogTitle className="text-right">مكتبة الصور</DialogTitle>
            <DialogDescription className="text-right text-[var(--muted-foreground)]">
              اختر صورة من المكتبة أو ارفع صورة جديدة.
            </DialogDescription>
          </DialogHeader>

          <div className="flex items-center gap-2 mb-3">
            <Button
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              className="bg-[#f47424] hover:bg-[#f47424]/90 text-white"
              data-testid="media-upload-btn"
            >
              {uploading ? <Loader2 className="w-4 h-4 animate-spin ml-1" /> : <Upload className="w-4 h-4 ml-1" />}
              رفع صورة
            </Button>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => handleUpload(e.target.files)}
            />
            <div className="text-xs text-[var(--muted-foreground)]">JPG, PNG, WEBP · حتى 10MB</div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="text-center py-10 text-[var(--muted-foreground)]"><Loader2 className="w-5 h-5 animate-spin inline" /></div>
            ) : items.length === 0 ? (
              <div className="text-center py-14 text-[var(--muted-foreground)]">لا توجد صور في المكتبة بعد. ابدأ بالرفع.</div>
            ) : (
              <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
                {items.map((m) => {
                  const sel = selected.includes(m.url);
                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => toggleSelect(m.url)}
                      className={`relative aspect-square rounded-xl overflow-hidden border-2 transition ${
                        sel ? "border-[#f47424] ring-2 ring-[#f47424]/40" : "border-[var(--border)] hover:border-[#f47424]/50"
                      }`}
                      data-testid={`media-item-${m.id}`}
                    >
                      <img src={resolveMediaUrl(m.url)} alt="" className="w-full h-full object-cover" loading="lazy" />
                      {sel && (
                        <div className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-[#f47424] text-white flex items-center justify-center">
                          <CheckCircle2 className="w-4 h-4" />
                        </div>
                      )}
                      <span
                        onClick={(e) => removeItem(m.id, e)}
                        className="absolute bottom-1.5 left-1.5 w-6 h-6 rounded-full bg-black/70 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-rose-500 transition cursor-pointer"
                      >
                        <Trash2 className="w-3 h-3" />
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setOpen(false)} className="border-[var(--border)] bg-transparent">إلغاء</Button>
            <Button onClick={confirm} disabled={selected.length === 0} className="bg-[#f47424] hover:bg-[#f47424]/90 text-white" data-testid="media-confirm-btn">
              {multiple ? `اختيار (${selected.length})` : "اختيار"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
