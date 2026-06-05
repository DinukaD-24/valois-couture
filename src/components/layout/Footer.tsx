"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, ArrowRight, Loader2 } from "lucide-react";

// Inline brand SVGs (lucide-react removed social brand icons)
const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);
const XIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.747l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);
const PinterestIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2C6.477 2 2 6.477 2 12c0 4.236 2.636 7.855 6.356 9.312-.088-.791-.167-2.005.035-2.868.181-.78 1.172-4.97 1.172-4.97s-.299-.598-.299-1.482c0-1.388.806-2.428 1.808-2.428.853 0 1.267.64 1.267 1.408 0 .858-.546 2.141-.828 3.33-.236.995.499 1.806 1.476 1.806 1.772 0 3.137-1.868 3.137-4.565 0-2.387-1.716-4.057-4.165-4.057-2.837 0-4.502 2.128-4.502 4.328 0 .857.33 1.775.741 2.278a.3.3 0 0 1 .069.284c-.075.315-.243.995-.276 1.134-.044.183-.146.222-.337.134-1.249-.581-2.03-2.407-2.03-3.874 0-3.154 2.292-6.052 6.608-6.052 3.469 0 6.165 2.473 6.165 5.776 0 3.447-2.173 6.22-5.19 6.22-1.013 0-1.966-.527-2.292-1.148l-.623 2.378c-.226.869-.835 1.958-1.244 2.621.937.29 1.931.446 2.962.446 5.523 0 10-4.477 10-10S17.523 2 12 2z" />
  </svg>
);
import Magnetic from "@/components/ui/Magnetic";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [focused, setFocused] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      setStatus("error");
      return;
    }

    setStatus("loading");
    // Simulate API request
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setStatus("success");
    setEmail("");
  };

  const scrollToTop = (e: React.MouseEvent) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-charcoal-950 border-t border-white/5 pt-24 pb-8 overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 pb-20">
          {/* Brand Info & Newsletter */}
          <div className="lg:col-span-6 flex flex-col justify-between">
            <div>
              <h3 className="font-display text-2xl tracking-[0.2em] font-semibold text-primary-light mb-4">
                ATELIER VALOIS
              </h3>
              <p className="font-sans text-xs text-primary-light/50 tracking-wider max-w-sm leading-relaxed mb-8">
                Sign up to receive priority access to private lookbooks, seasonal launches, and couture releases.
              </p>

              {/* Newsletter Form */}
              <form onSubmit={handleSubscribe} className="max-w-md relative">
                <div className="relative flex items-center border-b border-primary/20 hover:border-primary/50 transition-colors py-2">
                  <div className="flex-1 relative">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (status === "error") setStatus("idle");
                      }}
                      onFocus={() => setFocused(true)}
                      onBlur={() => setFocused(false)}
                      placeholder="ENTER YOUR EMAIL"
                      className="w-full bg-transparent text-primary-light text-xs font-sans tracking-[0.2em] placeholder:text-primary-light/25 focus:outline-none uppercase"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={status === "loading"}
                    className="ml-4 p-1 text-primary hover:text-primary-light transition-colors relative group"
                    aria-label="Subscribe to newsletter"
                  >
                    {status === "loading" ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    )}
                  </button>
                </div>

                {/* Status messages */}
                {status === "success" && (
                  <motion.p
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute top-full left-0 mt-2 text-[10px] uppercase tracking-[0.2em] text-emerald-500 font-semibold"
                  >
                    Welcome to the Atelier.
                  </motion.p>
                )}
                {status === "error" && (
                  <motion.p
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute top-full left-0 mt-2 text-[10px] uppercase tracking-[0.2em] text-red-500 font-semibold"
                  >
                    Please enter a valid email.
                  </motion.p>
                )}
              </form>
            </div>

            {/* Socials & Studio */}
            <div className="mt-12 lg:mt-0 flex gap-6">
              <Magnetic>
                <a
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  className="w-10 h-10 border border-white/5 hover:border-gold-accent flex items-center justify-center text-primary-light/60 hover:text-primary-light transition-all rounded-none"
                  aria-label="Instagram link"
                >
                  <InstagramIcon />
                </a>
              </Magnetic>
              <Magnetic>
                <a
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  className="w-10 h-10 border border-white/5 hover:border-gold-accent flex items-center justify-center text-primary-light/60 hover:text-primary-light transition-all rounded-none"
                  aria-label="X (Twitter) link"
                >
                  <XIcon />
                </a>
              </Magnetic>
              <Magnetic>
                <a
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  className="w-10 h-10 border border-white/5 hover:border-gold-accent flex items-center justify-center text-primary-light/60 hover:text-primary-light transition-all rounded-none"
                  aria-label="Pinterest link"
                >
                  <PinterestIcon />
                </a>
              </Magnetic>
            </div>
          </div>

          {/* Links Grid */}
          <div className="lg:col-span-6 grid grid-cols-2 sm:grid-cols-3 gap-8">
            <div className="flex flex-col space-y-4">
              <span className="text-[10px] font-sans font-semibold tracking-[0.25em] text-primary/40 uppercase">
                COLLECTIONS
              </span>
              <a
                href="#collection"
                className="text-xs tracking-wider text-primary-light/60 hover:text-primary-light transition-colors"
              >
                SAISON 01 - RAW
              </a>
              <a
                href="#collection"
                className="text-xs tracking-wider text-primary-light/60 hover:text-primary-light transition-colors"
              >
                ESSENTIALS COUTURE
              </a>
              <a
                href="#collection"
                className="text-xs tracking-wider text-primary-light/60 hover:text-primary-light transition-colors"
              >
                LIMITED EDITIONS
              </a>
            </div>

            <div className="flex flex-col space-y-4">
              <span className="text-[10px] font-sans font-semibold tracking-[0.25em] text-primary/40 uppercase">
                THE ATELIER
              </span>
              <a
                href="#about"
                className="text-xs tracking-wider text-primary-light/60 hover:text-primary-light transition-colors"
              >
                OUR HERITAGE
              </a>
              <a
                href="#about"
                className="text-xs tracking-wider text-primary-light/60 hover:text-primary-light transition-colors"
              >
                CRAFTSMANSHIP
              </a>
              <a
                href="#contact"
                className="text-xs tracking-wider text-primary-light/60 hover:text-primary-light transition-colors"
              >
                VISIT PARIS STUDIO
              </a>
            </div>

            <div className="flex flex-col space-y-4 col-span-2 sm:col-span-1">
              <span className="text-[10px] font-sans font-semibold tracking-[0.25em] text-primary/40 uppercase">
                LEGAL
              </span>
              <a
                href="#"
                onClick={(e) => e.preventDefault()}
                className="text-xs tracking-wider text-primary-light/60 hover:text-primary-light transition-colors"
              >
                PRIVACY POLICY
              </a>
              <a
                href="#"
                onClick={(e) => e.preventDefault()}
                className="text-xs tracking-wider text-primary-light/60 hover:text-primary-light transition-colors"
              >
                TERMS of USE
              </a>
              <a
                href="#"
                onClick={(e) => e.preventDefault()}
                className="text-xs tracking-wider text-primary-light/60 hover:text-primary-light transition-colors"
              >
                ACCESSIBILITY STATEMENT
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-center pt-8 border-t border-white/5 gap-4">
          <p className="text-[10px] uppercase tracking-[0.2em] text-primary-light/35 text-center sm:text-left">
            © {new Date().getFullYear()} ATELIER VALOIS. ALL RIGHTS RESERVED.
          </p>

          <Magnetic>
            <a
              href="#"
              onClick={scrollToTop}
              className="text-[10px] uppercase tracking-[0.2em] text-primary hover:text-primary-light flex items-center gap-1 transition-colors group"
            >
              Back to top
              <ArrowUpRight className="w-3.5 h-3.5 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
            </a>
          </Magnetic>
        </div>
      </div>

      {/* Giant Background Logo */}
      <div className="absolute bottom-0 left-0 w-full select-none pointer-events-none translate-y-[20%] overflow-hidden">
        <h2 className="text-[15vw] sm:text-[18vw] font-display font-black text-center tracking-[-0.03em] leading-none text-white/[0.01] uppercase select-none border-b border-t border-white/[0.015] py-2">
          VALOIS
        </h2>
      </div>
    </footer>
  );
}
