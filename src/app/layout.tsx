import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "@/components/providers";
import Link from "next/link";
import { TrendingUp, BarChart3, Star, Search, Bell } from "lucide-react";
import React from "react";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "StockVision — Real-Time Stock Screener & Market Terminal",
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
      <body className="min-h-screen flex flex-col bg-[#f8fafc] text-slate-900 antialiased font-sans">
        <Providers>
          {/* ── Premium Top Navbar ──────────────────────────────────────── */}
          <header className="sticky top-0 z-50 w-full bg-white border-b border-slate-200 shadow-sm">
            <div className="flex h-14 items-center justify-between px-4 lg:px-6">
              {/* Logo / Brand */}
              <div className="flex items-center gap-6">
                <Link href="/" className="flex items-center gap-2.5 group">
                  <div className="p-1.5 bg-blue-600 rounded-lg shadow-sm group-hover:bg-blue-700 transition-colors duration-200">
                    <TrendingUp className="w-4.5 h-4.5 text-white" />
                  </div>
                  <span className="font-bold text-lg tracking-tight text-slate-900">
                    Stock<span className="text-blue-600">Vision</span>
                  </span>
                </Link>

                {/* Navigation Links */}
                <nav className="hidden md:flex items-center gap-1 ml-4">
                  <Link
                    href="/screener"
                    className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                  >
                    <BarChart3 className="w-4 h-4" />
                    <span>Screener</span>
                  </Link>
                  <Link
                    href="/watchlist"
                    className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                  >
                    <Star className="w-4 h-4" />
                    <span>Watchlist</span>
                  </Link>
                </nav>
              </div>

              {/* Right side actions */}
              <div className="flex items-center gap-3">
                {/* Market status indicator */}
                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-green-50 border border-green-200 rounded-full">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse-dot" />
                  <span className="text-xs font-semibold text-green-700">Market Open</span>
                </div>

                {/* Search shortcut */}
                <button className="hidden lg:flex items-center gap-2 px-3 py-1.5 text-sm text-slate-400 bg-slate-50 border border-slate-200 rounded-lg hover:border-blue-300 hover:bg-blue-50/50 transition-colors duration-200 cursor-pointer">
                  <Search className="w-3.5 h-3.5" />
                  <span>Search stocks...</span>
                  <kbd className="ml-4 text-[10px] font-mono bg-white border border-slate-200 rounded px-1.5 py-0.5 text-slate-400">
                    ⌘K
                  </kbd>
                </button>

                {/* Notification */}
                <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                  <Bell className="w-4.5 h-4.5" />
                </button>
              </div>
            </div>
          </header>

          {/* ── Main Content ────────────────────────────────────────────── */}
          <main className="flex-1 flex flex-col">{children}</main>

          {/* ── Footer ──────────────────────────────────────────────────── */}
          <footer className="border-t border-slate-200 bg-white py-4 text-center text-xs text-slate-400">
            <div className="container mx-auto px-4">
              &copy; {new Date().getFullYear()} StockVision Analytics &middot; Data simulated for evaluation purposes &middot; Built with Next.js & React
            </div>
          </footer>
        </Providers>
      </body>
    </html>
  );
}
