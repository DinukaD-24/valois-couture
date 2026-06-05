"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import Magnetic from "@/components/ui/Magnetic";

const navItems = [
  { name: "Home", href: "#home" },
  { name: "Collection", href: "#collection" },
  { name: "Lookbook", href: "#lookbook" },
  { name: "About", href: "#about" },
  { name: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeItem, setActiveItem] = useState("Home");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Run once on mount to set correct initial active item
    const updateActive = () => {
      setIsScrolled(window.scrollY > 50);

      // Use getBoundingClientRect() — correct even inside GSAP-pinned elements
      // Find the section whose top edge is closest to (but still above) 1/3 from the top
      const threshold = window.innerHeight * 0.35;
      let bestMatch = "Home";
      let bestOffset = -Infinity;

      for (const item of navItems) {
        const element = document.querySelector(item.href);
        if (element) {
          const rect = element.getBoundingClientRect();
          // rect.top is negative once section is scrolled past
          // We want the last section whose top is above the threshold line
          if (rect.top <= threshold && rect.top > bestOffset) {
            bestOffset = rect.top;
            bestMatch = item.name;
          }
        }
      }

      setActiveItem(bestMatch);
    };

    // Initial call on mount
    updateActive();

    window.addEventListener("scroll", updateActive, { passive: true });
    return () => window.removeEventListener("scroll", updateActive);
  }, []);

  useEffect(() => {
    if (mobileMenuOpen) {
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
  }, [mobileMenuOpen]);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string, name: string) => {
    e.preventDefault();
    setActiveItem(name);
    setMobileMenuOpen(false);

    const targetElement = document.querySelector(href);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
          isScrolled
            ? "glass py-4 shadow-[0_4px_30px_rgba(0,0,0,0.3)] border-b border-white/5"
            : "bg-transparent py-6"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
          {/* Logo */}
          <a
            href="#home"
            onClick={(e) => handleNavClick(e, "#home", "Home")}
            className="font-display font-semibold tracking-[0.2em] text-lg md:text-xl text-primary-light hover:text-primary transition-colors"
          >
            ATELIER VALOIS
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Magnetic key={item.name} range={40} strength={0.25}>
                <a
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href, item.name)}
                  className={`relative px-3 py-1 font-sans text-xs uppercase tracking-[0.15em] transition-colors duration-300 ${
                    activeItem === item.name
                      ? "text-primary-light"
                      : "text-primary-light/50 hover:text-primary-light/80"
                  }`}
                >
                  {item.name}
                  {activeItem === item.name && (
                    <motion.span
                      layoutId="activeNavUnderline"
                      className="absolute bottom-0 left-3 right-3 h-[1.5px] bg-gold-accent"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </a>
              </Magnetic>
            ))}
          </nav>

          {/* CTA Link Desktop */}
          <div className="hidden md:block">
            <Magnetic range={40} strength={0.2}>
              <a
                href="#collection"
                onClick={(e) => handleNavClick(e, "#collection", "Collection")}
                className="px-5 py-2.5 border border-primary/20 hover:border-gold-accent text-[10px] tracking-[0.2em] uppercase rounded-none bg-transparent text-primary hover:text-primary-light transition-all duration-300 relative group overflow-hidden"
              >
                <span className="relative z-10">Shop Collection</span>
                <span className="absolute inset-0 bg-gold-accent/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
              </a>
            </Magnetic>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="md:hidden text-primary-light hover:text-primary transition-colors focus:outline-none"
            aria-label="Toggle Navigation Menu"
          >
            <Menu size={24} strokeWidth={1.5} />
          </button>
        </div>
      </motion.header>

      {/* Mobile Drawer Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-50 bg-charcoal-950/98 backdrop-blur-lg md:hidden flex flex-col justify-between p-8"
          >
            {/* Header */}
            <div className="flex justify-between items-center">
              <span className="font-display font-semibold tracking-[0.2em] text-lg text-primary-light">
                ATELIER VALOIS
              </span>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="text-primary-light hover:text-primary transition-colors focus:outline-none"
                aria-label="Close Navigation Menu"
              >
                <X size={24} strokeWidth={1.5} />
              </button>
            </div>

            {/* Links */}
            <div className="flex flex-col space-y-6 my-auto">
              {navItems.map((item, index) => (
                <motion.div
                  key={item.name}
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -50, opacity: 0 }}
                  transition={{ delay: index * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                >
                  <a
                    href={item.href}
                    onClick={(e) => handleNavClick(e, item.href, item.name)}
                    className={`font-serif text-4xl italic tracking-wide transition-colors block ${
                      activeItem === item.name
                        ? "text-gold-accent"
                        : "text-primary-light/60 hover:text-primary-light"
                    }`}
                  >
                    {item.name}
                  </a>
                </motion.div>
              ))}
            </div>

            {/* Footer details in mobile menu */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="flex justify-between items-center border-t border-white/5 pt-6 text-[10px] uppercase tracking-[0.2em] text-primary-light/50"
            >
              <span>Paris - New York</span>
              <span>© {new Date().getFullYear()}</span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
