import { NextRequest, NextResponse } from "next/server";
import { getLatestStocks, generateCandleData } from "@/lib/mock-data";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: { symbol: string } }
) {
  try {
    const { symbol } = params;
    const { searchParams } = new URL(request.url);
    const timeframe = (searchParams.get("timeframe") || "1M") as "1D" | "1W" | "1M" | "3M" | "1Y" | "5Y";

    const stocks = getLatestStocks();
    const stock = stocks.find(
      (s) => s.symbol.toUpperCase() === symbol.toUpperCase()
    );

    if (!stock) {
      return NextResponse.json(
        { message: `Stock ${symbol} not found` },
        { status: 404 }
      );
    }

    // Generate candlestick data for the requested timeframe
    const candles = generateCandleData(stock.price, timeframe);

    return NextResponse.json({
      stock,
      candles,
      timeframe,
    });
  } catch (error) {
    console.error("Stock Detail API Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
