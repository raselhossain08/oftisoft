
"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Facebook, Twitter, Instagram, Linkedin, Heart, Mail, MapPin, Phone, ArrowRight } from "lucide-react";

const socialLinks = [
    { icon: Facebook, href: "#", color: "hover:text-blue-600" },
    { icon: Twitter, href: "#", color: "hover:text-blue-400" },
    { icon: Instagram, href: "#", color: "hover:text-pink-600" },
    { icon: Linkedin, href: "#", color: "hover:text-blue-700" },
];

const services = [
    { label: "Web Development", href: "/services" },
    { label: "Mobile Solutions", href: "/services" },
    { label: "AI & Automation", href: "/services" },
    { label: "E-commerce", href: "/services" },
    { label: "Cloud & DevOps", href: "/services" },
];

const company = [
    { label: "About Us", href: "/about" },
    { label: "Our Work", href: "/portfolio" },
    { label: "Latest Insights", href: "/blog" },
    { label: "Careers", href: "#" },
    { label: "Contact", href: "#contact" },
];

export default function Footer() {
    return (
        <footer className="bg-card border-t border-border pt-20 pb-10 relative overflow-hidden">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-purple-500 to-secondary opacity-50" />
            <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-secondary/5 rounded-full blur-3xl pointer-events-none" />

            <div className="container px-4 mx-auto relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 mb-16">

                    {/* Brand Column */}
                    <div className="lg:col-span-4">
                        <Link href="/" className="inline-block text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary mb-6">
                            Ofitsoft
                        </Link>
                        <p className="text-muted-foreground mb-8 leading-relaxed max-w-sm">
                            Transforming your digital vision into reality with premium software solutions. Built for performance, scalability, and user experience.
                        </p>
                        <div className="flex gap-4">
                            {socialLinks.map((social, idx) => (
                                <a
                                    key={idx}
                                    href={social.href}
                                    className={`w-10 h-10 rounded-full bg-background border border-border flex items-center justify-center text-muted-foreground transition-all duration-300 hover:scale-110 hover:border-primary ${social.color}`}
                                >
                                    <social.icon className="w-5 h-5" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Links Column 1 */}
                    <div className="lg:col-span-2 lg:col-start-6">
                        <h4 className="font-bold text-foreground text-lg mb-6">Services</h4>
                        <ul className="space-y-4">
                            {services.map((item) => (
                                <li key={item.label}>
                                    <Link href={item.href} className="text-muted-foreground hover:text-primary transition-colors flex items-center group">
                                        <span className="w-0 overflow-hidden group-hover:w-3 transition-all duration-300 opacity-0 group-hover:opacity-100 mr-0 group-hover:mr-1">
                                            <ArrowRight className="w-3 h-3" />
                                        </span>
                                        {item.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Links Column 2 */}
                    <div className="lg:col-span-2">
                        <h4 className="font-bold text-foreground text-lg mb-6">Company</h4>
                        <ul className="space-y-4">
                            {company.map((item) => (
                                <li key={item.label}>
                                    <Link href={item.href} className="text-muted-foreground hover:text-primary transition-colors flex items-center group">
                                        <span className="w-0 overflow-hidden group-hover:w-3 transition-all duration-300 opacity-0 group-hover:opacity-100 mr-0 group-hover:mr-1">
                                            <ArrowRight className="w-3 h-3" />
                                        </span>
                                        {item.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Column */}
                    <div className="lg:col-span-3">
                        <h4 className="font-bold text-foreground text-lg mb-6">Get in Touch</h4>
                        <ul className="space-y-6">
                            <li className="flex items-start gap-3 text-muted-foreground">
                                <MapPin className="w-5 h-5 text-primary shrink-0 mt-1" />
                                <span>123 Innovation Dr,<br />Tech Valley, CA 94043</span>
                            </li>
                            <li className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors">
                                <Mail className="w-5 h-5 text-primary shrink-0" />
                                <a href="mailto:hello@ofitsoft.com">hello@ofitsoft.com</a>
                            </li>
                            <li className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors">
                                <Phone className="w-5 h-5 text-primary shrink-0" />
                                <a href="tel:+15551234567">+1 (555) 123-4567</a>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground gap-4">
                    <p>&copy; {new Date().getFullYear()} Ofitsoft. All rights reserved.</p>

                    <div className="flex gap-6">
                        <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
                        <a href="#" className="hover:text-primary transition-colors">Cookie Policy</a>
                    </div>

                    <p className="flex items-center">
                        Made with <Heart className="w-4 h-4 text-red-500 fill-red-500 mx-1 animate-pulse" /> by Rasel Hossain
                    </p>
                </div>
            </div>
        </footer>
    );
}
