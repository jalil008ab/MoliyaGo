"use client";

import { motion } from "framer-motion";
import { useEffect, useState, useMemo } from "react";

interface Particle {
  id: number;
  x: number;
  startY: number;
  size: number;
  duration: number;
  delay: number;
  type: "coin" | "cash" | "sparkle" | "glow" | "chart";
}

const PARTICLE_EMOJIS = {
  coin: ["🪙", "🪙", "💰"],
  cash: ["💵", "💸"],
  sparkle: ["✨", "⭐", "💫"],
  chart: ["📈", "📊"],
  glow: [],
};

export default function FloatingParticles() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const particles = useMemo((): Particle[] => {
    return Array.from({ length: 20 }, (_, i) => {
      const types: Particle["type"][] = ["coin", "coin", "cash", "sparkle", "glow", "chart"];
      return {
        id: i,
        x: Math.random() * 100,
        startY: 100 + Math.random() * 10,
        size: i % 5 === 0 ? Math.random() * 150 + 100 : Math.random() * 5 + 14,
        duration: i % 5 === 0 ? Math.random() * 20 + 25 : Math.random() * 10 + 12,
        delay: Math.random() * 8,
        type: types[i % types.length],
      };
    });
  }, []);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden select-none">
      {particles.map((p) => {
        if (p.type === "glow") {
          return (
            <motion.div
              key={p.id}
              className="absolute rounded-full"
              style={{
                left: `${p.x}%`,
                top: `${p.startY - 20}%`,
                width: p.size,
                height: p.size,
                background: p.id % 2 === 0
                  ? "radial-gradient(circle, rgba(245,166,35,0.06) 0%, transparent 70%)"
                  : "radial-gradient(circle, rgba(6,194,112,0.05) 0%, transparent 70%)",
                filter: "blur(30px)",
              }}
              animate={{
                y: [0, -30, 15, -10, 0],
                x: [0, 20, -15, 10, 0],
                scale: [1, 1.08, 0.96, 1.04, 1],
              }}
              transition={{
                duration: p.duration,
                repeat: Infinity,
                delay: p.delay,
                ease: "easeInOut",
              }}
            />
          );
        }

        const emojiArr = PARTICLE_EMOJIS[p.type];
        if (!emojiArr.length) return null;
        const emoji = emojiArr[p.id % emojiArr.length];

        return (
          <motion.div
            key={p.id}
            className="absolute select-none pointer-events-none"
            style={{
              left: `${p.x}%`,
              top: `${p.startY}%`,
              fontSize: `${p.size}px`,
              opacity: 0,
            }}
            animate={{
              y: [0, -120, -250, -350],
              x: [0, Math.sin(p.id * 1.5) * 20, Math.cos(p.id) * 15, Math.sin(p.id * 2) * 10],
              opacity: [0, 0.25, 0.25, 0.15, 0],
              rotate: p.type === "coin" ? [0, 20, -10, 15, 0] : [0, 5, -5, 0],
            }}
            transition={{
              duration: p.duration,
              repeat: Infinity,
              delay: p.delay,
              ease: "easeOut",
              times: [0, 0.1, 0.6, 0.85, 1],
            }}
          >
            {emoji}
          </motion.div>
        );
      })}
    </div>
  );
}
