import { useMemo } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Stock } from "@/types/stock";
import { formatPercentage, formatVolume, formatMarketCap } from "@/lib/utils";
import { useWatchlist } from "@/features/watchlist/hooks/use-watchlist";
import { Star } from "lucide-react";
import React from "react";
import { useRealtimeStore } from "@/store/use-realtime-store";

function LivePriceCell({
  symbol,
  initialPrice,
  initialChange,
}: {
  symbol: string;
  initialPrice: number;
  initialChange: number;
}) {
  const liveData = useRealtimeStore((state) => state.prices[symbol]);
  const price = liveData?.price ?? initialPrice;
  const change = liveData?.change ?? initialChange;
  const flash = liveData?.flash ?? null;

  const isUp = change >= 0;

  const flashClass =
    flash === "up" ? "flash-up" : flash === "down" ? "flash-down" : "";
  const colorClass =
    flash === "up"
      ? "text-emerald-600 font-bold"
      : flash === "down"
      ? "text-rose-600 font-bold"
      : isUp
      ? "text-green-600"
      : "text-red-600";

  return (
    <span
      className={`font-mono text-xs font-semibold tabular-nums px-1 py-0.5 rounded transition-all duration-300 ${flashClass} ${colorClass}`}
    >
      ₹
      {price.toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}
    </span>
  );
}

function LiveChangeCell({
  symbol,
  initialChangePercent,
}: {
  symbol: string;
  initialChangePercent: number;
}) {
  const liveData = useRealtimeStore((state) => state.prices[symbol]);
  const cp = liveData?.changePercent ?? initialChangePercent;
  const flash = liveData?.flash ?? null;

  const isUp = cp > 0;
  const isDown = cp < 0;

  const flashClass =
    flash === "up" ? "flash-up" : flash === "down" ? "flash-down" : "";
  const bgClass = isUp
    ? "text-green-700 bg-green-50"
    : isDown
    ? "text-red-700 bg-red-50"
    : "text-slate-500 bg-slate-50";

  return (
    <span
      className={`inline-flex items-center gap-0.5 font-semibold font-mono text-xs tabular-nums px-1.5 py-0.5 rounded transition-all duration-300 ${flashClass} ${bgClass}`}
    >
      {isUp ? "▲" : isDown ? "▼" : ""} {formatPercentage(cp)}
    </span>
  );
}


