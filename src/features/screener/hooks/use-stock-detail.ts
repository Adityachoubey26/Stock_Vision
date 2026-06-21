import { useQuery } from "@tanstack/react-query";
import { fetchStockDetail } from "@/lib/api-client";

export function useStockDetail(symbol: string | null, timeframe: string = "1M") {
  return useQuery({
    queryKey: ["stock-detail", symbol, timeframe],
    queryFn: () => fetchStockDetail(symbol!, timeframe),
    enabled: !!symbol,
    refetchInterval: 5000,
    staleTime: 3000,
  });
}
