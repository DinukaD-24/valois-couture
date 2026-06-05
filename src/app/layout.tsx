import type { Metadata } from "next";
import { Cormorant_Garamond, Syne, Manrope } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/providers/SmoothScroll";
import CustomCursor from "@/components/ui/CustomCursor";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "ATELIER VALOIS | Haute Couture & Modern Streetwear",
  description: "Experience Atelier Valois, an ultra-premium fashion house defining modern streetwear and luxury haute couture. Crafted for those who refuse ordinary.",
  keywords: "luxury fashion, haute couture, streetwear, minimal design, apparel design, Awwwards website, premium garments",
  authors: [{ name: "Atelier Valois" }],
  openGraph: {
    title: "ATELIER VALOIS | Haute Couture & Modern Streetwear",
    description: "Experience Atelier Valois, an ultra-premium fashion house defining modern streetwear and luxury haute couture.",
    url: "https://valois-couture.com",
    siteName: "Atelier Valois",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ATELIER VALOIS | Haute Couture & Modern Streetwear",
    description: "Experience Atelier Valois, an ultra-premium fashion house defining modern streetwear and luxury haute couture.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${syne.variable} ${manrope.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-charcoal-950 text-primary-light font-sans selection:bg-gold-accent selection:text-charcoal-950">
        <div className="noise-overlay" />
        <CustomCursor />
        <SmoothScroll>
          <div className="flex-1 flex flex-col min-h-screen relative overflow-hidden">
            {children}
          </div>
        </SmoothScroll>
      </body>
    </html>
  );
}
