"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import HeroDashboardCard from "@/components/HeroDashboardCard";
import SavingsGoalWidget from "@/components/SavingsGoalWidget";
import FinancesLedgerWidget from "@/components/FinancesLedgerWidget";
import DailyQuestsCard from "@/components/DailyQuestsCard";
import AIAdvisorCard from "@/components/AIAdvisorCard";
import AISituationCard from "@/components/AISituationCard";
import HelpFaqWidget from "@/components/HelpFaqWidget";
import SettingsWidget from "@/components/SettingsWidget";
import FloatingParticles from "@/components/FloatingParticles";
import OnboardingWizard from "@/components/OnboardingWizard";
import ProfileDrawer from "@/components/ProfileDrawer";
import SettingsDrawer from "@/components/SettingsDrawer";
import CoinShop from "@/components/CoinShop";
import { useUser } from "@/context/UserContext";
import { motion, AnimatePresence } from "framer-motion";
import { LayoutDashboard, Wallet, Sparkles, BookOpen, ShoppingBag } from "lucide-react";

type TabType = "home" | "finances" | "simulator" | "help" | "shop";

export default function Home() {
  const { user } = useUser();
  const [currentTab, setCurrentTab] = useState<TabType>("home");
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isShopOpen, setIsShopOpen] = useState(false);

  const sectionVariants = {
    hidden: { opacity: 0, y: 16, scale: 0.99 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.35, ease: [0.34, 1.56, 0.64, 1] }
    },
    exit: {
      opacity: 0,
      y: -16,
      scale: 0.99,
      transition: { duration: 0.25, ease: "easeIn" }
    }
  };

  const navItems = [
    { id: "home", label: "Bosh menyu", icon: <LayoutDashboard className="w-5 h-5" /> },
    { id: "finances", label: "Mablag'lar", icon: <Wallet className="w-5 h-5" /> },
    { id: "simulator", label: "AI Simulyator", icon: <Sparkles className="w-5 h-5" /> },
    { id: "help", label: "Yordam", icon: <BookOpen className="w-5 h-5" /> },
    { id: "shop", label: "Do'kon", icon: <ShoppingBag className="w-5 h-5" /> },
  ] as const;

  return (
    <>
      {/* Onboarding Wizard */}
      <AnimatePresence>
        {!user.hasOnboarded && <OnboardingWizard />}
      </AnimatePresence>

      <FloatingParticles />

      {/* Main Top Navbar */}
      <Navbar
        onOpenProfile={() => setIsProfileOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenShop={() => setIsShopOpen(true)}
      />

      <main className="relative z-10 pt-20 sm:pt-24 pb-28 md:pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col gap-6">
        
        {/* Desktop Segmented Tab Switcher (Visible only on medium screens and up) */}
        <div className="hidden md:flex justify-center mt-4">
          <div className="flex gap-2 p-1.5 bg-white/70 dark:bg-neutral-900/60 backdrop-blur-md rounded-2xl border border-black/5 dark:border-white/5 shadow-md">
            {navItems.map((item) => {
              const active = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentTab(item.id)}
                  className={`relative px-6 py-3 text-sm font-black rounded-xl transition-colors cursor-pointer flex items-center gap-2 z-10 ${
                    active ? "text-slate-900 dark:text-white" : "text-slate-500 dark:text-neutral-400 hover:text-slate-700"
                  }`}
                >
                  {active && (
                    <motion.div
                      layoutId="desktopTabIndicator"
                      className="absolute inset-0 bg-slate-100 dark:bg-neutral-800 rounded-xl border border-slate-200/50 dark:border-neutral-700 shadow-sm"
                      transition={{ type: "spring", stiffness: 380, damping: 28 }}
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-2">
                    {item.icon}
                    {item.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Contents with AnimatePresence */}
        <div className="w-full mt-2">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentTab}
              variants={sectionVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="w-full"
            >
              {currentTab === "home" && (
                <div className="space-y-6">
                  {/* welcome + main cards */}
                  <HeroDashboardCard />
                  {/* savings card */}
                  <SavingsGoalWidget />
                </div>
              )}

              {currentTab === "finances" && (
                /* ledger + category filtering */
                <FinancesLedgerWidget />
              )}

              {currentTab === "simulator" && (
                <div className="space-y-6">
                  {/* simulator */}
                  <AISituationCard />
                  {/* side by side widgets */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    <div className="lg:col-span-6">
                      <DailyQuestsCard />
                    </div>
                    <div className="lg:col-span-6">
                      <AIAdvisorCard />
                    </div>
                  </div>
                </div>
              )}

              {currentTab === "help" && (
                /* FAQs & tips */
                <HelpFaqWidget />
              )}

              {currentTab === "shop" && (
                /* coin shop in-page tab widget */
                <CoinShop isTab={true} />
              )}
            </motion.div>
          </AnimatePresence>
        </div>

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

      {/* Floating Premium Bottom Navigation Bar (Visible only on mobile/tablet viewports < md) */}
      <div className="fixed bottom-5 left-1/2 -translate-x-1/2 w-[92%] max-w-lg z-50 md:hidden block">
        <div className="flex justify-around items-center py-2 px-3 bg-white/75 dark:bg-[#0c0c14]/85 backdrop-blur-2xl border border-black/5 dark:border-white/5 rounded-3xl shadow-xl shadow-black/10">
          {navItems.map((item) => {
            const active = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentTab(item.id)}
                className="relative flex flex-col items-center justify-center py-1.5 px-3 rounded-xl transition-all cursor-pointer min-w-[62px]"
              >
                {active && (
                  <motion.div
                    layoutId="mobileTabIndicator"
                    className="absolute inset-0 bg-slate-100 dark:bg-neutral-800 rounded-2xl border border-slate-200/50 dark:border-neutral-700 z-0"
                    transition={{ type: "spring", stiffness: 350, damping: 25 }}
                  />
                )}
                <span className={`relative z-10 flex flex-col items-center gap-1 ${
                  active ? "text-slate-900 dark:text-white scale-105" : "text-slate-400 dark:text-neutral-500 hover:text-slate-600"
                } transition-transform`}>
                  {item.icon}
                  <span className="text-[9px] font-black tracking-tighter whitespace-nowrap">{item.label}</span>
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Quick Access Drawers (Opened from Navbar avatar, settings and shop buttons) */}
      <ProfileDrawer isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
      <SettingsDrawer isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
      <CoinShop isOpen={isShopOpen} onClose={() => setIsShopOpen(false)} />
    </>
  );
}
