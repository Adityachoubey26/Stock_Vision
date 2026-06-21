"use client";

import React from "react";
import { useScreenerStore } from "@/store/use-screener-store";
import { ScreenerFilters as ScreenerFiltersType } from "@/types/stock";
import {
  SlidersHorizontal,
  RotateCcw,
  X,
  HelpCircle,
} from "lucide-react";

const SECTORS = [
  "All",
  "Financial Services",
  "Information Technology",
  "Oil Gas & Consumable Fuels",
  "Fast Moving Consumer Goods",
  "Healthcare",
  "Automobile & Auto Components",
  "Construction & Infrastructure",
  "Metals & Mining",
  "Power",
  "Telecommunication",
  "Consumer Durables",
  "Chemicals",
  "Capital Goods",
  "Media & Entertainment",
  "Textiles",
];

const INDUSTRIES_BY_SECTOR: Record<string, string[]> = {
  "Financial Services": ["All", "Banks - Private", "Banks - Public", "NBFC", "Housing Finance", "Insurance", "Asset Management", "Stock Broking"],
  "Information Technology": ["All", "IT Consulting & Software", "IT Enabled Services", "Cloud & SaaS", "Data Analytics"],
  "Oil Gas & Consumable Fuels": ["All", "Oil Refining & Marketing", "Oil Exploration & Production", "Coal & Consumable Fuels", "Natural Gas"],
  "Fast Moving Consumer Goods": ["All", "Personal Care", "Food Products", "Household Products", "Beverages", "Tobacco Products"],
  "Healthcare": ["All", "Pharmaceuticals", "Hospitals & Medical Services", "Diagnostics & Research", "Medical Devices"],
  "Automobile & Auto Components": ["All", "Passenger Cars", "Two & Three Wheelers", "Commercial Vehicles", "Auto Parts & Equipment", "Electric Vehicles"],
  "Construction & Infrastructure": ["All", "Real Estate Development", "Roads & Highways", "Industrial Construction", "Cement & Building Materials"],
  "Metals & Mining": ["All", "Steel & Iron Products", "Aluminium Production", "Non-ferrous Metals", "Mining & Minerals"],
  "Power": ["All", "Power Generation", "Power Transmission & Distribution", "Renewable Energy", "Solar Energy"],
  "Telecommunication": ["All", "Telecom Services", "Telecom Equipment & Cables", "Internet Services"],
  "Consumer Durables": ["All", "Electronics", "Home Appliances", "Jewellery & Watches", "Furniture & Furnishing"],
  "Chemicals": ["All", "Specialty Chemicals", "Agrochemicals", "Petrochemicals", "Industrial Chemicals"],
  "Capital Goods": ["All", "Heavy Electrical Equipment", "Defence", "Industrial Machinery", "Engineering"],
  "Media & Entertainment": ["All", "Broadcasting", "Digital Media", "Publishing", "Film Production"],
  "Textiles": ["All", "Cotton Textiles", "Synthetic Textiles", "Readymade Garments", "Textile Machinery"],
};

// ─── Range Input Component ──────────────────────────────────────────────────
function getFilterValue(filters: ScreenerFiltersType, key: keyof ScreenerFiltersType): string | number {
  const val = filters[key];
  if (val === null || val === undefined) return "";
  return val;
}

