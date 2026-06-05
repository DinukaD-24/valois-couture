"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.5,
    });

    lenisRef.current = lenis;

    // Emit scroll event to ScrollTrigger so GSAP stays in sync with Lenis
    lenis.on("scroll", () => {
      // dispatch a synthetic scroll event so GSAP ScrollTrigger updates its values
      window.dispatchEvent(new Event("scroll", { bubbles: false }));
    });

    // Connect Lenis to the requestAnimationFrame loop
    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    // Add lenis class to HTML element for compatibility styling
    document.documentElement.classList.add("lenis", "lenis-smooth");

    return () => {
      lenis.destroy();
      cancelAnimationFrame(rafId);
      document.documentElement.classList.remove("lenis", "lenis-smooth");
    };
  }, []);

  return <>{children}</>;
}
