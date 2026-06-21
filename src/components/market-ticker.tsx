"use client";

import React, { useEffect, useState } from "react";
import { TrendingUp, TrendingDown } from "lucide-react";
import { motion } from "framer-motion";

interface TickerItem {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  prevPrice: number;
}

const INITIAL_INDICES: TickerItem[] = [
  { symbol: "NIFTY 50", name: "NSE Index", price: 23450.20, change: 105.50, changePercent: 0.45, prevPrice: 23450.20 },
  { symbol: "SENSEX", name: "BSE Index", price: 77150.10, change: 292.80, changePercent: 0.38, prevPrice: 77150.10 },
  { symbol: "BANK NIFTY", name: "NSE Bank Index", price: 51200.50, change: -61.40, changePercent: -0.12, prevPrice: 51200.50 },
  { symbol: "GOLD 24K", name: "Commodity (10g)", price: 72300.00, change: 610.00, changePercent: 0.85, prevPrice: 72300.00 },
  { symbol: "CRUDE OIL", name: "Commodity (bbl)", price: 6850.00, change: -97.00, changePercent: -1.40, prevPrice: 6850.00 },
];

export function MarketTicker() {
  const [indices, setIndices] = useState<TickerItem[]>(INITIAL_INDICES);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndices((prev) =>
        prev.map((idx) => {
          // Volatility
          const vol = idx.symbol.includes("NIFTY") ? 0.0006 : idx.symbol.includes("GOLD") ? 0.001 : 0.0015;
          const drift = 0.00005;
          const fluctuation = drift + vol * (Math.random() * 2 - 1);
          const priceChange = idx.price * fluctuation;
          const newPrice = Math.max(1, parseFloat((idx.price + priceChange).toFixed(2)));
          const change = parseFloat((newPrice - (idx.price - idx.change)).toFixed(2));
          const changePercent = parseFloat(((change / (idx.price - idx.change)) * 100).toFixed(2));

          return {
            ...idx,
            prevPrice: idx.price,
            price: newPrice,
            change,
            changePercent,
          };
        })
      );
    }, 4000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full bg-slate-50 border-b border-slate-200/80 overflow-hidden select-none py-1.5 px-4 sm:px-6 lg:px-8">
      <div className="flex items-center gap-6 overflow-x-auto scrollbar-thin whitespace-nowrap justify-between md:justify-start">
        {indices.map((idx) => {
          const isUp = idx.change >= 0;
          const colorClass = isUp ? "text-emerald-600 bg-emerald-50/50 border-emerald-100/50" : "text-rose-600 bg-rose-50/50 border-rose-100/50";
          const flashClass = idx.price > idx.prevPrice 
            ? "bg-emerald-100/30" 
            : idx.price < idx.prevPrice 
              ? "bg-rose-100/30" 
              : "";

          return (
            <motion.div
              key={idx.symbol}
              layout
              className={`inline-flex items-center gap-2 border border-slate-200/50 bg-white/70 backdrop-blur-sm shadow-sm rounded-lg px-2.5 py-1 transition-all duration-300 ${flashClass} hover:border-blue-200 hover:shadow-[0_4px_12px_rgba(37,99,235,0.04)] cursor-pointer`}
            >
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-bold text-slate-800 tracking-tight uppercase">
                    {idx.symbol}
                  </span>
                  <span className={`inline-flex items-center gap-0.5 text-[9px] font-semibold rounded px-1 py-0.25 border ${colorClass}`}>
                    {isUp ? <TrendingUp className="w-2.5 h-2.5" /> : <TrendingDown className="w-2.5 h-2.5" />}
                    {isUp ? "+" : ""}{idx.changePercent.toFixed(2)}%
                  </span>
                </div>
                <div className="flex items-baseline gap-1.5 mt-0.5">
                  <span className="text-[11px] font-bold font-mono tracking-tight text-slate-900 tabular-nums">
                    ₹{idx.price.toLocaleString("en-IN", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </span>
                  <span className={`text-[9px] font-mono font-medium ${isUp ? "text-emerald-600" : "text-rose-600"}`}>
                    {isUp ? "+" : ""}{idx.change.toFixed(2)}
                  </span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
