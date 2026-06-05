"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Quote } from "lucide-react";

const testimonials = [
  {
    id: 1,
    quote: "Atelier Valois represents the absolute finest integration of street-level attitude and high-end couture craftsmanship. An aesthetic triumph.",
    author: "VOGUE EDITORIAL",
    role: "Lead Fashion Critic",
  },
  {
    id: 2,
    quote: "The Léon Coat is a masterpiece. The tactile weight, raw seams, and sculptural drape make it a permanent addition to modern menswear blueprints.",
    author: "GQ MAGAZINE",
    role: "Senior Style Editor",
  },
  {
    id: 3,
    quote: "In an era of mass-produced fast fashion templates, Valois is a breath of fresh air. Exquisite, modular, and uncompromisingly exclusive.",
    author: "HIGHNOBIETY",
    role: "Creative Director",
  },
  {
    id: 4,
    quote: "A design language that bridges extreme luxury and utility. The raw canvas textures and structural silhouettes set a brand new premium benchmark.",
    author: "HYPEBEAST",
    role: "Editorial Director",
  },
];

export default function Testimonials() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(0); // -1 for left, 1 for right
  const [isHovered, setIsHovered] = useState(false);
  const autoPlayTimer = useRef<NodeJS.Timeout | null>(null);

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 100 : -100,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (dir: number) => ({
      x: dir < 0 ? 100 : -100,
      opacity: 0,
    }),
  };

  const handleNext = () => {
    setDirection(1);
    setActiveIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  const handlePrev = () => {
    setDirection(-1);
    setActiveIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  useEffect(() => {
    if (isHovered) {
      if (autoPlayTimer.current) clearInterval(autoPlayTimer.current);
      return;
    }

    autoPlayTimer.current = setInterval(() => {
      handleNext();
    }, 5000);

    return () => {
      if (autoPlayTimer.current) clearInterval(autoPlayTimer.current);
    };
  }, [isHovered, activeIndex]);

  return (
    <section className="py-32 bg-charcoal-900 border-t border-white/5 relative overflow-hidden">
      {/* Decorative Blur Circles */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-gold-accent/5 blur-[120px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
        <span className="text-[10px] tracking-[0.3em] text-primary uppercase mb-6 block">
          PRESS & CRITICS
        </span>

        {/* Carousel Container */}
        <div
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="relative min-h-[300px] sm:min-h-[260px] flex flex-col justify-center items-center px-4 sm:px-12 py-8 glass border border-white/5 bg-charcoal-950/40"
        >
          <Quote className="w-8 h-8 text-primary/30 mb-8" />

          <div className="w-full relative overflow-hidden flex justify-center items-center">
            <AnimatePresence initial={false} custom={direction} mode="wait">
              <motion.div
                key={activeIndex}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="w-full"
              >
                <blockquote className="font-serif italic text-lg sm:text-2xl text-primary-light tracking-wide leading-relaxed mb-8 select-none">
                  "{testimonials[activeIndex].quote}"
                </blockquote>
                
                <div>
                  <cite className="font-display font-medium text-xs tracking-[0.2em] text-gold-accent not-italic uppercase block mb-1">
                    {testimonials[activeIndex].author}
                  </cite>
                  <span className="text-[9px] font-sans tracking-widest text-primary-light/40 uppercase">
                    {testimonials[activeIndex].role}
                  </span>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation Controls */}
          <div className="flex gap-4 mt-8">
            <button
              onClick={handlePrev}
              className="w-10 h-10 border border-white/5 hover:border-gold-accent hover:text-gold-accent flex items-center justify-center text-primary-light/50 transition-colors focus:outline-none"
              aria-label="Previous Testimonial"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNext}
              className="w-10 h-10 border border-white/5 hover:border-gold-accent hover:text-gold-accent flex items-center justify-center text-primary-light/50 transition-colors focus:outline-none"
              aria-label="Next Testimonial"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Carousel indicators */}
        <div className="flex justify-center gap-2 mt-8">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setDirection(index > activeIndex ? 1 : -1);
                setActiveIndex(index);
              }}
              className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                activeIndex === index ? "bg-gold-accent w-4" : "bg-white/10"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
