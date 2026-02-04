"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay, EffectCreative } from "swiper/modules";
import { Twitter, Linkedin, Github, Globe, Sparkles } from "lucide-react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-creative";

const authors = [
    {
        name: "Rasel Hossain",
        role: "Founder & CEO @ Ofitsoft",
        bio: "Passionate software engineer with 6+ years of experience helping startups and enterprises scale their digital products. I write about React, Next.js, System Architecture, and AI.",
        image: null, // Placeholder used if null
        initials: "RH",
        stats: [
            { label: "Articles", value: "150+" },
            { label: "Readers", value: "50k+" },
            { label: "Followers", value: "12k+" },
        ],
        tags: ["Architecture", "AI", "Frontend"],
        socials: {
            twitter: "#",
            linkedin: "#",
            github: "#"
        }
    },
    {
        name: "Sarah Jenkins",
        role: "Lead UI/UX Designer",
        bio: "Creative force behind intuitive digital experiences. Specializing in micro-interactions, accessibility, and design systems that bridge the gap between aesthetics and functionality.",
        image: null,
        initials: "SJ",
        stats: [
            { label: "Designs", value: "80+" },
            { label: "Awards", value: "12" },
            { label: "Students", value: "5k+" },
        ],
        tags: ["UI/UX", "Figma", "Design Systems"],
        socials: {
            twitter: "#",
            linkedin: "#",
            website: "#"
        }
    },
    {
        name: "David Chen",
        role: "Senior Backend Engineer",
        bio: "Architecting scalable cloud solutions and optimizing database performance. Deeply interested in distributed systems, Rust, and serverless technologies.",
        image: null,
        initials: "DC",
        stats: [
            { label: "APIs", value: "200+" },
            { label: "Uptime", value: "99.9%" },
            { label: "Contribs", value: "1.2k" },
        ],
        tags: ["Backend", "Cloud", "DevOps"],
        socials: {
            github: "#",
            linkedin: "#",
            website: "#"
        }
    }
];

