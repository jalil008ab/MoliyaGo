"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useMemo } from "react";
import { useUser } from "@/context/UserContext";
import { X, Trophy, Medal, Crown, Zap, Star, Compass, ArrowUp, Sparkles } from "lucide-react";

interface LeaderboardUser {
  id: string;
  name: string;
  xp: number;
  level: number;
  activeFrame?: string;
  activeBadge?: string;
  isRealUser?: boolean;
}

interface LeaderboardWidgetProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LeaderboardWidget({ isOpen, onClose }: LeaderboardWidgetProps) {
  const { user } = useUser();

  // Initial mock global users
  const mockUsers: LeaderboardUser[] = [
    { id: "bot-1", name: "Madina Bahodirova", xp: 2650, level: 6, activeFrame: "frame-gold", activeBadge: "badge-tejamkor" },
    { id: "bot-2", name: "Jasur Komilov", xp: 2100, level: 5, activeFrame: "frame-fire", activeBadge: "badge-investor" },
    { id: "bot-3", name: "Shahzoda Aliyeva", xp: 1650, level: 4, activeFrame: "frame-diamond" },
    { id: "bot-4", name: "Temur Rustamov", xp: 1350, level: 3, activeBadge: "badge-tejamkor" },
    { id: "bot-5", name: "Lola Karimoova", xp: 950, level: 2 },
    { id: "bot-6", name: "Sardor Toshpulatov", xp: 750, level: 2 },
    { id: "bot-7", name: "Malika Solihova", xp: 450, level: 1 },
    { id: "bot-8", name: "Diyor Mansurov", xp: 250, level: 1 },
  ];

  // Dynamically insert real user and sort by XP
  const sortedLeaderboard = useMemo((): (LeaderboardUser & { rank: number })[] => {
    const realUser: LeaderboardUser = {
      id: "real-user",
      name: user.name || "Abdujalil",
      xp: user.xp,
      level: user.level,
      activeFrame: user.activeFrame,
      activeBadge: user.activeBadge,
      isRealUser: true,
    };

    const combined = [...mockUsers, realUser];
    const sorted = combined.sort((a, b) => b.xp - a.xp);
    
    return sorted.map((u, index) => ({
      ...u,
      rank: index + 1,
    }));
  }, [user.xp, user.level, user.name, user.activeFrame, user.activeBadge]);

