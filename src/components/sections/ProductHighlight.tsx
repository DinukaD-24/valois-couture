"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RotateCw, Cpu, Sparkles, Layers } from "lucide-react";

const angles = [
  {
    deg: 0,
    label: "FRONT",
    img: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=800&q=80",
  },
  {
    deg: 90,
    label: "DETAIL",
    img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80",
  },
  {
    deg: 180,
    label: "BACK",
    img: "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=800&q=80",
  },
  {
    deg: 270,
    label: "TEXTURE",
    img: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=800&q=80",
  },
];

const specs = [
  { icon: Layers, name: "Material", val: "100% Raw Merino Wool" },
  { icon: Sparkles, name: "Buttons", val: "Hand-carved Buffalo Horn" },
  { icon: Cpu, name: "Detailing", val: "Deconstructed frayed margins" },
];

export default function ProductHighlight() {
  const [currentAngle, setCurrentAngle] = useState(0); // index 0, 1, 2, 3
  const [isDragging, setIsDragging] = useState(false);
  const dragStartX = useRef(0);
  const dragThreshold = 40; // drag 40px to rotate — more responsive than 60

  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    dragStartX.current = e.clientX;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    const diffX = e.clientX - dragStartX.current;

    if (Math.abs(diffX) > dragThreshold) {
      if (diffX > 0) {
        // Rotate left
        setCurrentAngle((prev) => (prev === 0 ? angles.length - 1 : prev - 1));
      } else {
        // Rotate right
        setCurrentAngle((prev) => (prev === angles.length - 1 ? 0 : prev + 1));
      }
      dragStartX.current = e.clientX; // reset start
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    setIsDragging(false);
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);
  };

  return (
    <section className="py-32 bg-charcoal-950 border-t border-white/5 relative">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Product Info & Specifications */}
          <div className="lg:col-span-5 order-2 lg:order-1">
            <span className="text-[10px] tracking-[0.3em] text-primary uppercase mb-2 block">
              ATELIER SHIELD
            </span>
            <h2 className="font-display font-medium text-4xl sm:text-5xl text-primary-light tracking-tight mb-4">
              LÉON COAT
            </h2>
            <div className="flex items-baseline gap-4 mb-6">
              <span className="font-serif italic text-2xl text-gold-accent">$1,850 USD</span>
              <span className="text-[10px] font-sans tracking-widest text-emerald-500 bg-emerald-500/10 px-2 py-0.5 uppercase border border-emerald-500/20">
                MADE TO ORDER
              </span>
            </div>

            <p className="font-sans text-xs text-primary-light/60 tracking-wide leading-relaxed mb-8 max-w-md">
              A bespoke, heavy structural trench sculpted with organic fibers. Featuring a double-layered front collar and hand-finished raw thread borders, tailored specifically to order.
            </p>

            {/* Specifications Cards */}
            <div className="flex flex-col space-y-4 mb-10">
              {specs.map((spec, i) => {
                const Icon = spec.icon;
                return (
                  <div
                    key={i}
                    className="flex items-center p-4 border border-white/5 bg-charcoal-900/50 relative overflow-hidden group"
                  >
                    <div className="absolute inset-0 bg-white/[0.01] translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                    <Icon className="w-4 h-4 text-primary mr-4 relative z-10" />
                    <div className="relative z-10">
                      <p className="text-[10px] font-sans tracking-widest text-primary-light/40 uppercase">
                        {spec.name}
                      </p>
                      <p className="text-xs font-sans tracking-wide text-primary-light">
                        {spec.val}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Add to Cart / Order CTA */}
            <button className="w-full py-4 border border-gold-accent bg-gold-accent hover:bg-transparent text-charcoal-950 hover:text-primary-light font-sans font-medium text-[10px] tracking-[0.25em] uppercase transition-all duration-300 relative group overflow-hidden">
              <span className="relative z-10">REQUEST PRIVATE TAILORING</span>
              <span className="absolute inset-0 bg-charcoal-950 scale-y-0 group-hover:scale-y-100 origin-bottom transition-transform duration-300 ease-out" />
            </button>
          </div>

          {/* Right Column: 360 Rotation Viewer */}
          <div className="lg:col-span-7 order-1 lg:order-2 flex flex-col items-center">
            
            {/* Viewer Box */}
            <div className="relative w-full aspect-[4/5] sm:aspect-square md:max-w-md lg:max-w-lg bg-charcoal-900 border border-white/5 overflow-hidden flex items-center justify-center">
              
              {/* Drag Area */}
              <div
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                className="absolute inset-0 z-20 cursor-grab active:cursor-grabbing touch-none select-none"
              />

              {/* Floating Instructions */}
              <div className="absolute top-4 left-4 z-10 bg-charcoal-950/80 backdrop-blur-md px-3 py-1.5 border border-white/5 flex items-center gap-2 pointer-events-none">
                <RotateCw className="w-3.5 h-3.5 text-primary animate-spin" style={{ animationDuration: "12s" }} />
                <span className="text-[9px] font-sans tracking-[0.2em] text-primary-light/60 uppercase">
                  DRAG TO ROTATE 360°
                </span>
              </div>

              {/* Floating Tech Stat */}
              <div className="absolute bottom-4 right-4 z-10 bg-charcoal-950/85 backdrop-blur-md px-3.5 py-2 border border-white/5 pointer-events-none max-w-[150px]">
                <p className="text-[8px] font-sans tracking-[0.2em] text-primary uppercase font-bold mb-1">
                  AVAILABILITY
                </p>
                <p className="text-[10px] font-sans tracking-wide text-primary-light leading-none">
                  09 Atelier Pieces left.
                </p>
              </div>

              {/* Product Image Frame */}
              <div className="w-full h-full p-6 sm:p-12 relative flex items-center justify-center select-none pointer-events-none">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={currentAngle}
                    src={angles[currentAngle].img}
                    alt={`Léon Coat angle ${angles[currentAngle].label}`}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.35, ease: "easeInOut" }}
                    className="max-w-full max-h-full object-contain grayscale contrast-[1.15]"
                  />
                </AnimatePresence>
              </div>
            </div>

            {/* Rotator Controller UI */}
            <div className="w-full max-w-xs md:max-w-md mt-8 flex flex-col items-center gap-4">
              {/* Timeline Bar */}
              <div className="w-full h-[2px] bg-white/10 relative">
                <motion.div
                  className="absolute top-0 bottom-0 left-0 bg-gold-accent"
                  animate={{ width: `${(currentAngle / (angles.length - 1)) * 100}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>

              {/* Angle Selector Rings */}
              <div className="flex gap-4">
                {angles.map((angle, index) => (
                  <button
                    key={angle.deg}
                    onClick={() => setCurrentAngle(index)}
                    className={`px-3 py-1 text-[9px] font-sans tracking-[0.2em] border transition-all duration-300 uppercase cursor-pointer ${
                      currentAngle === index
                        ? "border-gold-accent text-gold-accent bg-gold-accent/5"
                        : "border-white/10 text-primary-light/50 hover:border-white/30"
                    }`}
                  >
                    {angle.label}
                  </button>
                ))}
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </section>
  );
}
