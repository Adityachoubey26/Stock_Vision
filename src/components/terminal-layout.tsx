"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BarChart3,
  SlidersHorizontal,
  Star,
  TrendingUp,
  Compass,
  Newspaper,
  Briefcase,
  Bell,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  Hexagon,
  Search,
  RefreshCw,
  Sparkles,
} from "lucide-react";
import { useScreenerStore } from "@/store/use-screener-store";
import { ConnectionStatus } from "./connection-status";

interface NavItem {
  href: string;
  label: string;
  Icon: React.ComponentType<{ className?: string }>;
  disabled?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", Icon: LayoutDashboard },
  { href: "/screener", label: "Stock Screener", Icon: BarChart3 },
  { href: "/technical-screener", label: "Technical Screen", Icon: SlidersHorizontal },
  { href: "/watchlist", label: "My Watchlist", Icon: Star },
  { href: "/analytics", label: "Chart Analysis", Icon: TrendingUp },
  { href: "/market-overview", label: "Market Overview", Icon: Compass },
  { href: "#", label: "News & Events", Icon: Newspaper, disabled: true },
  { href: "#", label: "Portfolio", Icon: Briefcase, disabled: true },
  { href: "#", label: "Alerts", Icon: Bell, disabled: true },
];

export function TerminalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState("");
  const { searchQuery, setSearchQuery, resetFilters } = useScreenerStore();

  // Simulated live indices values in header
  const [niftyVal, setNiftyVal] = useState(24812.25);
  const [niftyChg, setNiftyChg] = useState(1.35);
  const [sensexVal, setSensexVal] = useState(81458.66);
  const [sensexChg, setSensexChg] = useState(1.28);
  const [bankNiftyVal, setBankNiftyVal] = useState(55362.45);
  const [bankNiftyChg, setBankNiftyChg] = useState(1.65);

  // Fluctuations for indices
  useEffect(() => {
    const timer = setInterval(() => {
      setNiftyVal((prev) => parseFloat((prev + (Math.random() * 6 - 2.8)).toFixed(2)));
      setNiftyChg((prev) => parseFloat((prev + (Math.random() * 0.04 - 0.02)).toFixed(2)));
      setSensexVal((prev) => parseFloat((prev + (Math.random() * 18 - 8.5)).toFixed(2)));
      setSensexChg((prev) => parseFloat((prev + (Math.random() * 0.04 - 0.02)).toFixed(2)));
      setBankNiftyVal((prev) => parseFloat((prev + (Math.random() * 14 - 6.5)).toFixed(2)));
      setBankNiftyChg((prev) => parseFloat((prev + (Math.random() * 0.04 - 0.02)).toFixed(2)));
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  // Update clock every second
  useEffect(() => {
    const updateTime = () => {
      const date = new Date();
      setCurrentTime(
        date.toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        }) + " IST"
      );
    };
    updateTime();
    const clockTimer = setInterval(updateTime, 1000);
    return () => clearInterval(clockTimer);
  }, []);

  const handleResetAll = () => {
    resetFilters();
    setSearchQuery("");
  };



  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-50 text-slate-900 font-sans">
      
      {/* ── Desktop Sidebar ────────────────────────────────────────────── */}
      <aside
        className={`hidden md:flex flex-col flex-shrink-0 bg-white border-r border-slate-200 select-none z-30 transition-all duration-300 relative ${
          isSidebarExpanded ? "w-60" : "w-16"
        }`}
      >
        {/* Sidebar Header / Logo */}
        <div className="flex h-14 items-center justify-between px-4 border-b border-slate-200">
          <div className="flex items-center gap-2 overflow-hidden">
            <div className="p-1 bg-emerald-500/10 text-emerald-500 rounded border border-emerald-500/20 shrink-0">
              <Hexagon className="w-5 h-5 fill-emerald-500/20" />
            </div>
            {isSidebarExpanded && (
              <div className="flex flex-col leading-none">
                <span className="font-extrabold text-[13px] tracking-wider text-slate-900 uppercase">
                  Zetheta Alpha
                </span>
                <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                  Institutional Terminal
                </span>
              </div>
            )}
          </div>
          {isSidebarExpanded && (
            <button
              onClick={() => setIsSidebarExpanded(false)}
              className="p-1 hover:bg-slate-100 hover:text-slate-800 text-slate-400 rounded-lg transition-colors cursor-pointer"
              title="Collapse Sidebar"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 overflow-y-auto scrollbar-thin p-3 space-y-1">
          {NAV_ITEMS.map((item, idx) => {
            const isActive = pathname === item.href;
            const linkContent = (
              <>
                <item.Icon className={`w-4 h-4 shrink-0 transition-colors ${isActive ? "text-blue-500" : "text-slate-400 group-hover:text-blue-500"}`} />
                {isSidebarExpanded && (
                  <span className="truncate text-xs font-semibold">{item.label}</span>
                )}
                {item.disabled && isSidebarExpanded && (
                  <span className="ml-auto text-[8px] font-extrabold bg-slate-100/50 border border-slate-200/20 text-slate-400 px-1 rounded uppercase tracking-wider scale-90">
                    Mock
                  </span>
                )}
              </>
            );

            if (item.disabled) {
              return (
                <div
                  key={idx}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg opacity-50 cursor-not-allowed text-slate-400 select-none`}
                >
                  {linkContent}
                </div>
              );
            }

            return (
              <Link
                key={idx}
                href={item.href}
                className={`group flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-150 ${
                  isActive
                    ? "bg-blue-50 text-blue-500 font-bold border-l-2 border-blue-500"
                    : "text-slate-500 hover:text-blue-500 hover:bg-blue-50/40"
                }`}
              >
                {linkContent}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer Info */}
        <div className="p-3 border-t border-slate-200 space-y-3">
          {isSidebarExpanded && (
            <div className="premium-glass-card border border-blue-500/10 p-3 rounded-xl flex flex-col relative overflow-hidden group">
              <div className="absolute right-0 top-0 p-1 text-blue-500 bg-blue-500/5 rounded-bl-xl">
                <Sparkles className="w-3 h-3 animate-pulse" />
              </div>
              <span className="text-[10px] font-bold text-blue-500 uppercase tracking-wider">Upgrade to Pro</span>
              <span className="text-[9px] text-slate-400 mt-1 leading-snug">
                Unlock advanced filters, high-frequency backtests & AI analysis.
              </span>
              <button 
                onClick={() => alert("Pro Tier Membership (Backtesting, Live Screener API, and Custom Screener Rules) will be activated for this terminal in the upcoming release. Thank you for your interest!")}
                className="w-full text-center bg-blue-600 hover:bg-blue-700 text-white font-bold text-[9px] py-1.5 rounded-lg mt-2 transition-all active:scale-[0.98] cursor-pointer"
              >
                UPGRADE NOW
              </button>
            </div>
          )}

          {/* Real-time ticker status */}
          <div className="flex items-center gap-2 px-2 py-1 bg-slate-100 rounded-lg text-slate-400 select-none">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
            {isSidebarExpanded && (
              <span className="text-[8px] font-extrabold uppercase tracking-wider font-mono">
                Feed: Streaming Live
              </span>
            )}
          </div>
        </div>

        {/* Expand Trigger Button (when collapsed) */}
        {!isSidebarExpanded && (
          <button
            onClick={() => setIsSidebarExpanded(true)}
            className="absolute -right-3 top-4 z-40 flex items-center justify-center w-6 h-6 rounded-full bg-white border border-slate-200 shadow-md hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600 text-slate-400 transition-all duration-200 cursor-pointer"
            title="Expand Sidebar"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        )}
      </aside>

      {/* ── Mobile Sidebar Drawer overlay ─────────────────────────────── */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden bg-slate-900/60 backdrop-blur-sm">
          <aside className="w-64 bg-white h-full border-r border-slate-200 flex flex-col p-4 animate-fade-in shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <div className="p-1 bg-emerald-500/10 text-emerald-500 rounded border border-emerald-500/20">
                  <Hexagon className="w-4 h-4 fill-emerald-500/20" />
                </div>
                <span className="font-extrabold text-[13px] tracking-wider text-slate-900 uppercase">
                  Zetheta Alpha
                </span>
              </div>
              <button
                onClick={() => setIsMobileOpen(false)}
                className="p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-800 rounded-lg cursor-pointer"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto scrollbar-thin py-4 space-y-1">
              {NAV_ITEMS.map((item, idx) => {
                const isActive = pathname === item.href;
                const linkContent = (
                  <>
                    <item.Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-blue-500" : "text-slate-400"}`} />
                    <span className="truncate text-xs font-semibold">{item.label}</span>
                    {item.disabled && (
                      <span className="ml-auto text-[8px] font-extrabold bg-slate-100 border border-slate-200/20 text-slate-400 px-1 rounded uppercase tracking-wider">
                        Mock
                      </span>
                    )}
                  </>
                );

                if (item.disabled) {
                  return (
                    <div
                      key={idx}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg opacity-50 cursor-not-allowed text-slate-400 select-none"
                    >
                      {linkContent}
                    </div>
                  );
                }

                return (
                  <Link
                    key={idx}
                    href={item.href}
                    onClick={() => setIsMobileOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                      isActive
                        ? "bg-blue-600 text-white font-bold"
                        : "text-slate-500 hover:bg-slate-50 hover:text-blue-600"
                    }`}
                  >
                    {linkContent}
                  </Link>
                );
              })}
            </nav>

            <div className="border-t border-slate-200 pt-4 space-y-3">
              <div className="premium-glass-card border border-blue-500/10 p-3 rounded-xl">
                <span className="text-[10px] font-bold text-blue-500 uppercase tracking-wider block">Upgrade to Pro</span>
                <span className="text-[9px] text-slate-400 mt-1 leading-snug block">
                  Get high-frequency testing and AI screen reports.
                </span>
                <button 
                  onClick={() => alert("Pro Tier Membership (Backtesting, Live Screener API, and Custom Screener Rules) will be activated for this terminal in the upcoming release. Thank you for your interest!")}
                  className="w-full text-center bg-blue-600 text-white font-bold text-[9px] py-1.5 rounded-lg mt-2 cursor-pointer"
                >
                  UPGRADE NOW
                </button>
              </div>

              <div className="flex items-center gap-2 px-2 py-1 bg-slate-100 rounded-lg text-slate-400">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                <span className="text-[8px] font-extrabold uppercase tracking-wider font-mono">
                  Feed: Streaming Live
                </span>
              </div>
            </div>
          </aside>
        </div>
      )}

      {/* ── Right Main Workspace ────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        
        {/* Ticker Row */}
        <div className="z-20 shrink-0">
          {/* Custom marquee indices at top */}
          <div className="w-full bg-slate-50 border-b border-slate-200 select-none py-1.5 px-4 overflow-x-auto scrollbar-thin whitespace-nowrap">
            <div className="flex items-center gap-5 justify-between md:justify-start">
              {[
                { symbol: "FTSE 100", price: 8203.97, change: 0.44 },
                { symbol: "DAX Index", price: 18131.99, change: -0.13 },
                { symbol: "NIKKEI 225", price: 38635.43, change: 0.85 },
                { symbol: "BTC/USD", price: 65447.36, change: 1.52 },
              ].map((item, idx) => {
                const isUp = item.change >= 0;
                return (
                  <div
                    key={idx}
                    className="inline-flex items-center gap-2 border border-slate-200 bg-white shadow-sm rounded-lg px-2 py-0.5 hover:border-blue-200 cursor-default"
                  >
                    <span className="text-[9px] font-bold text-slate-800 uppercase tracking-tight font-mono shrink-0">
                      {item.symbol}
                    </span>
                    <span className="text-[10px] font-bold font-mono text-slate-900 tabular-nums">
                      ${item.price.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                    </span>
                    <span
                      className={`inline-flex items-center text-[8px] font-extrabold font-mono rounded px-0.5 border ${
                        isUp
                          ? "text-emerald-500 bg-emerald-500/10 border-emerald-500/20"
                          : "text-rose-500 bg-rose-500/10 border-rose-500/20"
                      }`}
                    >
                      {isUp ? "+" : ""}
                      {item.change.toFixed(2)}%
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Toolbar Header Row */}
        <header className="z-10 bg-white border-b border-slate-200 shrink-0 select-none py-2 px-4 shadow-sm">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            {/* Left side actions (Hamburger + Search + Fast Indices) */}
            <div className="flex items-center gap-3 flex-wrap">
              {/* Mobile menu toggle */}
              <button
                onClick={() => setIsMobileOpen(true)}
                className="flex md:hidden p-1 text-slate-500 hover:bg-slate-100 hover:text-slate-800 rounded-lg cursor-pointer"
                aria-label="Toggle mobile drawer"
              >
                <Menu className="w-5 h-5" />
              </button>

              {/* Fast Search input */}
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search stocks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-36 sm:w-44 pl-8 pr-6 py-1 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-400 focus:bg-white text-slate-900 font-medium placeholder-slate-400"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-[10px] font-bold cursor-pointer"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Fast live summary indices in sub header */}
              <div className="hidden lg:flex items-center gap-3">
                {/* Nifty */}
                <div className="flex items-baseline gap-1.5">
                  <span className="text-[10px] font-bold text-slate-400 font-mono">NIFTY 50</span>
                  <span className="text-[10px] font-bold font-mono text-slate-800 tabular-nums">
                    {niftyVal.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                  </span>
                  <span className={`text-[9px] font-mono font-bold ${niftyChg >= 0 ? "text-emerald-500" : "text-rose-500"}`}>
                    {niftyChg >= 0 ? "+" : ""}
                    {niftyChg.toFixed(2)}%
                  </span>
                </div>
                <span className="text-slate-200">|</span>

                {/* Sensex */}
                <div className="flex items-baseline gap-1.5">
                  <span className="text-[10px] font-bold text-slate-400 font-mono">SENSEX</span>
                  <span className="text-[10px] font-bold font-mono text-slate-800 tabular-nums">
                    {sensexVal.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                  </span>
                  <span className={`text-[9px] font-mono font-bold ${sensexChg >= 0 ? "text-emerald-500" : "text-rose-500"}`}>
                    {sensexChg >= 0 ? "+" : ""}
                    {sensexChg.toFixed(2)}%
                  </span>
                </div>
                <span className="text-slate-200">|</span>

                {/* Bank Nifty */}
                <div className="flex items-baseline gap-1.5">
                  <span className="text-[10px] font-bold text-slate-400 font-mono">BANK NIFTY</span>
                  <span className="text-[10px] font-bold font-mono text-slate-800 tabular-nums">
                    {bankNiftyVal.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                  </span>
                  <span className={`text-[9px] font-mono font-bold ${bankNiftyChg >= 0 ? "text-emerald-500" : "text-rose-500"}`}>
                    {bankNiftyChg >= 0 ? "+" : ""}
                    {bankNiftyChg.toFixed(2)}%
                  </span>
                </div>
              </div>
            </div>

            {/* Right side actions (Market Open + Time + Reset + Websocket + Notify + Profile) */}
            <div className="flex items-center gap-3 self-end sm:self-auto justify-between sm:justify-end">
              {/* Market open dot */}
              <div className="flex items-center gap-1.5 px-2 py-1 bg-green-50 border border-green-500/10 rounded-full shrink-0">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[8px] font-bold text-emerald-600 uppercase tracking-wide">
                  Market Open
                </span>
              </div>

              {/* Time display */}
              <div className="hidden xs:block text-[10px] font-bold text-slate-450 font-mono tracking-tight shrink-0">
                {currentTime}
              </div>

              {/* Reset button */}
              <button
                onClick={handleResetAll}
                className="p-1.5 border border-slate-200 hover:border-blue-400 hover:text-blue-500 rounded-lg text-slate-400 transition-colors cursor-pointer shrink-0"
                title="Reset Filters & Search"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>

              {/* Live connection badge */}
              <ConnectionStatus />

              {/* Profile Icon / Circle */}
              <div className="w-7 h-7 rounded-full bg-blue-600 text-white font-extrabold text-[11px] flex items-center justify-center shrink-0 shadow shadow-blue-500/20 border border-blue-500">
                A
              </div>
            </div>
          </div>
        </header>

        {/* Work Viewport */}
        <main className="flex-1 flex flex-col min-h-0 overflow-hidden bg-slate-50 relative">
          <div className="flex-1 flex flex-col min-h-0">
            {children}
          </div>

          {/* Footer inside viewport */}
          <footer className="border-t border-slate-200 bg-white py-2 text-center text-[9px] font-bold text-slate-400 uppercase tracking-wider select-none shrink-0">
            <div className="px-4">
              &copy; {new Date().getFullYear()} Zetheta Alpha Analytics &middot; Simulated feeds &middot; Built with Next.js
            </div>
          </footer>
        </main>
      </div>
      
    </div>
  );
}
