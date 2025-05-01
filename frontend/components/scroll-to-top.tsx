"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export function ScrollToTop() {
  const pathname = usePathname();

  useEffect(() => {
    // Scroll to top on route change
    window.scrollTo({
      top: 0,
      behavior: "instant", // Use "smooth" for smooth scrolling, "instant" for immediate jump
    });
  }, [pathname]);

  return null;
}