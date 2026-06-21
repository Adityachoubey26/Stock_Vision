"use client";

import React, { useState, useMemo } from "react";
import { useStocksQuery } from "@/features/screener/hooks/use-stocks-query";
import { useRealtimeStore } from "@/store/use-realtime-store";
import { StockChart } from "@/features/screener/components/stock-chart";
import { Search, ChevronLeft, ChevronRight, BarChart3, TrendingUp, TrendingDown } from "lucide-react";
import { formatMarketCap } from "@/lib/utils";

export default function AnalyticsPage() {
  const [selectedSymbol, setSelectedSymbol] = useState("RELIANCE");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [searchVal, setSearchVal] = useState("");

  const { data, isLoading } = useStocksQuery();
  const stocks = useMemo(() => data?.data || [], [data]);
  const livePrices = useRealtimeStore((state) => state.prices);

  // Filter list matching search query
  const filteredStocks = useMemo(() => {
    const term = searchVal.trim().toLowerCase();
    if (!term) return stocks.slice(0, 100); // return first 100 stocks as default suggestions
    return stocks
      .filter((s) => s.symbol.toLowerCase().includes(term) || s.name.toLowerCase().includes(term))
      .slice(0, 100);
  }, [stocks, searchVal]);

  const selectedStock = useMemo(() => {
    return stocks.find((s) => s.symbol === selectedSymbol);
  }, [stocks, selectedSymbol]);

  // Live price values from realtime pricing store
  const liveData = livePrices[selectedSymbol];
  const price = liveData?.price ?? selectedStock?.price ?? 0;
  const change = liveData?.change ?? selectedStock?.change ?? 0;
  const changePercent = liveData?.changePercent ?? selectedStock?.changePercent ?? 0;

  const isUp = changePercent >= 0;

  return (
    <div className="flex flex-1 h-[calc(100vh-93px)] overflow-hidden bg-slate-50 font-sans">
      
      {/* ── Left Sidebar Stock Selector ─────────────────────────────────── */}
      <div
        className={`relative flex-shrink-0 border-r border-slate-200 bg-white transition-all duration-300 ease-in-out ${
          isSidebarOpen ? "w-[240px]" : "w-0"
        }`}
      >
        <div className="h-full overflow-hidden w-[240px] flex flex-col">
          {/* Search Header */}
          <div className="p-3 border-b border-slate-100 space-y-2 select-none">
            <div className="flex items-center gap-2 font-bold text-slate-800 text-xs uppercase tracking-wider">
              <BarChart3 className="w-4 h-4 text-blue-600" />
              <span>Select Asset</span>
            </div>
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search symbol..."
                value={searchVal}
                onChange={(e) => setSearchVal(e.target.value)}
                className="w-full pl-8 pr-2 py-1 text-xs bg-slate-50 border border-slate-200 rounded focus:outline-none focus:border-blue-400"
              />
            </div>
          </div>

          {/* Stocks suggestion list */}
          <div className="flex-1 overflow-y-auto scrollbar-thin p-1.5 space-y-1">
            {isLoading ? (
              <div className="flex items-center justify-center p-8 text-xs text-slate-400">
                <span>Loading assets...</span>
              </div>
            ) : filteredStocks.length === 0 ? (
              <div className="flex items-center justify-center p-8 text-xs text-slate-400">
                <span>No assets found</span>
              </div>
            ) : (
              filteredStocks.map((stock) => {
                const isSelected = stock.symbol === selectedSymbol;
                const live = livePrices[stock.symbol];
                const sPrice = live?.price ?? stock.price;
                const sChgPct = live?.changePercent ?? stock.changePercent;
                const sIsUp = sChgPct >= 0;

                return (
                  <div
                    key={stock.symbol}
                    onClick={() => setSelectedSymbol(stock.symbol)}
                    className={`flex items-center justify-between p-2 rounded cursor-pointer transition-all ${
                      isSelected
                        ? "bg-blue-50 border border-blue-200"
                        : "hover:bg-slate-50 border border-transparent"
                    }`}
                  >
                    <div className="flex flex-col min-w-0 pr-1 select-none">
                      <span className="font-bold font-mono text-[11px] text-slate-800">
                        {stock.symbol}
                      </span>
                      <span className="text-[9px] text-slate-400 truncate max-w-[120px]">
                        {stock.name}
                      </span>
                    </div>
                    <div className="flex flex-col items-end shrink-0 select-none">
                      <span className="font-semibold font-mono text-[10px] text-slate-900 tabular-nums">
                        ₹{sPrice.toFixed(1)}
                      </span>
                      <span
                        className={`text-[9px] font-bold font-mono ${
                          sIsUp ? "text-emerald-600" : "text-rose-600"
                        }`}
                      >
                        {sIsUp ? "+" : ""}
                        {sChgPct.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Sidebar Collapse Toggle Button */}
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="absolute -right-3 top-4 z-40 flex items-center justify-center w-6 h-6 rounded-full bg-white border border-slate-200 shadow-md hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600 text-slate-400 transition-all duration-200 cursor-pointer"
        >
          {isSidebarOpen ? (
            <ChevronLeft className="w-3.5 h-3.5" />
          ) : (
            <ChevronRight className="w-3.5 h-3.5" />
          )}
        </button>
      </div>

      {/* ── Main Chart Workspace ────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col p-4 overflow-hidden gap-4 min-w-0">
        
        {/* Active stock metrics row */}
        {selectedStock ? (
          <div className="flex flex-wrap items-center justify-between bg-white border border-slate-200/80 rounded-xl p-4 shadow-sm select-none gap-4">
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-sm font-extrabold font-mono tracking-tight text-blue-700">
                  {selectedStock.symbol}
                </span>
                <span className="text-[9px] text-slate-450 font-bold bg-slate-50 border border-slate-200 px-2 py-0.5 rounded-full">
                  {selectedStock.sector}
                </span>
              </div>
              <h1 className="text-xs font-semibold text-slate-400 mt-1 max-w-[250px] truncate" title={selectedStock.name}>
                {selectedStock.name}
              </h1>
            </div>

            <div className="flex items-center gap-6">
              {/* Live pricing */}
              <div className="flex flex-col">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                  Live Price
                </span>
                <span className="text-lg font-extrabold text-slate-800 font-mono tracking-tight tabular-nums mt-0.5">
                  ₹{price.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>

              {/* Day change */}
              <div className="flex flex-col">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                  Day Return
                </span>
                <span
                  className={`inline-flex items-center gap-0.5 text-xs font-bold font-mono tabular-nums mt-1 px-1.5 py-0.5 rounded ${
                    isUp ? "text-emerald-700 bg-emerald-50" : "text-rose-700 bg-rose-50"
                  }`}
                >
                  {isUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  {isUp ? "+" : ""}
                  {changePercent.toFixed(2)}% (₹{change.toFixed(2)})
                </span>
              </div>

              {/* Cap metric */}
              <div className="hidden sm:flex flex-col">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                  Market Cap
                </span>
                <span className="text-xs font-bold text-slate-700 mt-1">
                  {formatMarketCap(selectedStock.marketCap)}
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-4 bg-white border border-slate-200 rounded-xl text-center text-xs text-slate-400">
            Select a stock to start analysis
          </div>
        )}

        {/* High performance chart container */}
        <div className="flex-1 bg-white border border-slate-200/80 rounded-xl p-4 shadow-lg overflow-y-auto scrollbar-thin">
          <StockChart symbol={selectedSymbol} />
        </div>

      </div>

    </div>
  );
}
