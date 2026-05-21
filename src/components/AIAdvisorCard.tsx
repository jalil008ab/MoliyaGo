"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useMemo } from "react";
import { Sparkles, HelpCircle, ArrowRight, Lightbulb, AlertTriangle, Activity } from "lucide-react";
import { useUser } from "@/context/UserContext";

function formatNumber(n: number): string {
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export default function AIAdvisorCard() {
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [advice, setAdvice] = useState<string>("");
  const [adviceType, setAdviceType] = useState<"info" | "warning" | "success">("info");

  // Local rules-based advisor engine
  const generateAdvice = () => {
    setLoading(true);
    setTimeout(() => {
      // Analyze transactions
      const expenses = user.transactions.filter(t => t.type === "expense");
      const totalExpense = expenses.reduce((sum, t) => sum + t.amount, 0);
      const foodExpense = expenses.filter(t => t.category === "Oziq-ovqat").reduce((sum, t) => sum + t.amount, 0);
      const gameExpense = expenses.filter(t => t.category === "Kino/O'yinlar").reduce((sum, t) => sum + t.amount, 0);

      // Low balance check
      if (user.balance < 150000) {
        setAdvice(`⚠️ Diqqat! Hamyoningizda bor-yo'g'i ${formatNumber(user.balance)} so'm qoldi. Kutilmagan qiyinchiliklarga tushib qolmaslik uchun mayda xarajatlarni zudlik bilan qisqartiring!`);
        setAdviceType("warning");
      } 
      // Goal completed check
      else if (user.savedAmount >= user.targetAmount && user.targetAmount > 0) {
        setAdvice(`🎉 Urra! "${user.goalName}" maqsadingiz uchun barcha mablag' yig'ildi! Siz juda intizomli tejovchisiz. Profil panelidan yangi maqsad qo'yib, o'rganishda davom eting!`);
        setAdviceType("success");
      }
      // Zero savings check
      else if (user.savedAmount === 0) {
        setAdvice(`🎯 Siz hali "${user.goalName || "maqsadingiz"}" uchun pul tejashni boshlamadingiz. Hozirgi hamyon balansingizdan kamida 50,000 so'm ajrating, biz sizga +30 XP va +15 tanga beramiz!`);
        setAdviceType("info");
      }
      // Heavy food expenses
      else if (foodExpense > totalExpense * 0.4 && foodExpense > 0) {
        const potentialSavings = Math.round(foodExpense * 0.2);
        setAdvice(`🍔 Analiz natijasi: Xarajatlaringizning ${Math.round((foodExpense/totalExpense)*100)}% qismi oziq-ovqat va shirinliklarga sarflangan. Agar fastfudni 20% ga kamaytirib, oyiga ${formatNumber(potentialSavings)} so'm tejasangiz, maqsadingizga ancha tezroq erishasiz!`);
        setAdviceType("warning");
      }
      // Heavy gaming / entertainment
      else if (gameExpense > totalExpense * 0.3 && gameExpense > 0) {
        setAdvice(`🎮 Tahlil: O'yinlar va kinolarga ko'p xarajat qilmoqdasiz. Haqiqiy moliyaviy chempionlar ko'ngilochar xarajatlarni daromadning 10-15% idan oshirmaydilar!`);
        setAdviceType("warning");
      }
      // General good advice
      else {
        const months = user.savingsCapacity > 0 ? Math.ceil((user.targetAmount - user.savedAmount) / user.savingsCapacity) : 0;
        const generalTips = [
          `💡 "10% Oltin Qoida": Har safar daromad olganingizda (cho'ntak puli, sovg'a va b.q.), birinchi bo'lib 10% qismini jamg'armangizga o'tkazib qo'ying. Keyin qolganini sarflang!`,
          `💡 Maqsadingiz bo'lgan "${user.goalName || "Noutbuk"}" uchun oyiga ${formatNumber(user.savingsCapacity)} so'mdan tejab borsangiz, yana ${months || 5} oyda rejangizga to'liq erishasiz. MoliyaGo bilan intizomni saqlang!`,
          `💡 Bilasizmi? Inflyatsiya — pullarning qadrsizlanishidir. Pulni shunchaki saqlash emas, unumli tejash va bilimga investitsiya qilish eng to'g'ri yo'ldir!`,
          `💡 "Kutilmagan vaziyatlar" simulyatorida tejash yo'lini tanlash sizga qo'shimcha bilim ballari (XP) olib keladi va maqsadga yaqinlashtiradi!`
        ];
        const randomTip = generalTips[Math.floor(Math.random() * generalTips.length)];
        setAdvice(randomTip);
        setAdviceType("info");
      }
      setLoading(false);
    }, 1200);
  };

  useEffect(() => {
    generateAdvice();
  }, [user.balance, user.savedAmount]);

  // Calculate financial health score dynamically (max 100)
  const scoreInfo = useMemo(() => {
    // 1. Savings Progress Score (max 40 pts)
    const savingsRatio = user.targetAmount > 0 ? Math.min(1.0, user.savedAmount / user.targetAmount) : 0.5;
    const savingsScore = Math.round(savingsRatio * 40);

    // 2. Wallet Cushion Score (max 30 pts)
    // 200,000 UZS as safe cushion baseline
    const walletRatio = Math.min(1.0, user.balance / 200000);
    const walletScore = Math.round(walletRatio * 30);

    // 3. Habit/Streak Score (max 30 pts)
    // Streak * 6, max 30
    const streakScore = Math.min(30, user.streak * 6);

    const totalScore = Math.min(100, savingsScore + walletScore + streakScore);

    let status = "Past ⚠️";
    let color = "text-rose-500";
    let strokeColor = "#ef4444"; // red-500
    let bgGlow = "from-rose-500/5 to-transparent border-rose-500/20";
    let desc = "Byudjetingiz xavf ostida! Hamyonni to'ldiring va tejashni boshlang.";

    if (totalScore >= 80) {
      status = "Alo 🌟";
      color = "text-emerald-500 dark:text-emerald-400";
      strokeColor = "#10b981"; // emerald-500
      bgGlow = "from-emerald-500/5 to-transparent border-emerald-500/20";
      desc = "Siz ajoyib moliyaviy intizom egasisiz! Shunday davom eting.";
    } else if (totalScore >= 50) {
      status = "Yaxshi 👍";
      color = "text-cyan-500 dark:text-cyan-400";
      strokeColor = "#06b6d4"; // cyan-500
      bgGlow = "from-cyan-500/5 to-transparent border-cyan-500/20";
      desc = "Yaxshi natija, lekin tejashni oshirish orqali kuchaytirishingiz mumkin.";
    }

    return { totalScore, status, color, strokeColor, bgGlow, desc };
  }, [user.balance, user.savedAmount, user.targetAmount, user.streak]);

  // Circular gauge layout parameters
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (scoreInfo.totalScore / 100) * circumference;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      className="glass-card p-5 sm:p-6 h-full flex flex-col justify-between"
    >
      {/* Header */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500/10 to-rose-500/10 dark:from-pink-500/20 dark:to-rose-500/20 border border-pink-500/20 dark:border-pink-500/30 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-pink-600 dark:text-pink-400" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800 dark:text-neutral-100">MoliyaGo AI Maslahatchi</h3>
              <p className="text-xs text-slate-700 dark:text-neutral-300 font-bold">Xarajatlar tahlili va tavsiyalar</p>
            </div>
          </div>
          <div className="w-6 h-6 rounded-full bg-slate-100 dark:bg-neutral-800 flex items-center justify-center text-slate-500 dark:text-neutral-300 hover:text-slate-700 dark:hover:text-neutral-100 cursor-help shadow-sm" title="AI maslahatchi sizning kunlik xarajatlaringiz va jamg'armangizni o'rganib, maslahat beradi.">
            <HelpCircle className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Advisor Dialog Box */}
        <div className="relative min-h-[110px] p-4 rounded-2xl bg-white dark:bg-neutral-950 border border-slate-150/65 dark:border-neutral-900 shadow-sm flex flex-col justify-center">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-4 gap-2">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                className="w-8 h-8 border-2 border-pink-200 dark:border-pink-900 border-t-pink-600 dark:border-t-pink-400 rounded-full"
              />
              <p className="text-[10px] font-black text-pink-600 dark:text-pink-400 uppercase tracking-widest animate-pulse">
                Xarajatlar tahlil qilinmoqda...
              </p>
            </div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={advice}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="space-y-2"
              >
                <div className="flex items-start gap-2.5">
                  <div className={`p-1.5 rounded-lg flex-shrink-0 mt-0.5 ${
                    adviceType === "warning" 
                      ? "bg-rose-500/15 text-rose-600 dark:text-rose-400" 
                      : adviceType === "success" 
                      ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400" 
                      : "bg-pink-500/15 text-pink-600 dark:text-pink-400"
                  }`}>
                    {adviceType === "warning" ? <AlertTriangle className="w-4 h-4" /> : <Lightbulb className="w-4 h-4" />}
                  </div>
                  <div>
                    <p className={`text-xs sm:text-sm font-bold leading-relaxed ${
                      adviceType === "warning" 
                        ? "text-rose-700 dark:text-rose-455" 
                        : adviceType === "success" 
                        ? "text-emerald-700 dark:text-emerald-455" 
                        : "text-slate-800 dark:text-neutral-100"
                    }`}>
                      {advice}
                    </p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          )}
        </div>

        {/* Premium Score Section (Fills empty space beautifully) */}
        <div className={`mt-5 p-4 rounded-2xl bg-gradient-to-br ${scoreInfo.bgGlow} border border-slate-100 dark:border-neutral-900 shadow-sm flex items-center justify-between gap-4 transition-all duration-300`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white dark:bg-neutral-950 border border-slate-100 dark:border-neutral-900 shadow-sm flex items-center justify-center flex-shrink-0">
              <Activity className="w-5 h-5 text-indigo-500" />
            </div>
            <div>
              <p className="text-[10px] text-slate-700 dark:text-neutral-300 font-black uppercase tracking-wider">Moliyaviy Salomatlik</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-sm font-black text-slate-800 dark:text-neutral-100">Indeks:</span>
                <span className={`text-xs font-black px-2 py-0.5 rounded-full bg-slate-100 dark:bg-neutral-900 border border-slate-200/50 dark:border-neutral-800 ${scoreInfo.color}`}>
                  {scoreInfo.status}
                </span>
              </div>
              <p className="text-[10px] text-slate-700 dark:text-neutral-250 mt-1 leading-relaxed font-extrabold">
                {scoreInfo.desc}
              </p>
            </div>
          </div>

          {/* SVG Circular Gauge */}
          <div className="relative flex-shrink-0 w-20 h-20 flex items-center justify-center">
            <svg className="w-20 h-20 -rotate-90">
              <circle
                cx="40"
                cy="40"
                r={radius}
                className="stroke-slate-100 dark:stroke-neutral-850 fill-none"
                strokeWidth="7"
              />
              <motion.circle
                cx="40"
                cy="40"
                r={radius}
                className="fill-none"
                strokeWidth="7"
                stroke={scoreInfo.strokeColor}
                strokeLinecap="round"
                strokeDasharray={circumference}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset }}
                transition={{ duration: 1.2, ease: "easeOut" }}
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
              <motion.span
                key={scoreInfo.totalScore}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-base font-black text-slate-800 dark:text-neutral-100"
              >
                {scoreInfo.totalScore}
              </motion.span>
              <span className="text-[8px] font-black text-slate-700 dark:text-neutral-300 uppercase tracking-widest -mt-1">Ball</span>
            </div>
          </div>
        </div>
      </div>

      {/* Button to request new tip */}
      <div className="mt-4 pt-3 border-t border-slate-150/65 dark:border-neutral-900 flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-[10px] text-slate-450 dark:text-neutral-500 font-extrabold">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          <span>AI ANALIZATOR FAOL</span>
        </div>

        <button
          onClick={generateAdvice}
          disabled={loading}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-pink-500/10 to-rose-500/10 dark:from-pink-500/20 dark:to-rose-500/20 border border-pink-500/20 dark:border-pink-500/30 hover:border-pink-500/30 dark:hover:border-pink-500/40 text-pink-600 dark:text-pink-400 text-xs font-black transition-all cursor-pointer shadow-sm hover:shadow-md disabled:opacity-50"
        >
          <span><span className="hidden xs:inline">Maslahatni </span>yangilash</span>
          <ArrowRight className="w-3.5 h-3.5 flex-shrink-0" />
        </button>
      </div>
    </motion.div>
  );
}
