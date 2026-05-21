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
import { useUser } from "@/context/UserContext";
import { motion, AnimatePresence } from "framer-motion";

export default function Home() {
  const { user } = useUser();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <>
      {/* Onboarding Wizard */}
      <AnimatePresence>
        {!user.hasOnboarded && <OnboardingWizard />}
      </AnimatePresence>

      <FloatingParticles />
      <Navbar
        onOpenProfile={() => setIsProfileOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      <main className="relative z-10 pt-24 sm:pt-28 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Section 1: Hero Dashboard */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <HeroDashboardCard />
        </motion.section>

        {/* Section 2: Goals & Transactions + Quests & AI Advisor */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8"
        >
          <div className="lg:col-span-7">
            <GoalProgressCard />
          </div>
          <div className="lg:col-span-5 flex flex-col gap-6">
            <DailyQuestsCard />
            <AIAdvisorCard />
          </div>
        </motion.section>

        {/* Section 3: AI Situation Simulator */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mb-8"
        >
          <AISituationCard />
        </motion.section>

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="text-center pt-8 pb-4 border-t border-slate-200 dark:border-neutral-800"
        >
          <p className="text-xs text-slate-500 dark:text-neutral-400 font-medium">
            © 2026 MoliyaGo — Yoshlar uchun moliyaviy savodxonlik platformasi
          </p>
          <p className="text-[10px] text-slate-400 dark:text-neutral-500 font-bold mt-1">
            O&apos;yin orqali o&apos;rganish 🎮
          </p>
        </motion.footer>
      </main>

      {/* Drawers moved globally to resolve CSS stacking context */}
      <ProfileDrawer
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
      />
      <SettingsDrawer
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </>
  );
}