export default function AuthorSpotlight() {
    const [activeIndex, setActiveIndex] = useState(0);

    return (
        <section className="py-24 bg-gradient-to-b from-background via-background/95 to-muted/20 overflow-hidden relative">
            {/* Background Decorations */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[20%] left-[10%] w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px]" />
                <div className="absolute bottom-[20%] right-[10%] w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[100px]" />
            </div>

            <div className="container px-4 mx-auto relative z-10">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4 backdrop-blur-sm border border-primary/20">
                        <Sparkles className="w-4 h-4" />
                        <span>Creative Minds</span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
                        Author Spotlight
                    </h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
                        Meet the brilliant minds sharing insights, tutorials, and deep dives into the world of technology and design.
                    </p>
                </motion.div>

                <div className="max-w-5xl mx-auto">
                    <Swiper
                        modules={[Pagination, Autoplay, EffectCreative]}
                        effect={'creative'}
                        creativeEffect={{
                            prev: {
                                shadow: false,
                                translate: [0, 0, -400],
                            },
                            next: {
                                translate: ['100%', 0, 0],
                            },
                        }}
                        autoplay={{ delay: 5000, disableOnInteraction: false }}
                        pagination={{ 
                            clickable: true,
                            type: 'bullets',
                            bulletClass: 'swiper-pagination-bullet !bg-primary/20 !opacity-100 !w-3 !h-3 !mx-2 transition-all duration-300',
                            bulletActiveClass: '!bg-primary !w-8 rounded-full'
                        }}
                        onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
                        className="!pb-16"
                    >
                        {authors.map((author, index) => (
                            <SwiperSlide key={index}>
                                <div className="bg-card/50 backdrop-blur-xl border border-white/10 dark:border-white/5 rounded-[2rem] p-8 md:p-12 shadow-2xl overflow-hidden relative group">
                                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                    
                                    <div className="grid md:grid-cols-[300px_1fr] gap-10 items-center relative z-10">
                                        {/* Avatar Section */}
                                        <div className="relative mx-auto md:mx-0">
                                            <div className="relative w-64 h-64 mx-auto">
                                                <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
                                                    <circle className="text-muted stroke-current" strokeWidth="2" cx="50" cy="50" r="48" fill="transparent" />
                                                    <motion.circle 
                                                        className="text-primary stroke-current" 
                                                        strokeWidth="2" 
                                                        cx="50" 
                                                        cy="50" 
                                                        r="48" 
                                                        fill="transparent" 
                                                        strokeDasharray="301.59"
                                                        strokeDashoffset="301.59"
                                                        animate={{ strokeDashoffset: activeIndex === index ? 0 : 301.59 }}
                                                        transition={{ duration: 1.5, ease: "easeInOut" }}
                                                    />
                                                </svg>
                                                <div className="absolute inset-4 rounded-full overflow-hidden border-4 border-background shadow-inner bg-muted">
                                                    {author.image ? (
                                                        <img src={author.image} alt={author.name} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center text-6xl text-slate-400 font-bold">
                                                            {author.initials}
                                                        </div>
                                                    )}
                                                </div>
                                                
                                                <motion.div 
                                                    initial={{ scale: 0 }}
                                                    animate={{ scale: activeIndex === index ? 1 : 0 }}
                                                    transition={{ delay: 0.5, type: "spring" }}
                                                    className="absolute bottom-6 right-2 bg-background p-2 rounded-full shadow-lg border border-border"
                                                >
                                                    <div className="bg-primary text-primary-foreground text-[10px] font-bold px-2 py-1 rounded-full">
                                                        PRO
                                                    </div>
                                                </motion.div>
                                            </div>
                                        </div>

                                        {/* Content Section */}
                                        <div className="text-center md:text-left">
                                            <motion.div
                                                initial={{ opacity: 0, x: 20 }}
                                                animate={{ opacity: activeIndex === index ? 1 : 0, x: activeIndex === index ? 0 : 20 }}
                                                transition={{ delay: 0.2 }}
                                            >
                                                <h3 className="text-3xl font-bold mb-2">{author.name}</h3>
                                                <p className="text-primary font-medium text-lg mb-6">{author.role}</p>
                                            </motion.div>

                                            <motion.p 
                                                className="text-muted-foreground mb-8 text-lg leading-relaxed"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: activeIndex === index ? 1 : 0 }}
                                                transition={{ delay: 0.3 }}
                                            >
                                                {author.bio}
                                            </motion.p>

                                            {/* Stats Grid */}
                                            <div className="grid grid-cols-3 gap-4 mb-8 border-y border-border/50 py-6">
                                                {author.stats.map((stat, i) => (
                                                    <motion.div 
                                                        key={stat.label}
                                                        initial={{ opacity: 0, y: 10 }}
                                                        animate={{ opacity: activeIndex === index ? 1 : 0, y: activeIndex === index ? 0 : 10 }}
                                                        transition={{ delay: 0.4 + (i * 0.1) }}
                                                        className="text-center md:text-left"
                                                    >
                                                        <div className="font-bold text-2xl text-foreground">{stat.value}</div>
                                                        <div className="text-xs text-muted-foreground uppercase tracking-wider">{stat.label}</div>
                                                    </motion.div>
                                                ))}
                                            </div>

                                            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                                                <motion.div 
                                                    className="flex flex-wrap gap-2 justify-center md:justify-start"
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: activeIndex === index ? 1 : 0 }}
                                                    transition={{ delay: 0.6 }}
                                                >
                                                    {author.tags.map(tag => (
                                                        <span key={tag} className="px-3 py-1 bg-muted/50 hover:bg-primary/10 hover:text-primary transition-colors rounded-full text-xs font-medium border border-border">
                                                            #{tag}
                                                        </span>
                                                    ))}
                                                </motion.div>

                                                <motion.div 
                                                    className="flex gap-3"
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: activeIndex === index ? 1 : 0 }}
                                                    transition={{ delay: 0.7 }}
                                                >
                                                    {author.socials.twitter && (
                                                        <a href={author.socials.twitter} className="p-2.5 rounded-full bg-muted hover:bg-black hover:text-white transition-all hover:scale-110">
                                                            <Twitter className="w-5 h-5" />
                                                        </a>
                                                    )}
                                                    {author.socials.linkedin && (
                                                        <a href={author.socials.linkedin} className="p-2.5 rounded-full bg-muted hover:bg-[#0077b5] hover:text-white transition-all hover:scale-110">
                                                            <Linkedin className="w-5 h-5" />
                                                        </a>
                                                    )}
                                                    {author.socials.github && (
                                                        <a href={author.socials.github} className="p-2.5 rounded-full bg-muted hover:bg-black hover:text-white transition-all hover:scale-110">
                                                            <Github className="w-5 h-5" />
                                                        </a>
                                                    )}
                                                    {author.socials.website && (
                                                        <a href={author.socials.website} className="p-2.5 rounded-full bg-muted hover:bg-primary hover:text-primary-foreground transition-all hover:scale-110">
                                                            <Globe className="w-5 h-5" />
                                                        </a>
                                                    )}
                                                </motion.div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            </div>
        </section>
    );
}
