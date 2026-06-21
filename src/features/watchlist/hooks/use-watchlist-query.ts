import { useQuery } from "@tanstack/react-query";
import { fetchStocks } from "@/lib/api-client";
import { useWatchlistStore } from "@/store/use-watchlist-store";
import { StocksResponse } from "@/types/stock";

export function useWatchlistQuery() {
  const { symbols } = useWatchlistStore();

  const isEnabled = symbols.length > 0;

  return useQuery<StocksResponse>({
    queryKey: ["watchlist-stocks", symbols],
    queryFn: () =>
      fetchStocks({
        symbols: symbols.join(","),
        limit: 1000, // Retrieve all matching watchlisted symbols
      }),
    enabled: isEnabled,
    refetchInterval: 5050, // Poll prices for watchlist (slightly offset to avoid query alignment race conditions)
  });
}
