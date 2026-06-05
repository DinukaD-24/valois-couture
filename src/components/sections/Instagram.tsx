"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, MessageCircle, X, ChevronLeft, ChevronRight } from "lucide-react";

// Inline brand SVG (lucide-react removed social brand icons)
const InstagramIcon = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const instagramPosts = [
  {
    id: 1,
    img: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=80",
    likes: "2,421",
    comments: "142",
    caption: "Saison 01 drapery profiles. Drape study in un-dyed organic canvas. #ateliervalois",
    aspect: "aspect-[3/4]",
  },
  {
    id: 2,
    img: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=600&q=80",
    likes: "1,894",
    comments: "98",
    caption: "Details from the tailoring floor. Double-face wool structures. #hautecouture",
    aspect: "aspect-square",
  },
  {
    id: 3,
    img: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=600&q=80",
    likes: "3,110",
    comments: "201",
    caption: "Movement drafts. The Valois Trench in motion across Parisian paths. #streetwear",
    aspect: "aspect-[3/4]",
  },
  {
    id: 4,
    img: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=600&q=80",
    likes: "1,556",
    comments: "64",
    caption: "Static curation. Essentials wardrobe grid at the Paris workshop. #minimalism",
    aspect: "aspect-square",
  },
  {
    id: 5,
    img: "https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?auto=format&fit=crop&w=600&q=80",
    likes: "2,130",
    comments: "119",
    caption: "Street silhouettes. Blending technical seams with tailoring forms. #saison01",
    aspect: "aspect-[3/4]",
  },
  {
    id: 6,
    img: "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=600&q=80",
    likes: "2,840",
    comments: "155",
    caption: "Coarse organic structures. Raw edge hems and detail stitch work. #details",
    aspect: "aspect-square",
  },
];

