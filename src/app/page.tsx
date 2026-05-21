"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import HeroDashboardCard from "@/components/HeroDashboardCard";
import GoalProgressCard from "@/components/GoalProgressCard";
import DailyQuestsCard from "@/components/DailyQuestsCard";
import AIAdvisorCard from "@/components/AIAdvisorCard";
import AISituationCard from "@/components/AISituationCard";
import FloatingParticles from "@/components/FloatingParticles";
import OnboardingWizard from "@/components/OnboardingWizard";
import ProfileDrawer from "@/components/ProfileDrawer";
import SettingsDrawer from "@/components/SettingsDrawer";
import CoinShop from "@/components/CoinShop";
import { useUser } from "@/context/UserContext";
import { motion, AnimatePresence } from "framer-motion";

export default function Home() {
  const { user } = useUser();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isShopOpen, setIsShopOpen] = useState(false);

  const sectionVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: (delay: number) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.3, delay, ease: [0.34, 1.56, 0.64, 1] }
    })
  };

  return (
    <>
      {/* Onboarding */}
      <AnimatePresence>
        {!user.hasOnboarded && <OnboardingWizard />}
      </AnimatePresence>

      <FloatingParticles />

      <Navbar
        onOpenProfile={() => setIsProfileOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenShop={() => setIsShopOpen(true)}
      />

      <main className="relative z-10 pt-24 sm:pt-28 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Hero Dashboard */}
        <motion.section
          variants={sectionVariants}
          initial="hidden"
          animate="visible"
          custom={0}
          className="mb-6"
        >
          <HeroDashboardCard />
        </motion.section>

        {/* Goals + Quests + AI */}
        <motion.section
          variants={sectionVariants}
          initial="hidden"
          animate="visible"
          custom={0.1}
          className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6"
        >
          <div className="lg:col-span-7">
            <GoalProgressCard />
          </div>
          <div className="lg:col-span-5 flex flex-col gap-6">
            <DailyQuestsCard />
            <AIAdvisorCard />
          </div>
        </motion.section>

        {/* AI Situation Simulator */}
        <motion.section
          variants={sectionVariants}
          initial="hidden"
          animate="visible"
          custom={0.2}
          className="mb-6"
        >
          <AISituationCard />
        </motion.section>

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center pt-8 pb-4"
        >
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-amber-500/20 to-transparent" />
            <span className="text-amber-500 text-lg">🪙</span>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-amber-500/20 to-transparent" />
          </div>
          <p className="text-xs text-slate-500 dark:text-neutral-400 font-medium">
            © 2026 MoliyaGo — Yoshlar uchun moliyaviy savodxonlik platformasi
          </p>
          <p className="text-[10px] text-slate-400 dark:text-neutral-500 font-bold mt-1">
            O&apos;yin orqali o&apos;rganing · Pul tejang · Maqsadga erishing 🚀
          </p>
        </motion.footer>
      </main>

      {/* Drawers */}
      <ProfileDrawer isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
      <SettingsDrawer isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
      <CoinShop isOpen={isShopOpen} onClose={() => setIsShopOpen(false)} />
    </>
  );
}
