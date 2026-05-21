"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Bell, Settings, Zap, Sun, Moon, ShoppingBag, TrendingUp } from "lucide-react";
import { useState, useEffect } from "react";
import { useUser } from "@/context/UserContext";
import NotificationsDropdown from "./NotificationsDropdown";

function formatNumber(n: number): string {
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

interface NavbarProps {
  onOpenProfile: () => void;
  onOpenSettings: () => void;
  onOpenShop: () => void;
}

export default function Navbar({ onOpenProfile, onOpenSettings, onOpenShop }: NavbarProps) {
  const { user } = useUser();
  const [isScrolled, setIsScrolled] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [prevCoins, setPrevCoins] = useState(user.coins);
  const [coinBounce, setCoinBounce] = useState(false);

  const unreadCount = user.notifications.filter((n) => !n.read).length;

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    const initialTheme = document.documentElement.className.includes("dark") ? "dark" : "light";
    setTheme(initialTheme);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Coin bounce animation on change
  useEffect(() => {
    if (user.coins !== prevCoins) {
      setCoinBounce(true);
      setPrevCoins(user.coins);
      setTimeout(() => setCoinBounce(false), 600);
    }
  }, [user.coins, prevCoins]);

  const toggleTheme = () => {
    const nextTheme = theme === "light" ? "dark" : "light";
    setTheme(nextTheme);
    document.documentElement.className = nextTheme;
    localStorage.setItem("theme", nextTheme);
  };

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
        isScrolled
          ? "bg-white/80 dark:bg-[#080810]/90 backdrop-blur-2xl border-b border-black/5 dark:border-white/5 shadow-lg shadow-black/5"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-3 xs:px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo */}
          <motion.div
            className="flex items-center gap-2.5 cursor-pointer"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            transition={{ duration: 0.1 }}
          >
            <div className="relative">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl flex items-center justify-center shadow-lg"
                style={{ background: "linear-gradient(135deg, #F5A623, #FFD166, #C47D0E)" }}
              >
                <Zap className="w-5 h-5 text-white drop-shadow" fill="white" />
              </motion.div>
              {/* Glow effect */}
              <div className="absolute inset-0 rounded-2xl blur-lg opacity-40"
                style={{ background: "linear-gradient(135deg, #F5A623, #FFD166)" }} />
            </div>
            <div>
              <h1 className="text-base xs:text-lg sm:text-2xl font-black tracking-tight" style={{
                background: "linear-gradient(135deg, #F5A623 0%, #C47D0E 50%, #06C270 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}>
                MoliyaGo
              </h1>
              <p className="text-[9px] text-slate-400 dark:text-neutral-500 font-bold tracking-widest uppercase hidden sm:block -mt-0.5">
                Finance · Gamified
              </p>
            </div>
          </motion.div>

          {/* Right side */}
          <div className="flex items-center gap-0.5 xs:gap-1.5 sm:gap-2">
            
            {/* XP / Level pill — desktop only */}
            <motion.div
              whileHover={{ scale: 1.03 }}
              transition={{ duration: 0.1 }}
              className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-purple-50 dark:bg-purple-950/20 border border-purple-100 dark:border-purple-900/40"
            >
              <TrendingUp className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
              <div className="flex flex-col gap-0.5">
                <span className="text-[9px] text-purple-500 font-bold uppercase tracking-wide">LVL {user.level}</span>
                <div className="w-16 h-1 bg-purple-100 dark:bg-purple-900/30 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: "linear-gradient(90deg, #7B5EA7, #A78BFA)" }}
                    initial={{ width: 0 }}
                    animate={{ width: `${((user.xp % 500) / 500) * 100}%` }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                  />
                </div>
              </div>
            </motion.div>

            {/* 🛍️ Shop Button */}
            <motion.button
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.94 }}
              transition={{ duration: 0.1 }}
              onClick={onOpenShop}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl cursor-pointer transition-all border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/20 hover:bg-amber-100 dark:hover:bg-amber-950/40 hover:shadow-lg hover:shadow-amber-500/10"
              title="Tanga do'koni"
            >
              <ShoppingBag className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <span className="hidden sm:inline text-xs font-black text-amber-700 dark:text-amber-400">Do'kon</span>
            </motion.button>

            {/* Theme Toggle */}
            <motion.button
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.94 }}
              transition={{ duration: 0.1 }}
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 hover:border-slate-300 dark:hover:border-neutral-700 transition-all cursor-pointer"
              title={theme === "light" ? "Tungi rejim" : "Kunduzgi rejim"}
            >
              <AnimatePresence mode="wait">
                {theme === "light" ? (
                  <motion.div
                    key="moon"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    <Moon className="w-4 h-4 text-slate-500" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="sun"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    <Sun className="w-4 h-4 text-amber-400" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>

            {/* Notification Bell */}
            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.94 }}
                transition={{ duration: 0.1 }}
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 rounded-xl bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 hover:border-slate-300 dark:hover:border-neutral-700 transition-all cursor-pointer"
              >
                <motion.div
                  animate={unreadCount > 0 ? { rotate: [0, -15, 15, -10, 10, 0] } : {}}
                  transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 3 }}
                >
                  <Bell className="w-4 h-4 text-slate-500 dark:text-neutral-400" />
                </motion.div>
                <AnimatePresence>
                  {unreadCount > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      transition={{ type: "spring", stiffness: 500, damping: 20 }}
                      className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-rose-500 to-pink-500 rounded-full flex items-center justify-center text-[9px] font-black text-white shadow"
                    >
                      {unreadCount}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
              <NotificationsDropdown isOpen={showNotifications} onClose={() => setShowNotifications(false)} />
            </div>

            {/* Settings */}
            <motion.button
              whileHover={{ scale: 1.06, rotate: 90 }}
              whileTap={{ scale: 0.94 }}
              transition={{ duration: 0.15 }}
              onClick={onOpenSettings}
              className="hidden sm:flex p-2 rounded-xl bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 hover:border-slate-300 dark:hover:border-neutral-700 transition-all cursor-pointer"
            >
              <Settings className="w-4 h-4 text-slate-500 dark:text-neutral-400" />
            </motion.button>

            {/* Coins display */}
            <motion.div
              whileHover={{ scale: 1.03 }}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 cursor-default"
              title="Sizning tangalaringiz"
            >
              <motion.span
                animate={coinBounce ? { rotate: [0, 360], scale: [1, 1.3, 1] } : {}}
                transition={{ duration: 0.4 }}
                className="text-base"
              >
                🪙
              </motion.span>
              <motion.span
                key={user.coins}
                initial={{ scale: 1.3, color: "#F5A623" }}
                animate={{ scale: 1, color: "inherit" }}
                transition={{ duration: 0.25 }}
                className="text-sm font-black text-amber-700 dark:text-amber-400"
              >
                {formatNumber(user.coins)}
              </motion.span>
            </motion.div>

            {/* Divider */}
            <div className="hidden sm:block w-px h-6 bg-slate-200 dark:bg-neutral-800 mx-0.5" />

            {/* Avatar */}
            <motion.button
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.94 }}
              transition={{ duration: 0.1 }}
              onClick={onOpenProfile}
              className="relative cursor-pointer"
            >
              {/* Glow ring */}
              <div className="absolute -inset-1 rounded-full opacity-60 blur-[3px]"
                style={{ background: "linear-gradient(135deg, #F5A623, #06C270, #F5A623)" }} />
              <div className="relative w-9 h-9 rounded-full flex items-center justify-center border-2 border-white dark:border-neutral-900 shadow-md"
                style={{ background: "linear-gradient(135deg, rgba(245,166,35,0.2), rgba(6,194,112,0.2))" }}
              >
                <span className="text-sm font-black text-slate-800 dark:text-neutral-100">
                  {user.name ? user.name.charAt(0).toUpperCase() : "M"}
                </span>
              </div>
              {/* Online indicator */}
              <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-white dark:border-neutral-900 shadow" />
            </motion.button>
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
