"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

interface CollectionCardProps {
  title: string;
  season: string;
  desc: string;
  imgUrl: string;
  gridClass: string;
  delay: number;
}

function CollectionCard({ title, season, desc, imgUrl, gridClass, delay }: CollectionCardProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });

  return (
    <div ref={ref} className={`relative group cursor-pointer overflow-hidden ${gridClass}`}>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
        transition={{ duration: 1, delay, ease: [0.22, 1, 0.36, 1] }}
        className="w-full h-full relative"
      >
        {/* Image wrapper */}
        <div className="w-full h-full overflow-hidden bg-charcoal-900 relative">
          <img
            src={imgUrl}
            alt={title}
            className="w-full h-full object-cover grayscale contrast-[1.15] brightness-90 group-hover:grayscale-0 group-hover:scale-105 group-hover:brightness-95 transition-all duration-700 ease-out"
          />
          {/* Subtle color gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/80 via-charcoal-950/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-500" />
        </div>

        {/* Content Overlay */}
        <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-between z-10">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-sans tracking-[0.25em] text-primary-light/60 uppercase">
              {season}
            </span>
            <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-primary-light opacity-80 lg:opacity-0 lg:group-hover:opacity-100 -translate-y-0 lg:-translate-y-2 lg:group-hover:translate-y-0 transition-all duration-300">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>

          <div className="transform translate-y-0 lg:translate-y-2 lg:group-hover:translate-y-0 transition-transform duration-500 ease-out">
            <h3 className="font-display font-medium text-2xl md:text-3xl text-primary-light mb-2">
              {title}
            </h3>
            <p className="font-sans text-[11px] text-primary-light/65 tracking-wider max-w-xs opacity-90 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-500 delay-100">
              {desc}
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function Featured() {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, margin: "-15%" });

  return (
    <section
      id="collection"
      ref={containerRef}
      className="py-32 bg-charcoal-950 relative border-t border-white/5"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Header Section */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-24 items-end">
          <div className="md:col-span-7">
            <motion.span
              initial={{ opacity: 0, x: -25 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -25 }}
              transition={{ duration: 0.8 }}
              className="text-[10px] tracking-[0.3em] text-primary uppercase mb-4 block"
            >
              SEASONAL PROJECTS
            </motion.span>
            <h2 className="font-display font-medium text-4xl sm:text-5xl md:text-6xl tracking-tight text-primary-light leading-none">
              Featured{" "}
              <span className="font-serif italic font-normal text-primary">Collections</span>
            </h2>
          </div>
          <div className="md:col-span-5 md:pl-8">
            <motion.p
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 1, delay: 0.3 }}
              className="font-sans text-xs tracking-wide text-primary-light/50 leading-relaxed"
            >
              Every release is conceived as a modular project, exploring a singular textile weight and sculptural drape. Produced in limited runs at our Paris studio.
            </motion.p>
          </div>
        </div>

        {/* Editorial Asymmetrical Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-auto lg:h-[130vh]">
          {/* Card 1: Left Big Card */}
          <CollectionCard
            title="SAISON 01: RAW"
            season="WINTER / SPRING 2026"
            desc="Exploring heavyweight un-dyed canvas, textured stitching, and boxy outerwear cuts."
            imgUrl="https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=800&q=80"
            gridClass="lg:col-span-7 h-[60vh] lg:h-full"
            delay={0.1}
          />

          {/* Right Column Stack */}
          <div className="lg:col-span-5 flex flex-col gap-8 h-full">
            {/* Card 2: Right Top Card */}
            <CollectionCard
              title="ATELIER REDUX"
              season="EDITION 02"
              desc="Repurposed vintage garments reconstructed into modern sculptural streetwear panels."
              imgUrl="https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=800&q=80"
              gridClass="h-[45vh] lg:h-[calc(50%-1rem)]"
              delay={0.3}
            />

            {/* Card 3: Right Bottom Card */}
            <CollectionCard
              title="MODULAR FORM"
              season="EDITION 03"
              desc="Technical shell layers integrated with bespoke tailored tailoring shapes."
              imgUrl="https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&q=80"
              gridClass="h-[45vh] lg:h-[calc(50%-1rem)]"
              delay={0.5}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
