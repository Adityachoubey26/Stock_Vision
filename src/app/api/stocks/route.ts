import { NextRequest, NextResponse } from "next/server";
import { Stock } from "@/types/stock";
import { getLatestStocks } from "@/lib/mock-data";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Extract all query parameters
    const symbolsParam = searchParams.get("symbols") || "";
    const search = searchParams.get("search")?.toLowerCase() || "";
    const sector = searchParams.get("sector") || "All";
    const industry = searchParams.get("industry") || "All";

    const getNum = (key: string) =>
      searchParams.has(key) ? parseFloat(searchParams.get(key)!) : null;

    const marketCapMin = getNum("marketCapMin");
    const marketCapMax = getNum("marketCapMax");
    const peMin = getNum("peMin");
    const peMax = getNum("peMax");
    const pbMin = getNum("pbMin");
    const pbMax = getNum("pbMax");
    const priceMin = getNum("priceMin");
    const priceMax = getNum("priceMax");
    const dividendYieldMin = getNum("dividendYieldMin");
    const dividendYieldMax = getNum("dividendYieldMax");
    const roeMin = getNum("roeMin");
    const roeMax = getNum("roeMax");
    const roceMin = getNum("roceMin");
    const roceMax = getNum("roceMax");
    const rsiMin = getNum("rsiMin");
    const rsiMax = getNum("rsiMax");
    const volumeMin = getNum("volumeMin");
    const volumeMax = getNum("volumeMax");
    const betaMin = getNum("betaMin");
    const betaMax = getNum("betaMax");

    const sortBy = searchParams.get("sortBy") || "symbol";
    const sortOrder = (searchParams.get("sortOrder") || "asc") as "asc" | "desc";
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "5000", 10);

    // Get live fluctuating data
    let stocks = getLatestStocks();

    // ── Apply Filters ────────────────────────────────────────────────────
    if (symbolsParam) {
      const symbolsList = symbolsParam.split(",").map((s) => s.trim().toUpperCase());
      stocks = stocks.filter((s) => symbolsList.includes(s.symbol.toUpperCase()));
    }

    if (search) {
      stocks = stocks.filter(
        (s) =>
          s.symbol.toLowerCase().includes(search) ||
          s.name.toLowerCase().includes(search)
      );
    }

    if (sector !== "All") {
      stocks = stocks.filter((s) => s.sector === sector);
    }

    if (industry !== "All") {
      stocks = stocks.filter((s) => s.industry === industry);
    }

    // Range filters helper
    const rangeFilter = (
      list: Stock[],
      key: keyof Stock,
      min: number | null,
      max: number | null,
      allowNull: boolean = false
    ) => {
      if (min !== null) {
        list = list.filter((s) => {
          const val = s[key];
          if (val === null || val === undefined) return allowNull;
          return (val as number) >= min;
        });
      }
      if (max !== null) {
        list = list.filter((s) => {
          const val = s[key];
          if (val === null || val === undefined) return allowNull;
          return (val as number) <= max;
        });
      }
      return list;
    };

    stocks = rangeFilter(stocks, "marketCap", marketCapMin, marketCapMax);
    stocks = rangeFilter(stocks, "peRatio", peMin, peMax);
    stocks = rangeFilter(stocks, "pbRatio", pbMin, pbMax);
    stocks = rangeFilter(stocks, "price", priceMin, priceMax);
    stocks = rangeFilter(stocks, "dividendYield", dividendYieldMin, dividendYieldMax);
    stocks = rangeFilter(stocks, "roe", roeMin, roeMax);
    stocks = rangeFilter(stocks, "roce", roceMin, roceMax);
    stocks = rangeFilter(stocks, "rsi", rsiMin, rsiMax);
    stocks = rangeFilter(stocks, "volume", volumeMin, volumeMax);
    stocks = rangeFilter(stocks, "beta", betaMin, betaMax);

    // ── Apply Sorting ────────────────────────────────────────────────────
    stocks.sort((a, b) => {
      const valA = a[sortBy as keyof Stock];
      const valB = b[sortBy as keyof Stock];

      if (valA === null || valA === undefined) return 1;
      if (valB === null || valB === undefined) return -1;

      if (typeof valA === "string" && typeof valB === "string") {
        return sortOrder === "asc" ? valA.localeCompare(valB) : valB.localeCompare(valA);
      }

      if (typeof valA === "number" && typeof valB === "number") {
        return sortOrder === "asc" ? valA - valB : valB - valA;
      }

      return 0;
    });

    // ── Paginate ─────────────────────────────────────────────────────────
    const total = stocks.length;
    const startIndex = (page - 1) * limit;
    const paginatedData = stocks.slice(startIndex, startIndex + limit);

    return NextResponse.json({
      data: paginatedData,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("Stocks API Error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
