"use client";

import React from "react";
import { WatchlistTable } from "@/features/watchlist/components/watchlist-table";
import { Star } from "lucide-react";

export default function WatchlistPage() {
  return (
    <div className="flex-1 bg-[#f8fafc] p-6">
      <div className="container mx-auto max-w-7xl space-y-4">
        {/* Page Header */}
        <div className="flex items-center gap-3">
          <div className="p-2 bg-amber-50 border border-amber-200 rounded-lg">
            <Star className="w-5 h-5 text-amber-500" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-800">Watchlist</h1>
            <p className="text-xs text-slate-500">Track your favorite stocks in real-time</p>
          </div>
        </div>

        {/* Watchlist Table */}
        <WatchlistTable />
      </div>
    </div>
  );
}
