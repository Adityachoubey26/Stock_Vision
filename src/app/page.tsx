"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Cpu,
  Layers,
  ArrowRight,
  Shield,
  Zap,
  BarChart3,
  SlidersHorizontal,
  ChevronRight,
  Hexagon,
  Sparkles,
} from "lucide-react";

// Mock Data for the Ticker Ribbon
const INITIAL_TICKER_DATA = [
  { symbol: "RELIANCE", price: 2942.50, change: 1.45 },
  { symbol: "TCS", price: 3824.15, change: -0.82 },
  { symbol: "INFY", price: 1562.80, change: 2.10 },
  { symbol: "HDFCBANK", price: 1648.30, change: 0.65 },
  { symbol: "ICICIBANK", price: 1124.90, change: 1.88 },
  { symbol: "BHARTIARTL", price: 1385.00, change: -1.20 },
  { symbol: "SBI", price: 842.15, change: 3.42 },
  { symbol: "L&T", price: 3512.40, change: 0.95 },
  { symbol: "ITC", price: 428.60, change: -0.15 },
  { symbol: "TATASTEEL", price: 168.45, change: 2.75 },
];

// Mock Data for the Interactive Widget Preview
const WIDGET_CATEGORIES = {
  gainers: [
    { symbol: "SBI", name: "State Bank of India", price: 842.15, change: 3.42, volume: "18.4M" },
    { symbol: "TATASTEEL", name: "Tata Steel Ltd.", price: 168.45, change: 2.75, volume: "22.1M" },
    { symbol: "INFY", name: "Infosys Ltd.", price: 1562.80, change: 2.10, volume: "6.8M" },
    { symbol: "ICICIBANK", name: "ICICI Bank Ltd.", price: 1124.90, change: 1.88, volume: "11.2M" },
  ],
  volume: [
    { symbol: "RELIANCE", name: "Reliance Industries", price: 2942.50, change: 1.45, volume: "45.2M" },
    { symbol: "TATASTEEL", name: "Tata Steel Ltd.", price: 168.45, change: 2.75, volume: "22.1M" },
    { symbol: "HDFCBANK", name: "HDFC Bank Ltd.", price: 1648.30, change: 0.65, volume: "19.5M" },
    { symbol: "SBI", name: "State Bank of India", price: 842.15, change: 3.42, volume: "18.4M" },
  ],
  beta: [
    { symbol: "ADANIENT", name: "Adani Enterprises", price: 3120.40, change: -4.85, volume: "4.2M" },
    { symbol: "TATASTEEL", name: "Tata Steel Ltd.", price: 168.45, change: 2.75, volume: "22.1M" },
    { symbol: "SBI", name: "State Bank of India", price: 842.15, change: 3.42, volume: "18.4M" },
    { symbol: "INFY", name: "Infosys Ltd.", price: 1562.80, change: 2.10, volume: "6.8M" },
  ],
};

