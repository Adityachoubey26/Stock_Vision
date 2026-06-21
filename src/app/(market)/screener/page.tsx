"use client";

import React, { useState, useMemo } from "react";
import { useScreenerStore } from "@/store/use-screener-store";
import { useStocksQuery } from "@/features/screener/hooks/use-stocks-query";
import { ScreenerFilters } from "@/features/screener/components/screener-filters";
import { StockTable } from "@/features/screener/components/screener-table";
import { StockDetailPanel } from "@/features/screener/components/stock-detail-panel";
import { MarketWidgets } from "@/features/screener/components/market-widgets";
import { AnimatedCounter } from "@/components/animated-counter";
import { motion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  PanelRightClose,
  PanelRightOpen,
  Filter,
  TrendingUp,
  TrendingDown,
  Coins,
  Activity,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default function ScreenerPage() {
  const [isWidgetsOpen, setIsWidgetsOpen] = useState(true);
  const [isFiltersCollapsed, setIsFiltersCollapsed] = useState(false);
  
  const { activeSymbol, isDetailPanelOpen, setDetailPanelOpen } = useScreenerStore();
  const { data } = useStocksQuery();

  const stockList = useMemo(() => data?.data || [], [data]);

  // Collapse panels by default on mobile and tablet screens
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const isCompact = window.innerWidth < 1024;
      if (isCompact) {
        setIsWidgetsOpen(false);
        setIsFiltersCollapsed(true);
        setDetailPanelOpen(false);
      }
    }
  }, [setDetailPanelOpen]);

  // Compute live aggregates from active filtered stocks
  const stats = useMemo(() => {
    if (stockList.length === 0) {
      return { totalCap: 0, gainers: 0, losers: 0, active: 0 };
    }
    const totalCap = stockList.reduce((sum, s) => sum + s.marketCap, 0) / 1000000000000; // In Lakh Cr
    const gainers = stockList.filter((s) => s.changePercent > 0).length;
    const losers = stockList.filter((s) => s.changePercent < 0).length;
    const active = stockList.length;

    return { totalCap, gainers, losers, active };
  }, [stockList]);

  return (
    <div className="flex flex-1 min-h-0 overflow-hidden relative bg-slate-50 font-sans">
      
      {/* ═══ 1. Collapsible Left Widgets Panel (Watchlist / Movers) ═════════ */}
      {isWidgetsOpen && (
        <div
          onClick={() => setIsWidgetsOpen(false)}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-30 lg:hidden"
        />
      )}
      <div
        className={`absolute lg:relative top-0 bottom-0 left-0 z-40 bg-white border-r border-slate-200/65 transition-all duration-300 ease-in-out ${
          isWidgetsOpen ? "w-[280px]" : "w-0"
        }`}
      >
        <div className="h-full overflow-hidden w-[280px]">
          {isWidgetsOpen && <MarketWidgets />}
        </div>

        {/* Toggle Widget Panel Button */}
        <button
          onClick={() => setIsWidgetsOpen(!isWidgetsOpen)}
          className="absolute -right-3 top-4 z-40 flex items-center justify-center w-6 h-6 rounded-full bg-white border border-slate-200 shadow-md hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600 text-slate-400 transition-all duration-200 cursor-pointer"
          title={isWidgetsOpen ? "Hide Terminal Widgets" : "Show Terminal Widgets"}
        >
          {isWidgetsOpen ? (
            <ChevronLeft className="w-3.5 h-3.5" />
          ) : (
            <ChevronRight className="w-3.5 h-3.5" />
          )}
        </button>
      </div>

      {/* ═══ 2. Collapsible Compact Filters Panel (Reduced by 40%: 160px) ═══ */}
      {!isFiltersCollapsed && (
        <div
          onClick={() => setIsFiltersCollapsed(true)}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-30 lg:hidden"
        />
      )}
      <div
        className={`absolute lg:relative top-0 bottom-0 left-0 z-40 bg-white border-r border-slate-200/65 transition-all duration-300 ease-in-out ${
          isFiltersCollapsed ? "w-0 pointer-events-none lg:pointer-events-auto" : "w-[160px]"
        }`}
      >
        <div className="h-full overflow-hidden w-[160px]">
          {!isFiltersCollapsed && <ScreenerFilters />}
        </div>

        {/* Toggle Filter Panel Button */}
        <button
          onClick={() => setIsFiltersCollapsed(!isFiltersCollapsed)}
          className="absolute -right-3 top-16 z-40 flex items-center justify-center w-6 h-6 rounded-full bg-white border border-slate-200 shadow-md hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600 text-slate-400 transition-all duration-200 cursor-pointer"
          title={isFiltersCollapsed ? "Show Filters" : "Hide Filters"}
        >
          {isFiltersCollapsed ? (
            <Filter className="w-3 h-3 text-slate-500" />
          ) : (
            <ChevronLeft className="w-3.5 h-3.5" />
          )}
        </button>
      </div>

      {/* ═══ 3. Main Center Section (Dashboard Metrics & Stock Table) ══════ */}
      <div className="flex-1 flex flex-col p-4 overflow-hidden min-w-0 gap-4">
        
        {/* Dashboard Cards Row */}
        <motion.div
          initial="hidden"
          animate="show"
          variants={{
            show: {
              transition: {
                staggerChildren: 0.08,
              },
            },
          }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 shrink-0"
        >
          {/* Card 1: Total Market Cap */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 15 },
              show: { opacity: 1, y: 0 },
            }}
            className="premium-glass-card gradient-accent p-3.5 rounded-xl flex items-center gap-3"
          >
            <div className="p-2.5 bg-blue-50 rounded-lg text-blue-600">
              <Coins className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Total Market Cap
              </span>
              <span className="text-base font-extrabold text-slate-800 font-mono tracking-tight mt-0.5">
                ₹<AnimatedCounter value={stats.totalCap} decimals={2} /> L Cr
              </span>
            </div>
          </motion.div>

          {/* Card 2: Gainers */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 15 },
              show: { opacity: 1, y: 0 },
            }}
            className="premium-glass-card p-3.5 rounded-xl flex items-center gap-3"
          >
            <div className="p-2.5 bg-emerald-50 rounded-lg text-emerald-600">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Daily Gainers
              </span>
              <span className="text-base font-extrabold text-emerald-600 font-mono tracking-tight mt-0.5">
                <AnimatedCounter value={stats.gainers} />
              </span>
            </div>
          </motion.div>

          {/* Card 3: Losers */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 15 },
              show: { opacity: 1, y: 0 },
            }}
            className="premium-glass-card p-3.5 rounded-xl flex items-center gap-3"
          >
            <div className="p-2.5 bg-rose-50 rounded-lg text-rose-600">
              <TrendingDown className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Daily Losers
              </span>
              <span className="text-base font-extrabold text-rose-600 font-mono tracking-tight mt-0.5">
                <AnimatedCounter value={stats.losers} />
              </span>
            </div>
          </motion.div>

          {/* Card 4: Active Stocks */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 15 },
              show: { opacity: 1, y: 0 },
            }}
            className="premium-glass-card p-3.5 rounded-xl flex items-center gap-3"
          >
            <div className="p-2.5 bg-slate-100 rounded-lg text-slate-600">
              <Activity className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Active Universe
              </span>
              <span className="text-base font-extrabold text-slate-800 font-mono tracking-tight mt-0.5">
                <AnimatedCounter value={stats.active} />
              </span>
            </div>
          </motion.div>
        </motion.div>

        {/* Stock Grid table - Main Focus */}
        <motion.div
          initial={{ opacity: 0, scale: 0.99 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="flex-1 min-h-0 relative shadow-lg shadow-slate-200/50 rounded-xl"
        >
          <StockTable />
        </motion.div>

      </div>

      {/* ═══ 4. Collapsible Right Stock Detail Panel ═══════════════════════ */}
      {isDetailPanelOpen && (
        <div
          onClick={() => setDetailPanelOpen(false)}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-30 lg:hidden"
        />
      )}
      <div
        className={`absolute lg:relative right-0 top-0 bottom-0 z-40 bg-white border-l border-slate-200/65 transition-all duration-300 ease-in-out ${
          isDetailPanelOpen ? "w-[320px] opacity-100" : "w-0 opacity-0 pointer-events-none lg:pointer-events-auto"
        }`}
      >
        <div className="h-full overflow-hidden w-[320px]">
          {isDetailPanelOpen && (
            <div className="h-full bg-white p-4 overflow-y-auto scrollbar-thin">
              <StockDetailPanel symbol={activeSymbol} />
            </div>
          )}
        </div>

        {/* Toggle Detail Panel Button */}
        <button
          onClick={() => setDetailPanelOpen(!isDetailPanelOpen)}
          className="absolute -left-3 top-4 z-40 flex items-center justify-center w-6 h-6 rounded-full bg-white border border-slate-200 shadow-md hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600 text-slate-400 transition-all duration-200 cursor-pointer"
          title={isDetailPanelOpen ? "Hide Stock Detail" : "Show Stock Detail"}
        >
          {isDetailPanelOpen ? (
            <PanelRightClose className="w-3.5 h-3.5" />
          ) : (
            <PanelRightOpen className="w-3.5 h-3.5" />
          )}
        </button>
      </div>

    </div>
  );
}
