"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useCallback } from "react";
import {
  CheckCircle,
  BookOpen,
  PenLine,
  Sparkles,
  ChevronRight,
  X,
  ArrowRight,
  TrendingDown,
  TrendingUp,
  Trophy,
  Star,
  ChevronLeft,
} from "lucide-react";
import { useUser } from "@/context/UserContext";

interface Quest {
  id: number;
  title: string;
  subtitle: string;
  xp: number;
  coins?: number;
  icon: React.ReactNode;
  completed: boolean;
  type: "expense-log" | "income-log" | "lesson";
}

// ===================== INFLATION LESSON MODAL =====================
interface LessonSlide {
  title: string;
  emoji: string;
  content: string;
  example?: string;
}

const LESSON_SLIDES: LessonSlide[] = [
  {
    title: "Inflyatsiya nima?",
    emoji: "📈",
    content:
      "Inflyatsiya — bu pullarning asta-sekin qadrsizlanishi. Ya'ni, bugun 10,000 so'mga olgan narsangizni yil o'tib 12,000 so'm berib olishingizga to'g'ri keladi.",
    example:
      "💡 Misol: Bugun 1 non = 3,000 so'm. 3 yildan keyin 1 non = 5,000 so'm bo'lishi mumkin. Bu inflyatsiya!",
  },
  {
    title: "Xarid qobiliyati nima?",
    emoji: "💰",
    content:
      "Xarid qobiliyati — sizning bir miqdor pul bilan qancha tovar-xizmat sotib ola olishingizdir. Inflyatsiya o'sgan sari xarid qobiliyatingiz kamayadi.",
    example:
      "💡 Misol: 100,000 so'm bilan 2022-yili 10 kg go'sht olgan bo'lsangiz, 2025-yili faqat 6-7 kg ola olasiz. Pul miqdori bir xil, lekin olinayotgan tovar kamaydi!",
  },
];

const QUIZ_OPTIONS = [
  { id: "a", text: "Pulning ko'payishi — davlat ko'p pul chiqarsa" },
  { id: "b", text: "Pullarning asta-sekin qadrsizlanishi ✓", correct: true },
  { id: "c", text: "Bankda pul saqlash muddati" },
  { id: "d", text: "Savdo uylarining chegirmasi" },
];

