"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Star,
  SlidersHorizontal,
  LayoutDashboard,
  Compass,
  TrendingUp,
  Menu,
  X,
} from "lucide-react";

interface NavItem {
  href: string;
  label: string;
  Icon: React.ComponentType<{ className?: string }>;
}

const NAV_ITEMS: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", Icon: LayoutDashboard },
  { href: "/screener", label: "Screener", Icon: BarChart3 },
  { href: "/watchlist", label: "Watchlist", Icon: Star },
  { href: "/technical-screener", label: "Technical Screen", Icon: SlidersHorizontal },
  { href: "/analytics", label: "Analytics", Icon: TrendingUp },
  { href: "/market-overview", label: "Market Overview", Icon: Compass },
];

export function Navigation() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* ── Desktop Navigation ── */}
      <nav className="hidden xl:flex items-center gap-1 ml-4 select-none">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all duration-150 ${
                isActive
                  ? "bg-blue-50 text-blue-600 shadow-sm"
                  : "text-slate-500 hover:text-blue-600 hover:bg-blue-50/50"
              }`}
            >
              <item.Icon className="w-3.5 h-3.5 shrink-0" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* ── Tablet / Compact Navigation (Icon only to fit mid screen) ── */}
      <nav className="hidden md:flex xl:hidden items-center gap-1 ml-2 select-none">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              title={item.label}
              className={`flex items-center justify-center p-2 rounded-lg transition-all duration-150 ${
                isActive
                  ? "bg-blue-50 text-blue-600 shadow-sm"
                  : "text-slate-500 hover:text-blue-600 hover:bg-blue-50/50"
              }`}
            >
              <item.Icon className="w-4 h-4 shrink-0" />
            </Link>
          );
        })}
      </nav>

      {/* ── Mobile Menu Toggle Button ── */}
      <div className="flex md:hidden items-center ml-2">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-800 rounded-lg transition-colors cursor-pointer"
          aria-label="Toggle Navigation Menu"
        >
          {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* ── Mobile Drawer Overlay Menu ── */}
      {isOpen && (
        <div className="absolute top-14 left-0 right-0 bg-white border-b border-slate-200 shadow-lg z-50 md:hidden flex flex-col p-4 gap-2 animate-fade-in select-none">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-4 py-2.5 text-sm font-semibold rounded-lg transition-all ${
                  isActive
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-slate-650 hover:bg-slate-50 hover:text-blue-600"
                }`}
              >
                <item.Icon className="w-4.5 h-4.5 shrink-0" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      )}
    </>
  );
}
