"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useMemo } from "react";
import { useUser } from "@/context/UserContext";
import { X, Trophy, Medal, Crown, Zap, Star, Compass, ArrowUp, Sparkles, RefreshCw, AlertCircle } from "lucide-react";

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
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLeaderboard = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("https://kvdb.io/3hSshHGWKuwzg7oBsubLDp/?prefix=user_&values=true");
      if (!res.ok) throw new Error("Yuklab olishda xatolik yuz berdi");
      
      const text = await res.text();
      const lines = text.split("\n").filter(line => line.trim() !== "");
      
      const parsedUsers: LeaderboardUser[] = lines.map(line => {
        const parts = line.split("=");
        if (parts.length < 2) return null;
        const val = parts.slice(1).join("=");
        try {
          const parsed = JSON.parse(val);
          if (parsed && !parsed.deleted && parsed.name) {
            return {
              id: parsed.id || parsed.name,
              name: parsed.name,
              xp: parsed.xp || 0,
              level: parsed.level || 1,
              activeFrame: parsed.activeFrame,
              activeBadge: parsed.activeBadge
            };
          }
          return null;
        } catch (e) {
          return null;
        }
      }).filter(u => u !== null) as LeaderboardUser[];

      // Deduplicate by name, keeping highest XP
      const uniqueUsersMap: { [key: string]: LeaderboardUser } = {};
      parsedUsers.forEach(u => {
        const lowerName = u.name.toLowerCase();
        if (!uniqueUsersMap[lowerName] || uniqueUsersMap[lowerName].xp < u.xp) {
          uniqueUsersMap[lowerName] = u;
        }
      });

      const finalUsersList = Object.values(uniqueUsersMap);
      setLeaderboard(finalUsersList);
    } catch (err: any) {
      setError("Internet aloqasini tekshiring va qayta urinib ko'ring.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchLeaderboard();
    }
  }, [isOpen]);

  // Dynamically insert active user and sort by XP
  const sortedLeaderboard = useMemo((): (LeaderboardUser & { rank: number })[] => {
    const activeName = user.name || "Abdujalil";
    let list = [...leaderboard];
    
    const userIndex = list.findIndex(
      (u) => u.name.toLowerCase() === activeName.toLowerCase()
    );

    const realUserObj: LeaderboardUser = {
      id: "real-user",
      name: activeName,
      xp: user.xp,
      level: user.level,
      activeFrame: user.activeFrame,
      activeBadge: user.activeBadge,
      isRealUser: true,
    };

    if (userIndex > -1) {
      const dbUser = list[userIndex];
      // Update with local state if local has more XP or to sync identity
      if (user.xp > dbUser.xp) {
        list[userIndex] = {
          ...dbUser,
          xp: user.xp,
          level: user.level,
          activeFrame: user.activeFrame,
          activeBadge: user.activeBadge,
          isRealUser: true,
        };
      } else {
        list[userIndex] = {
          ...dbUser,
          isRealUser: true,
        };
      }
    } else {
      list.push(realUserObj);
    }

    const sorted = list.sort((a, b) => b.xp - a.xp);
    
    return sorted.map((u, index) => ({
      ...u,
      rank: index + 1,
    }));
  }, [leaderboard, user.xp, user.level, user.name, user.activeFrame, user.activeBadge]);

  // Find real user rank
  const realUserRank = useMemo(() => {
    const found = sortedLeaderboard.find((u) => u.isRealUser);
    return found ? found.rank : 1;
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
            <div className="h-full flex flex-col bg-white/95 dark:bg-[#06060c]/98 backdrop-blur-2xl border-l border-white/10 dark:border-white/5 shadow-2xl overflow-hidden">
              
              {/* Header */}
              <div className="relative flex items-center justify-between p-6 border-b border-black/5 dark:border-white/5 z-10 flex-shrink-0">
                {/* Purple gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-transparent pointer-events-none" />
                
                <div className="flex items-center gap-3">
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    className="w-10 h-10 rounded-2xl flex items-center justify-center text-2xl shadow-lg shadow-purple-500/20"
                    style={{ background: "linear-gradient(135deg, #7B5EA7, #A78BFA)" }}
                  >
                    🏆
                  </motion.div>
                  <div>
                    <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Reyting</h2>
                    <p className="text-xs text-slate-500 dark:text-neutral-400 font-medium">Sog'lom moliyaviy raqobat</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={fetchLeaderboard}
                    disabled={isLoading}
                    className="p-2 rounded-xl bg-slate-100 dark:bg-neutral-800 border border-slate-200 dark:border-neutral-700 text-slate-500 dark:text-neutral-400 hover:bg-slate-200 dark:hover:bg-neutral-700 cursor-pointer disabled:opacity-50"
                    title="Yangilash"
                  >
                    <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
                  </motion.button>
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
              <div className="mx-6 mt-4 p-4 rounded-2xl bg-gradient-to-r from-purple-500/15 via-indigo-500/10 to-transparent border border-purple-500/30 flex items-center justify-between shadow-md relative overflow-hidden">
                <div className="absolute -right-8 -top-8 w-24 h-24 rounded-full bg-purple-500/10 blur-2xl" />
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-purple-500/20 flex items-center justify-center border border-purple-400/40 text-xl shadow-inner shadow-purple-500/20">
                    👑
                  </div>
                  <div>
                    <p className="text-[10px] text-purple-600 dark:text-purple-400 font-black uppercase tracking-wider">Sizning o'rningiz</p>
                    <p className="text-sm font-black text-slate-800 dark:text-neutral-100 mt-0.5">
                      {user.name || "Abdujalil"} • <span className="text-purple-600 dark:text-purple-400">{user.xp.toLocaleString()} XP</span>
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-400 drop-shadow-sm">#{realUserRank}</p>
                  <p className="text-[9px] text-slate-500 dark:text-neutral-400 font-bold uppercase tracking-wider">o'rinda</p>
                </div>
              </div>

              {/* Leaderboard list container */}
              <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
                {isLoading ? (
                  /* Premium Skeleton Loading States */
                  <div className="space-y-3">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div
                        key={i}
                        className="animate-pulse bg-slate-50/50 dark:bg-white/5 border border-slate-100 dark:border-white/5 rounded-2xl p-4 flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3 w-2/3">
                          <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-neutral-800" />
                          <div className="space-y-2 flex-1">
                            <div className="h-3 bg-slate-200 dark:bg-neutral-800 rounded w-3/4" />
                            <div className="h-2.5 bg-slate-100 dark:bg-neutral-900 rounded w-1/3" />
                          </div>
                        </div>
                        <div className="h-4 bg-slate-200 dark:bg-neutral-800 rounded w-12" />
                      </div>
                    ))}
                  </div>
                ) : error ? (
                  <div className="h-64 flex flex-col items-center justify-center text-center p-6 space-y-3">
                    <AlertCircle className="w-10 h-10 text-rose-500" />
                    <p className="text-sm font-semibold text-slate-600 dark:text-neutral-400 max-w-xs">{error}</p>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={fetchLeaderboard}
                      className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-black shadow-md cursor-pointer"
                    >
                      Qayta urinish
                    </motion.button>
                  </div>
                ) : sortedLeaderboard.length === 0 ? (
                  <div className="h-64 flex flex-col items-center justify-center text-center p-6 space-y-2">
                    <Trophy className="w-10 h-10 text-amber-500 opacity-40" />
                    <p className="text-sm font-semibold text-slate-500 dark:text-neutral-400">Hozircha reyting bo'sh.</p>
                  </div>
                ) : (
                  <AnimatePresence mode="popLayout">
                    {sortedLeaderboard.map((item) => {
                      const isFirst = item.rank === 1;
                      const isSecond = item.rank === 2;
                      const isThird = item.rank === 3;
                      const isReal = item.isRealUser;
                      
                      let cardStyle = "bg-white/5 dark:bg-neutral-900/30 border-slate-100 dark:border-neutral-900/60 hover:border-purple-500/20 dark:hover:border-purple-500/20 hover:bg-slate-50/50 dark:hover:bg-neutral-850/40 hover:shadow-lg hover:shadow-purple-500/5";
                      let rankBadge = <span className="text-xs font-black text-slate-400 dark:text-neutral-500">#{item.rank}</span>;
                      let rankGlow = "";

                      if (isFirst) {
                        cardStyle = "bg-gradient-to-r from-amber-500/20 via-yellow-500/10 to-transparent border-amber-400/80 shadow-[0_0_20px_rgba(245,166,35,0.15)] dark:shadow-[0_0_25px_rgba(245,166,35,0.12)]";
                        rankBadge = <span className="text-2xl" title="1-o'rin 🥇">🥇</span>;
                        rankGlow = "absolute -inset-px bg-gradient-to-r from-amber-500/10 to-transparent rounded-2xl blur-sm opacity-50 pointer-events-none";
                      } else if (isSecond) {
                        cardStyle = "bg-gradient-to-r from-slate-400/20 via-zinc-400/10 to-transparent border-slate-350/70 shadow-[0_0_15px_rgba(148,163,184,0.12)]";
                        rankBadge = <span className="text-2xl" title="2-o'rin 🥈">🥈</span>;
                        rankGlow = "absolute -inset-px bg-gradient-to-r from-slate-400/10 to-transparent rounded-2xl blur-sm opacity-40 pointer-events-none";
                      } else if (isThird) {
                        cardStyle = "bg-gradient-to-r from-orange-500/15 via-amber-700/10 to-transparent border-orange-500/50 shadow-[0_0_12px_rgba(249,115,22,0.1)]";
                        rankBadge = <span className="text-2xl" title="3-o'rin 🥉">🥉</span>;
                        rankGlow = "absolute -inset-px bg-gradient-to-r from-orange-500/8 to-transparent rounded-2xl blur-sm opacity-35 pointer-events-none";
                      }

                      // Overwrite if it's the real active user
                      if (isReal) {
                        cardStyle = "bg-gradient-to-r from-purple-500/25 via-indigo-500/15 to-purple-500/5 border-purple-500 shadow-[0_0_25px_rgba(167,139,250,0.2)] dark:shadow-[0_0_30px_rgba(167,139,250,0.15)]";
                        rankGlow = "absolute -inset-px bg-gradient-to-r from-purple-500/20 to-indigo-500/10 rounded-2xl blur-sm opacity-60 pointer-events-none";
                      }

                      return (
                        <motion.div
                          key={item.id || `${item.name}-${item.xp}`}
                          layout
                          initial={{ opacity: 0, y: 15, scale: 0.97 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.97 }}
                          transition={{ type: "spring", stiffness: 450, damping: 28 }}
                          className={`relative rounded-2xl border p-4 flex items-center justify-between transition-all duration-200 overflow-hidden ${cardStyle}`}
                        >
                          {rankGlow && <div className={rankGlow} />}

                          <div className="flex items-center gap-3.5 min-w-0 relative z-10">
                            {/* Rank Badge */}
                            <div className="flex-shrink-0 w-8 flex items-center justify-center">
                              {rankBadge}
                            </div>

                            {/* Avatar with frame */}
                            <div className="relative flex-shrink-0">
                              {item.activeFrame && item.activeFrame !== "default" && (
                                <div
                                  className="absolute -inset-0.5 rounded-full opacity-80 blur-[2px]"
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
                              <div className={`relative w-10 h-10 rounded-full border-2 flex items-center justify-center font-black text-xs ${
                                isReal 
                                  ? "bg-purple-100 dark:bg-purple-950/80 border-purple-400 dark:border-purple-800 text-purple-800 dark:text-purple-200" 
                                  : "bg-slate-100 dark:bg-neutral-800 border-white dark:border-neutral-900 text-slate-800 dark:text-neutral-200"
                              }`}>
                                {item.name.charAt(0).toUpperCase()}
                              </div>
                              
                              {/* Frame overlay symbol */}
                              {item.activeFrame && item.activeFrame !== "default" && (
                                <span className="absolute -top-1.5 -right-1 text-[10px]">
                                  {item.activeFrame === "frame-gold" && "👑"}
                                  {item.activeFrame === "frame-diamond" && "💎"}
                                  {item.activeFrame === "frame-fire" && "🔥"}
                                </span>
                              )}
                            </div>

                            {/* Name + Badge */}
                            <div className="min-w-0">
                              <div className="flex items-center gap-1.5">
                                <p className={`font-black text-sm leading-snug truncate ${
                                  isReal ? "text-purple-700 dark:text-purple-300" : "text-slate-900 dark:text-white"
                                }`}>
                                  {item.name} {isReal && " (Siz)"}
                                </p>
                                {item.activeBadge && (
                                  <span className="text-[11px] select-none" title={item.activeBadge}>
                                    {item.activeBadge === "badge-millioner" && "💰"}
                                    {item.activeBadge === "badge-tejamkor" && "🏦"}
                                    {item.activeBadge === "badge-investor" && "📈"}
                                  </span>
                                )}
                              </div>
                              <p className="text-[9px] text-slate-400 dark:text-neutral-500 font-extrabold uppercase tracking-widest mt-0.5">
                                Level {item.level}
                              </p>
                            </div>
                          </div>

                          {/* XP value */}
                          <div className="flex-shrink-0 text-right relative z-10">
                            <span className={`font-black text-sm ${
                              isReal ? "text-purple-600 dark:text-purple-400 text-base" : "text-slate-700 dark:text-neutral-300"
                            }`}>
                              {item.xp.toLocaleString()}
                            </span>
                            <span className="text-[10px] font-bold text-slate-400 dark:text-neutral-500 ml-1">XP</span>
                          </div>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                )}
              </div>

              {/* Footer encouragement */}
              <div className="p-6 border-t border-black/5 dark:border-white/5 bg-slate-50/50 dark:bg-neutral-950/20 flex-shrink-0 relative">
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
