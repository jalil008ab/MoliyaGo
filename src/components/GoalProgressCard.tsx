"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Progress } from "@nextui-org/react";
import { Target, Plus, TrendingUp, TrendingDown, Trash2, ArrowRight, Wallet, Check } from "lucide-react";
import { useUser, Transaction } from "@/context/UserContext";

function formatNumber(n: number): string {
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

const categoryEmojis: Record<string, string> = {
  "Oziq-ovqat": "🍔",
  "Transport": "🚌",
  "Kino/O'yinlar": "🎮",
  "O'qish/Kurslar": "📚",
  "Boshqa": "📦",
  "Cho'ntak puli": "💵",
  "Ish/Frilans": "💼",
  "Sovg'a": "🎁",
};

const presetEmojis = ["💰", "💎", "🚀"];

export default function GoalProgressCard() {
  const { user, addMoney, addTransaction, deleteTransaction } = useUser();
  const [activeTab, setActiveTab] = useState<"savings" | "ledger">("savings");

  // Savings Transfer State
  const [saveAmount, setSaveAmount] = useState("");
  const [saveError, setSaveError] = useState("");
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Transaction Form State
  const [txType, setTxType] = useState<"income" | "expense">("expense");
  const [txAmount, setTxAmount] = useState("");
  const [txTitle, setTxTitle] = useState("");
  const [txCategory, setTxCategory] = useState("Oziq-ovqat");

  const progress = user.targetAmount > 0
    ? Math.min(100, Math.round((user.savedAmount / user.targetAmount) * 100))
    : 0;

  const remainingAmount = Math.max(0, user.targetAmount - user.savedAmount);

  // Quick select presets for savings
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

  const handleAddTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseInt(txAmount);
    if (!amount || amount <= 0) return;

    addTransaction(txType, amount, txTitle, txCategory);

    // Reset Form
    setTxAmount("");
    setTxTitle("");
  };

  const categories = txType === "expense"
    ? ["Oziq-ovqat", "Transport", "Kino/O'yinlar", "O'qish/Kurslar", "Boshqa"]
    : ["Cho'ntak puli", "Ish/Frilans", "Sovg'a", "Boshqa"];

  // Listen for quest-triggered ledger focus events from DailyQuestsCard
  useEffect(() => {
    const handleFocusLedger = (e: Event) => {
      const customEvent = e as CustomEvent<{ txType: "income" | "expense" }>;
      const { txType } = customEvent.detail;
      setActiveTab("ledger");
      setTxType(txType);
      if (txType === "expense") {
        setTxCategory("Oziq-ovqat");
      } else {
        setTxCategory("Cho'ntak puli");
      }
      // Focus the title input after tab switches
      setTimeout(() => {
        const el = document.getElementById("ledger-title-input");
        if (el) (el as HTMLInputElement).focus();
      }, 200);
    };
    window.addEventListener("focus-quest-ledger", handleFocusLedger);
    return () => window.removeEventListener("focus-quest-ledger", handleFocusLedger);
  }, []);

  // Tab content animation variants
  const tabContentVariants = {
    enter: { opacity: 0, y: 20, scale: 0.98 },
    center: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: -20, scale: 0.98 },
  };

  return (
    <motion.div
      id="goal-progress-card"
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="glass-card p-6 sm:p-8 h-full flex flex-col justify-between"
    >
      {/* Header and Progress */}
      <div>
        <div className="flex items-start justify-between mb-5">
          <div className="flex items-center gap-3.5">
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
              className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500/10 to-emerald-500/10 border border-cyan-500/20 flex items-center justify-center shadow-sm"
            >
              <Target className="w-6 h-6 text-cyan-600 dark:text-cyan-400" />
            </motion.div>
            <div>
              <h3 className="text-lg font-black text-slate-800 dark:text-neutral-100 tracking-tight">Maqsad Progressi</h3>
              <p className="text-sm text-slate-400 dark:text-neutral-400">Jamg'arma ko'rsatkichi</p>
            </div>
          </div>
          <motion.div
            whileHover={{ scale: 1.08 }}
            className="px-3.5 py-1.5 rounded-xl bg-cyan-500/10 dark:bg-cyan-500/20 border border-cyan-500/20"
          >
            <span className="text-sm font-black text-cyan-700 dark:text-cyan-400">
              {progress}%
            </span>
          </motion.div>
        </div>

        {/* Goal details */}
        <div className="mb-5 p-5 rounded-2xl bg-white dark:bg-neutral-950 border border-slate-100 dark:border-neutral-900 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-3xl">{user.goalEmoji || "🎯"}</span>
            <h4 className="text-base font-black text-slate-800 dark:text-neutral-200 tracking-tight">
              {user.goalName || "Maqsad belgilanmagan"}
            </h4>
          </div>

          <div className="relative mb-3">
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
              <span className="text-[10px] text-slate-400 dark:text-neutral-500 block uppercase font-bold tracking-wider mb-0.5">Jamg'arilgan</span>
              <span className="text-emerald-600 dark:text-emerald-400 text-2xl sm:text-3xl font-black">
                {formatNumber(user.savedAmount)}
              </span>
              <span className="text-emerald-600/60 dark:text-emerald-400/60 text-sm font-bold ml-1">so'm</span>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-400 dark:text-neutral-500 block uppercase font-bold tracking-wider mb-0.5">Maqsad summasi</span>
              <span className="text-slate-600 dark:text-neutral-300 text-2xl sm:text-3xl font-black">
                {formatNumber(user.targetAmount)}
              </span>
              <span className="text-slate-400 dark:text-neutral-500 text-sm font-bold ml-1">so'm</span>
            </div>
          </div>
        </div>

        {/* Animated Tab Switcher */}
        <div className="relative flex gap-2 p-1.5 bg-slate-100 dark:bg-neutral-900 rounded-2xl mb-5">
          {(["savings", "ledger"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`relative flex-1 py-3.5 text-sm font-bold rounded-xl transition-colors cursor-pointer flex flex-col items-center justify-center gap-1 z-10 ${
                activeTab === tab
                  ? "text-slate-800 dark:text-white"
                  : "text-slate-500 dark:text-neutral-400 hover:text-slate-700 dark:hover:text-neutral-300"
              }`}
            >
              {activeTab === tab && (
                <motion.div
                  layoutId="activeTabIndicator"
                  className="absolute inset-0 bg-white dark:bg-neutral-800 rounded-xl shadow-md border border-slate-200/50 dark:border-neutral-700"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative z-10 text-sm font-black">
                {tab === "savings" ? "💰 Jamg'arma Yig'ish" : "📝 Kundalik Daftarcha"}
              </span>
              <span className="relative z-10 text-[10px] text-slate-400 dark:text-neutral-500 font-medium hidden sm:inline">
                {tab === "savings" ? "(Maqsad uchun pul saqlash)" : "(Xarajat va daromadlar jurnali)"}
              </span>
            </button>
          ))}
        </div>

        {/* Dynamic Help Text */}
        <motion.div
          key={activeTab + "-help"}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="px-4 py-3 bg-slate-50 dark:bg-neutral-900/50 border border-slate-150 dark:border-neutral-800 rounded-2xl mb-5 text-center"
        >
          {activeTab === "savings" ? (
            <p className="text-sm text-slate-500 dark:text-neutral-400 font-medium leading-relaxed">
              💡 <span className="font-extrabold text-slate-700 dark:text-neutral-300">Jamg'arma yig'ish</span> — orzuingizdagi maqsadga erishish uchun hamyoningizdagi puldan alohida chetga (seysga) olib qo'yish.
            </p>
          ) : (
            <p className="text-sm text-slate-500 dark:text-neutral-400 font-medium leading-relaxed">
              💡 <span className="font-extrabold text-slate-700 dark:text-neutral-300">Kundalik Daftarcha</span> — har kungi daromadlaringiz (cho'ntak puli, sovg'alar) va xarajatlaringizni (tushlik, yo'lkira, o'yinlar) yozib borish jurnali.
            </p>
          )}
        </motion.div>
      </div>

      {/* Tabs Content with AnimatePresence */}
      <div className="flex-1 flex flex-col justify-between min-h-[320px]">
        <AnimatePresence mode="wait">
          {activeTab === "savings" ? (
            <motion.div
              key="savings-tab"
              variants={tabContentVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="flex-col flex justify-between h-full flex-1"
            >
              <form onSubmit={handleSaveTransfer} className="space-y-5">
                {/* Balance Display */}
                <motion.div
                  whileHover={{ scale: 1.01 }}
                  className="text-center bg-gradient-to-br from-emerald-50 to-cyan-50 dark:from-emerald-950/20 dark:to-cyan-950/20 border border-emerald-100 dark:border-emerald-900/30 p-5 rounded-2xl shadow-sm"
                >
                  <span className="text-sm text-emerald-700 dark:text-emerald-400 block font-bold mb-1">Hamyoningizda bor pul (Mavjud pul):</span>
                  <span className="text-3xl sm:text-4xl font-black text-emerald-600 dark:text-emerald-400 tracking-tight">{formatNumber(user.balance)}</span>
                  <span className="text-emerald-600/60 dark:text-emerald-400/60 text-base font-bold ml-1.5">so'm</span>
                </motion.div>

                {/* Savings Input */}
                <div className="space-y-3">
                  <div className="text-center">
                    <label className="block text-sm text-slate-600 dark:text-neutral-400 font-extrabold mb-1">
                      Jamg'armaga pul o'tkazish summasi
                    </label>
                    <p className="text-xs text-slate-400 dark:text-neutral-500">Maqsadingiz uchun chetga qo'ymoqchi bo'lgan miqdorni kiriting</p>
                  </div>
                  
                  <div className="relative max-w-md mx-auto">
                    <input
                      type="number"
                      value={saveAmount}
                      onChange={(e) => {
                        setSaveAmount(e.target.value);
                        setSaveError("");
                      }}
                      placeholder="0"
                      className="w-full pl-6 pr-16 py-6 rounded-2xl bg-slate-50 dark:bg-neutral-900 border-2 border-slate-200 dark:border-neutral-800 text-slate-800 dark:text-white placeholder-slate-350 dark:placeholder-neutral-700 focus:outline-none focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10 focus:scale-[1.01] transition-all text-3xl sm:text-4xl font-black text-center shadow-inner"
                    />
                    <div className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 dark:text-neutral-500 font-black text-base sm:text-lg pointer-events-none select-none">
                      so'm
                    </div>
                  </div>

                  {/* Live Currency Preview Badge */}
                  <AnimatePresence>
                    {saveAmount && parseInt(saveAmount) > 0 && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: -4 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: -4 }}
                        className="flex justify-center"
                      >
                        <div className="px-4 py-1.5 rounded-full bg-cyan-500/10 dark:bg-cyan-500/20 border border-cyan-500/20 text-cyan-600 dark:text-cyan-400 text-xs sm:text-sm font-extrabold tracking-wide shadow-sm flex items-center gap-1.5">
                          <span>✨</span>
                          <span>{formatNumber(parseInt(saveAmount))} UZS</span>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Preset Buttons */}
                <div className="grid grid-cols-3 gap-2.5 max-w-md mx-auto w-full">
                  {presets.map((preset, i) => (
                    <motion.button
                      key={preset}
                      type="button"
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        setSaveAmount(preset.toString());
                        setSaveError("");
                      }}
                      className="py-3 px-1 sm:px-2 rounded-2xl border-2 border-slate-200 dark:border-neutral-800 hover:border-cyan-400 dark:hover:border-cyan-700 hover:bg-cyan-50/50 dark:hover:bg-cyan-950/30 text-slate-600 dark:text-neutral-400 hover:text-cyan-700 dark:hover:text-cyan-400 text-xs sm:text-sm font-extrabold transition-all cursor-pointer shadow-sm bg-white dark:bg-neutral-900 flex flex-col items-center gap-1"
                    >
                      <span className="text-lg sm:text-xl filter drop-shadow-sm">{presetEmojis[i]}</span>
                      <span className="font-black text-[11px] sm:text-xs">+{formatNumber(preset)}</span>
                    </motion.button>
                  ))}
                </div>

                {/* Error/Success Messages */}
                <AnimatePresence>
                  {saveError && (
                    <motion.p
                      initial={{ opacity: 0, y: -8, height: 0 }}
                      animate={{ opacity: 1, y: 0, height: "auto" }}
                      exit={{ opacity: 0, y: -8, height: 0 }}
                      className="text-sm text-rose-500 font-bold text-center bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/30 py-3 rounded-2xl"
                    >
                      {saveError}
                    </motion.p>
                  )}
                  {saveSuccess && (
                    <motion.p
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="text-sm text-emerald-600 font-bold text-center flex items-center justify-center gap-2 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30 py-3 rounded-2xl"
                    >
                      <Check className="w-5 h-5" /> Jamg'armangizga pul muvaffaqiyatli qo'shildi! +30 XP!
                    </motion.p>
                  )}
                </AnimatePresence>

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  disabled={progress >= 100}
                  whileHover={{ scale: 1.02, y: -1 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-4 rounded-2xl font-black text-sm text-white bg-gradient-to-r from-emerald-500 to-cyan-500 hover:opacity-95 shadow-lg hover:shadow-xl transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed tracking-wide"
                >
                  {progress >= 100 ? "🎉 Tabriklaymiz! Maqsadga to'liq erishildi!" : "Jamg'arishga yuborish ➔"}
                </motion.button>
              </form>
            </motion.div>
          ) : (
            <motion.div
              key="ledger-tab"
              variants={tabContentVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="flex flex-col gap-5 h-full flex-1"
            >
              {/* Transaction Form */}
              <form onSubmit={handleAddTransaction} className="space-y-5 border-b border-slate-100 dark:border-neutral-900 pb-5">
                {/* Income / Expense Toggle */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setTxType("expense");
                      setTxCategory("Oziq-ovqat");
                    }}
                    className={`flex-1 py-3.5 rounded-2xl text-sm font-black transition-all cursor-pointer flex items-center justify-center gap-2 shadow-sm ${
                      txType === "expense"
                        ? "bg-rose-500 text-white border-2 border-rose-500 shadow-rose-500/20 shadow-md"
                        : "bg-slate-50 dark:bg-neutral-900 border-2 border-slate-200 dark:border-neutral-800 text-slate-500 dark:text-neutral-400 hover:bg-slate-100 dark:hover:bg-neutral-800"
                    }`}
                  >
                    <TrendingDown className="w-5 h-5" /> Xarajat kiritish
                  </motion.button>
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setTxType("income");
                      setTxCategory("Cho'ntak puli");
                    }}
                    className={`flex-1 py-3.5 rounded-2xl text-sm font-black transition-all cursor-pointer flex items-center justify-center gap-2 shadow-sm ${
                      txType === "income"
                        ? "bg-emerald-500 text-white border-2 border-emerald-500 shadow-emerald-500/20 shadow-md"
                        : "bg-slate-50 dark:bg-neutral-900 border-2 border-slate-200 dark:border-neutral-800 text-slate-500 dark:text-neutral-400 hover:bg-slate-100 dark:hover:bg-neutral-800"
                    }`}
                  >
                    <TrendingUp className="w-5 h-5" /> Daromad kiritish
                  </motion.button>
                </div>

                {/* Title Input */}
                <div>
                  <label className="block text-sm text-slate-600 dark:text-neutral-400 font-bold mb-1.5">Xarid / Manba nomi</label>
                  <p className="text-xs text-slate-400 dark:text-neutral-500 mb-2">
                    {txType === "expense" ? "Nimaga pul sarfladingiz?" : "Pul qayerdan keldi?"}
                  </p>
                  <input
                    type="text"
                    value={txTitle}
                    onChange={(e) => setTxTitle(e.target.value)}
                    id="ledger-title-input"
                    placeholder={txType === "expense" ? "Masalan: Tushlik ovqat" : "Masalan: Oylik / Cho'ntak puli"}
                    required
                    className="w-full px-5 py-4 rounded-2xl bg-white dark:bg-neutral-950 border-2 border-slate-200 dark:border-neutral-800 text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-neutral-600 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 focus:scale-[1.02] transition-all text-base font-semibold shadow-sm"
                  />
                </div>

                {/* Amount Input */}
                <div className="space-y-3">
                  <div className="text-center">
                    <label className="block text-sm text-slate-600 dark:text-neutral-400 font-extrabold mb-1">Summa (so'm)</label>
                    <p className="text-xs text-slate-400 dark:text-neutral-500">Miqdorni so'mda kiriting</p>
                  </div>

                  <div className="relative max-w-md mx-auto">
                    <input
                      type="number"
                      value={txAmount}
                      onChange={(e) => setTxAmount(e.target.value)}
                      placeholder="0"
                      required
                      className="w-full pl-6 pr-16 py-6 rounded-2xl bg-slate-50 dark:bg-neutral-900 border-2 border-slate-200 dark:border-neutral-800 text-slate-800 dark:text-white placeholder-slate-350 dark:placeholder-neutral-700 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 focus:scale-[1.01] transition-all text-3xl sm:text-4xl font-black text-center shadow-inner"
                    />
                    <div className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 dark:text-neutral-500 font-black text-base sm:text-lg pointer-events-none select-none">
                      so'm
                    </div>
                  </div>

                  {/* Live Currency Preview Badge */}
                  <AnimatePresence>
                    {txAmount && parseInt(txAmount) > 0 && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: -4 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: -4 }}
                        className="flex justify-center"
                      >
                        <div className="px-4 py-1.5 rounded-full bg-indigo-500/10 dark:bg-indigo-500/20 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-xs sm:text-sm font-extrabold tracking-wide shadow-sm flex items-center gap-1.5">
                          <span>✨</span>
                          <span>{formatNumber(parseInt(txAmount))} UZS</span>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Category Pill Selector */}
                <div>
                  <label className="block text-sm text-slate-600 dark:text-neutral-400 font-bold mb-2">Turkum / Kategoriya</label>
                  <div className="flex flex-wrap gap-2.5">
                    {categories.map((cat) => (
                      <motion.button
                        key={cat}
                        type="button"
                        whileHover={{ scale: 1.06, y: -1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setTxCategory(cat)}
                        className={`py-2.5 px-4 rounded-2xl text-sm font-bold transition-all cursor-pointer flex items-center gap-2 shadow-sm ${
                          txCategory === cat
                            ? txType === "expense"
                              ? "bg-rose-500 text-white border-2 border-rose-500 shadow-rose-500/20 shadow-md"
                              : "bg-emerald-500 text-white border-2 border-emerald-500 shadow-emerald-500/20 shadow-md"
                            : "bg-white dark:bg-neutral-900 border-2 border-slate-200 dark:border-neutral-800 text-slate-600 dark:text-neutral-400 hover:border-slate-300 dark:hover:border-neutral-700"
                        }`}
                      >
                        <span className="text-base">{categoryEmojis[cat] || "📦"}</span>
                        {cat}
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02, y: -1 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-3.5 px-6 rounded-2xl bg-slate-800 dark:bg-neutral-800 hover:bg-slate-700 dark:hover:bg-neutral-700 text-white font-black text-sm transition-all cursor-pointer shadow-lg flex items-center justify-center gap-2"
                >
                  <Plus className="w-5 h-5" /> Qayd etish
                </motion.button>
              </form>

              {/* Transaction List */}
              <div className="flex-1 flex flex-col justify-between">
                <h5 className="text-sm font-black text-slate-400 dark:text-neutral-500 uppercase tracking-wider mb-3">Tranzaksiyalar tarixi</h5>

                <div className="overflow-y-auto max-h-[180px] space-y-2.5 pr-1">
                  {user.transactions.length === 0 ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-center py-8"
                    >
                      <span className="text-3xl block mb-2">📭</span>
                      <p className="text-sm text-slate-400 dark:text-neutral-500 font-medium">Hali hech qanday xarajat yoki daromad kiritilmadi.</p>
                    </motion.div>
                  ) : (
                    <AnimatePresence>
                      {user.transactions.map((tx) => (
                        <motion.div
                          key={tx.id}
                          initial={{ opacity: 0, x: -15, scale: 0.97 }}
                          animate={{ opacity: 1, x: 0, scale: 1 }}
                          exit={{ opacity: 0, x: 15, scale: 0.97 }}
                          transition={{ duration: 0.25 }}
                          whileHover={{ scale: 1.01, y: -1 }}
                          className="flex items-center justify-between p-3.5 rounded-2xl bg-white dark:bg-neutral-900 border border-slate-100 dark:border-neutral-800 shadow-sm hover:shadow-md transition-all"
                        >
                          <div className="flex items-center gap-3">
                            <div className={`p-2.5 rounded-xl ${
                              tx.type === "income"
                                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                                : "bg-rose-500/10 text-rose-600 dark:text-rose-400"
                            }`}>
                              {tx.type === "income" ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
                            </div>
                            <div>
                              <p className="font-bold text-sm text-slate-700 dark:text-neutral-200 leading-snug">{tx.title}</p>
                              <p className="text-xs text-slate-400 dark:text-neutral-500 font-semibold mt-0.5">
                                {categoryEmojis[tx.category] || "📦"} {tx.category} • {tx.date}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className={`font-black text-base ${
                              tx.type === "income" ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"
                            }`}>
                              {tx.type === "income" ? "+" : "-"}{formatNumber(tx.amount)}
                            </span>
                            <motion.button
                              whileHover={{ scale: 1.15 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => deleteTransaction(tx.id)}
                              className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-rose-950/30 rounded-xl transition-all cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </motion.button>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
