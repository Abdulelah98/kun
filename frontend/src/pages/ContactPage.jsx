import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import axios from "axios";
import { Mail, Phone, MapPin, MessageCircle, Instagram, Twitter, Send } from "lucide-react";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const serviceOptions = [
  { value: "spaces", label: "المساحات" },
  { value: "private_office", label: "مكتب خاص" },
  { value: "meeting_room", label: "قاعة اجتماعات" },
  { value: "business_services", label: "خدمات الأعمال" },
  { value: "pod", label: "البود الذكي" },
  { value: "other", label: "أخرى" },
];

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    service_type: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.email || !formData.service_type) {
      toast.error("يرجى تعبئة جميع الحقول المطلوبة");
      return;
    }
    setSubmitting(true);
    try {
      await axios.post(`${API}/contact`, formData);
      toast.success("تم إرسال طلبك بنجاح! سنتواصل معك قريباً");
      setFormData({ name: "", phone: "", email: "", service_type: "", message: "" });
    } catch {
      toast.error("حدث خطأ، يرجى المحاولة مرة أخرى");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main data-testid="contact-page" className="pt-16">
      {/* Header - Dark navy */}
      <section className="bg-[#0A1128] py-24 md:py-32 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#f47424] mb-4">تواصل معنا</p>
          <h1 data-testid="contact-title" className="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight mb-5 leading-[1.2]">
            نسعد بتواصلك معنا
          </h1>
          <p className="text-gray-400 text-base md:text-lg max-w-2xl mx-auto">
            فريقنا جاهز لمساعدتك في اختيار المساحة المثالية لأعمالك
          </p>
        </div>
      </section>

      {/* Form & Info */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
            {/* Form */}
            <div className="lg:col-span-3">
              <form onSubmit={handleSubmit} data-testid="contact-form" className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">الاسم الكريم *</label>
                    <Input
                      data-testid="contact-name"
                      placeholder="أدخل اسمك"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="bg-gray-50 border-gray-200 h-12 text-right"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">رقم الهاتف *</label>
                    <Input
                      data-testid="contact-phone"
                      placeholder="05xxxxxxxx"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="bg-gray-50 border-gray-200 h-12 text-right"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">البريد الإلكتروني *</label>
                    <Input
                      data-testid="contact-email"
                      type="email"
                      placeholder="email@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="bg-gray-50 border-gray-200 h-12 text-right"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">نوع الخدمة *</label>
                    <Select
                      value={formData.service_type}
                      onValueChange={(val) => setFormData({ ...formData, service_type: val })}
                      dir="rtl"
                    >
                      <SelectTrigger data-testid="contact-service-select" className="bg-gray-50 border-gray-200 h-12">
                        <SelectValue placeholder="اختر الخدمة" />
                      </SelectTrigger>
                      <SelectContent>
                        {serviceOptions.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value} data-testid={`service-option-${opt.value}`}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">رسالتك</label>
                  <Textarea
                    data-testid="contact-message"
                    placeholder="اكتب رسالتك هنا..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="bg-gray-50 border-gray-200 min-h-[120px] text-right"
                  />
                </div>
                <Button
                  data-testid="contact-submit"
                  type="submit"
                  disabled={submitting}
                  className="bg-[#f47424] text-white hover:bg-[#d9641d] font-bold px-8 py-3 rounded-md text-base h-12"
                >
                  <span className="flex items-center gap-2">
                    {submitting ? "جاري الإرسال..." : "إرسال الطلب"}
                    <Send size={16} />
                  </span>
                </Button>
              </form>
            </div>

            {/* Contact Info */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-[#EDF0F4] rounded-xl p-6 border border-gray-100">
                <h3 className="font-bold text-gray-900 mb-5">معلومات التواصل</h3>
                <div className="space-y-4">
                  <a href="mailto:info@kunws.com" className="flex items-center gap-3 text-gray-600 hover:text-[#f47424] transition-colors">
                    <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center flex-shrink-0">
                      <Mail className="w-5 h-5 text-[#f47424]" />
                    </div>
                    <span className="text-sm">info@kunws.com</span>
                  </a>
                  <a href="tel:+966535420969" className="flex items-center gap-3 text-gray-600 hover:text-[#f47424] transition-colors">
                    <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center flex-shrink-0">
                      <Phone className="w-5 h-5 text-[#f47424]" />
                    </div>
                    <span className="text-sm">+966 53 542 0969</span>
                  </a>
                  <div className="flex items-center gap-3 text-gray-600">
                    <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-5 h-5 text-[#f47424]" />
                    </div>
                    <span className="text-sm">المملكة العربية السعودية، الرياض</span>
                  </div>
                </div>
              </div>

              {/* WhatsApp */}
              <a
                href="https://wa.me/966535420969"
                target="_blank"
                rel="noopener noreferrer"
                data-testid="whatsapp-button"
                className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-xl p-5 hover:bg-green-100 transition-colors"
              >
                <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                  <MessageCircle className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-bold text-green-800 text-sm">تواصل عبر واتساب</p>
                  <p className="text-green-600 text-xs">رد سريع خلال دقائق</p>
                </div>
              </a>

              {/* Social */}
              <div className="bg-[#EDF0F4] rounded-xl p-6 border border-gray-100">
                <h3 className="font-bold text-gray-900 mb-4">تابعنا</h3>
                <div className="flex gap-3">
                  <a
                    href="https://instagram.com/kun__work"
                    target="_blank"
                    rel="noopener noreferrer"
                    data-testid="contact-instagram"
                    className="w-10 h-10 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:text-[#f47424] hover:border-[#f47424] transition-all"
                  >
                    <Instagram size={18} />
                  </a>
                  <a
                    href="https://twitter.com/Kun__sa"
                    target="_blank"
                    rel="noopener noreferrer"
                    data-testid="contact-twitter"
                    className="w-10 h-10 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:text-[#f47424] hover:border-[#f47424] transition-all"
                  >
                    <Twitter size={18} />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Google Map */}
      <section data-testid="map-section" className="h-[400px] w-full">
        <iframe
          src="https://maps.google.com/maps?q=24.8478721,46.6660527&hl=ar&z=17&t=m&output=embed"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="موقع كن - KUN Coworking space"
        />
      </section>
    </main>
  );
}
