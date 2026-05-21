import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "MoliyaGo — O'yinlashtirilgan Moliyaviy Savodxonlik",
  description:
    "Yoshlar uchun mo'ljallangan o'yinlashtirilgan moliyaviy savodxonlik platformasi. Pul boshqarishni o'yin orqali o'rganing!",
  keywords: [
    "moliyaviy savodxonlik",
    "gamification",
    "pul boshqarish",
    "yoshlar uchun",
    "o'zbek",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="uz" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme') || 'light';
                  document.documentElement.className = theme;
                } catch (e) {}
              })()
            `,
          }}
        />
      </head>
      <body className="antialiased min-h-screen">
        <Providers>
          {/* Background grid & ambient glow effects */}
          <div className="bg-grid-pattern" />
          <div className="cyber-bg fixed inset-0 z-0 pointer-events-none" />

          {/* Main content */}
          <div className="relative z-10">{children}</div>
        </Providers>
      </body>
    </html>
  );
}