export default function LandingPage() {
  const [tickerData, setTickerData] = useState(INITIAL_TICKER_DATA);
  const [activeTab, setActiveTab] = useState<"gainers" | "volume" | "beta">("gainers");
  const [previewStocks, setPreviewStocks] = useState(WIDGET_CATEGORIES.gainers);
  const [priceFlash, setPriceFlash] = useState<Record<string, "up" | "down" | null>>({});

  // Live Simulation for ticker and widget data
  useEffect(() => {
    const timer = setInterval(() => {
      // Randomly fluctuation a stock price in the ticker
      setTickerData((prev) =>
        prev.map((item) => {
          const isFlipped = Math.random() > 0.7;
          if (!isFlipped) return item;
          const pct = (Math.random() * 0.4 - 0.2) / 100;
          const newPrice = parseFloat((item.price * (1 + pct)).toFixed(2));
          const newChange = parseFloat((item.change + pct * 100).toFixed(2));
          return { ...item, price: newPrice, change: newChange };
        })
      );

      // Randomly fluctuate a stock price in the interactive widget
      setPreviewStocks((prev) =>
        prev.map((item) => {
          const isFlipped = Math.random() > 0.6;
          if (!isFlipped) return item;
          const direction = Math.random() > 0.5 ? 1 : -1;
          const changeVal = (Math.random() * 0.15 * direction);
          const newPrice = parseFloat((item.price + changeVal).toFixed(2));
          const newChange = parseFloat((item.change + changeVal / 10).toFixed(2));

          // Set trigger flash status
          const symbol = item.symbol;
          setPriceFlash((prevFlash) => ({
            ...prevFlash,
            [symbol]: direction > 0 ? "up" : "down",
          }));

          // Clear flash status after 300ms
          setTimeout(() => {
            setPriceFlash((prevFlash) => ({
              ...prevFlash,
              [symbol]: null,
            }));
          }, 300);

          return { ...item, price: newPrice, change: newChange };
        })
      );
    }, 2000);

    return () => clearInterval(timer);
  }, []);

  // Update preview table when tab changes
  useEffect(() => {
    setPreviewStocks(WIDGET_CATEGORIES[activeTab]);
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-[#070b13] text-slate-700 flex flex-col selection:bg-blue-600/30 overflow-x-hidden">
      
      {/* Background Glowing Orbs */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none z-0" />
      <div className="absolute top-[40%] right-[-10%] w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none z-0" />

      {/* ── Header / Navbar ──────────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 w-full bg-[#0c101b]/80 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-emerald-500/10 text-emerald-400 rounded border border-emerald-500/20">
              <Hexagon className="w-6 h-6 fill-emerald-500/10" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-extrabold text-[14px] sm:text-[16px] tracking-wider text-slate-900 uppercase font-mono">
                Zetheta Alpha
              </span>
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                Institutional Terminal
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden xs:flex items-center gap-2 px-3 py-1 bg-slate-800/40 border border-slate-700/50 rounded-full">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-[10px] font-bold tracking-wider text-emerald-400 uppercase font-mono">
                Feed: Active
              </span>
            </div>
            
            <Link
              href="/dashboard"
              className="relative inline-flex items-center gap-1.5 px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-[#ffffff] text-xs font-bold rounded-lg border border-blue-500 shadow-[0_0_15px_rgba(37,99,235,0.25)] hover:shadow-[0_0_20px_rgba(37,99,235,0.45)] transition-all active:scale-[0.98]"
            >
              Launch Terminal
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* ── Live Scrolling Ticker Ribbon ─────────────────────────────────── */}
      <div className="w-full bg-[#0c101b] border-b border-slate-800/80 py-2.5 overflow-hidden relative z-10 select-none">
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[#070b13] to-transparent z-15 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#070b13] to-transparent z-15 pointer-events-none" />
        
        <div className="flex whitespace-nowrap animate-[marquee_25s_linear_infinite] hover:[animation-play-state:paused] gap-8">
          {/* Double content to ensure infinite scroll loop */}
          {[...tickerData, ...tickerData].map((item, idx) => {
            const isUp = item.change >= 0;
            return (
              <div
                key={idx}
                className="inline-flex items-center gap-2.5 border border-slate-800 bg-slate-900/40 rounded-lg px-3 py-1 text-slate-600 transition-colors hover:border-blue-500/30"
              >
                <span className="text-[10px] font-bold font-mono tracking-wider">
                  {item.symbol}
                </span>
                <span className="text-xs font-bold font-mono">
                  {item.price.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                </span>
                <span
                  className={`text-[10px] font-bold font-mono ${
                    isUp ? "text-emerald-400" : "text-rose-400"
                  }`}
                >
                  {isUp ? "▲ +" : "▼ "}
                  {item.change.toFixed(2)}%
                </span>
              </div>
            );
          })}
        </div>

        <style jsx global>{`
          @keyframes marquee {
            0% { transform: translateX(0%); }
            100% { transform: translateX(-50%); }
          }
        `}</style>
      </div>

      {/* ── Hero Section ─────────────────────────────────────────────────── */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20 text-center z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-6"
        >
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-500/10 border border-blue-500/25 rounded-full text-blue-400 text-xs font-bold tracking-wide uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            Institutional Grade Stock Analytics
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-900 max-w-4xl mx-auto leading-[1.15]">
            Screen 5000+ Stocks in{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-300 to-emerald-400">
              Real-Time
            </span>
          </h1>

          <p className="text-slate-400 text-sm sm:text-lg max-w-2xl mx-auto leading-relaxed">
            High-frequency market scanner powered by streaming WebSockets. Apply complex technical criteria, filter instantly, and track watchlists with sub-50ms latency.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/dashboard"
              className="w-full sm:w-auto px-8 py-3 bg-blue-600 hover:bg-blue-700 text-[#ffffff] font-bold rounded-xl border border-blue-500 shadow-lg hover:shadow-blue-500/30 transition-all flex items-center justify-center gap-2 group cursor-pointer"
            >
              Launch Stock Terminal
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/screener"
              className="w-full sm:w-auto px-8 py-3 bg-slate-900/60 hover:bg-slate-800/80 text-slate-700 hover:text-[#ffffff] font-bold rounded-xl border border-slate-800 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <SlidersHorizontal className="w-4 h-4 text-slate-400" />
              Explore Live Screener
            </Link>
          </div>
        </motion.div>
      </section>

      {/* ── Interactive Mock Screener Widget Preview ───────────────────── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative rounded-2xl border border-slate-800 bg-[#0c101b]/70 backdrop-blur-md shadow-2xl p-4 sm:p-6 overflow-hidden"
        >
          {/* Header Panel Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-4 border-b border-slate-800 gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-rose-500" />
              <div className="w-3 h-3 rounded-full bg-amber-500" />
              <div className="w-3 h-3 rounded-full bg-emerald-500" />
              <span className="text-[11px] font-bold font-mono text-slate-500 ml-2 uppercase tracking-widest">
                Interactive_Screener_Widget
              </span>
            </div>

            {/* Selector tabs */}
            <div className="flex bg-slate-900/80 p-1 border border-slate-850 rounded-lg self-start sm:self-auto">
              {(["gainers", "volume", "beta"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 py-1.5 rounded-md text-[10px] sm:text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                    activeTab === tab
                      ? "bg-blue-600 text-[#ffffff] shadow-sm"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  {tab === "gainers" ? "Top Gainers" : tab === "volume" ? "High Volume" : "High Beta"}
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Screener Table */}
          <div className="overflow-x-auto scrollbar-thin">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-850 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                  <th className="py-3 px-4">Ticker</th>
                  <th className="py-3 px-4">Company Name</th>
                  <th className="py-3 px-4 text-right">LTP (₹)</th>
                  <th className="py-3 px-4 text-right">Change (%)</th>
                  <th className="py-3 px-4 text-right">24H Volume</th>
                  <th className="py-3 px-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-850 text-xs sm:text-sm">
                <AnimatePresence mode="wait">
                  {previewStocks.map((stock) => {
                    const flash = priceFlash[stock.symbol];
                    const isUp = stock.change >= 0;

                    return (
                      <motion.tr
                        key={stock.symbol}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className={`hover:bg-slate-900/30 transition-colors ${
                          flash === "up" ? "bg-emerald-500/10" : flash === "down" ? "bg-rose-500/10" : ""
                        }`}
                      >
                        <td className="py-3.5 px-4 font-bold font-mono tracking-wider text-slate-800">
                          {stock.symbol}
                        </td>
                        <td className="py-3.5 px-4 text-slate-450 font-medium">
                          {stock.name}
                        </td>
                        <td className="py-3.5 px-4 text-right font-mono text-slate-900 font-semibold">
                          ₹{stock.price.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded font-mono text-xs font-bold ${
                              isUp
                                ? "text-emerald-400 bg-emerald-500/10 border border-emerald-500/20"
                                : "text-rose-400 bg-rose-500/10 border border-rose-500/20"
                            }`}
                          >
                            {isUp ? "+" : ""}
                            {stock.change.toFixed(2)}%
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right font-mono text-slate-700 font-medium">
                          {stock.volume}
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <Link
                            href={`/screener`}
                            className="inline-flex items-center gap-1 text-[10px] font-bold text-blue-400 hover:text-blue-300 uppercase tracking-wider"
                          >
                            Trade
                            <ChevronRight className="w-3.5 h-3.5" />
                          </Link>
                        </td>
                      </motion.tr>
                    );
                  })}
                </AnimatePresence>
              </tbody>
            </table>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-850 flex justify-between items-center text-[10px] text-slate-500 font-medium uppercase font-mono">
            <span>● Streaming Live via Simulated feeds</span>
            <Link href="/screener" className="text-blue-400 hover:underline">
              View all 5,000+ stocks →
            </Link>
          </div>
        </motion.div>
      </section>

      {/* ── Features Showcase ─────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-28 z-10">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900">
            Engineered for Modern Traders
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto text-sm sm:text-base">
            Professional dashboard with tools designed for speed, flexibility, and robust data analytics.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: Cpu,
              title: "WebSocket Data Streams",
              desc: "Experience high-frequency real-time stock updates streaming with minimal latency directly to your browser viewport.",
            },
            {
              icon: SlidersHorizontal,
              title: "Advanced Screener Filters",
              desc: "Screen stocks across market cap, volume, beta, moving averages, and custom RSI thresholds simultaneously.",
            },
            {
              icon: Layers,
              title: "High-Performance Tables",
              desc: "Fluid virtual scrolling rendering 5000+ rows instantly. No lags, no stuttering, maximum speed.",
            },
            {
              icon: BarChart3,
              title: "Lightweight Interactive Charts",
              desc: "Deep-dive into historic trends with smooth candlestick charts, volume metrics, and customizable timeframes.",
            },
            {
              icon: Shield,
              title: "Virtual Portfolios",
              desc: "Organize stocks in customized watchlists, analyze aggregate performance, and monitor changes.",
            },
            {
              icon: Zap,
              title: "Technical Breakout Alerts",
              desc: "Identify potential market entries through automated alerts for volume bursts, price crossovers, and key index swings.",
            },
          ].map((feat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="bg-[#0c101b] border border-slate-800 p-6 rounded-xl hover:border-blue-500/30 transition-all flex flex-col justify-between group"
            >
              <div className="space-y-4">
                <div className="p-2.5 bg-blue-500/10 text-blue-400 rounded-lg border border-blue-500/20 w-fit group-hover:scale-105 transition-transform">
                  <feat.icon className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-300 transition-colors">
                  {feat.title}
                </h3>
                <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                  {feat.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Call To Action Footer ────────────────────────────────────────── */}
      <section className="bg-[#0c101b] border-t border-slate-800 py-16 text-center relative z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <h2 className="text-3xl font-extrabold text-slate-900">
            Ready to track the market like a pro?
          </h2>
          <p className="text-slate-400 max-w-lg mx-auto text-sm">
            Unlock the ultimate browser-based terminal. No subscription needed for the beta test.
          </p>
          <div className="pt-2">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-[#ffffff] font-bold rounded-xl border border-blue-500 shadow-lg hover:shadow-blue-500/30 transition-all active:scale-[0.98] cursor-pointer"
            >
              Access Zetheta Alpha Terminal
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          
          <div className="text-[10px] text-slate-500 uppercase tracking-widest pt-8">
            &copy; {new Date().getFullYear()} Zetheta Alpha. All Rights Reserved. Built with Next.js & Framer Motion.
          </div>
        </div>
      </section>
    </div>
  );
}
