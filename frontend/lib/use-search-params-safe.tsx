"use client";

import type React from "react";
import { useState, useEffect } from "react";

// Wrapper component (no Suspense required)
export function SearchParamsProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

// Safe hook that ensures client-side only execution
export function useSearchParamsSafe() {
  const [params, setParams] = useState<Record<string, string>>({});

  useEffect(() => {
    if (typeof window !== "undefined") {
      const search = window.location.search;
      const parsedParams: Record<string, string> = {};

      if (search) {
        search
          .substring(1) // Remove the "?" at the start
          .split("&")
          .forEach((param) => {
            const [key, value] = param.split("=");
            if (key) {
              parsedParams[key] = decodeURIComponent(value || "");
            }
          });
      }

      setParams(parsedParams);
    }
  }, []);

  return params; // Return a plain object with key-value pairs
}