"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from "framer-motion";
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
  const [isIntroActive, setIsIntroActive] = useState(true);
  const [shopRipples, setShopRipples] = useState<Ripple[]>([]);
  const [lookbookRipples, setLookbookRipples] = useState<Ripple[]>([]);

  // Mouse coordinates motion values (-0.5 to 0.5)
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth single-spring setup for all parallax mappings (limits frame-overhead)
  const smoothX = useSpring(mouseX, { stiffness: 40, damping: 20 });
  const smoothY = useSpring(mouseY, { stiffness: 40, damping: 20 });

  // Parallax transform mapping layers
  const bgX = useTransform(smoothX, (v) => v * -30);
  const bgY = useTransform(smoothY, (v) => v * -30);

  // 3D perspective card rotation transforms for visual centerpiece
  const cardRotateX = useTransform(smoothY, (v) => v * 24);
  const cardRotateY = useTransform(smoothX, (v) => v * -24);

  const cardInnerX = useTransform(smoothX, (v) => v * -18);
  const cardInnerY = useTransform(smoothY, (v) => v * -18);

  const ringParallaxX = useTransform(smoothX, (v) => v * 70);
  const ringParallaxY = useTransform(smoothY, (v) => v * 70);

  const gridParallaxX = useTransform(smoothX, (v) => v * 40);
  const gridParallaxY = useTransform(smoothY, (v) => v * 40);

  const waveParallaxX = useTransform(smoothX, (v) => v * 90);
  const waveParallaxY = useTransform(smoothY, (v) => v * 90);

  const textParallaxX = useTransform(smoothX, (v) => v * 12);
  const textParallaxY = useTransform(smoothY, (v) => v * 12);

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

  // Handle Loading Intro Curtain Duration
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsIntroActive(false);
    }, 1400);
    return () => clearTimeout(timer);
  }, []);

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

  // GSAP scroll animation before leaving hero (WOW Split Transformation)
  useGSAP(() => {
    const container = containerRef.current;
    if (!container) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: "top top",
        end: "bottom top",
        scrub: 1.2,
        invalidateOnRefresh: true,
      }
    });

    // Headline elements fly apart laterally!
    tl.to(".hero-line-1", { x: -250, opacity: 0.1, scale: 0.95, ease: "power2.inOut" }, 0);
    tl.to(".hero-line-2", { x: 250, opacity: 0.1, scale: 0.95, ease: "power2.inOut" }, 0);

    // Centerpiece card tilts backwards, scales down, and drifts out
    tl.to(".hero-centerpiece", {
      scale: 0.82,
      opacity: 0.12,
      rotateX: 35,
      rotateY: -20,
      y: 90,
      ease: "power2.inOut",
    }, 0);

    // Large floating shapes fly upward at different rates
    tl.to(".giant-ring", { y: -240, rotate: 180, scale: 0.8, ease: "power1.inOut" }, 0);
    tl.to(".editorial-wave", { y: -280, scaleX: 1.15, ease: "power1.inOut" }, 0);
    tl.to(".hero-desc-group", { y: -60, opacity: 0, ease: "power1.inOut" }, 0);
    tl.to(".bg-light-blob-1", { y: -100, scale: 0.75, ease: "none" }, 0);
    tl.to(".bg-light-blob-2", { y: -150, scale: 0.8, ease: "none" }, 0);
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
    hidden: { 
      y: "125%", 
      opacity: 0, 
      rotateZ: 6,
      filter: "blur(12px)" 
    },
    visible: {
      y: 0,
      opacity: 1,
      rotateZ: 0,
      filter: "blur(0px)",
      transition: { duration: 1.3, ease: [0.16, 1, 0.3, 1] as any }
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
      className="relative min-h-screen w-full flex items-center justify-center bg-charcoal-950 overflow-hidden pt-24 lg:pt-0 pb-12 lg:pb-0 select-none"
    >
      {/* Dynamic Intro Sequence Split-Curtain */}
      <AnimatePresence>
        {isIntroActive && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="fixed inset-0 z-[9999] flex flex-col pointer-events-none"
          >
            <motion.div
              initial={{ y: 0 }}
              animate={{ y: "-100%" }}
              transition={{ duration: 1.1, ease: [0.76, 0, 0.24, 1], delay: 0.2 }}
              className="w-full h-1/2 bg-charcoal-900 flex items-end justify-center pb-8"
            >
              <span className="font-display font-medium text-[10px] tracking-[0.45em] text-gold-accent uppercase">
                ATELIER VALOIS
              </span>
            </motion.div>
            <motion.div
              initial={{ y: 0 }}
              animate={{ y: "100%" }}
              transition={{ duration: 1.1, ease: [0.76, 0, 0.24, 1], delay: 0.2 }}
              className="w-full h-1/2 bg-charcoal-950 flex items-start justify-center pt-8 border-t border-white/5"
            >
              <span className="font-serif italic text-xs tracking-[0.25em] text-primary-light/50">
                COUTURE ET CHAOS
              </span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Layer 1: Morphing Animated Gradient Mesh */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-45">
        <div className="absolute inset-0 bg-mesh-gradient bg-[length:200%_200%]" />
      </div>

      {/* Layer 2: Ambient Gradient Blobs */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <motion.div
          style={{ x: bgX, y: bgY }}
          className="absolute inset-0 flex items-center justify-center scale-105"
        >
          <motion.div
            animate={{
              x: [0, 50, -40, 0],
              y: [0, -60, 45, 0],
              scale: [1, 1.15, 0.9, 1],
            }}
            transition={{
              duration: 24,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="bg-light-blob-1 absolute top-[10%] left-[5%] w-[45vw] h-[45vw] rounded-full bg-gold-accent/8 blur-[130px]"
          />
          <motion.div
            animate={{
              x: [0, -50, 60, 0],
              y: [0, 50, -50, 0],
              scale: [1, 0.95, 1.2, 1],
            }}
            transition={{
              duration: 28,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="bg-light-blob-2 absolute bottom-[10%] right-[5%] w-[50vw] h-[50vw] rounded-full bg-silver-accent/5 blur-[150px]"
          />
        </motion.div>
      </div>

      {/* Layer 3: Noise Texture & Vignette */}
      <div className="absolute inset-0 opacity-[0.035] mix-blend-overlay pointer-events-none z-10">
        <svg className="w-full h-full">
          <filter id="hero-grain-v2">
            <feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves="4" stitchTiles="stitch" />
            <feColorMatrix type="matrix" values="0 0 0 0 0   0 0 0 0 0   0 0 0 0 0  0 0 0 0.12 0" />
            <feComposite operator="in" in2="SourceGraphic" />
          </filter>
          <rect width="100%" height="100%" filter="url(#hero-grain-v2)" />
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
          background: "radial-gradient(circle 500px at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(197, 168, 128, 0.08) 0%, transparent 100%)"
        }}
      />

      {/* Giant Background Objects behind center visual */}
      {mounted && (
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden hidden lg:block">
          {/* Giant Orbit Ring */}
          <motion.div
            style={{ x: ringParallaxX, y: ringParallaxY }}
            className="giant-ring absolute top-[10%] right-[-10%] w-[35rem] h-[35rem]"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
              className="w-full h-full"
            >
              <svg viewBox="0 0 100 100" className="w-full h-full text-gold-accent/10 fill-none stroke-current stroke-[0.4]">
                <circle cx="50" cy="50" r="48" />
                <circle cx="50" cy="50" r="44" strokeDasharray="3 3" />
                <circle cx="50" cy="50" r="22" strokeWidth="0.2" />
                <line x1="50" y1="2" x2="50" y2="98" strokeDasharray="1 1" />
                <line x1="2" y1="50" x2="98" y2="50" strokeDasharray="1 1" />
              </svg>
            </motion.div>
          </motion.div>

          {/* Large Fabric Wave Curves */}
          <motion.div
            style={{ x: waveParallaxX, y: waveParallaxY }}
            className="editorial-wave absolute bottom-[-5%] left-[-5%] w-[45rem] h-[18rem]"
          >
            <motion.div
              animate={{ y: [0, -15, 0], skewX: [0, 5, 0] }}
              transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
              className="w-full h-full"
            >
              <svg viewBox="0 0 400 150" className="w-full h-full text-primary/8 fill-none stroke-current stroke-[0.5]">
                <path d="M -50 80 C 120 10, 280 140, 450 80" />
                <path d="M -50 60 C 120 -10, 280 120, 450 60" opacity="0.8" />
                <path d="M -50 100 C 120 30, 280 160, 450 100" opacity="0.5" />
                <path d="M -50 40 C 120 -30, 280 100, 450 40" opacity="0.3" />
              </svg>
            </motion.div>
          </motion.div>

          {/* Floating Editorial dots grid panel */}
          <motion.div
            style={{ x: gridParallaxX, y: gridParallaxY }}
            className="absolute top-[20%] left-[5%] w-48 h-48 opacity-20"
          >
            <svg viewBox="0 0 100 100" className="w-full h-full text-primary-light fill-current">
              <circle cx="10" cy="10" r="1" />
              <circle cx="30" cy="10" r="1" />
              <circle cx="50" cy="10" r="1" />
              <circle cx="70" cy="10" r="1" />
              <circle cx="90" cy="10" r="1" />
              <circle cx="10" cy="30" r="1" />
              <circle cx="30" cy="30" r="1" />
              <circle cx="50" cy="30" r="1" />
              <circle cx="70" cy="30" r="1" />
              <circle cx="90" cy="30" r="1" />
              <circle cx="10" cy="50" r="1" />
              <circle cx="30" cy="50" r="1" />
              <circle cx="50" cy="50" r="1" />
              <circle cx="70" cy="50" r="1" />
              <circle cx="90" cy="50" r="1" />
              <circle cx="10" cy="70" r="1" />
              <circle cx="30" cy="70" r="1" />
              <circle cx="50" cy="70" r="1" />
              <circle cx="70" cy="70" r="1" />
              <circle cx="90" cy="70" r="1" />
              <circle cx="10" cy="90" r="1" />
              <circle cx="30" cy="90" r="1" />
              <circle cx="50" cy="90" r="1" />
              <circle cx="70" cy="90" r="1" />
              <circle cx="90" cy="90" r="1" />
            </svg>
          </motion.div>
        </div>
      )}

      {/* Asymmetrical Editorial Grid Layout Container */}
      <div className="w-full max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center relative z-20">
        
        {/* Left Side: Overlapping Headline & Description (Parallax) */}
        <motion.div
          style={{ x: textParallaxX, y: textParallaxY }}
          className="lg:col-span-8 flex flex-col items-start text-left relative z-30"
        >
          {/* Sub-label */}
          <motion.span
            variants={subLabelVariants}
            initial="hidden"
            animate="visible"
            className="text-[10px] md:text-xs font-sans tracking-[0.35em] text-primary uppercase mb-8 block relative overflow-hidden"
          >
            MAISON D&apos;ARTISANAT — COUTURE ET CHAOS
          </motion.span>

          {/* Headline: Oversized editorial typography */}
          <motion.h1
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="font-display font-medium text-5xl sm:text-7xl md:text-8xl xl:text-[9rem] 2xl:text-[10.5rem] tracking-tighter leading-[0.9] text-primary-light mb-8 max-w-7xl"
          >
            {/* Line 1: Structured Streetwear Title */}
            <span className="hero-line-1 block overflow-hidden py-2 clip-text">
              <span className="inline-block">
                {line1Words.map((word, wordIndex) => (
                  <span key={wordIndex} className="inline-block whitespace-nowrap mr-[0.22em] overflow-hidden clip-text">
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
            
            {/* Line 2: Editorial Serif overlap */}
            <span className="hero-line-2 block overflow-hidden italic font-serif text-4xl sm:text-6xl md:text-7xl xl:text-[8rem] 2xl:text-[9.5rem] font-normal text-primary py-2 clip-text lg:-mt-2">
              <span className="inline-block">
                {line2Words.map((word, wordIndex) => (
                  <span key={wordIndex} className="inline-block whitespace-nowrap mr-[0.22em] overflow-hidden clip-text">
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

          {/* Description & CTAs aligned bottom left */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="hero-desc-group flex flex-col items-start max-w-xl"
          >
            {/* Description */}
            <motion.p
              variants={descVariants}
              className="text-xs sm:text-sm text-primary-light/65 font-sans tracking-wide mb-10 leading-relaxed max-w-md"
            >
              A collective of premium streetwear and classic high-end garments. Redefining silhouettes through sculptural textures, luxury textiles, and tailored geometry.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              variants={ctaVariants}
              className="flex flex-col sm:flex-row gap-5 items-center w-full sm:w-auto"
            >
              {/* Shop Collection Button */}
              <Magnetic range={35} strength={0.25}>
                <button
                  onClick={(e) => {
                    handleShopRipple(e);
                    setTimeout(() => scrollToSection("#collection"), 350);
                  }}
                  className="w-full sm:w-auto px-9 py-4.5 border border-gold-accent bg-gold-accent text-charcoal-950 font-sans font-semibold text-[10px] tracking-[0.22em] uppercase cursor-pointer hover:bg-transparent hover:text-primary-light transition-all duration-500 relative group overflow-hidden shadow-[0_0_0_0_rgba(197,168,128,0)] hover:shadow-[0_0_30px_rgba(197,168,128,0.3)] scale-100 hover:scale-[1.03] active:scale-[0.98]"
                >
                  {/* Ripples */}
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
                  
                  <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-1000 ease-out" />
                  
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    Shop Collection <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                  <span className="absolute inset-0 bg-charcoal-950 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500 ease-out" />
                  
                  {/* Trace */}
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
              <Magnetic range={35} strength={0.25}>
                <button
                  onClick={(e) => {
                    handleLookbookRipple(e);
                    setTimeout(() => scrollToSection("#lookbook"), 350);
                  }}
                  className="w-full sm:w-auto px-9 py-4.5 border border-white/10 hover:border-white/40 text-primary-light font-sans font-semibold text-[10px] tracking-[0.22em] uppercase cursor-pointer transition-all duration-500 relative group overflow-hidden hover:bg-white/5 shadow-[0_0_0_0_rgba(255,255,255,0)] hover:shadow-[0_0_20px_rgba(255,255,255,0.06)] scale-100 hover:scale-[1.03] active:scale-[0.98]"
                >
                  {/* Ripples */}
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

                  <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full bg-gradient-to-r from-transparent via-white/15 to-transparent transition-transform duration-1000 ease-out" />

                  <span className="relative z-10">View Lookbook</span>
                  <span className="absolute inset-0 bg-white/5 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />

                  {/* Trace */}
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
        </motion.div>

        {/* Right Side: 3D interactive tilting visual centerpiece */}
        <div className="lg:col-span-4 flex justify-center items-center relative z-20">
          <div className="absolute inset-0 bg-[radial-gradient(circle_300px_at_center,rgba(197,168,128,0.08),transparent)] blur-xl pointer-events-none z-0" />
          
          {/* 3D perspective tilt container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 80, rotateY: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0, rotateY: 0 }}
            transition={{ duration: 1.6, delay: 0.65, ease: [0.16, 1, 0.3, 1] as any }}
            style={{ 
              rotateX: cardRotateX, 
              rotateY: cardRotateY, 
              transformStyle: "preserve-3d",
              perspective: 1200
            }}
            className="hero-centerpiece relative w-[75vw] sm:w-[50vw] md:w-[40vw] lg:w-[22vw] aspect-[3/4.2] bg-charcoal-900 border border-white/10 p-3 shadow-2xl flex flex-col justify-between group pointer-events-auto cursor-pointer"
          >
            {/* Gold highlight corners */}
            <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-gold-accent" />
            <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-gold-accent" />
            <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-gold-accent" />
            <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-gold-accent" />

            {/* Inner collage elements: grayscale high-fashion campaign photo */}
            <div className="w-full h-[88%] bg-charcoal-950 overflow-hidden relative" style={{ transformStyle: "preserve-3d" }}>
              <motion.div
                style={{ 
                  x: cardInnerX, 
                  y: cardInnerY,
                  transform: "translateZ(30px)" 
                }}
                className="w-full h-full absolute inset-0 pointer-events-none scale-110"
              >
                <img
                  src="https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1000&q=80"
                  alt="Atelier Valois Campaign model"
                  className="w-full h-full object-cover grayscale brightness-90 group-hover:scale-[1.08] group-hover:brightness-100 transition-all duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950 via-transparent to-transparent opacity-65" />
              </motion.div>

              {/* Holographic overlay text */}
              <div 
                className="absolute bottom-4 left-4 z-10 flex flex-col text-left pointer-events-none"
                style={{ transform: "translateZ(45px)" }}
              >
                <span className="text-[7px] font-sans tracking-[0.3em] text-gold-accent uppercase font-bold">
                  Saison-01
                </span>
                <span className="text-[11px] font-display tracking-widest text-primary-light uppercase mt-0.5">
                  L&apos;ATELIER
                </span>
              </div>
              
              <div 
                className="absolute top-4 right-4 z-10 bg-charcoal-950/75 backdrop-blur-md px-2 py-0.5 border border-white/5 pointer-events-none"
                style={{ transform: "translateZ(40px)" }}
              >
                <span className="text-[6px] font-sans tracking-[0.2em] text-primary-light/60">
                  REF. 08269
                </span>
              </div>
            </div>

            {/* Bottom details inside the centerpiece card */}
            <div className="pt-2.5 flex justify-between items-center text-[7px] font-sans tracking-[0.2em] text-primary/45 uppercase">
              <span>Collection Campagne</span>
              <span className="font-serif italic font-semibold text-gold-accent/70">Valois</span>
            </div>
          </motion.div>
        </div>
      </div>

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
        @keyframes meshMorphV2 {
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
          animation: meshMorphV2 30s ease infinite alternate;
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
