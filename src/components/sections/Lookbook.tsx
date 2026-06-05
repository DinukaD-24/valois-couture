"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

const lookbookItems = [
  {
    id: "01",
    title: "STRUCTURED COAT",
    category: "HAUTE COUTURE",
    desc: "A singular exploration of heavy, raw wool structured with architectural shoulder geometry.",
    imgUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "02",
    title: "RAW DRAPERY",
    category: "TEXTILE ARCHIVE",
    desc: "Un-dyed coarse cotton and organic linen drape that contours naturally around movement.",
    imgUrl: "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "03",
    title: "TECHNICAL CARGO",
    category: "STREETWEAR",
    desc: "Bespoke membrane fabrics assembled with water-resistant seam tape and raw steel rivets.",
    imgUrl: "https://images.unsplash.com/photo-1554412933-514a83d2f3c8?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "04",
    title: "VALOIS CHELSEA",
    category: "FOOTWEAR",
    desc: "Hand-sculpted vegetable-tanned leather boots set on an elevated crepe rubber foundation.",
    imgUrl: "https://images.unsplash.com/photo-1520639888713-7851133b1ed0?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "05",
    title: "THE ATELIER RAW",
    category: "LIMITED EDITIONS",
    desc: "Frayed hems, exposed seams, and hand-finished button holes celebrating imperfections.",
    imgUrl: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=800&q=80",
  },
];

export default function Lookbook() {
  const pinSectionRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Desktop only: GSAP horizontal scroll pin
    const mediaQuery = window.matchMedia("(min-width: 1024px)");
    if (!mediaQuery.matches) return;

    const scrollContainer = scrollContainerRef.current;
    const pinSection = pinSectionRef.current;
    if (!scrollContainer || !pinSection) return;

    const totalWidth = scrollContainer.scrollWidth;
    const viewportWidth = window.innerWidth;
    const scrollAmount = totalWidth - viewportWidth;

    gsap.to(scrollContainer, {
      x: -scrollAmount,
      ease: "none",
      scrollTrigger: {
        trigger: pinSection,
        pin: true,
        scrub: 1.5,
        start: "top top",
        end: () => `+=${scrollAmount}`,
        invalidateOnRefresh: true,
        anticipatePin: 1,
      },
    });
  }, { scope: pinSectionRef });

  return (
    <div ref={pinSectionRef} id="lookbook" className="bg-charcoal-900 border-t border-white/5">
      {/* For desktop: pinned GSAP section. For mobile: simple native overflow scroll */}
      <div className="relative lg:h-screen flex flex-col justify-center overflow-hidden py-24 lg:py-0">
        
        {/* Lookbook Title */}
        <div className="max-w-7xl mx-auto px-6 md:px-12 w-full lg:absolute lg:top-12 lg:left-0 lg:right-0 z-10 mb-12 lg:mb-0">
          <div className="flex justify-between items-end">
            <div>
              <span className="text-[10px] tracking-[0.3em] text-primary uppercase mb-2 block">
                EDITORIAL PROJECT
              </span>
              <h2 className="font-display font-medium text-4xl lg:text-5xl text-primary-light tracking-tight leading-none">
                Atelier <span className="font-serif italic font-normal text-primary">Lookbook</span>
              </h2>
            </div>
            <span className="hidden lg:block text-[10px] tracking-[0.2em] text-primary-light/40 uppercase">
              Scroll to explore →
            </span>
          </div>
        </div>

        {/* Horizontal Slides Container — native horizontal scroll on mobile, GSAP pin on desktop */}
        <div
          ref={scrollContainerRef}
          className="flex flex-col lg:flex-row gap-12 lg:gap-16 px-6 md:px-12 lg:px-24 w-full
                     overflow-x-auto lg:overflow-x-visible overflow-y-hidden
                     [scrollbar-width:none] [&::-webkit-scrollbar]:hidden
                     lg:flex-nowrap"
        >
          {lookbookItems.map((item) => (
            <div
              key={item.id}
              className="flex-shrink-0 w-full sm:w-[70vw] lg:w-[42vw] xl:w-[30vw] h-[65vh] lg:h-[60vh] flex flex-col justify-between group relative"
            >
              {/* Image box */}
              <div className="w-full h-[80%] bg-charcoal-950 overflow-hidden relative">
                <img
                  src={item.imgUrl}
                  alt={item.title}
                  loading="lazy"
                  className="w-full h-full object-cover grayscale brightness-90 group-hover:scale-[1.04] group-hover:grayscale-0 group-hover:brightness-95 transition-all duration-700 ease-out"
                />
                <div className="absolute top-4 left-4 bg-charcoal-950/70 backdrop-blur-md px-3 py-1 border border-white/5">
                  <span className="text-[10px] font-sans font-medium tracking-[0.2em] text-primary-light">
                    {item.id}
                  </span>
                </div>
              </div>

              {/* Details box */}
              <div className="pt-4 flex flex-col gap-1.5">
                <div className="flex justify-between items-baseline">
                  <h3 className="font-display font-medium text-lg text-primary-light tracking-wide">
                    {item.title}
                  </h3>
                  <span className="text-[9px] font-sans tracking-[0.2em] text-primary uppercase font-semibold">
                    {item.category}
                  </span>
                </div>
                <p className="font-sans text-xs text-primary-light/50 tracking-wide leading-relaxed max-w-sm">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
