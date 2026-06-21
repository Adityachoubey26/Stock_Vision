"use client";

import React, { useRef, useMemo, useState, useEffect, useCallback } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortingRowModel,
  getFilteredRowModel,
  flexRender,
  SortingState as TanStackSorting,
} from "@tanstack/react-table";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useStocksQuery } from "../hooks/use-stocks-query";
import { useScreenerColumns } from "../hooks/use-screener-columns";
import { useScreenerStore } from "@/store/use-screener-store";
import {
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Loader2,
  RefreshCw,
  Layers,
  Search,
} from "lucide-react";

export function ScreenerTable() {
  const { data, isLoading, isError, error, isFetching } = useStocksQuery();
  const columns = useScreenerColumns();
  const {
    sorting,
    setSorting,
    activeSymbol,
    setActiveSymbol,
    searchQuery,
    setSearchQuery,
  } = useScreenerStore();

  const tableData = useMemo(() => data?.data || [], [data]);
  const totalRows = data?.total || 0;

  // Row selection state
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});

  // TanStack sorting mapped from Zustand
  const tanstackSorting: TanStackSorting = useMemo(
    () => [{ id: sorting.id, desc: sorting.desc }],
    [sorting]
  );

  const table = useReactTable({
    data: tableData,
    columns,
    state: {
      sorting: tanstackSorting,
      rowSelection,
    },
    onSortingChange: (updater) => {
      if (typeof updater === "function") {
        const next = updater(tanstackSorting);
        if (next.length > 0) {
          setSorting({ id: next[0].id, desc: next[0].desc });
        }
      }
    },
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    manualSorting: true,
    manualPagination: true,
    manualFiltering: true,
    enableRowSelection: true,
  });

  const parentRef = useRef<HTMLDivElement>(null);
  const { rows } = table.getRowModel();

  // ── Virtualizer: 40px row height ──────────────────────────────────────
  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 40,
    overscan: 15,
  });

  // ── Keyboard Navigation ───────────────────────────────────────────────
  const [focusedRowIndex, setFocusedRowIndex] = useState<number>(-1);

  useEffect(() => {
    if (activeSymbol && tableData.length > 0) {
      const idx = tableData.findIndex((s) => s.symbol === activeSymbol);
      if (idx !== -1) setFocusedRowIndex(idx);
    }
  }, [activeSymbol, tableData]);

  useEffect(() => {
    if (focusedRowIndex >= 0 && focusedRowIndex < rows.length) {
      rowVirtualizer.scrollToIndex(focusedRowIndex, { align: "auto" });
      const symbol = rows[focusedRowIndex]?.original.symbol;
      if (symbol && symbol !== activeSymbol) {
        setActiveSymbol(symbol);
      }
    }
  }, [focusedRowIndex, rows, rowVirtualizer, activeSymbol, setActiveSymbol]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (rows.length === 0) return;

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setFocusedRowIndex((prev) => Math.min(rows.length - 1, prev + 1));
          break;
        case "ArrowUp":
          e.preventDefault();
          setFocusedRowIndex((prev) => Math.max(0, prev - 1));
          break;
        case " ":
          e.preventDefault();
          if (focusedRowIndex >= 0 && focusedRowIndex < rows.length) {
            rows[focusedRowIndex].toggleSelected();
          }
          break;
        case "Enter":
          e.preventDefault();
          if (focusedRowIndex >= 0 && focusedRowIndex < rows.length) {
            setActiveSymbol(rows[focusedRowIndex].original.symbol);
          }
          break;
        case "Home":
          e.preventDefault();
          setFocusedRowIndex(0);
          break;
        case "End":
          e.preventDefault();
          setFocusedRowIndex(rows.length - 1);
          break;
        case "PageDown":
          e.preventDefault();
          setFocusedRowIndex((prev) => Math.min(rows.length - 1, prev + 20));
          break;
        case "PageUp":
          e.preventDefault();
          setFocusedRowIndex((prev) => Math.max(0, prev - 20));
          break;
      }
    },
    [rows, focusedRowIndex, setActiveSymbol]
  );

  const handleRowClick = useCallback(
    (index: number, symbol: string) => {
      setFocusedRowIndex(index);
      setActiveSymbol(symbol);
    },
    [setActiveSymbol]
  );

  // ── Column width configuration ────────────────────────────────────────
  const getColumnWidth = (id: string): string => {
    const widths: Record<string, string> = {
      select: "40px",
      watchlist: "36px",
      symbol: "100px",
      name: "200px",
      sector: "140px",
      price: "110px",
      changePercent: "100px",
      volume: "90px",
      marketCap: "110px",
      peRatio: "70px",
      roe: "70px",
      rsi: "70px",
    };
    return widths[id] || "100px";
  };

  const isPinnedColumn = (id: string) =>
    id === "select" || id === "watchlist" || id === "symbol";

  const getLeftOffset = (id: string) => {
    if (id === "select") return "0px";
    if (id === "watchlist") return "40px";
    if (id === "symbol") return "76px";
    return undefined;
  };

  const selectedCount = Object.keys(rowSelection).filter(
    (key) => rowSelection[key]
  ).length;

  // ── Error State ───────────────────────────────────────────────────────
  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-white border border-slate-200 rounded-xl shadow-card text-center h-full min-h-[300px] animate-fade-in">
        <div className="p-3 bg-red-50 rounded-xl border border-red-200 mb-3">
          <RefreshCw className="w-6 h-6 text-red-500 animate-spin-reverse" />
        </div>
        <p className="text-slate-800 font-semibold text-sm">
          Connection Error
        </p>
        <p className="text-xs text-slate-500 max-w-xs mt-1">
          {error instanceof Error
            ? error.message
            : "Unable to connect to market feed. Please try again."}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white border border-slate-200 rounded-xl overflow-hidden shadow-card relative">
      {/* ── Toolbar ────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-white border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-slate-700 font-semibold text-sm">
            <Layers className="w-4 h-4 text-blue-600" />
            <span>Screener</span>
          </div>
          <div className="h-4 w-px bg-slate-200" />
          <span className="text-xs text-slate-400 font-medium bg-slate-50 border border-slate-200 px-2 py-0.5 rounded-full tabular-nums">
            {totalRows.toLocaleString()} stocks
          </span>
          {selectedCount > 0 && (
            <span className="text-xs font-semibold text-blue-600 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-full">
              {selectedCount} selected
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Inline search */}
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search symbol or company..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-56 pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 placeholder-slate-400 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
            />
          </div>

          {isFetching && (
            <div className="flex items-center gap-1.5 text-xs font-medium text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">
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

      {/* ── Table Viewport ─────────────────────────────────────────────── */}
      <div
        ref={parentRef}
        tabIndex={0}
        onKeyDown={handleKeyDown}
        className="flex-1 overflow-auto relative scrollbar-thin outline-none focus-visible:ring-2 focus-visible:ring-blue-200 focus-visible:ring-inset select-none"
        role="grid"
        aria-label="Stock screener table"
        aria-colcount={columns.length}
        aria-rowcount={rows.length}
      >
        {isLoading ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 z-30">
            <Loader2 className="w-8 h-8 text-blue-500 animate-spin mb-3" />
            <span className="text-sm text-slate-500 font-medium">
              Loading market data...
            </span>
          </div>
        ) : rows.length === 0 ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center z-20">
            <div className="p-3 bg-slate-50 rounded-xl mb-3">
              <Search className="w-6 h-6 text-slate-300" />
            </div>
            <p className="text-slate-600 font-semibold text-sm">
              No stocks match your criteria
            </p>
            <p className="text-xs text-slate-400 mt-1 max-w-sm">
              Try adjusting your filters or search query to see more results.
            </p>
          </div>
        ) : (
          <div className="w-full min-w-[1200px]" style={{ minHeight: "100%" }}>
            {/* ── Sticky Header Row ───────────────────────────────────── */}
            <div
              role="rowgroup"
              className="sticky top-0 z-20 flex stock-table-header"
            >
              {table.getHeaderGroups()[0].headers.map((header) => {
                const isSortable = header.column.getCanSort();
                const currentSort = sorting.id === header.id;
                const pinned = isPinnedColumn(header.id);
                const left = getLeftOffset(header.id);
                const width = getColumnWidth(header.id);

                return (
                  <div
                    key={header.id}
                    role="columnheader"
                    onClick={
                      isSortable
                        ? header.column.getToggleSortingHandler()
                        : undefined
                    }
                    className={`px-3 py-2.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1 select-none transition-colors ${
                      isSortable
                        ? "cursor-pointer hover:text-blue-600 hover:bg-blue-50/60"
                        : ""
                    } ${
                      pinned ? "sticky z-30 bg-gradient-to-b from-slate-50 to-slate-100" : ""
                    } ${
                      header.id === "symbol"
                        ? "border-r border-slate-200"
                        : ""
                    }`}
                    style={{
                      ...(pinned
                        ? {
                            left,
                            width,
                            flexBasis: width,
                            flexShrink: 0,
                            flexGrow: 0,
                          }
                        : {
                            flexBasis: width,
                            flexGrow: header.id === "name" ? 2 : 1,
                          }),
                    }}
                  >
                    <div className="flex items-center gap-1 truncate w-full">
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                      {isSortable &&
                        (currentSort ? (
                          sorting.desc ? (
                            <ArrowDown className="w-3 h-3 text-blue-600 shrink-0" />
                          ) : (
                            <ArrowUp className="w-3 h-3 text-blue-600 shrink-0" />
                          )
                        ) : (
                          <ArrowUpDown className="w-3 h-3 text-slate-300 shrink-0 opacity-0 group-hover:opacity-100" />
                        ))}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* ── Virtualized Rows ────────────────────────────────────── */}
            <div
              role="rowgroup"
              className="relative"
              style={{ height: `${rowVirtualizer.getTotalSize()}px` }}
            >
              {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                const row = rows[virtualRow.index];
                const isSelected = row.getIsSelected();
                const isFocused = virtualRow.index === focusedRowIndex;

                return (
                  <div
                    key={row.id}
                    role="row"
                    onClick={() =>
                      handleRowClick(virtualRow.index, row.original.symbol)
                    }
                    className={`absolute left-0 w-full flex items-center transition-colors duration-100 border-b cursor-pointer ${
                      isFocused
                        ? "bg-blue-50 border-blue-200 stock-row-active"
                        : isSelected
                        ? "bg-blue-50/50 border-slate-100 hover:bg-blue-50"
                        : "border-slate-100/80 hover:bg-slate-50"
                    }`}
                    style={{
                      height: `${virtualRow.size}px`,
                      transform: `translateY(${virtualRow.start}px)`,
                    }}
                    aria-selected={isFocused}
                  >
                    {row.getVisibleCells().map((cell) => {
                      const pinned = isPinnedColumn(cell.column.id);
                      const left = getLeftOffset(cell.column.id);
                      const width = getColumnWidth(cell.column.id);

                      return (
                        <div
                          key={cell.id}
                          role="gridcell"
                          className={`px-3 py-1.5 text-xs flex items-center truncate ${
                            pinned
                              ? isFocused
                                ? "sticky z-10 bg-blue-50"
                                : isSelected
                                ? "sticky z-10 bg-blue-50/50"
                                : "sticky z-10 bg-white"
                              : ""
                          } ${
                            cell.column.id === "symbol"
                              ? "border-r border-slate-100"
                              : ""
                          }`}
                          style={{
                            ...(pinned
                              ? {
                                  left,
                                  width,
                                  flexBasis: width,
                                  flexShrink: 0,
                                  flexGrow: 0,
                                }
                              : {
                                  flexBasis: width,
                                  flexGrow:
                                    cell.column.id === "name" ? 2 : 1,
                                }),
                          }}
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* ── Status Bar ─────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between px-4 py-2 bg-slate-50 border-t border-slate-200 text-xs">
        <div className="flex items-center gap-3 text-slate-400">
          <span className="font-medium">
            Showing {rows.length.toLocaleString()} of{" "}
            {totalRows.toLocaleString()} stocks
          </span>
        </div>
        <div className="flex items-center gap-2 text-slate-400">
          <span className="text-[10px] font-mono">
            ↑↓ Navigate · Space Select · Enter View
          </span>
        </div>
      </div>
    </div>
  );
}

export const StockTable = React.memo(ScreenerTable);