export function useScreenerColumns() {
  const { symbols, toggleSymbol } = useWatchlist();

  const columns = useMemo<ColumnDef<Stock>[]>(
    () => [
      // ── Row Selection ─────────────────────────────────────────────
      {
        id: "select",
        header: ({ table }) => (
          <div className="flex items-center justify-center w-full">
            <input
              type="checkbox"
              checked={table.getIsAllPageRowsSelected()}
              onChange={table.getToggleAllPageRowsSelectedHandler()}
              className="w-3.5 h-3.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500/30 cursor-pointer accent-blue-600"
              aria-label="Select all rows"
            />
          </div>
        ),
        cell: ({ row }) => (
          <div className="flex items-center justify-center w-full">
            <input
              type="checkbox"
              checked={row.getIsSelected()}
              disabled={!row.getCanSelect()}
              onChange={row.getToggleSelectedHandler()}
              className="w-3.5 h-3.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500/30 cursor-pointer accent-blue-600"
              aria-label={`Select ${row.original.symbol}`}
            />
          </div>
        ),
        enableSorting: false,
        size: 40,
      },
      // ── Watchlist Toggle ──────────────────────────────────────────
      {
        id: "watchlist",
        header: "",
        cell: ({ row }) => {
          const symbol = row.original.symbol;
          const isWatchlisted = symbols.includes(symbol);
          return (
            <div className="flex items-center justify-center w-full">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleSymbol(symbol);
                }}
                className="p-0.5 hover:scale-110 transition-transform focus:outline-none"
                title={isWatchlisted ? "Remove from watchlist" : "Add to watchlist"}
              >
                <Star
                  className={`w-3.5 h-3.5 transition-colors ${
                    isWatchlisted
                      ? "fill-amber-400 text-amber-400"
                      : "text-slate-300 hover:text-amber-300"
                  }`}
                />
              </button>
            </div>
          );
        },
        enableSorting: false,
        size: 36,
      },
      // ── Symbol (Pinned) ───────────────────────────────────────────
      {
        accessorKey: "symbol",
        header: "Symbol",
        cell: ({ row }) => (
          <span className="font-semibold text-blue-700 font-mono text-xs tracking-tight">
            {row.original.symbol}
          </span>
        ),
        size: 100,
      },
      // ── Company Name ──────────────────────────────────────────────
      {
        accessorKey: "name",
        header: "Company",
        cell: ({ row }) => (
          <span
            className="text-slate-700 truncate font-medium text-xs block max-w-[200px]"
            title={row.original.name}
          >
            {row.original.name}
          </span>
        ),
        size: 200,
      },
      // ── Sector ────────────────────────────────────────────────────
      {
        accessorKey: "sector",
        header: "Sector",
        cell: ({ row }) => (
          <span className="text-slate-500 text-[11px] font-medium truncate block max-w-[140px]" title={row.original.sector}>
            {row.original.sector}
          </span>
        ),
        size: 140,
      },
      // ── Price ─────────────────────────────────────────────────────
      {
        accessorKey: "price",
        header: "Price",
        cell: ({ row }) => {
          const { price, change, symbol } = row.original;
          return (
            <LivePriceCell
              symbol={symbol}
              initialPrice={price}
              initialChange={change}
            />
          );
        },
        size: 110,
      },
      // ── Change % ──────────────────────────────────────────────────
      {
        accessorKey: "changePercent",
        header: "Chg %",
        cell: ({ row }) => {
          const { changePercent, symbol } = row.original;
          return (
            <LiveChangeCell
              symbol={symbol}
              initialChangePercent={changePercent}
            />
          );
        },
        size: 100,
      },
      // ── Volume ────────────────────────────────────────────────────
      {
        accessorKey: "volume",
        header: "Volume",
        cell: ({ row }) => (
          <span className="font-mono text-xs text-slate-500 tabular-nums">
            {formatVolume(row.original.volume)}
          </span>
        ),
        size: 90,
      },
      // ── Market Cap ────────────────────────────────────────────────
      {
        accessorKey: "marketCap",
        header: "Market Cap",
        cell: ({ row }) => (
          <span className="font-mono text-xs text-slate-600 tabular-nums">
            {formatMarketCap(row.original.marketCap)}
          </span>
        ),
        size: 110,
      },
      // ── P/E Ratio ─────────────────────────────────────────────────
      {
        accessorKey: "peRatio",
        header: "PE",
        cell: ({ row }) => {
          const pe = row.original.peRatio;
          return (
            <span className={`font-mono text-xs tabular-nums ${pe !== null && pe < 15 ? "text-green-600 font-medium" : "text-slate-500"}`}>
              {pe !== null ? pe.toFixed(1) : "—"}
            </span>
          );
        },
        size: 70,
      },
      // ── ROE ───────────────────────────────────────────────────────
      {
        accessorKey: "roe",
        header: "ROE",
        cell: ({ row }) => {
          const roe = row.original.roe;
          return (
            <span
              className={`font-mono text-xs font-medium tabular-nums ${
                roe >= 15 ? "text-green-600" : roe < 0 ? "text-red-500" : "text-slate-500"
              }`}
            >
              {roe.toFixed(1)}%
            </span>
          );
        },
        size: 70,
      },
      // ── RSI ───────────────────────────────────────────────────────
      {
        accessorKey: "rsi",
        header: "RSI",
        cell: ({ row }) => {
          const rsi = row.original.rsi;
          const isOverbought = rsi >= 70;
          const isOversold = rsi <= 30;
          return (
            <span
              className={`font-mono text-xs font-semibold tabular-nums px-1.5 py-0.5 rounded ${
                isOverbought
                  ? "bg-red-50 text-red-600 border border-red-200"
                  : isOversold
                  ? "bg-green-50 text-green-600 border border-green-200"
                  : "text-slate-500"
              }`}
            >
              {rsi}
            </span>
          );
        },
        size: 70,
      },
    ],
    [symbols, toggleSymbol]
  );

  return columns;
}
