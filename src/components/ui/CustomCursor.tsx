"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function CustomCursor() {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [hasFinePointer, setHasFinePointer] = useState(false);

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  const ringX = useSpring(cursorX, { stiffness: 250, damping: 30 });
  const ringY = useSpring(cursorY, { stiffness: 250, damping: 30 });

  // Check pointer device once on mount
  useEffect(() => {
    const mq = window.matchMedia("(pointer: fine)");
    setHasFinePointer(mq.matches);
  }, []);

  useEffect(() => {
    if (!hasFinePointer) return;

    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      setIsVisible(true);
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    // Use event delegation for interactive hover detection (no mutation observer)
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target?.closest("a, button, [role='button'], input, textarea, select, .interactive-hover")) {
        setIsHovered(true);
      }
    };

    const handleMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target?.closest("a, button, [role='button'], input, textarea, select, .interactive-hover")) {
        setIsHovered(false);
      }
    };

    window.addEventListener("mousemove", moveCursor);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);
    document.addEventListener("mouseover", handleMouseOver);
    document.addEventListener("mouseout", handleMouseOut);

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
      document.removeEventListener("mouseover", handleMouseOver);
      document.removeEventListener("mouseout", handleMouseOut);
    };
  }, [hasFinePointer, cursorX, cursorY]);

  // Don't render on touch-only devices or before client mounts
  if (!hasFinePointer || !isVisible) return null;

  return (
    <>
      {/* Inner Dot — mix-blend-difference for contrast against all backgrounds */}
      <motion.div
        className="fixed top-0 left-0 w-2 h-2 bg-primary-light rounded-full pointer-events-none z-[99999] mix-blend-difference"
        style={{ x: cursorX, y: cursorY, translateX: "-50%", translateY: "-50%" }}
        animate={{ scale: isHovered ? 2.5 : 1 }}
        transition={{ type: "spring", stiffness: 400, damping: 28 }}
      />
      {/* Outer Ring */}
      <motion.div
        className="fixed top-0 left-0 w-8 h-8 border border-primary/40 rounded-full pointer-events-none z-[99998]"
        style={{ x: ringX, y: ringY, translateX: "-50%", translateY: "-50%" }}
        animate={{
          scale: isHovered ? 1.6 : 1,
          borderColor: isHovered ? "rgba(250, 249, 246, 0.8)" : "rgba(212, 203, 181, 0.4)",
          backgroundColor: isHovered ? "rgba(250, 249, 246, 0.05)" : "rgba(250, 249, 246, 0)",
        }}
        transition={{ type: "spring", stiffness: 200, damping: 25 }}
      />
    </>
  );
}
