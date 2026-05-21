"use client";

import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect, useState } from "react";
import { Flame, TrendingUp, Wallet, Star, Trophy } from "lucide-react";
import { useUser } from "@/context/UserContext";

function formatNumber(n: number): string {
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function AnimatedCounter({
  target,
  duration = 1.5,
}: {
  target: number;
  duration?: number;
}) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => {
    return formatNumber(Math.round(latest));
  });
  const [displayValue, setDisplayValue] = useState("0");

  useEffect(() => {
    const controls = animate(count, target, {
      duration,
      ease: "easeOut",
    });

    const unsubscribe = rounded.on("change", (v) => setDisplayValue(v));

    return () => {
      controls.stop();
      unsubscribe();
    };
  }, [target, duration, count, rounded]);

  return <span>{displayValue}</span>;
}

export default function HeroDashboardCard() {
  const { user } = useUser();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="relative overflow-hidden"
    >
      {/* Main Hero Card */}
      <div className="glass-card p-6 sm:p-8 lg:p-10 relative overflow-hidden">
        {/* Decorative background elements (soft light pastels) */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-emerald-500/10 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-60 h-60 bg-gradient-to-tr from-pink-500/10 to-transparent rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-cyan-500/5 to-emerald-500/5 rounded-full blur-3xl" />

        <div className="relative z-10">
          {/* Top Row - Greeting & Streak */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
            {/* Greeting */}
            <div>
              <motion.p
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="text-slate-500 dark:text-neutral-400 text-sm sm:text-base mb-1 font-medium"
              >
                Xush kelibsiz! Har kungi moliyaviy sayohatingiz 🚀
              </motion.p>
              <motion.h2
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-800 dark:text-neutral-100"
              >
                Salom,{" "}
                <span className="gradient-text">{user.name || "Do'stim"}</span>! 👋
              </motion.h2>
            </div>

            {/* Streak Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
              whileHover={{ scale: 1.03 }}
              className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-gradient-to-r from-orange-500/10 to-amber-500/10 border border-orange-500/20 dark:border-orange-500/30 self-start sm:self-auto shadow-sm"
            >
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 5, -5, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="text-2xl sm:text-3xl"
              >
                🔥
              </motion.div>
              <div>
                <p className="text-xs text-slate-500 dark:text-neutral-400 font-medium">Ketma-ket faol kunlar</p>
                <p className="text-lg sm:text-xl font-bold text-orange-600 dark:text-orange-400">
                  {user.streak} kun
                </p>
              </div>
            </motion.div>
          </div>

          {/* Dashboard Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-4 sm:mt-6">
            {/* Card 1: Hamyon (Naqd Pul) */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              whileHover={{ y: -5, scale: 1.02 }}
              className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-slate-200/60 dark:border-neutral-800 shadow-sm flex flex-col justify-between transition-all"
            >
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                    <Wallet className="w-4 h-4" />
                  </div>
                  <p className="text-[10px] sm:text-[11px] text-slate-500 dark:text-neutral-400 font-extrabold uppercase tracking-wider">
                    Hamyon (Naqd pul)
                  </p>
                </div>
                <div className="flex items-baseline gap-1.5 flex-wrap">
                  <span className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400">
                    {isVisible && <AnimatedCounter target={user.balance} />}
                  </span>
                  <span className="text-xs font-bold text-emerald-600/70 dark:text-emerald-400/70">so'm</span>
                </div>
              </div>
              <p className="text-[10px] leading-relaxed text-slate-400 dark:text-neutral-500 font-semibold mt-3 pt-3 border-t border-slate-100 dark:border-neutral-800">
                ℹ️ Cho'ntakdagi pulingiz — kundalik tushlik, yo'lkira yoki mayda xarajatlar uchun.
              </p>
            </motion.div>

            {/* Card 2: Seys (Jamg'arma) */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              whileHover={{ y: -5, scale: 1.02 }}
              className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-slate-200/60 dark:border-neutral-800 shadow-sm flex flex-col justify-between transition-all"
            >
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                  <p className="text-[10px] sm:text-[11px] text-slate-500 dark:text-neutral-400 font-extrabold uppercase tracking-wider">
                    Seysdagi pul (Jamg'arma)
                  </p>
                </div>
                <div className="flex items-baseline gap-1.5 flex-wrap">
                  <span className="text-2xl sm:text-3xl font-black text-cyan-600 dark:text-cyan-400">
                    {isVisible && <AnimatedCounter target={user.savedAmount} duration={1.2} />}
                  </span>
                  <span className="text-xs font-bold text-cyan-600/70 dark:text-cyan-400/70">so'm</span>
                </div>
              </div>
              <p className="text-[10px] leading-relaxed text-slate-400 dark:text-neutral-500 font-semibold mt-3 pt-3 border-t border-slate-100 dark:border-neutral-800">
                🔒 Orzungizdagi maqsad uchun alohida chetda yig'ilayotgan pul (seys singari).
              </p>
            </motion.div>

            {/* Card 3: XP (Bilim darajasi) */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              whileHover={{ y: -5, scale: 1.02 }}
              className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-slate-200/60 dark:border-neutral-800 shadow-sm flex flex-col justify-between transition-all"
            >
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-1.5 rounded-lg bg-pink-500/10 text-pink-600 dark:text-pink-400">
                    <Star className="w-4 h-4" />
                  </div>
                  <p className="text-[10px] sm:text-[11px] text-slate-500 dark:text-neutral-400 font-extrabold uppercase tracking-wider">
                    Bilim darajasi (XP)
                  </p>
                </div>
                <div className="flex items-baseline gap-1.5 flex-wrap">
                  <span className="text-2xl sm:text-3xl font-black text-pink-600 dark:text-pink-400">
                    {isVisible && <AnimatedCounter target={user.xp} duration={1} />}
                  </span>
                  <span className="text-xs font-bold text-pink-600/70 dark:text-pink-400/70">XP</span>
                </div>
              </div>
              <p className="text-[10px] leading-relaxed text-slate-400 dark:text-neutral-500 font-semibold mt-3 pt-3 border-t border-slate-100 dark:border-neutral-800">
                🌟 Moliyaviy bilim/tajribangiz. Tranzaksiyalar yozganda va o'yinlarda oshadi.
              </p>
            </motion.div>

            {/* Card 4: Missiyalar */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              whileHover={{ y: -5, scale: 1.02 }}
              className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-slate-200/60 dark:border-neutral-800 shadow-sm flex flex-col justify-between transition-all"
            >
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
                    <Trophy className="w-4 h-4" />
                  </div>
                  <p className="text-[10px] sm:text-[11px] text-slate-500 dark:text-neutral-400 font-extrabold uppercase tracking-wider">
                    Missiyalar
                  </p>
                </div>
                <div className="flex items-baseline gap-1.5 flex-wrap">
                  <span className="text-2xl sm:text-3xl font-black text-amber-600 dark:text-amber-400">
                    {isVisible && <AnimatedCounter target={user.questsCompleted} duration={1} />}
                  </span>
                  <span className="text-xs font-bold text-amber-600/70 dark:text-amber-400/70">
                    /{user.totalQuests}
                  </span>
                </div>
              </div>
              <p className="text-[10px] leading-relaxed text-slate-400 dark:text-neutral-500 font-semibold mt-3 pt-3 border-t border-slate-100 dark:border-neutral-800">
                🏆 Pulni tejash va bilim olish bo'yicha yakunlagan amaliy topshiriqlaringiz.
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
