import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { toast } from "sonner";
import axios from "axios";
import { Users, Clock, CheckCircle, XCircle, Minus, Plus } from "lucide-react";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const timeSlots = [
  "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00",
];

export default function SpacesPage() {
  const [offices, setOffices] = useState([]);
  const [sharedDesks, setSharedDesks] = useState(null);
  const [meetingRooms, setMeetingRooms] = useState([]);
  const [deskCount, setDeskCount] = useState(1);
  const [selectedDate, setSelectedDate] = useState(undefined);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [selectedTime, setSelectedTime] = useState("");
  const [bookingDialog, setBookingDialog] = useState({ open: false, type: "", data: null });
  const [formData, setFormData] = useState({ name: "", phone: "", email: "" });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    axios.get(`${API}/offices`).then((r) => setOffices(r.data)).catch(() => {});
    axios.get(`${API}/shared-desks`).then((r) => setSharedDesks(r.data)).catch(() => {});
    axios.get(`${API}/meeting-rooms`).then((r) => setMeetingRooms(r.data)).catch(() => {});
  }, []);

  const openBooking = (type, data) => {
    setBookingDialog({ open: true, type, data });
    setFormData({ name: "", phone: "", email: "" });
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.phone || !formData.email) {
      toast.error("يرجى تعبئة جميع الحقول");
      return;
    }
    setSubmitting(true);
    try {
      let endpoint = "";
      let body = { ...formData };
      if (bookingDialog.type === "desk") {
        endpoint = "/bookings/desk";
        body.num_desks = deskCount;
      } else if (bookingDialog.type === "office") {
        endpoint = "/bookings/office";
        body.office_id = bookingDialog.data.id;
      } else if (bookingDialog.type === "meeting") {
        endpoint = "/bookings/meeting-room";
        body.room_id = selectedRoom?.id;
        body.date = selectedDate?.toISOString().split("T")[0];
        body.time_slot = selectedTime;
      }
      const res = await axios.post(`${API}${endpoint}`, body);
      toast.success(res.data.message);
      setBookingDialog({ open: false, type: "", data: null });
    } catch {
      toast.error("حدث خطأ، يرجى المحاولة مرة أخرى");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main data-testid="spaces-page" className="pt-16">
      {/* Header */}
      <section className="bg-[#F9FAFB] py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-[#f47424] mb-3">المساحات</p>
          <h1 data-testid="spaces-title" className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight mb-4">
            مساحات عمل تناسب طموحك
          </h1>
          <p className="text-gray-500 text-base md:text-lg max-w-2xl mx-auto">
            اختر المساحة المثالية لأعمالك من بين خيارات متنوعة ومرنة
          </p>
        </div>
      </section>

      {/* Shared Desks */}
      {sharedDesks && (
        <section data-testid="shared-desks-section" className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-10">المكاتب المشتركة</h2>
            <div className="relative rounded-2xl overflow-hidden">
              <img
                src={sharedDesks.image}
                alt="المكاتب المشتركة"
                className="w-full h-[300px] md:h-[420px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute bottom-0 right-0 left-0 p-6 md:p-10 text-white">
                <div className="flex flex-wrap gap-6 mb-6">
                  <div className="bg-white/10 backdrop-blur-md rounded-lg px-5 py-3 border border-white/20">
                    <p className="text-xs text-gray-300">السعر</p>
                    <p className="text-xl font-bold">{sharedDesks.price} <span className="text-sm font-normal">{sharedDesks.currency}</span></p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-md rounded-lg px-5 py-3 border border-white/20">
                    <p className="text-xs text-gray-300">المقاعد المتاحة</p>
                    <p className="text-xl font-bold text-green-400">{sharedDesks.available_seats}</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-md rounded-lg px-5 py-3 border border-white/20">
                    <p className="text-xs text-gray-300">المقاعد المحجوزة</p>
                    <p className="text-xl font-bold text-red-400">{sharedDesks.occupied_seats}</p>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md rounded-lg border border-white/20">
                    <button
                      data-testid="desk-decrease"
                      onClick={() => setDeskCount(Math.max(1, deskCount - 1))}
                      className="p-2 hover:text-[#f47424] transition-colors"
                    >
                      <Minus size={18} />
                    </button>
                    <span data-testid="desk-count" className="text-lg font-bold min-w-[2rem] text-center">{deskCount}</span>
                    <button
                      data-testid="desk-increase"
                      onClick={() => setDeskCount(Math.min(sharedDesks.available_seats, deskCount + 1))}
                      className="p-2 hover:text-[#f47424] transition-colors"
                    >
                      <Plus size={18} />
                    </button>
                  </div>
                  <Button
                    data-testid="desk-book-button"
                    onClick={() => openBooking("desk", sharedDesks)}
                    className="bg-[#f47424] text-white hover:bg-[#d9641d] font-bold px-8 py-3 rounded-md"
                  >
                    احجز مكتبك المشترك
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Private Offices */}
      <section data-testid="offices-section" className="py-20 bg-[#F9FAFB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-10">المكاتب الخاصة</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {offices.map((office) => (
              <div
                key={office.id}
                data-testid={`office-card-${office.id}`}
                className="group bg-white rounded-xl border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:-translate-y-1"
              >
                <div className="relative h-48 overflow-hidden">
                  <img src={office.image} alt={office.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-bold ${office.available ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                    {office.available ? "متاح الآن" : `محجوز حتى ${office.reserved_until}`}
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{office.name}</h3>
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                    <span className="flex items-center gap-1"><Users size={14} /> {office.capacity} أشخاص</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-[#f47424] font-bold text-lg">{office.price} <span className="text-xs text-gray-400 font-normal">{office.currency}</span></p>
                    <Button
                      data-testid={`office-book-${office.id}`}
                      onClick={() => office.available && openBooking("office", office)}
                      disabled={!office.available}
                      className={`text-sm font-bold rounded-md px-4 py-2 ${office.available ? "bg-[#f47424] text-white hover:bg-[#d9641d]" : "bg-gray-100 text-gray-400 cursor-not-allowed"}`}
                    >
                      {office.available ? "احجز هذا المكتب" : "محجوز"}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Meeting Rooms */}
      <section data-testid="meeting-rooms-section" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-10">قاعات الاجتماعات</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Room Selection */}
            <div className="space-y-6">
              {meetingRooms.map((room) => (
                <div
                  key={room.id}
                  data-testid={`meeting-room-${room.id}`}
                  onClick={() => setSelectedRoom(room)}
                  className={`flex gap-4 p-4 rounded-xl border cursor-pointer transition-all duration-300 ${selectedRoom?.id === room.id ? "border-[#f47424] bg-orange-50/50" : "border-gray-100 hover:border-gray-200"}`}
                >
                  <img src={room.image} alt={room.name} className="w-24 h-24 md:w-32 md:h-32 rounded-lg object-cover flex-shrink-0" />
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900 mb-1">{room.name}</h3>
                    <div className="flex flex-wrap gap-3 text-sm text-gray-500 mb-2">
                      <span className="flex items-center gap-1"><Users size={14} /> {room.capacity} أشخاص</span>
                      <span className="flex items-center gap-1"><Clock size={14} /> {room.price} {room.currency}</span>
                    </div>
                    {selectedRoom?.id === room.id && (
                      <span className="inline-flex items-center gap-1 text-[#f47424] font-semibold text-xs">
                        <CheckCircle size={14} /> محدد
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Calendar & Time Selection */}
            <div className="bg-[#F9FAFB] rounded-xl border border-gray-100 p-6">
              {selectedRoom ? (
                <>
                  <h3 className="font-bold text-gray-900 mb-4">اختر التاريخ والوقت</h3>
                  <div className="flex justify-center mb-6">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      disabled={(date) => date < new Date()}
                      className="rounded-xl border border-gray-200 bg-white"
                      data-testid="meeting-calendar"
                      classNames={{
                        day_selected: "bg-[#f47424] text-white hover:bg-[#d9641d] focus:bg-[#d9641d] focus:text-white",
                        day_today: "bg-orange-50 text-[#f47424] font-bold",
                      }}
                    />
                  </div>
                  {selectedDate && (
                    <div data-testid="time-slots">
                      <h4 className="font-semibold text-gray-800 mb-3">الأوقات المتاحة</h4>
                      <div className="grid grid-cols-3 gap-2">
                        {timeSlots.map((slot) => (
                          <button
                            key={slot}
                            data-testid={`time-slot-${slot}`}
                            onClick={() => setSelectedTime(slot)}
                            className={`py-2 rounded-md text-sm font-semibold transition-all ${selectedTime === slot ? "bg-[#f47424] text-white" : "bg-white border border-gray-200 text-gray-700 hover:border-[#f47424] hover:text-[#f47424]"}`}
                          >
                            {slot}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  {selectedDate && selectedTime && (
                    <Button
                      data-testid="meeting-book-button"
                      onClick={() => openBooking("meeting", selectedRoom)}
                      className="w-full mt-6 bg-[#f47424] text-white hover:bg-[#d9641d] font-bold py-3 rounded-md"
                    >
                      احجز القاعة
                    </Button>
                  )}
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center py-16 text-gray-400">
                  <Clock size={40} className="mb-4" />
                  <p className="font-semibold">اختر قاعة اجتماعات للبدء</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Booking Dialog */}
      <Dialog open={bookingDialog.open} onOpenChange={(open) => setBookingDialog({ ...bookingDialog, open })}>
        <DialogContent className="max-w-md" dir="rtl">
          <DialogHeader>
            <DialogTitle className="text-right">تأكيد الحجز</DialogTitle>
            <DialogDescription className="text-right">
              يرجى تعبئة بياناتك لإتمام الحجز
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <Input
              data-testid="booking-name"
              placeholder="الاسم الكامل"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="bg-gray-50 border-gray-200 text-right"
            />
            <Input
              data-testid="booking-phone"
              placeholder="رقم الهاتف"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="bg-gray-50 border-gray-200 text-right"
            />
            <Input
              data-testid="booking-email"
              placeholder="البريد الإلكتروني"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="bg-gray-50 border-gray-200 text-right"
            />
            <Button
              data-testid="booking-submit"
              onClick={handleSubmit}
              disabled={submitting}
              className="w-full bg-[#f47424] text-white hover:bg-[#d9641d] font-bold py-3 rounded-md"
            >
              {submitting ? "جاري الإرسال..." : "تأكيد الحجز"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </main>
  );
}
