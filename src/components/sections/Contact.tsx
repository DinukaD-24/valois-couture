"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Phone, MapPin, Send, Loader2, CheckCircle2 } from "lucide-react";
import Magnetic from "@/components/ui/Magnetic";

interface FormFields {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  message?: string;
}

export default function Contact() {
  const [fields, setFields] = useState<FormFields>({ name: "", email: "", subject: "Inquiry", message: "" });
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");

  const validate = () => {
    const tempErrors: FormErrors = {};
    if (!fields.name.trim()) tempErrors.name = "Name is required.";
    if (!fields.email.trim()) {
      tempErrors.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(fields.email)) {
      tempErrors.email = "Email format is invalid.";
    }
    if (!fields.message.trim()) tempErrors.message = "Message is required.";
    
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setStatus("loading");
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setStatus("success");
    setFields({ name: "", email: "", subject: "Inquiry", message: "" });
  };

  return (
    <section id="contact" className="py-32 bg-charcoal-900 border-t border-white/5 relative">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">
          
          {/* Left: Contact Coordinates & Details */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div>
              <span className="text-[10px] tracking-[0.3em] text-primary uppercase mb-2 block">
                INQUIRIES
              </span>
              <h2 className="font-display font-medium text-4xl sm:text-5xl text-primary-light tracking-tight mb-8">
                Connect <span className="font-serif italic font-normal text-primary">With Us</span>
              </h2>
              <p className="font-sans text-xs text-primary-light/50 tracking-wide leading-relaxed mb-12 max-w-sm">
                Whether requesting custom bridal measurements, scheduling a private showroom viewing, or checking stock availability, our advisors are here to guide you.
              </p>

              {/* Coordinates */}
              <div className="flex flex-col space-y-6">
                <div className="flex items-start">
                  <MapPin className="w-4 h-4 text-primary mr-4 mt-0.5" />
                  <div>
                    <h4 className="text-[10px] font-sans font-semibold tracking-widest text-primary-light/45 uppercase mb-1">
                      PARIS SHOWROOM
                    </h4>
                    <p className="text-xs font-sans tracking-wide text-primary-light/85">
                      12 Rue du Faubourg Saint-Honoré, 75008 Paris, France
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Mail className="w-4 h-4 text-primary mr-4 mt-0.5" />
                  <div>
                    <h4 className="text-[10px] font-sans font-semibold tracking-widest text-primary-light/45 uppercase mb-1">
                      EMAIL GENERAL
                    </h4>
                    <a href="mailto:atelier@valois-couture.com" className="text-xs font-sans tracking-wide text-primary-light/85 hover:text-primary transition-colors">
                      atelier@valois-couture.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start">
                  <Phone className="w-4 h-4 text-primary mr-4 mt-0.5" />
                  <div>
                    <h4 className="text-[10px] font-sans font-semibold tracking-widest text-primary-light/45 uppercase mb-1">
                      PRIVATE HOTLINE
                    </h4>
                    <p className="text-xs font-sans tracking-wide text-primary-light/85">
                      +33 (0) 1 42 68 53 00
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Office Hours details */}
            <div className="mt-16 lg:mt-0 pt-8 border-t border-white/5">
              <span className="text-[9px] font-sans tracking-[0.2em] text-primary uppercase block mb-1">
                ADVISORY HOURS
              </span>
              <p className="text-[10px] font-sans tracking-wide text-primary-light/40 uppercase">
                Monday — Friday / 09:00 — 18:00 CET
              </p>
            </div>
          </div>

          {/* Right: Contact Form */}
          <div className="lg:col-span-7">
            <div className="glass p-8 sm:p-12 border border-white/5 bg-charcoal-950/40 relative">
              <AnimatePresence mode="wait">
                {status === "success" ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="py-12 flex flex-col items-center text-center justify-center"
                  >
                    <CheckCircle2 className="w-12 h-12 text-gold-accent mb-6 animate-pulse" />
                    <h3 className="font-display text-xl text-primary-light mb-2">Message Transmitted</h3>
                    <p className="font-sans text-xs text-primary-light/50 tracking-wide leading-relaxed max-w-xs mb-8">
                      Thank you for contacting Atelier Valois. A private client advisor will respond within 24 hours.
                    </p>
                    <button
                      onClick={() => setStatus("idle")}
                      className="px-6 py-2.5 border border-primary/20 text-[10px] tracking-[0.2em] text-primary hover:text-primary-light hover:border-primary-light transition-colors uppercase font-medium"
                    >
                      SEND ANOTHER MESSAGE
                    </button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Name */}
                    <div className="relative">
                      <input
                        type="text"
                        name="name"
                        value={fields.name}
                        onChange={(e) => {
                          setFields({ ...fields, name: e.target.value });
                          if (errors.name) setErrors({ ...errors, name: undefined });
                        }}
                        placeholder="NAME"
                        className="peer w-full bg-transparent border-b border-primary/20 focus:border-gold-accent py-3 text-xs font-sans tracking-[0.15em] text-primary-light focus:outline-none placeholder:text-transparent transition-colors uppercase"
                      />
                      <label className="absolute left-0 -top-3 text-primary/40 text-[9px] tracking-[0.2em] transition-all duration-300 peer-placeholder-shown:text-xs peer-placeholder-shown:top-3 peer-focus:-top-3 peer-focus:text-gold-accent peer-focus:text-[9px] uppercase pointer-events-none">
                        NAME
                      </label>
                      {errors.name && <p className="text-[9px] text-red-500 tracking-wide mt-1">{errors.name}</p>}
                    </div>

                    {/* Email */}
                    <div className="relative">
                      <input
                        type="email"
                        name="email"
                        value={fields.email}
                        onChange={(e) => {
                          setFields({ ...fields, email: e.target.value });
                          if (errors.email) setErrors({ ...errors, email: undefined });
                        }}
                        placeholder="EMAIL"
                        className="peer w-full bg-transparent border-b border-primary/20 focus:border-gold-accent py-3 text-xs font-sans tracking-[0.15em] text-primary-light focus:outline-none placeholder:text-transparent transition-colors uppercase"
                      />
                      <label className="absolute left-0 -top-3 text-primary/40 text-[9px] tracking-[0.2em] transition-all duration-300 peer-placeholder-shown:text-xs peer-placeholder-shown:top-3 peer-focus:-top-3 peer-focus:text-gold-accent peer-focus:text-[9px] uppercase pointer-events-none">
                        EMAIL
                      </label>
                      {errors.email && <p className="text-[9px] text-red-500 tracking-wide mt-1">{errors.email}</p>}
                    </div>

                    {/* Subject */}
                    <div className="relative">
                      <select
                        name="subject"
                        value={fields.subject}
                        onChange={(e) => setFields({ ...fields, subject: e.target.value })}
                        className="w-full bg-transparent border-b border-primary/20 focus:border-gold-accent py-3 text-xs font-sans tracking-[0.15em] text-primary-light focus:outline-none transition-colors uppercase cursor-pointer rounded-none"
                      >
                        <option value="Inquiry" className="bg-charcoal-950 text-primary-light">GENERAL INQUIRY</option>
                        <option value="Showroom" className="bg-charcoal-950 text-primary-light">SHOWROOM BOOKING</option>
                        <option value="Bridal/Custom" className="bg-charcoal-950 text-primary-light">BRIDAL & CUSTOM TAILORING</option>
                        <option value="Press" className="bg-charcoal-950 text-primary-light">PRESS & EDITORIAL</option>
                      </select>
                      <label className="absolute left-0 -top-3 text-gold-accent text-[9px] tracking-[0.2em] uppercase">
                        SUBJECT
                      </label>
                    </div>

                    {/* Message */}
                    <div className="relative">
                      <textarea
                        name="message"
                        value={fields.message}
                        onChange={(e) => {
                          setFields({ ...fields, message: e.target.value });
                          if (errors.message) setErrors({ ...errors, message: undefined });
                        }}
                        placeholder="MESSAGE"
                        rows={4}
                        className="peer w-full bg-transparent border-b border-primary/20 focus:border-gold-accent py-3 text-xs font-sans tracking-[0.15em] text-primary-light focus:outline-none placeholder:text-transparent transition-colors uppercase resize-none"
                      />
                      <label className="absolute left-0 -top-3 text-primary/40 text-[9px] tracking-[0.2em] transition-all duration-300 peer-placeholder-shown:text-xs peer-placeholder-shown:top-3 peer-focus:-top-3 peer-focus:text-gold-accent peer-focus:text-[9px] uppercase pointer-events-none">
                        MESSAGE
                      </label>
                      {errors.message && <p className="text-[9px] text-red-500 tracking-wide mt-1">{errors.message}</p>}
                    </div>

                    {/* Submit Button */}
                    <Magnetic range={40} strength={0.25}>
                      <button
                        type="submit"
                        disabled={status === "loading"}
                        className="w-full sm:w-auto px-10 py-4 border border-gold-accent bg-gold-accent hover:bg-transparent text-charcoal-950 hover:text-primary-light font-sans font-medium text-[10px] tracking-[0.25em] uppercase transition-all duration-300 relative group overflow-hidden flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <span className="relative z-10 flex items-center justify-center gap-2">
                          {status === "loading" ? (
                            <>
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              TRANSMITTING...
                            </>
                          ) : (
                            <>
                              TRANSMIT INQUIRY <Send className="w-3.5 h-3.5" />
                            </>
                          )}
                        </span>
                        <span className="absolute inset-0 bg-charcoal-950 scale-y-0 group-hover:scale-y-100 origin-top transition-transform duration-300 ease-out" />
                      </button>
                    </Magnetic>
                  </form>
                )}
              </AnimatePresence>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
