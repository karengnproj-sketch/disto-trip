"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, Send, CheckCircle, ArrowLeft, MapPin, Shield, Hotel, Car, Landmark, HelpCircle } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { sanitizeText, sanitizeTextarea } from "@/lib/security";

const categories = [
  { value: "safety", icon: Shield, en: "Safety Concern", ar: "مخاوف أمنية" },
  { value: "scam", icon: AlertTriangle, en: "Scam / Overcharging", ar: "احتيال / مبالغة في الأسعار" },
  { value: "transport", icon: Car, en: "Transport Issue", ar: "مشكلة في النقل" },
  { value: "hotel", icon: Hotel, en: "Hotel Complaint", ar: "شكوى فندق" },
  { value: "attraction", icon: Landmark, en: "Attraction Issue", ar: "مشكلة في معلم سياحي" },
  { value: "service", icon: HelpCircle, en: "Service Quality", ar: "جودة الخدمة" },
  { value: "other", icon: HelpCircle, en: "Other", ar: "أخرى" },
];

export default function ComplaintPage() {
  const { locale } = useLanguage();
  const isAr = locale === "ar";

  const [form, setForm] = useState({
    name: "",
    email: "",
    category: "",
    subject: "",
    description: "",
    location: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Sanitize inputs
    const sanitized = {
      user_name: sanitizeText(form.name, 100),
      user_email: sanitizeText(form.email, 200),
      category: form.category,
      subject: sanitizeText(form.subject, 200),
      description: sanitizeTextarea(form.description, 2000),
      location: sanitizeText(form.location, 200),
    };

    // For now, store locally and show success
    // In production this would go to Supabase complaints table
    console.log("Complaint submitted:", sanitized);

    // Simulate API call
    await new Promise((r) => setTimeout(r, 1000));
    setSubmitted(true);
    setLoading(false);
  };

  if (submitted) {
    return (
      <div className="min-h-screen pt-24 pb-16 px-4 flex items-center justify-center">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center max-w-md">
          <div className="w-20 h-20 rounded-full bg-[#39FF14]/20 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-[#39FF14]" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-4">
            {isAr ? "تم إرسال شكواك" : "Complaint Submitted"}
          </h1>
          <p className="text-[#B0B0B0] mb-2">
            {isAr
              ? "شكرا لك. سيتم مراجعة شكواك خلال 24-48 ساعة وسيتم إبلاغ الجهات المعنية."
              : "Thank you. Your complaint will be reviewed within 24-48 hours and forwarded to the relevant authorities."}
          </p>
          <p className="text-[#666] text-sm mb-6">
            {isAr ? "رقم المرجع:" : "Reference:"} CMP-{Date.now().toString(36).toUpperCase()}
          </p>
          <div className="flex gap-3 justify-center">
            <Link href="/" className="px-6 py-3 bg-gradient-to-r from-[#39FF14] to-[#00E676] text-black font-semibold rounded-xl">
              {isAr ? "العودة للرئيسية" : "Back to Home"}
            </Link>
            <Link href="/emergency" className="px-6 py-3 border border-[#FF4444]/30 text-[#FF4444] font-semibold rounded-xl hover:bg-[#FF4444]/10 transition-all">
              {isAr ? "طوارئ" : "Emergency"}
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 max-w-2xl mx-auto">
      <Link href="/" className="inline-flex items-center gap-2 text-[#B0B0B0] hover:text-white text-sm mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> {isAr ? "رجوع" : "Back"}
      </Link>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-full bg-[#FF4444]/20 flex items-center justify-center">
            <AlertTriangle className="w-6 h-6 text-[#FF4444]" />
          </div>
          <div>
            <h1 className="text-3xl font-display font-bold text-white">
              {isAr ? "تقديم شكوى" : "File a Complaint"}
            </h1>
            <p className="text-[#B0B0B0] text-sm">
              {isAr ? "سيتم إرسال شكواك للجهات الحكومية المختصة" : "Your complaint will be forwarded to the relevant Egyptian authorities"}
            </p>
          </div>
        </div>

        <div className="bg-[#1a1a1a] rounded-2xl border border-[#FFB300]/20 p-4 mb-8 mt-4">
          <p className="text-[#FFB300] text-xs font-medium flex items-center gap-2">
            <Shield className="w-3.5 h-3.5" />
            {isAr
              ? "للحالات الطارئة اتصل بشرطة السياحة: 126"
              : "For emergencies call Tourist Police: 126"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name and Email */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-white mb-2">{isAr ? "الاسم" : "Your Name"}</label>
              <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required
                placeholder={isAr ? "اسمك الكامل" : "Full name"}
                className="w-full px-4 py-3 bg-[#2a2a2a] border border-[#333] rounded-xl text-white text-sm placeholder-[#666] focus:outline-none focus:border-[#39FF14] transition-colors" />
            </div>
            <div>
              <label className="block text-sm text-white mb-2">{isAr ? "البريد الإلكتروني" : "Email"}</label>
              <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required
                placeholder={isAr ? "بريدك الإلكتروني" : "your@email.com"}
                className="w-full px-4 py-3 bg-[#2a2a2a] border border-[#333] rounded-xl text-white text-sm placeholder-[#666] focus:outline-none focus:border-[#39FF14] transition-colors" />
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm text-white mb-2">{isAr ? "نوع الشكوى" : "Category"}</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {categories.map((cat) => (
                <button key={cat.value} type="button" onClick={() => setForm({ ...form, category: cat.value })}
                  className={`flex items-center gap-2 p-3 rounded-xl text-xs font-medium transition-all ${
                    form.category === cat.value
                      ? "bg-[#FF4444]/10 border border-[#FF4444]/50 text-[#FF4444]"
                      : "bg-[#2a2a2a] border border-[#333] text-[#B0B0B0] hover:border-[#FF4444]/30"
                  }`}>
                  <cat.icon className="w-3.5 h-3.5" />
                  {isAr ? cat.ar : cat.en}
                </button>
              ))}
            </div>
          </div>

          {/* Subject */}
          <div>
            <label className="block text-sm text-white mb-2">{isAr ? "الموضوع" : "Subject"}</label>
            <input type="text" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} required
              placeholder={isAr ? "عنوان مختصر للشكوى" : "Brief summary of your complaint"}
              className="w-full px-4 py-3 bg-[#2a2a2a] border border-[#333] rounded-xl text-white text-sm placeholder-[#666] focus:outline-none focus:border-[#39FF14] transition-colors" />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm text-white mb-2">{isAr ? "التفاصيل" : "Description"}</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required
              rows={5}
              placeholder={isAr ? "اشرح ما حدث بالتفصيل..." : "Explain what happened in detail..."}
              className="w-full px-4 py-3 bg-[#2a2a2a] border border-[#333] rounded-xl text-white text-sm placeholder-[#666] focus:outline-none focus:border-[#39FF14] transition-colors resize-none" />
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm text-white mb-2">
              <MapPin className="w-3.5 h-3.5 inline mr-1" />
              {isAr ? "الموقع (اختياري)" : "Location (optional)"}
            </label>
            <input type="text" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })}
              placeholder={isAr ? "أين حدثت المشكلة؟" : "Where did this happen?"}
              className="w-full px-4 py-3 bg-[#2a2a2a] border border-[#333] rounded-xl text-white text-sm placeholder-[#666] focus:outline-none focus:border-[#39FF14] transition-colors" />
          </div>

          <button type="submit" disabled={loading || !form.category}
            className="w-full flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-[#FF4444] to-[#FF6B6B] text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-[#FF4444]/25 transition-all disabled:opacity-50 text-sm">
            <Send className="w-4 h-4" />
            {loading ? (isAr ? "جاري الإرسال..." : "Submitting...") : (isAr ? "إرسال الشكوى" : "Submit Complaint")}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
