
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Menu, X, ArrowRight, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/services", label: "Services" },
    { href: "/portfolio", label: "Portfolio" },
    { href: "/blog", label: "Blog" },
];

export default function Navbar() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Lock body scroll when mobile menu is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
    }, [isOpen]);

    return (
        <>
            <motion.nav
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ type: "spring", stiffness: 100, damping: 20 }}
                className={cn(
                    "fixed top-0 left-0 right-0 z-50 flex justify-center transition-all duration-300",
                    scrolled ? "py-4" : "py-6"
                )}
            >
                <div 
                    className={cn(
                        "relative flex items-center justify-between transition-all duration-300",
                        scrolled 
                            ? "w-[95%] md:w-[85%] lg:w-[1200px] bg-background/60 backdrop-blur-xl border border-white/10 shadow-lg shadow-black/5 rounded-full px-6 py-3" 
                            : "w-full container px-4 bg-transparent border-transparent"
                    )}
                >
                    {/* Logo */}
                    <Link href="/" className="relative z-50 flex items-center gap-2 group">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-lg shadow-lg group-hover:shadow-primary/50 transition-all duration-300">
                           <span className="group-hover:rotate-12 transition-transform duration-300">O</span>
                        </div>
                        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70 group-hover:from-primary group-hover:to-secondary transition-all duration-300">
                            Ofitsoft
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-1 bg-secondary/5 rounded-full p-1 border border-white/5 mx-4">
                        {links.map((link) => {
                            const isActive = pathname === link.href;
                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={cn(
                                        "relative px-5 py-2 text-sm font-medium rounded-full transition-all duration-300",
                                        isActive ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                                    )}
                                >
                                    {isActive && (
                                        <motion.div
                                            layoutId="navbar-pill"
                                            className="absolute inset-0 bg-primary rounded-full shadow-md"
                                            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                        />
                                    )}
                                    <span className="relative z-10">{link.label}</span>
                                </Link>
                            );
                        })}
                    </div>

                    {/* Right Actions */}
                    <div className="hidden md:flex items-center gap-4">
                        <Link 
                            href="/dashboard/login" 
                            className="text-sm font-semibold text-muted-foreground hover:text-primary transition-colors"
                        >
                            Log in
                        </Link>
                        <Link 
                            href="/dashboard/register" 
                            className="group relative px-6 py-2.5 bg-foreground text-background font-bold text-sm rounded-full overflow-hidden transition-all hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:scale-105 active:scale-95"
                        >
                            <span className="relative z-10 flex items-center gap-2">
                                Get Started
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </span>
                             <div className="absolute inset-0 bg-gradient-to-r from-primary via-purple-500 to-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </Link>
                    </div>

                    {/* Mobile Toggle */}
                    <button 
                        className="md:hidden relative z-50 p-2 text-foreground hover:bg-secondary/10 rounded-full transition-colors" 
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </motion.nav>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="fixed inset-0 z-40 bg-background/95 backdrop-blur-3xl md:hidden flex flex-col items-center justify-center"
                    >
                        {/* Interactive Background Shapes */}
                        <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] bg-primary/20 rounded-full blur-[100px] pointer-events-none" />
                        <div className="absolute bottom-[-10%] left-[-20%] w-[400px] h-[400px] bg-secondary/20 rounded-full blur-[100px] pointer-events-none" />

                        <div className="flex flex-col items-center space-y-6 w-full px-8 relative z-10">
                            {links.map((link, i) => (
                                <motion.div
                                    key={link.href}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 + i * 0.1 }}
                                    className="w-full"
                                >
                                    <Link
                                        href={link.href}
                                        onClick={() => setIsOpen(false)}
                                        className={cn(
                                            "block w-full text-center text-3xl font-bold py-2 transition-all duration-300 hover:tracking-widest",
                                            pathname === link.href 
                                                ? "bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary" 
                                                : "text-foreground/80 hover:text-foreground"
                                        )}
                                    >
                                        {link.label}
                                    </Link>
                                </motion.div>
                            ))}
                            
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                                className="w-full pt-8 flex flex-col gap-4"
                            >
                                <Link 
                                    href="/dashboard/register" 
                                    onClick={() => setIsOpen(false)}
                                    className="w-full py-4 bg-primary text-primary-foreground text-center text-lg font-bold rounded-2xl shadow-xl shadow-primary/20"
                                >
                                    Get Started Now
                                </Link>
                                <Link 
                                    href="/dashboard/login" 
                                    onClick={() => setIsOpen(false)}
                                    className="w-full py-4 bg-secondary/10 text-foreground text-center text-lg font-semibold rounded-2xl"
                                >
                                    Client Login
                                </Link>
                            </motion.div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
