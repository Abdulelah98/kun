import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import axios from "axios";
import { Mail, Phone, MapPin, MessageCircle, Instagram, Twitter, Linkedin, Send, Clock } from "lucide-react";
import { useContent } from "@/contexts/ContentContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useSettings } from "@/contexts/SettingsContext";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const FALLBACK_SERVICE_OPTIONS = [
  { value: "spaces", labelKey: "contact.service.spaces" },
  { value: "private_office", labelKey: "contact.service.private_office" },
  { value: "meeting_room", labelKey: "contact.service.meeting_room" },
  { value: "business_services", labelKey: "contact.service.business_services" },
  { value: "pod", labelKey: "contact.service.pod" },
  { value: "other", labelKey: "contact.service.other" },
];

export default function ContactPage() {
  const header = useContent("contact_header");
  const info = useContent("contact_info");
  const formT = useContent("contact_form");
  const formServices = useContent("contact_form_services");
  const settings = useSettings();
  const { t, isRtl, dir } = useLanguage();
  const social = settings.social || {};
  // Settings values take precedence over CMS contact_info
  const displayPhone = settings.phone || info.phone_value || "";
  const displayEmail = settings.email || info.email_value || "";
  const displayAddress = (isRtl ? settings.address_ar : settings.address_en) || info.address_value || "";

  // Build the service options: prefer CMS items, fallback to static i18n
  const serviceOptions = formServices?.items?.length
    ? formServices.items.filter((it) => it && it.value).map((it) => ({ value: it.value, label: it.label || it.value }))
    : FALLBACK_SERVICE_OPTIONS.map((o) => ({ value: o.value, label: t(o.labelKey) }));

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
      toast.error(t("contact.fill_required"));
      return;
    }
    setSubmitting(true);
    try {
      await axios.post(`${API}/contact`, formData);
      toast.success(formT.success_message || t("contact.success_default"));
      setFormData({ name: "", phone: "", email: "", service_type: "", message: "" });
    } catch {
      toast.error(t("common.try_again"));
    } finally {
      setSubmitting(false);
    }
  };

  const phoneDigits = (displayPhone || "").replace(/[^0-9+]/g, "");

  return (
    <main data-testid="contact-page" className="pt-16">
      {/* Header - Dark navy */}
      <section className="bg-[#0A1128] py-24 md:py-32 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#f47424] mb-4">{header.eyebrow}</p>
          <h1 data-testid="contact-title" className="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight mb-5 leading-[1.2]">
            {header.title}
          </h1>
          <p className="text-gray-400 text-base md:text-lg max-w-2xl mx-auto">
            {header.subtitle}
          </p>
        </div>
      </section>

      {/* Form & Info */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
            {/* Form */}
            <div className="lg:col-span-3">
              {formT.title && (
                <h2 className="text-2xl font-bold text-gray-900 mb-6">{formT.title}</h2>
              )}
              <form onSubmit={handleSubmit} data-testid="contact-form" className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">{formT.name_label} *</label>
                    <Input
                      data-testid="contact-name"
                      placeholder={t("contact.placeholder_name")}
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="bg-gray-50 border-gray-200 h-12 text-start"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">{formT.phone_label} *</label>
                    <Input
                      data-testid="contact-phone"
                      placeholder="05xxxxxxxx"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="bg-gray-50 border-gray-200 h-12 text-start"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">{formT.email_label} *</label>
                    <Input
                      data-testid="contact-email"
                      type="email"
                      placeholder={t("contact.placeholder_email")}
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="bg-gray-50 border-gray-200 h-12 text-start"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">{formT.service_label} *</label>
                    <Select
                      value={formData.service_type}
                      onValueChange={(val) => setFormData({ ...formData, service_type: val })}
                      dir={dir}
                    >
                      <SelectTrigger data-testid="contact-service-select" className="bg-gray-50 border-gray-200 h-12">
                        <SelectValue placeholder={t("contact.placeholder_service")} />
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
                  <label className="block text-sm font-semibold text-gray-700 mb-2">{formT.message_label}</label>
                  <Textarea
                    data-testid="contact-message"
                    placeholder={t("contact.placeholder_message")}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="bg-gray-50 border-gray-200 min-h-[120px] text-start"
                  />
                </div>
                <Button
                  data-testid="contact-submit"
                  type="submit"
                  disabled={submitting}
                  className="bg-[#f47424] text-white hover:bg-[#d9641d] font-bold px-8 py-3 rounded-md text-base h-12"
                >
                  <span className="flex items-center gap-2">
                    {submitting ? t("common.sending") : (formT.submit_text || t("common.send"))}
                    <Send size={16} />
                  </span>
                </Button>
              </form>
            </div>

            {/* Contact Info */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-[#EDF0F4] rounded-xl p-6 border border-gray-100">
                <h3 className="font-bold text-gray-900 mb-5">{t("contact.info_title")}</h3>
                <div className="space-y-4">
                  {displayEmail && (
                    <a href={`mailto:${displayEmail}`} className="flex items-center gap-3 text-gray-600 hover:text-[#f47424] transition-colors">
                      <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center flex-shrink-0">
                        <Mail className="w-5 h-5 text-[#f47424]" />
                      </div>
                      <span className="text-sm">{displayEmail}</span>
                    </a>
                  )}
                  {displayPhone && (
                    <a href={`tel:${phoneDigits}`} className="flex items-center gap-3 text-gray-600 hover:text-[#f47424] transition-colors">
                      <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center flex-shrink-0">
                        <Phone className="w-5 h-5 text-[#f47424]" />
                      </div>
                      <span className="text-sm">{displayPhone}</span>
                    </a>
                  )}
                  {displayAddress && (
                    <div className="flex items-center gap-3 text-gray-600">
                      <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center flex-shrink-0">
                        <MapPin className="w-5 h-5 text-[#f47424]" />
                      </div>
                      <span className="text-sm whitespace-pre-line">{displayAddress}</span>
                    </div>
                  )}
                  {info.working_hours_value && (
                    <div className="flex items-center gap-3 text-gray-600">
                      <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center flex-shrink-0">
                        <Clock className="w-5 h-5 text-[#f47424]" />
                      </div>
                      <span className="text-sm">{info.working_hours_value}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* WhatsApp */}
              {settings.whatsapp && (
                <a
                  href={`https://wa.me/${(settings.whatsapp || "").replace(/[^0-9]/g, "").replace(/^0/, "966")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-testid="whatsapp-button"
                  className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-xl p-5 hover:bg-green-100 transition-colors"
                >
                  <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                    <MessageCircle className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-green-800 text-sm">{info.whatsapp_title || t("contact.whatsapp_title")}</p>
                    <p className="text-green-600 text-xs">{info.whatsapp_subtitle || t("contact.whatsapp_subtitle")}</p>
                  </div>
                </a>
              )}

              {/* Social */}
              {(social.instagram || social.twitter || social.linkedin || social.snapchat) && (
                <div className="bg-[#EDF0F4] rounded-xl p-6 border border-gray-100">
                  <h3 className="font-bold text-gray-900 mb-4">{info.social_title || t("contact.follow_us")}</h3>
                  <div className="flex gap-3 flex-wrap">
                    {social.instagram && (
                      <a href={social.instagram} target="_blank" rel="noopener noreferrer" data-testid="contact-instagram" className="w-10 h-10 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:text-[#f47424] hover:border-[#f47424] transition-all">
                        <Instagram size={18} />
                      </a>
                    )}
                    {social.twitter && (
                      <a href={social.twitter} target="_blank" rel="noopener noreferrer" data-testid="contact-twitter" className="w-10 h-10 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:text-[#f47424] hover:border-[#f47424] transition-all">
                        <Twitter size={18} />
                      </a>
                    )}
                    {social.linkedin && (
                      <a href={social.linkedin} target="_blank" rel="noopener noreferrer" data-testid="contact-linkedin" className="w-10 h-10 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:text-[#f47424] hover:border-[#f47424] transition-all">
                        <Linkedin size={18} />
                      </a>
                    )}
                    {social.snapchat && (
                      <a href={social.snapchat} target="_blank" rel="noopener noreferrer" data-testid="contact-snapchat" className="w-10 h-10 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:text-[#f47424] hover:border-[#f47424] transition-all text-xs font-bold">
                        SC
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Google Map */}
      <section data-testid="map-section" className="h-[400px] w-full">
        {settings.map_embed ? (
          <iframe
            src={settings.map_embed}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="KUN Coworking space"
          />
        ) : (
          <iframe
            src={`https://maps.google.com/maps?q=${settings.map_lat || 24.8478721},${settings.map_lng || 46.6660527}&hl=${isRtl ? "ar" : "en"}&z=17&t=m&output=embed`}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="KUN Coworking space"
          />
        )}
      </section>
    </main>
  );
}
