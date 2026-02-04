
"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Facebook, Twitter, Instagram, Linkedin, Heart, Mail, MapPin, Phone, ArrowRight, Github, Send } from "lucide-react";
import { useState } from "react";

const socialLinks = [
    { icon: Github, href: "#", label: "GitHub" },
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Linkedin, href: "#", label: "LinkedIn" },
    { icon: Instagram, href: "#", label: "Instagram" },
];

const footerLinks = [
    {
        title: "Product",
        links: [
            { label: "Features", href: "/#features" },
            { label: "Integrations", href: "/#integrations" },
            { label: "Pricing", href: "/#pricing" },
            { label: "Changelog", href: "/changelog" },
            { label: "Docs", href: "/docs" },
        ]
    },
    {
        title: "Company",
        links: [
            { label: "About Us", href: "/about" },
            { label: "Careers", href: "/careers" },
            { label: "Blog", href: "/blog" },
            { label: "Contact", href: "/#contact" },
            { label: "Partners", href: "/partners" },
        ]
    },
    {
        title: "Resources",
        links: [
            { label: "Community", href: "/community" },
            { label: "Contact Support", href: "/support" },
            { label: "Status", href: "/status" },
            { label: "Terms of Service", href: "/terms" },
            { label: "Privacy Policy", href: "/privacy" },
        ]
    }
];

export default function Footer() {
    const [email, setEmail] = useState("");

    return (
        <footer className="relative bg-[#020202] pt-24 pb-12 overflow-hidden z-10 border-t border-white/5">
            {/* Background Texture */}
            <div className="absolute inset-0 bg-[url('https://grain-texture-url-here.png')] opacity-[0.03] pointer-events-none" />
            
            {/* Gradient Orb */}
            <div className="absolute -top-[300px] left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] pointer-events-none" />

            <div className="container px-4 mx-auto relative z-10">
                
                {/* Top Section: CTA & Newsletter */}
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-24 mb-20 border-b border-white/5 pb-16">
                    <div>
                        <Link href="/" className="inline-block text-2xl font-bold text-white mb-6">
                            Ofitsoft<span className="text-primary">.</span>
                        </Link>
                        <h3 className="text-3xl font-bold text-white mb-4 max-w-md">
                            Subscribe to our newsletter for the latest updates.
                        </h3>
                    </div>
                    
                    <div className="flex flex-col justify-center">
                        <form className="relative max-w-md w-full" onSubmit={(e) => e.preventDefault()}>
                            <input 
                                type="email" 
                                placeholder="Enter your email address" 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-6 py-4 rounded-full bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-all pr-12"
                            />
                            <button className="absolute right-2 top-2 p-2 rounded-full bg-primary hover:bg-primary/90 text-white transition-colors">
                                <ArrowRight className="w-5 h-5" />
                            </button>
                        </form>
                        <p className="text-sm text-muted-foreground mt-4">
                            Join 10,000+ developers. Unsubscribe at any time.
                        </p>
                    </div>
                </div>

                {/* Main Footer Links */}
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-y-12 gap-x-8 mb-20">
                    <div className="col-span-2 lg:col-span-2 space-y-6">
                        <p className="text-muted-foreground leading-relaxed max-w-xs">
                             Building the next generation of digital experiences. 
                             Based in San Francisco, operating globally.
                        </p>
                        <div className="flex gap-4">
                            {socialLinks.map((social, idx) => (
                                <a
                                    key={idx}
                                    href={social.href}
                                    className="w-10 h-10 rounded-full bg-white/5 border border-white/5 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all"
                                    aria-label={social.label}
                                >
                                    <social.icon className="w-5 h-5" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {footerLinks.map((column, idx) => (
                        <div key={idx} className="col-span-1">
                            <h4 className="font-bold text-white mb-6">{column.title}</h4>
                            <ul className="space-y-4">
                                {column.links.map((link, i) => (
                                    <li key={i}>
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
                        &copy; {new Date().getFullYear()} Ofitsoft Inc. All rights reserved.
                    </p>
                    
                    <div className="flex items-center gap-2 text-sm text-muted-foreground/60 bg-white/5 px-4 py-2 rounded-full border border-white/5">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        All Systems Operational
                    </div>
                </div>
            </div>
        </footer>
    );
}
