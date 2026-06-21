"use client";

import React, { useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";
import { useWatchlistQuery } from "../hooks/use-watchlist-query";
import { useScreenerColumns } from "@/features/screener/hooks/use-screener-columns";
import { useWatchlist } from "../hooks/use-watchlist";
import { Loader2, AlertCircle, Star } from "lucide-react";
import Link from "next/link";

export function WatchlistTable() {
  const { symbols } = useWatchlist();
  const { data, isLoading, isError, error, isFetching } = useWatchlistQuery();
  const columns = useScreenerColumns();

  const tableData = useMemo(() => data?.data || [], [data]);

  const table = useReactTable({
    data: tableData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const { rows } = table.getRowModel();

  if (symbols.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-white border border-slate-200 rounded-xl text-center shadow-card h-[320px]">
        <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 mb-3">
          <Star className="w-6 h-6 text-amber-500 animate-pulse" />
        </div>
        <p className="text-slate-800 font-semibold text-lg">Your watchlist is empty</p>
        <p className="text-sm text-slate-500 max-w-sm mt-1 mb-6">
          Add stocks to your watchlist by clicking the star icons in the screener.
        </p>
        <Link
          href="/screener"
          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-sm font-semibold text-white rounded-lg transition-all shadow-sm active:scale-[0.98]"
        >
          Go to Stock Screener
        </Link>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-white border border-slate-200 rounded-xl text-center shadow-card h-[300px]">
        <div className="p-3 bg-red-50 rounded-xl border border-red-200 mb-3">
          <AlertCircle className="w-6 h-6 text-red-500" />
        </div>
        <p className="text-slate-800 font-semibold text-lg">Watchlist Error</p>
        <p className="text-sm text-slate-500 max-w-sm mt-1">
          {error instanceof Error ? error.message : "Failed to load watchlisted stocks."}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-card overflow-hidden flex flex-col">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-5 py-3.5 bg-slate-50 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold text-slate-700">Watchlisted Stocks</span>
          <span className="text-xs text-slate-400 font-medium bg-white border border-slate-200 px-2 py-0.5 rounded-full">
            {symbols.length} stocks
          </span>
        </div>
        <div className="flex items-center gap-2">
          {isFetching && (
            <div className="flex items-center gap-1.5 text-xs font-medium text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full">
              <Loader2 className="w-3 h-3 animate-spin" />
              <span>Updating...</span>
            </div>
          )}
          {!isFetching && (
            <span className="text-[10px] text-slate-400 font-mono">
              Live · 5s
            </span>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto relative">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center p-12 h-[250px]">
            <Loader2 className="w-8 h-8 text-blue-500 animate-spin mb-2" />
            <span className="text-sm text-slate-400 font-medium">Loading watchlist...</span>
          </div>
        ) : (
          <div role="table" className="w-full min-w-[950px]">
            {/* Header */}
            <div
              role="rowgroup"
              className="stock-table-header flex"
            >
              {table.getHeaderGroups()[0].headers.map((header) => {
                const basis = header.id === "name" ? "200px" : header.id === "watchlist" ? "50px" : "110px";
                const grow = header.id === "name" ? 2 : 1;

                return (
                  <div
                    key={header.id}
                    role="columnheader"
                    className="px-4 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider select-none flex items-center gap-1.5"
                    style={{ flexBasis: basis, flexGrow: grow }}
                  >
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </div>
                );
              })}
            </div>

            {/* Body */}
            <div role="rowgroup">
              {rows.map((row) => (
                <div
                  key={row.id}
                  role="row"
                  className="hover:bg-slate-50 border-b border-slate-100 flex items-center transition-colors"
                >
                  {row.getVisibleCells().map((cell) => {
                    const basis = cell.column.id === "name" ? "200px" : cell.column.id === "watchlist" ? "50px" : "110px";
                    const grow = cell.column.id === "name" ? 2 : 1;

                    return (
                      <div
                        key={cell.id}
                        role="cell"
                        className="px-4 py-3 text-sm text-slate-600 flex items-center truncate"
                        style={{ flexBasis: basis, flexGrow: grow }}
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
