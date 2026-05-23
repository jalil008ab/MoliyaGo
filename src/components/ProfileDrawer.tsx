"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { useUser } from "@/context/UserContext";
import {
  X,
  User,
  Edit3,
  Save,
  Target,
  Wallet,
  Star,
  Trophy,
  TrendingUp,
  Calendar,
  Flame,
} from "lucide-react";

function formatNumber(n: number): string {
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

interface ProfileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ProfileDrawer({ isOpen, onClose }: ProfileDrawerProps) {
  const { user, updateProfile } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(user.name);
  const [editAge, setEditAge] = useState(user.age.toString());
  const [editGoalName, setEditGoalName] = useState(user.goalName);
  const [editTargetAmount, setEditTargetAmount] = useState(user.targetAmount.toString());

  useEffect(() => {
    setEditName(user.name);
    setEditAge(user.age.toString());
    setEditGoalName(user.goalName);
    setEditTargetAmount(user.targetAmount.toString());
  }, [user, isOpen]);

  const handleSave = () => {
    updateProfile({
      name: editName.trim(),
      age: parseInt(editAge) || user.age,
      goalName: editGoalName.trim(),
      targetAmount: parseInt(editTargetAmount) || user.targetAmount,
    });
    setIsEditing(false);
  };

  const occupationLabels = {
    student: "Maktab o'quvchisi 📚",
    university: "Universitet talabasi 🎓",
    worker: "Ishchi / Frilanser 💼",
  };

  const progress = user.targetAmount > 0 ? Math.min(100, Math.round((user.savedAmount / user.targetAmount) * 100)) : 0;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{ zIndex: 150 }}
            className="fixed inset-0 bg-slate-900/40 dark:bg-black/60 backdrop-blur-sm"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 26, stiffness: 220 }}
            style={{ zIndex: 160 }}
            className="fixed top-0 right-0 bottom-0 w-full max-w-md"
          >
            <div className="h-full bg-white/95 dark:bg-neutral-900/95 backdrop-blur-xl border-l border-slate-200/80 dark:border-neutral-800 shadow-2xl rounded-l-3xl overflow-y-auto">
              {/* Decorative glow */}
              <div className="absolute top-0 left-0 w-full h-40 bg-gradient-to-b from-cyan-100/30 dark:from-cyan-950/10 to-transparent pointer-events-none" />

              <div className="relative p-6">
                {/* Header */}
                <div className="relative z-50 flex items-center justify-between mb-6 border-b border-slate-100 dark:border-neutral-800 pb-4">
                  <div className="flex items-center gap-3">
                    <User className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
                    <h2 className="text-xl font-bold text-slate-800 dark:text-neutral-100">Mening Profilim</h2>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.08, rotate: 90 }}
                    whileTap={{ scale: 0.92 }}
                    onClick={onClose}
                    className="p-2 rounded-xl bg-slate-100 dark:bg-neutral-800 border border-slate-200 dark:border-neutral-700 text-slate-500 dark:text-neutral-400 hover:text-slate-800 dark:hover:text-neutral-100 hover:bg-slate-200 dark:hover:bg-neutral-700 transition-all cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </motion.button>
                </div>

                {/* Avatar & Name with active frame and badge */}
                <div className="text-center mb-6">
                  <div className="relative inline-block mb-3">
                    {/* Active Frame Glow Ring */}
                    <div
                      className={`absolute -inset-2 rounded-full opacity-70 blur-[3px] transition-all duration-300 ${
                        user.activeFrame === "frame-gold"
                          ? "shadow-[0_0_15px_rgba(245,166,35,0.8)] animate-pulse"
                          : user.activeFrame === "frame-diamond"
                          ? "shadow-[0_0_15px_rgba(168,237,234,0.8)]"
                          : user.activeFrame === "frame-fire"
                          ? "shadow-[0_0_15px_rgba(248,54,0,0.8)] animate-pulse"
                          : "bg-gradient-to-r from-emerald-400 via-cyan-400 to-pink-400 opacity-30 animate-pulse"
                      }`}
                      style={{
                        background:
                          user.activeFrame === "frame-gold"
                            ? "linear-gradient(135deg, #F5A623, #FFD166, #C47D0E)"
                            : user.activeFrame === "frame-diamond"
                            ? "linear-gradient(135deg, #a8edea, #fed6e3, #a8edea)"
                            : user.activeFrame === "frame-fire"
                            ? "linear-gradient(135deg, #f83600, #f9d423)"
                            : undefined,
                      }}
                    />
                    <div
                      className="relative w-20 h-20 rounded-full flex items-center justify-center border-2 border-white dark:border-neutral-900 shadow-md transition-all duration-300"
                      style={{
                        background:
                          user.activeFrame === "frame-gold"
                            ? "linear-gradient(135deg, rgba(245,166,35,0.35), rgba(255,209,102,0.2))"
                            : user.activeFrame === "frame-diamond"
                            ? "linear-gradient(135deg, rgba(168,237,234,0.35), rgba(254,214,227,0.2))"
                            : user.activeFrame === "frame-fire"
                            ? "linear-gradient(135deg, rgba(248,54,0,0.35), rgba(249,212,35,0.2))"
                            : "linear-gradient(135deg, rgba(245,166,35,0.2), rgba(6,194,112,0.2))",
                      }}
                    >
                      <span className="text-3xl font-black gradient-text">
                        {user.name ? user.name.charAt(0).toUpperCase() : "M"}
                      </span>
                    </div>

                    {/* Float frame overlay emoji (👑, 💎, 🔥) */}
                    {user.activeFrame && user.activeFrame !== "default" && (
                      <div className="absolute -top-3 -right-1.5 text-xl select-none pointer-events-none drop-shadow filter">
                        {user.activeFrame === "frame-gold" && "👑"}
                        {user.activeFrame === "frame-diamond" && "💎"}
                        {user.activeFrame === "frame-fire" && "🔥"}
                      </div>
                    )}

                    {/* Level indicator */}
                    <div className="absolute -bottom-1 -right-1.5 w-7 h-7 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 flex items-center justify-center border-2 border-white dark:border-neutral-900 shadow">
                      <span className="text-[10px] font-black text-white">
                        {user.level}
                      </span>
                    </div>
                  </div>
                  {!isEditing ? (
                    <>
                      <h3 className="text-2xl font-black tracking-tight text-slate-800 dark:text-neutral-100 mb-1 flex items-center justify-center gap-1.5">
                        <span>{user.name}</span>
                        {/* Display Active Badge Emoji next to name */}
                        {user.activeBadge && (
                          <span
                            title={
                              user.activeBadge === "badge-millioner"
                                ? "Millioner 💰"
                                : user.activeBadge === "badge-tejamkor"
                                ? "Tejamkor 🏦"
                                : "Investor 📈"
                            }
                            className="text-lg filter drop-shadow animate-bounce"
                          >
                            {user.activeBadge === "badge-millioner" && "💰"}
                            {user.activeBadge === "badge-tejamkor" && "🏦"}
                            {user.activeBadge === "badge-investor" && "📈"}
                          </span>
                        )}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-neutral-400 font-semibold">{occupationLabels[user.occupation]}</p>
                    </>
                  ) : (
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="w-full px-4 py-2 rounded-2xl bg-slate-50 dark:bg-neutral-900 border border-cyan-300 dark:border-cyan-800 text-slate-800 dark:text-neutral-100 text-center focus:outline-none focus:bg-white dark:focus:bg-neutral-800 text-lg font-bold shadow-sm"
                    />
                  )}
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                  <div className="p-3.5 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30 shadow-sm animate-fade-in">
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <Wallet className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                      <span className="text-[10px] text-slate-400 dark:text-neutral-400 font-bold uppercase tracking-wider">Hamyon</span>
                    </div>
                    <p className="text-base font-black text-emerald-600 dark:text-emerald-400">
                      {formatNumber(user.balance)} so&apos;m
                    </p>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-pink-50/70 dark:bg-pink-950/20 border border-pink-100 dark:border-pink-900/30 shadow-sm animate-fade-in">
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <Star className="w-3.5 h-3.5 text-pink-600 dark:text-pink-400" />
                      <span className="text-[10px] text-slate-400 dark:text-neutral-400 font-bold uppercase tracking-wider">Bilim (XP)</span>
                    </div>
                    <p className="text-base font-black text-pink-600 dark:text-pink-400">
                      {formatNumber(user.xp)} XP
                    </p>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/30 shadow-sm animate-fade-in">
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <Trophy className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                      <span className="text-[10px] text-slate-400 dark:text-neutral-400 font-bold uppercase tracking-wider">Tangalar</span>
                    </div>
                    <p className="text-base font-black text-amber-600 dark:text-amber-400">
                      🪙 {formatNumber(user.coins)}
                    </p>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-orange-50/70 dark:bg-orange-950/20 border border-orange-100 dark:border-orange-900/30 shadow-sm animate-fade-in">
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <Flame className="w-3.5 h-3.5 text-orange-500 dark:text-orange-400" />
                      <span className="text-[10px] text-slate-400 dark:text-neutral-400 font-bold uppercase tracking-wider">Kunlik Streak</span>
                    </div>
                    <p className="text-base font-black text-orange-500 dark:text-orange-400">
                      🔥 {user.streak} kun
                    </p>
                  </div>
                </div>

                {/* Goal Progress */}
                <div className="p-4 rounded-2xl bg-slate-50/80 dark:bg-neutral-900/80 border border-slate-200/60 dark:border-neutral-800/80 shadow-sm mb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Target className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-neutral-400">Katta Maqsadim</span>
                  </div>
                  {!isEditing ? (
                    <p className="text-lg font-bold text-slate-800 dark:text-neutral-100 mb-2.5">
                      {user.goalEmoji} {user.goalName}
                    </p>
                  ) : (
                    <input
                      type="text"
                      value={editGoalName}
                      onChange={(e) => setEditGoalName(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 text-slate-800 dark:text-neutral-100 focus:outline-none focus:border-cyan-500 dark:focus:border-cyan-800 transition-all text-sm font-semibold mb-2 shadow-inner"
                    />
                  )}
                  <div className="h-2.5 bg-slate-200/70 dark:bg-neutral-800 rounded-full overflow-hidden mb-2.5 shadow-inner">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className="h-full bg-gradient-to-r from-emerald-500 via-cyan-500 to-pink-500 rounded-full"
                    />
                  </div>
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-emerald-600 dark:text-emerald-400">
                      Tejalgan: {formatNumber(user.savedAmount)} so&apos;m ({progress}%)
                    </span>
                    {!isEditing ? (
                      <span className="text-slate-500 dark:text-neutral-400">
                        Maqsad: {formatNumber(user.targetAmount)} so&apos;m
                      </span>
                    ) : (
                      <input
                        type="number"
                        value={editTargetAmount}
                        onChange={(e) => setEditTargetAmount(e.target.value)}
                        className="w-36 px-2 py-1 rounded-xl bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 text-slate-800 dark:text-neutral-100 text-right focus:outline-none focus:border-cyan-500 dark:focus:border-cyan-800 text-xs shadow-inner"
                      />
                    )}
                  </div>
                </div>

                {/* Info Section */}
                <div className="space-y-2.5 mb-6">
                  <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50/50 dark:bg-neutral-900/40 border border-slate-200/50 dark:border-neutral-800/60">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-slate-400 dark:text-neutral-500" />
                      <span className="text-sm text-slate-500 dark:text-neutral-400 font-bold">Yoshingiz</span>
                    </div>
                    {!isEditing ? (
                      <span className="text-sm font-bold text-slate-800 dark:text-neutral-100">{user.age} yosh</span>
                    ) : (
                      <input
                        type="number"
                        value={editAge}
                        onChange={(e) => setEditAge(e.target.value)}
                        className="w-20 px-2.5 py-1 rounded-xl bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 text-slate-800 dark:text-neutral-100 text-right text-xs font-bold focus:outline-none focus:border-cyan-500 dark:focus:border-cyan-800 shadow-inner"
                      />
                    )}
                  </div>
                  <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50/50 dark:bg-neutral-900/40 border border-slate-200/50 dark:border-neutral-800/60">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-slate-400 dark:text-neutral-500" />
                      <span className="text-sm text-slate-500 dark:text-neutral-400 font-bold">Bajarilgan missiyalar</span>
                    </div>
                    <span className="text-sm font-bold text-slate-800 dark:text-neutral-100">
                      {user.questsCompleted} / {user.totalQuests} ta
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50/50 dark:bg-neutral-900/40 border border-slate-200/50 dark:border-neutral-800/60">
                    <div className="flex items-center gap-2">
                      <Wallet className="w-4 h-4 text-slate-400 dark:text-neutral-500" />
                      <span className="text-sm text-slate-500 dark:text-neutral-400 font-bold">Har oy tejash qobiliyati</span>
                    </div>
                    <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                      {formatNumber(user.savingsCapacity)} so&apos;m/oy
                    </span>
                  </div>
                </div>

                {/* Edit / Save Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={isEditing ? handleSave : () => setIsEditing(true)}
                  className={`w-full py-3.5 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 cursor-pointer transition-all shadow-sm ${
                    isEditing
                      ? "bg-gradient-to-r from-emerald-500 to-cyan-500 hover:opacity-90 text-white shadow-md"
                      : "bg-slate-100 dark:bg-neutral-800 border border-slate-200 dark:border-neutral-700 text-slate-600 dark:text-neutral-350 hover:bg-slate-200 dark:hover:bg-neutral-750 hover:text-slate-800 dark:hover:text-neutral-100"
                  }`}
                >
                  {isEditing ? (
                    <>
                      <Save className="w-4 h-4" />
                      O&apos;zgarishlarni saqlash
                    </>
                  ) : (
                    <>
                      <Edit3 className="w-4 h-4" />
                      Profilni tahrirlash
                    </>
                  )}
                </motion.button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
