import { NextResponse } from "next/server";
import { SECTORS, INDUSTRIES_BY_SECTOR } from "@/lib/mock-data";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const filterOptions = {
      sectors: ["All", ...SECTORS],
      industries: INDUSTRIES_BY_SECTOR,
      ranges: {
        price: { min: 1, max: 100000, step: 100, label: "Price (₹)" },
        marketCap: { min: 0, max: 2000000000000000, step: 1000000000, label: "Market Cap (₹)" },
        peRatio: { min: 0, max: 100, step: 1, label: "P/E Ratio" },
        pbRatio: { min: 0, max: 30, step: 0.5, label: "P/B Ratio" },
        roe: { min: -20, max: 80, step: 1, label: "ROE (%)" },
        roce: { min: -20, max: 100, step: 1, label: "ROCE (%)" },
        rsi: { min: 0, max: 100, step: 1, label: "RSI (14)" },
        beta: { min: 0, max: 3, step: 0.1, label: "Beta" },
        volume: { min: 0, max: 20000000, step: 100000, label: "Volume" },
        dividendYield: { min: 0, max: 10, step: 0.1, label: "Dividend Yield (%)" },
      },
    };

    return NextResponse.json(filterOptions);
  } catch (error) {
    console.error("Filters API Error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
