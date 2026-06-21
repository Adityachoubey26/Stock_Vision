"use client";

import React, { useState, useMemo } from "react";
import { useStocksQuery } from "../hooks/use-stocks-query";
import { useWatchlist } from "@/features/watchlist/hooks/use-watchlist";
import { useScreenerStore } from "@/store/use-screener-store";
import { Star, TrendingUp, TrendingDown, Eye, Activity } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function MarketWidgets() {
  const { data } = useStocksQuery();
  const { symbols, toggleSymbol } = useWatchlist();
  const { activeSymbol, setActiveSymbol } = useScreenerStore();
  const [activeTab, setActiveTab] = useState<"watchlist" | "gainers" | "losers" | "trending">("watchlist");

  const stockList = useMemo(() => data?.data || [], [data]);

  // Compute metrics from the active list
  const watchlistStocks = useMemo(() => {
    return stockList.filter((s) => symbols.includes(s.symbol));
  }, [stockList, symbols]);

  const topGainers = useMemo(() => {
    return [...stockList]
      .sort((a, b) => b.changePercent - a.changePercent)
      .slice(0, 5);
  }, [stockList]);

  const topLosers = useMemo(() => {
    return [...stockList]
      .sort((a, b) => a.changePercent - b.changePercent)
      .slice(0, 5);
  }, [stockList]);

  const trending = useMemo(() => {
    // Trending = sorted by volume * absolute price change to capture heavy action
    return [...stockList]
      .sort((a, b) => (b.volume * Math.abs(b.changePercent)) - (a.volume * Math.abs(a.changePercent)))
      .slice(0, 5);
  }, [stockList]);

  const activeTabItems = useMemo(() => {
    switch (activeTab) {
      case "watchlist":
        return watchlistStocks;
      case "gainers":
        return topGainers;
      case "losers":
        return topLosers;
      case "trending":
        return trending;
      default:
        return [];
    }
  }, [activeTab, watchlistStocks, topGainers, topLosers, trending]);

  return (
    <div className="flex flex-col h-full bg-white text-slate-700 border-r border-slate-200 select-none text-xs">
      {/* ── Widget Headers ────────────────────────────────────────────── */}
      <div className="grid grid-cols-4 border-b border-slate-100 bg-slate-50/50 p-1 gap-1">
        {(["watchlist", "gainers", "losers", "trending"] as const).map((tab) => {
          const isActive = activeTab === tab;
          const label = {
            watchlist: "Watch",
            gainers: "Gain",
            losers: "Lose",
            trending: "Trend",
          }[tab];

          const Icon = {
            watchlist: Star,
            gainers: TrendingUp,
            losers: TrendingDown,
            trending: Activity,
          }[tab];

          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex flex-col items-center gap-1 py-1.5 rounded-md font-semibold transition-all duration-200 cursor-pointer ${
                isActive
                  ? "bg-blue-600 text-white shadow-sm shadow-blue-200"
                  : "text-slate-400 hover:text-slate-600 hover:bg-slate-100/70"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span className="text-[10px] tracking-tight">{label}</span>
            </button>
          );
        })}
      </div>

      {/* ── List Content ─────────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1.5 scrollbar-thin">
        <AnimatePresence mode="wait">
          {activeTabItems.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex flex-col items-center justify-center py-10 text-center text-slate-400"
            >
              {activeTab === "watchlist" ? (
                <>
                  <Star className="w-5 h-5 text-slate-300 mb-1.5 animate-pulse" />
                  <p className="font-medium text-[11px]">Watchlist is empty</p>
                  <p className="text-[10px] text-slate-400 mt-0.5 max-w-[160px]">
                    Star stocks in the grid to track them here.
                  </p>
                </>
              ) : (
                <>
                  <Eye className="w-5 h-5 text-slate-300 mb-1.5" />
                  <p className="font-medium text-[11px]">No data available</p>
                </>
              )}
            </motion.div>
          ) : (
            <motion.div
              layout
              className="space-y-1"
              initial="hidden"
              animate="show"
              variants={{
                show: {
                  transition: {
                    staggerChildren: 0.05,
                  },
                },
              }}
            >
              {activeTabItems.map((stock) => {
                const isSelected = activeSymbol === stock.symbol;
                const changeVal = stock.changePercent;
                const isUp = changeVal >= 0;

                return (
                  <motion.div
                    key={stock.symbol}
                    onClick={() => setActiveSymbol(stock.symbol)}
                    variants={{
                      hidden: { opacity: 0, y: 6 },
                      show: { opacity: 1, y: 0 },
                    }}
                    className={`flex items-center justify-between p-2 rounded-lg border transition-all duration-200 cursor-pointer ${
                      isSelected
                        ? "bg-blue-50/80 border-blue-200 shadow-sm"
                        : "bg-white border-slate-100 hover:border-slate-200 hover:bg-slate-50/60 hover:shadow-sm"
                    }`}
                  >
                    <div className="flex flex-col gap-0.5 min-w-0 pr-1">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-slate-800 font-mono tracking-tight">
                          {stock.symbol}
                        </span>
                        {activeTab === "watchlist" && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleSymbol(stock.symbol);
                            }}
                            className="text-amber-500 hover:text-slate-300 transition-colors"
                          >
                            <Star className="w-3 h-3 fill-amber-400 stroke-amber-500" />
                          </button>
                        )}
                      </div>
                      <span className="text-[10px] text-slate-400 truncate max-w-[150px]">
                        {stock.name}
                      </span>
                    </div>

                    <div className="flex flex-col items-end gap-0.5 shrink-0">
                      <span className="font-semibold font-mono text-slate-900 tabular-nums">
                        ₹{stock.price.toLocaleString("en-IN", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </span>
                      <span
                        className={`inline-flex items-center gap-0.5 text-[9px] font-bold font-mono px-1 rounded ${
                          isUp
                            ? "text-emerald-700 bg-emerald-50"
                            : "text-rose-700 bg-rose-50"
                        }`}
                      >
                        {isUp ? "+" : ""}
                        {changeVal.toFixed(2)}%
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
