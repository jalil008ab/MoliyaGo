"use client";
 
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
 
interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
  type: "coin" | "cash" | "sparkle" | "glow";
}
 
export default function FloatingParticles() {
  const [particles, setParticles] = useState<Particle[]>([]);
 
  useEffect(() => {
    // Generate a rich blend of premium particles
    const generated = Array.from({ length: 24 }, (_, i) => {
      const types: ("coin" | "cash" | "sparkle" | "glow")[] = ["coin", "cash", "sparkle", "glow"];
      const type = types[i % types.length];
      
      let size = 12;
      if (type === "glow") {
        size = Math.random() * 120 + 120; // Large warm amber/gold glows
      } else if (type === "coin") {
        size = Math.random() * 6 + 14; // 14px to 20px
      } else if (type === "cash") {
        size = Math.random() * 6 + 16; // 16px to 22px
      } else {
        size = Math.random() * 4 + 10; // Sparkle size
      }
 
      return {
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 80 + 10, // Keep in elegant bounds
        size,
        duration: type === "glow" ? Math.random() * 15 + 20 : Math.random() * 12 + 10, // Drifts slowly
        delay: Math.random() * 5,
        type,
      };
    });
    setParticles(generated);
  }, []);
 
  if (particles.length === 0) return null;
 
  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden select-none">
      {particles.map((p) => {
        if (p.type === "glow") {
          return (
            <motion.div
              key={p.id}
              className="absolute rounded-full bg-gradient-to-br from-amber-500/5 to-emerald-500/5 dark:from-amber-500/3 dark:to-emerald-500/3 blur-[80px]"
              style={{
                left: `${p.x}%`,
                top: `${p.y}%`,
                width: p.size,
                height: p.size,
              }}
              animate={{
                y: [0, -30, 20, -10, 0],
                x: [0, 20, -20, 10, 0],
                scale: [1, 1.1, 0.95, 1.05, 1],
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
 
        let content = "";
        if (p.type === "coin") content = "🪙";
        else if (p.type === "cash") content = "💸";
        else content = "✨";
 
        return (
          <motion.div
            key={p.id}
            className="absolute flex items-center justify-center font-sans select-none pointer-events-none opacity-20 dark:opacity-10"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              fontSize: `${p.size}px`,
            }}
            animate={{
              y: [0, -140, -280],
              x: [0, Math.sin(p.id) * 15, Math.cos(p.id) * 20],
              opacity: [0, 0.28, 0.28, 0],
              rotate: [0, 180, 360],
              rotateY: p.type === "coin" ? [0, 360, 720] : 0,
            }}
            transition={{
              duration: p.duration,
              repeat: Infinity,
              delay: p.delay,
              ease: "linear",
            }}
          >
            {content}
          </motion.div>
        );
      })}
    </div>
  );
}
