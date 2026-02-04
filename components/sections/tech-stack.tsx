
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

// Organized into logical rows for visual balance
const row1 = [
    { name: "Next.js 14", icon: Globe, color: "text-white" },
    { name: "React", icon: Code2, color: "text-blue-400" },
    { name: "TypeScript", icon: Code2, color: "text-blue-500" },
    { name: "Tailwind", icon: Layers, color: "text-cyan-400" },
    { name: "Framer", icon: Zap, color: "text-pink-500" },
    { name: "Node.js", icon: Server, color: "text-green-500" },
];

const row2 = [
    { name: "PostgreSQL", icon: Database, color: "text-blue-300" },
    { name: "MongoDB", icon: Database, color: "text-green-400" },
    { name: "Redis", icon: Layers, color: "text-red-500" },
    { name: "Docker", icon: Box, color: "text-blue-500" },
    { name: "AWS", icon: Cloud, color: "text-orange-500" },
    { name: "Rust", icon: Terminal, color: "text-orange-400" },
    { name: "Python", icon: Terminal, color: "text-yellow-400" },
];


export default function TechStack() {
    return (
        <section className="py-24 bg-transparent border-t border-white/5 relative overflow-hidden z-20">
            {/* Background Texture */}
            <div className="absolute inset-0 bg-transparent" />
            
            <div className="container px-4 mx-auto mb-16 text-center">
                 <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-white/80 to-white/40 tracking-tight uppercase">
                    Powered By Modern Tech
                </h2>
            </div>
            
            <div className="relative flex flex-col gap-8 mask-gradient-x">
                {/* Row 1: Left Scroll */}
                <div className="flex gap-4 animate-scroll-left min-w-full hover:pause">
                    {[...row1, ...row1, ...row1, ...row1].map((tech, i) => (
                        <TechPill key={`r1-${i}`} tech={tech} />
                    ))}
                </div>

                {/* Row 2: Right Scroll (Slower) */}
                 <div className="flex gap-4 animate-scroll-right min-w-full hover:pause">
                    {[...row2, ...row2, ...row2, ...row2].map((tech, i) => (
                        <TechPill key={`r2-${i}`} tech={tech} />
                    ))}
                </div>
            </div>

            <style jsx global>{`
                .mask-gradient-x { mask-image: linear-gradient(to right, transparent, black 15%, black 85%, transparent); }
                .pause { animation-play-state: paused; }
                
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
            `}</style>
        </section>
    );
}

function TechPill({ tech }: { tech: typeof row1[0] }) {
    return (
        <div className="flex items-center gap-3 px-6 py-3 rounded-full bg-white/5 border border-white/5 backdrop-blur-sm group hover:bg-white/10 hover:border-white/20 transition-all cursor-default shrink-0">
             <div className={cn("p-1.5 rounded-full bg-white/5 group-hover:scale-110 transition-transform", tech.color)}>
                <tech.icon className="w-4 h-4 fill-current/20" />
             </div>
             <span className="text-sm font-semibold text-white/60 group-hover:text-white transition-colors">
                {tech.name}
             </span>
        </div>
    );
}
