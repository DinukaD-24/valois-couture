"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const values = [
  {
    num: "01",
    title: "Sculptural Geometry",
    desc: "We approach silhouettes as architectural forms rather than mere clothing, drafting sharp lines that stand out in any landscape.",
  },
  {
    num: "02",
    title: "Textile Integrity",
    desc: "Every thread is sourced from eco-conscious heritage mills in Italy and Japan, prioritizing structural weight and natural skin feel.",
  },
  {
    num: "03",
    title: "Limited Editions",
    desc: "By designing modular collections and producing in micro-runs, we eliminate mass manufacturing waste and guarantee exclusivity.",
  },
];

export default function BrandStory() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-15%" });

  return (
    <section
      id="about"
      ref={ref}
      className="py-32 bg-charcoal-900 border-t border-white/5 relative overflow-hidden"
    >
      {/* Decorative vertical lines */}
      <div className="absolute top-0 bottom-0 left-1/4 w-[1px] bg-white/[0.02] hidden lg:block" />
      <div className="absolute top-0 bottom-0 left-2/4 w-[1px] bg-white/[0.02] hidden lg:block" />
      <div className="absolute top-0 bottom-0 left-3/4 w-[1px] bg-white/[0.02] hidden lg:block" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        
        {/* Headline Statement */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-28">
          <div className="lg:col-span-8">
            <span className="text-[10px] tracking-[0.3em] text-primary uppercase mb-4 block">
              OUR STATEMENT
            </span>
            <h2 className="font-display font-medium text-3xl sm:text-5xl md:text-6xl tracking-tight text-primary-light leading-[1.1]">
              Bridging the gap between{" "}
              <span className="font-serif italic font-normal text-primary">haute couture precision</span>{" "}
              and raw modern streetwear silhouettes.
            </h2>
          </div>
          <div className="lg:col-span-4 flex items-end">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="font-sans text-xs tracking-wide text-primary-light/50 leading-relaxed"
            >
              Atelier Valois was founded in Paris with a commitment to subverting traditional fashion templates. We draft blueprints for garments designed to last a lifetime, honoring the imperfections of organic raw textures.
            </motion.p>
          </div>
        </div>

        {/* Brand Values Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {values.map((val, index) => (
            <motion.div
              key={val.num}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.8, delay: index * 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col justify-between p-6 md:p-8 border border-white/5 bg-charcoal-950/40 relative group overflow-hidden"
            >
              {/* Highlight bar */}
              <div className="absolute top-0 left-0 w-full h-[1px] bg-gold-accent scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500" />
              
              <div>
                <span className="font-serif italic text-3xl text-primary/30 group-hover:text-primary transition-colors duration-500 block mb-6">
                  {val.num}
                </span>
                <h3 className="font-display font-medium text-xl text-primary-light mb-4">
                  {val.title}
                </h3>
                <p className="font-sans text-xs text-primary-light/50 tracking-wide leading-relaxed">
                  {val.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
