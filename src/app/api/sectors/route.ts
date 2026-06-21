import { NextResponse } from "next/server";
import { getSectorStats } from "@/lib/mock-data";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const sectors = getSectorStats();
    return NextResponse.json({ sectors });
  } catch (error) {
    console.error("Sectors API Error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
