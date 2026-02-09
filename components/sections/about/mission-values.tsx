
"use client";

import { motion } from "framer-motion";
import { Lightbulb, Award, Handshake, Target, Zap, Heart, ShieldCheck } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useAboutContentStore } from "@/lib/store/about-content";

const iconMap: any = {
    Zap,
    Award,
    Handshake,
    Heart,
    Target,
    ShieldCheck,
    Lightbulb
};

export default function MissionValues({ data }: { data?: any }) {
    const { content: storeContent } = useAboutContentStore();
    const mission = data?.mission || data || storeContent?.mission; // Fallback to data itself if it's the mission object
    const values = data?.values || storeContent?.values || [];

    const gradients = [
        "from-amber-400 to-orange-500",
        "from-purple-500 to-pink-500",
        "from-cyan-400 to-blue-500",
        "from-red-500 to-rose-500"
    ];
    return (
        <section className="py-24 md:py-32 bg-transparent relative overflow-hidden z-20">
            {/* Background Texture */}
            <div className="absolute inset-0 bg-grain opacity-[0.03] pointer-events-none" />

            <div className="container px-4 mx-auto">
                
                {/* Mission Statement */}
                <div className="grid lg:grid-cols-2 gap-16 mb-24 items-center">
                    <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <Badge variant="outline" className="mb-6 border-primary/20 text-primary uppercase tracking-widest px-3 py-1 bg-primary/5 rounded-full">
                            {mission?.badge || "Our DNA"}
                        </Badge>
                        <h3 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                            {mission?.titleLine1 || "Driven by Purpose,"} <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                                {mission?.titleLine2 || "Define by Quality."}
                            </span>
                        </h3>
                    </motion.div>

                    <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="relative"
                    >
                        <div className="absolute -left-6 top-0 text-8xl font-serif text-white/5 -z-10 leading-none">"</div>
                        <p className="text-xl md:text-2xl text-muted-foreground/90 leading-relaxed font-light">
                            {mission?.quote?.split(mission.quoteHighlight || "")[0]}
                            <span className="text-white font-medium">{mission?.quoteHighlight}</span>
                            {mission?.quote?.split(mission.quoteHighlight || "")[1]}
                        </p>
                    </motion.div>
                </div>

                {/* Values Grid - Desktop */}
                <div className="hidden lg:grid grid-cols-4 gap-6">
                    {values.map((item: any, index: number) => (
                        <ValueCard key={index} item={item} index={index} />
                    ))}
                </div>

                {/* Values Carousel - Mobile/Tablet */}
                <div className="lg:hidden">
                    <Swiper
                        modules={[Pagination, Autoplay]}
                        spaceBetween={20}
                        slidesPerView={1.2}
                        centeredSlides={true}
                        loop={true}
                        autoplay={{ delay: 3000, disableOnInteraction: false }}
                        pagination={{ clickable: true, dynamicBullets: true }}
                        breakpoints={{
                            640: { slidesPerView: 2.2, centeredSlides: false, spaceBetween: 24 }
                        }}
                        className="pb-12"
                    >
                        {values.map((item: any, index: number) => (
                            <SwiperSlide key={index} className="h-auto">
                                <ValueCard item={item} index={index} isMobile />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>

            </div>
        </section>
    );
}

function ValueCard({ item, index, isMobile = false }: { item: any, index: number, isMobile?: boolean }) {
    const Icon = iconMap[item.icon] || Zap;
    const gradients = [
        "from-amber-400 to-orange-500",
        "from-purple-500 to-pink-500",
        "from-cyan-400 to-blue-500",
        "from-red-500 to-rose-500"
    ];
    const gradient = gradients[index % gradients.length];

    return (
        <motion.div
            initial={!isMobile ? { opacity: 0, y: 30 } : {}}
            whileInView={!isMobile ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: index * 0.1 }}
            viewport={{ once: true }}
            className="h-full"
        >
            <Card className="group relative h-full bg-[#0a0a0a] border-white/10 hover:border-white/20 transition-all duration-500 overflow-hidden rounded-[2rem] border p-0">
                <CardContent className="p-8 flex flex-col h-full relative z-10">
                    {/* Hover Gradient Background */}
                    <div className={cn(
                        "absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 bg-gradient-to-br",
                        gradient
                    )} />

                    {/* Icon */}
                    <div className={cn(
                        "w-14 h-14 rounded-2xl flex items-center justify-center mb-6 text-white bg-gradient-to-br shadow-inner",
                        gradient
                    )}>
                        <Icon className="w-7 h-7" />
                    </div>

                    {/* Content */}
                    <h4 className="text-xl font-bold text-white mb-3 group-hover:text-primary transition-colors">
                        {item.title}
                    </h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                        {item.description}
                    </p>
                </CardContent>

                {/* Decorative Corner */}
                <div className={cn(
                    "absolute -bottom-10 -right-10 w-24 h-24 rounded-full blur-2xl opacity-0 group-hover:opacity-40 transition-opacity duration-500 pointer-events-none",
                    gradient.split(" ")[1]
                )} />
            </Card>
        </motion.div>
    );
}