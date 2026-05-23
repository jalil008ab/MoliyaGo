"use client";

import { motion, useMotionValue, useTransform, animate, useSpring } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import { useUser } from "@/context/UserContext";
import LeaderboardWidget from "./LeaderboardWidget";
import { Trophy } from "lucide-react";

function formatNumber(n: number): string {
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function calculateLevel(xp: number): number {
  return Math.floor(xp / 500) + 1;
}

// Fast animated counter
function AnimatedCounter({ target, duration = 0.6 }: { target: number; duration?: number }) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => formatNumber(Math.round(latest)));
  const [displayValue, setDisplayValue] = useState("0");

  useEffect(() => {
    const controls = animate(count, target, { duration, ease: "easeOut" });
    const unsubscribe = rounded.on("change", (v) => setDisplayValue(v));
    return () => { controls.stop(); unsubscribe(); };
  }, [target, duration, count, rounded]);

  return <span>{displayValue}</span>;
}

// Mini sparkline chart
function Sparkline({ data, color }: { data: number[]; color: string }) {
  if (data.length < 2) return null;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const w = 80, h = 30;
  const points = data.map((v, i) => [
    (i / (data.length - 1)) * w,
    h - ((v - min) / range) * (h - 4) - 2,
  ]);
  const path = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p[0]} ${p[1]}`).join(" ");

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="overflow-visible">
      <defs>
        <linearGradient id={`grad-${color}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.4" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      {/* Fill area */}
      <path
        d={`${path} L ${w} ${h} L 0 ${h} Z`}
        fill={`url(#grad-${color})`}
      />
      {/* Line */}
      <motion.path
        d={path}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      />
      {/* Last dot */}
      <circle cx={points[points.length - 1][0]} cy={points[points.length - 1][1]} r="2.5" fill={color} />
    </svg>
  );
}

// Individual metric card
interface MetricCardProps {
  delay: number;
  accentColor: string;
  glowColor: string;
  label: string;
  sublabel: string;
  value: React.ReactNode;
  unit: string;
  icon: string;
  footer: React.ReactNode;
  sparkData: number[];
  sparkColor: string;
  index: number;
}

function MetricCard({ delay, accentColor, glowColor, label, sublabel, value, unit, icon, footer, sparkData, sparkColor, index }: MetricCardProps) {
  const [hovered, setHovered] = useState(false);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay, type: "spring", stiffness: 380, damping: 28 }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      className="relative rounded-2xl overflow-hidden cursor-default"
      style={{
        background: "var(--gradient-card)",
        border: `1px solid ${hovered ? glowColor + "60" : "var(--border-light)"}`,
        boxShadow: hovered ? `0 16px 48px ${glowColor}20, 0 4px 12px ${glowColor}10` : "var(--shadow-sm)",
        transform: hovered ? "translateY(-6px) scale(1.01)" : "translateY(0px) scale(1)",
        transition: "all 0.18s cubic-bezier(0.34, 1.56, 0.64, 1)",
      }}
    >
      {/* Subtle gradient overlay */}
      <div
        className="absolute inset-0 opacity-30 pointer-events-none"
        style={{ background: `radial-gradient(circle at top right, ${glowColor}15, transparent 70%)` }}
      />

      {/* Content */}
      <div className="relative p-5">
        {/* Top row: label + icon */}
        <div className="flex items-start justify-between mb-3">
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: accentColor + "aa" }}>
                {label}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-neutral-500 font-medium">{sublabel}</p>
          </div>
          <motion.div
            animate={hovered ? { rotate: [0, -10, 10, 0], scale: [1, 1.15, 1] } : {}}
            transition={{ duration: 0.3 }}
            className="text-2xl"
          >
            {icon}
          </motion.div>
        </div>

        {/* Value */}
        <div className="flex items-baseline gap-1.5 mb-3">
          <span className="text-3xl font-black" style={{ color: accentColor }}>
            {value}
          </span>
          <span className="text-xs font-bold" style={{ color: accentColor + "80" }}>
            {unit}
          </span>
        </div>

        {/* Sparkline */}
        <div className="mb-3 opacity-70">
          <Sparkline data={sparkData} color={sparkColor} />
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-black/5 dark:border-white/5">
          {footer}
        </div>
      </div>
    </motion.div>
  );
}

