// ─── 5000+ Realistic Indian NSE/BSE Stock Data Generator ────────────────────
import { Stock } from "@/types/stock";

// ─── Deterministic seeded PRNG ──────────────────────────────────────────────
function seededRandom(seed: number): number {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
}

// ─── NSE/BSE Sectors & Industries ───────────────────────────────────────────
export const SECTORS = [
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
] as const;

export const INDUSTRIES_BY_SECTOR: Record<string, string[]> = {
  "Financial Services": ["Banks - Private", "Banks - Public", "NBFC", "Housing Finance", "Insurance", "Asset Management", "Stock Broking"],
  "Information Technology": ["IT Consulting & Software", "IT Enabled Services", "Cloud & SaaS", "Data Analytics"],
  "Oil Gas & Consumable Fuels": ["Oil Refining & Marketing", "Oil Exploration & Production", "Coal & Consumable Fuels", "Natural Gas"],
  "Fast Moving Consumer Goods": ["Personal Care", "Food Products", "Household Products", "Beverages", "Tobacco Products"],
  "Healthcare": ["Pharmaceuticals", "Hospitals & Medical Services", "Diagnostics & Research", "Medical Devices"],
  "Automobile & Auto Components": ["Passenger Cars", "Two & Three Wheelers", "Commercial Vehicles", "Auto Parts & Equipment", "Electric Vehicles"],
  "Construction & Infrastructure": ["Real Estate Development", "Roads & Highways", "Industrial Construction", "Cement & Building Materials"],
  "Metals & Mining": ["Steel & Iron Products", "Aluminium Production", "Non-ferrous Metals", "Mining & Minerals"],
  "Power": ["Power Generation", "Power Transmission & Distribution", "Renewable Energy", "Solar Energy"],
  "Telecommunication": ["Telecom Services", "Telecom Equipment & Cables", "Internet Services"],
  "Consumer Durables": ["Electronics", "Home Appliances", "Jewellery & Watches", "Furniture & Furnishing"],
  "Chemicals": ["Specialty Chemicals", "Agrochemicals", "Petrochemicals", "Industrial Chemicals"],
  "Capital Goods": ["Heavy Electrical Equipment", "Defence", "Industrial Machinery", "Engineering"],
  "Media & Entertainment": ["Broadcasting", "Digital Media", "Publishing", "Film Production"],
  "Textiles": ["Cotton Textiles", "Synthetic Textiles", "Readymade Garments", "Textile Machinery"],
};

// ─── Realistic Indian Company Names ─────────────────────────────────────────
const PREFIXES = [
  "Tata", "Adani", "Reliance", "Birla", "JSW", "Mahindra", "Godrej", "Shree",
  "Hinduja", "Larsen", "Bajaj", "Hero", "Vedanta", "Ambuja", "Apollo",
  "National", "Indian", "Bharat", "Apex", "Nova", "Quantum", "Universal",
  "Summit", "Prime", "Stellar", "Global", "Pacific", "Orient", "Zenith",
  "Pinnacle", "Aditya", "Crompton", "Voltas", "Jubilant", "Torrent",
  "Supreme", "Dalmia", "Wipro", "HCL", "Lupin", "Havells", "Titan",
  "Ultratech", "Asian", "Dixon", "Polycab", "Coforge", "Persistent",
  "Marico", "Dabur", "Emami", "Berger", "Pidilite", "SRF", "Aarti",
];

const SUFFIXES = [
  "Industries", "Consultancy", "Enterprises", "Power", "Steel",
  "Motors", "Chemicals", "Cement", "Holdings", "Solutions",
  "Infrastructure", "Developers", "Ventures", "Technologies",
  "Logistics", "Services", "Systems", "Pharmaceuticals",
  "Energy", "Finance", "Capital", "Polymers", "Electricals",
  "Paints", "Foods", "Textiles", "Engineering", "Metals",
];

// ─── Generate NSE-style ticker ──────────────────────────────────────────────
function generateTicker(seed: number, index: number, prefix: string): string {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const char1 = letters[Math.floor(seededRandom(seed) * 26)];
  const char2 = letters[Math.floor(seededRandom(seed + 1) * 26)];
  const tickerBase = prefix.replace(/\s/g, "").slice(0, 5).toUpperCase();
  const tag = index < 100 ? "" : `${char1}${char2}`;
  return `${tickerBase}${tag}`.slice(0, 12);
}

