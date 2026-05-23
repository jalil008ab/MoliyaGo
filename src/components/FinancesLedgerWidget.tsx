"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useMemo } from "react";
import { Plus, TrendingUp, TrendingDown, Trash2, Tag, Calendar, AlertCircle } from "lucide-react";
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
  "Jamg'arma": "💰",
  "Simulyatsiya": "🤖",
};

export default function FinancesLedgerWidget() {
  const { user, addTransaction, deleteTransaction } = useUser();

  // Transaction Form State
  const [txType, setTxType] = useState<"income" | "expense">("expense");
  const [txAmount, setTxAmount] = useState("");
  const [txTitle, setTxTitle] = useState("");
  const [txCategory, setTxCategory] = useState("Oziq-ovqat");

  // Interactive Category Filter State
  const [selectedFilter, setSelectedFilter] = useState<string>("Barchasi");

  const categories = txType === "expense"
    ? ["Oziq-ovqat", "Transport", "Kino/O'yinlar", "O'qish/Kurslar", "Boshqa"]
    : ["Cho'ntak puli", "Ish/Frilans", "Sovg'a", "Boshqa"];

  // Filter Categories defined in general
  const allFilterCategories = [
    "Barchasi",
    "Oziq-ovqat",
    "Transport",
    "Kino/O'yinlar",
    "O'qish/Kurslar",
    "Cho'ntak puli",
    "Ish/Frilans",
    "Sovg'a",
    "Jamg'arma",
    "Boshqa"
  ];

  const handleAddTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseInt(txAmount);
    if (!amount || amount <= 0) return;

    addTransaction(txType, amount, txTitle, txCategory);

    // Reset Form
    setTxAmount("");
    setTxTitle("");
  };

  // Filtered transactions list
  const filteredTransactions = useMemo(() => {
    if (selectedFilter === "Barchasi") return user.transactions;
    return user.transactions.filter(t => t.category === selectedFilter);
  }, [user.transactions, selectedFilter]);

  // Calculate totals for selected filter
  const filterStats = useMemo(() => {
    let totalIncome = 0;
    let totalExpense = 0;

    filteredTransactions.forEach((tx) => {
      if (tx.type === "income") totalIncome += tx.amount;
      else totalExpense += tx.amount;
    });

    return { totalIncome, totalExpense };
  }, [filteredTransactions]);

  // Quick statistics for all categories
  const categoryBudgets = useMemo(() => {
    const sums: Record<string, number> = {};
    user.transactions.forEach(tx => {
      if (tx.type === "expense") {
        sums[tx.category] = (sums[tx.category] || 0) + tx.amount;
      }
    });
    return sums;
  }, [user.transactions]);

  // Listen for quest-triggered ledger focus events from DailyQuestsCard
  useEffect(() => {
    const handleFocusLedger = (e: Event) => {
      const customEvent = e as CustomEvent<{ txType: "income" | "expense" }>;
      const { txType } = customEvent.detail;
      setTxType(txType);
      if (txType === "expense") {
        setTxCategory("Oziq-ovqat");
      } else {
        setTxCategory("Cho'ntak puli");
      }
      setTimeout(() => {
        const el = document.getElementById("ledger-title-input");
        if (el) (el as HTMLInputElement).focus();
      }, 100);
    };
    window.addEventListener("focus-quest-ledger", handleFocusLedger);
    return () => window.removeEventListener("focus-quest-ledger", handleFocusLedger);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full"
    >
      {/* 1. Transaction logging form */}
      <div className="lg:col-span-5 flex flex-col gap-6">
        <div className="glass-card p-6 sm:p-8">
          <div className="relative z-10">
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 dark:bg-indigo-500/20 flex items-center justify-center font-black text-indigo-600 dark:text-indigo-400 text-lg">
                📝
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">Kundalik Daftarcha</h3>
                <p className="text-xs text-slate-500 dark:text-neutral-400 font-semibold">Daromadlar va xarajatlarni qayd etish</p>
              </div>
            </div>

            <form onSubmit={handleAddTransaction} className="space-y-5">
              {/* Type Switch */}
              <div className="flex gap-2">
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setTxType("expense");
                    setTxCategory("Oziq-ovqat");
                  }}
                  className={`flex-1 py-3.5 rounded-2xl text-xs xs:text-sm font-black transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-sm border-2 ${
                    txType === "expense"
                      ? "bg-rose-500 text-white border-rose-500 shadow-rose-500/20"
                      : "bg-slate-50 dark:bg-neutral-950 border-slate-200 dark:border-neutral-800 text-slate-500 dark:text-neutral-400 hover:bg-slate-100"
                  }`}
                >
                  <TrendingDown className="w-4 h-4" />
                  <span>Xarajat kiritish</span>
                </motion.button>
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setTxType("income");
                    setTxCategory("Cho'ntak puli");
                  }}
                  className={`flex-1 py-3.5 rounded-2xl text-xs xs:text-sm font-black transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-sm border-2 ${
                    txType === "income"
                      ? "bg-emerald-500 text-white border-emerald-500 shadow-emerald-500/20"
                      : "bg-slate-50 dark:bg-neutral-950 border-slate-200 dark:border-neutral-800 text-slate-500 dark:text-neutral-400 hover:bg-slate-100"
                  }`}
                >
                  <TrendingUp className="w-4 h-4" />
                  <span>Daromad kiritish</span>
                </motion.button>
              </div>

              {/* Title input */}
              <div className="space-y-1.5">
                <label className="block text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">Xarid / Manba nomi</label>
                <input
                  type="text"
                  value={txTitle}
                  onChange={(e) => setTxTitle(e.target.value)}
                  id="ledger-title-input"
                  placeholder={txType === "expense" ? "Masalan: Maktab oshxonasida tushlik" : "Masalan: Ota-onam bergan pul"}
                  required
                  className="w-full px-4 py-3.5 rounded-2xl bg-white dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 text-slate-950 dark:text-white placeholder-slate-500 dark:placeholder-neutral-400 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all text-sm font-semibold shadow-sm"
                />
              </div>

              {/* Amount input */}
              <div className="space-y-2">
                <label className="block text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider text-center">Summa (so&apos;m)</label>
                <div className="relative max-w-xs sm:max-w-md mx-auto">
                  <input
                    type="number"
                    value={txAmount}
                    onChange={(e) => setTxAmount(e.target.value)}
                    placeholder="0"
                    required
                    className="w-full pl-4 pr-12 py-3 rounded-2xl bg-slate-50 dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 text-slate-950 dark:text-white placeholder-slate-500 dark:placeholder-neutral-400 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 focus:scale-[1.01] transition-all text-xl font-black text-center shadow-inner"
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 dark:text-neutral-400 font-bold text-xs pointer-events-none select-none">
                    so&apos;m
                  </div>
                </div>

                {/* Currency preview badge */}
                <AnimatePresence>
                  {txAmount && parseInt(txAmount) > 0 && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9, y: -4 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9, y: -4 }}
                      className="flex justify-center"
                    >
                      <div className="px-3.5 py-1 rounded-full bg-indigo-500/10 dark:bg-indigo-500/20 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-xs font-bold shadow-sm">
                        {formatNumber(parseInt(txAmount))} UZS
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Category selector */}
              <div className="space-y-2">
                <label className="block text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">Kategoriya tanlang</label>
                <div className="flex flex-wrap gap-2">
                  {categories.map((cat) => (
                    <motion.button
                      key={cat}
                      type="button"
                      whileHover={{ scale: 1.05, y: -1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setTxCategory(cat)}
                      className={`py-2 px-3.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 border ${
                        txCategory === cat
                          ? txType === "expense"
                            ? "bg-rose-500 text-white border-rose-500 shadow-md shadow-rose-500/20"
                            : "bg-emerald-500 text-white border-emerald-500 shadow-md shadow-emerald-500/20"
                          : "bg-white dark:bg-neutral-900 border-slate-200 dark:border-neutral-800 text-slate-600 dark:text-neutral-400 hover:border-slate-350"
                      }`}
                    >
                      <span>{categoryEmojis[cat] || "📦"}</span>
                      {cat}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Submit */}
              <motion.button
                type="submit"
                whileHover={{ scale: 1.02, y: -0.5 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3.5 rounded-xl bg-slate-900 dark:bg-neutral-800 hover:bg-slate-800 dark:hover:bg-neutral-705 text-white font-black text-xs transition-all cursor-pointer shadow flex items-center justify-center gap-1.5"
              >
                <Plus className="w-4 h-4" /> Qayd etish (Daftarga yozish)
              </motion.button>
            </form>
          </div>
        </div>

        {/* Category breakdown visual card */}
        <div className="glass-card p-5">
          <div className="relative z-10">
            <h4 className="text-xs font-black text-slate-400 dark:text-neutral-500 uppercase tracking-widest mb-3">Xarajatlar Tahlili (Kategoriya bo&apos;yicha)</h4>
            {Object.keys(categoryBudgets).length === 0 ? (
              <p className="text-xs text-slate-500 dark:text-neutral-400 font-semibold text-center py-4">Hali hech qanday xarajat kiritilmagan.</p>
            ) : (
              <div className="space-y-3">
                {Object.entries(categoryBudgets).map(([cat, amount]) => (
                  <div key={cat} className="space-y-1.5">
                    <div className="flex justify-between text-xs font-bold">
                      <span className="text-slate-700 dark:text-neutral-350">{categoryEmojis[cat] || "📦"} {cat}</span>
                      <span className="text-rose-600 dark:text-rose-400 font-black">{formatNumber(amount)} so&apos;m</span>
                    </div>
                    <div className="h-1.5 bg-black/5 dark:bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-rose-500 rounded-full" style={{ width: `${Math.min(100, (amount / Math.max(1, user.balance + amount)) * 100)}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 2. Transaction list with interactive category filtering */}
      <div className="lg:col-span-7 flex flex-col gap-6">
        <div className="glass-card p-6 sm:p-8 flex-1 flex flex-col justify-between">
          <div className="relative z-10 flex-1 flex flex-col justify-between">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5 pb-4 border-b border-black/5 dark:border-white/5">
              <div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">Tranzaksiyalar tarixi</h3>
                <p className="text-xs text-slate-500 dark:text-neutral-400 font-semibold">Qayd etilgan pul oqimlaringiz ro&apos;yxati</p>
              </div>
              {/* Badge for filtered stats */}
              {selectedFilter !== "Barchasi" && (
                <div className="px-3.5 py-1.5 rounded-full bg-indigo-500/10 dark:bg-indigo-500/20 border border-indigo-500/20 text-xs font-black text-indigo-600 dark:text-indigo-400 self-start sm:self-center">
                  Jami:{" "}
                  {filterStats.totalExpense > 0 && `-${formatNumber(filterStats.totalExpense)} UZS xarajat `}
                  {filterStats.totalIncome > 0 && `+${formatNumber(filterStats.totalIncome)} UZS daromad `}
                </div>
              )}
            </div>

            {/* Interactive Category Filter Pills */}
            <div className="mb-6 space-y-2">
              <label className="block text-[10px] font-black text-slate-400 dark:text-neutral-500 uppercase tracking-widest">Kategoriya bo&apos;yicha saralash (Filtrlash):</label>
              <div className="flex gap-2 overflow-x-auto pb-1.5 pt-0.5 scrollbar-thin">
                {allFilterCategories.map((cat) => {
                  const hasTransactions = cat === "Barchasi" || user.transactions.some(t => t.category === cat);
                  if (!hasTransactions) return null; // Only show filters that have transactions, keeps UI minimalist!

                  const active = selectedFilter === cat;
                  return (
                    <motion.button
                      key={cat}
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.96 }}
                      onClick={() => setSelectedFilter(cat)}
                      className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold cursor-pointer border transition-all ${
                        active
                          ? "bg-indigo-500 text-white border-indigo-500 shadow-md shadow-indigo-500/20"
                          : "bg-slate-50 dark:bg-neutral-950 text-slate-600 dark:text-neutral-400 border-slate-200 dark:border-neutral-850 hover:border-indigo-300"
                      }`}
                    >
                      <span className="text-sm">{cat === "Barchasi" ? "🌐" : categoryEmojis[cat] || "📦"}</span>
                      {cat}
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Transactions History list */}
            <div className="flex-1 flex flex-col justify-between min-h-[380px]">
              <div className="overflow-y-auto max-h-[460px] space-y-3 pr-1">
                {filteredTransactions.length === 0 ? (
                  <div className="text-center py-16">
                    <span className="text-4xl block mb-3 filter drop-shadow">📭</span>
                    <h4 className="text-base font-bold text-slate-700 dark:text-neutral-300">
                      {selectedFilter === "Barchasi"
                        ? "Hali hech qanday tranzaksiya kiritilmadi!"
                        : `"${selectedFilter}" kategoriyasida tranzaksiya mavjud emas.`}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-neutral-400 font-semibold mt-1">
                      {selectedFilter === "Barchasi"
                        ? "Chap tarafdagi formani to'ldirib, birinchi daromad yoki xarajatingizni yozing."
                        : "Boshqa kategoriya tanlang yoki barcha tranzaksiyalarga qayting."}
                    </p>
                    {selectedFilter !== "Barchasi" && (
                      <button
                        onClick={() => setSelectedFilter("Barchasi")}
                        className="mt-4 px-4 py-2 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-xs font-black rounded-xl cursor-pointer"
                      >
                        Barcha tranzaksiyalarga qaytish
                      </button>
                    )}
                  </div>
                ) : (
                  <AnimatePresence mode="popLayout">
                    {filteredTransactions.map((tx) => (
                      <motion.div
                        key={tx.id}
                        layout
                        initial={{ opacity: 0, x: -20, scale: 0.97 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, x: 20, scale: 0.97 }}
                        transition={{ duration: 0.2, type: "spring", stiffness: 450, damping: 28 }}
                        whileHover={{ y: -2 }}
                        className="flex items-center justify-between p-4 rounded-2xl bg-white dark:bg-neutral-950/40 border border-slate-100 dark:border-neutral-800 shadow-sm hover:shadow transition-all"
                      >
                        <div className="flex items-center gap-3.5 min-w-0">
                          <div className={`p-3 rounded-xl flex-shrink-0 ${
                            tx.type === "income"
                              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                              : "bg-rose-500/10 text-rose-600 dark:text-rose-400"
                          }`}>
                            {tx.type === "income" ? <TrendingUp className="w-5 h-5 flex-shrink-0" /> : <TrendingDown className="w-5 h-5 flex-shrink-0" />}
                          </div>
                          <div className="min-w-0">
                            <p className="font-black text-sm text-slate-900 dark:text-white leading-snug truncate pr-2">{tx.title}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 text-[10px] text-slate-500 dark:text-neutral-400 font-bold">
                                {categoryEmojis[tx.category] || "📦"} {tx.category}
                              </span>
                              <span className="text-[10px] text-slate-400 dark:text-neutral-500 font-bold flex items-center gap-0.5">
                                <Calendar className="w-3 h-3" /> {tx.date}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3.5 flex-shrink-0">
                          <span className={`font-black text-base sm:text-lg ${
                            tx.type === "income" ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"
                          }`}>
                            {tx.type === "income" ? "+" : "-"}{formatNumber(tx.amount)} UZS
                          </span>
                          <motion.button
                            whileHover={{ scale: 1.15, color: "#EF4444" }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => deleteTransaction(tx.id)}
                            className="p-2 text-slate-400 hover:bg-red-50 dark:hover:bg-rose-950/20 rounded-xl transition-all cursor-pointer"
                            title="O'chirish"
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
          </div>
        </div>
      </div>
    </motion.div>
  );
}
