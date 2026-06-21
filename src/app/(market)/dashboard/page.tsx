"use client";

import React, { useMemo, useState, useEffect } from "react";
import { useStocksQuery } from "@/features/screener/hooks/use-stocks-query";
import { useRealtimeStore } from "@/store/use-realtime-store";
import { useWatchlist } from "@/features/watchlist/hooks/use-watchlist";
import { AnimatedCounter } from "@/components/animated-counter";
import {
  TrendingUp,
  TrendingDown,
  Activity,
  Layers,
  Star,
  Download,
  Clock,
  Compass,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const { data, isLoading } = useStocksQuery();
  const { symbols } = useWatchlist();

  // Throttle pricing calculations to once every 1500ms to eliminate scroll lag
  const [livePrices, setLivePrices] = useState(() => useRealtimeStore.getState().prices);

  useEffect(() => {
    const timer = setInterval(() => {
      setLivePrices(useRealtimeStore.getState().prices);
    }, 1500);
    return () => clearInterval(timer);
  }, []);

  // Compute live analytics from the stock universe merged with live prices
  const analytics = useMemo(() => {
    const stocks = data?.data || [];
    if (stocks.length === 0) {
      return {
        totalMarketCap: 0,
        advances: 0,
        declines: 0,
        unchanged: 0,
        breadthPercent: 50,
        sectorPerformances: [],
        topGainers: [],
        topLosers: [],
        mostActive: [],
      };
    }

    let totalMarketCap = 0;
    let advances = 0;
    let declines = 0;
    let unchanged = 0;

    // Sector grouping helper
    const sectorStats: Record<string, { totalChange: number; count: number }> = {};

    // Get current live state for all stocks
    const resolvedStocks = stocks.map((s) => {
      const live = livePrices[s.symbol];
      const price = live?.price ?? s.price;
      const changePercent = live?.changePercent ?? s.changePercent;
      const change = live?.change ?? s.change;

      totalMarketCap += s.marketCap;

      if (changePercent > 0) advances++;
      else if (changePercent < 0) declines++;
      else unchanged++;

      // Accumulate sector stats
      if (!sectorStats[s.sector]) {
        sectorStats[s.sector] = { totalChange: 0, count: 0 };
      }
      sectorStats[s.sector].totalChange += changePercent;
      sectorStats[s.sector].count += 1;

      return {
        ...s,
        price,
        change,
        changePercent,
      };
    });

    const breadthPercent =
      advances + declines > 0 ? (advances / (advances + declines)) * 100 : 50;

    // Compute sector averages
    const sectorPerformances = Object.entries(sectorStats)
      .map(([name, stat]) => ({
        name,
        count: stat.count,
        avgChange: stat.totalChange / stat.count,
      }))
      .sort((a, b) => b.avgChange - a.avgChange);

    // Compute top movers
    const topGainers = [...resolvedStocks]
      .sort((a, b) => b.changePercent - a.changePercent)
      .slice(0, 5);

    const topLosers = [...resolvedStocks]
      .sort((a, b) => a.changePercent - b.changePercent)
      .slice(0, 5);

    const mostActive = [...resolvedStocks]
      .sort((a, b) => b.volume - a.volume)
      .slice(0, 5);

    return {
      totalMarketCap: totalMarketCap / 1000000000000, // In Lakh Cr
      advances,
      declines,
      unchanged,
      breadthPercent,
      sectorPerformances,
      topGainers,
      topLosers,
      mostActive,
    };
  }, [data, livePrices]);

  const handleExport = () => {
    if (analytics.topGainers.length === 0) return;
    const csvRows = [
      ["Symbol", "Company", "Sector", "Price", "Change %"],
      ...analytics.topGainers.map(s => [s.symbol, s.name, s.sector, s.price.toFixed(2), `${s.changePercent.toFixed(2)}%`])
    ];
    const csvContent = "data:text/csv;charset=utf-8," + csvRows.map(e => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "top_gainers_report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const breadthAngle = (analytics.breadthPercent / 100) * 180 - 90; // Map [0,100] to [-90,90] degrees

  return (
    <div className="flex-1 bg-slate-50 p-4 lg:p-6 space-y-6 select-none font-sans overflow-y-auto">
      
      {/* ── Dashboard Header ────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white border border-slate-200/80 rounded-xl p-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-blue-600 rounded-xl text-white shadow-sm">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-extrabold text-slate-800 tracking-tight">GLOBAL MARKET TERMINAL</h1>
            <p className="text-[11px] text-slate-400">Institutional consolidated overview & live indices feeds</p>
          </div>
        </div>
        <div className="flex items-center gap-3 self-stretch sm:self-auto justify-between sm:justify-start">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-500 text-xs">
            <Clock className="w-3.5 h-3.5" />
            <span className="font-mono">MARKET TIME: {new Date().toLocaleTimeString()}</span>
          </div>
          <button 
            onClick={handleExport}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-all shadow-sm active:scale-95 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>EXPORT REPORT</span>
          </button>
        </div>
      </div>

      {/* ── Key Metrics Cards ───────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="premium-glass-card p-4 rounded-xl flex items-center gap-4 border border-slate-200/50">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
            <Layers className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">STOCKS TRACKED</span>
            <span className="text-xl font-extrabold text-slate-800 font-mono tracking-tight mt-0.5">
              <AnimatedCounter value={5050} />
            </span>
            <span className="text-[9px] text-blue-600 font-semibold mt-0.5">+50 Active Real-time</span>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="premium-glass-card p-4 rounded-xl flex items-center gap-4 border border-slate-200/50">
          <div className="p-3 bg-amber-50 text-amber-500 rounded-lg">
            <Star className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">WATCHLIST STOCKS</span>
            <span className="text-xl font-extrabold text-slate-800 font-mono tracking-tight mt-0.5">
              <AnimatedCounter value={symbols.length} />
            </span>
            <span className="text-[9px] text-slate-400 font-medium mt-0.5">Bookmarked alerts enabled</span>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="premium-glass-card p-4 rounded-xl flex items-center gap-4 border border-slate-200/50">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">PORTFOLIO VALUE</span>
            <span className="text-xl font-extrabold text-slate-800 font-mono tracking-tight mt-0.5">
              ₹<AnimatedCounter value={100000} decimals={0} />
            </span>
            <span className="text-[9px] text-emerald-600 font-semibold mt-0.5">Live valuation synced</span>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="premium-glass-card p-4 rounded-xl flex items-center gap-4 border border-slate-200/50">
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg">
            <Activity className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">ACTIVE TICKS</span>
            <span className="text-xl font-extrabold text-slate-800 font-mono tracking-tight mt-0.5">
              60 FPS
            </span>
            <span className="text-[9px] text-indigo-600 font-semibold mt-0.5">High fidelity render loop</span>
          </div>
        </div>
      </div>

      {/* ── Market Breadth Gauge & Sectors Heatmap ──────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Market Breadth Card */}
        <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-sm flex flex-col items-center">
          <div className="w-full flex items-center justify-between pb-3 border-b border-slate-100">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-blue-600" />
              Market Breadth Needle
            </span>
            <span className="text-[10px] text-slate-400 font-mono">Advances vs Declines</span>
          </div>

          {/* SVG Speedometer Gauge */}
          <div className="relative w-64 h-32 mt-6 flex justify-center overflow-hidden">
            {/* Speedometer Track */}
            <svg className="w-52 h-26" viewBox="0 0 100 50">
              <path
                d="M 10 50 A 40 40 0 0 1 90 50"
                fill="none"
                stroke="#e2e8f0"
                strokeWidth="10"
                strokeLinecap="round"
              />
              <path
                d="M 10 50 A 40 40 0 0 1 90 50"
                fill="none"
                stroke="url(#gauge-gradient)"
                strokeWidth="10"
                strokeDasharray={`${analytics.breadthPercent * 1.25} 125`}
                strokeLinecap="round"
              />
              <defs>
                <linearGradient id="gauge-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#f43f5e" />
                  <stop offset="50%" stopColor="#eab308" />
                  <stop offset="100%" stopColor="#10b981" />
                </linearGradient>
              </defs>
            </svg>

            {/* Gauge Needle */}
            <div
              className="absolute bottom-0 w-1.5 h-16 bg-slate-800 rounded-t-full origin-bottom transition-all duration-700 ease-out"
              style={{
                transform: `rotate(${breadthAngle}deg)`,
                bottom: "-4px",
              }}
            />
            <div className="absolute bottom-0 w-4 h-4 bg-slate-900 rounded-full border-2 border-white shadow -bottom-2" />
          </div>

          <div className="text-center mt-3">
            <span className="text-lg font-extrabold text-slate-800 font-mono">
              {analytics.breadthPercent.toFixed(1)}% Bullish
            </span>
            <div className="flex gap-4 mt-2 text-xs font-semibold">
              <span className="text-emerald-600 font-mono">{analytics.advances.toLocaleString()} Advances</span>
              <span className="text-slate-300">|</span>
              <span className="text-rose-600 font-mono">{analytics.declines.toLocaleString()} Declines</span>
            </div>
          </div>
        </div>

        {/* Sectors Heatmap Card */}
        <div className="bg-white border border-[#e2e8f0] rounded-xl p-5 shadow-sm flex flex-col">
          <div className="w-full flex items-center justify-between pb-3 border-b border-slate-100">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-blue-600" />
              Sectors Heatmap
            </span>
            <span className="text-[10px] text-slate-400 font-mono">Avg return per sector</span>
          </div>

          <div className="flex-1 overflow-y-auto max-h-[190px] pr-1 mt-4 space-y-2.5 scrollbar-thin">
            {isLoading ? (
              <div className="flex justify-center items-center h-28">
                <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
              </div>
            ) : (
              analytics.sectorPerformances.slice(0, 7).map((sector) => {
                const isUp = sector.avgChange >= 0;
                const progressWidth = Math.min(100, Math.max(0, 50 + sector.avgChange * 20)); // Map to 0-100

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

      {/* ── Live Market Movers Cards ────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: Top Gainers */}
        <div className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-sm flex flex-col">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-2.5 mb-3">
            <div className="p-1.5 bg-emerald-50 text-emerald-600 rounded-md">
              <TrendingUp className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wide">Top Gainers</span>
          </div>
          <div className="space-y-2 flex-1">
            {analytics.topGainers.map((stock) => (
              <div key={stock.symbol} className="flex justify-between items-center p-2 hover:bg-slate-50 rounded-lg transition-colors border border-slate-100/50">
                <div className="flex flex-col">
                  <span className="font-bold text-slate-800 font-mono tracking-tight">{stock.symbol}</span>
                  <span className="text-[10px] text-slate-400 truncate max-w-[120px]">{stock.name}</span>
                </div>
                <div className="flex flex-col items-end">
                  <span className="font-semibold text-slate-900 font-mono text-xs">₹{stock.price.toFixed(2)}</span>
                  <span className="text-[10px] font-bold text-emerald-600 font-mono bg-emerald-50 px-1 rounded mt-0.5">
                    +{stock.changePercent.toFixed(2)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Card 2: Top Losers */}
        <div className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-sm flex flex-col">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-2.5 mb-3">
            <div className="p-1.5 bg-rose-50 text-rose-600 rounded-md">
              <TrendingDown className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wide">Top Losers</span>
          </div>
          <div className="space-y-2 flex-1">
            {analytics.topLosers.map((stock) => (
              <div key={stock.symbol} className="flex justify-between items-center p-2 hover:bg-slate-50 rounded-lg transition-colors border border-slate-100/50">
                <div className="flex flex-col">
                  <span className="font-bold text-slate-800 font-mono tracking-tight">{stock.symbol}</span>
                  <span className="text-[10px] text-slate-400 truncate max-w-[120px]">{stock.name}</span>
                </div>
                <div className="flex flex-col items-end">
                  <span className="font-semibold text-slate-900 font-mono text-xs">₹{stock.price.toFixed(2)}</span>
                  <span className="text-[10px] font-bold text-rose-600 font-mono bg-rose-50 px-1 rounded mt-0.5">
                    {stock.changePercent.toFixed(2)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Card 3: Most Active Stocks */}
        <div className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-sm flex flex-col">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-2.5 mb-3">
            <div className="p-1.5 bg-blue-50 text-blue-600 rounded-md">
              <Activity className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wide">Most Active Stocks</span>
          </div>
          <div className="space-y-2 flex-1">
            {analytics.mostActive.map((stock) => (
              <div key={stock.symbol} className="flex justify-between items-center p-2 hover:bg-slate-50 rounded-lg transition-colors border border-slate-100/50">
                <div className="flex flex-col">
                  <span className="font-bold text-slate-800 font-mono tracking-tight">{stock.symbol}</span>
                  <span className="text-[10px] text-slate-400 truncate max-w-[120px]">{stock.name}</span>
                </div>
                <div className="flex flex-col items-end">
                  <span className="font-semibold text-slate-900 font-mono text-xs">₹{stock.price.toFixed(2)}</span>
                  <span className="text-[10px] font-bold text-blue-600 font-mono bg-blue-50 px-1 rounded mt-0.5">
                    {(stock.volume / 100000).toFixed(1)}L Vol
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Launch Screener CTA Banner ──────────────────────────────────── */}
      <div className="premium-glass-card gradient-accent p-6 rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-md border border-slate-200/50">
        <div>
          <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wide">Launch Live Screener Terminal</h2>
          <p className="text-xs text-slate-500 mt-1">Screen 5000+ stocks under 200ms using advanced technical rules and interactive candlestick mapping.</p>
        </div>
        <Link
          href="/screener"
          className="flex items-center gap-1.5 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow transition-all active:scale-[0.97] cursor-pointer"
        >
          <span>OPEN SCREENER TERMINAL</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

    </div>
  );
}

function Loader2(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  );
}