export default function HeroDashboardCard() {
  const { user } = useUser();
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);

  useEffect(() => { setIsVisible(true); }, []);

  const progress = user.targetAmount > 0
    ? Math.min(100, Math.round((user.savedAmount / user.targetAmount) * 100))
    : 0;

  const xpInLevel = user.xp % 500;
  const xpProgress = (xpInLevel / 500) * 100;
  const questProgress = Math.min(100, (user.questsCompleted / (user.totalQuests || 1)) * 100);

  // Generate mock sparkline data from real data or random seeds
  const balanceSparkData = [0, user.balance * 0.3, user.balance * 0.6, user.balance * 0.45, user.balance * 0.8, user.balance];
  const savingsSparkData = [0, user.savedAmount * 0.2, user.savedAmount * 0.5, user.savedAmount * 0.7, user.savedAmount * 0.9, user.savedAmount];
  const xpSparkData = [50, 100, 150, 200, 350, 500, user.xp % 500 || 10];
  const questSparkData = [0, 2, 5, user.questsCompleted * 0.5, user.questsCompleted * 0.8, user.questsCompleted];

  const getTimeOfDay = () => {
    const h = new Date().getHours();
    if (h < 12) return { greeting: "Xayrli tong", emoji: "🌅" };
    if (h < 18) return { greeting: "Xayrli kun", emoji: "☀️" };
    return { greeting: "Xayrli kech", emoji: "🌙" };
  };
  const { greeting, emoji } = getTimeOfDay();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="relative"
    >
      {/* Main Hero Card */}
      <div
        className="relative rounded-3xl overflow-hidden p-6 sm:p-8 lg:p-10"
        style={{
          background: "var(--bg-card)",
          backdropFilter: "blur(24px) saturate(180%)",
          WebkitBackdropFilter: "blur(24px) saturate(180%)",
          border: "1px solid var(--border-light)",
          boxShadow: "var(--shadow-card)",
        }}
      >
        {/* Premium mesh gradient background */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div
            className="absolute -top-20 -right-20 w-80 h-80 rounded-full opacity-20"
            style={{ background: "radial-gradient(circle, #F5A623, transparent 70%)", filter: "blur(40px)" }}
          />
          <div
            className="absolute -bottom-20 -left-10 w-60 h-60 rounded-full opacity-15"
            style={{ background: "radial-gradient(circle, #06C270, transparent 70%)", filter: "blur(40px)" }}
          />
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-32 opacity-10"
            style={{ background: "radial-gradient(ellipse, #7B5EA7, transparent 70%)", filter: "blur(30px)" }}
          />
        </div>

        <div className="relative z-10">
          {/* Top Row */}
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
            {/* Greeting */}
            <div>
              <motion.p
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1, duration: 0.3 }}
                className="text-sm font-medium text-slate-500 dark:text-neutral-400 mb-1 flex items-center gap-1.5"
              >
                {emoji} {greeting}
              </motion.p>
              <motion.h2
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15, duration: 0.3 }}
                className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-slate-900 dark:text-white"
              >
                Salom,{" "}
                <span style={{
                  background: "linear-gradient(135deg, #F5A623 0%, #06C270 60%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}>
                  {user.name || "Do'stim"}!
                </span>{" "}
                👋
              </motion.h2>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-sm text-slate-500 dark:text-neutral-400 mt-1 font-medium"
              >
                Moliyaviy erkinlikka qadam qadam yaqinlashmoqdasiz 🚀
              </motion.p>
            </div>

            {/* Streak + Level badges */}
            <div className="flex items-center gap-3 flex-shrink-0">
              {/* Streak */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.25, type: "spring", stiffness: 400, damping: 20 }}
                whileHover={{ scale: 1.05 }}
                className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl border"
                style={{
                  background: "linear-gradient(135deg, rgba(249,115,22,0.08), rgba(239,68,68,0.05))",
                  borderColor: "rgba(249,115,22,0.2)",
                }}
              >
                <motion.span
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                  className="text-2xl"
                >
                  🔥
                </motion.span>
                <div>
                  <p className="text-[10px] text-orange-500 font-black uppercase tracking-wider">Streak</p>
                  <p className="text-lg font-black text-orange-600 dark:text-orange-400 leading-none">{user.streak} kun</p>
                </div>
              </motion.div>

              {/* Level badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, type: "spring", stiffness: 400, damping: 20 }}
                whileHover={{ scale: 1.05 }}
                className="flex flex-col items-center px-4 py-2.5 rounded-2xl border"
                style={{
                  background: "linear-gradient(135deg, rgba(123,94,167,0.1), rgba(167,139,250,0.05))",
                  borderColor: "rgba(123,94,167,0.25)",
                }}
              >
                <Crown className="w-4 h-4 text-purple-500 mb-0.5" />
                <p className="text-lg font-black text-purple-600 dark:text-purple-400 leading-none">{user.level}</p>
                <p className="text-[9px] text-purple-500 font-black uppercase tracking-wider">Daraja</p>
              </motion.div>

              {/* Leaderboard Button */}
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.35, type: "spring", stiffness: 400, damping: 20 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsLeaderboardOpen(true)}
                className="flex flex-col items-center px-4 py-2.5 rounded-2xl border cursor-pointer transition-all shadow-sm"
                style={{
                  background: "linear-gradient(135deg, rgba(245,166,35,0.08), rgba(167,139,250,0.05))",
                  borderColor: "rgba(245,166,35,0.25)",
                }}
              >
                <Trophy className="w-4 h-4 text-amber-500 mb-0.5 animate-pulse" />
                <p className="text-lg font-black text-amber-600 dark:text-amber-450 leading-none">Reyting</p>
                <p className="text-[9px] text-amber-500 font-black uppercase tracking-wider">Jadval</p>
              </motion.button>
            </div>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Card 1: Balance */}
            <MetricCard
              delay={0.2}
              accentColor="#06C270"
              glowColor="#06C270"
              label="Hamyon"
              sublabel="Kundalik pul oqimi"
              value={isVisible && <AnimatedCounter target={user.balance} />}
              unit="so'm"
              icon="💵"
              sparkData={balanceSparkData}
              sparkColor="#06C270"
              index={0}
              footer={
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse inline-block" />
                    Erkin pul oqimi
                  </span>
                  <span className="text-[10px] text-slate-400 font-bold">Mavjud ✓</span>
                </div>
              }
            />

            {/* Card 2: Savings */}
            <MetricCard
              delay={0.25}
              accentColor="#00D4FF"
              glowColor="#00D4FF"
              label="Jamg'arma"
              sublabel={user.goalName ? `Maqsad: ${user.goalName}` : "Maqsad belgilanmagan"}
              value={isVisible && <AnimatedCounter target={user.savedAmount} duration={0.8} />}
              unit="so'm"
              icon="🏦"
              sparkData={savingsSparkData}
              sparkColor="#00D4FF"
              index={1}
              footer={
                <div className="space-y-1.5">
                  <div className="flex justify-between text-[10px] font-bold">
                    <span className="text-cyan-500">🎯 Maqsad sari</span>
                    <span className="text-cyan-600 dark:text-cyan-400">{progress}%</span>
                  </div>
                  <div className="h-1.5 bg-black/5 dark:bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.6, ease: "easeOut" }}
                      className="h-full rounded-full"
                      style={{ background: "linear-gradient(90deg, #00D4FF, #06C270)" }}
                    />
                  </div>
                </div>
              }
            />

            {/* Card 3: XP */}
            <MetricCard
              delay={0.3}
              accentColor="#A78BFA"
              glowColor="#7B5EA7"
              label="Tajriba (XP)"
              sublabel={`Level ${calculateLevel(user.xp)} → ${calculateLevel(user.xp) + 1}`}
              value={isVisible && <AnimatedCounter target={user.xp} duration={0.7} />}
              unit="XP"
              icon="⚡"
              sparkData={xpSparkData}
              sparkColor="#A78BFA"
              index={2}
              footer={
                <div className="space-y-1.5">
                  <div className="flex justify-between text-[10px] font-bold">
                    <span className="text-purple-500">🌟 Level {calculateLevel(user.xp)}</span>
                    <span className="text-purple-600 dark:text-purple-400">{xpInLevel}/500 XP</span>
                  </div>
                  <div className="h-1.5 bg-black/5 dark:bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${xpProgress}%` }}
                      transition={{ duration: 0.6, ease: "easeOut" }}
                      className="h-full rounded-full"
                      style={{ background: "linear-gradient(90deg, #7B5EA7, #A78BFA)" }}
                    />
                  </div>
                </div>
              }
            />

            {/* Card 4: Quests */}
            <MetricCard
              delay={0.35}
              accentColor="#FBBF24"
              glowColor="#F5A623"
              label="Missiyalar"
              sublabel="Kunlik topshiriqlar"
              value={isVisible && <AnimatedCounter target={user.questsCompleted} duration={0.5} />}
              unit={`/ ${user.totalQuests}`}
              icon="🏆"
              sparkData={questSparkData}
              sparkColor="#FBBF24"
              index={3}
              footer={
                <div className="space-y-1.5">
                  <div className="flex justify-between text-[10px] font-bold">
                    <span className="text-amber-500">🏆 Bajarilish</span>
                    <span className="text-amber-600 dark:text-amber-400">{Math.round(questProgress)}%</span>
                  </div>
                  <div className="h-1.5 bg-black/5 dark:bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${questProgress}%` }}
                      transition={{ duration: 0.6, ease: "easeOut" }}
                      className="h-full rounded-full"
                      style={{ background: "linear-gradient(90deg, #F5A623, #FFD166)" }}
                    />
                  </div>
                </div>
              }
            />
          </div>
        </div>
      </div>
      
      {/* Global Leaderboard Modal/Drawer */}
      <LeaderboardWidget isOpen={isLeaderboardOpen} onClose={() => setIsLeaderboardOpen(false)} />
    </motion.div>
  );
}

// Missing import fix
function Crown(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M2 20h20M5 20l2-8 5 4 5-4 2 8" />
      <circle cx="12" cy="6" r="2" />
      <circle cx="4" cy="10" r="1.5" />
      <circle cx="20" cy="10" r="1.5" />
    </svg>
  );
}
