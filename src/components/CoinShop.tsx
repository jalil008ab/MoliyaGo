"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useUser } from "@/context/UserContext";
import { X, ShoppingBag, Check, Lock, Zap, Star, Crown, Palette, Car, Image, Badge } from "lucide-react";

// ===== SHOP DATA =====
interface ShopItem {
  id: string;
  name: string;
  description: string;
  cost: number;
  category: "theme" | "frame" | "badge" | "scene";
  emoji: string;
  preview: string; // gradient or color preview
  rarity: "common" | "rare" | "epic" | "legendary";
}

const SHOP_ITEMS: ShopItem[] = [
  // === THEMES ===
  {
    id: "theme-gold-rush",
    name: "Gold Rush",
    description: "Oltin sariq premium mavzu. Millionerlar uslubi!",
    cost: 500,
    category: "theme",
    emoji: "🏆",
    preview: "linear-gradient(135deg, #F5A623, #FFD166, #C47D0E)",
    rarity: "epic",
  },
  {
    id: "theme-midnight",
    name: "Midnight Finance",
    description: "Chuqur to'q binafsha tungi mavzu. Sirli va chiroyli.",
    cost: 400,
    category: "theme",
    emoji: "🌙",
    preview: "linear-gradient(135deg, #1a1a2e, #16213e, #7B5EA7)",
    rarity: "rare",
  },
  {
    id: "theme-emerald",
    name: "Emerald Tycoon",
    description: "Yashil boylik mavzusi. Tabiat va pul uyg'unligi.",
    cost: 350,
    category: "theme",
    emoji: "💎",
    preview: "linear-gradient(135deg, #06C270, #00D4FF, #059669)",
    rarity: "rare",
  },
  {
    id: "theme-cosmic",
    name: "Cosmic Billionaire",
    description: "Galaktika uslubi. Koinot boyliklarini his qiling!",
    cost: 800,
    category: "theme",
    emoji: "🚀",
    preview: "linear-gradient(135deg, #0f0c29, #302b63, #24243e)",
    rarity: "legendary",
  },

  // === FRAMES ===
  {
    id: "frame-gold",
    name: "Oltin Ramka",
    description: "Profilingiz atrofida porlab turadigan oltin halqa.",
    cost: 200,
    category: "frame",
    emoji: "⭕",
    preview: "linear-gradient(135deg, #F5A623, #FFD166)",
    rarity: "common",
  },
  {
    id: "frame-diamond",
    name: "Brilliant Ramka",
    description: "Brilliantli noyob ramka. Elitalar uchun.",
    cost: 600,
    category: "frame",
    emoji: "💠",
    preview: "linear-gradient(135deg, #a8edea, #fed6e3, #a8edea)",
    rarity: "legendary",
  },
  {
    id: "frame-fire",
    name: "Olov Ramka",
    description: "Animatsiyali olov effekti bilan bezalgan ramka.",
    cost: 300,
    category: "frame",
    emoji: "🔥",
    preview: "linear-gradient(135deg, #f83600, #f9d423)",
    rarity: "rare",
  },

  // === BADGES ===
  {
    id: "badge-millioner",
    name: "Millioner 💰",
    description: "Eng nufuzli unvon. Faqat eng harakat qilganlar uchun.",
    cost: 1000,
    category: "badge",
    emoji: "💰",
    preview: "linear-gradient(135deg, #F5A623, #FFD166)",
    rarity: "legendary",
  },
  {
    id: "badge-tejamkor",
    name: "Tejamkor 🏦",
    description: "Pul tejashda ustamon ekanligingizni ko'rsating.",
    cost: 250,
    category: "badge",
    emoji: "🏦",
    preview: "linear-gradient(135deg, #06C270, #00D4FF)",
    rarity: "common",
  },
  {
    id: "badge-investor",
    name: "Investor 📈",
    description: "Aqlli investitsiyalar qiluvchi sifatida taniling.",
    cost: 500,
    category: "badge",
    emoji: "📈",
    preview: "linear-gradient(135deg, #667eea, #764ba2)",
    rarity: "epic",
  },

  // === SCENES / BACKGROUNDS ===
  {
    id: "scene-vault",
    name: "Bank Xazinasi",
    description: "Animatsiyali bank xazinasi foni. Boylik his qiling.",
    cost: 400,
    category: "scene",
    emoji: "🏛️",
    preview: "linear-gradient(135deg, #bdc3c7, #2c3e50)",
    rarity: "rare",
  },
  {
    id: "scene-monaco",
    name: "Monaco Luxe",
    description: "Monaco shahrining hashamatli foni. Ultra-premium.",
    cost: 600,
    category: "scene",
    emoji: "🏎️",
    preview: "linear-gradient(135deg, #0f2027, #203a43, #2c5364)",
    rarity: "legendary",
  },
  {
    id: "scene-market",
    name: "Birja Zali",
    description: "Fond birjasi animatsiyasi bilan jonli fon.",
    cost: 350,
    category: "scene",
    emoji: "📊",
    preview: "linear-gradient(135deg, #1a1a2e, #16213e, #0f3460)",
    rarity: "rare",
  },
];

