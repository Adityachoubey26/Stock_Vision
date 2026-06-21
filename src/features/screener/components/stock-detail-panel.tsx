"use client";

import React from "react";
import { useStockDetail } from "../hooks/use-stock-detail";
import { formatMarketCap, formatVolume } from "@/lib/utils";
import { StockChart } from "./stock-chart";
import { useRealtimeStore } from "@/store/use-realtime-store";
import {
  TrendingUp,
  TrendingDown,
  Info,
  Building2,
  BarChart3,
  Loader2,
} from "lucide-react";

interface StockDetailPanelProps {
  symbol: string | null;
}

function StatCard({
  label,
  value,
  color,
}: {
  label: string;
  value: string | number;
  color?: string;
}) {
  return (
    <div className="flex flex-col gap-0.5 p-2.5 bg-slate-50/80 rounded-lg border border-slate-100">
      <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wide">
        {label}
      </span>
      <span
        className={`text-sm font-semibold font-mono tabular-nums ${
          color || "text-slate-700"
        }`}
      >
        {value}
      </span>
    </div>
  );
}

export function StockDetailPanel({ symbol }: StockDetailPanelProps) {
  const { data, isFetching, isLoading } = useStockDetail(symbol);
  const stock = data?.stock;

  // Retrieve live price information from the realtime store
  const liveData = useRealtimeStore((state) => (stock ? state.prices[stock.symbol] : undefined));
  
  if (!symbol) {
    return (
      <div className="flex flex-col items-center justify-center text-center h-full text-slate-400 p-6">
        <div className="p-3 bg-slate-100 rounded-xl mb-3">
          <Info className="w-6 h-6 text-slate-300" />
        </div>
        <p className="text-sm font-medium text-slate-500">No stock selected</p>
        <p className="text-xs text-slate-400 mt-1 max-w-[200px]">
          Click on a row in the screener to view detailed information.
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <Loader2 className="w-6 h-6 text-blue-500 animate-spin mb-2" />
        <span className="text-xs text-slate-400">Loading details...</span>
      </div>
    );
  }

  if (!stock) return null;

  const price = liveData?.price ?? stock.price;
  const change = liveData?.change ?? stock.change;
  const changePercent = liveData?.changePercent ?? stock.changePercent;

  const changeColor =
    changePercent > 0
      ? "text-green-600"
      : changePercent < 0
      ? "text-red-600"
      : "text-slate-500";

  const priceRange52W =
    stock.high52Week - stock.low52Week > 0
      ? ((price - stock.low52Week) /
          (stock.high52Week - stock.low52Week)) *
        100
      : 50;
  const clampedRange = Math.min(100, Math.max(0, priceRange52W));

  return (
    <div className="flex flex-col gap-4 h-full animate-slide-in">
      {/* ── Header ────────────────────────────────────────────────────── */}
      <div className="space-y-1.5 pb-3 border-b border-slate-100">
        <div className="flex items-center justify-between">
          <span className="font-mono text-base font-bold text-blue-700 tracking-tight">
            {stock.symbol}
          </span>
          <div className="flex items-center gap-1.5">
            {isFetching && (
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
            )}
            <span className="text-[10px] text-slate-400 font-mono">NSE</span>
          </div>
        </div>
        <h2
          className="text-xs font-medium text-slate-500 truncate"
          title={stock.name}
        >
          {stock.name}
        </h2>

        {/* Sector/Industry badges */}
        <div className="flex flex-wrap gap-1.5 mt-1">
          <span className="inline-flex items-center gap-1 text-[10px] font-medium text-slate-600 bg-slate-100 rounded-full px-2 py-0.5">
            <Building2 className="w-2.5 h-2.5" />
            {stock.sector}
          </span>
          <span className="text-[10px] font-medium text-slate-500 bg-slate-50 border border-slate-200 rounded-full px-2 py-0.5">
            {stock.industry}
          </span>
        </div>
      </div>

      {/* ── Price Section ─────────────────────────────────────────────── */}
      <div className="space-y-1">
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold font-mono tracking-tight text-slate-900 tabular-nums">
            ₹
            {price.toLocaleString("en-IN", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`inline-flex items-center gap-1 text-sm font-semibold font-mono ${changeColor}`}
          >
            {changePercent > 0 ? (
              <TrendingUp className="w-3.5 h-3.5" />
            ) : changePercent < 0 ? (
              <TrendingDown className="w-3.5 h-3.5" />
            ) : null}
            {changePercent > 0 ? "+" : ""}
            {changePercent.toFixed(2)}%
          </span>
          <span className={`text-xs font-mono ${changeColor}`}>
            ({change > 0 ? "+" : ""}₹{change.toFixed(2)})
          </span>
        </div>
        <p className="text-[10px] text-slate-400 font-mono">
          {new Date(stock.lastUpdated).toLocaleTimeString("en-IN")}
        </p>
      </div>

      {/* ── 52-Week Range ─────────────────────────────────────────────── */}
      <div className="space-y-1.5 pt-2 border-t border-slate-100">
        <div className="flex justify-between text-[10px] font-semibold text-slate-500">
          <span>52W Low</span>
          <span>52W High</span>
        </div>
        <div className="relative w-full h-1.5 bg-slate-100 rounded-full">
          <div
            className="absolute h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full transition-all duration-300"
            style={{ width: `${clampedRange}%` }}
          />
          <div
            className="absolute w-2.5 h-2.5 rounded-full bg-blue-600 border-2 border-white shadow-sm -top-0.5 transition-all duration-300"
            style={{ left: `calc(${clampedRange}% - 5px)` }}
          />
        </div>
        <div className="flex justify-between text-[10px] font-mono text-slate-400 tabular-nums">
          <span>₹{stock.low52Week.toLocaleString("en-IN")}</span>
          <span>₹{stock.high52Week.toLocaleString("en-IN")}</span>
        </div>
      </div>

      {/* ── Key Statistics ────────────────────────────────────────────── */}
      <div className="space-y-2 pt-2 border-t border-slate-100">
        <div className="flex items-center gap-1.5">
          <BarChart3 className="w-3.5 h-3.5 text-blue-600" />
          <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wide">
            Key Statistics
          </span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <StatCard label="Market Cap" value={formatMarketCap(stock.marketCap)} />
          <StatCard
            label="P/E Ratio"
            value={stock.peRatio !== null ? stock.peRatio.toFixed(1) : "—"}
          />
          <StatCard
            label="P/B Ratio"
            value={stock.pbRatio !== null ? stock.pbRatio.toFixed(2) : "—"}
          />
          <StatCard
            label="ROE"
            value={`${stock.roe.toFixed(1)}%`}
            color={
              stock.roe >= 15
                ? "text-green-600"
                : stock.roe < 0
                ? "text-red-500"
                : "text-slate-700"
            }
          />
          <StatCard label="ROCE" value={`${stock.roce.toFixed(1)}%`} />
          <StatCard
            label="RSI (14)"
            value={stock.rsi}
            color={
              stock.rsi >= 70
                ? "text-red-500"
                : stock.rsi <= 30
                ? "text-green-600"
                : "text-slate-700"
            }
          />
          <StatCard label="Beta" value={stock.beta.toFixed(2)} />
          <StatCard label="Volume" value={formatVolume(stock.volume)} />
          <StatCard
            label="Div Yield"
            value={
              stock.dividendYield !== null
                ? `${stock.dividendYield.toFixed(2)}%`
                : "—"
            }
          />
        </div>
      </div>

      {/* ── Real-Time Candlestick Chart ───────────────────────────────── */}
      <StockChart symbol={stock.symbol} />
    </div>
  );
}
