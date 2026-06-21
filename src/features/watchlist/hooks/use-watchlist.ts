import { useEffect, useState } from "react";
import { useWatchlistStore } from "@/store/use-watchlist-store";

export function useWatchlist() {
  const [isHydrated, setIsHydrated] = useState(false);
  const symbols = useWatchlistStore((state) => state.symbols);
  const addSymbol = useWatchlistStore((state) => state.addSymbol);
  const removeSymbol = useWatchlistStore((state) => state.removeSymbol);
  const toggleSymbol = useWatchlistStore((state) => state.toggleSymbol);

  useEffect(() => {
    // Set hydrated true on mount in browser
    setIsHydrated(true);
  }, []);

  return {
    symbols: isHydrated ? symbols : [],
    addSymbol,
    removeSymbol,
    toggleSymbol,
    isHydrated,
  };
}
