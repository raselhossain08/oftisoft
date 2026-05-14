"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Globe,
  Zap,
  Users,
  ArrowUpRight,
  ArrowRight,
  Cpu,
  Code2,
  Layers,
  Activity,
} from "lucide-react";
import { cn } from "@/lib/utils";
import CountUp from "react-countup";

// Import Integrated Sections
import FounderIntro from "@/components/sections/about/founder-intro";
import MissionValues from "@/components/sections/about/mission-values";
import CompanyTimeline from "@/components/sections/about/company-timeline";
import OfficeCulture from "@/components/sections/about/office-culture";
import Awards from "@/components/sections/about/awards";
import TeamShowcase from "@/components/sections/about/team-showcase";
import CapabilityEngine from "@/components/sections/about/capability-engine";

import { useMousePosition } from "@/hooks/useMousePosition";

const iconMap: any = {
  Globe,
  Users,
  Zap,
  ShieldCheck: Globe,
};

const pageData = {
  hero: {
    badge: "SINCE 2019",
    title: "We Are Oftisoft",
    highlightedWord: "Innovation",
    description: "A team of passionate engineers, designers, and strategists dedicated to building world-class digital products. Headquartered in Bangladesh, serving clients globally.",
    ctaText: "Start Your Project",
    cardTitle: "6+ Years of Engineering Excellence",
    cardDescription: "50+ projects delivered across fintech, healthcare, e-commerce, and enterprise. Trusted by startups and Fortune 500 companies alike."
  },
  stats: [
    { id: "projects", icon: "Zap", value: "50+", label: "Projects Delivered" },
    { id: "clients", icon: "Globe", value: "30+", label: "Happy Clients" },
    { id: "team", icon: "Users", value: "25+", label: "Expert Engineers" },
  ],
  founder: {
    name: "Rasel Hossain",
    role: "Founder & CEO",
    tagline: "Building world-class software from Bangladesh",
    image: "https://i.pravatar.cc/400?u=rasel",
    socials: { github: "https://github.com/oftisoft", linkedin: "https://linkedin.com/company/oftisoft", twitter: "https://twitter.com/oftisoft" },
    badgeTitle: "Meet the Founder",
    titleLine1: "Built by a Developer,",
    titleLine2: "for Developers.",
    bioPar1: "Rasel has been building software since 2015. He founded Oftisoft in 2019 with a vision to create a world-class software engineering firm from Bangladesh. Under his leadership, Oftisoft has grown from a solo consultancy to a 25+ person engineering powerhouse serving clients across 4 continents.",
    bioPar2: "His philosophy is simple: great software comes from great teams, transparent processes, and a relentless focus on quality. Every project at Oftisoft is treated as a partnership, not a transaction.",
    stats: [
      { num: 10, suffix: "+", label: "Years Building" },
      { num: 50, suffix: "+", label: "Projects Led" },
      { num: 25, suffix: "+", label: "Team Built" },
    ]
  },
  mission: "To democratize access to world-class software engineering by combining deep technical expertise with transparent, collaborative partnerships.",
  values: [
    { id: "quality", icon: "Zap", title: "Quality Obsession", description: "Every line of code is reviewed, tested, and optimized. We don't ship mediocre work.", color: "from-blue-500 to-cyan-500" },
    { id: "transparency", icon: "Globe", title: "Radical Transparency", description: "Daily updates, live dashboards, and open communication. You always know where your project stands.", color: "from-purple-500 to-pink-500" },
    { id: "growth", icon: "Users", title: "Continuous Growth", description: "We invest 20% of our time in learning. New technologies, better processes, constant improvement.", color: "from-green-500 to-teal-500" },
  ],
  timeline: [
    { id: "t1", year: "2019", title: "Founded", description: "Rasel started Oftisoft as a solo development consultancy in Satkhira, Bangladesh." },
    { id: "t2", year: "2020", title: "First Team", description: "Grew to 5 engineers and delivered first enterprise client project — a fintech platform." },
    { id: "t3", year: "2021", title: "Global Reach", description: "Started working with international clients from US, UK, and Australia." },
    { id: "t4", year: "2022", title: "AI Division", description: "Launched dedicated AI/ML practice. Built first AI-powered analytics platform." },
    { id: "t5", year: "2023", title: "20+ Team", description: "Expanded to 20+ engineers. Moved to larger office in Khulna." },
    { id: "t6", year: "2024", title: "Product Launch", description: "Launched first SaaS product. Reached $1M ARR milestone." },
    { id: "t7", year: "2025", title: "Scale & Impact", description: "50+ projects delivered. 25+ team members. Serving 4 continents." },
  ],
  culture: {
    items: [
      { id: "c1", icon: "Cpu", title: "Innovation Lab", description: "Dedicated R&D time for exploring new technologies and building internal tools." },
      { id: "c2", icon: "Users", title: "Collaborative Space", description: "Open floor plan, pair programming culture, and weekly knowledge-sharing sessions." },
      { id: "c3", icon: "Globe", title: "Remote-First", description: "Flexible remote work policy with team members across Bangladesh and beyond." },
    ]
  },
  awards: [
    { id: "a1", name: "Top Software Company", organization: "Clutch", year: "2024", description: "Recognized as a top performing software development company in Bangladesh." },
    { id: "a2", name: "Best Startup", organization: "Basis", year: "2023", description: "Awarded Best Tech Startup at the Bangladesh Innovation Summit." },
    { id: "a3", name: "Google Cloud Partner", organization: "Google", year: "2024", description: "Certified Google Cloud Partner for infrastructure and data services." },
  ],
  team: [
    { id: "m1", name: "Rasel Hossain", role: "Founder & CEO", image: "https://i.pravatar.cc/400?u=rasel", bio: "Visionary leader with 10+ years in software engineering.", categories: ["leadership"] },
    { id: "m2", name: "Sarah Rahman", role: "CTO", image: "https://i.pravatar.cc/400?u=sarah", bio: "Full-stack architect specializing in distributed systems.", categories: ["leadership", "engineering"] },
    { id: "m3", name: "Kabir Ahmed", role: "Lead Engineer", image: "https://i.pravatar.cc/400?u=kabir", bio: "Expert in React, Node.js, and cloud infrastructure.", categories: ["engineering"] },
    { id: "m4", name: "Nusrat Jahan", role: "UX Director", image: "https://i.pravatar.cc/400?u=nusrat", bio: "Design thinking advocate with 8+ years in product design.", categories: ["design"] },
  ],
  cta: {
    title: "Ready to Build Something Great?",
    description: "Let's talk about your project. Free 15-minute discovery call.",
    buttonText: "Start Conversation"
  }
};

