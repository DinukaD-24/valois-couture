"use client";

import { useEffect, useState, useRef } from "react";
import { useInView, motion } from "framer-motion";

interface StatItemProps {
  value: number;
  suffix: string;
  label: string;
  subLabel: string;
  index: number;
}

function Counter({ value, duration = 1.5 }: { value: number; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });

  useEffect(() => {
    if (!isInView) return;
    
    let startTimestamp: number | null = null;
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / (duration * 1000), 1);
      
      // Easing function (easeOutExpo)
      const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setCount(Math.floor(easeProgress * value));
      
      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        setCount(value);
      }
    };
    
    window.requestAnimationFrame(step);
  }, [isInView, value, duration]);

  return <span ref={ref}>{count}</span>;
}

function StatItem({ value, suffix, label, subLabel, index }: StatItemProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });

  return (
    <div
      ref={ref}
      className={`text-center p-8 flex flex-col items-center justify-center ${
        index % 2 === 0 ? "border-r border-white/5" : "border-r-0"
      } ${
        index === 3 ? "lg:border-r-0" : "lg:border-r lg:border-white/5"
      } ${
        index < 2 ? "border-b lg:border-b-0 border-white/5" : ""
      }`}
    >
      <div className="font-display font-medium text-5xl sm:text-6xl md:text-7xl text-primary-light flex items-baseline tracking-tight mb-4 select-none">
        <Counter value={value} />
        <span className="text-gold-accent font-serif italic text-3xl sm:text-4xl ml-1">{suffix}</span>
      </div>
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="text-[10px] font-sans font-semibold tracking-[0.25em] text-primary uppercase mb-1"
      >
        {label}
      </motion.p>
      <motion.p
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="text-[10px] font-sans tracking-wide text-primary-light/40 uppercase"
      >
        {subLabel}
      </motion.p>
    </div>
  );
}

export default function Experience() {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true });

  const stats = [
    { value: 12, suffix: "+", label: "YEARS IN COUTURE", subLabel: "ESTABLISHED IN 2014" },
    { value: 99, suffix: "%", label: "ORGANIC FIBERS", subLabel: "HERITAGE CERTIFIED" },
    { value: 8, suffix: "", label: "GLOBAL ATELIERS", subLabel: "PARIS - MILAN - TOKYO" },
    { value: 45, suffix: "+", label: "COUNTRIES REACHED", subLabel: "EXPRESS GLOBAL LOGISTICS" },
  ];

  return (
    <section ref={containerRef} className="py-20 bg-charcoal-950 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-2 lg:grid-cols-4 border border-white/5 bg-charcoal-900/10">
          {stats.map((stat, i) => (
            <StatItem
              key={i}
              value={stat.value}
              suffix={stat.suffix}
              label={stat.label}
              subLabel={stat.subLabel}
              index={i}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
