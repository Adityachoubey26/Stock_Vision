import { create } from "zustand";
import { Stock } from "@/types/stock";

export type ConnectionStatus = "CONNECTED" | "DISCONNECTED" | "CONNECTING" | "RECONNECTING";

interface RealtimeState {
  connectionStatus: ConnectionStatus;
  reconnectAttempts: number;
  prices: Record<
    string,
    {
      price: number;
      change: number;
      changePercent: number;
      flash: "up" | "down" | null;
    }
  >;
  
  // Actions
  initialize: (stocks: Stock[]) => void;
  updateStockPrice: (symbol: string, newPrice: number, change: number, changePercent: number, flash: "up" | "down") => void;
  setConnectionStatus: (status: ConnectionStatus) => void;
  incrementReconnectAttempts: () => void;
  resetReconnectAttempts: () => void;
  clearFlash: (symbol: string) => void;
}

export const useRealtimeStore = create<RealtimeState>((set) => ({
  connectionStatus: "DISCONNECTED",
  reconnectAttempts: 0,
  prices: {},

  initialize: (stocks) =>
    set((state) => {
      // Seed the initial prices if they haven't been seeded yet
      const prices = { ...state.prices };
      let updated = false;
      stocks.forEach((stock) => {
        if (!prices[stock.symbol]) {
          prices[stock.symbol] = {
            price: stock.price,
            change: stock.change,
            changePercent: stock.changePercent,
            flash: null,
          };
          updated = true;
        }
      });
      return updated ? { prices } : {};
    }),

  updateStockPrice: (symbol, newPrice, change, changePercent, flash) =>
    set((state) => {
      const prices = { ...state.prices };
      prices[symbol] = {
        price: newPrice,
        change,
        changePercent,
        flash,
      };
      return { prices };
    }),

  setConnectionStatus: (connectionStatus) => set({ connectionStatus }),
  
  incrementReconnectAttempts: () =>
    set((state) => ({ reconnectAttempts: state.reconnectAttempts + 1 })),
    
  resetReconnectAttempts: () => set({ reconnectAttempts: 0 }),

  clearFlash: (symbol) =>
    set((state) => {
      const prices = { ...state.prices };
      if (prices[symbol]) {
        prices[symbol] = { ...prices[symbol], flash: null };
      }
      return { prices };
    }),
}));
