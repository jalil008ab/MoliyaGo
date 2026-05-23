"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { useUser } from "@/context/UserContext";
import {
  Settings,
  Trash2,
  RefreshCcw,
  AlertTriangle,
  Info,
  Shield,
  Palette,
  Volume2,
  Globe,
  Save,
  Edit3
} from "lucide-react";

function formatNumber(n: number): string {
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export default function SettingsWidget() {
  const { resetData, user, updateProfile } = useUser();
  const [showConfirm, setShowConfirm] = useState(false);
  const [currentTheme, setCurrentTheme] = useState<"light" | "dark">("light");

  // Profile Edit State
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(user.name);
  const [editAge, setEditAge] = useState(user.age.toString());
  const [editGoalName, setEditGoalName] = useState(user.goalName);
  const [editTargetAmount, setEditTargetAmount] = useState(user.targetAmount.toString());

  useEffect(() => {
    if (typeof window !== "undefined") {
      const activeTheme = document.documentElement.className.includes("dark") ? "dark" : "light";
      setCurrentTheme(activeTheme);
    }
  }, []);

  const handleProfileSave = () => {
    updateProfile({
      name: editName.trim(),
      age: parseInt(editAge) || user.age,
      goalName: editGoalName.trim(),
      targetAmount: parseInt(editTargetAmount) || user.targetAmount,
    });
    setIsEditing(false);
  };

  const handleReset = () => {
    resetData();
    setShowConfirm(false);
    if (typeof window !== "undefined") {
      window.location.reload();
    }
  };

  const settingsGroups = [
    {
      title: "Umumiy Sozlamalar",
      items: [
        {
          icon: <Globe className="w-4 h-4" />,
          label: "Ilova tili",
          value: "O'zbekcha",
          color: "text-cyan-600 dark:text-cyan-400",
          bgColor: "bg-cyan-50 dark:bg-cyan-950/30",
          borderColor: "border-cyan-100 dark:border-cyan-900/40",
        },
        {
          icon: <Palette className="w-4 h-4" />,
          label: "Tizim mavzusi",
          value: currentTheme === "dark" ? "Tungi Qora Mavzu" : "Kunduzgi Oq Mavzu",
          color: "text-pink-600 dark:text-pink-400",
          bgColor: "bg-pink-50 dark:bg-pink-950/30",
          borderColor: "border-pink-100 dark:border-pink-900/40",
        },
        {
          icon: <Volume2 className="w-4 h-4" />,
          label: "Ovozli effektlar",
          value: "Yoqilgan",
          color: "text-emerald-600 dark:text-emerald-400",
          bgColor: "bg-emerald-50 dark:bg-emerald-950/30",
          borderColor: "border-emerald-100 dark:border-emerald-900/40",
        },
      ],
    },
    {
      title: "Xavfsizlik & Tizim",
      items: [
        {
          icon: <Shield className="w-4 h-4" />,
          label: "Ma'lumotlar ombori",
          value: "Lokal saqlash (IndexedDB)",
          color: "text-amber-600 dark:text-amber-400",
          bgColor: "bg-amber-50 dark:bg-amber-950/30",
          borderColor: "border-amber-100 dark:border-amber-900/40",
        },
      ],
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="max-w-3xl mx-auto w-full grid grid-cols-1 md:grid-cols-12 gap-6"
    >
      {/* Edit Profile Widget */}
      <div className="md:col-span-6 flex flex-col gap-6">
        <div className="glass-card p-6 sm:p-8">
          <div className="relative z-10 space-y-5">
            <div className="flex items-center gap-3 border-b border-black/5 dark:border-white/5 pb-4">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 dark:bg-cyan-500/20 flex items-center justify-center text-cyan-600 dark:text-cyan-400">
                <Edit3 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">Profil ma&apos;lumotlari</h3>
                <p className="text-xs text-slate-500 dark:text-neutral-400 font-semibold">Profil sozlamalarini o&apos;zgartirish</p>
              </div>
            </div>

            {/* Profile Fields */}
            <div className="space-y-4">
              {/* Name */}
              <div className="space-y-1.5">
                <label className="block text-xs font-black text-slate-400 dark:text-neutral-500 uppercase tracking-wider">Ismingiz</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-2xl bg-white dark:bg-neutral-950 border border-cyan-300 dark:border-cyan-800 text-slate-800 dark:text-neutral-100 text-sm font-bold shadow-sm"
                  />
                ) : (
                  <p className="text-sm font-bold text-slate-850 dark:text-neutral-250 px-4 py-2.5 rounded-2xl bg-slate-50/50 dark:bg-neutral-950/20 border border-slate-200/50 dark:border-neutral-800">{user.name}</p>
                )}
              </div>

              {/* Age */}
              <div className="space-y-1.5">
                <label className="block text-xs font-black text-slate-400 dark:text-neutral-500 uppercase tracking-wider">Yoshingiz</label>
                {isEditing ? (
                  <input
                    type="number"
                    value={editAge}
                    onChange={(e) => setEditAge(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-2xl bg-white dark:bg-neutral-950 border border-cyan-300 dark:border-cyan-800 text-slate-800 dark:text-neutral-100 text-sm font-bold shadow-sm"
                  />
                ) : (
                  <p className="text-sm font-bold text-slate-850 dark:text-neutral-250 px-4 py-2.5 rounded-2xl bg-slate-50/50 dark:bg-neutral-950/20 border border-slate-200/50 dark:border-neutral-800">{user.age} yosh</p>
                )}
              </div>

              {/* Goal name */}
              <div className="space-y-1.5">
                <label className="block text-xs font-black text-slate-400 dark:text-neutral-500 uppercase tracking-wider">Katta Maqsad Nomi</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editGoalName}
                    onChange={(e) => setEditGoalName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-2xl bg-white dark:bg-neutral-950 border border-cyan-300 dark:border-cyan-800 text-slate-800 dark:text-neutral-100 text-sm font-bold shadow-sm"
                  />
                ) : (
                  <p className="text-sm font-bold text-slate-850 dark:text-neutral-250 px-4 py-2.5 rounded-2xl bg-slate-50/50 dark:bg-neutral-950/20 border border-slate-200/50 dark:border-neutral-800">{user.goalEmoji} {user.goalName}</p>
                )}
              </div>

              {/* Goal target amount */}
              <div className="space-y-1.5">
                <label className="block text-xs font-black text-slate-400 dark:text-neutral-500 uppercase tracking-wider">Maqsad summasi (so&apos;m)</label>
                {isEditing ? (
                  <input
                    type="number"
                    value={editTargetAmount}
                    onChange={(e) => setEditTargetAmount(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-2xl bg-white dark:bg-neutral-950 border border-cyan-300 dark:border-cyan-800 text-slate-800 dark:text-neutral-100 text-sm font-bold shadow-sm"
                  />
                ) : (
                  <p className="text-sm font-bold text-slate-850 dark:text-neutral-250 px-4 py-2.5 rounded-2xl bg-slate-50/50 dark:bg-neutral-950/20 border border-slate-200/50 dark:border-neutral-800">{formatNumber(user.targetAmount)} UZS</p>
                )}
              </div>
            </div>

            {/* Profile Action button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={isEditing ? handleProfileSave : () => setIsEditing(true)}
              className={`w-full py-3.5 rounded-2xl font-black text-xs flex items-center justify-center gap-2 cursor-pointer transition-all shadow-sm ${
                isEditing
                  ? "bg-gradient-to-r from-emerald-500 to-cyan-500 hover:opacity-90 text-white"
                  : "bg-slate-100 dark:bg-neutral-800 border border-slate-250 dark:border-neutral-700 text-slate-600 dark:text-neutral-350 hover:bg-slate-200"
              }`}
            >
              {isEditing ? (
                <>
                  <Save className="w-4 h-4" /> Saqlash
                </>
              ) : (
                <>
                  <Edit3 className="w-4 h-4" /> Tahrirlash
                </>
              )}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Preferences & Reset */}
      <div className="md:col-span-6 flex flex-col gap-6">
        {/* System parameters */}
        <div className="glass-card p-6 sm:p-8">
          <div className="relative z-10 space-y-5">
            <div className="flex items-center gap-3 border-b border-black/5 dark:border-white/5 pb-4">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 dark:bg-indigo-500/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                <Settings className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">Tizim Sozlamalari</h3>
                <p className="text-xs text-slate-500 dark:text-neutral-400 font-semibold">Tizim holati va konfiguratsiyasi</p>
              </div>
            </div>

            <div className="space-y-4">
              {settingsGroups.map((group) => (
                <div key={group.title} className="space-y-2">
                  <p className="text-[10px] font-black text-slate-400 dark:text-neutral-500 uppercase tracking-widest pl-1">{group.title}</p>
                  <div className="space-y-2">
                    {group.items.map((item) => (
                      <div
                        key={item.label}
                        className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50/50 dark:bg-neutral-950/20 border border-slate-200/50 dark:border-neutral-850 shadow-sm"
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-xl ${item.bgColor} border ${item.borderColor} flex items-center justify-center ${item.color} shadow-inner`}>
                            {item.icon}
                          </div>
                          <span className="text-xs font-bold text-slate-700 dark:text-neutral-200">{item.label}</span>
                        </div>
                        <span className="text-[11px] font-bold text-slate-500 dark:text-neutral-400 bg-white/70 dark:bg-neutral-850 px-2.5 py-1 rounded-xl border border-slate-200/50 dark:border-neutral-800">
                          {item.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Danger zone / Reset Data */}
        <div className="glass-card p-5 border-rose-200/40 dark:border-rose-900/30">
          <div className="relative z-10 space-y-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-500" />
              <span className="text-xs font-black uppercase text-rose-700 dark:text-rose-400 tracking-wider">Xavfli Hudud</span>
            </div>

            <AnimatePresence mode="wait">
              {!showConfirm ? (
                <motion.button
                  key="reset-btn"
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => setShowConfirm(true)}
                  className="w-full py-3 rounded-xl bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/50 text-rose-600 dark:text-rose-400 text-xs font-black flex items-center justify-center gap-1.5 hover:bg-rose-100 cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                  Barcha ma&apos;lumotlarni tozalash
                </motion.button>
              ) : (
                <motion.div
                  key="confirm-layout"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-3"
                >
                  <p className="text-xs text-rose-800 dark:text-rose-350 font-bold leading-relaxed">
                    ⚠️ Barcha erishilgan bilim ballari (XP), yig&apos;ilgan tangalar, maqsadlar va tranzaksiyalar tarixi qaytarib bo&apos;lmaydigan qilib butunlay o&apos;chiriladi. Rozimisiz?
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setShowConfirm(false)}
                      className="py-2 rounded-xl bg-slate-100 dark:bg-neutral-800 border border-slate-250 dark:border-neutral-700 text-slate-500 dark:text-neutral-450 text-xs font-black cursor-pointer"
                    >
                      Yo&apos;q, bekor qilish
                    </button>
                    <button
                      onClick={handleReset}
                      className="py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-black cursor-pointer shadow flex items-center justify-center gap-1"
                    >
                      <RefreshCcw className="w-3.5 h-3.5" />
                      Ha, o&apos;chirilsin
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
