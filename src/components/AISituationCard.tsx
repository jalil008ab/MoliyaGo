"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useCallback, useEffect, useMemo } from "react";
import {
  X,
  Check,
  Clapperboard,
  Info,
  Sparkles,
  TrendingDown,
  BookOpen,
  Coffee,
  Gamepad2,
  ShoppingBag,
  Award,
  RotateCcw,
  TrendingUp,
  Coins,
  Bike,
  Percent,
  ShieldAlert,
  PiggyBank,
  Star,
  Zap,
} from "lucide-react";
import { useUser } from "@/context/UserContext";

/* ── helpers ─────────────────────────────────────────────────── */

function formatNumber(n: number): string {
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

/* ── types ───────────────────────────────────────────────────── */

interface ScenarioOption {
  label: string;
  sublabel: string;
  coinReward: number;
  xpReward: number;
}

interface ScenarioResult {
  emoji: string;
  title: string;
  message: string;
}

interface Scenario {
  id: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  cost: number;
  costLabel: string;
  spendOption: ScenarioOption;
  saveOption: ScenarioOption;
  spendResult: ScenarioResult;
  saveResult: ScenarioResult;
}

/* ── all 12 scenarios ────────────────────────────────────────── */

const ALL_SCENARIOS: Scenario[] = [
  {
    id: "cinema",
    icon: <Clapperboard className="w-8 h-8 text-amber-500 flex-shrink-0 mt-0.5" />,
    title: "Do'sting seni yangi Marvel filmiga chaqiryapti! 🎬",
    description:
      "Kino juda qiziqarli ko'rinadi, barcha do'stlaringiz borishyapti. Lekin chipta va popkorn ancha qimmatga tushadi.",
    cost: 65000,
    costLabel: "Taxminiy xarajat",
    spendOption: {
      label: "Kinoga borish (Hissiyotga berilish)",
      sublabel: "+3 🪙 tanga, +5 XP",
      coinReward: 3,
      xpReward: 5,
    },
    saveOption: {
      label: "Uyda bepul tomosha qilish",
      sublabel: "+25 🪙 tanga, +25 XP",
      coinReward: 25,
      xpReward: 25,
    },
    spendResult: {
      emoji: "🍿",
      title: "Kino qiziqarli o'tdi!",
      message:
        "Do'stlar bilan vaqt yaxshi o'tdi. Lekin haqiqiy hayotda bunday xarajatlarni rejalashtirish muhim ekanligini o'rgandingiz!",
    },
    saveResult: {
      emoji: "🎉",
      title: "Aqlli tejash!",
      message:
        "Kinoni keyinroq bepul ko'radigan bo'ldingiz. Tejamkorlik — bu kuchli moliyaviy mahorat!",
    },
  },
  {
    id: "crypto",
    icon: <TrendingDown className="w-8 h-8 text-rose-500 flex-shrink-0 mt-0.5" />,
    title: "Do'stingiz shubhali Kriptovalyuta taklif qildi! 📈",
    description:
      '"Ushbu coin 100% ko\'tariladi, tezroq pul tik!" deyapti do\'stingiz. Lekin xavfi juda yuqoriligini bilasiz...',
    cost: 150000,
    costLabel: "Tavakkal summasi",
    spendOption: {
      label: "Coin sotib olish (Tavakkal qilish)",
      sublabel: "+2 🪙 tanga, +2 XP",
      coinReward: 2,
      xpReward: 2,
    },
    saveOption: {
      label: "Rad etib, kitob olish (Bilimga tikish)",
      sublabel: "+40 🪙 tanga, +45 XP",
      coinReward: 40,
      xpReward: 45,
    },
    spendResult: {
      emoji: "📉",
      title: "Coin narxi tushib ketdi!",
      message:
        "Tavakkalingiz oqlanmadi. Moliyaviy savodxonliksiz kriptovalyutaga pul tikish xavfli ekanini o'rgandingiz!",
    },
    saveResult: {
      emoji: "📚",
      title: "Super qaror!",
      message:
        "Shubhali tangaga pul tikmadingiz, aksincha bilimingizni oshirdingiz. Bu haqiqiy investitsiya!",
    },
  },
  {
    id: "course",
    icon: <BookOpen className="w-8 h-8 text-cyan-600 flex-shrink-0 mt-0.5" />,
    title: "IT va dizayn kursi 50% chegirmada! 🎓",
    description:
      "Kelajagingiz uchun juda foydali onlayn darslikni yarim narxda taklif qilishyapti. Bilimga sarmoya qilmoqchimisiz?",
    cost: 120000,
    costLabel: "Chegirmadagi narx",
    spendOption: {
      label: "Kursni sotib olish (Bilimga investitsiya)",
      sublabel: "+30 🪙 tanga, +85 XP",
      coinReward: 30,
      xpReward: 85,
    },
    saveOption: {
      label: "Rad etib, pulni saqlash",
      sublabel: "+20 🪙 tanga, +10 XP",
      coinReward: 20,
      xpReward: 10,
    },
    spendResult: {
      emoji: "🚀",
      title: "Kelajakka ajoyib investitsiya!",
      message:
        "Ushbu darslik kelajakda katta imkoniyatlar ochishi mumkin. Bilimga qo'yilgan sarmoya eng foydali sarmoya!",
    },
    saveResult: {
      emoji: "💰",
      title: "Tejamkorlik!",
      message:
        "Pulni tejadingiz. Lekin bilim olish yo'llarini bepul YouTube darslaridan qidirishni unutmang!",
    },
  },
  {
    id: "fastfood",
    icon: <Coffee className="w-8 h-8 text-orange-500 flex-shrink-0 mt-0.5" />,
    title: "Do'stlar bilan qimmatbaho fast-fud kafesi! 🍔",
    description:
      "Do'stlaringiz brend kafeda pitsa va burger yeyishmoqchi. Borish qiziqarli, lekin byudjetingizga og'irlik qiladi.",
    cost: 80000,
    costLabel: "Tushlik narxi",
    spendOption: {
      label: "Kafega borish (Mazali tushlik)",
      sublabel: "+3 🪙 tanga, +5 XP",
      coinReward: 3,
      xpReward: 5,
    },
    saveOption: {
      label: "Uyda tayyorlangan ovqatni yeyish",
      sublabel: "+30 🪙 tanga, +35 XP",
      coinReward: 30,
      xpReward: 35,
    },
    spendResult: {
      emoji: "🍕",
      title: "Juda mazali ovqatlandingiz!",
      message:
        "Do'stlar bilan suhbat zo'r bo'ldi. Lekin kunlik byudjetga ehtiyot bo'lish kerakligini o'rgandingiz!",
    },
    saveResult: {
      emoji: "🏠",
      title: "Sog'lom va tejamkor!",
      message:
        "Uyda tayyorlangan sog'lom ovqat yedingiz. Sog'liq va byudjet ikkisi ham yutdi!",
    },
  },
  {
    id: "gaming",
    icon: <Gamepad2 className="w-8 h-8 text-indigo-500 flex-shrink-0 mt-0.5" />,
    title: "Sevimli o'yiningiz uchun qahramon kiyimi (Skin)! 🕹️",
    description:
      "O'yindagi qahramoningiz chiroyli ko'rinishi uchun yangi skin chiqdi. U hech qanday ustunlik bermaydi, faqat vizual.",
    cost: 95000,
    costLabel: "Skin narxi",
    spendOption: {
      label: "Skin sotib olish (Virtual quvonch)",
      sublabel: "+2 🪙 tanga, +5 XP",
      coinReward: 2,
      xpReward: 5,
    },
    saveOption: {
      label: "Rad etish (Oddiy skin bilan o'ynash)",
      sublabel: "+28 🪙 tanga, +30 XP",
      coinReward: 28,
      xpReward: 30,
    },
    spendResult: {
      emoji: "🎮",
      title: "Virtual kiyim muborak!",
      message:
        "Qahramoningiz chiroyli ko'rinyapti. Lekin virtual narsalarga ko'p sarflash aqlli emas ekanini yodda tuting!",
    },
    saveResult: {
      emoji: "💪",
      title: "Kuchli iroda egasisiz!",
      message:
        "Virtual kiyimlarning vaqtinchalik hissiyot ekanini tushundingiz. Real hayotdagi maqsadlar muhimroq!",
    },
  },
  {
    id: "shopping",
    icon: <ShoppingBag className="w-8 h-8 text-pink-500 flex-shrink-0 mt-0.5" />,
    title: "Brendli krossovka 40% chegirmada! 👟",
    description:
      "Siz uzoq vaqtdan beri orzu qilgan brend krossovka do'konda arzonlashgan. Lekin baribir bu siz uchun katta xarajat...",
    cost: 250000,
    costLabel: "Aksiya narxi",
    spendOption: {
      label: "Krossovkani olish (Kiyinish)",
      sublabel: "+5 🪙 tanga, +10 XP",
      coinReward: 5,
      xpReward: 10,
    },
    saveOption: {
      label: "Eski poyabzalda yurish (Pulni saqlash)",
      sublabel: "+35 🪙 tanga, +40 XP",
      coinReward: 35,
      xpReward: 40,
    },
    spendResult: {
      emoji: "👟",
      title: "Yangi krossovka muborak!",
      message:
        "U juda chiroyli va qulay. Lekin chegirma ham katta xarajat bo'lishi mumkinligini o'rgandingiz!",
    },
    saveResult: {
      emoji: "🏆",
      title: "Siz g'olibsiz!",
      message:
        "Hissiyotlarni jilovlab, tejamkorlik madaniyatini namoyish etdingiz. Donolik — bu aql bilan harakatlanish!",
    },
  },
  {
    id: "taxi",
    icon: <Bike className="w-8 h-8 text-emerald-600 flex-shrink-0 mt-0.5" />,
    title: "Taksi o'rniga jamoat transporti yoki velosiped! 🚲",
    description:
      "Bugun ob-havo ajoyib va quyoshli. O'qishga/ishga shoshilmayapsiz. Taksida borish 20,000 so'm, avtobusda borish 2,000 so'm.",
    cost: 20000,
    costLabel: "Taksi narxi",
    spendOption: {
      label: "Taksi chaqirish (Tez va qulay)",
      sublabel: "+2 🪙 tanga, +2 XP",
      coinReward: 2,
      xpReward: 2,
    },
    saveOption: {
      label: "Avtobusda borish yoki piyoda yurish",
      sublabel: "+22 🪙 tanga, +25 XP",
      coinReward: 22,
      xpReward: 25,
    },
    spendResult: {
      emoji: "🚖",
      title: "Taksida tez yetib oldingiz!",
      message:
        "Yaxshi ob-havoda piyoda yursangiz, sog'liqqa ham foydali ekanini bilasiz. Kichik tejash katta natija beradi!",
    },
    saveResult: {
      emoji: "🌱",
      title: "Sog'lom hayot va tejash!",
      message:
        "Avtobusda borib tejadingiz! Toza havoda piyoda yurish sizga ajoyib energiya berdi!",
    },
  },
  {
    id: "telegram_scam",
    icon: <ShieldAlert className="w-8 h-8 text-red-500 flex-shrink-0 mt-0.5" />,
    title: "Telegramdagi 'Pulni ko'paytiruvchi' botlar! 🎰",
    description:
      '"100,000 so\'m tiksangiz, ertaga 1,000,000 so\'m qilib qaytaramiz!" degan shubhali Telegram bot reklamasini ko\'rdingiz...',
    cost: 100000,
    costLabel: "Tikish summasi",
    spendOption: {
      label: "Pul tikib sinab ko'rish (Tavakkal)",
      sublabel: "+0 🪙 tanga, +0 XP",
      coinReward: 0,
      xpReward: 0,
    },
    saveOption: {
      label: "E'tibor bermaslik (Firibgarlikdan qochish)",
      sublabel: "+40 🪙 tanga, +50 XP",
      coinReward: 40,
      xpReward: 50,
    },
    spendResult: {
      emoji: "🤡",
      title: "Afsuski, firibgarlarga aldandingiz!",
      message:
        "Internetda tez va oson boyishni va'da qiladigan har qanday narsa firibgarlikdir. Bu muhim dars!",
    },
    saveResult: {
      emoji: "🛡️",
      title: "O'ta aqlli va hushyor!",
      message:
        "Firibgarlarga aldanmadingiz. Haqiqiy moliyaviy xavfsizlik madaniyatini o'rgandingiz!",
    },
  },
  {
    id: "coffee",
    icon: <Coffee className="w-8 h-8 text-yellow-700 flex-shrink-0 mt-0.5" />,
    title: "Har kuni qimmat qahvaxonadan kofe ichish! ☕",
    description:
      "Har kuni brend kofexonalardan 35,000 so'mga shirin kofe ichishni odat qilgansiz. Uyda termosda olib yurish ancha arzon tushadi.",
    cost: 35000,
    costLabel: "Bir stakan kofe",
    spendOption: {
      label: "Qimmat kofe olish (Odatga ergashish)",
      sublabel: "+2 🪙 tanga, +2 XP",
      coinReward: 2,
      xpReward: 2,
    },
    saveOption: {
      label: "Uyda termosda tayyorlab olish",
      sublabel: "+25 🪙 tanga, +30 XP",
      coinReward: 25,
      xpReward: 30,
    },
    spendResult: {
      emoji: "☕",
      title: "Shirin kofe ichdingiz!",
      message:
        "U yoqimli, lekin oyiga hisoblasangiz kofega 1,000,000 so'mdan ko'proq ketishini tushundingiz!",
    },
    saveResult: {
      emoji: "🌟",
      title: "Haqiqiy tejash san'ati!",
      message:
        "Uyda termosga kofe solib chiqib, tejamkorlik ko'rsatdingiz. Kichik odatlar — katta natijalar!",
    },
  },
  {
    id: "deposit",
    icon: <PiggyBank className="w-8 h-8 text-emerald-500 flex-shrink-0 mt-0.5" />,
    title: "Uzum yoki Payme'da yillik 24% omonat ochish! 🏦",
    description:
      "Hamyoningizda ortiqcha 200,000 so'm yig'ilib qoldi. Uni shunchaki keraksiz shirinliklarga sarflash yoki yillik 24% lik omonatga (depozit) qo'yish mumkin.",
    cost: 200000,
    costLabel: "Omonat summasi",
    spendOption: {
      label: "Shirinliklar va mayda-chuyda olish",
      sublabel: "+3 🪙 tanga, +5 XP",
      coinReward: 3,
      xpReward: 5,
    },
    saveOption: {
      label: "Bankda foizli omonat ochish",
      sublabel: "+35 🪙 tanga, +60 XP",
      coinReward: 35,
      xpReward: 60,
    },
    spendResult: {
      emoji: "🍭",
      title: "Shirinliklar yeb tugatildi!",
      message:
        "Pul bir kunda yo'q bo'ldi. Kelajakda pulingiz siz uchun ishlashi mumkinligini unutmang!",
    },
    saveResult: {
      emoji: "📈",
      title: "Pul siz uchun ishlamoqda!",
      message:
        "Ajoyib moliyaviy qaror! Pulni omonatga qo'yib passiv daromad yaratish donolikdir!",
    },
  },
  {
    id: "promo_deal",
    icon: <Percent className="w-8 h-8 text-blue-500 flex-shrink-0 mt-0.5" />,
    title: '"2 ta sotib olsangiz, 3-si sovg\'a!" aksiyasi! 🛍️',
    description:
      "Do'konda sizga unchalik kerak bo'lmagan, lekin 'Super Aksiya!' deb yozilgan gadjetlar ketyapti. Jami 180,000 so'm sarflash kerak.",
    cost: 180000,
    costLabel: "Aksiya summasi",
    spendOption: {
      label: "Aksiya bahonasida sotib olish",
      sublabel: "+3 🪙 tanga, +5 XP",
      coinReward: 3,
      xpReward: 5,
    },
    saveOption: {
      label: "Aksiyani rad etib, pulni saqlash",
      sublabel: "+30 🪙 tanga, +35 XP",
      coinReward: 30,
      xpReward: 35,
    },
    spendResult: {
      emoji: "📦",
      title: "Keraksiz buyumlar ko'paydi!",
      message:
        "Aksiya aslida sizni ko'proq pul sarflashga majburlash uchun marketing tuzog'i ekanini o'rgandingiz!",
    },
    saveResult: {
      emoji: "💡",
      title: "Marketing tuzog'idan qutuldingiz!",
      message:
        "Keraksiz narsani arzon bo'lsa ham sotib olmaslik haqiqiy donolik ekanini tushundingiz!",
    },
  },
  {
    id: "gym_membership",
    icon: <Coins className="w-8 h-8 text-pink-600 flex-shrink-0 mt-0.5" />,
    title: "Qimmatbaho Sport zaliga 1 yillik obuna! 💪",
    description:
      "Sport bilan shug'ullanish juda zo'r, lekin 1 yillik obuna (membership) naqd 300,000 so'm turadi. Borishingiz esa hali aniq emas...",
    cost: 300000,
    costLabel: "Obuna narxi",
    spendOption: {
      label: "Obunani darhol sotib olish",
      sublabel: "+5 🪙 tanga, +15 XP",
      coinReward: 5,
      xpReward: 15,
    },
    saveOption: {
      label: "Obunani keyinga surib, ko'chada mashq qilish",
      sublabel: "+30 🪙 tanga, +40 XP",
      coinReward: 30,
      xpReward: 40,
    },
    spendResult: {
      emoji: "🏋️",
      title: "Obuna sotib olindi!",
      message:
        "Agar haftada 3 marta bormasangiz, bu pul havoga uchadi. Rejalashtirib qaror qilish muhimligini o'rgandingiz!",
    },
    saveResult: {
      emoji: "🏃",
      title: "Dono va tejamkor!",
      message:
        "Dastlab bepul ko'cha turniklarida mashq qilib ko'rishni rejalashtirdingiz. Aqlli qaror!",
    },
  },
];

/* ── floating coin particle ──────────────────────────────────── */

function CoinParticle({ delay, x, y }: { delay: number; x: number; y: number }) {
  return (
    <motion.div
      initial={{ opacity: 1, scale: 0, x: 0, y: 0 }}
      animate={{
        opacity: [1, 1, 0],
        scale: [0, 1.2, 0.6],
        x: x,
        y: y,
      }}
      transition={{ duration: 1.2, delay, ease: "easeOut" }}
      className="absolute text-2xl pointer-events-none z-50"
      style={{ left: "50%", top: "50%" }}
    >
      🪙
    </motion.div>
  );
}

/* ── star rating component ───────────────────────────────────── */

function StarRating({ savePercent }: { savePercent: number }) {
  const starCount =
    savePercent >= 80 ? 5 : savePercent >= 60 ? 4 : savePercent >= 40 ? 3 : savePercent >= 20 ? 2 : 1;

  return (
    <div className="flex items-center justify-center gap-1 my-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0, rotate: -60 }}
          animate={{
            opacity: i < starCount ? 1 : 0.2,
            scale: 1,
            rotate: 0,
          }}
          transition={{ delay: 0.3 + i * 0.15, type: "spring", stiffness: 400 }}
        >
          <Star
            className={`w-7 h-7 ${
              i < starCount
                ? "text-amber-400 fill-amber-400 drop-shadow-md"
                : "text-slate-300 dark:text-neutral-600"
            }`}
          />
        </motion.div>
      ))}
    </div>
  );
}

