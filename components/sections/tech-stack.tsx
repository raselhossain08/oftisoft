
"use client";

import { motion } from "framer-motion";
import { 
    Code2, 
    Database, 
    Globe, 
    Server, 
    Cpu, 
    Cloud, 
    Layers, 
    Zap,
    Box,
    Terminal,
    Repeat
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useHomeContentStore } from "@/lib/store/home-content";

const iconMap: Record<string, any> = {
    Code2,
    Database,
    Globe,
    Server,
    Cpu,
    Cloud,
    Layers,
    Zap,
    Box,
    Terminal,
    Repeat
};

import { Badge } from "@/components/ui/badge";

export default function TechStack() {
    // Get content from CMS store
    const { content } = useHomeContentStore();
    const techStackContent = content?.techStack || {
        title: "Powered By Modern Tech",
        subtitle: "Tech Stack",
        badge: "Powered By Modern Tech",
        technologies: []
    };

    return (
        <section className="py-24 bg-transparent border-t border-white/5 relative overflow-hidden z-20">
            {/* Background Texture */}
            <div className="absolute inset-0 bg-transparent" />
            
            <div className="container px-4 mx-auto mb-16 text-center">
                 <Badge variant="outline" className="text-base py-2 px-6 border-white/10 text-white/80 tracking-widest uppercase bg-white/5 backdrop-blur-sm">
                    {techStackContent.badge}
                </Badge>
            </div>
            
            <div className="relative flex flex-col gap-8 mask-gradient-x">
                {/* Row 1: Left Scroll */}
                <div className="flex gap-4 animate-scroll-left min-w-full hover:pause">
                    {[...techStackContent.technologies, ...techStackContent.technologies, ...techStackContent.technologies, ...techStackContent.technologies].map((tech: any, i: number) => (
                        <TechPill key={`r1-${i}`} tech={tech} />
                    ))}
                </div>

                {/* Row 2: Right Scroll (Slower) */}
                 <div className="flex gap-4 animate-scroll-right min-w-full hover:pause">
                    {[...techStackContent.technologies, ...techStackContent.technologies, ...techStackContent.technologies, ...techStackContent.technologies].map((tech: any, i: number) => (
                        <TechPill key={`r2-${i}`} tech={tech} />
                    ))}
                </div>
            </div>

            <style jsx global>{`
                .mask-gradient-x { mask-image: linear-gradient(to right, transparent, black 15%, black 85%, transparent); }
                .pause:hover { animation-play-state: paused; }
                
                @keyframes scroll-left {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                @keyframes scroll-right {
                    0% { transform: translateX(-50%); }
                    100% { transform: translateX(0); }
                }

                .animate-scroll-left { animation: scroll-left 40s linear infinite; }
                .animate-scroll-right { animation: scroll-right 45s linear infinite; }

                /* Mobile optimization - slightly faster/slower depending on preference, but 40s is usually fine */
                @media (max-width: 768px) {
                     .animate-scroll-left { animation-duration: 30s; }
                     .animate-scroll-right { animation-duration: 35s; }
                }
            `}</style>
        </section>
    );
}

function TechPill({ tech }: { tech: any }) {
    const Icon = iconMap[tech.icon] || Globe;
    return (
        <Badge 
            variant="secondary"
            className="flex items-center gap-3 px-6 py-3 rounded-full bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/20 transition-all cursor-default shrink-0 h-auto pointer-events-auto group"
        >
             <div className={cn("p-1.5 rounded-full bg-white/5 group-hover:scale-110 transition-transform", tech.color)}>
                <Icon className="w-4 h-4 fill-current/20" />
             </div>
             <span className="text-sm font-semibold text-white/60 group-hover:text-white transition-colors whitespace-nowrap">
                {tech.name}
             </span>
        </Badge>
    );
}
