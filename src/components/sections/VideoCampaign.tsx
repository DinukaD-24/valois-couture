"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, X } from "lucide-react";
import Magnetic from "@/components/ui/Magnetic";

export default function VideoCampaign() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.documentElement.classList.add("lenis-stopped");
      document.body.style.overflow = "hidden";
    } else {
      document.documentElement.classList.remove("lenis-stopped");
      document.body.style.overflow = "";
    }
    return () => {
      document.documentElement.classList.remove("lenis-stopped");
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <section className="py-24 bg-charcoal-950 border-t border-white/5 relative">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="relative aspect-[16/9] w-full bg-charcoal-900 overflow-hidden border border-white/5">
          {/* Background image */}
          <img
            src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=80"
            alt="Campaign Poster"
            className="w-full h-full object-cover grayscale brightness-50"
          />

          {/* Banner Text Overlay */}
          <div className="absolute top-8 left-8 md:top-12 md:left-12 z-10">
            <span className="text-[10px] tracking-[0.3em] text-primary uppercase mb-2 block">
              CAMPAIGN VIDEO
            </span>
            <h3 className="font-display font-medium text-2xl md:text-3xl text-primary-light tracking-wider">
              SAISON DE L'ATELIER
            </h3>
          </div>

          {/* Interactive Magnetic Play Button */}
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <Magnetic range={60} strength={0.4}>
              <button
                onClick={() => setIsOpen(true)}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-primary-light text-charcoal-950 hover:bg-gold-accent hover:text-charcoal-950 flex items-center justify-center shadow-2xl transition-all duration-300 relative group cursor-pointer focus:outline-none"
                aria-label="Play Campaign Video"
              >
                {/* Ripple rings */}
                <div className="absolute inset-0 rounded-full border border-primary-light/30 group-hover:scale-125 transition-transform duration-500" />
                <div className="absolute inset-0 rounded-full border border-primary-light/10 group-hover:scale-150 transition-transform duration-700" />

                <Play className="w-6 h-6 fill-current ml-1" />
              </button>
            </Magnetic>
          </div>

          {/* Floating Details */}
          <div className="absolute bottom-8 right-8 md:bottom-12 md:right-12 z-10 hidden sm:block">
            <span className="text-[9px] font-sans tracking-[0.2em] text-primary-light/50 uppercase">
              DIRECTED IN PARIS / SHOT ON 35MM
            </span>
          </div>
        </div>
      </div>

      {/* Fullscreen Video Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] bg-charcoal-950/95 backdrop-blur-md flex items-center justify-center p-4 md:p-8"
          >
            {/* Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-6 right-6 text-primary-light hover:text-primary transition-colors focus:outline-none p-2"
              aria-label="Close video player"
            >
              <X className="w-8 h-8" />
            </button>

            {/* Video Container */}
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 28 }}
              className="w-full max-w-5xl aspect-[16/9] bg-black border border-white/10 relative"
            >
              <iframe
                src="https://player.vimeo.com/video/371433846?autoplay=1&loop=1&color=c5a880&title=0&byline=0&portrait=0"
                className="w-full h-full"
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
