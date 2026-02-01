
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/services", label: "Services" },
    { href: "/portfolio", label: "Portfolio" },
    { href: "/blog", label: "Blog" },
    { href: "#contact", label: "Contact" },
];

export default function Navbar() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <nav className={cn(
            "fixed top-0 left-0 w-full z-50 transition-all duration-300",
            scrolled ? "bg-background/80 backdrop-blur-md shadow-lg border-b border-border/50" : "bg-transparent py-4"
        )}>
            <div className="container px-4 mx-auto flex items-center justify-between">
                <Link href="/" className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                    Ofitsoft
                </Link>
                <div className="hidden md:flex items-center gap-8">
                    {links.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={cn(
                                "text-sm font-medium transition-colors hover:text-primary relative",
                                pathname === link.href ? "text-primary" : "text-muted-foreground"
                            )}
                        >
                            {link.label}
                            {pathname === link.href && (
                                <motion.div
                                    layoutId="navbar-underline"
                                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary"
                                />
                            )}
                        </Link>
                    ))}
                    <Link href="/dashboard/login" className="text-sm font-bold hover:text-primary transition-colors">
                        Login
                    </Link>
                    <button className="px-5 py-2 bg-primary text-white rounded-full font-bold text-sm hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20">
                        Get a Quote
                    </button>
                </div>

                {/* Mobile Toggle */}
                <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
                    {isOpen ? <X /> : <Menu />}
                </button>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-background border-b border-border"
                    >
                        <div className="flex flex-col p-4 space-y-4">
                            {links.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setIsOpen(false)}
                                    className={cn(
                                        "text-lg font-medium transition-colors",
                                        pathname === link.href ? "text-primary" : "text-muted-foreground"
                                    )}
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