export default function InstagramGallery() {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  useEffect(() => {
    if (lightboxIndex !== null) {
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
  }, [lightboxIndex]);

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (lightboxIndex === null) return;
    setLightboxIndex((prev) => (prev === instagramPosts.length - 1 ? 0 : prev! + 1));
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (lightboxIndex === null) return;
    setLightboxIndex((prev) => (prev === 0 ? instagramPosts.length - 1 : prev! - 1));
  };

  return (
    <section className="py-32 bg-charcoal-950 border-t border-white/5 relative">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        {/* Header */}
        <div className="text-center mb-20">
          <InstagramIcon className="w-6 h-6 text-primary mx-auto mb-4" />
          <span className="text-[10px] tracking-[0.3em] text-primary uppercase mb-2 block">
            SOCIAL CURATION
          </span>
          <h2 className="font-display font-medium text-3xl sm:text-4xl text-primary-light tracking-tight mb-2">
            Shared <span className="font-serif italic font-normal text-primary">Moments</span>
          </h2>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[10px] font-sans tracking-[0.2em] text-primary-light/40 hover:text-primary transition-colors uppercase"
          >
            @ATELIER.VALOIS
          </a>
        </div>

        {/* Masonry / Editorial Column Grid */}
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
          {instagramPosts.map((post, index) => (
            <div
              key={post.id}
              onClick={() => setLightboxIndex(index)}
              className={`break-inside-avoid relative group overflow-hidden bg-charcoal-900 border border-white/5 cursor-pointer`}
            >
              {/* Image */}
              <img
                src={post.img}
                alt="Instagram post"
                className="w-full object-cover grayscale contrast-[1.1] group-hover:scale-105 group-hover:grayscale-0 transition-all duration-700 ease-out"
              />
              
              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-charcoal-950/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-6">
                <div className="flex justify-between items-center text-primary-light/40">
                  <span className="text-[9px] font-sans tracking-widest uppercase">@ATELIER.VALOIS</span>
                  <InstagramIcon className="w-3.5 h-3.5" />
                </div>

                <div className="flex justify-center gap-8 my-auto text-primary-light">
                  <div className="flex items-center gap-2">
                    <Heart className="w-4 h-4 text-gold-accent fill-current" />
                    <span className="text-xs font-sans tracking-wider">{post.likes}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MessageCircle className="w-4 h-4" />
                    <span className="text-xs font-sans tracking-wider">{post.comments}</span>
                  </div>
                </div>

                <p className="text-[10px] font-sans text-primary-light/70 tracking-wide line-clamp-2 leading-relaxed">
                  {post.caption}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Viewer */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightboxIndex(null)}
            className="fixed inset-0 z-[9999] bg-charcoal-950/98 backdrop-blur-md flex items-center justify-center p-4 md:p-8"
          >
            {/* Close */}
            <button
              onClick={() => setLightboxIndex(null)}
              className="absolute top-6 right-6 text-primary-light hover:text-primary transition-colors focus:outline-none p-2 z-50"
              aria-label="Close Lightbox"
            >
              <X className="w-8 h-8" />
            </button>

            {/* Slider Controls */}
            <button
              onClick={handlePrev}
              className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 border border-white/10 rounded-full hover:border-gold-accent text-primary-light hover:text-gold-accent flex items-center justify-center transition-colors focus:outline-none z-50"
              aria-label="Previous Post"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 border border-white/10 rounded-full hover:border-gold-accent text-primary-light hover:text-gold-accent flex items-center justify-center transition-colors focus:outline-none z-50"
              aria-label="Next Post"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Content Card */}
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              transition={{ type: "spring", stiffness: 300, damping: 28 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-4xl bg-charcoal-900 border border-white/10 grid grid-cols-1 md:grid-cols-12 max-h-[85vh] overflow-y-auto md:overflow-hidden"
            >
              {/* Image box */}
              <div className="md:col-span-7 bg-black flex items-center justify-center overflow-hidden aspect-square md:aspect-auto md:h-[70vh]">
                <img
                  src={instagramPosts[lightboxIndex].img}
                  alt="Enlarged Post"
                  className="w-full h-full object-cover grayscale contrast-[1.05]"
                />
              </div>

              {/* Text Sidebar */}
              <div className="md:col-span-5 p-6 md:p-8 flex flex-col justify-between bg-charcoal-900 h-full">
                <div>
                  <div className="flex items-center gap-3 pb-6 border-b border-white/5 mb-6">
                    <div className="w-7 h-7 rounded-full bg-primary/20 border border-gold-accent/30 flex items-center justify-center text-[10px] font-sans font-bold text-gold-accent uppercase">
                      AV
                    </div>
                    <div>
                      <p className="text-xs font-sans font-bold tracking-widest text-primary-light">ATELIER VALOIS</p>
                      <p className="text-[9px] font-sans tracking-wide text-primary-light/40 uppercase">Paris Studio</p>
                    </div>
                  </div>

                  <p className="font-sans text-xs tracking-wide text-primary-light/80 leading-relaxed mb-6">
                    {instagramPosts[lightboxIndex].caption}
                  </p>
                </div>

                <div>
                  {/* Likes/Comments Bar */}
                  <div className="flex gap-6 py-4 border-t border-b border-white/5 mb-6 text-primary-light/60">
                    <div className="flex items-center gap-2">
                      <Heart className="w-4 h-4 text-gold-accent fill-current" />
                      <span className="text-xs font-sans tracking-wider">{instagramPosts[lightboxIndex].likes} Likes</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MessageCircle className="w-4 h-4" />
                      <span className="text-xs font-sans tracking-wider">{instagramPosts[lightboxIndex].comments} Comments</span>
                    </div>
                  </div>

                  <a
                    href="https://instagram.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[10px] font-sans font-semibold tracking-[0.25em] text-primary hover:text-primary-light uppercase transition-colors flex items-center gap-1.5"
                  >
                    View Post on Instagram
                  </a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
