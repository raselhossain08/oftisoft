
"use client";

import { motion } from "framer-motion";
import { Lightbulb, Award, Handshake, Target, Zap, Heart, ShieldCheck } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { cn } from "@/lib/utils";

const values = [
    {
        title: "Innovation First",
        icon: Zap,
        desc: "We don't just follow trends; we set them. Exploring the bleeding edge to give you the advantage.",
        gradient: "from-amber-400 to-orange-500"
    },
    {
        title: "Pixel Perfection",
        icon: Award,
        desc: "Quality isn't an act, it's a habit. We obsess over every pixel and every line of code.",
        gradient: "from-purple-500 to-pink-500"
    },
    {
        title: "Radical Transparency",
        icon: Handshake,
        desc: "No hidden costs, no jargon. We build partnerships based on total honesty and clarity.",
        gradient: "from-cyan-400 to-blue-500"
    },
    {
        title: "User Obsession",
        icon: Heart,
        desc: "We design with empathy. Your users' delight is our ultimate metric of success.",
        gradient: "from-red-500 to-rose-500"
    }
];

export default function MissionValues() {
    return (
        <section className="py-24 md:py-32 bg-transparent relative overflow-hidden z-20">
            {/* Background Texture */}
            <div className="absolute inset-0 bg-[url('https://grain-texture-url-here.png')] opacity-[0.03] pointer-events-none" />

            <div className="container px-4 mx-auto">
                
                {/* Mission Statement */}
                <div className="grid lg:grid-cols-2 gap-16 mb-24 items-center">
                    <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-sm font-bold text-primary tracking-[0.2em] uppercase mb-4">
                            Our DNA
                        </h2>
                        <h3 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                            Driven by Purpose, <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                                Define by Quality.
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
                            To empower bold visionaries with <span className="text-white font-medium">intelligent, scalable, and premium</span> digital ecosystems that not only solve problems but inspire the next generation of users.
                        </p>
                    </motion.div>
                </div>

                {/* Values Grid - Desktop */}
                <div className="hidden lg:grid grid-cols-4 gap-6">
                    {values.map((item, index) => (
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
                        {values.map((item, index) => (
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

function ValueCard({ item, index, isMobile = false }: { item: typeof values[0], index: number, isMobile?: boolean }) {
    return (
        <motion.div
            initial={!isMobile ? { opacity: 0, y: 30 } : {}}
            whileInView={!isMobile ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: index * 0.1 }}
            viewport={{ once: true }}
            className="group relative h-full bg-[#0a0a0a] border border-white/10 p-8 rounded-[2rem] overflow-hidden hover:border-white/20 transition-all duration-500 flex flex-col"
        >
            {/* Hover Gradient Background */}
            <div className={cn(
                "absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 bg-gradient-to-br",
                item.gradient
            )} />

            {/* Icon */}
            <div className={cn(
                "w-14 h-14 rounded-2xl flex items-center justify-center mb-6 text-white bg-gradient-to-br shadow-inner",
                item.gradient
            )}>
                <item.icon className="w-7 h-7" />
            </div>

            {/* Content */}
            <h4 className="text-xl font-bold text-white mb-3 group-hover:text-primary transition-colors">
                {item.title}
            </h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
                {item.desc}
            </p>

            {/* Decorative Corner */}
            <div className={cn(
                "absolute -bottom-10 -right-10 w-24 h-24 rounded-full blur-2xl opacity-0 group-hover:opacity-40 transition-opacity duration-500",
                item.gradient.split(" ")[1]
            )} />
        </motion.div>
    );
}
