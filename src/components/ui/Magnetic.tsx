"use client";

import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";

interface MagneticProps {
  children: React.ReactElement;
  range?: number;
  strength?: number;
}

export default function Magnetic({ children, range = 50, strength = 0.35 }: MagneticProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [hasFinePointer, setHasFinePointer] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(pointer: fine)");
    setHasFinePointer(mediaQuery.matches);
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!hasFinePointer) return;
    if (!ref.current) return;
    const { clientX, clientY } = e;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    const distanceX = clientX - centerX;
    const distanceY = clientY - centerY;

    // Calculate distance
    const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

    if (distance < range) {
      // Magnetic effect inside range
      setPosition({ x: distanceX * strength, y: distanceY * strength });
    } else {
      // Snap back if mouse leaves range
      setPosition({ x: 0, y: 0 });
    }
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
      className="inline-block"
    >
      {children}
    </motion.div>
  );
}
