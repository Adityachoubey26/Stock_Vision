import React from "react";
import Link from "next/link";
import {
  BarChart3,
  Star,
  Zap,
  Server,
  Shield,
  TrendingUp,
  ArrowRight,
  Activity,
  Filter,
} from "lucide-react";

export default function Home() {
  return (
    <div className="flex-1 flex flex-col bg-white">
      {/* ── Hero Section ─────────────────────────────────────────────────── */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-indigo-50 pointer-events-none" />
        <div className="absolute top-20 right-1/4 w-96 h-96 bg-blue-100/50 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-indigo-100/40 rounded-full blur-3xl pointer-events-none" />

        <div className="relative container mx-auto max-w-5xl text-center space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200 shadow-sm">
            <Activity className="w-3.5 h-3.5" />
            <span>Real-time Market Data · 5000+ Stocks</span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 max-w-3xl mx-auto leading-[1.1]">
            Advanced Stock
            <span className="text-blue-600"> Screener</span>
            <br />
            <span className="text-slate-500">Terminal</span>
          </h1>

          {/* Subheading */}
          <p className="text-slate-500 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed">
            Screen, filter, and analyze{" "}
            <span className="font-semibold text-slate-700">5,000+ NSE/BSE stocks</span>{" "}
            with real-time updates, advanced filtering, and 60fps virtual scrolling.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-3 pt-2">
            <Link
              href="/screener"
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-sm font-bold text-white transition-all shadow-md shadow-blue-200 active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <BarChart3 className="w-4 h-4" />
              <span>Launch Screener</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/watchlist"
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white hover:bg-slate-50 text-sm font-bold text-slate-700 border border-slate-200 shadow-sm transition-all active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <Star className="w-4 h-4 text-amber-500" />
              <span>View Watchlist</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Features Grid ────────────────────────────────────────────────── */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-[#f8fafc]">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-slate-800">
              Built for Performance
            </h2>
            <p className="text-sm text-slate-500 mt-2">
              Enterprise-grade features with a portfolio-worthy design
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Feature 1 */}
            <div className="premium-card p-6 space-y-3">
              <div className="p-2.5 bg-blue-50 border border-blue-200 w-10 h-10 flex items-center justify-center rounded-xl">
                <Zap className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="font-semibold text-slate-800">Real-Time Updates</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                Live price simulation with 5-second ticks using Geometric Brownian
                Motion. Green/red flash indicators on price changes.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="premium-card p-6 space-y-3">
              <div className="p-2.5 bg-indigo-50 border border-indigo-200 w-10 h-10 flex items-center justify-center rounded-xl">
                <Server className="w-5 h-5 text-indigo-600" />
              </div>
              <h3 className="font-semibold text-slate-800">5,000+ Stocks Virtualized</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                Seamlessly scroll through thousands of stocks without DOM bloat,
                powered by TanStack Virtual with 60fps performance.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="premium-card p-6 space-y-3">
              <div className="p-2.5 bg-emerald-50 border border-emerald-200 w-10 h-10 flex items-center justify-center rounded-xl">
                <Filter className="w-5 h-5 text-emerald-600" />
              </div>
              <h3 className="font-semibold text-slate-800">Advanced Filtering</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                Filter by PE, PB, ROE, ROCE, RSI, Beta, Market Cap, and more.
                Sub-200ms filtering across the entire dataset.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="premium-card p-6 space-y-3">
              <div className="p-2.5 bg-amber-50 border border-amber-200 w-10 h-10 flex items-center justify-center rounded-xl">
                <Shield className="w-5 h-5 text-amber-600" />
              </div>
              <h3 className="font-semibold text-slate-800">State Isolation</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                Decoupled client state (Zustand) and server cache (React Query)
                for predictable, high-performance reactivity.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="premium-card p-6 space-y-3">
              <div className="p-2.5 bg-purple-50 border border-purple-200 w-10 h-10 flex items-center justify-center rounded-xl">
                <TrendingUp className="w-5 h-5 text-purple-600" />
              </div>
              <h3 className="font-semibold text-slate-800">Financial Analytics</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                Comprehensive stock metrics including PE, PB, ROE, ROCE, RSI,
                Beta, 52-week range, and dividend yield analysis.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="premium-card p-6 space-y-3">
              <div className="p-2.5 bg-rose-50 border border-rose-200 w-10 h-10 flex items-center justify-center rounded-xl">
                <BarChart3 className="w-5 h-5 text-rose-600" />
              </div>
              <h3 className="font-semibold text-slate-800">Premium Dashboard</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                Professional fintech UI inspired by Zerodha, Groww, and
                TradingView. Clean light theme with blue accent styling.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Tech Stack Section ────────────────────────────────────────────── */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-white border-t border-slate-100">
        <div className="container mx-auto max-w-5xl text-center">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-6">
            Built With
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {[
              "Next.js 14",
              "React 18",
              "TypeScript",
              "Tailwind CSS",
              "Zustand",
              "TanStack Query",
              "TanStack Table",
              "TanStack Virtual",
            ].map((tech) => (
              <span
                key={tech}
                className="px-3 py-1.5 text-xs font-medium text-slate-600 bg-slate-50 border border-slate-200 rounded-full"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
