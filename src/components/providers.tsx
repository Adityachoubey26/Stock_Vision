"use client";

import React, { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useWebSocketSimulation } from "@/hooks/use-websocket-simulation";

function RealtimeSimulator() {
  useWebSocketSimulation();
  return null;
}

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 4000, // Stale after 4 seconds to fit the 5 second pricing updates
            refetchOnWindowFocus: true,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <RealtimeSimulator />
      {children}
    </QueryClientProvider>
  );
}