// ─── Realistic financial value generators ───────────────────────────────────

function generateMarketCap(seed: number): number {
  const r = seededRandom(seed);
  // Distribution: 5% mega-cap, 15% large-cap, 30% mid-cap, 50% small/micro-cap
  if (r > 0.95) return Math.floor(seededRandom(seed + 1) * 1800000 + 200000) * 1000000; // ₹2L Cr - ₹20L Cr
  if (r > 0.80) return Math.floor(seededRandom(seed + 1) * 80000 + 20000) * 1000000;    // ₹20K Cr - ₹1L Cr
  if (r > 0.50) return Math.floor(seededRandom(seed + 1) * 15000 + 5000) * 1000000;     // ₹5K Cr - ₹20K Cr
  return Math.floor(seededRandom(seed + 1) * 4500 + 500) * 1000000;                      // ₹500 Cr - ₹5K Cr
}

function generatePrice(seed: number, marketCap: number): number {
  const r = seededRandom(seed);
  // Price correlated with market cap
  if (marketCap > 100000000000000) return parseFloat((r * 80000 + 1000).toFixed(2));
  if (marketCap > 20000000000000) return parseFloat((r * 5000 + 500).toFixed(2));
  if (marketCap > 5000000000000) return parseFloat((r * 3000 + 100).toFixed(2));
  return parseFloat((r * 800 + 5).toFixed(2));
}

function generatePE(seed: number, sector: string): number | null {
  const r = seededRandom(seed);
  if (r > 0.88) return null; // ~12% stocks have no PE (loss-making)
  
  // Sector-realistic PE ranges
  const sectorPE: Record<string, [number, number]> = {
    "Information Technology": [18, 45],
    "Financial Services": [8, 30],
    "Fast Moving Consumer Goods": [25, 70],
    "Healthcare": [15, 50],
    "Automobile & Auto Components": [12, 40],
    "Metals & Mining": [5, 20],
    "Power": [8, 25],
    "Oil Gas & Consumable Fuels": [6, 22],
  };
  
  const range = sectorPE[sector] || [8, 40];
  return parseFloat((r * (range[1] - range[0]) + range[0]).toFixed(1));
}

function generatePB(seed: number, sector: string): number | null {
  const r = seededRandom(seed);
  if (r > 0.92) return null;
  
  const sectorPB: Record<string, [number, number]> = {
    "Financial Services": [0.8, 5],
    "Information Technology": [3, 15],
    "Fast Moving Consumer Goods": [5, 25],
    "Healthcare": [2, 12],
    "Metals & Mining": [0.5, 4],
  };
  
  const range = sectorPB[sector] || [1, 10];
  return parseFloat((r * (range[1] - range[0]) + range[0]).toFixed(2));
}

function generateROE(seed: number, pe: number | null): number {
  const r = seededRandom(seed);
  // ROE correlated with PE: high PE often means high growth/ROE
  const base = pe ? Math.min(pe * 0.5, 20) : 5;
  return parseFloat((r * 40 + base - 10).toFixed(2));
}

function generateROCE(seed: number, roe: number): number {
  // ROCE is typically close to ROE but can differ
  const r = seededRandom(seed);
  return parseFloat((roe + (r - 0.5) * 15).toFixed(2));
}

function generateRSI(seed: number): number {
  const r = seededRandom(seed);
  // RSI distribution: mostly 30-70 (neutral), some overbought/oversold
  if (r > 0.92) return Math.floor(r * 15 + 75); // overbought 75-90
  if (r < 0.08) return Math.floor(r * 100 + 15); // oversold 15-30
  return Math.floor(r * 40 + 30); // neutral 30-70
}

function generateBeta(seed: number, sector: string): number {
  const r = seededRandom(seed);
  const sectorBeta: Record<string, [number, number]> = {
    "Financial Services": [0.8, 1.5],
    "Information Technology": [0.7, 1.3],
    "Fast Moving Consumer Goods": [0.3, 0.9],
    "Healthcare": [0.5, 1.1],
    "Metals & Mining": [1.0, 1.8],
    "Power": [0.6, 1.2],
    "Automobile & Auto Components": [0.9, 1.6],
  };
  
  const range = sectorBeta[sector] || [0.5, 1.5];
  return parseFloat((r * (range[1] - range[0]) + range[0]).toFixed(2));
}

