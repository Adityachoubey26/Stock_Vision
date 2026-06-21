"use client";

import React, { useEffect, useRef, useState, useMemo } from "react";
import {
  createChart,
  ColorType,
  IChartApi,
  CandlestickSeries,
  LineSeries,
  AreaSeries,
  HistogramSeries,
  LineStyle,
  Time,
} from "lightweight-charts";
import { useStockDetail } from "../hooks/use-stock-detail";
import { Loader2, Settings } from "lucide-react";
import {
  calculateSMA,
  calculateEMA,
  calculateBollingerBands,
  calculateRSI,
  calculateVolumeProfile,
} from "../utils/indicators";

interface StockChartProps {
  symbol: string;
}

type TimeframeOption = "1D" | "1W" | "1M" | "3M" | "1Y" | "5Y";
type ChartTypeOption = "candlestick" | "area" | "line";

export function StockChart({ symbol }: StockChartProps) {
  const [timeframe, setTimeframe] = useState<TimeframeOption>("1M");
  const [chartType, setChartType] = useState<ChartTypeOption>("candlestick");
  
  const { data, isLoading } = useStockDetail(symbol, timeframe);

  // Active indicators toggles
  const [showSma20, setShowSma20] = useState(false);
  const [showSma50, setShowSma50] = useState(false);
  const [showSma200, setShowSma200] = useState(false);
  const [showEma12, setShowEma12] = useState(false);
  const [showEma26, setShowEma26] = useState(false);
  const [showBb, setShowBb] = useState(false);
  const [showRsi, setShowRsi] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const priceContainerRef = useRef<HTMLDivElement>(null);
  const rsiContainerRef = useRef<HTMLDivElement>(null);
  const chartsRef = useRef<{
    priceChart?: IChartApi;
    rsiChart?: IChartApi;
  }>({});

  const [hoverData, setHoverData] = useState<{
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
    time: string | number;
  } | null>(null);

  const candles = useMemo(() => data?.candles || [], [data]);

  // Volume Profile calculation
  const volumeProfileBins = useMemo(() => {
    if (!showProfile || candles.length === 0) return [];
    return calculateVolumeProfile(candles, 12);
  }, [candles, showProfile]);

  useEffect(() => {
    if (candles.length === 0 || !priceContainerRef.current) return;

    const priceContainer = priceContainerRef.current;
    
    // Clear previous charts
    priceContainer.innerHTML = "";
    if (rsiContainerRef.current) {
      rsiContainerRef.current.innerHTML = "";
    }

    const containerWidth = priceContainer.clientWidth || 300;
    const priceChartHeight = showRsi ? 160 : 240;

    // 1. Create Main Price Chart
    const priceChart = createChart(priceContainer, {
      width: containerWidth,
      height: priceChartHeight,
      layout: {
        background: { type: ColorType.Solid, color: "#0c101b" },
        textColor: "#94a3b8",
      },
      grid: {
        vertLines: { color: "#161e2e" },
        horzLines: { color: "#161e2e" },
      },
      rightPriceScale: {
        borderColor: "#1e293b",
      },
      timeScale: {
        borderColor: "#1e293b",
        visible: !showRsi, // hide main time scale if RSI chart is displayed to avoid duplicate date lines
      },
    });

    chartsRef.current.priceChart = priceChart;

    // 2. Add Main Series based on selected chart type
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let mainSeries: any;

    if (chartType === "candlestick") {
      mainSeries = priceChart.addSeries(CandlestickSeries, {
        upColor: "#10b981",
        downColor: "#f43f5e",
        borderUpColor: "#10b981",
        borderDownColor: "#f43f5e",
        wickUpColor: "#10b981",
        wickDownColor: "#f43f5e",
      });
      mainSeries.setData(
        candles.map((c) => ({
          time: c.time as Time,
          open: c.open,
          high: c.high,
          low: c.low,
          close: c.close,
        }))
      );
    } else if (chartType === "area") {
      mainSeries = priceChart.addSeries(AreaSeries, {
        lineColor: "#2563eb",
        topColor: "rgba(37,99,235,0.25)",
        bottomColor: "rgba(37,99,235,0.0)",
        lineWidth: 2,
      });
      mainSeries.setData(
        candles.map((c) => ({
          time: c.time as Time,
          value: c.close,
        }))
      );
    } else {
      mainSeries = priceChart.addSeries(LineSeries, {
        color: "#2563eb",
        lineWidth: 2,
      });
      mainSeries.setData(
        candles.map((c) => ({
          time: c.time as Time,
          value: c.close,
        }))
      );
    }

    // 3. Add Volume Series
    const volumeSeries = priceChart.addSeries(HistogramSeries, {
      color: "#475569",
      priceFormat: { type: "volume" },
      priceScaleId: "", // overlay
    });

    priceChart.priceScale("").applyOptions({
      scaleMargins: {
        top: 0.75, // volume bars occupy bottom 25% of chart
        bottom: 0,
      },
    });

    const volumeData = candles.map((c) => ({
      time: c.time as Time,
      value: c.volume,
      color: c.close >= c.open ? "rgba(16, 185, 129, 0.2)" : "rgba(244, 63, 94, 0.2)",
    }));

    volumeSeries.setData(volumeData);

    // Set initial hover state to latest candle
    const latestCandle = candles[candles.length - 1];
    setHoverData({
      open: latestCandle.open,
      high: latestCandle.high,
      low: latestCandle.low,
      close: latestCandle.close,
      volume: latestCandle.volume,
      time: latestCandle.time,
    });

    // 4. Manual Technical Indicators - Price Chart Overlays
    const simpleCandles = candles.map((c) => ({ time: c.time, close: c.close }));

    if (showSma20) {
      const smaData = calculateSMA(simpleCandles, 20);
      const smaSeries = priceChart.addSeries(LineSeries, { color: "#f59e0b", lineWidth: 1 });
      smaSeries.setData(smaData.map((d) => ({ time: d.time as Time, value: d.value })));
    }
    if (showSma50) {
      const smaData = calculateSMA(simpleCandles, 50);
      const smaSeries = priceChart.addSeries(LineSeries, { color: "#3b82f6", lineWidth: 1 });
      smaSeries.setData(smaData.map((d) => ({ time: d.time as Time, value: d.value })));
    }
    if (showSma200) {
      const smaData = calculateSMA(simpleCandles, 200);
      const smaSeries = priceChart.addSeries(LineSeries, { color: "#a855f7", lineWidth: 1 });
      smaSeries.setData(smaData.map((d) => ({ time: d.time as Time, value: d.value })));
    }
    if (showEma12) {
      const emaData = calculateEMA(simpleCandles, 12);
      const emaSeries = priceChart.addSeries(LineSeries, { color: "#10b981", lineWidth: 1 });
      emaSeries.setData(emaData.map((d) => ({ time: d.time as Time, value: d.value })));
    }
    if (showEma26) {
      const emaData = calculateEMA(simpleCandles, 26);
      const emaSeries = priceChart.addSeries(LineSeries, { color: "#ec4899", lineWidth: 1 });
      emaSeries.setData(emaData.map((d) => ({ time: d.time as Time, value: d.value })));
    }
    if (showBb) {
      const bbData = calculateBollingerBands(simpleCandles, 20, 2);
      const upperSeries = priceChart.addSeries(LineSeries, { color: "rgba(99, 102, 241, 0.45)", lineWidth: 1 });
      const basisSeries = priceChart.addSeries(LineSeries, { color: "rgba(99, 102, 241, 0.35)", lineWidth: 1, lineStyle: LineStyle.Dashed });
      const lowerSeries = priceChart.addSeries(LineSeries, { color: "rgba(99, 102, 241, 0.45)", lineWidth: 1 });
      
      upperSeries.setData(bbData.map((d) => ({ time: d.time as Time, value: d.upper })));
      basisSeries.setData(bbData.map((d) => ({ time: d.time as Time, value: d.middle })));
      lowerSeries.setData(bbData.map((d) => ({ time: d.time as Time, value: d.lower })));
    }

    // 5. RSI 14 Pane Chart
    let rsiChart: IChartApi | undefined;
     if (showRsi && rsiContainerRef.current) {
      rsiChart = createChart(rsiContainerRef.current, {
        width: containerWidth,
        height: 80,
        layout: {
          background: { type: ColorType.Solid, color: "#0c101b" },
          textColor: "#94a3b8",
        },
        grid: {
          vertLines: { color: "#161e2e" },
          horzLines: { color: "#161e2e" },
        },
        rightPriceScale: {
          borderColor: "#1e293b",
        },
        timeScale: {
          borderColor: "#1e293b",
        },
      });

      chartsRef.current.rsiChart = rsiChart;

      // Draw horizontal reference lines (70, 50, 30)
      const rsiLineSeries = rsiChart.addSeries(LineSeries, { color: "#6366f1", lineWidth: 1 });
      const rsiData = calculateRSI(simpleCandles, 14);
      rsiLineSeries.setData(rsiData.map((r) => ({ time: r.time as Time, value: r.value })));

      // Add boundary reference lines
      const rsiLowerSeries = rsiChart.addSeries(LineSeries, { color: "#334155", lineWidth: 1, lineStyle: LineStyle.Dashed });
      const rsiUpperSeries = rsiChart.addSeries(LineSeries, { color: "#334155", lineWidth: 1, lineStyle: LineStyle.Dashed });
      rsiLowerSeries.setData(rsiData.map((r) => ({ time: r.time as Time, value: 30 })));
      rsiUpperSeries.setData(rsiData.map((r) => ({ time: r.time as Time, value: 70 })));

      // Sync Scales
      const priceTimeScale = priceChart.timeScale();
      const rsiTimeScale = rsiChart.timeScale();

      priceTimeScale.subscribeVisibleTimeRangeChange((range) => {
        if (range) rsiTimeScale.setVisibleRange(range);
      });
      rsiTimeScale.subscribeVisibleTimeRangeChange((range) => {
        if (range) priceTimeScale.setVisibleRange(range);
      });
    }

    // 6. Crosshair updates to update metadata header
    priceChart.subscribeCrosshairMove((param) => {
      if (
        param.point === undefined ||
        !param.time ||
        param.point.x < 0 ||
        param.point.x > containerWidth
      ) {
        // Reset to latest
        const final = candles[candles.length - 1];
        setHoverData({
          open: final.open,
          high: final.high,
          low: final.low,
          close: final.close,
          volume: final.volume,
          time: final.time,
        });
      } else {
        let openVal = 0, highVal = 0, lowVal = 0, closeVal = 0;
        
        if (chartType === "candlestick") {
          const candleData = param.seriesData.get(mainSeries) as {
            open: number;
            high: number;
            low: number;
            close: number;
          } | undefined;
          if (candleData) {
            openVal = candleData.open;
            highVal = candleData.high;
            lowVal = candleData.low;
            closeVal = candleData.close;
          }
        } else {
          const lineData = param.seriesData.get(mainSeries) as { value: number } | undefined;
          if (lineData) {
            openVal = lineData.value;
            highVal = lineData.value;
            lowVal = lineData.value;
            closeVal = lineData.value;
          }
        }

        const volVal = param.seriesData.get(volumeSeries) as { value: number } | undefined;

        setHoverData({
          open: openVal,
          high: highVal,
          low: lowVal,
          close: closeVal,
          volume: volVal ? volVal.value : 0,
          time: param.time as number,
        });
      }
    });

    // Resize Handler
    const handleResize = () => {
      if (!priceContainerRef.current) return;
      const newWidth = priceContainerRef.current.clientWidth;
      priceChart.resize(newWidth, priceChartHeight);
      if (rsiChart) rsiChart.resize(newWidth, 80);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      priceChart.remove();
      if (rsiChart) rsiChart.remove();
    };
  }, [candles, chartType, showSma20, showSma50, showSma200, showEma12, showEma26, showBb, showRsi]);

  return (
    <div className="flex flex-col gap-2 pt-2 border-t border-slate-100 relative">
      
      {/* ── Header Toolbar ────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center justify-between gap-2 bg-slate-50/50 border border-slate-200/50 rounded-lg p-2">
        
        {/* Toggle selectors (Timeframe and Style) */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Timeframe Switcher */}
          <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-md p-0.5 shadow-sm">
            {(["1D", "1W", "1M", "3M", "1Y", "5Y"] as const).map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-2 py-0.75 rounded text-[10px] font-bold transition-all cursor-pointer ${
                  timeframe === tf
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-slate-500 hover:text-slate-700 hover:bg-slate-100"
                }`}
              >
                {tf}
              </button>
            ))}
          </div>

          {/* Chart Style Switcher */}
          <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-md p-0.5 shadow-sm">
            {(["candlestick", "area", "line"] as const).map((type) => (
              <button
                key={type}
                onClick={() => setChartType(type)}
                className={`px-2 py-0.75 rounded text-[10px] font-bold capitalize transition-all cursor-pointer ${
                  chartType === type
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-slate-500 hover:text-slate-700 hover:bg-slate-100"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Indicators Settings Controls */}
        <div className="flex items-center gap-1.5">
          <div className="relative group">
            <button className="flex items-center gap-1 px-2.5 py-1 bg-white border border-slate-200 hover:border-slate-300 rounded-md text-[10px] font-bold text-slate-600 shadow-sm cursor-pointer">
              <Settings className="w-3 h-3 text-slate-500" />
              <span>Indicators</span>
            </button>
            <div className="absolute right-0 bottom-full mb-1 w-40 bg-white border border-slate-200 rounded-lg shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity duration-200 p-2 z-50 flex flex-col gap-1.5">
              <label className="flex items-center gap-2 cursor-pointer text-[10px] font-medium text-slate-600 hover:text-slate-800 select-none">
                <input
                  type="checkbox"
                  checked={showSma20}
                  onChange={(e) => setShowSma20(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-400"
                />
                SMA 20
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-[10px] font-medium text-slate-600 hover:text-slate-800 select-none">
                <input
                  type="checkbox"
                  checked={showSma50}
                  onChange={(e) => setShowSma50(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-400"
                />
                SMA 50
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-[10px] font-medium text-slate-600 hover:text-slate-800 select-none">
                <input
                  type="checkbox"
                  checked={showSma200}
                  onChange={(e) => setShowSma200(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-400"
                />
                SMA 200
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-[10px] font-medium text-slate-600 hover:text-slate-800 select-none">
                <input
                  type="checkbox"
                  checked={showEma12}
                  onChange={(e) => setShowEma12(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-400"
                />
                EMA 12
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-[10px] font-medium text-slate-600 hover:text-slate-800 select-none">
                <input
                  type="checkbox"
                  checked={showEma26}
                  onChange={(e) => setShowEma26(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-400"
                />
                EMA 26
              </label>
              <div className="h-px bg-slate-100 my-0.5" />
              <label className="flex items-center gap-2 cursor-pointer text-[10px] font-medium text-slate-600 hover:text-slate-800 select-none">
                <input
                  type="checkbox"
                  checked={showBb}
                  onChange={(e) => setShowBb(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-400"
                />
                Bollinger Bands
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-[10px] font-medium text-slate-600 hover:text-slate-800 select-none">
                <input
                  type="checkbox"
                  checked={showRsi}
                  onChange={(e) => setShowRsi(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-400"
                />
                RSI 14
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-[10px] font-medium text-slate-600 hover:text-slate-800 select-none">
                <input
                  type="checkbox"
                  checked={showProfile}
                  onChange={(e) => setShowProfile(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-400"
                />
                Volume Profile
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* ── OHLC Overlay Metadata ────────────────────────────────────── */}
      <div className="flex items-center gap-2.5 text-[9px] font-semibold text-slate-500 font-mono bg-white border border-slate-100 rounded px-2 py-1 select-none shadow-sm min-h-[22px]">
        {hoverData ? (
          <>
            <span>O: <span className="text-slate-800">{hoverData.open.toFixed(2)}</span></span>
            <span>H: <span className="text-slate-800">{hoverData.high.toFixed(2)}</span></span>
            <span>L: <span className="text-slate-800">{hoverData.low.toFixed(2)}</span></span>
            <span>C: <span className="text-slate-800">{hoverData.close.toFixed(2)}</span></span>
            <span>V: <span className="text-slate-800">{hoverData.volume.toLocaleString()}</span></span>
          </>
        ) : (
          <span className="text-slate-400">Loading data...</span>
        )}
      </div>

      {/* ── Live Chart Viewports ───────────────────────────────────────── */}
      <div className="relative border border-slate-200/80 rounded-xl overflow-hidden bg-white min-h-[160px]">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/75 z-20">
            <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
          </div>
        )}

        {/* Volume Profile Bins Overlay */}
        {showProfile && volumeProfileBins.length > 0 && (
          <div className="absolute left-10 top-2 bottom-12 w-28 pointer-events-none z-10 flex flex-col-reverse justify-between">
            {volumeProfileBins.map((bin, i) => (
              <div key={i} className="flex items-center h-full w-full opacity-60">
                <div
                  className="bg-blue-500/25 border-y border-r border-blue-400/30 rounded-r h-[70%] transition-all duration-300"
                  style={{ width: `${bin.percentage}%` }}
                />
              </div>
            ))}
          </div>
        )}

        {/* Main Price Chart Div */}
        <div ref={priceContainerRef} className="w-full relative" />
        
        {/* RSI 14 Chart Div (If checked) */}
        {showRsi && (
          <div className="border-t border-slate-100/80 bg-slate-50/20">
            <div ref={rsiContainerRef} className="w-full relative" />
          </div>
        )}
      </div>
    </div>
  );
}
