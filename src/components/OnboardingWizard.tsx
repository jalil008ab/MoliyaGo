"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useUser } from "@/context/UserContext";
import {
  User,
  GraduationCap,
  Briefcase,
  BookOpen,
  Target,
  Wallet,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Zap,
  Rocket,
  Star,
  Trophy,
} from "lucide-react";

const GOAL_PRESETS = [
  { name: "Yangi Telefon", emoji: "📱", defaultAmount: 5000000 },
  { name: "Noutbuk", emoji: "💻", defaultAmount: 8500000 },
  { name: "Sayohat", emoji: "✈️", defaultAmount: 10000000 },
  { name: "Velosiped", emoji: "🚲", defaultAmount: 3000000 },
  { name: "O'yin Konsoli", emoji: "🎮", defaultAmount: 6000000 },
  { name: "Kitoblar", emoji: "📚", defaultAmount: 1500000 },
];

const OCCUPATION_OPTIONS = [
  {
    value: "student" as const,
    label: "Maktab o'quvchisi",
    icon: <BookOpen className="w-6 h-6" />,
    color: "neon-cyan",
    description: "1-11 sinf o'quvchisi",
  },
  {
    value: "university" as const,
    label: "Universitet talabasi",
    icon: <GraduationCap className="w-6 h-6" />,
    color: "neon-pink",
    description: "Bakalavr yoki magistr",
  },
  {
    value: "worker" as const,
    label: "Ishchi / Frilanser",
    icon: <Briefcase className="w-6 h-6" />,
    color: "neon-green",
    description: "Ishlayman yoki freelance",
  },
];