function generateDividendYield(seed: number, pe: number | null): number | null {
  const r = seededRandom(seed);
  if (r > 0.55) return null; // ~45% pay no dividend
  // Low PE stocks tend to have higher dividends
  const maxYield = pe && pe < 15 ? 6 : 3;
  return parseFloat((r * maxYield).toFixed(2));
}

function generateVolume(seed: number, marketCap: number): number {
  const r = seededRandom(seed);
  // Volume correlated with market cap
  if (marketCap > 100000000000000) return Math.floor(r * 15000000 + 500000);
  if (marketCap > 20000000000000) return Math.floor(r * 5000000 + 100000);
  return Math.floor(r * 2000000 + 1000);
}

// ─── Top 20 Real Indian Anchor Stocks ───────────────────────────────────────
const ANCHOR_STOCKS: Omit<Stock, "change" | "changePercent" | "lastUpdated" | "flashDirection">[] = [
  { symbol: "RELIANCE", name: "Reliance Industries Limited", price: 2950.50, volume: 4800000, marketCap: 2000000000000000, peRatio: 26.5, pbRatio: 2.4, dividendYield: 0.34, sector: "Oil Gas & Consumable Fuels", industry: "Oil Refining & Marketing", high52Week: 3024.90, low52Week: 2180.00, roe: 11.2, roce: 12.5, rsi: 58, beta: 0.92 },
  { symbol: "TCS", name: "Tata Consultancy Services Limited", price: 3820.25, volume: 1800000, marketCap: 1400000000000000, peRatio: 30.2, pbRatio: 13.5, dividendYield: 1.25, sector: "Information Technology", industry: "IT Consulting & Software", high52Week: 4250.00, low52Week: 3070.30, roe: 46.8, roce: 58.2, rsi: 48, beta: 0.72 },
  { symbol: "HDFCBANK", name: "HDFC Bank Limited", price: 1605.60, volume: 9800000, marketCap: 1200000000000000, peRatio: 18.1, pbRatio: 2.8, dividendYield: 1.22, sector: "Financial Services", industry: "Banks - Private", high52Week: 1757.50, low52Week: 1363.00, roe: 17.5, roce: 4.2, rsi: 52, beta: 0.95 },
  { symbol: "INFY", name: "Infosys Limited", price: 1540.10, volume: 3200000, marketCap: 640000000000000, peRatio: 24.4, pbRatio: 8.2, dividendYield: 2.35, sector: "Information Technology", industry: "IT Consulting & Software", high52Week: 1733.00, low52Week: 1185.00, roe: 31.6, roce: 40.1, rsi: 41, beta: 0.78 },
  { symbol: "ICICIBANK", name: "ICICI Bank Limited", price: 1115.30, volume: 6200000, marketCap: 780000000000000, peRatio: 17.7, pbRatio: 3.1, dividendYield: 0.90, sector: "Financial Services", industry: "Banks - Private", high52Week: 1167.00, low52Week: 898.00, roe: 18.2, roce: 5.1, rsi: 65, beta: 1.05 },
  { symbol: "BHARTIARTL", name: "Bharti Airtel Limited", price: 1380.05, volume: 2900000, marketCap: 820000000000000, peRatio: 55.5, pbRatio: 7.8, dividendYield: 0.29, sector: "Telecommunication", industry: "Telecom Services", high52Week: 1460.00, low52Week: 792.00, roe: 14.8, roce: 11.2, rsi: 72, beta: 0.85 },
  { symbol: "SBIN", name: "State Bank of India", price: 830.40, volume: 14000000, marketCap: 740000000000000, peRatio: 10.8, pbRatio: 1.9, dividendYield: 1.65, sector: "Financial Services", industry: "Banks - Public", high52Week: 912.00, low52Week: 550.00, roe: 19.4, roce: 4.8, rsi: 61, beta: 1.22 },
  { symbol: "ITC", name: "ITC Limited", price: 435.20, volume: 11000000, marketCap: 540000000000000, peRatio: 26.4, pbRatio: 7.2, dividendYield: 3.62, sector: "Fast Moving Consumer Goods", industry: "Tobacco Products", high52Week: 499.70, low52Week: 399.00, roe: 29.1, roce: 36.4, rsi: 38, beta: 0.55 },
  { symbol: "LT", name: "Larsen & Toubro Limited", price: 3550.20, volume: 1500000, marketCap: 490000000000000, peRatio: 38.4, pbRatio: 5.6, dividendYield: 0.79, sector: "Construction & Infrastructure", industry: "Industrial Construction", high52Week: 3900.00, low52Week: 2150.00, roe: 14.2, roce: 16.8, rsi: 50, beta: 1.15 },
  { symbol: "HINDUNILVR", name: "Hindustan Unilever Limited", price: 2350.50, volume: 1200000, marketCap: 550000000000000, peRatio: 54.1, pbRatio: 11.4, dividendYield: 1.70, sector: "Fast Moving Consumer Goods", industry: "Personal Care", high52Week: 2769.00, low52Week: 2170.00, roe: 20.2, roce: 28.5, rsi: 35, beta: 0.42 },
  { symbol: "BAJFINANCE", name: "Bajaj Finance Limited", price: 7120.50, volume: 800000, marketCap: 430000000000000, peRatio: 31.4, pbRatio: 6.8, dividendYield: 0.50, sector: "Financial Services", industry: "NBFC", high52Week: 8192.00, low52Week: 6180.00, roe: 23.5, roce: 12.4, rsi: 49, beta: 1.35 },
  { symbol: "MARUTI", name: "Maruti Suzuki India Limited", price: 12450.00, volume: 400000, marketCap: 390000000000000, peRatio: 28.9, pbRatio: 5.2, dividendYield: 1.05, sector: "Automobile & Auto Components", industry: "Passenger Cars", high52Week: 13000.00, low52Week: 8150.00, roe: 16.4, roce: 20.1, rsi: 56, beta: 0.88 },
  { symbol: "SUNPHARMA", name: "Sun Pharmaceutical Industries Limited", price: 1545.20, volume: 1300000, marketCap: 370000000000000, peRatio: 35.8, pbRatio: 5.1, dividendYield: 0.81, sector: "Healthcare", industry: "Pharmaceuticals", high52Week: 1650.00, low52Week: 922.00, roe: 15.1, roce: 18.6, rsi: 59, beta: 0.65 },
  { symbol: "TATAMOTORS", name: "Tata Motors Limited", price: 985.60, volume: 5500000, marketCap: 360000000000000, peRatio: 8.5, pbRatio: 3.4, dividendYield: 0.30, sector: "Automobile & Auto Components", industry: "Commercial Vehicles", high52Week: 1080.00, low52Week: 580.00, roe: 35.2, roce: 15.8, rsi: 62, beta: 1.48 },
  { symbol: "WIPRO", name: "Wipro Limited", price: 465.80, volume: 2800000, marketCap: 245000000000000, peRatio: 20.1, pbRatio: 3.8, dividendYield: 0.50, sector: "Information Technology", industry: "IT Consulting & Software", high52Week: 575.00, low52Week: 380.00, roe: 16.5, roce: 18.2, rsi: 44, beta: 0.82 },
  { symbol: "HCLTECH", name: "HCL Technologies Limited", price: 1580.40, volume: 1600000, marketCap: 420000000000000, peRatio: 23.8, pbRatio: 6.2, dividendYield: 3.10, sector: "Information Technology", industry: "IT Consulting & Software", high52Week: 1750.00, low52Week: 1120.00, roe: 24.8, roce: 30.5, rsi: 53, beta: 0.76 },
  { symbol: "COALINDIA", name: "Coal India Limited", price: 475.10, volume: 7500000, marketCap: 290000000000000, peRatio: 8.9, pbRatio: 3.2, dividendYield: 5.25, sector: "Oil Gas & Consumable Fuels", industry: "Coal & Consumable Fuels", high52Week: 526.00, low52Week: 218.00, roe: 52.4, roce: 68.1, rsi: 68, beta: 1.10 },
  { symbol: "TATASTEEL", name: "Tata Steel Limited", price: 142.50, volume: 12000000, marketCap: 175000000000000, peRatio: 22.1, pbRatio: 1.8, dividendYield: 2.45, sector: "Metals & Mining", industry: "Steel & Iron Products", high52Week: 165.00, low52Week: 100.00, roe: 8.5, roce: 10.2, rsi: 55, beta: 1.52 },
  { symbol: "TITAN", name: "Titan Company Limited", price: 3250.80, volume: 900000, marketCap: 288000000000000, peRatio: 68.5, pbRatio: 16.2, dividendYield: 0.35, sector: "Consumer Durables", industry: "Jewellery & Watches", high52Week: 3650.00, low52Week: 2750.00, roe: 25.8, roce: 30.2, rsi: 46, beta: 0.95 },
  { symbol: "ASIANPAINT", name: "Asian Paints Limited", price: 2780.40, volume: 700000, marketCap: 268000000000000, peRatio: 52.4, pbRatio: 18.5, dividendYield: 0.85, sector: "Chemicals", industry: "Specialty Chemicals", high52Week: 3420.00, low52Week: 2560.00, roe: 28.4, roce: 35.8, rsi: 40, beta: 0.68 },
];

