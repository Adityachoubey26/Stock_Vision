// ─── Core Stock Interface ───────────────────────────────────────────────────
export interface Stock {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap: number;
  peRatio: number | null;
  pbRatio: number | null;
  dividendYield: number | null;
  sector: string;
  industry: string;
  high52Week: number;
  low52Week: number;
  roe: number;
  roce: number;
  rsi: number;
  beta: number;
  lastUpdated: string;
  // Flash state for real-time update animations
  flashDirection?: "up" | "down" | null;
}

// ─── Candlestick / OHLC Data ────────────────────────────────────────────────
export interface CandleData {
  time: number; // Unix timestamp in seconds
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

// ─── Filter Interface ───────────────────────────────────────────────────────
export interface ScreenerFilters {
  search: string;
  sector: string;
  industry: string;
  marketCapMin: number | null;
  marketCapMax: number | null;
  peMin: number | null;
  peMax: number | null;
  pbMin: number | null;
  pbMax: number | null;
  priceMin: number | null;
  priceMax: number | null;
  dividendYieldMin: number | null;
  dividendYieldMax: number | null;
  roeMin: number | null;
  roeMax: number | null;
  roceMin: number | null;
  roceMax: number | null;
  rsiMin: number | null;
  rsiMax: number | null;
  volumeMin: number | null;
  volumeMax: number | null;
  betaMin: number | null;
  betaMax: number | null;
}

// ─── API Request/Response ───────────────────────────────────────────────────
export interface StocksRequestParams {
  symbols?: string;
  search?: string;
  sector?: string;
  industry?: string;
  marketCapMin?: number;
  marketCapMax?: number;
  peMin?: number;
  peMax?: number;
  pbMin?: number;
  pbMax?: number;
  priceMin?: number;
  priceMax?: number;
  dividendYieldMin?: number;
  dividendYieldMax?: number;
  roeMin?: number;
  roeMax?: number;
  roceMin?: number;
  roceMax?: number;
  rsiMin?: number;
  rsiMax?: number;
  volumeMin?: number;
  volumeMax?: number;
  betaMin?: number;
  betaMax?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
}

export interface StocksResponse {
  data: Stock[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// ─── Sector Info ────────────────────────────────────────────────────────────
export interface SectorInfo {
  name: string;
  stockCount: number;
  avgPE: number;
  avgROE: number;
  industries: string[];
}

// ─── Active Filter Chip ─────────────────────────────────────────────────────
export interface ActiveFilter {
  key: string;
  label: string;
  value: string;
  type: "range" | "select";
}
