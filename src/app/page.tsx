import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/sections/Hero";
import Featured from "@/components/sections/Featured";
import Lookbook from "@/components/sections/Lookbook";
import ProductHighlight from "@/components/sections/ProductHighlight";
import BrandStory from "@/components/sections/BrandStory";
import Experience from "@/components/sections/Experience";
import VideoCampaign from "@/components/sections/VideoCampaign";
import Testimonials from "@/components/sections/Testimonials";
import InstagramGallery from "@/components/sections/Instagram";
import Contact from "@/components/sections/Contact";
import Footer from "@/components/layout/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex-1 flex flex-col">
        <Hero />
        <Featured />
        <Lookbook />
        <ProductHighlight />
        <BrandStory />
        <Experience />
        <VideoCampaign />
        <Testimonials />
        <InstagramGallery />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
