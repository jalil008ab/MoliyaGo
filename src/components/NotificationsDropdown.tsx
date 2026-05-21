"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useUser } from "@/context/UserContext";
import {
  X,
  Bell,
  CheckCheck,
  Gift,
  AlertTriangle,
  Info,
  Trophy,
} from "lucide-react";
import { useEffect, useRef } from "react";

interface NotificationsDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

const typeIcons = {
  success: <Trophy className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />,
  warning: <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400" />,
  info: <Info className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />,
  reward: <Gift className="w-4 h-4 text-pink-600 dark:text-pink-400" />,
};

const typeBgColors = {
  success: "bg-emerald-500/10 border-emerald-500/20 dark:border-emerald-500/30",
  warning: "bg-amber-500/10 border-amber-500/20 dark:border-amber-500/30",
  info: "bg-cyan-500/10 border-cyan-500/20 dark:border-cyan-500/30",
  reward: "bg-pink-500/10 border-pink-500/20 dark:border-pink-500/30",
};

export default function NotificationsDropdown({
  isOpen,
  onClose,
}: NotificationsDropdownProps) {
  const { user, markNotificationRead, markAllNotificationsRead } = useUser();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const unreadCount = user.notifications.filter((n) => !n.read).length;

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={dropdownRef}
          initial={{ opacity: 0, y: -10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.95 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="absolute top-full right-0 mt-2 w-[340px] sm:w-[380px] z-[80]"
        >
          <div className="glass-card rounded-2xl border border-slate-200/80 dark:border-neutral-800 overflow-hidden shadow-2xl bg-white dark:bg-neutral-900">
            {/* Header */}
            <div className="p-4 border-b border-slate-100 dark:border-neutral-800 bg-gradient-to-r from-cyan-500/5 to-transparent">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                  <h3 className="text-sm font-bold text-slate-800 dark:text-white">Bildirishnomalar</h3>
                  {unreadCount > 0 && (
                    <span className="px-2 py-0.5 rounded-full bg-pink-500/20 border border-pink-500/30 text-[10px] font-bold text-pink-600 dark:text-pink-400">
                      {unreadCount}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {unreadCount > 0 && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={markAllNotificationsRead}
                      className="p-1.5 rounded-lg bg-slate-100 dark:bg-neutral-800 text-slate-500 dark:text-neutral-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-all cursor-pointer"
                      title="Hammasini o'qilgan deb belgilash"
                    >
                      <CheckCheck className="w-3.5 h-3.5" />
                    </motion.button>
                  )}
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={onClose}
                    className="p-1.5 rounded-lg bg-slate-100 dark:bg-neutral-800 text-slate-500 dark:text-neutral-400 hover:text-slate-850 dark:hover:text-white transition-all cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </motion.button>
                </div>
              </div>
            </div>

            {/* Notifications list */}
            <div className="max-h-[350px] overflow-y-auto divide-y divide-slate-100 dark:divide-neutral-800">
              {user.notifications.length > 0 ? (
                user.notifications.map((notification, i) => (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    onClick={() => markNotificationRead(notification.id)}
                    className={`p-3.5 cursor-pointer transition-all hover:bg-slate-50 dark:hover:bg-neutral-800/40 ${
                      !notification.read ? "bg-slate-50/50 dark:bg-neutral-850/20" : ""
                    }`}
                  >
                    <div className="flex gap-3">
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 border ${typeBgColors[notification.type]}`}
                      >
                        {typeIcons[notification.type]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p className={`text-sm font-bold leading-tight ${
                            !notification.read ? "text-slate-800 dark:text-white" : "text-slate-400 dark:text-neutral-400"
                          }`}>
                            {notification.title}
                          </p>
                          {!notification.read && (
                            <div className="w-2 h-2 rounded-full bg-pink-500 flex-shrink-0 mt-1.5 animate-pulse" />
                          )}
                        </div>
                        <p className="text-xs text-slate-500 dark:text-neutral-400 mt-0.5 line-clamp-2 leading-relaxed">
                          {notification.message}
                        </p>
                        <p className="text-[10px] text-slate-400 dark:text-neutral-500 mt-1 font-semibold">
                          {notification.time}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="p-8 text-center">
                  <Bell className="w-8 h-8 text-slate-300 dark:text-neutral-700 mx-auto mb-2" />
                  <p className="text-sm text-slate-400 dark:text-neutral-500 font-semibold">
                    Hozircha bildirishnomalar yo&apos;q
                  </p>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
