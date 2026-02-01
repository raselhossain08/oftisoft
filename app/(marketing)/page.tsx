
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
    <main className="flex min-h-screen flex-col bg-background text-foreground overflow-hidden selection:bg-primary/30">
      <Hero />
      <Services />
      <FeaturedProjects />
      <WhyUs />
      <ProcessTimeline />
      <Testimonials />
      <TechStack />
      <LatestBlog />
      <CTA />
      <Footer />
    </main>
  );
}
