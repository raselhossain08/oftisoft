"use client"
import { AnimatedDiv } from "@/lib/animated";
;

import { Star, Quote } from "lucide-react";
import { cn } from "@/lib/utils";
import { useHomeContentStore } from "@/lib/store/home-content";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const defaultTestimonials = [
    { id: "1", name: "Alex Thompson", role: "CTO, Finova Labs", quote: "Oftisoft transformed our monolithic banking system into a microservices architecture. 99.9% uptime, 60% reduced latency, and their team was a true partner throughout.", avatar: "", gradient: "from-blue-500 to-cyan-500" },
    { id: "2", name: "Sarah Chen", role: "CEO, HealthBridge AI", quote: "The AI-powered diagnostics module they built for us is incredible. Approval workflows automated, accuracy improved by 40%, and their team delivered 2 weeks early.", avatar: "", gradient: "from-purple-500 to-pink-500" },
    { id: "3", name: "Michael Rodriguez", role: "VP Eng, MarketPro", quote: "They built our entire multi-vendor marketplace from scratch. 5,000 vendors onboarded in the first quarter. The automated payout system alone saved us 200 engineering hours monthly.", avatar: "", gradient: "from-green-500 to-teal-500" },
    { id: "4", name: "Priya Sharma", role: "Founder, EduSpark", quote: "Our edtech platform needed to scale from 1,000 to 100,000 concurrent users overnight. Oftisoft's architecture handled it seamlessly. Zero downtime during the transition.", avatar: "", gradient: "from-orange-500 to-red-500" },
    { id: "5", name: "James Wilson", role: "Director, DataSync Inc.", quote: "The real-time data pipeline they engineered processes millions of events daily with sub-50ms latency. Their Kafka and gRPC expertise is world-class.", avatar: "", gradient: "from-indigo-500 to-violet-500" },
    { id: "6", name: "Fatima Al-Rashid", role: "COO, CloudBase", quote: "Professional, responsive, and technically exceptional. Oftisoft handled our HIPAA-compliant infrastructure setup and trained our team on the new stack in under 3 months.", avatar: "", gradient: "from-cyan-500 to-blue-500" },
];

export default function Testimonials() {
    const { content } = useHomeContentStore();
    const testimonialsContent = content?.testimonials || {
        title: "Voices of",
        subtitle: "Innovation.",
        badge: "Trusted by Market Leaders",
        testimonials: defaultTestimonials
    };

    // Ensure testimonials is always an array
  const testimonialsList = Array.isArray(testimonialsContent.testimonials)
        ? testimonialsContent.testimonials
        : [];

    // Duplicate for infinite loop
  const loopTestimonials = [
        ...testimonialsList,
        ...testimonialsList,
        ...testimonialsList
    ];

    return (
        <section className="py-24 md:py-32 bg-transparent relative overflow-hidden z-10 text-center">
            {/* Background Light */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />

            <div className="container px-4 mx-auto mb-16 md:mb-20">
                <AnimatedDiv 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ duration: 0.5 }}
                    style={{ willChange: "transform, opacity" }}
                >
                    <Badge variant="outline" className="mb-6 px-4 py-2 border-white/10 bg-white/5 backdrop-blur-md text-white/90 gap-2 hover:bg-white/10 transition-colors">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        {testimonialsContent.badge}
                    </Badge>
                    <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight">
                        {testimonialsContent.title} <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                            {testimonialsContent.subtitle}
                        </span>
                    </h2>
                </AnimatedDiv>
            </div>

            {/* Marquee Container */}
            <div className="relative w-full overflow-hidden mask-gradient-x">
                <div className="flex items-stretch gap-6 animate-marquee hover:pause whitespace-nowrap py-10">
                    {loopTestimonials.map((t: any, i: number) => (
                        <TestimonialCard key={i} data={t} index={i} />
                    ))}
                </div>
            </div>

            <style jsx global>{`
                .pause:hover { animation-play-state: paused; }
                .mask-gradient-x {
                    mask-image: linear-gradient(to right, transparent, black 20%, black 80%, transparent);
                }
                @keyframes marquee {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                .animate-marquee {
                    animation: marquee 60s linear infinite;
                }
                /* Mobile optimization */
                @media (max-width: 768px) {
                    .animate-marquee { animation-duration: 40s; }
                }
            `}</style>
        </section>
    );
}

function TestimonialCard({ data, index }: { data: any, index: number }) {
    return (
        <div className="w-[320px] md:w-[450px] shrink-0 p-[1px] relative group h-full flex">
            {/* Gradient Border Glow */}
            <div className={cn(
                "absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-r blur-xl -z-10",
                data.gradient
            )} />

            <Card className="bg-[#050505]/80 backdrop-blur-xl border-white/5 group-hover:bg-[#0a0a0a]/90 transition-colors rounded-3xl overflow-hidden flex flex-col justify-between h-[360px]">
                <CardContent className="p-8 pb-0">
                    <div className="mb-6">
                        <div className="flex gap-1 mb-4">
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} className="w-4 h-4 text-yellow-500/50 fill-current group-hover:text-yellow-500 transition-colors" />
                            ))}
                        </div>
                        <p className="text-base md:text-lg text-muted-foreground/90 leading-relaxed font-normal whitespace-normal">
                            "{data.quote}"
                        </p>
                    </div>
                </CardContent>
                
                <CardFooter className="p-8 pt-6 border-t border-white/5 mt-auto bg-white/[0.02]">
                    <div className="flex items-center gap-4 w-full">
                        <Avatar className={cn("h-12 w-12 border-2 border-transparent group-hover:border-primary/50 transition-colors", data.gradient.replace("from-", "bg-"))}>
                             <AvatarImage src={data.avatar} alt={data.name} />
                             <AvatarFallback className={cn("text-white font-bold bg-gradient-to-br", data.gradient)}>{data.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        
                        <div className="text-left flex-1 min-w-0">
                            <h4 className="text-white font-bold text-sm tracking-wide truncate">{data.name}</h4>
                            <p className="text-xs text-muted-foreground font-medium tracking-wide truncate">{data.role}</p>
                        </div>
                        
                        <Quote className="w-8 h-8 text-white/5 ml-auto group-hover:text-white/10 transition-colors shrink-0" />
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
}
