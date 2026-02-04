
import Hero from "@/components/sections/hero";
import Services from "@/components/sections/services";
import FeaturedProjects from "@/components/sections/featured-projects";
import WhyUs from "@/components/sections/why-us";
import ProcessTimeline from "@/components/sections/process-timeline";
import Testimonials from "@/components/sections/testimonials";
import TechStack from "@/components/sections/tech-stack";
import LatestBlog from "@/components/sections/latest-blog";
import CTA from "@/components/sections/cta";
import Footer from "@/components/sections/footer";

export default function Home() {
  return (
    <main className="relative min-h-screen flex flex-col text-foreground overflow-hidden selection:bg-primary/30">
        
      {/* 2026 Premium Gradient Background - Fixed & Unified */}
      <div className="fixed inset-0 z-[-1] pointer-events-none">
          {/* Deep Base */}
          <div className="absolute inset-0 bg-[#030014]" />
          
          {/* Main Gradient Blobs */}
          <div className="absolute top-[-10%] left-[-20%] w-[80vw] h-[80vw] bg-purple-900/20 rounded-full blur-[120px] mix-blend-screen opacity-50 animate-blob" />
          <div className="absolute bottom-[-10%] right-[-20%] w-[80vw] h-[80vw] bg-indigo-900/20 rounded-full blur-[120px] mix-blend-screen opacity-50 animate-blob animation-delay-2000" />
          <div className="absolute top-[40%] left-[30%] w-[50vw] h-[50vw] bg-blue-900/10 rounded-full blur-[100px] mix-blend-screen opacity-40 animate-blob animation-delay-4000" />

          {/* Grain Texture Overlay */}
          <div className="absolute inset-0 opacity-[0.03] bg-[url('https://grain-texture-url-here.png')] pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='1'/%3E%3C/svg%3E")` }} />
          
          {/* Vignette */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#030014_100%)] opacity-80" />
      </div>
      <Hero />
      <Services />
      <FeaturedProjects />
      <WhyUs />
      <ProcessTimeline />
      <Testimonials />
      <TechStack />
      <LatestBlog />
      <CTA />
    </main>
  );
}
