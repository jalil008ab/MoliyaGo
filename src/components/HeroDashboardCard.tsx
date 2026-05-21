"use client";

import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect, useState } from "react";
import { Flame } from "lucide-react";
import { useUser } from "@/context/UserContext";

function AnimatedWalletIcon() {
  return (
    <motion.div
      className="relative w-6 h-6 flex items-center justify-center text-emerald-500"
      whileHover="hover"
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-5 h-5"
      >
        <path d="M19 7V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" />
        <motion.path
          d="M16 8h4a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-4V8z"
          variants={{
            hover: { rotateY: -25, originX: "100%", transition: { duration: 0.3 } }
          }}
        />
        <circle cx="18" cy="12" r="1" fill="currentColor" />
      </svg>
      <motion.span
        className="absolute text-[10px] -top-3.5 -right-2.5 pointer-events-none"
        variants={{
          hover: {
            opacity: [0, 1, 0],
            y: [-2, -10, -14],
            x: [0, 4, 6],
            scale: [0.8, 1.2, 0.8],
            transition: { duration: 0.6, repeat: Infinity, repeatDelay: 0.2 }
          }
        }}
        initial={{ opacity: 0 }}
      >
        🪙
      </motion.span>
    </motion.div>
  );
}

function AnimatedVaultIcon() {
  return (
    <motion.div
      className="relative w-6 h-6 flex items-center justify-center text-cyan-500"
      whileHover="hover"
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-5 h-5"
      >
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <circle cx="12" cy="12" r="6" strokeDasharray="3,3" />
        <motion.circle
          cx="12"
          cy="12"
          r="3"
          variants={{
            hover: { rotate: 360 }
          }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        />
        <motion.line
          x1="12"
          y1="9"
          x2="12"
          y2="6"
          variants={{
            hover: { rotate: 360 }
          }}
          style={{ originX: "12px", originY: "12px" }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        />
      </svg>
    </motion.div>
  );
}

function AnimatedStarIcon() {
  return (
    <motion.div
      className="relative w-6 h-6 flex items-center justify-center text-pink-500"
      whileHover="hover"
    >
      <motion.svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-5 h-5"
        variants={{
          hover: { rotate: 144, scale: 1.1 }
        }}
        transition={{ type: "spring", stiffness: 120, damping: 10 }}
      >
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </motion.svg>
      <motion.span
        className="absolute text-[8px] -top-2.5 -left-2.5 pointer-events-none"
        variants={{
          hover: {
            opacity: [0, 1, 0],
            scale: [0.5, 1, 0.5],
            y: [-2, -6, -8],
            transition: { duration: 0.8, repeat: Infinity }
          }
        }}
        initial={{ opacity: 0 }}
      >
        ✨
      </motion.span>
    </motion.div>
  );
}

function AnimatedTrophyIcon() {
  return (
    <motion.div
      className="relative w-6 h-6 flex items-center justify-center text-amber-500"
      whileHover="hover"
    >
      <motion.svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-5 h-5"
        variants={{
          hover: { y: -3, scale: 1.05 }
        }}
        transition={{ type: "spring", stiffness: 300, damping: 12 }}
      >
        <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
        <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
        <path d="M4 22h16" />
        <path d="M10 14.66V17c0 .55-.45 1-1 1H4v2h16v-2h-5c-.55 0-1-.45-1-1v-2.34" />
        <path d="M12 2a6 6 0 0 1 6 6v4a6 6 0 0 1-6 6 6 6 0 0 1-6-6V8a6 6 0 0 1 6-6z" />
      </motion.svg>
    </motion.div>
  );
}

function formatNumber(n: number): string {
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function calculateLevel(xp: number): number {
  return Math.floor(xp / 500) + 1;
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
                  <div className="p-1.5 rounded-xl bg-emerald-500/10 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-450 w-8 h-8 flex items-center justify-center">
                    <AnimatedWalletIcon />
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
              <div className="mt-3 pt-3 border-t border-slate-100 dark:border-neutral-800/80 flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-extrabold text-emerald-500 uppercase tracking-wider flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse inline-block shadow-sm" />
                    Erkin Pul Oqimi
                  </span>
                  <span className="text-[9px] font-bold text-slate-400 dark:text-neutral-500 uppercase tracking-wider">Mavjud</span>
                </div>
                <p className="text-[10px] leading-relaxed text-slate-500 dark:text-neutral-400 font-medium">
                  Cho'ntakdagi pulingiz — kundalik tushlik, yo'lkira yoki mayda xarajatlar uchun.
                </p>
              </div>
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
                  <div className="p-1.5 rounded-xl bg-cyan-500/10 dark:bg-cyan-950/30 text-cyan-600 dark:text-cyan-450 w-8 h-8 flex items-center justify-center">
                    <AnimatedVaultIcon />
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
              <div className="mt-3 pt-3 border-t border-slate-100 dark:border-neutral-800/80 flex flex-col gap-2">
                {user.targetAmount > 0 ? (
                  <>
                    <div className="flex items-center justify-between text-[9px] font-bold">
                      <span className="text-cyan-500 uppercase tracking-wider font-extrabold flex items-center gap-1">
                        🎯 Maqsad sari
                      </span>
                      <span className="text-cyan-600 dark:text-cyan-400 font-extrabold">
                        {Math.round(Math.min(100, (user.savedAmount / user.targetAmount) * 100))}%
                      </span>
                    </div>
                    <div className="w-full h-1 bg-slate-100 dark:bg-neutral-800/50 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(100, (user.savedAmount / user.targetAmount) * 100)}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 rounded-full"
                      />
                    </div>
                  </>
                ) : (
                  <div className="flex items-center gap-1 text-[9px] font-bold text-slate-400 dark:text-neutral-500 uppercase tracking-wider">
                    🔒 Maqsad yaratilmagan
                  </div>
                )}
                <p className="text-[10px] leading-relaxed text-slate-500 dark:text-neutral-400 font-medium">
                  Orzungizdagi maqsad ({user.goalName || "seys"}) uchun alohida chetda yig'ilayotgan pul.
                </p>
              </div>
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
                  <div className="p-1.5 rounded-xl bg-pink-500/10 dark:bg-pink-950/30 text-pink-600 dark:text-pink-450 w-8 h-8 flex items-center justify-center">
                    <AnimatedStarIcon />
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
              <div className="mt-3 pt-3 border-t border-slate-100 dark:border-neutral-800/80 flex flex-col gap-2">
                <div className="flex items-center justify-between text-[9px] font-bold">
                  <span className="text-pink-500 uppercase tracking-wider font-extrabold flex items-center gap-1">
                    🌟 Level {calculateLevel(user.xp)} progress
                  </span>
                  <span className="text-pink-600 dark:text-pink-400 font-extrabold">
                    {user.xp % 500}/500 XP
                  </span>
                </div>
                <div className="w-full h-1 bg-slate-100 dark:bg-neutral-800/50 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${((user.xp % 500) / 500) * 100}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="h-full bg-gradient-to-r from-pink-500 to-purple-500 rounded-full"
                  />
                </div>
                <p className="text-[10px] leading-relaxed text-slate-500 dark:text-neutral-400 font-medium">
                  Moliyaviy tajriba darajangiz. Tranzaksiyalar va o'yinlarda oshadi.
                </p>
              </div>
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
                  <div className="p-1.5 rounded-xl bg-amber-500/10 dark:bg-amber-950/30 text-amber-600 dark:text-amber-450 w-8 h-8 flex items-center justify-center">
                    <AnimatedTrophyIcon />
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
              <div className="mt-3 pt-3 border-t border-slate-100 dark:border-neutral-800/80 flex flex-col gap-2">
                <div className="flex items-center justify-between text-[9px] font-bold">
                  <span className="text-amber-500 uppercase tracking-wider font-extrabold flex items-center gap-1">
                    🏆 Missiyalar bajarilishi
                  </span>
                  <span className="text-amber-600 dark:text-amber-400 font-extrabold">
                    {user.questsCompleted}/{user.totalQuests}
                  </span>
                </div>
                <div className="w-full h-1 bg-slate-100 dark:bg-neutral-800/50 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(100, (user.questsCompleted / (user.totalQuests || 1)) * 100)}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="h-full bg-gradient-to-r from-amber-500 to-orange-400 rounded-full"
                  />
                </div>
                <p className="text-[10px] leading-relaxed text-slate-500 dark:text-neutral-400 font-medium">
                  Pulni tejash va bilim olish bo'yicha yakunlagan amaliy topshiriqlaringiz.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
