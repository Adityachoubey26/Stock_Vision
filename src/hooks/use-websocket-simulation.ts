import { useEffect, useRef, useCallback } from "react";
import { useRealtimeStore } from "@/store/use-realtime-store";
import { ALL_STOCKS } from "@/lib/mock-data";

// Box-Muller transform for standard normal random variable (GBM)
function boxMullerRandom(): number {
  let u = 0, v = 0;
  while(u === 0) u = Math.random(); // Converting [0,1) to (0,1)
  while(v === 0) v = Math.random();
  return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
}

interface PriceUpdate {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  flash: "up" | "down";
}

export function useWebSocketSimulation() {
  const {
    connectionStatus,
    reconnectAttempts,
    initialize,
    setConnectionStatus,
    incrementReconnectAttempts,
    resetReconnectAttempts,
    clearFlash,
  } = useRealtimeStore();

  const tickIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Batch queue for requestAnimationFrame
  const updateQueueRef = useRef<PriceUpdate[]>([]);
  const animationFrameIdRef = useRef<number | null>(null);

  // Initialize store with ALL_STOCKS
  useEffect(() => {
    initialize(ALL_STOCKS);
  }, [initialize]);

  // Process the accumulated updates queue using requestAnimationFrame
  const processBatchQueue = useCallback(() => {
    const queue = updateQueueRef.current;
    if (queue.length === 0) {
      animationFrameIdRef.current = null;
      return;
    }

    // Process batch in single Zustand write operation (directly or via store updates)
    // To be most efficient and avoid multiple setState calls, bulk update the store:
    useRealtimeStore.setState((state) => {
      const nextPrices = { ...state.prices };
      queue.forEach((update) => {
        nextPrices[update.symbol] = {
          price: update.price,
          change: update.change,
          changePercent: update.changePercent,
          flash: update.flash,
        };
      });
      return { prices: nextPrices };
    });

    // Clear flash after 300ms for each symbol in this batch
    queue.forEach((update) => {
      setTimeout(() => {
        clearFlash(update.symbol);
      }, 300);
    });

    // Clear queue
    updateQueueRef.current = [];
    animationFrameIdRef.current = null;
  }, [clearFlash]);

  // Queue a single price update
  const queueUpdate = useCallback((update: PriceUpdate) => {
    updateQueueRef.current.push(update);
    if (!animationFrameIdRef.current) {
      animationFrameIdRef.current = requestAnimationFrame(processBatchQueue);
    }
  }, [processBatchQueue]);

  // Start the simulation ticks
  const startSimulation = useCallback(() => {
    if (tickIntervalRef.current) clearInterval(tickIntervalRef.current);

    tickIntervalRef.current = setInterval(() => {
      // Pick a random batch of e.g. 30 stocks to update
      const batchSize = 30;
      const totalStocksCount = ALL_STOCKS.length;
      
      for (let i = 0; i < batchSize; i++) {
        const randomIndex = Math.floor(Math.random() * totalStocksCount);
        const stock = ALL_STOCKS[randomIndex];
        const symbol = stock.symbol;

        // Retrieve current live price, fallback to stock price
        const currentData = useRealtimeStore.getState().prices[symbol];
        const currentPrice = currentData ? currentData.price : stock.price;

        // Geometric Brownian Motion calculation: dS = S * (mu * dt + sigma * dW)
        const mu = 0.00005; // Drift (bias upward)
        const sigma = 0.003; // Volatility
        const dW = boxMullerRandom();
        
        const returnVal = mu + sigma * dW;
        const newPrice = Math.max(1.0, parseFloat((currentPrice * (1 + returnVal)).toFixed(2)));
        
        // Calculate relative change since initial generation
        const change = parseFloat((newPrice - stock.price).toFixed(2));
        const changePercent = parseFloat(((change / stock.price) * 100).toFixed(2));
        const flash = newPrice >= currentPrice ? "up" : "down";

        queueUpdate({
          symbol,
          price: newPrice,
          change,
          changePercent,
          flash,
        });
      }
    }, 400); // tick every 400ms
  }, [queueUpdate]);

  // Handle reconnect attempt
  const attemptReconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);

    setConnectionStatus("RECONNECTING");
    incrementReconnectAttempts();

    const attempts = reconnectAttempts + 1;
    // Exponential Backoff Delay: 1s, 2s, 4s, 8s, max 16s
    const backoffDelay = Math.min(16000, 1000 * Math.pow(2, attempts - 1));

    reconnectTimeoutRef.current = setTimeout(() => {
      // Simulate connection logic: succeed on the 3rd attempt
      if (attempts >= 3) {
        setConnectionStatus("CONNECTED");
        resetReconnectAttempts();
        startSimulation();
      } else {
        // Fail again, schedule next retry
        setConnectionStatus("DISCONNECTED");
        attemptReconnect();
      }
    }, backoffDelay);
  }, [reconnectAttempts, incrementReconnectAttempts, resetReconnectAttempts, setConnectionStatus, startSimulation]);

  // Connect action
  const connect = useCallback(() => {
    if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
    if (tickIntervalRef.current) clearInterval(tickIntervalRef.current);
    
    setConnectionStatus("CONNECTING");
    resetReconnectAttempts();

    // Settle connection after 800ms
    reconnectTimeoutRef.current = setTimeout(() => {
      setConnectionStatus("CONNECTED");
      startSimulation();
    }, 800);
  }, [setConnectionStatus, resetReconnectAttempts, startSimulation]);

  // Disconnect action
  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
    if (tickIntervalRef.current) clearInterval(tickIntervalRef.current);
    
    setConnectionStatus("DISCONNECTED");
  }, [setConnectionStatus]);

  // Manage start/stop of simulation based on connectionStatus
  useEffect(() => {
    // Default: auto-connect on mount
    if (connectionStatus === "DISCONNECTED" && reconnectAttempts === 0) {
      connect();
    }

    return () => {
      if (tickIntervalRef.current) clearInterval(tickIntervalRef.current);
      if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
      if (animationFrameIdRef.current) cancelAnimationFrame(animationFrameIdRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    connectionStatus,
    reconnectAttempts,
    connect,
    disconnect,
    attemptReconnect,
  };
}