// ===================== MAIN COMPONENT =====================
export default function DailyQuestsCard() {
  const { user, completeQuest, addNotification } = useUser();

  const [quests, setQuests] = useState<Quest[]>([
    {
      id: 1,
      title: "Bugungi tushlik xarajatingni kirit",
      subtitle: "Ledger daftarchada Xarajat yoz → Avtomatik bajariladi",
      xp: 20,
      coins: 10,
      icon: <PenLine className="w-5 h-5" />,
      completed: false,
      type: "expense-log",
    },
    {
      id: 2,
      title: "Inflyatsiya haqida 1 daqiqalik dars o'qi",
      subtitle: "Interaktiv dars va tezkor testni ishlat",
      xp: 50,
      coins: 15,
      icon: <BookOpen className="w-5 h-5" />,
      completed: false,
      type: "lesson",
    },
    {
      id: 3,
      title: "Bugungi daromadingni qayd qil",
      subtitle: "Ledger daftarchada Daromad yoz → Avtomatik bajariladi",
      xp: 30,
      coins: 15,
      icon: <Sparkles className="w-5 h-5" />,
      completed: false,
      type: "income-log",
    },
  ]);

  // Lesson modal state
  const [showLesson, setShowLesson] = useState(false);
  const [lessonStep, setLessonStep] = useState(0); // 0,1 = slides, 2 = quiz
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  // Track whether quests were already auto-completed this session
  const [autoCompletedIds, setAutoCompletedIds] = useState<Set<number>>(new Set());

  // ===== AUTO-COMPLETION: Watch transactions and auto-complete matching quests =====
  useEffect(() => {
    const hasExpense = user.transactions.some(
      (t) => t.type === "expense" && t.category !== "Jamg'arma"
    );
    const hasIncome = user.transactions.some((t) => t.type === "income");

    let updated = false;
    const newAutoCompletedIds = new Set(autoCompletedIds);

    quests.forEach((q) => {
      if (q.completed) return;

      if (q.type === "expense-log" && hasExpense && !newAutoCompletedIds.has(q.id)) {
        newAutoCompletedIds.add(q.id);
        // Award rewards safely in useEffect side-effect phase
        completeQuest(q.xp, q.coins || 0);
        addNotification({
          title: "Missiya bajarildi! 🏆",
          message: `"${q.title}" avtomatik yakunlandi! +${q.xp} XP va +${q.coins} tangaga ega bo'ldingiz.`,
          type: "reward",
        });
        updated = true;
      }

      if (q.type === "income-log" && hasIncome && !newAutoCompletedIds.has(q.id)) {
        newAutoCompletedIds.add(q.id);
        // Award rewards safely in useEffect side-effect phase
        completeQuest(q.xp, q.coins || 0);
        addNotification({
          title: "Missiya bajarildi! 🏆",
          message: `"${q.title}" avtomatik yakunlandi! +${q.xp} XP va +${q.coins} tangaga ega bo'ldingiz.`,
          type: "reward",
        });
        updated = true;
      }
    });

    if (updated) {
      setAutoCompletedIds(newAutoCompletedIds);
      setQuests((prev) =>
        prev.map((q) => (newAutoCompletedIds.has(q.id) ? { ...q, completed: true } : q))
      );
    }
  }, [user.transactions, autoCompletedIds, quests, completeQuest, addNotification]);

  // ===== SCROLL TO LEDGER: Dispatch a custom event to GoalProgressCard =====
  const scrollToLedger = useCallback((txType: "expense" | "income") => {
    const el = document.getElementById("goal-progress-card");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    }
    // Dispatch a custom event so GoalProgressCard can pre-configure its form
    window.dispatchEvent(
      new CustomEvent("focus-quest-ledger", { detail: { txType } })
    );
  }, []);

  // ===== LESSON QUEST: Manual complete after quiz passed =====
  const handleLessonComplete = useCallback(() => {
    const lessonQuest = quests.find((q) => q.type === "lesson");
    if (!lessonQuest || lessonQuest.completed) return;

    setQuests((prev) =>
      prev.map((q) => (q.id === lessonQuest.id ? { ...q, completed: true } : q))
    );
    completeQuest(lessonQuest.xp, lessonQuest.coins || 0);
    addNotification({
      title: "Dars muvaffaqiyatli tugallandi! 🎓",
      message: `Inflyatsiya haqida bilim oldingiz! +${lessonQuest.xp} XP va +${lessonQuest.coins} tangaga ega bo'ldingiz. Ajoyib!`,
      type: "reward",
    });

    setTimeout(() => {
      setShowLesson(false);
      setLessonStep(0);
      setSelectedAnswer(null);
      setQuizSubmitted(false);
    }, 1800);
  }, [quests, completeQuest, addNotification]);

  // ===== QUIZ ANSWER HANDLER =====
  const handleQuizSubmit = () => {
    if (!selectedAnswer) return;
    setQuizSubmitted(true);
    const isCorrect = QUIZ_OPTIONS.find((o) => o.id === selectedAnswer)?.correct;
    if (isCorrect) {
      handleLessonComplete();
    }
  };

  // ===== QUEST ACTION HANDLER =====
  const handleAction = (quest: Quest) => {
    if (quest.completed) return;

    if (quest.type === "expense-log") {
      scrollToLedger("expense");
    } else if (quest.type === "income-log") {
      scrollToLedger("income");
    } else if (quest.type === "lesson") {
      setShowLesson(true);
      setLessonStep(0);
      setSelectedAnswer(null);
      setQuizSubmitted(false);
    }
  };

  const completedCount = quests.filter((q) => q.completed).length;
  const isCorrectAnswer =
    quizSubmitted && !!QUIZ_OPTIONS.find((o) => o.id === selectedAnswer)?.correct;

  return (
    <>
      <motion.div
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="glass-card p-6 sm:p-7 h-full flex flex-col justify-between"
      >
        <div>
          {/* Header */}
          <div className="flex items-center justify-between mb-5 border-b border-slate-100 dark:border-neutral-900 pb-4">
            <div className="flex items-center gap-3">
              <motion.div
                animate={{ scale: [1, 1.12, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-11 h-11 rounded-2xl bg-pink-50 dark:bg-pink-500/10 border border-pink-200 dark:border-pink-500/20 flex items-center justify-center"
              >
                <Sparkles className="w-5 h-5 text-pink-600" />
              </motion.div>
              <div>
                <h3 className="text-lg font-bold text-slate-800 dark:text-neutral-100">
                  Kunlik Missiyalar
                </h3>
                <p className="text-xs text-slate-500 dark:text-neutral-400 font-medium">
                  Faollik, bilim va tejash
                </p>
              </div>
            </div>
            <div className="px-3 py-1 rounded-xl bg-pink-50 dark:bg-pink-500/10 border border-pink-100 dark:border-pink-500/20 shadow-sm">
              <span className="text-[11px] font-extrabold text-pink-600">
                {completedCount}/{quests.length} bajarildi
              </span>
            </div>
          </div>

          {/* All quests completed banner */}
          {completedCount === quests.length && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-4 p-3.5 rounded-2xl bg-gradient-to-r from-emerald-50 to-cyan-50 dark:from-emerald-950/20 dark:to-cyan-950/20 border border-emerald-200 dark:border-emerald-900/50 text-center shadow-sm"
            >
              <Trophy className="w-6 h-6 text-amber-500 mx-auto mb-1" />
              <p className="text-xs font-extrabold text-emerald-700 dark:text-emerald-400">
                🎉 Barcha kunlik missiyalarni bajardingiz!
              </p>
              <p className="text-[10px] text-slate-500 dark:text-neutral-400 font-medium mt-0.5">
                Ertaga yangi missiyalar chiqadi. Zo'r ish!
              </p>
            </motion.div>
          )}

          {/* Quest List */}
          <div className="flex flex-col gap-3 flex-1">
            <AnimatePresence>
              {quests.map((quest, i) => (
                <motion.div
                  key={quest.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + i * 0.1 }}
                  layout
                  className={`relative p-4 rounded-2xl border transition-all duration-300 ${
                    quest.completed
                      ? "bg-emerald-50/10 dark:bg-emerald-950/10 border-emerald-200 dark:border-emerald-900/50"
                      : "bg-white dark:bg-neutral-950 border-slate-100 dark:border-neutral-900 hover:border-slate-200 dark:hover:border-neutral-850 hover:shadow-sm"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {/* Icon */}
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 border ${
                        quest.completed
                          ? "bg-emerald-100 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900 text-emerald-600 dark:text-emerald-400"
                          : "bg-slate-50 dark:bg-neutral-900 border-slate-200/50 dark:border-neutral-800 text-slate-500 dark:text-neutral-400"
                      }`}
                    >
                      {quest.completed ? (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", stiffness: 500 }}
                        >
                          <CheckCircle className="w-5 h-5" />
                        </motion.div>
                      ) : (
                        quest.icon
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-sm font-bold leading-snug ${
                          quest.completed
                            ? "text-slate-400 dark:text-neutral-500 line-through"
                            : "text-slate-800 dark:text-neutral-100"
                        }`}
                      >
                        {quest.title}
                      </p>
                      {!quest.completed && (
                        <p className="text-[10px] text-slate-400 dark:text-neutral-500 font-medium mt-0.5 leading-relaxed">
                          {quest.subtitle}
                        </p>
                      )}
                      <div className="flex items-center gap-3 mt-1.5">
                        <span className="text-xs font-bold text-pink-600 dark:text-pink-400">
                          +{quest.xp} XP
                        </span>
                        {quest.coins && (
                          <span className="text-xs font-bold text-amber-600 dark:text-amber-400">
                            🪙 {quest.coins} tanga
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Action */}
                    {!quest.completed && (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleAction(quest)}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-gradient-to-r from-pink-50 to-rose-50 dark:from-pink-950/20 dark:to-rose-950/20 border border-pink-200 dark:border-pink-900 text-pink-600 dark:text-pink-400 text-xs font-extrabold hover:shadow-sm transition-all flex-shrink-0 cursor-pointer"
                      >
                        {quest.type === "lesson" ? (
                          <>
                            Darsga o&apos;tish
                            <BookOpen className="w-3.5 h-3.5 ml-0.5" />
                          </>
                        ) : quest.type === "expense-log" ? (
                          <>
                            Kiritish
                            <TrendingDown className="w-3.5 h-3.5 ml-0.5" />
                          </>
                        ) : (
                          <>
                            Kiritish
                            <TrendingUp className="w-3.5 h-3.5 ml-0.5" />
                          </>
                        )}
                      </motion.button>
                    )}

                    {quest.completed && (
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-xs text-emerald-600 dark:text-emerald-400 font-extrabold px-2.5 py-1 rounded-lg bg-emerald-100/55 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 flex-shrink-0"
                      >
                        ✓ Tayyor
                      </motion.span>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>

      {/* ===================== LESSON MODAL ===================== */}
      <AnimatePresence>
        {showLesson && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setShowLesson(false);
                setLessonStep(0);
                setSelectedAnswer(null);
                setQuizSubmitted(false);
              }}
              className="fixed inset-0 z-[80] bg-slate-900/50 dark:bg-black/70 backdrop-blur-sm"
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 30 }}
              transition={{ type: "spring", stiffness: 240, damping: 24 }}
              className="fixed inset-0 z-[90] flex items-center justify-center p-4"
            >
              <div className="w-full max-w-md bg-white dark:bg-neutral-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-neutral-800 overflow-hidden">
                {/* Modal Header */}
                <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-neutral-800">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-cyan-50 dark:bg-cyan-950/30 border border-cyan-200 dark:border-cyan-900 flex items-center justify-center">
                      <BookOpen className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-800 dark:text-neutral-100">
                        1 Daqiqalik Moliyaviy Dars
                      </h3>
                      <p className="text-[10px] text-slate-400 dark:text-neutral-500 font-medium">
                        {lessonStep < 2
                          ? `Slayd ${lessonStep + 1}/2`
                          : "Tezkor test"}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setShowLesson(false);
                      setLessonStep(0);
                      setSelectedAnswer(null);
                      setQuizSubmitted(false);
                    }}
                    className="p-1.5 rounded-xl bg-slate-100 dark:bg-neutral-800 border border-slate-200 dark:border-neutral-700 text-slate-500 dark:text-neutral-400 hover:bg-slate-200 dark:hover:bg-neutral-700 transition-all cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Progress bar */}
                <div className="h-1 bg-slate-100 dark:bg-neutral-800">
                  <motion.div
                    animate={{ width: `${((lessonStep + 1) / 3) * 100}%` }}
                    transition={{ duration: 0.4 }}
                    className="h-full bg-gradient-to-r from-cyan-500 to-emerald-500"
                  />
                </div>

                {/* Content */}
                <div className="p-6">
                  <AnimatePresence mode="wait">
                    {/* SLIDES */}
                    {lessonStep < 2 && (
                      <motion.div
                        key={`slide-${lessonStep}`}
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -30 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-4"
                      >
                        <div className="text-center">
                          <span className="text-5xl block mb-3">
                            {LESSON_SLIDES[lessonStep].emoji}
                          </span>
                          <h4 className="text-xl font-extrabold text-slate-800 dark:text-neutral-100 mb-3">
                            {LESSON_SLIDES[lessonStep].title}
                          </h4>
                        </div>
                        <p className="text-sm text-slate-600 dark:text-neutral-300 leading-relaxed font-medium text-center">
                          {LESSON_SLIDES[lessonStep].content}
                        </p>
                        {LESSON_SLIDES[lessonStep].example && (
                          <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/40 text-xs text-amber-800 dark:text-amber-300 font-semibold leading-relaxed">
                            {LESSON_SLIDES[lessonStep].example}
                          </div>
                        )}
                      </motion.div>
                    )}

                    {/* QUIZ */}
                    {lessonStep === 2 && (
                      <motion.div
                        key="quiz"
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -30 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-4"
                      >
                        <div className="text-center mb-2">
                          <span className="text-3xl block mb-2">🧠</span>
                          <h4 className="text-base font-extrabold text-slate-800 dark:text-neutral-100">
                            Tezkor test
                          </h4>
                          <p className="text-xs text-slate-500 dark:text-neutral-400 font-medium mt-1">
                            Inflyatsiya qanday ta&apos;riflanadi?
                          </p>
                        </div>
                        <div className="space-y-2.5">
                          {QUIZ_OPTIONS.map((opt) => {
                            const isSelected = selectedAnswer === opt.id;
                            const isThisCorrect = !!opt.correct;
                            let cls =
                              "w-full p-3.5 rounded-2xl border text-left text-sm font-semibold cursor-pointer transition-all ";

                            if (!quizSubmitted) {
                              cls += isSelected
                                ? "bg-cyan-50 dark:bg-cyan-950/30 border-cyan-400 dark:border-cyan-700 text-cyan-800 dark:text-cyan-200 ring-2 ring-cyan-500/15"
                                : "bg-white dark:bg-neutral-950 border-slate-200 dark:border-neutral-800 text-slate-700 dark:text-neutral-300 hover:border-slate-300 dark:hover:border-neutral-700";
                            } else {
                              if (isThisCorrect) {
                                cls +=
                                  "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-400 dark:border-emerald-700 text-emerald-800 dark:text-emerald-200";
                              } else if (isSelected && !isThisCorrect) {
                                cls +=
                                  "bg-rose-50 dark:bg-rose-950/30 border-rose-400 dark:border-rose-700 text-rose-800 dark:text-rose-300";
                              } else {
                                cls +=
                                  "bg-white dark:bg-neutral-950 border-slate-100 dark:border-neutral-800 text-slate-500 dark:text-neutral-500 opacity-60";
                              }
                            }

                            return (
                              <motion.button
                                key={opt.id}
                                whileHover={
                                  !quizSubmitted ? { scale: 1.01 } : {}
                                }
                                whileTap={
                                  !quizSubmitted ? { scale: 0.99 } : {}
                                }
                                disabled={quizSubmitted}
                                onClick={() => setSelectedAnswer(opt.id)}
                                className={cls}
                              >
                                <span className="font-black text-xs mr-2 opacity-60 uppercase">
                                  {opt.id}.
                                </span>
                                {opt.text}
                              </motion.button>
                            );
                          })}
                        </div>

                        {/* Quiz result message */}
                        {quizSubmitted && (
                          <motion.div
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`p-3.5 rounded-2xl text-center text-xs font-bold ${
                              isCorrectAnswer
                                ? "bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900 text-emerald-700 dark:text-emerald-400"
                                : "bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-400"
                            }`}
                          >
                            {isCorrectAnswer ? (
                              <>
                                <Star className="w-4 h-4 inline mr-1 text-amber-500" />
                                To&apos;g&apos;ri javob! Darsingiz yakunlandi. +50 XP va +15 tanga! 🎉
                              </>
                            ) : (
                              <>
                                ❌ Noto&apos;g&apos;ri. To&apos;g&apos;ri javob: &quot;Pullarning asta-sekin qadrsizlanishi&quot;. Qaytadan urining!
                              </>
                            )}
                          </motion.div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Modal Footer Buttons */}
                <div className="px-6 pb-6 flex items-center justify-between gap-3">
                  {/* Back button (slide 1 onwards) */}
                  {lessonStep > 0 ? (
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => setLessonStep((s) => s - 1)}
                      className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-neutral-800 border border-slate-200 dark:border-neutral-700 text-slate-600 dark:text-neutral-300 text-xs font-bold hover:bg-slate-100 dark:hover:bg-neutral-750 transition-all cursor-pointer"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      Orqaga
                    </motion.button>
                  ) : (
                    <div />
                  )}

                  {/* Next / Submit button */}
                  {lessonStep < 2 ? (
                    <motion.button
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.96 }}
                      onClick={() => setLessonStep((s) => s + 1)}
                      className="flex items-center gap-1.5 px-6 py-2.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-emerald-500 hover:opacity-90 text-white font-bold text-xs cursor-pointer shadow-md transition-all"
                    >
                      {lessonStep === 1 ? "Testga o'tish" : "Davom etish"}
                      <ArrowRight className="w-4 h-4" />
                    </motion.button>
                  ) : (
                    !isCorrectAnswer && (
                      <motion.button
                        whileHover={{ scale: quizSubmitted && !isCorrectAnswer ? 1.04 : 1.04 }}
                        whileTap={{ scale: 0.96 }}
                        onClick={() => {
                          if (quizSubmitted && !isCorrectAnswer) {
                            // Retry
                            setSelectedAnswer(null);
                            setQuizSubmitted(false);
                          } else {
                            handleQuizSubmit();
                          }
                        }}
                        disabled={!selectedAnswer && !quizSubmitted}
                        className={`flex items-center gap-1.5 px-6 py-2.5 rounded-2xl font-bold text-xs cursor-pointer shadow-md transition-all ${
                          !selectedAnswer && !quizSubmitted
                            ? "bg-slate-100 dark:bg-neutral-800 border border-slate-200 dark:border-neutral-700 text-slate-400 dark:text-neutral-500 cursor-not-allowed"
                            : quizSubmitted && !isCorrectAnswer
                            ? "bg-gradient-to-r from-rose-500 to-pink-500 hover:opacity-90 text-white"
                            : "bg-gradient-to-r from-emerald-500 to-cyan-500 hover:opacity-90 text-white"
                        }`}
                      >
                        {quizSubmitted && !isCorrectAnswer ? (
                          <>
                            Qaytadan urish
                            <ChevronRight className="w-4 h-4" />
                          </>
                        ) : (
                          <>
                            Javobni tekshirish
                            <ChevronRight className="w-4 h-4" />
                          </>
                        )}
                      </motion.button>
                    )
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
