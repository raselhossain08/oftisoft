"use client"
import { AnimatedDiv, AnimatedSpan, useSpring, useTransform, Animated } from "@/lib/animated";
import { useRef, useState } from "react";
import CountUp from "react-countup";
import { Code2, Brain, Sparkles, Send, Github, Linkedin, Twitter } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function FounderIntro({ data }: { data?: any }) {
    const founder = data;
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const mouseX = useSpring(mousePos.x, { stiffness: 150, damping: 15 });
    const mouseY = useSpring(mousePos.y, { stiffness: 150, damping: 15 });
    const rotateX = useTransform(mouseY, [-300, 300], [8, -8]);
    const rotateY = useTransform(mouseX, [-300, 300], [-8, 8]);

    return (
        <section className="py-24 bg-transparent relative overflow-visible z-10">
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] pointer-events-none -translate-y-1/2 translate-x-1/2" />
            <div className="container px-4 mx-auto">
                <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">

<AnimatedDiv onMouseMove={(e: React.MouseEvent<HTMLDivElement>) => {
                        const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
                        setMousePos({ x: e.clientX - left - width / 2, y: e.clientY - top - height / 2 });
                    }}
                        onMouseLeave={() => setMousePos({ x: 0, y: 0 })}
                        className="relative perspective-1000 w-full max-w-md mx-auto"
                    >
                        <AnimatedDiv style={{ transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`, transformStyle: "preserve-3d" }}
                            className="relative aspect-[3/4] rounded-3xl bg-[#0a0a0a]/80 backdrop-blur-xl border border-white/10 p-2 shadow-2xl overflow-hidden group will-change-transform"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-purple-500/20 opacity-50 rounded-3xl -z-10 group-hover:opacity-100 transition-opacity duration-700" />
                            <div className="relative w-full h-full rounded-2xl overflow-hidden bg-neutral-900 border border-white/5">
                                {founder?.image ? (
                                    <Image src={founder.image} alt={founder.name} fill className="object-cover" />
                                ) : (
                                    <div className="absolute inset-0 bg-gradient-to-b from-neutral-800 to-black flex items-center justify-center text-neutral-700 font-bold text-6xl opacity-20">
                                        {founder?.name?.split(" ").map((n: string) => n[0]).join("") || "RH"}
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80" />
                            </div>
                            <AnimatedDiv style={{ transform: "translateZ(40px)" }} className="absolute bottom-8 left-8 right-8">
                                <div className="flex items-center gap-2 mb-2">
                                    <Badge variant="secondary" className="px-3 py-1 bg-primary/20 border-primary/20 text-primary text-sm font-semibold tracking-wide backdrop-blur-md">
                                        {founder?.role ?? ""}
                                    </Badge>
                                </div>
                                <h3 className="text-3xl font-bold text-white mb-1">{founder?.name ?? ""}</h3>
                                <p className="text-white/60 text-base md:text-lg mb-6">{founder?.tagline ?? ""}</p>
                                <div className="flex gap-3">
                                    {[
                                        { Icon: Github, href: founder?.socials.github },
                                        { Icon: Linkedin, href: founder?.socials.linkedin },
                                        { Icon: Twitter, href: founder?.socials.twitter }
                                    ].map(({ Icon, href }, i) => (
                                        <Button key={i} variant="outline" size="icon" className="w-10 h-10 rounded-full bg-white/10 hover:bg-white hover:text-black border-white/5 transition-all duration-300" asChild>
                                            <Link href={href || '#'}><Icon className="w-5 h-5" /></Link>
                                        </Button>
                                    ))}
                                </div>
                            </AnimatedDiv>
                        </AnimatedDiv>
                        <AnimatedDiv animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                            className="absolute -top-12 -right-12 w-64 h-64 border border-dashed border-white/10 rounded-full -z-10 pointer-events-none" />
                        <AnimatedDiv animate={{ rotate: -360 }} transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                            className="absolute -bottom-12 -left-12 w-80 h-80 border border-dashed border-white/5 rounded-full -z-10 pointer-events-none" />
                    </AnimatedDiv>

                    <div className="space-y-8">
                        <div>
                            <AnimatedDiv initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.5 }} className="mb-4">
                                <Badge variant="outline" className="gap-2 border-primary/20 text-primary tracking-wide px-3 py-1 bg-primary/5 font-semibold text-sm">
                                    <Sparkles className="w-4 h-4 text-primary animate-pulse" />
                                    {founder?.badgeTitle ?? ""}
                                </Badge>
                            </AnimatedDiv>
                            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
                                {founder?.titleLine1 ?? ""} <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                                    {founder?.titleLine2 ?? ""}
                                </span>
                            </h2>
                        </div>

                        <div className="prose prose-invert prose-lg text-muted-foreground/80 leading-relaxed">
                            <p>{founder?.bioPar1 ?? ""}</p>
                            <p>{founder?.bioPar2 ?? ""}</p>
                        </div>

                        <div className="grid grid-cols-3 gap-4 md:gap-8 py-8 border-y border-white/5 text-center md:text-left">
                            {(founder?.stats || []).map((stat: any, idx: number) => (
                                <StatBlock key={idx} num={stat.num} label={stat.label} suffix={stat.suffix} delay={idx * 0.1} />
                            ))}
                        </div>

                        <div className="pt-4 flex items-center gap-8">
                            <div className="opacity-70 grayscale hover:grayscale-0 transition-all duration-500">
<svg width="180" height="50" viewBox="0 0 200 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M10 40 C 30 10, 60 60, 90 30 C 120 0, 150 50, 190 20"
                                        stroke="white" strokeWidth="3" strokeLinecap="round"
                                        className="opacity-70"
                                    />
                                    <text x="50" y="55" className="fill-white text-[10px] font-mono tracking-wide opacity-50">Founder's Signature</text>
                                </svg>
                            </div>
                            <Link href="#contact" className="group flex items-center gap-2 text-white font-medium hover:text-primary transition-colors">
                                Let's Talk
                                <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

function StatBlock({ num, label, suffix, delay }: { num: number, label: string, suffix: string, delay: number }) {
    return (
        <AnimatedDiv initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }} transition={{ delay, duration: 0.4 }}>
            <div className="text-4xl font-bold text-white mb-1 flex items-baseline">
                <CountUp end={num} duration={2.5} />
                <span className="text-primary text-2xl ml-1">{suffix}</span>
            </div>
            <div className="text-sm text-muted-foreground tracking-wide font-medium">{label}</div>
        </AnimatedDiv>
    );
}

