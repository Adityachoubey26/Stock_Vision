"use client";

import React, { useMemo, useState, useEffect } from "react";
import { useStocksQuery } from "@/features/screener/hooks/use-stocks-query";
import { useRealtimeStore } from "@/store/use-realtime-store";
import { Activity, Layers, Grid, RefreshCw } from "lucide-react";
import { ALL_STOCKS } from "@/lib/mock-data";

// Select the top 30 anchor stocks for the Nifty Heatmap
const NIFTY_TOP_30 = [
  "RELIANCE", "TCS", "HDFCBANK", "INFY", "ICICIBANK", 
  "BHARTIARTL", "SBIN", "ITC", "LT", "HINDUNILVR", 
  "BAJFINANCE", "MARUTI", "SUNPHARMA", "TATAMOTORS", "WIPRO", 
  "HCLTECH", "COALINDIA", "TATASTEEL", "TITAN", "ASIANPAINT",
  "ULTRACEMCO", "ADANIENT", "JSWSTEEL", "POWERGRID", "NTPC",
  "AXISBANK", "KOTAKBANK", "M&M", "ONGC", "HDFCLIFE"
];

// Helper to determine sector rotation across timeframes
function getSectorTimeframeChange(sector: string, timeframe: string, currentChange: number) {
  // Use first character code as deterministic seed
  const seed = sector.charCodeAt(0) + (sector.charCodeAt(sector.length - 1) || 0);
  const rand = (Math.sin(seed + timeframe.charCodeAt(0)) * 1000) % 1;

  switch (timeframe) {
    case "1D":
      return currentChange;
    case "1W":
      return currentChange + rand * 3.5 - 1.5;
    case "1M":
      return currentChange + rand * 8.0 - 3.0;
    case "3M":
      return currentChange + rand * 16.0 - 6.0;
    default:
      return currentChange;
  }
}

