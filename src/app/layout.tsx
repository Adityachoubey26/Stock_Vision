import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "@/components/providers";
import React from "react";
import { TerminalLayout } from "@/components/terminal-layout";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Zetheta Alpha — Real-Time Stock Screener & Market Terminal",
  description:
    "High-performance real-time financial market analytics dashboard. Screen 5000+ NSE/BSE stocks with advanced filtering, virtual scrolling, and candlestick charts.",
  keywords: ["stock screener", "NSE", "BSE", "market analytics", "real-time", "fintech"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen flex flex-col bg-slate-50 text-slate-900 antialiased font-sans">
        <Providers>
          <TerminalLayout>{children}</TerminalLayout>
        </Providers>
      </body>
    </html>
  );
}
