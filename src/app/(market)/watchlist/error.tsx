"use client";

import React from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

export default function WatchlistError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex-1 flex items-center justify-center h-full bg-slate-50">
      <div className="flex flex-col items-center gap-4 max-w-sm text-center animate-fade-in">
        <div className="p-3 bg-red-50 rounded-xl border border-red-200">
          <AlertTriangle className="w-6 h-6 text-red-500" />
        </div>
        <div>
          <h2 className="text-sm font-bold text-slate-800">Watchlist Error</h2>
          <p className="text-xs text-slate-500 mt-1">
            {error.message || "An error occurred while loading your watchlist."}
          </p>
        </div>
        <button
          onClick={reset}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Try Again
        </button>
      </div>
    </div>
  );
}
