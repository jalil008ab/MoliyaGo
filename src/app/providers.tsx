"use client";

import { NextUIProvider } from "@nextui-org/react";
import { UserProvider, useUser } from "@/context/UserContext";
import { useEffect } from "react";

function ThemeApplier({ children }: { children: React.ReactNode }) {
  const { user } = useUser();

  useEffect(() => {
    const htmlEl = document.documentElement;
    
    // Remove all previous theme classes
    htmlEl.classList.forEach((cls) => {
      if (cls.startsWith("theme-")) {
        htmlEl.classList.remove(cls);
      }
    });

    // Apply activeTheme class if not default
    if (user.activeTheme && user.activeTheme !== "default") {
      htmlEl.classList.add(user.activeTheme);
    }
  }, [user.activeTheme]);

  return <>{children}</>;
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NextUIProvider>
      <UserProvider>
        <ThemeApplier>{children}</ThemeApplier>
      </UserProvider>
    </NextUIProvider>
  );
}

