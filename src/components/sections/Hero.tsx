"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, ChevronDown } from "lucide-react";
import Magnetic from "@/components/ui/Magnetic";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const textContainerRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // GSAP ScrollTrigger Page-Turn Parallax Effect
  useGSAP(() => {
    const container = containerRef.current;
    if (!container) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: "top top",
        end: "bottom top",
        scrub: true,
        invalidateOnRefresh: true,
      }
    });

    // Parallax scroll on the campaign image (drifts slightly up)
    tl.to(".magazine-image-wrap", {
      y: -80,
      scale: 0.98,
      opacity: 0.85,
      ease: "none",
    }, 0);

    // Text block translates up faster and fades out
    tl.to(".magazine-text-wrap", {
      y: -120,
      opacity: 0.1,
      ease: "none",
    }, 0);

    // Grid lines slide slowly
    tl.to(".magazine-grid-line", {
      y: -40,
      ease: "none",
    }, 0);
  }, { scope: containerRef });

  const scrollToSection = (id: string) => {
    const el = document.querySelector(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const line1 = "CRAFTED FOR THOSE";
  const line2 = "WHO REFUSE ORDINARY";

  // Framer Motion Animation Variants
  const spreadVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      }
    }
  };

  const lineVariants = {
    hidden: { y: "100%", opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 1.4, ease: [0.16, 1, 0.3, 1] as any }
    }
  };

  const fadeUpVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 1.4, ease: [0.16, 1, 0.3, 1] as any }
    }
  };

  const imageMaskVariants = {
    hidden: { clipPath: "polygon(0 100%, 100% 100%, 100% 100%, 0 100%)" },
    visible: {
      clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
      transition: { duration: 1.8, ease: [0.76, 0, 0.24, 1] as any }
    }
  };

  const imageInnerVariants = {
    hidden: { scale: 1.15, filter: "brightness(0.8) grayscale(100%)" },
    visible: {
      scale: 1,
      filter: "brightness(1) grayscale(100%)",
      transition: { duration: 2, ease: [0.76, 0, 0.24, 1] as any }
    }
  };

  return (
    <section
      id="home"
      ref={containerRef}
      className="relative min-h-screen w-full bg-charcoal-950 flex items-center overflow-hidden border-b border-white/5"
    >
      {/* Editorial layout grid lines */}
      <div className="absolute inset-0 z-0 flex justify-between px-6 md:px-12 max-w-7xl mx-auto pointer-events-none opacity-[0.03] select-none">
        <div className="magazine-grid-line w-[1px] h-full bg-white border-l border-dashed border-white" />
        <div className="magazine-grid-line w-[1px] h-full bg-white hidden md:block" />
        <div className="magazine-grid-line w-[1px] h-full bg-white hidden lg:block" />
        <div className="magazine-grid-line w-[1px] h-full bg-white hidden lg:block" />
        <div className="magazine-grid-line w-[1px] h-full bg-white" />
      </div>

      {/* Main Magazine Spread Container */}
      <div className="w-full max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center py-28 lg:py-0 relative z-20">
        
        {/* Left Column: Dominant Campaign Image (5 Columns) */}
        <div className="lg:col-span-5 flex justify-center items-center select-none">
          <motion.div
            ref={imageContainerRef}
            variants={imageMaskVariants}
            initial="hidden"
            animate="visible"
            className="magazine-image-wrap relative w-full aspect-[4/5] lg:aspect-[3/4.2] xl:aspect-[3.2/4.2] overflow-hidden bg-charcoal-900 border border-white/5 group"
          >
            {/* Grayscale high-fashion drapery model photo */}
            {mounted && (
              <motion.img
                variants={imageInnerVariants}
                src="https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1200&q=90"
                alt="Maison d'Artisanat Drapery"
                className="w-full h-full object-cover select-none pointer-events-none transition-all duration-[1200ms] cubic-bezier(0.16, 1, 0.3, 1) group-hover:scale-[1.025]"
              />
            )}
            
            {/* Overlay campaign tag */}
            <div className="absolute top-4 left-4 bg-charcoal-950/80 backdrop-blur-md px-3 py-1 border border-white/5">
              <span className="text-[8px] font-sans tracking-[0.25em] text-primary uppercase">
                AV / SAISON-01
              </span>
            </div>

            {/* Bottom-right photo details */}
            <div className="absolute bottom-4 right-4 bg-charcoal-950/80 backdrop-blur-md px-3 py-1 border border-white/5 text-right">
              <span className="text-[6px] font-sans tracking-[0.1em] text-primary-light/50 block">
                [ ATELIER SHOT ]
              </span>
              <span className="text-[6px] font-sans tracking-[0.1em] text-primary-light/50 block">
                COUTURE ET CHAOS
              </span>
            </div>
          </motion.div>
        </div>

        {/* Right Column: Editorial Typography Spread (7 Columns) */}
        <motion.div
          ref={textContainerRef}
          variants={spreadVariants}
          initial="hidden"
          animate="visible"
          className="magazine-text-wrap lg:col-span-7 flex flex-col items-start text-left select-none"
        >
          {/* Sub-label */}
          <motion.span
            variants={fadeUpVariants}
            className="text-[10px] md:text-xs font-sans tracking-[0.3em] text-primary uppercase mb-6 block"
          >
            MAISON D&apos;ARTISANAT — COUTURE ET CHAOS
          </motion.span>

          {/* Headline */}
          <h1 className="font-display font-medium text-4xl sm:text-6xl xl:text-7xl 2xl:text-8xl tracking-tight leading-[1.05] text-primary-light mb-8 max-w-2xl">
            <span className="block overflow-hidden py-1 clip-text">
              <motion.span variants={lineVariants} className="block">
                {line1}
              </motion.span>
            </span>
            <span className="block overflow-hidden italic font-serif text-3xl sm:text-5xl xl:text-6xl 2xl:text-7xl font-normal text-primary py-1 clip-text">
              <motion.span variants={lineVariants} className="block">
                {line2}
              </motion.span>
            </span>
          </h1>

          {/* Description */}
          <motion.p
            variants={fadeUpVariants}
            className="text-xs sm:text-sm text-primary-light/60 font-sans tracking-wide max-w-md mb-12 leading-relaxed"
          >
            A collective of premium streetwear and classic high-end garments. Redefining silhouettes through sculptural textures, luxury textiles, and tailored geometry.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            variants={fadeUpVariants}
            className="flex flex-col sm:flex-row gap-5 items-center w-full sm:w-auto"
          >
            <Magnetic range={30} strength={0.2}>
              <button
                onClick={() => scrollToSection("#collection")}
                className="w-full sm:w-auto px-9 py-4 border border-gold-accent bg-gold-accent text-charcoal-950 font-sans font-semibold text-[10px] tracking-[0.2em] uppercase cursor-pointer hover:bg-transparent hover:text-primary-light transition-all duration-500 relative group overflow-hidden"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  Shop Collection <ArrowRight className="w-3.5 h-3.5" />
                </span>
                <span className="absolute inset-0 bg-charcoal-950 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500 ease-out" />
              </button>
            </Magnetic>

            <Magnetic range={30} strength={0.2}>
              <button
                onClick={() => scrollToSection("#lookbook")}
                className="w-full sm:w-auto px-9 py-4 border border-white/10 hover:border-white/40 text-primary-light font-sans font-semibold text-[10px] tracking-[0.2em] uppercase cursor-pointer transition-all duration-500 relative group overflow-hidden"
              >
                <span className="relative z-10">View Lookbook</span>
                <span className="absolute inset-0 bg-white/5 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
              </button>
            </Magnetic>
          </motion.div>
        </motion.div>

      </div>

      {/* Downward Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center cursor-pointer select-none"
        onClick={() => scrollToSection("#collection")}
      >
        <span className="text-[8px] font-sans tracking-[0.25em] text-primary-light/40 uppercase mb-2">
          SCROLL DOWN
        </span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
        >
          <ChevronDown className="w-4 h-4 text-primary-light/40" />
        </motion.div>
      </motion.div>
    </section>
  );
}
