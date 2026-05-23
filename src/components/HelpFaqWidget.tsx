"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { HelpCircle, ChevronDown, BookOpen, Star, Sparkles, Compass } from "lucide-react";

interface FaqItem {
  id: string;
  question: string;
  answer: string;
  icon: string;
}

const FAQ_ITEMS: FaqItem[] = [
  {
    id: "what-is-moliyago",
    question: "MoliyaGo o'zi nima?",
    answer: "MoliyaGo — yoshlar uchun maxsus mo'ljallangan, o'yinlashtirilgan moliyaviy savodxonlik platformasi. Bu yerda siz shunchaki zerikarli raqamlarni ko'rib chiqmaymiz, balki real hayotda pulni qanday boshqarish, daromad va xarajatlarni rejalashtirish, xatolarni tahlil qilish va katta maqsadlarga o'yin orqali tezkor va oson erishishni o'rganasiz! 🚀",
    icon: "🧭",
  },
  {
    id: "coins-and-xp",
    question: "Tanga 🪙 va XP (Tajriba ballari) nimaga kerak?",
    answer: "🪙 Tangalar — bu sizning muvaffaqiyatli moliyaviy xatti-harakatlaringiz uchun platforma beradigan mukofot! Har safar daftarchaga xarajat yozganingizda, jamg'armaga pul o'tkazganingizda yoki AI simulyatsiyasida aqlli qarorlar chiqarganingizda tangalar yig'asiz. Ushbu tangalarga do'konimizdan (Do'kon) profilingiz uchun chiroyli oltin ramkalar 👑, afsonaviy fonlar va premium dizayn mavzulari sotib olib faollashtirishingiz mumkin!\n\n⚡ XP (Tajriba) — bu sizning darajangiz (Level) ni oshiradi. Yuqori level sizning moliyaviy savodxonlik bo'yicha haqiqiy professional darajaga ko'tarilayotganingizni anglatadi!",
    icon: "✨",
  },
  {
    id: "wallet-vs-savings",
    question: "Hamyon va Jamg'armaning farqi nimada?",
    answer: "💵 Hamyon — bu sizning ayni vaqtdagi kunlik aylanmadagi, har qanday mayda xarajatlar yoki tushliklar uchun mavjud bo'lgan pulingiz. Daromad kiritsangiz, u hamyonga qo'shiladi.\n\n🏦 Jamg'arma — bu siz orzu qilgan katta maqsadingiz (masalan: Yangi telefon, Sayohat) uchun maxsus seysga olib qo'ygan daxlsiz pulingiz. Unga pul o'tkazganingizda, ushbu summa hamyoningizdan yechilib, maqsad seysiga tushadi va maqsad progressi foizlarda oshadi!",
    icon: "💰",
  },
  {
    id: "ai-advisor",
    question: "AI Maslahatchi qanday yordam bera oladi?",
    answer: "🤖 Bizning AI Maslahatchimiz (AI Advisor) sizning qayd etgan barcha tranzaksiyalaringiz (xarajat va daromadlaringiz) ni chuqur tahlil qiladi. U sizga qaysi bo'limlarda pulni ko'p sarflayotganingizni ko'rsatib beradi, shaxsiy tejamkorlik indeksingizni hisoblaydi va har haftada pulingizni yanada foydali ko'paytirish bo'yicha aqlli va xavfsiz maslahatlarni taqdim etadi!",
    icon: "🤖",
  },
  {
    id: "scams-danger",
    question: "Telegram yoki Kriptovalyuta firibgarlaridan qanday saqlanish kerak?",
    answer: "⚠️ Hozirda internetda tez va oson boyishni, pulni bir kunda 10 barobarga ko'paytirib berishni va'da qiladigan ko'plab botlar va shubhali kripto tangalar ko'paygan. Yodda tuting: hech kim sizga havoga pul bermaydi. Shubhali reklama yoki takliflar kelsa, AI Kutilmagan Vaziyat simulyatoridagi bilimingizni ishga solib, bunday firibgarlarni rad eting. Bilimga kiritilgan investitsiya — har doim eng yaxshi va eng xavfsiz investitsiyadir!",
    icon: "🛡️",
  },
];

