import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface WatchlistState {
  symbols: string[];
  addSymbol: (symbol: string) => void;
  removeSymbol: (symbol: string) => void;
  toggleSymbol: (symbol: string) => void;
}

export const useWatchlistStore = create<WatchlistState>()(
  persist(
    (set) => ({
      symbols: [],
      addSymbol: (symbol) =>
        set((state) => {
          if (state.symbols.includes(symbol)) return state;
          return { symbols: [...state.symbols, symbol] };
        }),
      removeSymbol: (symbol) =>
        set((state) => ({
          symbols: state.symbols.filter((s) => s !== symbol),
        })),
      toggleSymbol: (symbol) =>
        set((state) => {
          const isWatchlisted = state.symbols.includes(symbol);
          return {
            symbols: isWatchlisted
              ? state.symbols.filter((s) => s !== symbol)
              : [...state.symbols, symbol],
          };
        }),
    }),
    {
      name: "stockvision-watchlist-store",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