/* ── countdown overlay ───────────────────────────────────────── */

function CountdownOverlay({ onDone }: { onDone: () => void }) {
  const [count, setCount] = useState(1);

  useEffect(() => {
    if (count <= 0) {
      onDone();
      return;
    }
    const t = setTimeout(() => setCount((c) => c - 1), 400); //snappy 400ms
    return () => clearTimeout(t);
  }, [count, onDone]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-45 flex flex-col items-center justify-center bg-slate-900/60 dark:bg-black/75 backdrop-blur-md rounded-3xl"
    >
      <div className="flex flex-col items-center gap-3">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-11 h-11 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full"
        />
        <span className="text-xs font-black text-cyan-400 tracking-wider uppercase animate-pulse">
          Qaror tahlil qilinmoqda...
        </span>
      </div>
    </motion.div>
  );
}

/* ── main component ──────────────────────────────────────────── */

export default function AISituationCard() {
  const { handleAISituation, addNotification } = useUser();
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [choice, setChoice] = useState<"none" | "spend" | "save">("none");
  const [showResult, setShowResult] = useState(false);
  const [sessionChoices, setSessionChoices] = useState<("spend" | "save")[]>([]);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showCountdown, setShowCountdown] = useState(false);
  const [pendingChoice, setPendingChoice] = useState<"spend" | "save" | null>(null);
  const [showCoinExplosion, setShowCoinExplosion] = useState(false);

  /* running totals */
  const runningCoins = useMemo(() => {
    return sessionChoices.reduce((acc, c, idx) => {
      if (!scenarios[idx]) return acc;
      return (
        acc +
        (c === "save"
          ? scenarios[idx].saveOption.coinReward
          : scenarios[idx].spendOption.coinReward)
      );
    }, 0);
  }, [sessionChoices, scenarios]);

  const runningXP = useMemo(() => {
    return sessionChoices.reduce((acc, c, idx) => {
      if (!scenarios[idx]) return acc;
      return (
        acc +
        (c === "save"
          ? scenarios[idx].saveOption.xpReward
          : scenarios[idx].spendOption.xpReward)
      );
    }, 0);
  }, [sessionChoices, scenarios]);

  /* init */
  const initScenarios = useCallback(() => {
    const shuffled = [...ALL_SCENARIOS].sort(() => Math.random() - 0.5).slice(0, 6);
    setScenarios(shuffled);
    setCurrentIndex(0);
    setChoice("none");
    setShowResult(false);
    setSessionChoices([]);
    setIsCompleted(false);
    setShowCountdown(false);
    setPendingChoice(null);
    setShowCoinExplosion(false);
  }, []);

  useEffect(() => {
    initScenarios();
  }, [initScenarios]);

  const scenario = scenarios[currentIndex];

  /* choice handler — starts countdown first */
  const triggerChoice = useCallback(
    (option: "spend" | "save") => {
      if (!scenario) return;
      setPendingChoice(option);
      setShowCountdown(true);
    },
    [scenario]
  );

  /* after countdown finishes */
  const handleCountdownDone = useCallback(() => {
    setShowCountdown(false);
    if (!pendingChoice || !scenario) return;

    const option = pendingChoice;
    setChoice(option);
    setSessionChoices((prev) => [...prev, option]);

    const opt = option === "spend" ? scenario.spendOption : scenario.saveOption;
    // NEW signature: (xpReward, coinReward, balanceChange, savedChange) — always 0 for last two
    handleAISituation(opt.xpReward, opt.coinReward, 0, 0);

    const result = option === "spend" ? scenario.spendResult : scenario.saveResult;
    addNotification({
      title: result.title,
      message: result.message,
      type: option === "save" ? "success" : "warning",
    });

    // Show coin explosion
    setShowCoinExplosion(true);
    setTimeout(() => setShowCoinExplosion(false), 1500);

    setTimeout(() => setShowResult(true), 600);
    setPendingChoice(null);
  }, [pendingChoice, scenario, handleAISituation, addNotification]);

  const handleReset = () => {
    setShowResult(false);
    setChoice("none");
    if (currentIndex + 1 >= scenarios.length) {
      setIsCompleted(true);
    } else {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handleRestart = () => {
    initScenarios();
  };

  /* coin explosion particles data */
  const coinParticles = useMemo(
    () =>
      Array.from({ length: 12 }).map((_, i) => ({
        id: i,
        delay: Math.random() * 0.3,
        x: (Math.random() - 0.5) * 200,
        y: (Math.random() - 0.5) * 200 - 60,
      })),
    []
  );

  /* stats for completed screen */
  const totalSavedChoice = sessionChoices.filter((c) => c === "save").length;
  const totalSpentChoice = sessionChoices.filter((c) => c === "spend").length;
  const savePercent = sessionChoices.length > 0 ? Math.round((totalSavedChoice / sessionChoices.length) * 100) : 0;

  const totalCoinsGained = sessionChoices.reduce((acc, c, idx) => {
    if (!scenarios[idx]) return acc;
    return acc + (c === "save" ? scenarios[idx].saveOption.coinReward : scenarios[idx].spendOption.coinReward);
  }, 0);

  const totalXpGained = sessionChoices.reduce((acc, c, idx) => {
    if (!scenarios[idx]) return acc;
    return acc + (c === "save" ? scenarios[idx].saveOption.xpReward : scenarios[idx].spendOption.xpReward);
  }, 0);

  /* badge logic */
  let badgeTitle = "Muvozanat Ustasi";
  let badgeEmoji = "⚖️";
  let badgeColorClass =
    "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/50";
  let badgeDescription =
    "Siz xarajatlar va tejash o'rtasida mukammal muvozanatni saqladingiz. Bu o'ta foydali mahorat!";

  if (totalSavedChoice > totalSpentChoice) {
    badgeTitle = "Aqlli Tejovchi";
    badgeEmoji = "🏆";
    badgeColorClass =
      "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/50";
    badgeDescription =
      "Ajoyib natija! Siz kelajakdagi orzungiz va maqsadlaringizni birinchi o'ringa qo'yasiz va his-tuyg'ularga berilmaysiz.";
  } else if (totalSpentChoice > totalSavedChoice) {
    badgeTitle = "Katta Xaridor";
    badgeEmoji = "💸";
    badgeColorClass =
      "text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/50";
    badgeDescription =
      "Siz hozirgi lahzalardan zavqlanishni afzal ko'rasiz, ammo ehtiyot bo'ling! Jamg'armasiz kelajak qiyinlashishi mumkin.";
  }

  if (!scenario && !isCompleted) {
    return (
      <div className="glass-card p-6 text-center">
        <p className="text-slate-500 font-semibold">Vaziyatlar yuklanmoqda...</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.5 }}
      className="relative overflow-hidden w-full"
    >
      <div className="glass-card p-6 sm:p-8 relative overflow-hidden">
        {/* Soft pastels background glow */}
        <div className="absolute -top-20 -right-20 w-60 h-60 bg-gradient-to-bl from-cyan-200/40 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-gradient-to-tr from-blue-200/40 to-transparent rounded-full blur-3xl pointer-events-none" />

        {/* Countdown overlay */}
        <AnimatePresence>
          {showCountdown && <CountdownOverlay onDone={handleCountdownDone} />}
        </AnimatePresence>

        <div className="relative z-10">
          {!isCompleted ? (
            <>
              {/* Info banner — safe simulation */}
              <div className="mb-5 p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-800 dark:text-cyan-300 text-xs font-semibold leading-relaxed flex gap-2.5 items-start shadow-sm">
                <div className="w-5 h-5 rounded-full bg-cyan-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Info className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
                </div>
                <div>
                  Bu o&apos;quv simulyatsiyasi — faqat bilim ballari (XP) va tangalar
                  yig&apos;asiz. Hamyoningizga ta&apos;sir qilmaydi!
                </div>
              </div>

              {/* Header */}
              <div className="flex items-center gap-3 mb-5 border-b border-slate-100 dark:border-neutral-900 pb-4">
                <motion.div
                  animate={{
                    boxShadow: [
                      "0 0 0 rgba(6,182,212,0.2)",
                      "0 0 15px rgba(6,182,212,0.4)",
                      "0 0 0 rgba(6,182,212,0.2)",
                    ],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-11 h-11 rounded-2xl bg-cyan-100 dark:bg-cyan-500/15 border border-cyan-200 dark:border-cyan-500/30 flex items-center justify-center"
                >
                  <Zap className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
                </motion.div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-slate-800 dark:text-neutral-100">
                      AI Kutilmagan Vaziyat
                    </h3>
                    <motion.span
                      animate={{ opacity: [1, 0.4, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="px-2.5 py-0.5 rounded-full bg-cyan-100 dark:bg-cyan-500/15 border border-cyan-200 dark:border-cyan-500/30 text-[10px] font-extrabold text-cyan-600 dark:text-cyan-400"
                    >
                      KUNLIK O&apos;YIN
                    </motion.span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-neutral-400 font-medium">
                    Haqiqiy hayotiy qarorlar qabul qiling • Vaziyat {currentIndex + 1}/
                    {scenarios.length}
                  </p>
                </div>
              </div>

              {/* Running totals bar */}
              <div className="flex items-center justify-center gap-4 mb-5">
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 dark:bg-amber-500/10 border border-amber-200/50 dark:border-amber-500/20 rounded-full">
                  <span className="text-sm">🪙</span>
                  <span className="text-xs font-extrabold text-amber-700 dark:text-amber-400">
                    {runningCoins} tanga
                  </span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-pink-50 dark:bg-pink-500/10 border border-pink-200/50 dark:border-pink-500/20 rounded-full">
                  <Sparkles className="w-3.5 h-3.5 text-pink-500" />
                  <span className="text-xs font-extrabold text-pink-700 dark:text-pink-400">
                    {runningXP} XP
                  </span>
                </div>
              </div>

              <AnimatePresence mode="wait">
                {choice === "none" ? (
                  <motion.div
                    key={`question-${scenario!.id}`}
                    initial={{ opacity: 0, x: 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -40 }}
                    transition={{ duration: 0.35, ease: "easeInOut" }}
                  >
                    {/* Situation card */}
                    <div className="p-5 sm:p-6 rounded-2xl bg-slate-50 dark:bg-neutral-900 border border-slate-200/60 dark:border-neutral-800 shadow-sm mb-6">
                      <div className="flex items-start gap-4">
                        <div className="p-3 bg-white dark:bg-neutral-950 rounded-xl border border-slate-100 dark:border-neutral-900 shadow-sm flex-shrink-0">
                          {scenario!.icon}
                        </div>
                        <div>
                          <p className="text-slate-800 dark:text-neutral-100 font-extrabold text-base sm:text-lg leading-snug">
                            {scenario!.title}
                          </p>
                          <p className="text-slate-600 dark:text-neutral-350 text-sm mt-2.5 leading-relaxed font-semibold">
                            {scenario!.description}
                          </p>
                          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 dark:bg-amber-500/10 border border-amber-200/50 dark:border-amber-500/20 rounded-full text-xs text-amber-700 dark:text-amber-400 font-bold mt-4">
                            <span>💵 {scenario!.costLabel}:</span>
                            <span>{formatNumber(scenario!.cost)} so&apos;m</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Choice buttons */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <motion.button
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => triggerChoice("spend")}
                        className="py-4 px-5 rounded-2xl font-bold text-sm flex items-center gap-3 cursor-pointer text-left shadow-sm hover:shadow-md bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 text-slate-800 dark:text-neutral-200 hover:bg-slate-100 dark:hover:bg-neutral-850 transition-all duration-150"
                      >
                        <div className="w-10 h-10 rounded-xl bg-indigo-500/10 dark:bg-indigo-500/20 flex items-center justify-center flex-shrink-0 font-black text-indigo-600 dark:text-indigo-400 text-lg">
                          A
                        </div>
                        <div>
                          <p className="font-black text-slate-800 dark:text-neutral-100 text-xs sm:text-sm">
                            {scenario!.spendOption.label}
                          </p>
                          <p className="text-[10px] text-slate-500 dark:text-neutral-400 font-bold mt-0.5">
                            Ushbu qaror natijasini ko&apos;rish
                          </p>
                        </div>
                      </motion.button>

                      <motion.button
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => triggerChoice("save")}
                        className="py-4 px-5 rounded-2xl font-bold text-sm flex items-center gap-3 cursor-pointer text-left shadow-sm hover:shadow-md bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 text-slate-800 dark:text-neutral-200 hover:bg-slate-100 dark:hover:bg-neutral-850 transition-all duration-150"
                      >
                        <div className="w-10 h-10 rounded-xl bg-cyan-500/10 dark:bg-cyan-500/20 flex items-center justify-center flex-shrink-0 font-black text-cyan-600 dark:text-cyan-400 text-lg">
                          B
                        </div>
                        <div>
                          <p className="font-black text-slate-800 dark:text-neutral-100 text-xs sm:text-sm">
                            {scenario!.saveOption.label}
                          </p>
                          <p className="text-[10px] text-slate-500 dark:text-neutral-400 font-bold mt-0.5">
                            Ushbu qaror natijasini ko&apos;rish
                          </p>
                        </div>
                      </motion.button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key={`result-${scenario!.id}`}
                    initial={{ opacity: 0, scale: 0.92 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 20 }}
                    className="text-center py-6 relative"
                  >
                    {/* Coin explosion */}
                    <AnimatePresence>
                      {showCoinExplosion && (
                        <div className="absolute inset-0 pointer-events-none">
                          {coinParticles.map((p) => (
                            <CoinParticle key={p.id} delay={p.delay} x={p.x} y={p.y} />
                          ))}
                        </div>
                      )}
                    </AnimatePresence>

                    {choice === "save" ? (
                      <div>
                        <motion.div
                          initial={{ scale: 0, rotate: -20 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{
                            type: "spring",
                            stiffness: 300,
                            delay: 0.1,
                          }}
                          className="w-20 h-20 rounded-3xl bg-emerald-50 dark:bg-emerald-950/20 border-2 border-emerald-200 dark:border-emerald-900 flex items-center justify-center mx-auto mb-5 shadow-sm"
                        >
                          <Sparkles className="w-10 h-10 text-emerald-600 dark:text-emerald-400" />
                        </motion.div>
                        <motion.h4
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3 }}
                          className="text-2xl font-extrabold text-emerald-700 dark:text-emerald-400 mb-3"
                        >
                          {scenario!.saveResult.title} {scenario!.saveResult.emoji}
                        </motion.h4>
                        <motion.p
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.4 }}
                          className="text-slate-600 dark:text-neutral-300 text-sm max-w-md mx-auto mb-5 leading-relaxed font-semibold"
                        >
                          {scenario!.saveResult.message}
                        </motion.p>
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.5 }}
                          className="flex items-center justify-center gap-3 mt-4 flex-wrap"
                        >
                          <span className="px-3.5 py-1.5 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 rounded-full text-xs font-bold text-amber-600 dark:text-amber-400 shadow-sm">
                            +{scenario!.saveOption.coinReward} 🪙 tanga
                          </span>
                          {scenario!.saveOption.xpReward > 0 && (
                            <span className="px-3.5 py-1.5 bg-pink-50 dark:bg-pink-500/10 border border-pink-200 dark:border-pink-500/30 rounded-full text-xs font-bold text-pink-600 dark:text-pink-400 shadow-sm">
                              +{scenario!.saveOption.xpReward} XP Bilim Ballari
                            </span>
                          )}
                        </motion.div>
                      </div>
                    ) : (
                      <div>
                        <motion.div
                          initial={{ scale: 0, rotate: 20 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{
                            type: "spring",
                            stiffness: 300,
                            delay: 0.1,
                          }}
                          className="w-20 h-20 rounded-3xl bg-rose-50 dark:bg-rose-950/20 border-2 border-rose-200 dark:border-rose-900 flex items-center justify-center mx-auto mb-5 shadow-sm"
                        >
                          <span className="text-4xl">{scenario!.spendResult.emoji}</span>
                        </motion.div>
                        <motion.h4
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3 }}
                          className="text-2xl font-extrabold text-rose-700 dark:text-rose-400 mb-3"
                        >
                          {scenario!.spendResult.title}
                        </motion.h4>
                        <motion.p
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.4 }}
                          className="text-slate-600 dark:text-neutral-300 text-sm max-w-md mx-auto mb-5 leading-relaxed font-semibold"
                        >
                          {scenario!.spendResult.message}
                        </motion.p>
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.5 }}
                          className="flex items-center justify-center gap-3 mt-4 flex-wrap"
                        >
                          <span className="px-3.5 py-1.5 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 rounded-full text-xs font-bold text-amber-600 dark:text-amber-400 shadow-sm">
                            +{scenario!.spendOption.coinReward} 🪙 tanga
                          </span>
                          {scenario!.spendOption.xpReward > 0 && (
                            <span className="px-3.5 py-1.5 bg-pink-50 dark:bg-pink-500/10 border border-pink-200 dark:border-pink-500/30 rounded-full text-xs font-bold text-pink-600 dark:text-pink-400 shadow-sm">
                              +{scenario!.spendOption.xpReward} XP Bilim Ballari
                            </span>
                          )}
                        </motion.div>
                      </div>
                    )}

                    <motion.button
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleReset}
                      className="mt-8 px-8 py-3 rounded-2xl bg-slate-100 dark:bg-neutral-800 hover:bg-slate-200 dark:hover:bg-neutral-700 border border-slate-200 dark:border-neutral-700 text-slate-700 dark:text-neutral-300 hover:text-slate-900 dark:hover:text-white text-sm font-bold shadow-sm hover:shadow transition-all duration-200 cursor-pointer"
                    >
                      {currentIndex + 1 >= scenarios.length
                        ? "Natijalarni ko'rish 📊"
                        : "Keyingi vaziyat →"}
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>
            </>
          ) : (
            /* ── COMPLETED SCREEN ─────────────────────────────── */
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="text-center py-4"
            >
              {/* Badge animation */}
              <div className="relative inline-block mb-4">
                <div className="absolute inset-0 bg-amber-400/20 rounded-full blur-xl animate-pulse" />
                <motion.div
                  initial={{ y: -10, rotate: -15 }}
                  animate={{ y: 0, rotate: 0 }}
                  transition={{ type: "spring", bounce: 0.4 }}
                  className="relative w-24 h-24 rounded-3xl bg-amber-100 dark:bg-amber-500/15 border border-amber-200 dark:border-amber-500/30 flex items-center justify-center mx-auto shadow-sm"
                >
                  <Award className="w-14 h-14 text-amber-500 dark:text-amber-400 animate-bounce" />
                </motion.div>
              </div>

              <h3 className="text-2xl font-extrabold text-slate-800 dark:text-neutral-100">
                Ajoyib natija! Simulyatsiyani yakunladingiz! 🚀
              </h3>
              <p className="text-sm text-slate-500 dark:text-neutral-400 font-semibold mt-1.5">
                Siz barcha {scenarios.length} ta moliyaviy vaziyatni muvaffaqiyatli tahlil
                qildingiz.
              </p>

              {/* Star rating */}
              <StarRating savePercent={savePercent} />
              <p className="text-xs text-slate-500 dark:text-neutral-400 font-bold">
                Tejash darajasi: {savePercent}%
              </p>

              {/* Title badge */}
              <div
                className={`mt-6 p-5 rounded-3xl border ${badgeColorClass} max-w-md mx-auto text-center shadow-md`}
              >
                <span className="text-3xl mb-1.5 block">{badgeEmoji}</span>
                <h4 className="text-lg font-black tracking-tight">
                  Erishilgan Unvon: {badgeTitle}
                </h4>
                <p className="text-xs font-bold opacity-90 mt-1.5 leading-relaxed">
                  {badgeDescription}
                </p>
              </div>

              {/* Metrics grid — coins-focused */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 max-w-xl mx-auto">
                {/* Coins earned */}
                <div className="p-4 bg-amber-50/65 dark:bg-amber-950/10 border border-amber-100 dark:border-amber-900/55 rounded-2xl shadow-sm">
                  <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-950/30 flex items-center justify-center mx-auto mb-2 shadow-inner">
                    <span className="text-base">🪙</span>
                  </div>
                  <p className="text-[10px] font-black text-slate-700 dark:text-neutral-350 uppercase tracking-wider">
                    Yig&apos;ilgan tangalar
                  </p>
                  <p className="text-base font-extrabold text-amber-600 dark:text-amber-400 mt-0.5">
                    +{formatNumber(totalCoinsGained)} tanga
                  </p>
                </div>

                {/* XP earned */}
                <div className="p-4 bg-pink-50/65 dark:bg-pink-950/10 border border-pink-100 dark:border-pink-900/55 rounded-2xl shadow-sm">
                  <div className="w-8 h-8 rounded-lg bg-pink-100 dark:bg-pink-950/30 flex items-center justify-center mx-auto mb-2 text-pink-600 dark:text-pink-400 shadow-inner">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <p className="text-[10px] font-black text-slate-700 dark:text-neutral-350 uppercase tracking-wider">
                    Yig&apos;ilgan XP
                  </p>
                  <p className="text-base font-extrabold text-pink-600 dark:text-pink-400 mt-0.5">
                    +{formatNumber(totalXpGained)} XP
                  </p>
                </div>

                {/* Save ratio */}
                <div className="p-4 bg-emerald-50/65 dark:bg-emerald-950/10 border border-emerald-100 dark:border-emerald-900/55 rounded-2xl shadow-sm">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950/30 flex items-center justify-center mx-auto mb-2 text-emerald-600 dark:text-emerald-400 shadow-inner">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                  <p className="text-[10px] font-black text-slate-700 dark:text-neutral-350 uppercase tracking-wider">
                    Tejash qarori
                  </p>
                  <p className="text-base font-extrabold text-emerald-600 dark:text-emerald-400 mt-0.5">
                    {totalSavedChoice}/{scenarios.length} marta
                  </p>
                </div>
              </div>

              {/* Coins explanation */}
              <div className="mt-6 max-w-md mx-auto p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/15 border border-amber-100 dark:border-amber-900/40 text-center">
                <p className="text-xs text-amber-800 dark:text-amber-300 font-semibold leading-relaxed">
                  🪙 <span className="font-extrabold">Tangalar</span> — bu platformaning
                  o&apos;z mukofot tizimi. Kunlik missiyalar bajarganingizda va AI
                  o&apos;yinida aqlli qarorlar qabul qilganingizda yig&apos;asiz. Ular
                  kelajakda yangi darslar va imkoniyatlar uchun ishlatiladi!
                </p>
              </div>

              {/* Restart */}
              <div className="mt-8 border-t border-slate-100 dark:border-neutral-900 pt-6">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleRestart}
                  className="inline-flex items-center gap-2 px-8 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-cyan-500 dark:from-emerald-600 dark:to-cyan-600 hover:from-emerald-600 hover:to-cyan-600 dark:hover:from-emerald-500 dark:hover:to-cyan-500 text-white font-extrabold text-sm shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Yangi tasodifiy vaziyatlar bilan qayta o&apos;ynash</span>
                </motion.button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