export default function AboutPage() {
  const mousePos = useMousePosition();
  const { hero, stats, founder, mission, values, timeline, culture, awards, team, cta } = pageData;

  return (
    <div className="relative min-h-screen pt-64 pb-24 bg-[#020202]">
      {/* Neural Background with Mouse Tracking */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <motion.div
          animate={{
            x: mousePos.x - 400,
            y: mousePos.y - 400,
          }}
          transition={{ type: "spring", damping: 50, stiffness: 200 }}
          className="absolute w-[800px] h-[800px] bg-primary/20 rounded-full blur-[150px] opacity-20"
        />
        <div className="absolute top-[20%] left-[-10%] w-[70vw] h-[70vw] bg-primary/10 rounded-full blur-[160px] opacity-30" />
        <div className="absolute inset-0 bg-neutral-900/5 opacity-50" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-50" />
      </div>

      <div className="container px-6 mx-auto relative z-10 space-y-32">
        {/* System Core Ticker */}
        <div className="flex justify-between items-center py-4 border-y border-white/5 opacity-50">
          <div className="flex gap-8 overflow-hidden whitespace-nowrap">
            {[1, 2, 3].map((i) => (
              <motion.div
                key={i}
                animate={{ x: [0, -100] }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                className="flex gap-8 items-center"
              >
                <span className="text-xs font-semibold text-primary tracking-wide flex items-center gap-2">
                  <div className="w-1 h-1 bg-primary rounded-full animate-ping" />
                  OFTISOFT: ACTIVE
                </span>
                <span className="text-xs font-medium text-white/50 tracking-wide">
                  LOCATION: BANGLADESH
                </span>
                <span className="text-xs font-medium text-white/50 tracking-wide">
                  EXPERIENCE: 6+ YEARS
                </span>
                <span className="text-xs font-semibold text-primary tracking-wide">
                  FOCUS: WEB, MOBILE, AI
                </span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Hero section */}
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-10">
            <motion.div initial={false}>
              <Badge
                variant="outline"
                className="px-6 py-2 rounded-full border-primary/30 bg-primary/5 text-primary font-semibold text-xs tracking-wide"
              >
                {hero?.badge ?? ""}
              </Badge>
            </motion.div>

            <motion.h1
              initial={false}
              className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.05] mb-6"
            >
              {hero?.title ?? ""} <br />
              <span className="text-primary relative inline-block">
                {hero?.highlightedWord ?? ""}
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: "100%" }}
                  className="absolute -bottom-2 left-0 h-4 bg-primary/20 -z-10"
                />
              </span>
              .
            </motion.h1>

            <motion.p
              initial={false}
              className="text-lg md:text-xl text-muted-foreground font-normal leading-relaxed max-w-xl"
            >
              {hero?.description ?? ""}
            </motion.p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button className="h-14 px-8 rounded-2xl bg-primary hover:bg-primary/90 text-white font-semibold text-base shadow-xl shadow-primary/20 group">
                {hero?.ctaText ?? ""}{" "}
                <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-2 transition-transform" />
              </Button>
            </div>
          </div>

          <div className="relative group perspective-1000">
            {/* Dramatic Atmospheric Glows */}
            <div className="absolute -inset-10 bg-primary/20 blur-[130px] rounded-full opacity-60 group-hover:bg-primary/30 transition-all duration-1000" />

            <motion.div
              style={{
                rotateX: (mousePos.y - 400) / 60,
                rotateY: (mousePos.x - 1000) / -60,
                transformStyle: "preserve-3d",
              }}
              className="relative transition-all duration-300 ease-out"
            >
              <Card className="relative border-white/10 bg-black/40 backdrop-blur-3xl rounded-[60px] overflow-hidden p-2 shadow-2xl ring-1 ring-white/10 group-hover:ring-primary/50 transition-all duration-500">
                <div className="aspect-square bg-[#050505] rounded-[54px] relative overflow-hidden flex items-center justify-center">
                  {/* 3D Digital Floor Grid */}
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(var(--primary-rgb),0.1),transparent_70%)]" />
                  <div className="absolute bottom-0 w-full h-[60%] bg-[linear-gradient(to_bottom,transparent,rgba(var(--primary-rgb),0.02))] skew-y-12" />

                  {/* The Artifact Core */}
                  <div className="relative w-80 h-80 flex items-center justify-center">
                    {/* Outer Energy Sphere */}
                    <motion.div
                      animate={{
                        scale: [1, 1.05, 1],
                        rotate: 360,
                      }}
                      transition={{
                        duration: 25,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                      className="absolute inset-0 border border-primary/10 rounded-full border-dashed"
                    />

                    {/* Floating Geometric Artifact */}
                    <motion.div
                      animate={{
                        y: [0, -15, 0],
                        rotateX: [0, 10, 0],
                        rotateY: [0, 15, 0],
                      }}
                      transition={{
                        duration: 6,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                      className="relative w-48 h-48 flex items-center justify-center"
                      style={{ transformStyle: "preserve-3d" }}
                    >
                      {/* Nested Glass Frames */}
                      <div className="absolute inset-0 border-2 border-primary/40 rounded-3xl bg-primary/5 backdrop-blur-sm" />
                      <div className="absolute inset-6 border border-white/10 rounded-2xl bg-white/5" />
                      <div className="absolute inset-12 border border-primary/20 rounded-xl flex items-center justify-center bg-black/40">
                        <Cpu className="text-primary w-12 h-12 animate-pulse" />
                      </div>

                      {/* Rotating Orbital Rings */}
                      <motion.div
                        animate={{ rotateZ: 360 }}
                        transition={{
                          duration: 15,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                        className="absolute -inset-10 border border-primary/20 rounded-full border-t-primary/60 border-l-primary/60"
                      />
                    </motion.div>

                    {/* Parallax UI Shards */}
                    <motion.div
                      style={{
                        translateZ: 80,
                        x: (mousePos.x - 1000) / 30,
                        y: (mousePos.y - 400) / 30,
                      }}
                      className="absolute -top-12 -left-4 p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-2xl shadow-2xl space-y-2 pointer-events-none"
                    >
                      <div className="flex items-center gap-2">
                        <Activity size={10} className="text-green-500" />
                        <span className="text-[8px] font-semibold text-white/60">
                          SYSTM: ACTIVE
                        </span>
                      </div>
                      <div className="h-[2px] w-24 bg-white/10 rounded-full overflow-hidden">
                        <motion.div
                          animate={{ x: ["-100%", "100%"] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                          className="h-full w-full bg-primary"
                        />
                      </div>
                    </motion.div>

                    <motion.div
                      style={{
                        translateZ: 120,
                        x: (mousePos.x - 1000) / -40,
                        y: (mousePos.y - 400) / -40,
                      }}
                      className="absolute -bottom-8 -right-4 p-5 rounded-3xl bg-black/60 border border-primary/40 backdrop-blur-3xl shadow-2xl space-y-3 pointer-events-none"
                    >
                      <Code2 size={20} className="text-primary" />
                      <div className="space-y-1">
                        <div className="h-1 w-16 bg-white/20 rounded-full" />
                        <div className="h-1 w-12 bg-white/10 rounded-full" />
                      </div>
                    </motion.div>

                    <motion.div
                      style={{
                        translateZ: 50,
                        x: (mousePos.x - 1000) / 50,
                        y: (mousePos.y - 400) / 50,
                      }}
                      className="absolute top-1/2 -right-16 translate-y-[-50%] p-3 rounded-xl bg-primary/20 border border-primary/40 backdrop-blur-md"
                    >
                      <Layers size={16} className="text-white" />
                    </motion.div>
                  </div>

                  {/* Bottom Content Narrative Overlay */}
                  <div className="absolute bottom-10 left-10 right-10 p-10 rounded-[45px] bg-black/40 border border-white/5 backdrop-blur-2xl space-y-3 group-hover:border-primary/20 transition-all shadow-2xl">
                    <div className="flex items-center gap-3">
                      <div className="h-[2px] w-8 bg-primary" />
                      <h4 className="text-xl md:text-2xl font-bold text-white tracking-tight">
                        {hero?.cardTitle ?? ""}
                      </h4>
                    </div>
                    <p className="text-sm text-neutral-400 font-normal leading-relaxed">
                      {hero?.cardDescription ?? ""}
                    </p>
                  </div>

                  {/* Scanning Light Strip */}
                  <motion.div
                    animate={{ x: ["-100%", "200%"] }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="absolute top-0 left-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-12 pointer-events-none"
                  />
                </div>
              </Card>
            </motion.div>
          </div>
        </div>

        {/* Capability Engine Highlight */}
        <CapabilityEngine />

        {/* Stats Matrix */}
        <div className="grid md:grid-cols-3 gap-8">
          {stats.map((stat: any, idx: number) => {
            const Icon = iconMap[stat.icon] || Zap;
            const valueNum = parseInt(stat.value);
            const suffix = stat.value.replace(/[0-9]/g, "");

            return (
              <motion.div
                key={stat.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ delay: idx * 0.1 }}
                style={{ willChange: "transform, opacity" }}
              >
                <Card className="border-white/5 bg-white/[0.01] rounded-[40px] p-12 text-center space-y-4 hover:border-primary/30 transition-all group">
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mx-auto group-hover:scale-110 transition-transform">
                    <Icon size={32} />
                  </div>
                  <div className="space-y-1">
                    <span className="text-5xl font-semibold text-white font-mono">
                      {isNaN(valueNum) ? (
                        stat.value
                      ) : (
                        <>
                          <CountUp
                            end={valueNum}
                            duration={2.5}
                            enableScrollSpy
                            scrollSpyOnce
                          />
                          {suffix}
                        </>
                      )}
                    </span>
                    <p className="text-xs font-medium tracking-wide text-muted-foreground">
                      {stat.label}
                    </p>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Integrated Sections */}
        <FounderIntro data={founder} />
        <MissionValues data={{ mission, values }} />
        <CompanyTimeline data={{ timeline }} />
        <OfficeCulture data={culture} />
        <Awards data={{ awards }} />
        <TeamShowcase data={team} />

        {/* Infrastructure Footer */}
        <div className="p-12 md:p-20 rounded-[60px] bg-primary/[0.03] border-2 border-primary/10 text-center space-y-8 relative overflow-hidden group">
          <div className="absolute inset-0 bg-primary opacity-0 group-hover:opacity-5 transition-opacity duration-1000" />
          <h3 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white relative z-10">
            {cta?.title ?? ""}
          </h3>
          <p className="text-lg md:text-xl text-muted-foreground font-normal max-w-2xl mx-auto relative z-10">
            {cta?.description ?? ""}
          </p>
          <Button
            variant="outline"
            className="h-14 px-10 rounded-2xl border-2 border-primary/30 bg-background text-primary font-semibold text-base shadow-lg hover:bg-primary hover:text-white transition-all relative z-10"
          >
            {cta?.buttonText ?? ""}{" "}
            <ArrowUpRight className="w-5 h-5 ml-3" />
          </Button>
        </div>
      </div>
    </div>
  );
}