function RangeInput({
  label,
  minKey,
  maxKey,
  tooltip,
  step,
}: {
  label: string;
  minKey: keyof ScreenerFiltersType;
  maxKey: keyof ScreenerFiltersType;
  tooltip?: string;
  step?: string;
}) {
  const { filters, setFilter } = useScreenerStore();

  const handleChange = (key: keyof ScreenerFiltersType, value: string) => {
    const parsed = value === "" ? null : parseFloat(value);
    setFilter(key, parsed as never);
  };

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
          {label}
        </label>
        {tooltip && (
          <span className="text-slate-400 hover:text-slate-600 cursor-help" title={tooltip}>
            <HelpCircle className="w-3 h-3" />
          </span>
        )}
      </div>
      <div className="flex flex-col gap-1">
        <div className="relative flex items-center">
          <span className="absolute left-2 text-[9px] text-slate-400 font-mono select-none">Min</span>
          <input
            type="number"
            step={step || "any"}
            placeholder="Min"
            value={getFilterValue(filters, minKey)}
            onChange={(e) => handleChange(minKey, e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-lg pl-8 pr-2 py-1 text-xs text-slate-750 font-mono placeholder-slate-300 focus:outline-none focus:border-blue-450 focus:ring-2 focus:ring-blue-100/50 transition-all"
          />
        </div>
        <div className="relative flex items-center">
          <span className="absolute left-2 text-[9px] text-slate-400 font-mono select-none">Max</span>
          <input
            type="number"
            step={step || "any"}
            placeholder="Max"
            value={getFilterValue(filters, maxKey)}
            onChange={(e) => handleChange(maxKey, e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-lg pl-8 pr-2 py-1 text-xs text-slate-750 font-mono placeholder-slate-300 focus:outline-none focus:border-blue-450 focus:ring-2 focus:ring-blue-100/50 transition-all"
          />
        </div>
      </div>
    </div>
  );
}

// ─── Main ScreenerFilters Component ─────────────────────────────────────────
export function ScreenerFilters() {
  const { filters, setFilter, resetFilters, getActiveFilters } = useScreenerStore();
  const activeFilters = getActiveFilters();
  const industries = filters.sector !== "All" ? INDUSTRIES_BY_SECTOR[filters.sector] || ["All"] : [];

  return (
    <div className="flex flex-col h-full bg-white text-slate-700 w-full select-none text-xs border-r border-slate-200">
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-slate-50/50">
        <div className="flex items-center gap-2 font-bold text-slate-800 text-sm">
          <div className="p-1 bg-blue-100 rounded-md">
            <SlidersHorizontal className="w-3.5 h-3.5 text-blue-600" />
          </div>
          <span>Filters</span>
        </div>
        <button
          type="button"
          onClick={resetFilters}
          className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-red-500 hover:bg-red-50 border border-slate-200 rounded-lg px-2 py-1 transition-all duration-200"
          title="Reset all filters"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset</span>
        </button>
      </div>

      {/* ── Active Filter Chips ────────────────────────────────────────── */}
      {activeFilters.length > 0 && (
        <div className="px-4 py-2 border-b border-slate-100 bg-blue-50/30">
          <div className="flex flex-wrap gap-1.5">
            {activeFilters.map((f) => (
              <span
                key={f.key}
                className="inline-flex items-center gap-1 text-[10px] font-medium text-blue-700 bg-blue-100 border border-blue-200 rounded-full px-2 py-0.5 animate-chip-pop"
              >
                <span className="font-semibold">{f.label}</span>
                <span className="text-blue-500">{f.value}</span>
                <button
                  type="button"
                  onClick={() => setFilter(f.key as keyof typeof filters, (f.key === "sector" || f.key === "industry" ? "All" : null) as never)}
                  className="hover:text-red-500 transition-colors ml-0.5"
                >
                  <X className="w-2.5 h-2.5" />
                </button>
              </span>
            ))}
            <button
              type="button"
              onClick={resetFilters}
              className="text-[10px] font-medium text-red-500 hover:text-red-600 px-1.5 py-0.5"
            >
              Clear all
            </button>
          </div>
        </div>
      )}

      {/* ── Filter Controls ────────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4 scrollbar-thin">
        {/* Sector */}
        <div className="space-y-1.5">
          <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
            Sector
          </label>
          <div className="relative">
            <select
              value={filters.sector}
              onChange={(e) => {
                setFilter("sector", e.target.value);
                setFilter("industry", "All");
              }}
              className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-700 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 cursor-pointer premium-select font-medium transition-all"
            >
              {SECTORS.map((sec) => (
                <option key={sec} value={sec}>
                  {sec}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Industry (conditional) */}
        {filters.sector !== "All" && industries.length > 0 && (
          <div className="space-y-1.5 animate-fade-in">
            <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
              Industry
            </label>
            <select
              value={filters.industry}
              onChange={(e) => setFilter("industry", e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-700 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 cursor-pointer premium-select font-medium transition-all"
            >
              {industries.map((ind) => (
                <option key={ind} value={ind}>
                  {ind}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Divider */}
        <div className="h-px bg-slate-100" />

        {/* Range Filters */}
        <RangeInput label="Price (₹)" minKey="priceMin" maxKey="priceMax" step="10" />
        <RangeInput label="Market Cap (₹)" minKey="marketCapMin" maxKey="marketCapMax" step="1000000" />
        <RangeInput label="P/E Ratio" minKey="peMin" maxKey="peMax" step="1" />
        <RangeInput label="P/B Ratio" minKey="pbMin" maxKey="pbMax" step="0.5" />

        <div className="h-px bg-slate-100" />

        <RangeInput label="ROE (%)" minKey="roeMin" maxKey="roeMax" step="1" />
        <RangeInput label="ROCE (%)" minKey="roceMin" maxKey="roceMax" step="1" />
        <RangeInput
          label="RSI (14)"
          minKey="rsiMin"
          maxKey="rsiMax"
          step="1"
          tooltip="Relative Strength Index: oversold ≤ 30, overbought ≥ 70"
        />
        <RangeInput label="Beta" minKey="betaMin" maxKey="betaMax" step="0.1" />

        <div className="h-px bg-slate-100" />

        <RangeInput label="Volume" minKey="volumeMin" maxKey="volumeMax" step="10000" />
        <RangeInput label="Dividend Yield (%)" minKey="dividendYieldMin" maxKey="dividendYieldMax" step="0.1" />
      </div>
    </div>
  );
}