function formatNumber(n: number): string {
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export default function OnboardingWizard() {
  const { onboardUser } = useUser();
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);

  // Form state
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [occupation, setOccupation] = useState<"student" | "university" | "worker" | "">("");
  const [goalName, setGoalName] = useState("");
  const [goalEmoji, setGoalEmoji] = useState("🎯");
  const [targetAmount, setTargetAmount] = useState("");
  const [savingsCapacity, setSavingsCapacity] = useState("");
  const [customGoal, setCustomGoal] = useState(false);

  const totalSteps = 4;

  const canProceed = () => {
    switch (step) {
      case 0:
        return name.trim().length >= 2 && age !== "" && parseInt(age) >= 6 && parseInt(age) <= 99;
      case 1:
        return occupation !== "";
      case 2:
        return goalName.trim().length >= 2 && targetAmount !== "" && parseInt(targetAmount) > 0;
      case 3:
        return savingsCapacity !== "" && parseInt(savingsCapacity) > 0;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (step < totalSteps - 1) {
      setDirection(1);
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setDirection(-1);
      setStep(step - 1);
    }
  };

  const handleFinish = () => {
    onboardUser({
      name: name.trim(),
      age: parseInt(age),
      occupation: occupation as "student" | "university" | "worker",
      goalName: goalName.trim(),
      goalEmoji,
      targetAmount: parseInt(targetAmount),
      savingsCapacity: parseInt(savingsCapacity),
    });
  };

  const selectGoalPreset = (preset: (typeof GOAL_PRESETS)[0]) => {
    setGoalName(preset.name);
    setGoalEmoji(preset.emoji);
    setTargetAmount(preset.defaultAmount.toString());
    setCustomGoal(false);
  };

  const monthsToGoal = () => {
    const cap = parseInt(savingsCapacity);
    const target = parseInt(targetAmount);
    if (!cap || !target || cap <= 0) return 0;
    return Math.ceil(target / cap);
  };

  const slideVariants = {
    enter: (d: number) => ({ x: d > 0 ? 250 : -250, opacity: 0, scale: 0.96 }),
    center: { x: 0, opacity: 1, scale: 1 },
    exit: (d: number) => ({ x: d > 0 ? -250 : 250, opacity: 0, scale: 0.96 }),
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Animated background */}
      <div className="absolute inset-0 bg-slate-100 dark:bg-[#09090b]">
        {/* Soft positive gradient blobs */}
        <motion.div
          animate={{
            x: [0, 80, -40, 0],
            y: [0, -60, 40, 0],
            scale: [1, 1.2, 0.9, 1],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-emerald-100 dark:from-emerald-950/20 to-transparent blur-[100px]"
        />
        <motion.div
          animate={{
            x: [0, -60, 40, 0],
            y: [0, 80, -40, 0],
            scale: [1, 0.9, 1.1, 1],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-pink-100 dark:from-pink-950/20 to-transparent blur-[100px]"
        />
        <motion.div
          animate={{
            x: [0, 40, -60, 0],
            y: [0, -50, 30, 0],
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/2 left-1/2 w-[400px] h-[400px] rounded-full bg-gradient-to-br from-cyan-100 dark:from-cyan-950/20 to-transparent blur-[90px]"
        />
        {/* Grid pattern */}
        <div className="absolute inset-0 cyber-bg opacity-40" />
      </div>

      {/* Main card */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative w-full max-w-xl shadow-2xl rounded-3xl"
      >
        {/* Outer glowing border ring */}
        <div className="absolute -inset-[2px] rounded-3xl bg-gradient-to-r from-emerald-300 via-cyan-300 to-pink-300 opacity-30 dark:opacity-20 blur-[2px]" />

        <div className="relative glass-card p-6 sm:p-8 rounded-3xl overflow-hidden bg-white/80 dark:bg-neutral-900/90 border border-white dark:border-neutral-800">
          {/* Inner decorative glows */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-pink-100/30 dark:from-pink-950/10 to-transparent rounded-full blur-2xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-emerald-100/30 dark:from-emerald-950/10 to-transparent rounded-full blur-2xl pointer-events-none" />

          {/* Header with logo */}
          <div className="relative z-10 text-center mb-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
              className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-gradient-to-br from-emerald-100 to-cyan-100 dark:from-emerald-950 dark:to-cyan-950 border border-emerald-200 dark:border-emerald-900 flex items-center justify-center shadow-sm"
            >
              <Zap className="w-7 h-7 text-emerald-600 dark:text-emerald-400 animate-pulse" />
            </motion.div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight gradient-text mb-1 pb-0.5">
              MoliyaGo
            </h1>
            <p className="text-slate-500 dark:text-neutral-400 text-sm font-medium">
              Moliyaviy sayohatingizni boshlaymiz! 🚀
            </p>
          </div>

          {/* Progress bar */}
          <div className="relative z-10 mb-6">
            <div className="flex items-center justify-between mb-2">
              {[0, 1, 2, 3].map((s) => (
                <motion.div
                  key={s}
                  animate={{
                    scale: step === s ? 1.15 : 1,
                    backgroundColor:
                      s <= step ? "rgba(16, 185, 129, 0.1)" : "rgba(241, 245, 249, 0.8)",
                  }}
                  className={`w-10 h-10 rounded-full flex items-center justify-center border transition-all duration-300 shadow-sm ${
                    s <= step
                      ? "border-emerald-300 dark:border-emerald-700 text-emerald-600 dark:text-emerald-400 font-bold"
                      : "border-slate-200 dark:border-neutral-800 text-slate-400 dark:text-neutral-500 font-semibold"
                  }`}
                >
                  {s < step ? (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 400 }}
                    >
                      <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-450" />
                    </motion.div>
                  ) : (
                    <span className="text-sm font-bold">{s + 1}</span>
                  )}
                </motion.div>
              ))}
            </div>
            <div className="h-1.5 bg-slate-100 dark:bg-neutral-800 rounded-full overflow-hidden">
              <motion.div
                animate={{ width: `${((step + 1) / totalSteps) * 100}%` }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-emerald-500 via-cyan-500 to-pink-500 rounded-full"
              />
            </div>
          </div>

          {/* Step content */}
          <div className="relative z-10 min-h-[300px] flex flex-col justify-between">
            <AnimatePresence mode="wait" custom={direction}>
              {/* Step 0: Name & Age */}
              {step === 0 && (
                <motion.div
                  key="step0"
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="flex-1"
                >
                  <div className="flex items-center gap-2 mb-4 border-b border-slate-100 dark:border-neutral-800 pb-3">
                    <User className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
                    <h2 className="text-lg font-bold text-slate-800 dark:text-neutral-100">
                      O&apos;zingiz haqingizda
                    </h2>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm text-slate-600 dark:text-neutral-300 mb-2 font-bold">
                        Ismingiz
                      </label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Ismingizni kiriting..."
                        className="w-full px-4 py-3.5 rounded-2xl bg-slate-50 dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 text-slate-800 dark:text-neutral-100 placeholder-slate-400 dark:placeholder-neutral-500 focus:outline-none focus:border-cyan-500/50 dark:focus:border-cyan-800 focus:bg-white dark:focus:bg-neutral-900 focus:ring-2 focus:ring-cyan-500/10 transition-all text-sm font-semibold shadow-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-slate-600 dark:text-neutral-300 mb-2 font-bold">
                        Yoshingiz
                      </label>
                      <input
                        type="number"
                        value={age}
                        onChange={(e) => setAge(e.target.value)}
                        placeholder="Yoshingizni kiriting..."
                        min={6}
                        max={99}
                        className="w-full px-4 py-3.5 rounded-2xl bg-slate-50 dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 text-slate-800 dark:text-neutral-100 placeholder-slate-400 dark:placeholder-neutral-500 focus:outline-none focus:border-cyan-500/50 dark:focus:border-cyan-800 focus:bg-white dark:focus:bg-neutral-900 focus:ring-2 focus:ring-cyan-500/10 transition-all text-sm font-semibold shadow-sm"
                      />
                    </div>
                  </div>

                  {name.trim().length >= 2 && (
                    <motion.p
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-4 text-sm text-center"
                    >
                      <span className="text-slate-500 dark:text-neutral-400 font-medium">Salom, </span>
                      <span className="gradient-text font-black">{name.trim()}</span>
                      <span className="text-slate-500 dark:text-neutral-400 font-medium">! 👋</span>
                    </motion.p>
                  )}
                </motion.div>
              )}

              {/* Step 1: Occupation */}
              {step === 1 && (
                <motion.div
                  key="step1"
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="flex-1"
                >
                  <div className="flex items-center gap-2 mb-4 border-b border-slate-100 dark:border-neutral-800 pb-3">
                    <GraduationCap className="w-5 h-5 text-pink-600 dark:text-pink-400" />
                    <h2 className="text-lg font-bold text-slate-800 dark:text-neutral-100">
                      Mashg&apos;ulotingiz
                    </h2>
                  </div>

                  <div className="space-y-3">
                    {OCCUPATION_OPTIONS.map((opt) => (
                      <motion.button
                        key={opt.value}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        onClick={() => setOccupation(opt.value)}
                        className={`w-full p-4 rounded-2xl border text-left flex items-center gap-4 transition-all cursor-pointer shadow-sm ${
                          occupation === opt.value
                            ? opt.color === "neon-cyan"
                              ? "bg-cyan-50 dark:bg-cyan-950/30 border-cyan-300 dark:border-cyan-800 text-cyan-800 dark:text-cyan-200 ring-2 ring-cyan-500/10"
                              : opt.color === "neon-pink"
                              ? "bg-pink-50 dark:bg-pink-950/30 border-pink-300 dark:border-pink-800 text-pink-800 dark:text-pink-200 ring-2 ring-pink-500/10"
                              : "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 ring-2 ring-emerald-500/10"
                            : "bg-white dark:bg-neutral-900 border-slate-100 dark:border-neutral-800 hover:border-slate-200 dark:hover:border-neutral-700"
                        }`}
                      >
                        <div
                          className={`w-12 h-12 rounded-xl flex items-center justify-center border shadow-inner ${
                            occupation === opt.value
                              ? opt.color === "neon-cyan"
                                ? "bg-cyan-100 dark:bg-cyan-900/50 border-cyan-200 dark:border-cyan-850 text-cyan-600 dark:text-cyan-400"
                                : opt.color === "neon-pink"
                                ? "bg-pink-100 dark:bg-pink-900/50 border-pink-200 dark:border-pink-850 text-pink-600 dark:text-pink-400"
                                : "bg-emerald-100 dark:bg-emerald-900/50 border-emerald-200 dark:border-emerald-850 text-emerald-600 dark:text-emerald-400"
                              : "bg-slate-50 dark:bg-neutral-950 border-slate-100 dark:border-neutral-850 text-slate-400 dark:text-neutral-500"
                          }`}
                        >
                          {opt.icon}
                        </div>
                        <div>
                          <p className="font-bold text-slate-800 dark:text-neutral-100 text-sm">
                            {opt.label}
                          </p>
                          <p className="text-xs text-slate-500 dark:text-neutral-400 font-semibold mt-0.5">{opt.description}</p>
                        </div>
                        {occupation === opt.value && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="ml-auto"
                          >
                            <Sparkles className={`w-5 h-5 ${
                              opt.color === "neon-cyan" ? "text-cyan-600" : opt.color === "neon-pink" ? "text-pink-600" : "text-emerald-600"
                            }`} />
                          </motion.div>
                        )}
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Step 2: Goal */}
              {step === 2 && (
                <motion.div
                  key="step2"
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="flex-1"
                >
                  <div className="flex items-center gap-2 mb-4 border-b border-slate-100 dark:border-neutral-800 pb-3">
                    <Target className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                    <h2 className="text-lg font-bold text-slate-800 dark:text-neutral-100">
                      Jamg&apos;arish maqsadingiz
                    </h2>
                  </div>

                  {/* Goal presets */}
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    {GOAL_PRESETS.map((preset) => (
                      <motion.button
                        key={preset.name}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => selectGoalPreset(preset)}
                        className={`p-3 rounded-2xl border text-center transition-all cursor-pointer shadow-sm ${
                          goalName === preset.name && !customGoal
                            ? "bg-amber-50 dark:bg-amber-950/30 border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-250 ring-2 ring-amber-500/10"
                            : "bg-white dark:bg-neutral-900 border-slate-100 dark:border-neutral-800 hover:border-slate-200 dark:hover:border-neutral-700"
                        }`}
                      >
                        <span className="text-2xl block mb-1">{preset.emoji}</span>
                        <span className="text-[11px] text-slate-700 dark:text-neutral-300 font-bold block leading-tight">
                          {preset.name}
                        </span>
                      </motion.button>
                    ))}
                  </div>

                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setCustomGoal(true);
                      setGoalName("");
                      setGoalEmoji("🎯");
                      setTargetAmount("");
                    }}
                    className={`w-full p-2.5 rounded-2xl border text-sm font-bold mb-4 cursor-pointer transition-all ${
                      customGoal
                        ? "bg-cyan-50 dark:bg-cyan-950/30 border-cyan-300 dark:border-cyan-800 text-cyan-700 dark:text-cyan-300 shadow-inner"
                        : "bg-slate-50 dark:bg-neutral-950 border-slate-200 dark:border-neutral-850 text-slate-500 dark:text-neutral-400 hover:bg-slate-100 dark:hover:bg-neutral-800"
                    }`}
                  >
                    ✏️ O&apos;zim yozaman
                  </motion.button>

                  {customGoal && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="space-y-3 mb-4"
                    >
                      <input
                        type="text"
                        value={goalName}
                        onChange={(e) => setGoalName(e.target.value)}
                        placeholder="Maqsad nomi..."
                        className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 text-slate-800 dark:text-neutral-100 placeholder-slate-400 dark:placeholder-neutral-500 focus:outline-none focus:border-amber-500/50 dark:focus:border-amber-800 focus:bg-white dark:focus:bg-neutral-900 focus:ring-2 focus:ring-amber-500/10 transition-all text-sm font-semibold shadow-sm"
                      />
                    </motion.div>
                  )}

                  <div>
                    <label className="block text-sm text-slate-600 dark:text-neutral-300 mb-2 font-bold">
                      Maqsad narxi (so&apos;m)
                    </label>
                    <input
                      type="number"
                      value={targetAmount}
                      onChange={(e) => setTargetAmount(e.target.value)}
                      placeholder="Masalan: 5000000"
                      className="w-full px-4 py-3.5 rounded-2xl bg-slate-50 dark:bg-neutral-950 border border-slate-200 dark:border-neutral-850 text-slate-800 dark:text-neutral-100 placeholder-slate-400 dark:placeholder-neutral-500 focus:outline-none focus:border-amber-500/50 dark:focus:border-amber-800 focus:bg-white dark:focus:bg-neutral-900 focus:ring-2 focus:ring-amber-500/10 transition-all text-sm font-semibold shadow-sm"
                    />
                    {targetAmount && parseInt(targetAmount) > 0 && (
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="mt-2 text-xs text-slate-500 dark:text-neutral-400 font-bold"
                      >
                        🎯 Maqsad summasi:{" "}
                        <span className="text-amber-600 dark:text-amber-400 font-extrabold text-sm">
                          {formatNumber(parseInt(targetAmount))} so&apos;m
                        </span>
                      </motion.p>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Step 3: Savings Capacity */}
              {step === 3 && (
                <motion.div
                  key="step3"
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="flex-1"
                >
                  <div className="flex items-center gap-2 mb-4 border-b border-slate-100 dark:border-neutral-800 pb-3">
                    <Wallet className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    <h2 className="text-lg font-bold text-slate-800 dark:text-neutral-100">
                      Tejash imkoniyatingiz
                    </h2>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm text-slate-600 dark:text-neutral-300 mb-2 font-bold">
                      Oyiga qancha pul ajrata olasiz? (so&apos;m)
                    </label>
                    <input
                      type="number"
                      value={savingsCapacity}
                      onChange={(e) => setSavingsCapacity(e.target.value)}
                      placeholder="Masalan: 200000"
                      className="w-full px-4 py-3.5 rounded-2xl bg-slate-50 dark:bg-neutral-950 border border-slate-200 dark:border-neutral-850 text-slate-800 dark:text-neutral-100 placeholder-slate-400 dark:placeholder-neutral-500 focus:outline-none focus:border-emerald-500/50 dark:focus:border-emerald-850 focus:bg-white dark:focus:bg-neutral-900 focus:ring-2 focus:ring-emerald-500/10 transition-all text-sm font-semibold shadow-sm"
                    />
                  </div>

                  {/* Quick presets */}
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    {[100000, 200000, 500000].map((amount) => (
                      <motion.button
                        key={amount}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => setSavingsCapacity(amount.toString())}
                        className={`py-2.5 rounded-2xl border text-center text-xs font-bold transition-all cursor-pointer shadow-sm ${
                          savingsCapacity === amount.toString()
                            ? "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-350 ring-2 ring-emerald-500/10"
                            : "bg-white dark:bg-neutral-900 border-slate-100 dark:border-neutral-800 hover:border-slate-200 dark:hover:border-neutral-700 text-slate-500 dark:text-neutral-450 hover:text-slate-800 dark:hover:text-neutral-200"
                        }`}
                      >
                        {formatNumber(amount)}
                      </motion.button>
                    ))}
                  </div>

                  {/* Calculation result */}
                  {savingsCapacity && parseInt(savingsCapacity) > 0 && targetAmount && parseInt(targetAmount) > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 rounded-2xl bg-gradient-to-br from-emerald-50 via-cyan-50 to-pink-50 dark:from-emerald-950/20 dark:via-cyan-950/20 dark:to-pink-950/20 border border-emerald-100/70 dark:border-emerald-900/30 shadow-sm"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <motion.div
                          animate={{ rotate: [0, 360] }}
                          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                        >
                          <Star className="w-5 h-5 text-amber-500" />
                        </motion.div>
                        <p className="text-sm font-bold text-slate-800 dark:text-neutral-100">
                          Tahlil natijasi
                        </p>
                      </div>
                      <p className="text-slate-600 dark:text-neutral-355 text-xs sm:text-sm font-medium leading-relaxed">
                        <span className="text-emerald-600 dark:text-emerald-400 font-bold">{goalEmoji} {goalName}</span>
                        {" "}maqsadingiz uchun taxminan{" "}
                        <span className="text-cyan-600 dark:text-cyan-405 font-black text-base sm:text-lg">
                          {monthsToGoal()} oy
                        </span>{" "}
                        vaqt kerak bo&apos;ladi!
                      </p>
                      <div className="mt-2.5 flex items-center gap-2 border-t border-slate-100 dark:border-neutral-800 pt-2">
                        <Rocket className="w-4 h-4 text-pink-500 dark:text-pink-400" />
                        <p className="text-[11px] text-slate-500 dark:text-neutral-400 font-bold leading-none">
                          MoliyaGo bilan bu jarayon juda qiziqarli o&apos;tadi! 🎮
                        </p>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation buttons */}
            <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-100 dark:border-neutral-800">
              {step > 0 ? (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleBack}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-neutral-800 border border-slate-200 dark:border-neutral-700 text-slate-600 dark:text-neutral-300 text-xs sm:text-sm font-bold hover:bg-slate-100 dark:hover:bg-neutral-750 transition-all cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Orqaga
                </motion.button>
              ) : (
                <div />
              )}

              {step < totalSteps - 1 ? (
                <motion.button
                  whileHover={{ scale: canProceed() ? 1.04 : 1 }}
                  whileTap={{ scale: canProceed() ? 0.96 : 1 }}
                  onClick={handleNext}
                  disabled={!canProceed()}
                  className={`flex items-center gap-1.5 px-6 py-2.5 rounded-2xl font-bold text-xs sm:text-sm transition-all shadow-sm ${
                    canProceed()
                      ? "bg-gradient-to-r from-emerald-500 to-cyan-500 hover:opacity-90 text-white cursor-pointer shadow-md"
                      : "bg-slate-100 dark:bg-neutral-800 border border-slate-200 dark:border-neutral-700 text-slate-400 dark:text-neutral-500 cursor-not-allowed"
                  }`}
                >
                  Keyingi
                  <ChevronRight className="w-4 h-4" />
                </motion.button>
              ) : (
                <motion.button
                  whileHover={{ scale: canProceed() ? 1.04 : 1 }}
                  whileTap={{ scale: canProceed() ? 0.96 : 1 }}
                  onClick={handleFinish}
                  disabled={!canProceed()}
                  className={`flex items-center gap-2 px-6 py-2.5 rounded-2xl font-black text-xs sm:text-sm transition-all shadow-md ${
                    canProceed()
                      ? "bg-gradient-to-r from-emerald-500 via-cyan-500 to-pink-500 hover:opacity-90 text-white cursor-pointer"
                      : "bg-slate-100 dark:bg-neutral-800 border border-slate-200 dark:border-neutral-700 text-slate-400 dark:text-neutral-500 cursor-not-allowed"
                  }`}
                >
                  <Trophy className="w-4 h-4 animate-bounce" />
                  Boshlash!
                </motion.button>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
