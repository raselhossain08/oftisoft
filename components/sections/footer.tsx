"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Facebook, Twitter, Instagram, Linkedin, Heart, Mail, MapPin, Phone, ArrowRight, Github, Send } from "lucide-react";
import { useState } from "react";
import { useFooterContentStore } from "@/lib/store/footer-content";
import { useLeads } from "@/hooks/useLeads";

const iconMap: Record<string, any> = {
    Github,
    Twitter,
    Linkedin,
    Instagram,
    Facebook,
    Mail,
    MapPin,
    Phone,
};

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Footer() {
    const { content } = useFooterContentStore();
    const { subscribe, isSubscribing } = useLeads();
    const [email, setEmail] = useState("");

    const handleSubscribe = (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;
        subscribe(email, {
            onSuccess: () => setEmail("")
        });
    };

    if (!content) return null;

    return (
        <footer className="relative bg-[#020202] pt-24 pb-12 overflow-hidden z-10 border-t border-white/5">
            {/* Background Texture */}
            <div className="absolute inset-0 bg-grain opacity-[0.03] pointer-events-none" />
            
            {/* Gradient Orb */}
            <div className="absolute -top-[300px] left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] pointer-events-none" />

            <div className="container px-4 mx-auto relative z-10">
                
               {/* Top Section: CTA & Newsletter */}
               <div className="grid lg:grid-cols-2 gap-8 lg:gap-24 mb-16 md:mb-20 border-b border-white/5 pb-12 md:pb-16">
                   <div className="text-center lg:text-left">
                       <Link href="/" className="inline-block text-2xl font-bold text-white mb-4">
                           {content.brandName}<span className="text-primary">.</span>
                       </Link>
                       <h3 className="text-2xl md:text-3xl font-bold text-white mb-2 max-w-md mx-auto lg:mx-0">
                           {content.newsletterTitle}
                       </h3>
                        <p className="text-muted-foreground text-sm md:text-base mb-6 lg:mb-0">
                           {content.newsletterDescription}
                       </p>
                   </div>
                   
                   <div className="flex flex-col justify-center items-center lg:items-end">
                       <form className="relative max-w-md w-full flex flex-col sm:flex-row gap-3" onSubmit={handleSubscribe}>
                           <Input 
                                 type="email" 
                                 required
                                 placeholder={content.newsletterPlaceholder}
                                 value={email}
                                 onChange={(e) => setEmail(e.target.value)}
                                 className="w-full h-12 rounded-xl bg-white/5 border-white/10 text-white placeholder:text-white/30 focus-visible:ring-primary/50 focus-visible:bg-white/10 transition-all"
                             />
                             <Button size="icon" type="submit" disabled={isSubscribing} className="h-12 w-12 shrink-0 rounded-xl bg-primary hover:bg-primary/90 text-white transition-colors hidden sm:flex items-center justify-center">
                                {isSubscribing ? <span className="w-4 h-4 border-2 border-white/50 border-t-white rounded-full animate-spin" /> : <ArrowRight className="w-5 h-5" />}
                             </Button>
                             <Button type="submit" disabled={isSubscribing} className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90 text-white font-medium sm:hidden">
                                {isSubscribing ? "Subscribing..." : content.newsletterButtonText}
                             </Button>
                        </form>
                        <p className="text-xs text-muted-foreground mt-4 text-center lg:text-right w-full max-w-md">
                            {content.newsletterDisclaimer}
                        </p>
                    </div>
                </div>

                {/* Main Footer Links */}
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-y-12 gap-x-8 mb-20">
                    <div className="col-span-2 lg:col-span-2 space-y-6">
                        <p className="text-muted-foreground leading-relaxed max-w-xs">
                             {content.tagline} {content.description}
                        </p>
                        <div className="flex gap-4">
                        {(content.socialLinks || []).map((social, i) => {
                            const Icon = iconMap[social.icon] || Github;
                            return (
                                <a
                                    key={social.id || i}
                                    href={social.href}
                                    className="w-10 h-10 rounded-full bg-white/5 border border-white/5 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all"
                                    aria-label={social.label}
                                >
                                    <Icon className="w-5 h-5" />
                                </a>
                            );
                        })}
                        </div>
                    </div>

                    {(content.columns || []).map((column, i) => (
                        <div key={column.id || i} className="col-span-1">
                            <h4 className="font-bold text-white mb-6">{column.title}</h4>
                            <ul className="space-y-4">
                                {(column.links || []).map((link, j) => (
                                    <li key={link.id || j}>
                                        <Link 
                                            href={link.href} 
                                            className="text-sm text-muted-foreground hover:text-white transition-colors flex items-center group w-fit"
                                        >
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
                     <p className="text-sm text-muted-foreground text-center md:text-left">
                        {content.copyright}
                    </p>
                    
                    <div className="flex items-center gap-2 text-sm text-muted-foreground/60 bg-white/5 px-4 py-2 rounded-full border border-white/5">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        {content.statusText}
                    </div>
                </div>
            </div>
        </footer>
    );
}
