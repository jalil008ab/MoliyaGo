"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { useUser } from "@/context/UserContext";
import {
  X,
  Settings,
  Trash2,
  RefreshCcw,
  AlertTriangle,
  Info,
  Shield,
  Palette,
  Volume2,
  Globe,
} from "lucide-react";

interface SettingsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SettingsDrawer({ isOpen, onClose }: SettingsDrawerProps) {
  const { resetData, user } = useUser();
  const [showConfirm, setShowConfirm] = useState(false);
  const [currentTheme, setCurrentTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const activeTheme = document.documentElement.className.includes("dark") ? "dark" : "light";
      setCurrentTheme(activeTheme);
    }
  }, [isOpen]);

  const handleReset = () => {
    resetData();
    setShowConfirm(false);
    onClose();
    if (typeof window !== "undefined") {
      window.location.reload();
    }
  };

  const settingsGroups = [
    {
      title: "Umumiy Sozlamalar",
      items: [
        {
          icon: <Globe className="w-5 h-5" />,
          label: "Ilova tili",
          value: "O'zbekcha",
          color: "text-cyan-600 dark:text-cyan-400",
          bgColor: "bg-cyan-50 dark:bg-cyan-950/30",
          borderColor: "border-cyan-100 dark:border-cyan-900/45",
        },
        {
          icon: <Palette className="w-5 h-5" />,
          label: "Tizim mavzusi",
          value: currentTheme === "dark" ? "Tungi Qora Mavzu" : "Kunduzgi Oq Mavzu",
          color: "text-pink-600 dark:text-pink-400",
          bgColor: "bg-pink-50 dark:bg-pink-950/30",
          borderColor: "border-pink-100 dark:border-pink-900/45",
        },
        {
          icon: <Volume2 className="w-5 h-5" />,
          label: "Ovozli effektlar",
          value: "Yoqilgan",
          color: "text-emerald-600 dark:text-emerald-400",
          bgColor: "bg-emerald-50 dark:bg-emerald-950/30",
          borderColor: "border-emerald-100 dark:border-emerald-900/45",
        },
      ],
    },
    {
      title: "Xavfsizlik & Tizim",
      items: [
        {
          icon: <Shield className="w-5 h-5" />,
          label: "Ma'lumotlar ombori",
          value: "Lokal saqlash (IndexedDB)",
          color: "text-amber-600 dark:text-amber-400",
          bgColor: "bg-amber-50 dark:bg-amber-950/30",
          borderColor: "border-amber-100 dark:border-amber-900/45",
        },
      ],
    },
  ];

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
              {/* Decorative Glow */}
              <div className="absolute top-0 left-0 w-full h-40 bg-gradient-to-b from-emerald-100/30 dark:from-emerald-950/10 to-transparent pointer-events-none" />

              <div className="relative p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6 border-b border-slate-100 dark:border-neutral-800 pb-4">
                  <div className="flex items-center gap-3">
                    <motion.div
                      animate={{ rotate: [0, 360] }}
                      transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                      className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/50 flex items-center justify-center"
                    >
                      <Settings className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    </motion.div>
                    <h2 className="text-xl font-bold text-slate-800 dark:text-neutral-100">Tizim Sozlamalari</h2>
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

                {/* User Info Card */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-neutral-900/80 border border-slate-200/70 dark:border-neutral-800 mb-6 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-50 to-cyan-50 dark:from-emerald-950/50 dark:to-cyan-950/50 border border-cyan-300 dark:border-cyan-800 flex items-center justify-center shadow-md">
                      <span className="text-lg font-black gradient-text">
                        {user.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="text-base font-bold text-slate-800 dark:text-neutral-100">{user.name}</p>
                      <p className="text-xs text-slate-500 dark:text-neutral-400 font-semibold">
                        Level {user.level} • {user.xp} XP • 🪙 {user.coins} tanga
                      </p>
                    </div>
                  </div>
                </div>

                {/* Settings Groups */}
                {settingsGroups.map((group) => (
                  <div key={group.title} className="mb-6">
                    <p className="text-xs font-bold text-slate-400 dark:text-neutral-500 uppercase tracking-widest mb-3 pl-1">
                      {group.title}
                    </p>
                    <div className="space-y-2.5">
                      {group.items.map((item) => (
                        <div
                          key={item.label}
                          className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50/50 dark:bg-neutral-900/40 border border-slate-200/50 dark:border-neutral-800/60 hover:border-slate-300/60 dark:hover:border-neutral-700 shadow-sm transition-all"
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-9 h-9 rounded-xl ${item.bgColor} border ${item.borderColor} flex items-center justify-center ${item.color} shadow-inner`}>
                              {item.icon}
                            </div>
                            <span className="text-sm font-bold text-slate-700 dark:text-neutral-200">
                              {item.label}
                            </span>
                          </div>
                          <span className="text-xs font-semibold text-slate-500 dark:text-neutral-400 px-3 py-1 rounded-xl bg-slate-100/80 dark:bg-neutral-800 border border-slate-200/40 dark:border-neutral-700/60 shadow-inner">
                            {item.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}

                {/* App Info */}
                <div className="p-4 rounded-2xl bg-slate-50/50 dark:bg-neutral-900/40 border border-slate-200/50 dark:border-neutral-800/60 mb-6 shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <Info className="w-4 h-4 text-slate-400 dark:text-neutral-500" />
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-neutral-400">
                      Ilova Haqida Bilim
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-neutral-400 leading-relaxed font-semibold">
                    MoliyaGo — yoshlarning moliyaviy barqarorligi va savodxonligini oshirish maqsadida yaratilgan o&apos;yinlashtirilgan veb-ilova (MVP). Barcha hisob-kitoblar va jarayonlar to&apos;liq lokal holda simulyatsiya qilinadi.
                  </p>
                </div>

                {/* Danger Zone */}
                <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/10 border border-rose-200/80 dark:border-rose-900/30 shadow-sm">
                  <div className="flex items-center gap-2 mb-3">
                    <AlertTriangle className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                    <span className="text-sm font-bold text-rose-700 dark:text-rose-400">
                      Xavfli Soha (Danger Zone)
                    </span>
                  </div>

                  <AnimatePresence mode="wait">
                    {!showConfirm ? (
                      <motion.button
                        key="reset-btn"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setShowConfirm(true)}
                        className="w-full py-3 rounded-2xl bg-rose-100/60 dark:bg-rose-950/20 border border-rose-300 dark:border-rose-900 text-rose-600 dark:text-rose-400 text-xs sm:text-sm font-bold flex items-center justify-center gap-2 hover:bg-rose-200 dark:hover:bg-rose-900/40 hover:text-rose-700 dark:hover:text-rose-300 transition-all cursor-pointer shadow-sm"
                      >
                        <Trash2 className="w-4 h-4" />
                        Barcha ma&apos;lumotlarni o&apos;chirish
                      </motion.button>
                    ) : (
                      <motion.div
                        key="confirm"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        className="space-y-2.5"
                      >
                        <p className="text-xs text-rose-800 dark:text-rose-300 font-semibold mb-2 leading-relaxed">
                          ⚠️ Barcha progresslar, bilim ballari (XP), yig&apos;ilgan tangalar, maqsadlar va tranzaksiyalar tarixi butunlay o&apos;chiriladi va tiklab bo&apos;lmaydi! Davom ettirilsinmi?
                        </p>
                        <div className="grid grid-cols-2 gap-2">
                          <motion.button
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setShowConfirm(false)}
                            className="py-2.5 rounded-2xl bg-slate-100 dark:bg-neutral-800 border border-slate-200 dark:border-neutral-700 text-slate-500 dark:text-neutral-400 hover:text-slate-800 dark:hover:text-neutral-100 hover:bg-slate-200 dark:hover:bg-neutral-700 text-xs font-bold cursor-pointer transition-all shadow-sm"
                          >
                            Bekor qilish
                          </motion.button>
                          <motion.button
                            whileTap={{ scale: 0.95 }}
                            onClick={handleReset}
                            className="py-2.5 rounded-2xl bg-rose-600 border border-rose-750 text-white text-xs font-bold cursor-pointer hover:bg-rose-700 transition-all flex items-center justify-center gap-1.5 shadow"
                          >
                            <RefreshCcw className="w-3.5 h-3.5" />
                            Ha, o&apos;chirilsin
                          </motion.button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
