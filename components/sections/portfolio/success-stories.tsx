"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import CountUp from "react-countup";
import { TrendingUp, Users, Zap, DollarSign, Star, Quote, ArrowRight } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, EffectCards } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-cards";
import { useRef } from "react";
import { cn } from "@/lib/utils";

const testimonials = [
    {
        id: 1,
        quote: "Oftisoft transformed our legacy system into a state-of-the-art cloud platform. Our operational efficiency jumped by 200% in just three months.",
        author: "Sarah Connor",
        role: "CTO @ TechGlobal",
        image: null,
        impact: "+200% Efficiency"
    },
    {
        id: 2,
        quote: "The AI integration they built allowed us to automate 80% of our customer support. It's not just code; it's a business revolution.",
        author: "James Miller",
        role: "Founder @ FinScale",
        image: null,
        impact: "80% Automation"
    },
    {
        id: 3,
        quote: "Their design team is world-class. We went from a generic SaaS to an award-winning brand identity that our customers love.",
        author: "Emily Chen",
        role: "VP Marketing @ LuxStream",
        image: null,
        impact: "3 Design Awards"
    }
];

const stats = [
    { 
        id: "revenue", 
        val: 250, 
        suffix: "%", 
        title: "Revenue Growth", 
        desc: "Average increase within 6 months", 
        icon: DollarSign,
        color: "text-emerald-500",
        bg: "bg-emerald-500/10"
    },
    { 
        id: "users", 
        val: 10, 
        suffix: "M+", 
        title: "Users Impacted", 
        desc: "Active users across our platforms", 
        icon: Users,
        color: "text-blue-500",
        bg: "bg-blue-500/10"
    },
    { 
        id: "uptime", 
        val: 99.9, 
        suffix: "%", 
        title: "System Uptime", 
        desc: "Enterprise-grade reliability guaranteed", 
        icon: Zap,
        color: "text-yellow-500",
        bg: "bg-yellow-500/10"
    },
    { 
        id: "roi", 
        val: 12, 
        suffix: "x", 
        title: "ROI Delivered", 
        desc: "Return on investment for clients", 
        icon: TrendingUp,
        color: "text-purple-500",
        bg: "bg-purple-500/10"
    }
];

export default function SuccessStories() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    const y = useTransform(scrollYProgress, [0, 1], [100, -100]);
    const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

    return (
        <section ref={containerRef} className="py-32 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/20 to-background pointer-events-none" />
            <div className="absolute top-1/4 left-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
            
            <div className="container px-4 mx-auto relative z-10">
                <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
                    
                    {/* Left: Testimonials Carousel */}
                    <motion.div 
                        style={{ opacity }}
                        className="w-full lg:w-1/2"
                    >
                         <div className="relative">
                            <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-purple-500/20 rounded-[2rem] blur-2xl opacity-50" />
                            
                            <Swiper
                                effect={'cards'}
                                grabCursor={true}
                                modules={[EffectCards, Autoplay, Pagination]}
                                className="w-full max-w-md mx-auto"
                                autoplay={{ delay: 5000 }}
                                pagination={{ clickable: true }}
                            >
                                {testimonials.map((t) => (
                                    <SwiperSlide key={t.id} className="bg-card border border-border rounded-3xl p-8 md:p-10 shadow-2xl">
                                        <div className="flex flex-col h-full justify-between min-h-[300px]">
                                            <div>
                                                <Quote className="w-12 h-12 text-primary/20 mb-6" />
                                                <p className="text-xl md:text-2xl font-medium leading-relaxed mb-8">
                                                    "{t.quote}"
                                                </p>
                                            </div>
                                            
                                            <div className="flex items-center justify-between border-t border-border pt-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center font-bold text-lg">
                                                        {t.author.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <h4 className="font-bold">{t.author}</h4>
                                                        <p className="text-sm text-muted-foreground">{t.role}</p>
                                                    </div>
                                                </div>
                                                <div className="hidden sm:block px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-bold">
                                                    {t.impact}
                                                </div>
                                            </div>
                                        </div>
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                        </div>
                    </motion.div>

                    {/* Right: Stats Grid */}
                    <div className="w-full lg:w-1/2">
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                        >
                            <h2 className="text-4xl md:text-5xl font-bold mb-6">
                                Real Results, <br />
                                <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600">
                                    Measurable Impact.
                                </span>
                            </h2>
                            <p className="text-xl text-muted-foreground mb-12 max-w-lg">
                                We delivered exceptional value to our partners through innovation, speed, and engineering excellence.
                            </p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                {stats.map((stat, i) => (
                                    <motion.div
                                        key={stat.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: i * 0.1 }}
                                        whileHover={{ y: -5 }}
                                        className="bg-card/50 backdrop-blur-sm border border-border rounded-2xl p-6 hover:shadow-lg transition-all group"
                                    >
                                        <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-colors", stat.bg)}>
                                            <stat.icon className={cn("w-6 h-6", stat.color)} />
                                        </div>
                                        <h3 className={cn("text-4xl font-bold mb-2", stat.color)}>
                                            <CountUp end={stat.val} decimals={stat.val % 1 !== 0 ? 1 : 0} duration={3} suffix={stat.suffix} />
                                        </h3>
                                        <p className="font-bold text-foreground">{stat.title}</p>
                                        <p className="text-sm text-muted-foreground">{stat.desc}</p>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    </div>

                </div>
            </div>
        </section>
    );
}
