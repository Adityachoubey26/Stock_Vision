"use client";

import React, { useState } from "react";
import { useScreenerStore } from "@/store/use-screener-store";
import { ScreenerFilters } from "@/features/screener/components/screener-filters";
import { StockTable } from "@/features/screener/components/screener-table";
import { StockDetailPanel } from "@/features/screener/components/stock-detail-panel";
import {
  ChevronLeft,
  ChevronRight,
  PanelRightClose,
  PanelRightOpen,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default function ScreenerPage() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(true);
  const { activeSymbol } = useScreenerStore();

  return (
    <div className="flex flex-1 h-[calc(100vh-57px)] overflow-hidden bg-[#f8fafc]">
      {/* ═══ 1. Left Filter Sidebar ════════════════════════════════════════ */}
      <div
        className={`relative flex-shrink-0 transition-all duration-300 ease-in-out ${
          isSidebarCollapsed ? "w-0" : "w-[260px]"
        }`}
      >
        <div className="h-full overflow-hidden">
          {!isSidebarCollapsed && <ScreenerFilters />}
        </div>

        {/* Collapse/Expand toggle */}
        <button
          onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          className="absolute -right-3 top-1/2 -translate-y-1/2 z-30 flex items-center justify-center w-6 h-6 rounded-full bg-white border border-slate-200 shadow-sm hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600 text-slate-400 transition-all duration-200 cursor-pointer"
          title={isSidebarCollapsed ? "Show Filters" : "Hide Filters"}
        >
          {isSidebarCollapsed ? (
            <ChevronRight className="w-3.5 h-3.5" />
          ) : (
            <ChevronLeft className="w-3.5 h-3.5" />
          )}
        </button>
      </div>

      {/* ═══ 2. Main Stock Table ═══════════════════════════════════════════ */}
      <div className="flex-1 flex flex-col p-3 overflow-hidden min-w-0">
        <StockTable />
      </div>

      {/* ═══ 3. Right Detail Panel ═════════════════════════════════════════ */}
      <div
        className={`relative flex-shrink-0 transition-all duration-300 ease-in-out ${
          isDetailOpen ? "w-[320px]" : "w-0"
        }`}
      >
        <div className="h-full overflow-hidden">
          {isDetailOpen && (
            <div className="h-full bg-white border-l border-slate-200 p-4 overflow-y-auto scrollbar-thin">
              <StockDetailPanel symbol={activeSymbol} />
            </div>
          )}
        </div>

        {/* Detail panel toggle */}
        <button
          onClick={() => setIsDetailOpen(!isDetailOpen)}
          className="absolute -left-3 top-1/2 -translate-y-1/2 z-30 flex items-center justify-center w-6 h-6 rounded-full bg-white border border-slate-200 shadow-sm hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600 text-slate-400 transition-all duration-200 cursor-pointer"
          title={isDetailOpen ? "Hide Details" : "Show Details"}
        >
          {isDetailOpen ? (
            <PanelRightClose className="w-3.5 h-3.5" />
          ) : (
            <PanelRightOpen className="w-3.5 h-3.5" />
          )}
        </button>
      </div>
    </div>
  );
}
