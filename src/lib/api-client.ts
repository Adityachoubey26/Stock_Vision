import { StocksRequestParams, StocksResponse, Stock } from "@/types/stock";

// ─── Fetch all stocks with filters ──────────────────────────────────────────
export async function fetchStocks(params: StocksRequestParams): Promise<StocksResponse> {
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      query.append(key, String(value));
    }
  });

  const response = await fetch(`/api/stocks?${query.toString()}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Failed to fetch stocks: ${response.statusText}`);
  }

  return response.json();
}

// ─── Fetch individual stock detail with candlestick data ────────────────────
export async function fetchStockDetail(
  symbol: string,
  timeframe: string = "1M"
): Promise<{
  stock: Stock;
  candles: { time: number; open: number; high: number; low: number; close: number; volume: number }[];
  timeframe: string;
}> {
  const response = await fetch(`/api/stocks/${encodeURIComponent(symbol)}?timeframe=${timeframe}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Failed to fetch stock detail: ${response.statusText}`);
  }

  return response.json();
}

// ─── Fetch sectors ──────────────────────────────────────────────────────────
export async function fetchSectors(): Promise<{
  sectors: { name: string; stockCount: number; avgPE: number; avgROE: number; industries: string[] }[];
}> {
  const response = await fetch("/api/sectors", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch sectors");
  }

  return response.json();
}

// ─── Fetch filter options ───────────────────────────────────────────────────
export async function fetchFilterOptions(): Promise<Record<string, unknown>> {
  const response = await fetch("/api/filters", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch filter options");
  }

  return response.json();
}
