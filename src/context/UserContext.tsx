"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

export interface Transaction {
  id: string;
  type: "income" | "expense";
  amount: number;
  title: string;
  category: string;
  date: string;
}

export interface UserData {
  name: string;
  age: number;
  occupation: "student" | "university" | "worker";
  goalName: string;
  goalEmoji: string;
  targetAmount: number;
  savingsCapacity: number;
  balance: number;
  xp: number;
  coins: number;
  streak: number;
  savedAmount: number;
  questsCompleted: number;
  totalQuests: number;
  hasOnboarded: boolean;
  notifications: Notification[];
  level: number;
  transactions: Transaction[];
  purchasedItems: string[];
  activeTheme: string;
  activeFrame: string;
  activeBadge: string;
  activeScene: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: "success" | "warning" | "info" | "reward";
  time: string;
  read: boolean;
}

const defaultUser: UserData = {
  name: "",
  age: 0,
  occupation: "student",
  goalName: "",
  goalEmoji: "🎯",
  targetAmount: 0,
  savingsCapacity: 0,
  balance: 0,
  xp: 100,
  coins: 50,
  streak: 1,
  savedAmount: 0,
  questsCompleted: 0,
  totalQuests: 30,
  hasOnboarded: false,
  notifications: [],
  level: 1,
  transactions: [],
  purchasedItems: [],
  activeTheme: "default",
  activeFrame: "default",
  activeBadge: "",
  activeScene: "default",
};

