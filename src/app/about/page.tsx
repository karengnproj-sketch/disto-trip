"use client";

import { motion } from "framer-motion";
import { MapPin, Hotel, Landmark, Map, Wallet, Shield, Globe, Heart, Users, Zap, Mail, Phone, MessageCircle } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/lib/i18n/LanguageContext";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: "easeOut" as const },
  }),
};

export default function AboutPage() {
  const { locale } = useLanguage();
  const isAr = locale === "ar";

  const features = [
    {
      icon: Hotel, color: "from-blue-500 to-blue-600",
      en: { title: "Hotel Discovery and Booking", desc: "Browse 25+ curated hotels across 8 Egyptian cities. Filter by price, stars, city, and amenities. Book directly through our 3-step booking flow with InstaPay, cash, or card payment." },
      ar: { title: "اكتشاف وحجز الفنادق", desc: "تصفح أكثر من 25 فندقاً في 8 مدن مصرية. فلتر حسب السعر والنجوم والمدينة والمرافق. احجز مباشرة عبر نظام الحجز المكون من 3 خطوات." },
    },
    {
      icon: Landmark, color: "from-orange-500 to-orange-600",
      en: { title: "Attractions with Landmark Info", desc: "28 attractions from the Pyramids to the Red Sea. Each includes Wikipedia-powered historical guides, crowd level estimates, entry fees, opening hours, and ticket links." },
      ar: { title: "المعالم مع معلومات تاريخية", desc: "28 معلماً سياحياً من الأهرامات إلى البحر الأحمر. كل معلم يتضمن دليلاً تاريخياً من ويكيبيديا ومستوى الازدحام ورسوم الدخول." },
    },
    {
      icon: Map, color: "from-green-500 to-green-600",
      en: { title: "Interactive Map with Live POIs", desc: "Explore Egypt on a dark-themed interactive map. Find nearby restaurants, pharmacies, hotels, and attractions in real-time using OpenStreetMap data. Get directions to any place." },
      ar: { title: "خريطة تفاعلية مع نقاط حية", desc: "استكشف مصر على خريطة تفاعلية. اعثر على المطاعم والصيدليات والفنادق القريبة في الوقت الفعلي باستخدام بيانات OpenStreetMap." },
    },
    {
      icon: Wallet, color: "from-purple-500 to-purple-600",
      en: { title: "Budget Planner and Currency Converter", desc: "Plan your trip budget with our expense tracker. Convert between 7 currencies and EGP instantly. See typical daily costs for budget, mid-range, and luxury travel." },
      ar: { title: "مخطط الميزانية ومحول العملات", desc: "خطط لميزانية رحلتك مع متتبع النفقات. حول بين 7 عملات والجنيه المصري فوراً. اطلع على التكاليف اليومية النموذجية." },
    },
    {
      icon: Shield, color: "from-red-500 to-red-600",
      en: { title: "Emergency SOS with One-Tap Calling", desc: "Police (122), Ambulance (123), Fire (180), Tourist Police (126) - all one tap away. Find nearest hospitals, pharmacies, and embassies. Works offline." },
      ar: { title: "طوارئ SOS بلمسة واحدة", desc: "الشرطة (122)، الإسعاف (123)، الإطفاء (180)، شرطة السياحة (126) - كلها بلمسة واحدة. اعثر على أقرب مستشفى وصيدلية وسفارة." },
    },
    {
      icon: Globe, color: "from-cyan-500 to-cyan-600",
      en: { title: "Bilingual Support (EN/AR)", desc: "Full English and Arabic interface. One-click language toggle in the navbar. Right-to-left layout support for Arabic. All content, labels, and navigation translate instantly." },
      ar: { title: "دعم ثنائي اللغة (EN/AR)", desc: "واجهة كاملة بالإنجليزية والعربية. تبديل اللغة بنقرة واحدة. دعم التخطيط من اليمين لليسار للعربية. جميع المحتوى والتسميات تترجم فوراً." },
    },
  ];

  const team = [
    { name: isAr ? "المؤسس" : "Founder", role: isAr ? "الرؤية والاستراتيجية" : "Vision and Strategy", color: "from-[#39FF14] to-[#00E676]" },
    { name: isAr ? "المطور الرئيسي" : "Lead Developer", role: isAr ? "هندسة البرمجيات" : "Software Engineering", color: "from-blue-500 to-cyan-500" },
    { name: isAr ? "مصمم UX" : "UX Designer", role: isAr ? "تجربة المستخدم والتصميم" : "User Experience and Design", color: "from-purple-500 to-pink-500" },
    { name: isAr ? "مدير المحتوى" : "Content Manager", role: isAr ? "المحتوى السياحي والترجمة" : "Tourism Content and Translation", color: "from-orange-500 to-red-500" },
  ];

  const techStack = [
    "Next.js 15", "Tailwind CSS", "Supabase", "Leaflet Maps", "Framer Motion",
    "OpenStreetMap", "Wikipedia API", "OpenWeatherMap", "TypeScript", "Vercel",
  ];

  return (
    <div className="min-h-screen pt-24 pb-16">
      {/* Hero */}
      <section className="px-4 max-w-4xl mx-auto text-center mb-20">
        <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0}>
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-[#39FF14] to-[#00E676] mb-6">
            <MapPin className="w-8 h-8 text-black" />
          </div>
          <h1 className="text-4xl md:text-6xl font-display font-bold mb-6">
            {isAr ? "عن" : "About"} <span className="text-[#39FF14]">Disto-Trip</span>
          </h1>
          <p className="text-[#B0B0B0] text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            {isAr
              ? "رفيقك المثالي للسفر في مصر. من لحظة وصولك إلى المطار حتى وقوفك أمام الأهرامات، نحن معك في كل خطوة."
              : "Your ultimate travel companion for Egypt. From the moment you land at the airport to standing in front of the Pyramids, we are with you every step of the way."}
          </p>
        </motion.div>
      </section>

      {/* Our Story */}
      <section className="px-4 max-w-4xl mx-auto mb-20">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}>
          <h2 className="text-3xl font-display font-bold text-white mb-6">
            {isAr ? "قصتنا" : "Our Story"}
          </h2>
          <div className="space-y-4 text-[#B0B0B0] leading-relaxed">
            <p>
              {isAr
                ? "مصر من أجمل الوجهات السياحية في العالم، لكن السياح الأجانب يواجهون تحديات حقيقية: الضياع في شوارع غير مألوفة، عدم معرفة الأسعار العادلة، صعوبة التنقل، وعدم معرفة أماكن الطوارئ القريبة."
                : "Egypt is one of the most beautiful tourist destinations in the world, but foreign tourists face real challenges: getting lost in unfamiliar streets, not knowing fair prices, difficulty navigating, and not knowing where nearby emergency services are."}
            </p>
            <p>
              {isAr
                ? "ديستو-تريب يحل كل هذه المشاكل في تطبيق واحد. نساعدك من لحظة هبوطك في المطار: كيف تصل لفندقك، كم ستدفع، أين تذهب، هل المكان مزدحم، وماذا تفعل في حالة الطوارئ. كل ذلك بالإنجليزية والعربية."
                : "Disto-Trip solves all these problems in one app. We help you from the moment you land at the airport: how to get to your hotel, how much you will pay, where to go, whether the place is crowded, and what to do in an emergency. All in English and Arabic."}
            </p>
          </div>
        </motion.div>
      </section>

      {/* Features */}
      <section className="px-4 max-w-6xl mx-auto mb-20">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0} className="text-center mb-12">
          <h2 className="text-3xl font-display font-bold text-white mb-4">
            {isAr ? "ماذا نقدم" : "What We Offer"}
          </h2>
          <p className="text-[#B0B0B0]">{isAr ? "كل ما يحتاجه السائح في مكان واحد" : "Everything a tourist needs in one place"}</p>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}
              className="bg-[#1a1a1a] rounded-2xl border border-[#333]/50 p-6 hover:border-[#39FF14]/30 transition-all">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${f.color} flex items-center justify-center mb-4`}>
                <f.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-white font-semibold text-lg mb-2">{isAr ? f.ar.title : f.en.title}</h3>
              <p className="text-[#888] text-sm leading-relaxed">{isAr ? f.ar.desc : f.en.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Team */}
      <section className="px-4 max-w-4xl mx-auto mb-20">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0} className="text-center mb-12">
          <h2 className="text-3xl font-display font-bold text-white mb-4">
            {isAr ? "فريقنا" : "Our Team"}
          </h2>
        </motion.div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {team.map((member, i) => (
            <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}
              className="text-center">
              <div className={`w-20 h-20 rounded-full bg-gradient-to-r ${member.color} mx-auto mb-3 flex items-center justify-center`}>
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-white font-semibold text-sm">{member.name}</h3>
              <p className="text-[#666] text-xs mt-1">{member.role}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Tech Stack */}
      <section className="px-4 max-w-4xl mx-auto mb-20">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0} className="text-center mb-8">
          <h2 className="text-3xl font-display font-bold text-white mb-4">
            {isAr ? "التقنيات المستخدمة" : "Built With"}
          </h2>
        </motion.div>
        <div className="flex flex-wrap justify-center gap-3">
          {techStack.map((tech, i) => (
            <motion.span key={tech} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}
              className="px-4 py-2 bg-[#1a1a1a] border border-[#333]/50 rounded-full text-sm text-[#B0B0B0] hover:text-[#39FF14] hover:border-[#39FF14]/30 transition-all">
              {tech}
            </motion.span>
          ))}
        </div>
      </section>

      {/* Contact */}
      <section className="px-4 max-w-4xl mx-auto">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}
          className="bg-[#1a1a1a] rounded-2xl border border-[#333]/50 p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">
            {isAr ? "تواصل معنا" : "Get in Touch"}
          </h2>
          <p className="text-[#B0B0B0] mb-6">
            {isAr ? "لديك سؤال أو اقتراح أو شكوى؟ نحن هنا للمساعدة." : "Have a question, suggestion, or complaint? We are here to help."}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="mailto:support@distotrip.com" className="flex items-center gap-2 px-5 py-3 bg-[#2a2a2a] border border-[#333] rounded-xl text-sm text-[#B0B0B0] hover:text-[#39FF14] hover:border-[#39FF14]/30 transition-all">
              <Mail className="w-4 h-4" /> support@distotrip.com
            </a>
            <a href="tel:+201234567890" className="flex items-center gap-2 px-5 py-3 bg-[#2a2a2a] border border-[#333] rounded-xl text-sm text-[#B0B0B0] hover:text-[#39FF14] hover:border-[#39FF14]/30 transition-all">
              <Phone className="w-4 h-4" /> +20 123 456 7890
            </a>
            <Link href="/emergency" className="flex items-center gap-2 px-5 py-3 bg-[#2a2a2a] border border-[#333] rounded-xl text-sm text-[#B0B0B0] hover:text-[#FF4444] hover:border-[#FF4444]/30 transition-all">
              <Shield className="w-4 h-4" /> {isAr ? "طوارئ" : "Emergency"}
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
