"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Progress } from "@nextui-org/react";
import { Target, Check, PiggyBank } from "lucide-react";
import { useUser } from "@/context/UserContext";

function formatNumber(n: number): string {
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

const presetEmojis = ["💰", "💎", "🚀"];

export default function SavingsGoalWidget() {
  const { user, addMoney } = useUser();

  // Savings Transfer State
  const [saveAmount, setSaveAmount] = useState("");
  const [saveError, setSaveError] = useState("");
  const [saveSuccess, setSaveSuccess] = useState(false);

  const progress = user.targetAmount > 0
    ? Math.min(100, Math.round((user.savedAmount / user.targetAmount) * 100))
    : 0;

  const presets = [50000, 100000, 200000];

  const handleSaveTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveError("");
    setSaveSuccess(false);

    const amount = parseInt(saveAmount);
    if (!amount || amount <= 0) {
      setSaveError("Iltimos, to'g'ri summa kiriting");
      return;
    }

    if (user.balance < amount) {
      setSaveError("Hamyoningizda yetarli pul yo'q! Avval daromad kiriting.");
      return;
    }

    const success = addMoney(amount);
    if (success) {
      setSaveSuccess(true);
      setSaveAmount("");
      setTimeout(() => setSaveSuccess(false), 2500);
    } else {
      setSaveError("O'tkazishda xatolik yuz berdi");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="glass-card p-6 sm:p-8"
    >
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-3">
            <motion.div
              whileHover={{ scale: 1.08, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
              className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500/10 to-emerald-500/10 border border-cyan-500/20 flex items-center justify-center shadow-sm"
            >
              <Target className="w-6 h-6 text-cyan-600 dark:text-cyan-400" />
            </motion.div>
            <div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">Katta Maqsad Progressi</h3>
              <p className="text-xs text-slate-500 dark:text-neutral-400 font-semibold">Jamg&apos;armangiz ko&apos;rsatkichlari</p>
            </div>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-cyan-500/10 dark:bg-cyan-500/20 border border-cyan-500/20">
            <span className="text-sm font-black text-cyan-700 dark:text-cyan-400">
              {progress}%
            </span>
          </div>
        </div>

        {/* Goal Detail Card */}
        <div className="mb-6 p-5 rounded-2xl bg-white dark:bg-neutral-950/40 border border-slate-100 dark:border-neutral-800 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-3xl filter drop-shadow">{user.goalEmoji || "🎯"}</span>
            <div>
              <h4 className="text-base font-black text-slate-800 dark:text-neutral-100 tracking-tight">
                {user.goalName || "Maqsad belgilanmagan"}
              </h4>
              <p className="text-[10px] text-slate-400 dark:text-neutral-500 font-bold uppercase tracking-wider">Tanlangan maqsad</p>
            </div>
          </div>

          <div className="relative mb-4">
            <Progress
              value={progress}
              size="md"
              radius="full"
              classNames={{
                base: "max-w-full",
                track: "bg-slate-100 dark:bg-neutral-900 border border-slate-200/50 dark:border-neutral-800 h-4",
                indicator: "bg-gradient-to-r from-emerald-500 via-cyan-500 to-emerald-400 shadow-sm rounded-full",
              }}
              aria-label="Maqsad progressi"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <span className="text-[9px] text-slate-400 dark:text-neutral-500 block uppercase font-bold tracking-wider mb-0.5">Jamg&apos;arilgan</span>
              <span className="text-emerald-600 dark:text-emerald-400 text-xl sm:text-2xl font-black">
                {formatNumber(user.savedAmount)}
              </span>
              <span className="text-emerald-600 dark:text-emerald-400 text-xs font-black ml-1">so&apos;m</span>
            </div>
            <div className="text-right">
              <span className="text-[9px] text-slate-400 dark:text-neutral-500 block uppercase font-bold tracking-wider mb-0.5">Maqsad summasi</span>
              <span className="text-slate-700 dark:text-neutral-200 text-xl sm:text-2xl font-black">
                {formatNumber(user.targetAmount)}
              </span>
              <span className="text-slate-650 dark:text-neutral-200 text-xs font-black ml-1">so&apos;m</span>
            </div>
          </div>
        </div>

        {/* Transfer form */}
        <form onSubmit={handleSaveTransfer} className="space-y-5">
          <div className="text-center bg-gradient-to-br from-emerald-50 to-cyan-50 dark:from-emerald-950/10 dark:to-cyan-950/10 border border-emerald-100/60 dark:border-emerald-900/20 p-4 rounded-2xl shadow-sm">
            <span className="text-xs text-emerald-800 dark:text-emerald-300 block font-bold mb-0.5">Hamyonda mavjud mablag&apos;:</span>
            <span className="text-2xl font-black text-emerald-600 dark:text-emerald-300 tracking-tight">{formatNumber(user.balance)}</span>
            <span className="text-emerald-600 dark:text-emerald-400 text-xs font-black ml-1">so&apos;m</span>
          </div>

          <div className="space-y-3">
            <div className="text-center">
              <label className="block text-sm text-slate-900 dark:text-white font-black mb-0.5">
                Jamg&apos;armaga pul o&apos;tkazish
              </label>
              <p className="text-[10px] text-slate-400 dark:text-neutral-400 font-semibold">Chetga (seysga) olib qo&apos;ymoqchi bo&apos;lgan summani kiriting</p>
            </div>
            
            <div className="relative max-w-xs sm:max-w-md mx-auto">
              <input
                type="number"
                value={saveAmount}
                onChange={(e) => {
                  setSaveAmount(e.target.value);
                  setSaveError("");
                }}
                placeholder="0"
                className="w-full pl-4 pr-12 py-3.5 rounded-2xl bg-slate-50 dark:bg-neutral-950 border-2 border-slate-200 dark:border-neutral-800 text-slate-950 dark:text-white placeholder-slate-500 dark:placeholder-neutral-400 focus:outline-none focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10 focus:scale-[1.01] transition-all text-xl sm:text-2xl font-black text-center shadow-inner"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 dark:text-neutral-400 font-bold text-xs sm:text-sm pointer-events-none select-none">
                so&apos;m
              </div>
            </div>

            {/* Live UZS preview */}
            <AnimatePresence>
              {saveAmount && parseInt(saveAmount) > 0 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: -4 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: -4 }}
                  className="flex justify-center"
                >
                  <div className="px-3.5 py-1 rounded-full bg-cyan-500/10 dark:bg-cyan-500/20 border border-cyan-500/20 text-cyan-600 dark:text-cyan-400 text-xs font-bold tracking-wide shadow-sm flex items-center gap-1">
                    <span>{formatNumber(parseInt(saveAmount))} UZS</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Preset Buttons */}
          <div className="grid grid-cols-3 gap-2 max-w-xs sm:max-w-md mx-auto w-full">
            {presets.map((preset, i) => (
              <motion.button
                key={preset}
                type="button"
                whileHover={{ scale: 1.04, y: -1.5 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => {
                  setSaveAmount(preset.toString());
                  setSaveError("");
                }}
                className="py-2.5 px-1 rounded-xl border border-slate-200 dark:border-neutral-800 hover:border-cyan-400 dark:hover:border-cyan-700 hover:bg-cyan-50/50 dark:hover:bg-cyan-950/20 text-slate-700 dark:text-neutral-300 hover:text-cyan-700 dark:hover:text-cyan-450 text-[11px] sm:text-xs font-bold transition-all cursor-pointer shadow-sm bg-white dark:bg-neutral-900 flex flex-col items-center gap-0.5"
              >
                <span className="text-base">{presetEmojis[i]}</span>
                <span className="font-black">+{formatNumber(preset)}</span>
              </motion.button>
            ))}
          </div>

          {/* Messages */}
          <AnimatePresence>
            {saveError && (
              <motion.p
                initial={{ opacity: 0, y: -8, height: 0 }}
                animate={{ opacity: 1, y: 0, height: "auto" }}
                exit={{ opacity: 0, y: -8, height: 0 }}
                className="text-xs text-rose-500 font-bold text-center bg-rose-50 dark:bg-rose-950/10 border border-rose-100 dark:border-rose-900/30 py-2.5 rounded-xl"
              >
                {saveError}
              </motion.p>
            )}
            {saveSuccess && (
              <motion.p
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="text-xs text-emerald-600 dark:text-emerald-400 font-bold text-center flex items-center justify-center gap-1.5 bg-emerald-50 dark:bg-emerald-950/10 border border-emerald-100 dark:border-emerald-900/30 py-2.5 rounded-xl"
              >
                <Check className="w-4 h-4" /> Jamg&apos;armaga o&apos;tkazildi! +30 XP, +15 tanga!
              </motion.p>
            )}
          </AnimatePresence>

          {/* Transfer button */}
          <motion.button
            type="submit"
            disabled={progress >= 100}
            whileHover={{ scale: 1.02, y: -0.5 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-3.5 rounded-xl font-black text-sm text-white bg-gradient-to-r from-emerald-500 to-cyan-500 hover:opacity-95 shadow-md disabled:opacity-50 disabled:cursor-not-allowed tracking-wide cursor-pointer"
          >
            {progress >= 100 ? "🎉 Maqsadga to&apos;liq erishildi!" : "Jamg&apos;armaga pul o&apos;tkazish"}
          </motion.button>
        </form>
      </div>
    </motion.div>
  );
}