interface UserContextType {
  user: UserData;
  onboardUser: (data: Partial<UserData>) => void;
  addMoney: (amount: number) => boolean;
  spendMoney: (amount: number) => void;
  completeQuest: (xpReward: number, coinReward: number) => void;
  handleAISituation: (xpReward: number, coinReward: number, balanceChange: number, savedChange: number) => void;
  updateProfile: (data: Partial<UserData>) => void;
  resetData: () => void;
  addNotification: (notification: Omit<Notification, "id" | "time" | "read">) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  addTransaction: (type: "income" | "expense", amount: number, title: string, category: string) => void;
  deleteTransaction: (id: string) => void;
  spendCoins: (amount: number) => boolean;
  purchaseItem: (itemId: string, cost: number, category: string) => boolean;
  activateItem: (itemId: string, category: string) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

function calculateLevel(xp: number): number {
  return Math.floor(xp / 500) + 1;
}

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserData>(defaultUser);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("moliyago_user");
      if (stored) {
        const parsed = JSON.parse(stored);
        setUser({
          ...defaultUser,
          ...parsed,
          level: calculateLevel(parsed.xp || 100),
          transactions: parsed.transactions || defaultUser.transactions,
          purchasedItems: parsed.purchasedItems || [],
          activeTheme: parsed.activeTheme || "default",
          activeFrame: parsed.activeFrame || "default",
          activeBadge: parsed.activeBadge || "",
          activeScene: parsed.activeScene || "default",
        });
      }
    } catch {
      // ignore parse errors
    }
    setIsHydrated(true);
  }, []);

  // Persist to localStorage on change
  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem("moliyago_user", JSON.stringify(user));
    }
  }, [user, isHydrated]);

  // Online global leaderboard real-time synchronization
  useEffect(() => {
    if (isHydrated && user.name) {
      const syncLeaderboard = async () => {
        try {
          const res = await fetch("https://kvdb.io/KxM6QnLq2P9fU8yX5z9Q/leaderboard_v2");
          let currentList: any[] = [];
          if (res.ok) {
            currentList = await res.json();
          }
          if (!Array.isArray(currentList)) {
            currentList = [];
          }

          const existingIndex = currentList.findIndex((u) => u.name === user.name);
          const userData = {
            id: user.name,
            name: user.name,
            xp: user.xp,
            level: user.level,
            activeFrame: user.activeFrame,
            activeBadge: user.activeBadge,
            updatedAt: Date.now()
          };

          if (existingIndex > -1) {
            if (currentList[existingIndex].xp < user.xp || currentList[existingIndex].name !== user.name) {
              currentList[existingIndex] = userData;
            }
          } else {
            currentList.push(userData);
          }

          const updatedList = currentList
            .sort((a, b) => b.xp - a.xp)
            .slice(0, 50);

          await fetch("https://kvdb.io/KxM6QnLq2P9fU8yX5z9Q/leaderboard_v2", {
            method: "POST",
            body: JSON.stringify(updatedList),
            headers: { "Content-Type": "application/json" }
          });
        } catch (e) {
          // fail silently
        }
      };
      const timer = setTimeout(syncLeaderboard, 2000);
      return () => clearTimeout(timer);
    }
  }, [user.name, user.xp, user.level, user.activeFrame, user.activeBadge, isHydrated]);

  const onboardUser = useCallback((data: Partial<UserData>) => {
    setUser((prev) => {
      const newUser = {
        ...prev,
        ...data,
        hasOnboarded: true,
        balance: 0,
        xp: 100,
        coins: 50,
        streak: 1,
        savedAmount: 0,
        questsCompleted: 0,
        level: 1,
        transactions: [],
        notifications: [
          {
            id: "welcome",
            title: "Xush kelibsiz! 🎉",
            message: `${data.name || "Do'stim"}, MoliyaGo platformasiga xush kelibsiz! Har kuni o'rganing va pul tejashni o'yinga aylantiring.`,
            type: "success" as const,
            time: new Date().toLocaleTimeString("uz-UZ", { hour: "2-digit", minute: "2-digit" }),
            read: false,
          },
          {
            id: "first-goal",
            title: "Birinchi maqsad yaratildi 🎯",
            message: `"${data.goalName || "Maqsad"}" maqsadingiz uchun jamg'arish boshlandi! Hamyoningizdan pul o'tkazib maqsadga erishing.`,
            type: "info" as const,
            time: new Date().toLocaleTimeString("uz-UZ", { hour: "2-digit", minute: "2-digit" }),
            read: false,
          },
        ],
      };
      return newUser;
    });
  }, []);

  // Move money from Hamyon (balance) to Jamg'arma (savedAmount)
  const addMoney = useCallback((amount: number): boolean => {
    let success = false;
    setUser((prev) => {
      if (prev.balance < amount) {
        // Not enough money in Hamyon
        return prev;
      }
      success = true;
      const newSaved = prev.savedAmount + amount;
      const newBalance = prev.balance - amount;
      const newXp = prev.xp + 30; // +30 XP reward for savings
      const newTx: Transaction = {
        id: Date.now().toString(),
        type: "expense",
        amount,
        title: `Jamg'armaga o'tkazildi (${prev.goalName})`,
        category: "Jamg'arma",
        date: new Date().toLocaleDateString("uz-UZ", { day: "numeric", month: "short" }),
      };

      return {
        ...prev,
        savedAmount: newSaved,
        balance: newBalance,
        xp: newXp,
        coins: prev.coins + 15, // +15 Coins reward
        level: calculateLevel(newXp),
        transactions: [newTx, ...prev.transactions],
      };
    });
    return success;
  }, []);

  const spendMoney = useCallback((amount: number) => {
    setUser((prev) => ({
      ...prev,
      balance: Math.max(0, prev.balance - amount),
    }));
  }, []);

  const completeQuest = useCallback((xpReward: number, coinReward: number) => {
    setUser((prev) => {
      const newXp = prev.xp + xpReward;
      return {
        ...prev,
        xp: newXp,
        coins: prev.coins + coinReward,
        questsCompleted: prev.questsCompleted + 1,
        level: calculateLevel(newXp),
      };
    });
  }, []);

  const handleAISituation = useCallback((xpReward: number, coinReward: number, balanceChange: number, savedChange: number) => {
    setUser((prev) => {
      const newXp = prev.xp + xpReward;
      const newBalance = Math.max(0, prev.balance + balanceChange);
      const newSaved = Math.max(0, prev.savedAmount + savedChange);

      const txs: Transaction[] = [];
      if (balanceChange !== 0) {
        txs.push({
          id: `ai-${Date.now()}-bal`,
          type: balanceChange > 0 ? "income" : "expense",
          amount: Math.abs(balanceChange),
          title: "AI Vaziyat qarori natijasi",
          category: "Simulyatsiya",
          date: new Date().toLocaleDateString("uz-UZ", { day: "numeric", month: "short" }),
        });
      }
      if (savedChange !== 0) {
        txs.push({
          id: `ai-${Date.now()}-save`,
          type: savedChange > 0 ? "expense" : "income", // putting in savings is like an expense from balance
          amount: Math.abs(savedChange),
          title: `Jamg'arma o'zgarishi (${prev.goalName})`,
          category: "Jamg'arma",
          date: new Date().toLocaleDateString("uz-UZ", { day: "numeric", month: "short" }),
        });
      }

      return {
        ...prev,
        xp: newXp,
        coins: prev.coins + coinReward,
        balance: newBalance,
        savedAmount: newSaved,
        level: calculateLevel(newXp),
        transactions: [...txs, ...prev.transactions],
      };
    });
  }, []);

  const updateProfile = useCallback((data: Partial<UserData>) => {
    setUser((prev) => ({ ...prev, ...data }));
  }, []);

  const resetData = useCallback(() => {
    localStorage.removeItem("moliyago_user");
    setUser(defaultUser);
  }, []);

  const addNotification = useCallback((notification: Omit<Notification, "id" | "time" | "read">) => {
    const newNotif: Notification = {
      ...notification,
      id: Date.now().toString(),
      time: new Date().toLocaleTimeString("uz-UZ", { hour: "2-digit", minute: "2-digit" }),
      read: false,
    };
    setUser((prev) => ({
      ...prev,
      notifications: [newNotif, ...prev.notifications].slice(0, 20),
    }));
  }, []);

  const markNotificationRead = useCallback((id: string) => {
    setUser((prev) => ({
      ...prev,
      notifications: prev.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      ),
    }));
  }, []);

  const markAllNotificationsRead = useCallback(() => {
    setUser((prev) => ({
      ...prev,
      notifications: prev.notifications.map((n) => ({ ...n, read: true })),
    }));
  }, []);

  const addTransaction = useCallback((type: "income" | "expense", amount: number, title: string, category: string) => {
    setUser((prev) => {
      const newTx: Transaction = {
        id: Date.now().toString(),
        type,
        amount,
        title: title.trim() || (type === "income" ? "Kutilmagan daromad" : "Mayda xarajat"),
        category: category || "Boshqa",
        date: new Date().toLocaleDateString("uz-UZ", { day: "numeric", month: "short" }),
      };

      const balanceChange = type === "income" ? amount : -amount;
      const newBalance = Math.max(0, prev.balance + balanceChange);
      
      const newXp = prev.xp + 10; // +10 XP for logging a transaction! High financial literacy!
      
      // Let's create an automatic notification for log!
      const newNotif: Notification = {
        id: `tx-notif-${Date.now()}`,
        title: type === "income" ? "Daromad qayd etildi! 💰" : "Xarajat qayd etildi! 💸",
        message: `"${newTx.title}" muvaffaqiyatli qo'shildi. ${type === "income" ? "+" : "-"}${amount.toLocaleString()} so'm. O'z moliyangizni kuzatganingiz uchun +10 XP!`,
        type: type === "income" ? "success" : "warning",
        time: new Date().toLocaleTimeString("uz-UZ", { hour: "2-digit", minute: "2-digit" }),
        read: false,
      };

      return {
        ...prev,
        balance: newBalance,
        xp: newXp,
        level: calculateLevel(newXp),
        transactions: [newTx, ...prev.transactions],
        notifications: [newNotif, ...prev.notifications].slice(0, 20),
      };
    });
  }, []);

  const deleteTransaction = useCallback((id: string) => {
    setUser((prev) => {
      const tx = prev.transactions.find((t) => t.id === id);
      if (!tx) return prev;
      const balanceChange = tx.type === "income" ? -tx.amount : tx.amount;
      const newBalance = Math.max(0, prev.balance + balanceChange);
      return { ...prev, balance: newBalance, transactions: prev.transactions.filter((t) => t.id !== id) };
    });
  }, []);

  const spendCoins = useCallback((amount: number): boolean => {
    let success = false;
    setUser((prev) => {
      if (prev.coins < amount) return prev;
      success = true;
      return { ...prev, coins: prev.coins - amount };
    });
    return success;
  }, []);

  const purchaseItem = useCallback((itemId: string, cost: number, category: string): boolean => {
    let success = false;
    setUser((prev) => {
      if (prev.coins < cost) return prev;
      if (prev.purchasedItems.includes(itemId)) return prev;
      success = true;
      const updates: Partial<UserData> = {
        coins: prev.coins - cost,
        purchasedItems: [...prev.purchasedItems, itemId],
      };
      // Auto-activate on purchase
      if (category === "theme") updates.activeTheme = itemId;
      else if (category === "frame") updates.activeFrame = itemId;
      else if (category === "badge") updates.activeBadge = itemId;
      else if (category === "scene") updates.activeScene = itemId;
      const notif: Notification = {
        id: `shop-${Date.now()}`,
        title: "Xarid muvaffaqiyatli! 🛍️",
        message: `Yangi item sotib olindi va faollashtirildi! -${cost} 🪙`,
        type: "reward",
        time: new Date().toLocaleTimeString("uz-UZ", { hour: "2-digit", minute: "2-digit" }),
        read: false,
      };
      return { ...prev, ...updates, notifications: [notif, ...prev.notifications].slice(0, 20) };
    });
    return success;
  }, []);

  const activateItem = useCallback((itemId: string, category: string) => {
    setUser((prev) => {
      if (!prev.purchasedItems.includes(itemId) && itemId !== "default") return prev;
      const updates: Partial<UserData> = {};
      if (category === "theme") updates.activeTheme = itemId;
      else if (category === "frame") updates.activeFrame = itemId;
      else if (category === "badge") updates.activeBadge = itemId;
      else if (category === "scene") updates.activeScene = itemId;
      return { ...prev, ...updates };
    });
  }, []);

  // Don't render children until hydrated to avoid hydration mismatches
  if (!isHydrated) {
    return null;
  }

  return (
    <UserContext.Provider
      value={{
        user,
        onboardUser,
        addMoney,
        spendMoney,
        completeQuest,
        handleAISituation,
        updateProfile,
        resetData,
        addNotification,
        markNotificationRead,
        markAllNotificationsRead,
        addTransaction,
        deleteTransaction,
        spendCoins,
        purchaseItem,
        activateItem,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
