"use client";

import { useState, Suspense } from "react";
import { motion } from "framer-motion";
import { Calendar, Users, MapPin, CreditCard, Check, ArrowLeft, Phone, Mail, MessageSquare } from "lucide-react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { hotels } from "@/data/seed-hotels";
import { cities } from "@/data/seed-cities";

function BookingContent() {
  const searchParams = useSearchParams();
  const hotelId = searchParams.get("hotel");
  const hotel = hotelId ? hotels.find((h) => h.id === hotelId) : null;

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    checkIn: "",
    checkOut: "",
    guests: "2",
    rooms: "1",
    specialRequests: "",
    paymentMethod: "instapay",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Calculate nights and total
  const nights = formData.checkIn && formData.checkOut
    ? Math.max(1, Math.ceil((new Date(formData.checkOut).getTime() - new Date(formData.checkIn).getTime()) / (1000 * 60 * 60 * 24)))
    : 1;
  const totalUSD = hotel ? hotel.price_per_night_usd * nights * Number(formData.rooms) : 0;
  const totalEGP = Math.round(totalUSD * 50.5);

  if (submitted) {
    return (
      <div className="min-h-screen pt-24 pb-16 px-4 flex items-center justify-center">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center max-w-md">
          <div className="w-20 h-20 rounded-full bg-[#39FF14]/20 flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-[#39FF14]" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-4">Booking Request Sent!</h1>
          <p className="text-[#B0B0B0] mb-2">
            Your booking request for <span className="text-white font-medium">{hotel?.name || "your hotel"}</span> has been submitted.
          </p>
          <p className="text-[#666] text-sm mb-6">
            Our team will confirm your reservation within 2 hours via email or WhatsApp.
            {formData.paymentMethod === "instapay" && " You'll receive InstaPay payment details in the confirmation."}
          </p>
          <div className="bg-[#1a1a1a] rounded-2xl border border-[#333]/50 p-4 mb-6 text-left">
            <p className="text-xs text-[#666] mb-2">Booking Summary</p>
            <p className="text-white text-sm font-medium">{hotel?.name}</p>
            <p className="text-[#B0B0B0] text-xs">{formData.checkIn} → {formData.checkOut} · {nights} night{nights > 1 ? "s" : ""} · {formData.rooms} room{Number(formData.rooms) > 1 ? "s" : ""}</p>
            <p className="text-[#39FF14] text-lg font-bold mt-2">{totalEGP.toLocaleString()} EGP <span className="text-[#666] text-xs font-normal">(${totalUSD})</span></p>
          </div>
          <Link href="/" className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#39FF14] to-[#00E676] text-black font-semibold rounded-xl">
            Back to Home
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 max-w-3xl mx-auto">
      <Link href="/hotels" className="inline-flex items-center gap-2 text-[#B0B0B0] hover:text-white text-sm mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Hotels
      </Link>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-display font-bold mb-2">
          <span className="text-[#39FF14]">Book</span> Your Stay
        </h1>
        {hotel && (
          <p className="text-[#B0B0B0] mb-8">{hotel.name} · {cities.find(c => c.id === hotel.city_id)?.name}</p>
        )}

        {/* Progress Steps */}
        <div className="flex items-center gap-2 mb-8">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center gap-2 flex-1">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                step >= s ? "bg-[#39FF14] text-black" : "bg-[#2a2a2a] text-[#666]"
              }`}>{s}</div>
              <span className={`text-xs ${step >= s ? "text-white" : "text-[#666]"}`}>
                {s === 1 ? "Details" : s === 2 ? "Contact" : "Payment"}
              </span>
              {s < 3 && <div className={`flex-1 h-0.5 ${step > s ? "bg-[#39FF14]" : "bg-[#333]"}`} />}
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit}>
          {/* Step 1: Stay Details */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-white mb-2"><Calendar className="w-3.5 h-3.5 inline mr-1" /> Check-in</label>
                  <input type="date" value={formData.checkIn} onChange={(e) => updateField("checkIn", e.target.value)} required
                    className="w-full px-4 py-3 bg-[#2a2a2a] border border-[#333] rounded-xl text-white text-sm focus:outline-none focus:border-[#39FF14]" />
                </div>
                <div>
                  <label className="block text-sm text-white mb-2"><Calendar className="w-3.5 h-3.5 inline mr-1" /> Check-out</label>
                  <input type="date" value={formData.checkOut} onChange={(e) => updateField("checkOut", e.target.value)} required
                    className="w-full px-4 py-3 bg-[#2a2a2a] border border-[#333] rounded-xl text-white text-sm focus:outline-none focus:border-[#39FF14]" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-white mb-2"><Users className="w-3.5 h-3.5 inline mr-1" /> Guests</label>
                  <select value={formData.guests} onChange={(e) => updateField("guests", e.target.value)}
                    className="w-full px-4 py-3 bg-[#2a2a2a] border border-[#333] rounded-xl text-white text-sm focus:outline-none focus:border-[#39FF14]">
                    {[1,2,3,4,5,6].map(n => <option key={n} value={n}>{n} Guest{n>1?"s":""}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-white mb-2">Rooms</label>
                  <select value={formData.rooms} onChange={(e) => updateField("rooms", e.target.value)}
                    className="w-full px-4 py-3 bg-[#2a2a2a] border border-[#333] rounded-xl text-white text-sm focus:outline-none focus:border-[#39FF14]">
                    {[1,2,3,4].map(n => <option key={n} value={n}>{n} Room{n>1?"s":""}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm text-white mb-2"><MessageSquare className="w-3.5 h-3.5 inline mr-1" /> Special Requests</label>
                <textarea value={formData.specialRequests} onChange={(e) => updateField("specialRequests", e.target.value)} rows={3} placeholder="Airport transfer, late check-in, etc."
                  className="w-full px-4 py-3 bg-[#2a2a2a] border border-[#333] rounded-xl text-white text-sm placeholder-[#666] focus:outline-none focus:border-[#39FF14] resize-none" />
              </div>
              <button type="button" onClick={() => setStep(2)}
                className="w-full py-3 bg-gradient-to-r from-[#39FF14] to-[#00E676] text-black font-semibold rounded-xl hover:shadow-lg transition-all">
                Continue to Contact Info
              </button>
            </div>
          )}

          {/* Step 2: Contact Info */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-white mb-2">Full Name</label>
                <input type="text" value={formData.name} onChange={(e) => updateField("name", e.target.value)} required placeholder="Your full name"
                  className="w-full px-4 py-3 bg-[#2a2a2a] border border-[#333] rounded-xl text-white text-sm placeholder-[#666] focus:outline-none focus:border-[#39FF14]" />
              </div>
              <div>
                <label className="block text-sm text-white mb-2"><Mail className="w-3.5 h-3.5 inline mr-1" /> Email</label>
                <input type="email" value={formData.email} onChange={(e) => updateField("email", e.target.value)} required placeholder="your@email.com"
                  className="w-full px-4 py-3 bg-[#2a2a2a] border border-[#333] rounded-xl text-white text-sm placeholder-[#666] focus:outline-none focus:border-[#39FF14]" />
              </div>
              <div>
                <label className="block text-sm text-white mb-2"><Phone className="w-3.5 h-3.5 inline mr-1" /> WhatsApp / Phone</label>
                <input type="tel" value={formData.phone} onChange={(e) => updateField("phone", e.target.value)} required placeholder="+20 1xx xxx xxxx"
                  className="w-full px-4 py-3 bg-[#2a2a2a] border border-[#333] rounded-xl text-white text-sm placeholder-[#666] focus:outline-none focus:border-[#39FF14]" />
              </div>
              <div className="flex gap-3">
                <button type="button" onClick={() => setStep(1)}
                  className="flex-1 py-3 border border-[#333] text-[#B0B0B0] font-semibold rounded-xl hover:text-white transition-all">
                  Back
                </button>
                <button type="button" onClick={() => setStep(3)}
                  className="flex-1 py-3 bg-gradient-to-r from-[#39FF14] to-[#00E676] text-black font-semibold rounded-xl hover:shadow-lg transition-all">
                  Continue to Payment
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Payment */}
          {step === 3 && (
            <div className="space-y-4">
              {/* Price Summary */}
              {hotel && (
                <div className="bg-[#1a1a1a] rounded-2xl border border-[#333]/50 p-5">
                  <h3 className="font-semibold text-white mb-3">Price Summary</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between text-[#B0B0B0]">
                      <span>{hotel.name}</span>
                      <span>${hotel.price_per_night_usd}/night</span>
                    </div>
                    <div className="flex justify-between text-[#B0B0B0]">
                      <span>{nights} night{nights>1?"s":""} x {formData.rooms} room{Number(formData.rooms)>1?"s":""}</span>
                      <span>${totalUSD}</span>
                    </div>
                    <div className="border-t border-[#333] pt-2 flex justify-between text-white font-bold text-lg">
                      <span>Total</span>
                      <span className="text-[#39FF14]">{totalEGP.toLocaleString()} EGP</span>
                    </div>
                    <p className="text-[#666] text-xs">Approximately ${totalUSD} USD</p>
                  </div>
                </div>
              )}

              {/* Payment Method */}
              <div>
                <label className="block text-sm text-white mb-3"><CreditCard className="w-3.5 h-3.5 inline mr-1" /> Payment Method</label>
                <div className="space-y-2">
                  {[
                    { value: "instapay", label: "InstaPay", desc: "Pay via InstaPay - details sent after confirmation" },
                    { value: "cash", label: "Cash on Arrival", desc: "Pay in EGP at the hotel front desk" },
                    { value: "card", label: "Credit/Debit Card", desc: "Pay with Visa/Mastercard at check-in" },
                  ].map((method) => (
                    <label key={method.value}
                      className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                        formData.paymentMethod === method.value
                          ? "border-[#39FF14] bg-[#39FF14]/5"
                          : "border-[#333] bg-[#1a1a1a] hover:border-[#39FF14]/30"
                      }`}>
                      <input type="radio" name="payment" value={method.value} checked={formData.paymentMethod === method.value}
                        onChange={(e) => updateField("paymentMethod", e.target.value)} className="accent-[#39FF14]" />
                      <div>
                        <p className="text-white text-sm font-medium">{method.label}</p>
                        <p className="text-[#666] text-xs">{method.desc}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <button type="button" onClick={() => setStep(2)}
                  className="flex-1 py-3 border border-[#333] text-[#B0B0B0] font-semibold rounded-xl hover:text-white transition-all">
                  Back
                </button>
                <button type="submit"
                  className="flex-1 py-3 bg-gradient-to-r from-[#39FF14] to-[#00E676] text-black font-semibold rounded-xl hover:shadow-lg hover:shadow-[#39FF14]/25 transition-all">
                  Submit Booking Request
                </button>
              </div>
            </div>
          )}
        </form>
      </motion.div>
    </div>
  );
}

export default function BookingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen pt-24 flex items-center justify-center text-[#666]">Loading...</div>}>
      <BookingContent />
    </Suspense>
  );
}
