// ─── Manual Technical Indicators Calculations ──────────────────────────────

interface CandlePriceTime {
  time: number;
  close: number;
}

interface CandleFull {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

// 1. Simple Moving Average (SMA)
export function calculateSMA(data: CandlePriceTime[], period: number) {
  const sma: { time: number; value: number }[] = [];
  if (data.length < period) return [];

  for (let i = period - 1; i < data.length; i++) {
    let sum = 0;
    for (let j = 0; j < period; j++) {
      sum += data[i - j].close;
    }
    sma.push({
      time: data[i].time,
      value: parseFloat((sum / period).toFixed(2)),
    });
  }
  return sma;
}

// 2. Exponential Moving Average (EMA)
export function calculateEMA(data: CandlePriceTime[], period: number) {
  const ema: { time: number; value: number }[] = [];
  if (data.length < period) return [];

  // Initialize with SMA
  let sum = 0;
  for (let i = 0; i < period; i++) {
    sum += data[i].close;
  }
  let currentEma = sum / period;
  ema.push({
    time: data[period - 1].time,
    value: parseFloat(currentEma.toFixed(2)),
  });

  const multiplier = 2 / (period + 1);
  for (let i = period; i < data.length; i++) {
    currentEma = (data[i].close - currentEma) * multiplier + currentEma;
    ema.push({
      time: data[i].time,
      value: parseFloat(currentEma.toFixed(2)),
    });
  }
  return ema;
}

// 3. Bollinger Bands (BB)
export function calculateBollingerBands(
  data: CandlePriceTime[],
  period: number = 20,
  multiplier: number = 2
) {
  const bands: { time: number; upper: number; middle: number; lower: number }[] = [];
  if (data.length < period) return [];

  for (let i = period - 1; i < data.length; i++) {
    // Middle is simple moving average
    let sum = 0;
    for (let j = 0; j < period; j++) {
      sum += data[i - j].close;
    }
    const middle = sum / period;

    // Standard deviation
    let varianceSum = 0;
    for (let j = 0; j < period; j++) {
      const diff = data[i - j].close - middle;
      varianceSum += diff * diff;
    }
    const stdDev = Math.sqrt(varianceSum / period);

    bands.push({
      time: data[i].time,
      middle: parseFloat(middle.toFixed(2)),
      upper: parseFloat((middle + multiplier * stdDev).toFixed(2)),
      lower: parseFloat((middle - multiplier * stdDev).toFixed(2)),
    });
  }
  return bands;
}

// 4. Relative Strength Index (RSI 14)
export function calculateRSI(data: CandlePriceTime[], period: number = 14) {
  const rsi: { time: number; value: number }[] = [];
  if (data.length <= period) return [];

  let gains = 0;
  let losses = 0;

  // Initial gains and losses
  for (let i = 1; i <= period; i++) {
    const diff = data[i].close - data[i - 1].close;
    if (diff > 0) {
      gains += diff;
    } else {
      losses -= diff;
    }
  }

  let avgGain = gains / period;
  let avgLoss = losses / period;

  let rs = avgLoss === 0 ? 100 : avgGain / avgLoss;
  rsi.push({
    time: data[period].time,
    value: parseFloat((100 - 100 / (1 + rs)).toFixed(2)),
  });

  // Smoothed averages
  for (let i = period + 1; i < data.length; i++) {
    const diff = data[i].close - data[i - 1].close;
    const gain = diff > 0 ? diff : 0;
    const loss = diff < 0 ? -diff : 0;

    avgGain = (avgGain * (period - 1) + gain) / period;
    avgLoss = (avgLoss * (period - 1) + loss) / period;

    rs = avgLoss === 0 ? 100 : avgGain / avgLoss;
    rsi.push({
      time: data[i].time,
      value: parseFloat((100 - 100 / (1 + rs)).toFixed(2)),
    });
  }
  return rsi;
}

// 5. Volume Profile
export interface VolumeProfileBin {
  priceLevel: number;
  volume: number;
  percentage: number;
}

export function calculateVolumeProfile(data: CandleFull[], numBins: number = 12): VolumeProfileBin[] {
  if (data.length === 0) return [];

  const prices = data.map((d) => d.close);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const range = maxPrice - minPrice;
  const binSize = range / numBins;

  const bins = Array.from({ length: numBins }).map((_, i) => ({
    priceLevel: minPrice + (i + 0.5) * binSize,
    volume: 0,
  }));

  let maxVolume = 0;

  for (const candle of data) {
    const binIndex = Math.min(
      numBins - 1,
      Math.floor((candle.close - minPrice) / binSize)
    );
    if (binIndex >= 0 && binIndex < numBins) {
      bins[binIndex].volume += candle.volume;
      if (bins[binIndex].volume > maxVolume) {
        maxVolume = bins[binIndex].volume;
      }
    }
  }

  return bins.map((bin) => ({
    ...bin,
    priceLevel: parseFloat(bin.priceLevel.toFixed(2)),
    percentage: maxVolume > 0 ? parseFloat(((bin.volume / maxVolume) * 100).toFixed(1)) : 0,
  }));
}