  // Find real user rank
  const realUserRank = useMemo(() => {
    const found = sortedLeaderboard.find((u) => u.isRealUser);
    return found ? found.rank : 9;
  }, [sortedLeaderboard]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={onClose}
            style={{ zIndex: 150 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-md"
          />

          {/* Drawer / Modal Container */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 280, mass: 0.8 }}
            style={{ zIndex: 160 }}
            className="fixed top-0 right-0 bottom-0 w-full max-w-lg"
          >
            <div className="h-full flex flex-col bg-white/95 dark:bg-[#080810]/98 backdrop-blur-2xl border-l border-white/10 dark:border-white/5 shadow-2xl">
              
              {/* Header */}
              <div className="relative flex items-center justify-between p-6 border-b border-black/5 dark:border-white/5 z-10 flex-shrink-0">
                {/* Purple gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-transparent pointer-events-none" />
                
                <div className="flex items-center gap-3">
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    className="w-10 h-10 rounded-2xl flex items-center justify-center text-2xl shadow-md"
                    style={{ background: "linear-gradient(135deg, #7B5EA7, #A78BFA)" }}
                  >
                    🏆
                  </motion.div>
                  <div>
                    <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Global Reyting</h2>
                    <p className="text-xs text-slate-500 dark:text-neutral-400 font-medium">Sog'lom moliyaviy raqobat</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <motion.button
                    whileHover={{ scale: 1.08, rotate: 90 }}
                    whileTap={{ scale: 0.92 }}
                    transition={{ duration: 0.12 }}
                    onClick={onClose}
                    className="p-2 rounded-xl bg-slate-100 dark:bg-neutral-800 border border-slate-200 dark:border-neutral-700 text-slate-500 dark:text-neutral-400 hover:bg-slate-200 dark:hover:bg-neutral-700 cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </motion.button>
                </div>
              </div>

              {/* User stats banner */}
              <div className="mx-6 mt-4 p-4 rounded-2xl bg-gradient-to-r from-purple-500/10 to-indigo-500/10 border border-purple-500/20 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-purple-500/20 flex items-center justify-center border-2 border-purple-400 text-lg">
                    👑
                  </div>
                  <div>
                    <p className="text-xs text-purple-600 dark:text-purple-400 font-black uppercase tracking-wider">Sizning o'rningiz</p>
                    <p className="text-sm font-black text-slate-800 dark:text-neutral-100 mt-0.5">
                      Abdujalil • <span className="text-purple-600 dark:text-purple-400">{user.xp.toLocaleString()} XP</span>
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-black text-purple-600 dark:text-purple-450">#{realUserRank}</p>
                  <p className="text-[10px] text-slate-500 dark:text-neutral-400 font-bold uppercase tracking-wider">o'rinda</p>
                </div>
              </div>

              {/* Leaderboard list container */}
              <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
                <AnimatePresence mode="popLayout">
                  {sortedLeaderboard.map((item) => {
                    const isTopThree = item.rank <= 3;
                    const isReal = item.isRealUser;
                    
                    return (
                      <motion.div
                        key={item.id}
                        layout
                        initial={{ opacity: 0, y: 15, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.96 }}
                        transition={{ type: "spring", stiffness: 450, damping: 28 }}
                        className={`relative rounded-2xl border p-3.5 flex items-center justify-between transition-all ${
                          isReal
                            ? "bg-purple-500/10 dark:bg-purple-950/20 border-purple-400 dark:border-purple-800 shadow-md"
                            : "bg-white dark:bg-neutral-950/40 border-slate-100 dark:border-neutral-900 hover:border-slate-300 dark:hover:border-neutral-800"
                        }`}
                      >
                        {/* Shimmer on hover for real user */}
                        {isReal && (
                          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-transparent to-transparent pointer-events-none rounded-2xl" />
                        )}

                        <div className="flex items-center gap-3.5 min-w-0">
                          {/* Rank Badge */}
                          <div className="flex-shrink-0 w-8 flex items-center justify-center">
                            {item.rank === 1 ? (
                              <span className="text-2xl" title="1-o'rin 🥇">🥇</span>
                            ) : item.rank === 2 ? (
                              <span className="text-2xl" title="2-o'rin 🥈">🥈</span>
                            ) : item.rank === 3 ? (
                              <span className="text-2xl" title="3-o'rin 🥉">🥉</span>
                            ) : (
                              <span className="text-xs font-black text-slate-400 dark:text-neutral-500">
                                #{item.rank}
                              </span>
                            )}
                          </div>

                          {/* Avatar with frame */}
                          <div className="relative flex-shrink-0">
                            {item.activeFrame && item.activeFrame !== "default" && (
                              <div
                                className="absolute -inset-0.5 rounded-full opacity-70 blur-[1.5px]"
                                style={{
                                  background:
                                    item.activeFrame === "frame-gold"
                                      ? "linear-gradient(135deg, #F5A623, #FFD166)"
                                      : item.activeFrame === "frame-diamond"
                                      ? "linear-gradient(135deg, #a8edea, #fed6e3)"
                                      : "linear-gradient(135deg, #f83600, #f9d423)",
                                }}
                              />
                            )}
                            <div className="relative w-9 h-9 rounded-full bg-slate-100 dark:bg-neutral-800 border-2 border-white dark:border-neutral-900 flex items-center justify-center font-black text-slate-800 dark:text-neutral-200 text-xs">
                              {item.name.charAt(0).toUpperCase()}
                            </div>
                            
                            {/* Frame overlay symbol */}
                            {item.activeFrame && item.activeFrame !== "default" && (
                              <span className="absolute -top-1.5 -right-1 text-[9px]">
                                {item.activeFrame === "frame-gold" && "👑"}
                                {item.activeFrame === "frame-diamond" && "💎"}
                                {item.activeFrame === "frame-fire" && "🔥"}
                              </span>
                            )}
                          </div>

                          {/* Name + Badge */}
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <p className={`font-black text-xs sm:text-sm leading-snug truncate ${
                                isReal ? "text-purple-700 dark:text-purple-400" : "text-slate-900 dark:text-white"
                              }`}>
                                {item.name} {isReal && " (Siz)"}
                              </p>
                              {item.activeBadge && (
                                <span className="text-[10px] select-none" title={item.activeBadge}>
                                  {item.activeBadge === "badge-millioner" && "💰"}
                                  {item.activeBadge === "badge-tejamkor" && "🏦"}
                                  {item.activeBadge === "badge-investor" && "📈"}
                                </span>
                              )}
                            </div>
                            <p className="text-[10px] text-slate-400 dark:text-neutral-500 font-bold uppercase tracking-wider mt-0.5">
                              Level {item.level}
                            </p>
                          </div>
                        </div>

                        {/* XP value */}
                        <div className="flex-shrink-0 text-right">
                          <span className={`font-black text-sm ${
                            isReal ? "text-purple-600 dark:text-purple-400" : "text-slate-700 dark:text-neutral-300"
                          }`}>
                            {item.xp.toLocaleString()}
                          </span>
                          <span className="text-[9px] font-bold text-slate-400 dark:text-neutral-500 ml-1">XP</span>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>

              {/* Footer encouragement */}
              <div className="p-6 border-t border-black/5 dark:border-white/5 bg-slate-50/50 dark:bg-neutral-900/30 flex-shrink-0">
                <div className="flex items-center gap-2 mb-1.5">
                  <Sparkles className="w-4 h-4 text-purple-500" />
                  <span className="text-xs font-black text-slate-700 dark:text-neutral-200">Qanday qilib ko'tarilish mumkin?</span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-neutral-400 leading-relaxed font-semibold">
                  Slayd darslarni o'qing, kutilmagan moliyaviy vaziyatlarda to'g'ri qarorlar qabul qiling va jamg'armaga pul o'tkazing. Har bir muvaffaqiyatli harakat sizga ko'p miqdorda **XP** beradi va reytingda yuqoriga suradi! 🚀
                </p>
              </div>

            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
