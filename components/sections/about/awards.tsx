
"use client";

import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCards, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-cards";
import { Award, Star } from "lucide-react";

// Mock Awards
const awards = [
    { title: "Best Tech Startup", org: "Tech Awards 2024", year: "2024", color: "bg-blue-500" },
    { title: "Innovation in AI", org: "Global AI Summit", year: "2023", color: "bg-purple-500" },
    { title: "Top Web Agency", org: "Clutch", year: "2023", color: "bg-green-500" },
    { title: "Excellence in UI/UX", org: "Design Awards", year: "2022", color: "bg-pink-500" },
];

export default function Awards() {
    return (
        <section className="py-24 bg-card overflow-hidden">
            <div className="container px-4 mx-auto flex flex-col lg:flex-row items-center gap-16">

                <div className="flex-1 text-center lg:text-left">
                    <h2 className="text-3xl md:text-5xl font-bold mb-6">Recognition & <br /><span className="text-primary">Awards</span></h2>
                    <p className="text-muted-foreground text-lg mb-8 max-w-lg">
                        Our commitment to excellence has been recognized by leading organizations globally. We strive to set new benchmarks in the industry.
                    </p>

                    <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto lg:mx-0">
                        {['Google Partner', 'AWS Certified', 'Meta Devs', 'Microsoft'].map((partner) => (
                            <div key={partner} className="bg-background border border-border p-4 rounded text-center font-bold text-muted-foreground hover:text-foreground hover:border-primary transition-colors">
                                {partner}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex-1 w-full max-w-sm">
                    <Swiper
                        effect={'cards'}
                        grabCursor={true}
                        modules={[EffectCards, Autoplay]}
                        autoplay={{ delay: 2500, disableOnInteraction: false }}
                        className="w-[280px] h-[400px]"
                    >
                        {awards.map((award, index) => (
                            <SwiperSlide key={index} className="rounded-2xl bg-background border border-border shadow-2xl flex flex-col items-center justify-center p-8 text-center relative overflow-hidden">
                                <div className={`absolute top-0 w-full h-2 ${award.color}`} />

                                <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-6 relative">
                                    <Award className="w-10 h-10 text-primary" />
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                                        className="absolute inset-0 border-2 border-dashed border-primary/30 rounded-full"
                                    />
                                </div>

                                <h3 className="text-2xl font-bold mb-2">{award.title}</h3>
                                <p className="text-muted-foreground mb-4">{award.org}</p>
                                <span className="px-4 py-1 bg-primary/10 text-primary rounded-full font-bold text-sm">{award.year}</span>

                                <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-primary/5 rounded-full blur-2xl" />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>

            </div>
        </section>
    );
}
