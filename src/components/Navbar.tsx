"use client";

import { motion } from "framer-motion";
import { Bell, Settings, Zap, Sun, Moon, RotateCcw } from "lucide-react";
import { useState, useEffect } from "react";
import { useUser } from "@/context/UserContext";
import NotificationsDropdown from "./NotificationsDropdown";

function formatNumber(n: number): string {
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

interface NavbarProps {
  onOpenProfile: () => void;
  onOpenSettings: () => void;
}

export default function Navbar({ onOpenProfile, onOpenSettings }: NavbarProps) {
  const { user, resetData } = useUser();
  const [isScrolled, setIsScrolled] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");

  const unreadCount = user.notifications.filter((n) => !n.read).length;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);

    // Read theme preference
    const initialTheme = document.documentElement.className.includes("dark") ? "dark" : "light";
    setTheme(initialTheme);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "light" ? "dark" : "light";
    setTheme(nextTheme);
    document.documentElement.className = nextTheme;
    localStorage.setItem("theme", nextTheme);
  };

  const handleSystemReset = () => {
    const confirm = window.confirm(
      "Diqqat! Ushbu amal barcha kiritilgan tranzaksiyalar, jamg'armalar, missiyalar tarixi va profilingizni butunlay o'chirib yuboradi. Tizim 0 so'mdan qayta boshlanadi. Davom etasizmi?"
    );
    if (confirm) {
      resetData();
      window.location.reload();
    }
  };

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/80 dark:bg-black/80 backdrop-blur-xl border-b border-slate-200/50 dark:border-neutral-800 shadow-md shadow-slate-100/5 dark:shadow-none"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <motion.div
            className="flex items-center gap-2"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 border border-emerald-500/20 flex items-center justify-center">
              <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-500" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold gradient-text tracking-tight font-sans">
              MoliyaGo
            </h1>
          </motion.div>

          {/* Right side - User Info */}
          <div className="flex items-center gap-1.5 sm:gap-3">
            {/* System Clear Cache Button */}
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={handleSystemReset}
              className="hidden xl:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/15 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-black cursor-pointer shadow-sm transition-all"
              title="Tizimni tozalash va 0 so'mdan boshlash"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Tizimni tozalash (0 so'mdan boshlash)</span>
              <span className="md:hidden">Tozalash</span>
            </motion.button>

            {/* Theme Toggle Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 hover:border-emerald-300 dark:hover:border-emerald-700 transition-all cursor-pointer shadow-sm"
              title={theme === "light" ? "Tungi rejimga o'tish" : "Kunduzgi rejimga o'tish"}
            >
              {theme === "light" ? (
                <Moon className="w-5 h-5 text-slate-500 dark:text-neutral-400" />
              ) : (
                <Sun className="w-5 h-5 text-amber-500" />
              )}
            </motion.button>

            {/* Notification Bell */}
            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 rounded-xl bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 hover:border-emerald-300 dark:hover:border-emerald-700 transition-all cursor-pointer shadow-sm"
              >
                <Bell className="w-5 h-5 text-slate-500 dark:text-neutral-400" />
                {unreadCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full flex items-center justify-center text-[9px] font-bold text-white shadow-sm"
                  >
                    {unreadCount}
                  </motion.span>
                )}
              </motion.button>

              <NotificationsDropdown
                isOpen={showNotifications}
                onClose={() => setShowNotifications(false)}
              />
            </div>

            {/* Settings */}
            <motion.button
              whileHover={{ scale: 1.05, rotate: 45 }}
              whileTap={{ scale: 0.95 }}
              onClick={onOpenSettings}
              className="hidden sm:flex p-2 rounded-xl bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 hover:border-emerald-300 dark:hover:border-emerald-700 transition-all cursor-pointer shadow-sm"
            >
              <Settings className="w-5 h-5 text-slate-500 dark:text-neutral-400" />
            </motion.button>

            {/* Divider */}
            <div className="hidden sm:block w-px h-8 bg-slate-200 dark:bg-neutral-800" />

            {/* Level Badge */}
            <motion.div
              whileHover={{ scale: 1.03 }}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-pink-500/10 to-rose-500/10 dark:from-pink-500/20 dark:to-rose-500/20 border border-pink-500/20 dark:border-pink-500/30"
            >
              <span className="text-xs font-semibold text-pink-600 dark:text-pink-400">DARAJA</span>
              <motion.span
                key={user.level}
                initial={{ scale: 1.3 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="text-sm font-bold text-slate-800 dark:text-neutral-200"
              >
                {user.level}
              </motion.span>
            </motion.div>

            {/* Coins */}
            <motion.div
              whileHover={{ scale: 1.03 }}
              title="🪙 Tangalar — platformadagi yutuqlaringiz! Missiyalar bajarib va AI o'yinlarida to'g'ri qarorlar qabul qilib yig'asiz. Kelajakda yangi imkoniyatlar uchun ishlatiladi!"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 cursor-help"
            >
              <span className="text-base">🪙</span>
              <motion.span
                key={user.coins}
                initial={{ scale: 1.3 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="text-sm font-bold text-amber-600 dark:text-amber-400"
              >
                {formatNumber(user.coins)}
              </motion.span>
            </motion.div>

            {/* Avatar */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onOpenProfile}
              className="relative cursor-pointer"
            >
              <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full opacity-40 blur-[2px]" />
              <div className="relative w-9 h-9 rounded-full bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 border-2 border-emerald-500/30 flex items-center justify-center ring-2 ring-emerald-500/10">
                <span className="text-sm font-bold text-slate-800 dark:text-neutral-100">
                  {user.name ? user.name.charAt(0).toUpperCase() : "M"}
                </span>
              </div>
            </motion.button>
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
