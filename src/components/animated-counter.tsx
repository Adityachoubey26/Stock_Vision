"use client";

import React, { useEffect, useRef } from "react";
import { animate } from "framer-motion";

interface AnimatedCounterProps {
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
}

export function AnimatedCounter({
  value,
  prefix = "",
  suffix = "",
  decimals = 0,
}: AnimatedCounterProps) {
  const nodeRef = useRef<HTMLSpanElement>(null);
  const prevValueRef = useRef(0);

  useEffect(() => {
    const node = nodeRef.current;
    if (!node) return;

    const from = prevValueRef.current;
    const to = value;
    prevValueRef.current = to;

    const controls = animate(from, to, {
      duration: 0.8,
      ease: "easeOut",
      onUpdate(current) {
        node.textContent = `${prefix}${current.toLocaleString("en-IN", {
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals,
        })}${suffix}`;
      },
    });

    return () => controls.stop();
  }, [value, prefix, suffix, decimals]);

  return <span ref={nodeRef} className="tabular-nums font-semibold" />;
}