// ─── Used tickers set for uniqueness ────────────────────────────────────────
const usedTickers = new Set<string>(ANCHOR_STOCKS.map(s => s.symbol));

// ─── Generate 5000 stocks deterministically ─────────────────────────────────
function generateStocks(): Stock[] {
  const generated: Stock[] = [];

  for (let i = 0; i < 5000; i++) {
    const seed = i * 7 + 10000;
    const sectorIdx = Math.floor(seededRandom(seed) * SECTORS.length);
    const sector = SECTORS[sectorIdx];
    const industries = INDUSTRIES_BY_SECTOR[sector];
    const industry = industries[Math.floor(seededRandom(seed + 1) * industries.length)];

    const prefixIdx = Math.floor(seededRandom(seed + 2) * PREFIXES.length);
    const suffixIdx = Math.floor(seededRandom(seed + 3) * SUFFIXES.length);
    const prefix = PREFIXES[prefixIdx];
    const suffix = SUFFIXES[suffixIdx];

    // Generate unique ticker
    let symbol = generateTicker(seed + 4, i, prefix);
    let attempts = 0;
    while (usedTickers.has(symbol) && attempts < 20) {
      attempts++;
      symbol = generateTicker(seed + 4 + attempts * 100, i + attempts, prefix);
    }
    // If still duplicate, add index
    if (usedTickers.has(symbol)) {
      symbol = `${symbol.slice(0, 8)}${i}`;
    }
    usedTickers.add(symbol);

    const name = `${prefix} ${industry.split(" - ")[0].split(" & ")[0]} ${suffix} Ltd.`;
    const marketCap = generateMarketCap(seed + 5);
    const price = generatePrice(seed + 6, marketCap);
    const pe = generatePE(seed + 7, sector);
    const pb = generatePB(seed + 8, sector);
    const roe = generateROE(seed + 9, pe);
    const roce = generateROCE(seed + 10, roe);
    const rsi = generateRSI(seed + 11);
    const betaVal = generateBeta(seed + 12, sector);
    const divYield = generateDividendYield(seed + 13, pe);
    const volume = generateVolume(seed + 14, marketCap);

    const high52Week = parseFloat((price * (1 + seededRandom(seed + 15) * 0.40)).toFixed(2));
    const low52Week = parseFloat((price * (1 - seededRandom(seed + 16) * 0.35)).toFixed(2));

    generated.push({
      symbol,
      name,
      price,
      change: 0,
      changePercent: 0,
      volume,
      marketCap,
      peRatio: pe,
      pbRatio: pb,
      dividendYield: divYield,
      sector,
      industry,
      high52Week,
      low52Week,
      roe,
      roce,
      rsi,
      beta: betaVal,
      lastUpdated: new Date().toISOString(),
    });
  }

  return generated;
}

