import { TerminalLayout } from "@/components/terminal-layout";
import React from "react";

export default function MarketLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <TerminalLayout>{children}</TerminalLayout>;
}