const RARITY_CONFIG = {
  common: { label: "Oddiy", color: "text-slate-500", bg: "bg-slate-100 dark:bg-slate-800", border: "border-slate-200 dark:border-slate-700" },
  rare: { label: "Noyob", color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-50 dark:bg-blue-950/30", border: "border-blue-200 dark:border-blue-800" },
  epic: { label: "Epik", color: "text-purple-600 dark:text-purple-400", bg: "bg-purple-50 dark:bg-purple-950/30", border: "border-purple-200 dark:border-purple-800" },
  legendary: { label: "Afsonaviy ✨", color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-50 dark:bg-amber-950/30", border: "border-amber-200 dark:border-amber-800" },
};

const CATEGORY_ICONS = {
  theme: <Palette className="w-4 h-4" />,
  frame: <Star className="w-4 h-4" />,
  badge: <Badge className="w-4 h-4" />,
  scene: <Image className="w-4 h-4" />,
};

const CATEGORY_LABELS = {
  theme: "Mavzular",
  frame: "Ramkalar",
  badge: "Nishonlar",
  scene: "Fonlar",
};

interface CoinShopProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CoinShop({ isOpen, onClose }: CoinShopProps) {
  const { user, purchaseItem, activateItem } = useUser();
  const [activeCategory, setActiveCategory] = useState<"all" | ShopItem["category"]>("all");
  const [purchaseConfirm, setPurchaseConfirm] = useState<string | null>(null);
  const [justBought, setJustBought] = useState<string | null>(null);

  const categories = ["all", "theme", "frame", "badge", "scene"] as const;

  const filteredItems = activeCategory === "all"
    ? SHOP_ITEMS
    : SHOP_ITEMS.filter(item => item.category === activeCategory);

  const handlePurchase = (item: ShopItem) => {
    if (user.purchasedItems.includes(item.id)) {
      activateItem(item.id, item.category);
      return;
    }
    if (purchaseConfirm === item.id) {
      const success = purchaseItem(item.id, item.cost, item.category);
      if (success) {
        setJustBought(item.id);
        setTimeout(() => setJustBought(null), 2000);
      }
      setPurchaseConfirm(null);
    } else {
      setPurchaseConfirm(item.id);
      setTimeout(() => setPurchaseConfirm(null), 3000);
    }
  };

  const getActiveItem = (category: ShopItem["category"]) => {
    if (category === "theme") return user.activeTheme;
    if (category === "frame") return user.activeFrame;
    if (category === "badge") return user.activeBadge;
    if (category === "scene") return user.activeScene;
    return "";
  };

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
            className="fixed inset-0 bg-black/50 backdrop-blur-md"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 280, mass: 0.8 }}
            style={{ zIndex: 160 }}
            className="fixed top-0 right-0 bottom-0 w-full max-w-lg"
          >
            <div className="h-full flex flex-col bg-white/95 dark:bg-[#0c0c14]/98 backdrop-blur-2xl border-l border-white/20 dark:border-white/5 shadow-2xl">
              
              {/* Header */}
              <div className="relative flex items-center justify-between p-6 border-b border-black/5 dark:border-white/5 z-10 flex-shrink-0">
                {/* Gold shimmer background in header */}
                <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 to-transparent pointer-events-none" />
                
                <div className="flex items-center gap-3">
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    className="w-10 h-10 rounded-2xl flex items-center justify-center text-2xl"
                    style={{ background: "linear-gradient(135deg, #F5A623, #FFD166)" }}
                  >
                    🛍️
                  </motion.div>
                  <div>
                    <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Tanga Do'koni</h2>
                    <p className="text-xs text-slate-500 dark:text-neutral-400 font-medium">Tangalaringizni sarflang!</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {/* Coin balance */}
                  <motion.div
                    key={user.coins}
                    initial={{ scale: 1.2 }}
                    animate={{ scale: 1 }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800"
                  >
                    <span className="text-lg">🪙</span>
                    <span className="text-sm font-black text-amber-700 dark:text-amber-400">
                      {user.coins.toLocaleString()}
                    </span>
                  </motion.div>

                  <motion.button
                    whileHover={{ scale: 1.08, rotate: 90 }}
                    whileTap={{ scale: 0.92 }}
                    transition={{ duration: 0.12 }}
                    onClick={onClose}
                    className="relative z-50 p-2 rounded-xl bg-slate-100 dark:bg-neutral-800 border border-slate-200 dark:border-neutral-700 text-slate-500 dark:text-neutral-400 hover:bg-slate-200 dark:hover:bg-neutral-700 cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </motion.button>
                </div>
              </div>

              {/* Category Filter */}
              <div className="flex gap-2 px-6 py-4 border-b border-black/5 dark:border-white/5 flex-shrink-0 overflow-x-auto">
                {categories.map((cat) => (
                  <motion.button
                    key={cat}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    transition={{ duration: 0.1 }}
                    onClick={() => setActiveCategory(cat)}
                    className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap cursor-pointer transition-all border ${
                      activeCategory === cat
                        ? "bg-amber-500 text-white border-amber-500 shadow-lg shadow-amber-500/25"
                        : "bg-slate-50 dark:bg-neutral-900 text-slate-500 dark:text-neutral-400 border-slate-200 dark:border-neutral-800 hover:border-amber-300"
                    }`}
                  >
                    {cat === "all" ? <ShoppingBag className="w-3.5 h-3.5" /> : CATEGORY_ICONS[cat]}
                    {cat === "all" ? "Barchasi" : CATEGORY_LABELS[cat]}
                  </motion.button>
                ))}
              </div>

              {/* Items Grid */}
              <div className="flex-1 overflow-y-auto p-6">
                <div className="grid grid-cols-1 gap-4">
                  <AnimatePresence mode="popLayout">
                    {filteredItems.map((item, i) => {
                      const owned = user.purchasedItems.includes(item.id);
                      const isActive = getActiveItem(item.category) === item.id;
                      const confirming = purchaseConfirm === item.id;
                      const boughtNow = justBought === item.id;
                      const canAfford = user.coins >= item.cost;
                      const rarity = RARITY_CONFIG[item.rarity];

                      return (
                        <motion.div
                          key={item.id}
                          layout
                          initial={{ opacity: 0, y: 20, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          transition={{ delay: i * 0.04, type: "spring", stiffness: 400, damping: 25 }}
                          className={`relative rounded-2xl border overflow-hidden cursor-pointer group ${
                            isActive
                              ? "border-amber-400 dark:border-amber-500 shadow-lg shadow-amber-500/20"
                              : owned
                              ? "border-emerald-400 dark:border-emerald-600 shadow-md shadow-emerald-500/10"
                              : "border-slate-200 dark:border-neutral-800 hover:border-amber-300 dark:hover:border-amber-700"
                          }`}
                          onClick={() => handlePurchase(item)}
                        >
                          {/* Active badge */}
                          {isActive && (
                            <div className="absolute top-3 right-3 z-10 px-2 py-0.5 rounded-lg bg-amber-500 text-white text-[10px] font-black tracking-wide">
                              FAOL
                            </div>
                          )}

                          {/* Owned badge */}
                          {owned && !isActive && (
                            <div className="absolute top-3 right-3 z-10 px-2 py-0.5 rounded-lg bg-emerald-500 text-white text-[10px] font-black">
                              SIZDA BOR
                            </div>
                          )}

                          <div className="flex items-center gap-4 p-4">
                            {/* Preview swatch */}
                            <div
                              className="w-16 h-16 rounded-xl flex-shrink-0 flex items-center justify-center text-3xl shadow-inner relative overflow-hidden"
                              style={{ background: item.preview }}
                            >
                              <span className="relative z-10 drop-shadow-lg">{item.emoji}</span>
                              {/* Shimmer on hover */}
                              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500" />
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-black text-sm text-slate-900 dark:text-white">{item.name}</h3>
                                <span className={`text-[10px] px-2 py-0.5 rounded-lg font-bold ${rarity.bg} ${rarity.color} border ${rarity.border}`}>
                                  {rarity.label}
                                </span>
                              </div>
                              <p className="text-xs text-slate-500 dark:text-neutral-400 leading-relaxed mb-2">{item.description}</p>
                              
                              {/* Price / action */}
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-1.5">
                                  <span className="text-base">🪙</span>
                                  <span className={`text-sm font-black ${
                                    canAfford ? "text-amber-600 dark:text-amber-400" : "text-slate-400"
                                  }`}>
                                    {item.cost.toLocaleString()}
                                  </span>
                                </div>

                                <AnimatePresence mode="wait">
                                  {boughtNow ? (
                                    <motion.div
                                      key="bought"
                                      initial={{ scale: 0 }}
                                      animate={{ scale: 1 }}
                                      exit={{ scale: 0 }}
                                      className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-500 text-white text-xs font-black"
                                    >
                                      <Check className="w-3.5 h-3.5" /> Sotib olindi!
                                    </motion.div>
                                  ) : owned ? (
                                    <motion.div
                                      key="owned"
                                      className={`px-3 py-1.5 rounded-xl text-xs font-black ${
                                        isActive
                                          ? "bg-amber-500 text-white"
                                          : "bg-slate-100 dark:bg-neutral-800 text-slate-600 dark:text-neutral-400 hover:bg-emerald-100 dark:hover:bg-emerald-950/30 hover:text-emerald-700 dark:hover:text-emerald-400"
                                      }`}
                                    >
                                      {isActive ? "✓ Faol" : "Faollashtirish"}
                                    </motion.div>
                                  ) : confirming ? (
                                    <motion.div
                                      key="confirm"
                                      initial={{ scale: 0.9, opacity: 0 }}
                                      animate={{ scale: 1, opacity: 1 }}
                                      className={`px-3 py-1.5 rounded-xl text-xs font-black ${
                                        canAfford
                                          ? "bg-amber-500 text-white animate-pulse"
                                          : "bg-rose-100 text-rose-600 dark:bg-rose-950/30 dark:text-rose-400"
                                      }`}
                                    >
                                      {canAfford ? "Tasdiqlash →" : "Yetarli tanga yo'q"}
                                    </motion.div>
                                  ) : (
                                    <motion.div
                                      key="buy"
                                      className={`px-3 py-1.5 rounded-xl text-xs font-black border ${
                                        canAfford
                                          ? "border-amber-300 dark:border-amber-700 text-amber-700 dark:text-amber-400 hover:bg-amber-500 hover:text-white hover:border-amber-500"
                                          : "border-slate-200 dark:border-neutral-800 text-slate-400 cursor-not-allowed"
                                      } transition-all`}
                                    >
                                      {canAfford ? "Sotib olish" : <Lock className="w-3.5 h-3.5" />}
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </div>

                {/* Footer info */}
                <div className="mt-6 p-4 rounded-2xl bg-slate-50 dark:bg-neutral-900/50 border border-slate-100 dark:border-neutral-800">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="w-4 h-4 text-amber-500" />
                    <span className="text-xs font-bold text-slate-600 dark:text-neutral-300">Tanga qanday topiladi?</span>
                  </div>
                  <div className="space-y-1">
                    {[
                      ["🎯 Missiya bajarildi", "+10-50 🪙"],
                      ["💰 Jamg'armaga pul qo'yildi", "+15 🪙"],
                      ["📝 Xarajat qayd etildi", "+5 🪙"],
                      ["🤖 AI vaziyat hal qilindi", "+20 🪙"],
                    ].map(([action, reward]) => (
                      <div key={action} className="flex justify-between text-[11px]">
                        <span className="text-slate-500 dark:text-neutral-400">{action}</span>
                        <span className="font-bold text-amber-600 dark:text-amber-400">{reward}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
