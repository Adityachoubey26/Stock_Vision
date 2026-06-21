import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { fetchStocks } from "@/lib/api-client";
import { useScreenerStore } from "@/store/use-screener-store";
import { useDebounce } from "@/hooks/use-debounce";
import { StocksRequestParams } from "@/types/stock";

export function useStocksQuery() {
  const { filters, sorting, page, limit } = useScreenerStore();
  const debouncedSearch = useDebounce(filters.search, 300);

  const params: StocksRequestParams = {
    search: debouncedSearch,
    sector: filters.sector === "All" ? undefined : filters.sector,
    industry: filters.industry === "All" ? undefined : filters.industry,
    marketCapMin: filters.marketCapMin ?? undefined,
    marketCapMax: filters.marketCapMax ?? undefined,
    peMin: filters.peMin ?? undefined,
    peMax: filters.peMax ?? undefined,
    pbMin: filters.pbMin ?? undefined,
    pbMax: filters.pbMax ?? undefined,
    priceMin: filters.priceMin ?? undefined,
    priceMax: filters.priceMax ?? undefined,
    dividendYieldMin: filters.dividendYieldMin ?? undefined,
    dividendYieldMax: filters.dividendYieldMax ?? undefined,
    roeMin: filters.roeMin ?? undefined,
    roeMax: filters.roeMax ?? undefined,
    roceMin: filters.roceMin ?? undefined,
    roceMax: filters.roceMax ?? undefined,
    rsiMin: filters.rsiMin ?? undefined,
    rsiMax: filters.rsiMax ?? undefined,
    volumeMin: filters.volumeMin ?? undefined,
    volumeMax: filters.volumeMax ?? undefined,
    betaMin: filters.betaMin ?? undefined,
    betaMax: filters.betaMax ?? undefined,
    sortBy: sorting.id,
    sortOrder: sorting.desc ? "desc" : "asc",
    page,
    limit,
  };

  return useQuery({
    queryKey: ["stocks", params],
    queryFn: () => fetchStocks(params),
    refetchInterval: 5000,
    placeholderData: keepPreviousData,
  });
}