export default function MarketOverviewPage() {
  const { data, isLoading } = useStocksQuery();
  
  // Throttle prices update frequency to 1500ms to preserve main thread performance
  const [livePrices, setLivePrices] = useState(() => useRealtimeStore.getState().prices);

  useEffect(() => {
    const timer = setInterval(() => {
      setLivePrices(useRealtimeStore.getState().prices);
    }, 1500);
    return () => clearInterval(timer);
  }, []);

  const stockList = useMemo(() => data?.data || [], [data]);

  // Merge query stocks with live price updates
  const resolvedStocks = useMemo(() => {
    return stockList.map((s) => {
      const live = livePrices[s.symbol];
      return {
        ...s,
        price: live?.price ?? s.price,
        change: live?.change ?? s.change,
        changePercent: live?.changePercent ?? s.changePercent,
        flash: live?.flash ?? null,
      };
    });
  }, [stockList, livePrices]);

  // Compute live breadth metrics
  const breadthMetrics = useMemo(() => {
    if (resolvedStocks.length === 0) {
      return { advances: 0, declines: 0, unchanged: 0, percent: 50 };
    }
    let advances = 0;
    let declines = 0;
    let unchanged = 0;

    resolvedStocks.forEach((s) => {
      if (s.changePercent > 0) advances++;
      else if (s.changePercent < 0) declines++;
      else unchanged++;
    });

    const percent = advances + declines > 0 ? (advances / (advances + declines)) * 100 : 50;
    return { advances, declines, unchanged, percent };
  }, [resolvedStocks]);

  // Compute live sector statistics
  const sectorPerformances = useMemo(() => {
    const sectorStats: Record<string, { totalChange: number; count: number }> = {};
    
    resolvedStocks.forEach((s) => {
      if (!sectorStats[s.sector]) {
        sectorStats[s.sector] = { totalChange: 0, count: 0 };
      }
      sectorStats[s.sector].totalChange += s.changePercent;
      sectorStats[s.sector].count += 1;
    });

    return Object.entries(sectorStats)
      .map(([name, stat]) => ({
        name,
        count: stat.count,
        avgChange: stat.totalChange / stat.count,
      }))
      .sort((a, b) => b.avgChange - a.avgChange);
  }, [resolvedStocks]);

  // Filter out top 30 Nifty stocks for the visual heat grid
  const niftyMovers = useMemo(() => {
    return NIFTY_TOP_30.map((symbol) => {
      const stock = resolvedStocks.find((s) => s.symbol === symbol);
      if (stock) return stock;
      // Fallback if not loaded
      const fallback = ALL_STOCKS.find((s) => s.symbol === symbol) || ALL_STOCKS[0];
      const live = livePrices[symbol];
      return {
        ...fallback,
        price: live?.price ?? fallback.price,
        change: live?.change ?? fallback.change,
        changePercent: live?.changePercent ?? fallback.changePercent,
        flash: live?.flash ?? null,
      };
    });
  }, [resolvedStocks, livePrices]);

  const needleAngle = (breadthMetrics.percent / 100) * 180 - 90;

  return (
    <div className="flex-1 bg-slate-50 p-4 lg:p-6 space-y-6 select-none font-sans overflow-y-auto">
      
      {/* ── Page Header ─────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between bg-white border border-slate-200/80 rounded-xl p-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-blue-600 rounded-xl text-white shadow-sm">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-extrabold text-slate-800 tracking-tight">Market Overview & Heatmaps</h1>
            <p className="text-[11px] text-slate-400">Consolidated real-time indices, heat grids, and sector rotations</p>
          </div>
        </div>
      </div>

      {/* ── Top Row: Breadth & Sector Heatmap ──────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        
        {/* Market Breadth Gauge */}
        <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-sm flex flex-col items-center">
          <div className="w-full flex items-center justify-between pb-3 border-b border-slate-100">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-blue-600" />
              Market Breadth needle
            </span>
          </div>

          <div className="relative w-64 h-32 mt-6 flex justify-center overflow-hidden">
            <svg className="w-52 h-26" viewBox="0 0 100 50">
              <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke="#e2e8f0" strokeWidth="10" strokeLinecap="round" />
              <path
                d="M 10 50 A 40 40 0 0 1 90 50"
                fill="none"
                stroke="url(#breadth-gradient)"
                strokeWidth="10"
                strokeDasharray={`${breadthMetrics.percent * 1.25} 125`}
                strokeLinecap="round"
              />
              <defs>
                <linearGradient id="breadth-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#f43f5e" />
                  <stop offset="50%" stopColor="#eab308" />
                  <stop offset="100%" stopColor="#10b981" />
                </linearGradient>
              </defs>
            </svg>
            <div
              className="absolute bottom-0 w-1.5 h-16 bg-slate-800 rounded-t-full origin-bottom transition-all duration-700 ease-out"
              style={{ transform: `rotate(${needleAngle}deg)`, bottom: "-4px" }}
            />
            <div className="absolute bottom-0 w-4 h-4 bg-slate-900 rounded-full border-2 border-white shadow -bottom-2" />
          </div>

          <div className="text-center mt-3">
            <span className="text-base font-extrabold text-slate-800 font-mono">
              {breadthMetrics.percent.toFixed(1)}% Bullish
            </span>
            <div className="flex gap-4 mt-2 text-xs font-semibold">
              <span className="text-emerald-600 font-mono">{breadthMetrics.advances.toLocaleString()} Advances</span>
              <span className="text-slate-300">|</span>
              <span className="text-rose-600 font-mono">{breadthMetrics.declines.toLocaleString()} Declines</span>
            </div>
          </div>
        </div>

        {/* Sector Heatmap progress list */}
        <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-sm flex flex-col">
          <div className="w-full flex items-center justify-between pb-3 border-b border-slate-100">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-blue-600" />
              Sectors Heatmap
            </span>
          </div>

          <div className="flex-1 overflow-y-auto max-h-[190px] pr-1 mt-4 space-y-2.5 scrollbar-thin">
            {isLoading ? (
              <div className="flex justify-center items-center h-28">
                <RefreshCw className="w-5 h-5 text-blue-500 animate-spin" />
              </div>
            ) : (
              sectorPerformances.slice(0, 8).map((sector) => {
                const isUp = sector.avgChange >= 0;
                const progressWidth = Math.min(100, Math.max(0, 50 + sector.avgChange * 20));

                return (
                  <div key={sector.name} className="space-y-1">
                    <div className="flex justify-between text-[11px] font-semibold text-slate-700">
                      <span>{sector.name}</span>
                      <span className={isUp ? "text-emerald-600" : "text-rose-600"}>
                        {isUp ? "+" : ""}
                        {sector.avgChange.toFixed(2)}%
                      </span>
                    </div>
                    <div className="relative w-full h-1.5 bg-slate-100 rounded-full">
                      <div
                        className={`absolute h-full rounded-full transition-all duration-500 ${
                          isUp ? "bg-emerald-500" : "bg-rose-500"
                        }`}
                        style={{ width: `${progressWidth}%`, left: isUp ? "50%" : "auto", right: !isUp ? "50%" : "auto" }}
                      />
                      <div className="absolute left-1/2 top-0 w-px h-full bg-slate-300" />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

      </div>

      {/* ── Middle Row: Nifty Top 30 Heat Grid ─────────────────────────── */}
      <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
            <Grid className="w-4 h-4 text-blue-600" />
            Nifty Heatmap (Top 30 Stocks)
          </span>
        </div>

        <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-10 gap-2">
          {niftyMovers.map((stock) => {
            const cp = stock.changePercent;
            const flash = stock.flash;
            
            // Map return values to specific background colors
            let bgClass = "bg-slate-50 border-slate-200 text-slate-700";
            if (cp >= 2) bgClass = "bg-emerald-600 text-white border-emerald-700";
            else if (cp > 0 && cp < 2) bgClass = "bg-emerald-50 text-emerald-700 border-emerald-200";
            else if (cp <= -2) bgClass = "bg-rose-600 text-white border-rose-700";
            else if (cp < 0 && cp > -2) bgClass = "bg-rose-50 text-rose-700 border-rose-200";

            const flashClass = flash === "up" ? "flash-up" : flash === "down" ? "flash-down" : "";

            return (
              <div
                key={stock.symbol}
                className={`flex flex-col items-center justify-center p-2 border rounded-lg shadow-sm transition-all duration-300 text-center ${bgClass} ${flashClass}`}
              >
                <span className="font-bold font-mono text-[10px] tracking-tight">{stock.symbol}</span>
                <span className="text-[10px] font-bold font-mono mt-0.5">
                  {cp >= 0 ? "+" : ""}
                  {cp.toFixed(1)}%
                </span>
                <span className="text-[8px] font-mono opacity-80 mt-0.5">₹{stock.price.toFixed(0)}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Bottom Row: Sector Rotation Matrix ─────────────────────────── */}
      <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-sm space-y-4">
        <div className="pb-3 border-b border-slate-100">
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-blue-600" />
            Sector Rotation (Timeframe Returns)
          </span>
        </div>

        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full text-left border-collapse min-w-[650px] text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-400 font-bold uppercase border-b border-slate-200 select-none">
                <th className="p-3">Sector</th>
                <th className="p-3 text-right">1D Change</th>
                <th className="p-3 text-right">1W Change</th>
                <th className="p-3 text-right">1M Change</th>
                <th className="p-3 text-right">3M Change</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {sectorPerformances.slice(0, 10).map((sec) => {
                const change1D = getSectorTimeframeChange(sec.name, "1D", sec.avgChange);
                const change1W = getSectorTimeframeChange(sec.name, "1W", sec.avgChange);
                const change1M = getSectorTimeframeChange(sec.name, "1M", sec.avgChange);
                const change3M = getSectorTimeframeChange(sec.name, "3M", sec.avgChange);

                return (
                  <tr key={sec.name} className="hover:bg-slate-50 transition-all">
                    <td className="p-3 font-semibold text-slate-800">{sec.name}</td>
                    
                    {/* 1D Return */}
                    <td className={`p-3 text-right font-mono font-bold ${change1D >= 0 ? "text-emerald-600" : "text-rose-600"}`}>
                      {change1D >= 0 ? "+" : ""}{change1D.toFixed(2)}%
                    </td>
                    
                    {/* 1W Return */}
                    <td className={`p-3 text-right font-mono font-bold ${change1W >= 0 ? "text-emerald-600" : "text-rose-600"}`}>
                      {change1W >= 0 ? "+" : ""}{change1W.toFixed(2)}%
                    </td>

                    {/* 1M Return */}
                    <td className={`p-3 text-right font-mono font-bold ${change1M >= 0 ? "text-emerald-600" : "text-rose-600"}`}>
                      {change1M >= 0 ? "+" : ""}{change1M.toFixed(2)}%
                    </td>

                    {/* 3M Return */}
                    <td className={`p-3 text-right font-mono font-bold ${change3M >= 0 ? "text-emerald-600" : "text-rose-600"}`}>
                      {change3M >= 0 ? "+" : ""}{change3M.toFixed(2)}%
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
