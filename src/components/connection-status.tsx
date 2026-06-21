"use client";

import React from "react";
import { useRealtimeStore } from "@/store/use-realtime-store";
import { useWebSocketSimulation } from "@/hooks/use-websocket-simulation";
import { Wifi, WifiOff, RefreshCw } from "lucide-react";

export function ConnectionStatus() {
  // Pull connection state and action triggers from the store
  const { connectionStatus, reconnectAttempts } = useRealtimeStore();
  const { connect, disconnect } = useWebSocketSimulation();

  const handleToggle = () => {
    if (connectionStatus === "CONNECTED") {
      disconnect();
    } else if (connectionStatus === "DISCONNECTED") {
      connect();
    }
  };

  // Compute color palettes and layout icons based on status
  let bgClass = "bg-green-50 border-green-200 text-green-700";
  let dotClass = "bg-green-500 animate-pulse";
  let statusText = "CONNECTED";
  let Icon = Wifi;

  if (connectionStatus === "CONNECTING") {
    bgClass = "bg-blue-50 border-blue-200 text-blue-700";
    dotClass = "bg-blue-500 animate-spin";
    statusText = "CONNECTING...";
    Icon = RefreshCw;
  } else if (connectionStatus === "RECONNECTING") {
    bgClass = "bg-amber-50 border-amber-200 text-amber-700";
    dotClass = "bg-amber-500 animate-bounce";
    statusText = `RETRYING (${reconnectAttempts})`;
    Icon = RefreshCw;
  } else if (connectionStatus === "DISCONNECTED") {
    bgClass = "bg-rose-50 border-rose-200 text-rose-700";
    dotClass = "bg-rose-500";
    statusText = "DISCONNECTED";
    Icon = WifiOff;
  }

  return (
    <button
      onClick={handleToggle}
      className={`flex items-center gap-2 px-3 py-1.5 border rounded-full text-xs font-semibold shadow-sm transition-all duration-200 hover:scale-[1.02] cursor-pointer select-none active:scale-[0.98] ${bgClass}`}
      title={connectionStatus === "CONNECTED" ? "Click to Disconnect" : "Click to Connect"}
    >
      <div className={`w-2 h-2 rounded-full ${dotClass}`} />
      <Icon className="w-3.5 h-3.5 shrink-0" />
      <span className="font-mono tracking-tight">{statusText}</span>
    </button>
  );
}
