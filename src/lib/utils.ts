import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ─── Indian Rupee formatting ────────────────────────────────────────────────
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatCurrencyShort(value: number): string {
  if (value >= 10000000) {
    return `₹${(value / 10000000).toFixed(2)} Cr`;
  }
  if (value >= 100000) {
    return `₹${(value / 100000).toFixed(2)} L`;
  }
  return formatCurrency(value);
}

// ─── Compact number formatting (Indian system) ─────────────────────────────
export function formatCompactNumber(value: number): string {
  if (value >= 10000000000000) {
    return `₹${(value / 10000000000000).toFixed(1)}L Cr`;
  }
  if (value >= 100000000000) {
    return `₹${(value / 10000000).toFixed(0)} Cr`;
  }
  if (value >= 10000000) {
    return `₹${(value / 10000000).toFixed(1)} Cr`;
  }
  if (value >= 100000) {
    return `₹${(value / 100000).toFixed(1)} L`;
  }
  return new Intl.NumberFormat("en-IN").format(value);
}

export function formatMarketCap(value: number): string {
  if (value >= 10000000000000) {
    return `${(value / 10000000000000).toFixed(2)}L Cr`;
  }
  if (value >= 10000000) {
    return `${(value / 10000000).toFixed(0)} Cr`;
  }
  if (value >= 100000) {
    return `${(value / 100000).toFixed(1)} L`;
  }
  return new Intl.NumberFormat("en-IN").format(value);
}

export function formatPercentage(value: number): string {
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(2)}%`;
}

export function formatVolume(value: number): string {
  if (value >= 10000000) {
    return `${(value / 10000000).toFixed(1)}Cr`;
  }
  if (value >= 100000) {
    return `${(value / 100000).toFixed(1)}L`;
  }
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}K`;
  }
  return new Intl.NumberFormat("en-IN").format(value);
}
