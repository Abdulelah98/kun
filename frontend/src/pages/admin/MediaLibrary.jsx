import { useEffect, useRef, useState } from "react";
import api, { formatApiError } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2, Upload, Trash2, Image as ImageIcon, Copy } from "lucide-react";
import { resolveMediaUrl } from "@/components/admin/MediaPicker";

export default function MediaLibrary() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
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

  useEffect(() => { load(); }, []);

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
      load();
    } catch (e) {
      toast.error(formatApiError(e));
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const remove = async (id) => {
    if (!window.confirm("حذف هذه الصورة؟")) return;
    try {
      await api.delete(`/admin/media/${id}`);
      setItems((prev) => prev.filter((x) => x.id !== id));
      toast.success("تم الحذف");
    } catch (e) {
      toast.error(formatApiError(e));
    }
  };

  const copyUrl = (url) => {
    navigator.clipboard.writeText(resolveMediaUrl(url));
    toast.success("تم نسخ الرابط");
  };

  return (
    <div data-testid="admin-media-page">
      <div className="mb-6 flex justify-between items-end flex-wrap gap-3">
        <div>
          <h1 className="text-3xl font-bold">مكتبة الصور</h1>
          <p className="text-[var(--muted-foreground)] text-sm mt-1">ارفع الصور واستخدمها في كل أقسام الموقع.</p>
        </div>
        <Button
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="bg-[#f47424] hover:bg-[#f47424]/90 text-white"
          data-testid="media-page-upload-btn"
        >
          {uploading ? <Loader2 className="w-4 h-4 animate-spin ml-1" /> : <Upload className="w-4 h-4 ml-1" />}
          رفع صور
        </Button>
        <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={(e) => handleUpload(e.target.files)} />
      </div>

      {loading ? (
        <div className="text-center py-10 text-[var(--muted-foreground)]"><Loader2 className="w-5 h-5 animate-spin inline" /></div>
      ) : items.length === 0 ? (
        <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-16 text-center text-[var(--muted-foreground)]">
          <ImageIcon className="w-10 h-10 mx-auto mb-3 opacity-40" />
          <div className="mb-1 font-semibold">لا توجد صور بعد</div>
          <div className="text-xs">ابدأ بالضغط على زر "رفع صور" أعلاه.</div>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {items.map((m) => (
            <div key={m.id} className="group bg-[var(--card)] border border-[var(--border)] rounded-xl overflow-hidden" data-testid={`media-tile-${m.id}`}>
              <div className="relative aspect-square">
                <img src={resolveMediaUrl(m.url)} alt="" className="w-full h-full object-cover" loading="lazy" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center gap-1.5 opacity-0 group-hover:opacity-100">
                  <button onClick={() => copyUrl(m.url)} className="w-9 h-9 rounded-full bg-white/90 text-gray-800 flex items-center justify-center hover:bg-white" title="نسخ الرابط">
                    <Copy className="w-4 h-4" />
                  </button>
                  <button onClick={() => remove(m.id)} className="w-9 h-9 rounded-full bg-rose-500 text-white flex items-center justify-center hover:bg-rose-600" title="حذف">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="p-2 text-[10px] truncate opacity-70">{m.original_filename}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
