import React from "react";
import { Loader2 } from "lucide-react";

export default function ScreenerLoading() {
  return (
    <div className="flex-1 flex items-center justify-center h-[calc(100vh-57px)] bg-[#f8fafc]">
      <div className="flex flex-col items-center gap-3 animate-fade-in">
        <div className="relative">
          <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
            <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
          </div>
        </div>
        <div className="text-center">
          <p className="text-sm font-semibold text-slate-700">Loading Screener</p>
          <p className="text-xs text-slate-400 mt-0.5">Fetching market data...</p>
        </div>
      </div>
    </div>
  );
}
