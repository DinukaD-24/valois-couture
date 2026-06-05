"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { ArrowRight, ChevronDown } from "lucide-react";
import Magnetic from "@/components/ui/Magnetic";

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  // Motion values for mouse movement parallax
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Pre-declare all springs at top level (no hooks inside JSX)
  const bgSpringX = useSpring(mouseX, { stiffness: 30, damping: 15 });
  const bgSpringY = useSpring(mouseY, { stiffness: 30, damping: 15 });
  const el1SpringX = useSpring(mouseX, { stiffness: 80, damping: 25 });
  const el1SpringY = useSpring(mouseY, { stiffness: 80, damping: 25 });
  const el2SpringX = useSpring(mouseX, { stiffness: 40, damping: 18 });
  const el2SpringY = useSpring(mouseY, { stiffness: 40, damping: 18 });

  useEffect(() => {
    setMounted(true);

    const handleMouseMove = (e: MouseEvent) => {
      const clientWidth = window.innerWidth;
      const clientHeight = window.innerHeight;
      // Get pointer percentage coordinates from center (-0.5 to 0.5)
      const x = (e.clientX / clientWidth) - 0.5;
      const y = (e.clientY / clientHeight) - 0.5;
      mouseX.set(x);
      mouseY.set(y);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  const scrollToSection = (id: string) => {
    const el = document.querySelector(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const line1 = "CRAFTED FOR THOSE";
  const line2 = "WHO REFUSE ORDINARY";

  return (
    <section
      id="home"
      ref={containerRef}
      className="relative min-h-screen w-full flex items-center justify-center bg-charcoal-950 overflow-hidden pt-20 select-none"
    >
      {/* Ambient Gradient Mesh Background (Mouse-parallax reactive) */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <motion.div
          style={{ x: bgSpringX, y: bgSpringY }}
          className="absolute inset-0 flex items-center justify-center scale-110"
        >
          <div className="absolute top-[20%] left-[10%] w-[35vw] h-[35vw] rounded-full bg-gold-accent/10 blur-[120px]" />
          <div className="absolute bottom-[20%] right-[10%] w-[40vw] h-[40vw] rounded-full bg-silver-accent/5 blur-[140px]" />
        </motion.div>
      </div>

      {/* Floating abstract decorative elements (Parallax) */}
      {mounted && (
        <div className="absolute inset-0 z-10 pointer-events-none">
          <motion.div
            style={{ x: el1SpringX, y: el1SpringY }}
            className="absolute top-[25%] right-[20%] w-16 h-16 border border-white/5 rotate-[15deg] hidden md:block"
          >
            <div className="w-full h-full border border-white/5 rotate-45 scale-75" />
          </motion.div>

          <motion.div
            style={{ x: el2SpringX, y: el2SpringY }}
            className="absolute bottom-[25%] left-[15%] w-24 h-24 border border-white/5 rounded-full hidden md:block"
          >
            <div className="w-full h-full border-dashed border-white/5 rounded-full" />
          </motion.div>
        </div>
      )}

      {/* Content Container */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-20 text-center flex flex-col items-center">
        {/* Sub-label */}
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="text-[10px] md:text-xs font-sans tracking-[0.3em] text-primary uppercase mb-6 block"
        >
          MAISON D&apos;ARTISANAT — COUTURE ET CHAOS
        </motion.span>

        {/* Headline */}
        <h1 className="font-display font-medium text-4xl sm:text-6xl md:text-8xl tracking-tight leading-[1.05] text-primary-light mb-8 max-w-5xl">
          <span className="block overflow-hidden clip-text py-1">
            <motion.span
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              transition={{ duration: 1.2, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="block"
            >
              {line1}
            </motion.span>
          </span>
          <span className="block overflow-hidden clip-text italic font-serif text-3xl sm:text-5xl md:text-7xl font-normal text-primary py-1">
            <motion.span
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              transition={{ duration: 1.2, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="block"
            >
              {line2}
            </motion.span>
          </span>
        </h1>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="text-xs sm:text-sm md:text-base text-primary-light/60 font-sans tracking-wide max-w-xl mb-12 leading-relaxed"
        >
          A collective of premium streetwear and classic high-end garments. Redefining silhouettes through sculptural textures, luxury textiles, and tailored geometry.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.0, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col sm:flex-row gap-6 justify-center items-center w-full sm:w-auto"
        >
          <Magnetic range={50} strength={0.3}>
            <button
              onClick={() => scrollToSection("#collection")}
              className="w-full sm:w-auto px-8 py-4 border border-gold-accent bg-gold-accent text-charcoal-950 font-sans font-medium text-[10px] tracking-[0.2em] uppercase cursor-pointer hover:bg-transparent hover:text-primary-light transition-all duration-300 relative group overflow-hidden"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                Shop Collection <ArrowRight className="w-3.5 h-3.5" />
              </span>
              <span className="absolute inset-0 bg-charcoal-950 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300 ease-out" />
            </button>
          </Magnetic>

          <Magnetic range={50} strength={0.3}>
            <button
              onClick={() => scrollToSection("#lookbook")}
              className="w-full sm:w-auto px-8 py-4 border border-white/10 hover:border-white/40 text-primary-light font-sans font-medium text-[10px] tracking-[0.2em] uppercase cursor-pointer transition-all duration-300 relative group overflow-hidden"
            >
              <span className="relative z-10">View Lookbook</span>
              <span className="absolute inset-0 bg-white/5 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
            </button>
          </Magnetic>
        </motion.div>
      </div>

      {/* Downward Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center cursor-pointer"
        onClick={() => scrollToSection("#collection")}
      >
        <span className="text-[8px] font-sans tracking-[0.25em] text-primary-light/40 uppercase mb-2">
          SCROLL DOWN
        </span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        >
          <ChevronDown className="w-4 h-4 text-primary-light/40" />
        </motion.div>
      </motion.div>
    </section>
  );
}
