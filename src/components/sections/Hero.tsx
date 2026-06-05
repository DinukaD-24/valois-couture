"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ArrowRight, ChevronDown } from "lucide-react";
import Magnetic from "@/components/ui/Magnetic";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

interface Ripple {
  id: number;
  x: number;
  y: number;
}

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const spotlightRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mounted, setMounted] = useState(false);
  const [shopRipples, setShopRipples] = useState<Ripple[]>([]);
  const [lookbookRipples, setLookbookRipples] = useState<Ripple[]>([]);

  // Mouse coordinates motion values (-0.5 to 0.5)
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth single-spring setup for all parallax mappings (limits frame-overhead)
  const smoothX = useSpring(mouseX, { stiffness: 45, damping: 22 });
  const smoothY = useSpring(mouseY, { stiffness: 45, damping: 22 });

  // Parallax transform mapping layers
  const bgX = useTransform(smoothX, (v) => v * -35);
  const bgY = useTransform(smoothY, (v) => v * -35);

  const ringParallaxX = useTransform(smoothX, (v) => v * 80);
  const ringParallaxY = useTransform(smoothY, (v) => v * 80);

  const frameParallaxX = useTransform(smoothX, (v) => v * 50);
  const frameParallaxY = useTransform(smoothY, (v) => v * 50);

  const waveParallaxX = useTransform(smoothX, (v) => v * 110);
  const waveParallaxY = useTransform(smoothY, (v) => v * 110);

  const starParallaxX = useTransform(smoothX, (v) => v * 65);
  const starParallaxY = useTransform(smoothY, (v) => v * 65);

  const textParallaxX = useTransform(smoothX, (v) => v * 15);
  const textParallaxY = useTransform(smoothY, (v) => v * 15);

  useEffect(() => {
    setMounted(true);

    const handleMouseMove = (e: MouseEvent) => {
      const clientWidth = window.innerWidth || 1920;
      const clientHeight = window.innerHeight || 1080;
      
      const x = (e.clientX / clientWidth) - 0.5;
      const y = (e.clientY / clientHeight) - 0.5;
      
      mouseX.set(x);
      mouseY.set(y);

      // Fast, non-react repaint for the spotlight layer
      if (spotlightRef.current) {
        spotlightRef.current.style.setProperty("--mouse-x", `${e.clientX}px`);
        spotlightRef.current.style.setProperty("--mouse-y", `${e.clientY}px`);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  // Particle System Canvas (GPU-accelerated 2D loop)
  useEffect(() => {
    if (!mounted) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const particles: Array<{
      x: number;
      y: number;
      size: number;
      speedY: number;
      speedX: number;
      opacity: number;
      fadeSpeed: number;
      targetOpacity: number;
    }> = [];

    // Initialize 25 ambient particles
    for (let i = 0; i < 25; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 1.5 + 0.5,
        speedY: -(Math.random() * 0.35 + 0.08),
        speedX: (Math.random() - 0.5) * 0.12,
        opacity: Math.random(),
        fadeSpeed: Math.random() * 0.0035 + 0.001,
        targetOpacity: Math.random() * 0.45 + 0.08,
      });
    }

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      
      const mouseDrift = mouseX.get();

      particles.forEach((p) => {
        p.y += p.speedY;
        p.x += p.speedX + mouseDrift * 0.12;

        if (p.opacity < p.targetOpacity) {
          p.opacity += p.fadeSpeed;
        } else {
          p.opacity -= p.fadeSpeed;
          if (p.opacity <= 0.01) {
            p.targetOpacity = Math.random() * 0.45 + 0.08;
          }
        }

        // Recycle offscreen elements
        if (p.y < -10) {
          p.y = height + 10;
          p.x = Math.random() * width;
          p.opacity = 0;
        }
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(212, 203, 181, ${p.opacity})`;
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [mounted, mouseX]);

  // GSAP scroll animation before leaving hero
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

    // Content container fades, scales down slightly, and slides up
    tl.to(".hero-content-wrap", {
      scale: 0.96,
      opacity: 0.25,
      y: -50,
      ease: "none",
    }, 0);

    // Floating shapes drift up independently
    tl.to(".floating-shape-1", { y: -180, rotate: 100, ease: "none" }, 0);
    tl.to(".floating-shape-2", { y: -120, rotate: -20, ease: "none" }, 0);
    tl.to(".floating-shape-3", { y: -240, ease: "none" }, 0);
    tl.to(".floating-shape-4", { y: -150, rotate: 75, ease: "none" }, 0);

    // Background light blobs drift up and shrink
    tl.to(".bg-light-blob-1", { y: -90, scale: 0.8, ease: "none" }, 0);
    tl.to(".bg-light-blob-2", { y: -130, scale: 0.85, ease: "none" }, 0);
  }, { scope: containerRef });

  const scrollToSection = (id: string) => {
    const el = document.querySelector(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleShopRipple = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const newRipple = { id: Date.now(), x, y };
    setShopRipples((prev) => [...prev, newRipple]);
    setTimeout(() => {
      setShopRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
    }, 850);
  };

  const handleLookbookRipple = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const newRipple = { id: Date.now(), x, y };
    setLookbookRipples((prev) => [...prev, newRipple]);
    setTimeout(() => {
      setLookbookRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
    }, 850);
  };

  const line1 = "CRAFTED FOR THOSE";
  const line2 = "WHO REFUSE ORDINARY";
  const line1Words = line1.split(" ");
  const line2Words = line2.split(" ");

  // Animations configuration
  const subLabelVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 1.2, delay: 0.15, ease: [0.16, 1, 0.3, 1] as any }
    }
  };

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.035,
        delayChildren: 0.35,
      }
    }
  };

  const charVariants = {
    hidden: { y: "110%", opacity: 0, filter: "blur(8px)" },
    visible: {
      y: 0,
      opacity: 1,
      filter: "blur(0px)",
      transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] as any }
    }
  };

  const descVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 0.6,
      y: 0,
      transition: { duration: 1.4, delay: 0.95, ease: [0.16, 1, 0.3, 1] as any }
    }
  };

  const ctaVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 1.2, delay: 1.1, ease: [0.16, 1, 0.3, 1] as any }
    }
  };

  return (
    <section
      id="home"
      ref={containerRef}
      className="relative min-h-screen w-full flex items-center justify-center bg-charcoal-950 overflow-hidden pt-20 select-none"
    >
      {/* Layer 1: Morphing Animated Gradient Mesh */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-40">
        <div className="absolute inset-0 bg-mesh-gradient bg-[length:200%_200%]" />
      </div>

      {/* Layer 2 & 6: Ambient Light Blobs (Parallax + Floating) */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <motion.div
          style={{ x: bgX, y: bgY }}
          className="absolute inset-0 flex items-center justify-center scale-105"
        >
          <motion.div
            animate={{
              x: [0, 45, -30, 0],
              y: [0, -50, 40, 0],
              scale: [1, 1.1, 0.95, 1],
            }}
            transition={{
              duration: 22,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="bg-light-blob-1 absolute top-[15%] left-[5%] w-[42vw] h-[42vw] rounded-full bg-gold-accent/8 blur-[120px]"
          />
          <motion.div
            animate={{
              x: [0, -40, 50, 0],
              y: [0, 60, -45, 0],
              scale: [1, 0.95, 1.15, 1],
            }}
            transition={{
              duration: 26,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="bg-light-blob-2 absolute bottom-[15%] right-[5%] w-[48vw] h-[48vw] rounded-full bg-silver-accent/5 blur-[140px]"
          />
        </motion.div>
      </div>

      {/* Layer 3: Noise Texture & Vignette */}
      <div className="absolute inset-0 opacity-[0.035] mix-blend-overlay pointer-events-none z-10">
        <svg className="w-full h-full">
          <filter id="hero-grain">
            <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="4" stitchTiles="stitch" />
            <feColorMatrix type="matrix" values="0 0 0 0 0   0 0 0 0 0   0 0 0 0 0  0 0 0 0.12 0" />
            <feComposite operator="in" in2="SourceGraphic" />
          </filter>
          <rect width="100%" height="100%" filter="url(#hero-grain)" />
        </svg>
      </div>
      <div className="absolute inset-0 bg-radial-vignette pointer-events-none z-10" />

      {/* Layer 5: Canvas Particles */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-10 pointer-events-none"
      />

      {/* Layer 7: Interactive Spotlight */}
      <div
        ref={spotlightRef}
        className="absolute inset-0 pointer-events-none z-10 mix-blend-screen opacity-70"
        style={{
          background: "radial-gradient(circle 450px at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(197, 168, 128, 0.07) 0%, transparent 100%)"
        }}
      />

      {/* Layer 4 & 6: Floating Editorial Objects (Parallax) */}
      {mounted && (
        <div className="absolute inset-0 z-15 pointer-events-none overflow-hidden hidden md:block">
          {/* Shape 1: Celestial Ring Compass */}
          <motion.div
            style={{ x: ringParallaxX, y: ringParallaxY }}
            className="floating-shape-1 absolute top-[22%] left-[10%] w-24 h-24 lg:w-32 lg:h-32 pointer-events-auto cursor-pointer"
          >
            <motion.div
              animate={{
                y: [0, -10, 0],
                rotate: 360,
              }}
              transition={{
                y: { duration: 6, repeat: Infinity, ease: "easeInOut" },
                rotate: { duration: 40, repeat: Infinity, ease: "linear" },
              }}
              whileHover={{ scale: 1.15, strokeOpacity: 0.6 }}
              className="w-full h-full"
            >
              <svg viewBox="0 0 100 100" className="w-full h-full text-gold-accent/25 fill-none stroke-current stroke-[0.75]">
                <circle cx="50" cy="50" r="44" />
                <circle cx="50" cy="50" r="37" strokeDasharray="3 3" />
                <circle cx="50" cy="50" r="9" strokeWidth="0.5" />
                <line x1="50" y1="5" x2="50" y2="13" />
                <line x1="50" y1="87" x2="50" y2="95" />
                <line x1="5" y1="50" x2="13" y2="50" />
                <line x1="87" y1="50" x2="95" y2="50" />
              </svg>
            </motion.div>
          </motion.div>

          {/* Shape 2: Editorial Frame */}
          <motion.div
            style={{ x: frameParallaxX, y: frameParallaxY }}
            className="floating-shape-2 absolute top-[28%] right-[12%] w-36 h-24 lg:w-44 lg:h-28 pointer-events-auto cursor-pointer"
          >
            <motion.div
              animate={{
                y: [0, 8, 0],
                rotate: [0, -2, 0],
              }}
              transition={{
                y: { duration: 7, repeat: Infinity, ease: "easeInOut" },
                rotate: { duration: 12, repeat: Infinity, ease: "easeInOut" },
              }}
              whileHover={{ scale: 1.08 }}
              className="w-full h-full border border-primary/20 p-2 flex flex-col justify-between bg-charcoal-950/20 backdrop-blur-[1px]"
            >
              <div className="flex justify-between text-[6px] font-sans tracking-[0.2em] text-primary/40 uppercase">
                <span>AV-ALT</span>
                <span>EST. 2026</span>
              </div>
              <div className="w-full h-[0.5px] bg-primary/10" />
              <div className="flex-grow flex items-center justify-center">
                <span className="text-[9px] font-serif italic text-gold-accent/40 tracking-wider">Couture</span>
              </div>
              <div className="flex justify-between text-[5px] font-sans tracking-[0.1em] text-primary/30">
                <span>[ LAT. 48.8566° N ]</span>
                <span>[ LON. 2.3522° E ]</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Shape 3: Organic Fabric Contour Curve */}
          <motion.div
            style={{ x: waveParallaxX, y: waveParallaxY }}
            className="floating-shape-3 absolute bottom-[24%] left-[8%] w-48 h-20 lg:w-64 lg:h-24 pointer-events-auto cursor-pointer"
          >
            <motion.div
              animate={{
                y: [0, -12, 0],
                skewX: [0, 4, 0],
              }}
              transition={{
                y: { duration: 8, repeat: Infinity, ease: "easeInOut" },
                skewX: { duration: 15, repeat: Infinity, ease: "easeInOut" },
              }}
              whileHover={{ scale: 1.05 }}
              className="w-full h-full"
            >
              <svg viewBox="0 0 200 100" className="w-full h-full text-primary/15 fill-none stroke-current stroke-[0.75]">
                <path d="M 0 50 C 50 15, 150 85, 200 50" />
                <path d="M 0 40 C 50 5, 150 75, 200 40" opacity="0.8" />
                <path d="M 0 60 C 50 25, 150 95, 200 60" opacity="0.6" />
                <path d="M 0 30 C 50 -5, 150 65, 200 30" opacity="0.4" />
                <path d="M 0 70 C 50 35, 150 105, 200 70" opacity="0.2" />
              </svg>
            </motion.div>
          </motion.div>

          {/* Shape 4: Minimal Star Glyph */}
          <motion.div
            style={{ x: starParallaxX, y: starParallaxY }}
            className="floating-shape-4 absolute bottom-[28%] right-[16%] w-14 h-14 lg:w-18 lg:h-18 pointer-events-auto cursor-pointer"
          >
            <motion.div
              animate={{
                y: [0, 10, 0],
                rotate: -360,
                opacity: [0.3, 0.7, 0.3],
              }}
              transition={{
                y: { duration: 5, repeat: Infinity, ease: "easeInOut" },
                rotate: { duration: 32, repeat: Infinity, ease: "linear" },
                opacity: { duration: 4, repeat: Infinity, ease: "easeInOut" },
              }}
              whileHover={{ scale: 1.2, strokeWidth: 1.5 }}
              className="w-full h-full"
            >
              <svg viewBox="0 0 100 100" className="w-full h-full text-gold-accent/30 fill-none stroke-current stroke-[0.75]">
                <path d="M 50 10 L 53 45 L 88 48 L 53 51 L 50 86 L 47 51 L 12 48 L 47 45 Z" />
                <circle cx="50" cy="48" r="4.5" className="fill-gold-accent/20 stroke-none" />
              </svg>
            </motion.div>
          </motion.div>
        </div>
      )}

      {/* Content Container (Parallax & GSAP-bound) */}
      <motion.div
        style={{ x: textParallaxX, y: textParallaxY }}
        className="hero-content-wrap max-w-7xl mx-auto px-6 md:px-12 relative z-20 text-center flex flex-col items-center"
      >
        {/* Sub-label */}
        <motion.span
          variants={subLabelVariants}
          initial="hidden"
          animate="visible"
          className="text-[10px] md:text-xs font-sans tracking-[0.3em] text-primary uppercase mb-6 block"
        >
          MAISON D&apos;ARTISANAT — COUTURE ET CHAOS
        </motion.span>

        {/* Headline with Character-by-character slide-reveal */}
        <motion.h1
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="font-display font-medium text-4xl sm:text-6xl md:text-8xl tracking-tight leading-[1.05] text-primary-light mb-8 max-w-5xl"
        >
          <span className="block overflow-hidden py-1 clip-text">
            <span className="inline-block">
              {line1Words.map((word, wordIndex) => (
                <span key={wordIndex} className="inline-block whitespace-nowrap mr-[0.25em] overflow-hidden clip-text">
                  {word.split("").map((char, charIndex) => (
                    <motion.span
                      key={charIndex}
                      variants={charVariants}
                      className="inline-block"
                    >
                      {char}
                    </motion.span>
                  ))}
                </span>
              ))}
            </span>
          </span>
          <span className="block overflow-hidden italic font-serif text-3xl sm:text-5xl md:text-7xl font-normal text-primary py-1 clip-text">
            <span className="inline-block">
              {line2Words.map((word, wordIndex) => (
                <span key={wordIndex} className="inline-block whitespace-nowrap mr-[0.25em] overflow-hidden clip-text">
                  {word.split("").map((char, charIndex) => (
                    <motion.span
                      key={charIndex}
                      variants={charVariants}
                      className="inline-block"
                    >
                      {char}
                    </motion.span>
                  ))}
                </span>
              ))}
            </span>
          </span>
        </motion.h1>

        {/* Description */}
        <motion.p
          variants={descVariants}
          initial="hidden"
          animate="visible"
          className="text-xs sm:text-sm md:text-base text-primary-light/60 font-sans tracking-wide max-w-xl mb-12 leading-relaxed"
        >
          A collective of premium streetwear and classic high-end garments. Redefining silhouettes through sculptural textures, luxury textiles, and tailored geometry.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          variants={ctaVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col sm:flex-row gap-6 justify-center items-center w-full sm:w-auto"
        >
          {/* Shop Collection Button */}
          <Magnetic range={40} strength={0.25}>
            <button
              onClick={(e) => {
                handleShopRipple(e);
                setTimeout(() => scrollToSection("#collection"), 350);
              }}
              className="w-full sm:w-auto px-9 py-4.5 border border-gold-accent bg-gold-accent text-charcoal-950 font-sans font-semibold text-[10px] tracking-[0.22em] uppercase cursor-pointer hover:bg-transparent hover:text-primary-light transition-all duration-500 relative group overflow-hidden shadow-[0_0_0_0_rgba(197,168,128,0)] hover:shadow-[0_0_30px_rgba(197,168,128,0.25)] scale-100 hover:scale-[1.03] active:scale-[0.98]"
            >
              {/* Custom click ripple canvas spans */}
              {shopRipples.map((ripple) => (
                <span
                  key={ripple.id}
                  className="absolute bg-white/20 rounded-full pointer-events-none animate-ripple"
                  style={{
                    left: ripple.x,
                    top: ripple.y,
                    width: 80,
                    height: 80,
                    transform: "translate(-50%, -50%) scale(0)",
                  }}
                />
              ))}
              
              {/* Diagonal shine sweep */}
              <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-1000 ease-out" />
              
              <span className="relative z-10 flex items-center justify-center gap-2">
                Shop Collection <ArrowRight className="w-3.5 h-3.5" />
              </span>
              <span className="absolute inset-0 bg-charcoal-950 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500 ease-out" />
              
              {/* Dynamic outline tracer */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <rect
                  className="w-full h-full fill-none stroke-gold-accent stroke-1"
                  style={{
                    strokeDasharray: "250 400",
                    animation: "borderTrace 2s linear infinite",
                  }}
                />
              </svg>
            </button>
          </Magnetic>

          {/* View Lookbook Button */}
          <Magnetic range={40} strength={0.25}>
            <button
              onClick={(e) => {
                handleLookbookRipple(e);
                setTimeout(() => scrollToSection("#lookbook"), 350);
              }}
              className="w-full sm:w-auto px-9 py-4.5 border border-white/10 hover:border-white/40 text-primary-light font-sans font-semibold text-[10px] tracking-[0.22em] uppercase cursor-pointer transition-all duration-500 relative group overflow-hidden hover:bg-white/5 shadow-[0_0_0_0_rgba(255,255,255,0)] hover:shadow-[0_0_20px_rgba(255,255,255,0.06)] scale-100 hover:scale-[1.03] active:scale-[0.98]"
            >
              {/* Custom click ripple canvas spans */}
              {lookbookRipples.map((ripple) => (
                <span
                  key={ripple.id}
                  className="absolute bg-white/15 rounded-full pointer-events-none animate-ripple"
                  style={{
                    left: ripple.x,
                    top: ripple.y,
                    width: 80,
                    height: 80,
                    transform: "translate(-50%, -50%) scale(0)",
                  }}
                />
              ))}

              {/* Diagonal shine sweep */}
              <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full bg-gradient-to-r from-transparent via-white/15 to-transparent transition-transform duration-1000 ease-out" />

              <span className="relative z-10">View Lookbook</span>
              <span className="absolute inset-0 bg-white/5 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />

              {/* Dynamic outline tracer */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <rect
                  className="w-full h-full fill-none stroke-white stroke-1"
                  style={{
                    strokeDasharray: "250 400",
                    animation: "borderTrace 2.5s linear infinite",
                  }}
                />
              </svg>
            </button>
          </Magnetic>
        </motion.div>
      </motion.div>

      {/* Downward Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center cursor-pointer"
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

      {/* Style injection for local keyframe sequences */}
      <style dangerouslySetInnerHTML={{ __html: `
        /* Animated gradient mesh background */
        @keyframes meshMorph {
          0% { background-position: 0% 0%; }
          50% { background-position: 100% 100%; }
          100% { background-position: 0% 100%; }
        }
        .bg-mesh-gradient {
          background-image: 
            radial-gradient(at 10% 20%, rgba(197, 168, 128, 0.08) 0px, transparent 55%),
            radial-gradient(at 90% 10%, rgba(209, 209, 214, 0.06) 0px, transparent 55%),
            radial-gradient(at 50% 80%, rgba(140, 122, 91, 0.07) 0px, transparent 55%),
            radial-gradient(at 80% 90%, rgba(197, 168, 128, 0.05) 0px, transparent 45%);
          animation: meshMorph 30s ease infinite alternate;
        }

        /* Vignette overlay */
        .bg-radial-vignette {
          background: radial-gradient(circle, transparent 20%, rgba(10, 10, 10, 0.4) 60%, rgba(10, 10, 10, 0.85) 100%);
        }

        /* Click feedback ripple */
        @keyframes ripple {
          to {
            transform: translate(-50%, -50%) scale(4.5);
            opacity: 0;
          }
        }
        .animate-ripple {
          animation: ripple 0.85s cubic-bezier(0.1, 0.8, 0.3, 1) forwards;
        }

        /* Continuous border path tracing */
        @keyframes borderTrace {
          0% { stroke-dashoffset: 0; }
          100% { stroke-dashoffset: -650; }
        }
      `}} />
    </section>
  );
}
