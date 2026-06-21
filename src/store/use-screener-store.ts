import { create } from "zustand";
import { ScreenerFilters } from "@/types/stock";

// ─── Sorting State ──────────────────────────────────────────────────────────
export interface SortingState {
  id: string;
  desc: boolean;
}

// ─── UI State ───────────────────────────────────────────────────────────────
interface ScreenerState {
  // Data state
  filters: ScreenerFilters;
  sorting: SortingState;
  columnVisibility: Record<string, boolean>;
  columnOrder: string[];
  page: number;
  limit: number;
  activeSymbol: string | null;

  // UI state
  isSidebarOpen: boolean;
  isDetailPanelOpen: boolean;
  searchQuery: string;

  // Actions
  setFilter: <K extends keyof ScreenerFilters>(key: K, value: ScreenerFilters[K]) => void;
  setFilters: (filters: Partial<ScreenerFilters>) => void;
  resetFilters: () => void;
  setSorting: (sorting: SortingState) => void;
  setColumnVisibility: (visibility: Record<string, boolean>) => void;
  setColumnOrder: (order: string[]) => void;
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
  setActiveSymbol: (symbol: string | null) => void;
  setSidebarOpen: (open: boolean) => void;
  setDetailPanelOpen: (open: boolean) => void;
  setSearchQuery: (query: string) => void;

  // Computed
  getActiveFilters: () => { key: string; label: string; value: string }[];
}

// ─── Initial Filter State ───────────────────────────────────────────────────
const initialFilters: ScreenerFilters = {
  search: "",
  sector: "All",
  industry: "All",
  marketCapMin: null,
  marketCapMax: null,
  peMin: null,
  peMax: null,
  pbMin: null,
  pbMax: null,
  priceMin: null,
  priceMax: null,
  dividendYieldMin: null,
  dividendYieldMax: null,
  roeMin: null,
  roeMax: null,
  roceMin: null,
  roceMax: null,
  rsiMin: null,
  rsiMax: null,
  volumeMin: null,
  volumeMax: null,
  betaMin: null,
  betaMax: null,
};

// ─── Filter Label Map ───────────────────────────────────────────────────────
const filterLabels: Record<string, string> = {
  sector: "Sector",
  industry: "Industry",
  priceMin: "Price ≥",
  priceMax: "Price ≤",
  marketCapMin: "MCap ≥",
  marketCapMax: "MCap ≤",
  peMin: "PE ≥",
  peMax: "PE ≤",
  pbMin: "PB ≥",
  pbMax: "PB ≤",
  roeMin: "ROE ≥",
  roeMax: "ROE ≤",
  roceMin: "ROCE ≥",
  roceMax: "ROCE ≤",
  rsiMin: "RSI ≥",
  rsiMax: "RSI ≤",
  volumeMin: "Vol ≥",
  volumeMax: "Vol ≤",
  betaMin: "Beta ≥",
  betaMax: "Beta ≤",
  dividendYieldMin: "Div ≥",
  dividendYieldMax: "Div ≤",
};

// ─── Store ──────────────────────────────────────────────────────────────────
export const useScreenerStore = create<ScreenerState>((set, get) => ({
  filters: { ...initialFilters },
  sorting: { id: "marketCap", desc: true },
  columnVisibility: {
    symbol: true,
    name: true,
    price: true,
    changePercent: true,
    volume: true,
    marketCap: true,
    peRatio: true,
    roe: true,
    rsi: true,
    sector: true,
    industry: false,
  },
  columnOrder: [],
  page: 1,
  limit: 5000,
  activeSymbol: "RELIANCE",
  isSidebarOpen: true,
  isDetailPanelOpen: true,
  searchQuery: "",

  setFilter: (key, value) =>
    set((state) => ({
      filters: { ...state.filters, [key]: value },
      page: 1,
    })),

  setFilters: (partialFilters) =>
    set((state) => ({
      filters: { ...state.filters, ...partialFilters },
      page: 1,
    })),

  resetFilters: () => set({ filters: { ...initialFilters }, page: 1 }),

  setSorting: (sorting) => set({ sorting, page: 1 }),
  setColumnVisibility: (columnVisibility) => set({ columnVisibility }),
  setColumnOrder: (columnOrder) => set({ columnOrder }),
  setPage: (page) => set({ page }),
  setLimit: (limit) => set({ limit, page: 1 }),
  setActiveSymbol: (activeSymbol) => set({ activeSymbol }),
  setSidebarOpen: (isSidebarOpen) => set({ isSidebarOpen }),
  setDetailPanelOpen: (isDetailPanelOpen) => set({ isDetailPanelOpen }),
  setSearchQuery: (searchQuery) =>
    set((state) => ({
      searchQuery,
      filters: { ...state.filters, search: searchQuery },
      page: 1,
    })),

  getActiveFilters: () => {
    const { filters } = get();
    const active: { key: string; label: string; value: string }[] = [];

    Object.entries(filters).forEach(([key, value]) => {
      if (key === "search") return;
      if (value === null || value === "All" || value === "") return;
      active.push({
        key,
        label: filterLabels[key] || key,
        value: String(value),
      });
    });

    return active;
  },
}));