// ─── Merge anchors + generated, deduplicate ─────────────────────────────────
const generatedStocks = generateStocks();
const anchorStocksComplete: Stock[] = ANCHOR_STOCKS.map(s => ({
  ...s,
  change: 0,
  changePercent: 0,
  lastUpdated: new Date().toISOString(),
}));

export const ALL_STOCKS: Stock[] = [
  ...anchorStocksComplete,
  ...generatedStocks.filter(s => !usedTickers.has(s.symbol) || !ANCHOR_STOCKS.some(a => a.symbol === s.symbol)),
];

// ─── Real-time price simulation (Geometric Brownian Motion) ─────────────────
export function getLatestStocks(): Stock[] {
  const now = new Date();
  const timeSecs = Math.floor(now.getTime() / 1000);
  const tickTime = Math.floor(timeSecs / 5); // 5-second ticks

  return ALL_STOCKS.map((stock, index) => {
    // GBM-inspired price fluctuation
    const mu = 0.0001; // drift
    const sigma = 0.015; // volatility
    const z = Math.sin(tickTime * 1.7 + index * 3.3) * 2 - 1; // pseudo-normal
    const fluctuation = mu + sigma * z;
    const changePercent = parseFloat((fluctuation * 100).toFixed(2));
    const change = parseFloat((stock.price * fluctuation).toFixed(2));
    const price = Math.max(1.0, parseFloat((stock.price + change).toFixed(2)));

    return {
      ...stock,
      price,
      change,
      changePercent,
      lastUpdated: now.toISOString(),
    };
  });
}