export default function HelpFaqWidget() {
  const [openId, setOpenId] = useState<string | null>("what-is-moliyago");

  const toggleOpen = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="max-w-3xl mx-auto w-full space-y-6"
    >
      {/* Welcome & Info Card */}
      <div className="glass-card p-6 sm:p-8">
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 flex items-center justify-center text-4xl shadow-sm flex-shrink-0">
            📖
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
              Bilimlar va Yordam Markazi
            </h3>
            <p className="text-sm text-slate-500 dark:text-neutral-400 font-semibold mt-1 leading-relaxed">
              Bu yerda siz platformadan qanday to&apos;g&apos;ri foydalanish hamda yoshlar uchun foydali bo&apos;lgan eng muhim moliyaviy savodxonlik bilimlarini, maslahatlarni o&apos;rganib chiqasiz.
            </p>
          </div>
        </div>
      </div>

      {/* Accordion container */}
      <div className="space-y-4">
        <h4 className="text-xs font-black text-slate-400 dark:text-neutral-500 uppercase tracking-widest pl-1">Tez-tez beriladigan savollar (FAQ):</h4>
        
        {FAQ_ITEMS.map((item) => {
          const isOpen = openId === item.id;
          return (
            <div
              key={item.id}
              className={`glass-card overflow-hidden transition-all duration-200 border ${
                isOpen
                  ? "border-indigo-400 dark:border-indigo-800 shadow-md shadow-indigo-500/5"
                  : "border-slate-200/60 dark:border-neutral-800 hover:border-slate-350"
              }`}
            >
              {/* Question Clickable bar */}
              <button
                onClick={() => toggleOpen(item.id)}
                className="w-full relative z-10 px-5 sm:px-6 py-4 sm:py-5 flex items-center justify-between text-left cursor-pointer transition-all hover:bg-slate-50/50 dark:hover:bg-neutral-900/30"
              >
                <div className="flex items-center gap-3.5 min-w-0 pr-4">
                  <span className="text-2xl filter drop-shadow flex-shrink-0 select-none">{item.icon}</span>
                  <span className="font-extrabold text-sm sm:text-base text-slate-850 dark:text-neutral-100 tracking-tight leading-snug">
                    {item.question}
                  </span>
                </div>
                <motion.div
                  animate={{ rotate: isOpen ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="p-1 rounded-lg bg-slate-100 dark:bg-neutral-850 border border-slate-200/50 dark:border-neutral-800 flex-shrink-0"
                >
                  <ChevronDown className="w-4 h-4 text-slate-500 dark:text-neutral-400" />
                </motion.div>
              </button>

              {/* Answer Content */}
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: "easeInOut" }}
                  >
                    <div className="px-5 sm:px-6 pb-5 sm:pb-6 pt-1 border-t border-black/5 dark:border-white/5 bg-slate-50/30 dark:bg-neutral-950/20 text-xs sm:text-sm font-semibold text-slate-650 dark:text-neutral-300 leading-relaxed whitespace-pre-line">
                      {item.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {/* Tip of the day */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-500/5 to-cyan-500/5 border border-amber-500/20 dark:border-cyan-500/20 text-center relative overflow-hidden">
        <div className="absolute -top-12 -right-12 w-28 h-28 bg-gradient-to-bl from-amber-200/20 to-transparent rounded-full blur-xl pointer-events-none" />
        <div className="relative z-10 flex flex-col items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full text-[10px] font-black text-amber-600 dark:text-amber-400 uppercase tracking-wider">
            💡 Kunlik Aqlli Odat
          </div>
          <p className="text-xs sm:text-sm text-slate-700 dark:text-neutral-100 font-extrabold max-w-lg leading-relaxed mt-1">
            &quot;Daromad olganingizda birinchi navbatda o&apos;zingizga to&apos;lang! Har safar pul kelganda, kamida 10-20% qismini darhol Jamg&apos;armaga o&apos;tkazing. Qolgan pulga esa oylik xarajatlarni rejalashtiring.&quot;
          </p>
        </div>
      </div>
    </motion.div>
  );
}