// ─── Candlestick data generation ────────────────────────────────────────────
export function generateCandleData(
  basePrice: number,
  timeframe: "1D" | "1W" | "1M" | "3M" | "1Y" | "5Y"
): { time: number; open: number; high: number; low: number; close: number; volume: number }[] {
  const now = Math.floor(Date.now() / 1000);
  const candles: { time: number; open: number; high: number; low: number; close: number; volume: number }[] = [];

  let count: number;
  let interval: number; // seconds between candles

  switch (timeframe) {
    case "1D": count = 75; interval = 300; break;       // 5-min candles
    case "1W": count = 35; interval = 14400; break;     // 4-hour candles
    case "1M": count = 30; interval = 86400; break;     // daily candles
    case "3M": count = 90; interval = 86400; break;     // daily candles
    case "1Y": count = 52; interval = 604800; break;    // weekly candles
    case "5Y": count = 60; interval = 2592000; break;   // monthly candles
    default: count = 30; interval = 86400;
  }

  let currentPrice = basePrice * (0.7 + seededRandom(Math.floor(basePrice * 100)) * 0.3);

  for (let i = 0; i < count; i++) {
    const time = now - (count - i) * interval;
    const seed = Math.floor(basePrice * 10 + i * 17);
    const volatility = 0.02 + seededRandom(seed) * 0.03;
    const drift = (seededRandom(seed + 1) - 0.48) * volatility;

    const open = currentPrice;
    const close = open * (1 + drift);
    const highSpread = Math.abs(close - open) + open * seededRandom(seed + 2) * volatility;
    const lowSpread = Math.abs(close - open) + open * seededRandom(seed + 3) * volatility;
    const high = Math.max(open, close) + highSpread;
    const low = Math.min(open, close) - lowSpread;
    const vol = Math.floor(seededRandom(seed + 4) * 5000000 + 100000);

    candles.push({
      time,
      open: parseFloat(open.toFixed(2)),
      high: parseFloat(high.toFixed(2)),
      low: parseFloat(Math.max(low, 1).toFixed(2)),
      close: parseFloat(close.toFixed(2)),
      volume: vol,
    });

    currentPrice = close;
  }

  return candles;
}

// ─── Extract unique sectors with stats ──────────────────────────────────────
export function getSectorStats(): { name: string; stockCount: number; avgPE: number; avgROE: number; industries: string[] }[] {
  const sectorMap: Record<string, { stocks: Stock[]; industries: Set<string> }> = {};
  
  for (const stock of ALL_STOCKS) {
    if (!sectorMap[stock.sector]) {
      sectorMap[stock.sector] = { stocks: [], industries: new Set() };
    }
    sectorMap[stock.sector].stocks.push(stock);
    sectorMap[stock.sector].industries.add(stock.industry);
  }

  return Object.entries(sectorMap).map(([name, { stocks, industries }]) => {
    const withPE = stocks.filter(s => s.peRatio !== null);
    const avgPE = withPE.length > 0
      ? parseFloat((withPE.reduce((sum, s) => sum + (s.peRatio || 0), 0) / withPE.length).toFixed(1))
      : 0;
    const avgROE = parseFloat((stocks.reduce((sum, s) => sum + s.roe, 0) / stocks.length).toFixed(1));

    return {
      name,
      stockCount: stocks.length,
      avgPE,
      avgROE,
      industries: Array.from(industries),
    };
  }).sort((a, b) => b.stockCount - a.stockCount);
}
