
"use client"
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription, SheetHeader } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Menu, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useCart } from "@/hooks/use-cart";

// ... existing imports
import { useAuth } from "@/hooks/useAuth";

// ... existing imports
import { Logo } from "@/components/ui/logo";

import { useNavbarContentStore } from "@/lib/store/navbar-content";

export default function Navbar() {
    const pathname = usePathname();
    const [scrolled, setScrolled] = useState(false);
    const [isOpen, setIsOpen] = useState(false); 
    const { isAuthenticated, logout } = useAuth();
    const { content } = useNavbarContentStore();

    useEffect(() => {
        const handleScroll = () => {
             setScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const cart = useCart();
    const navLinks = content?.links || [];

    return (
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
                    <Logo size="lg" />
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center gap-1 bg-secondary/5 rounded-full p-1 border border-white/5 mx-4">
                    {navLinks.map((link, i) => {
                        const isActive = pathname === link.href;
                        return (
                            <Link
                                key={link.id || link.href || i}
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
                                <span className="relative z-10 flex items-center gap-2">
                                    {link.label}
                                    {link.label === "Shop" && cart.items.length > 0 && (
                                        <span className="flex items-center justify-center w-5 h-5 text-[10px] font-bold text-white bg-red-500 rounded-full animate-pulse shadow-lg shadow-red-500/50">
                                            {cart.items.length}
                                        </span>
                                    )}
                                </span>
                            </Link>
                        );
                    })}
                </div>

                {/* Right Actions */}
                <div className="hidden md:flex items-center gap-4">
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        className="relative rounded-full hover:bg-white/10 text-muted-foreground hover:text-primary transition-colors"
                        onClick={cart.openCart}
                    >
                        <ShoppingBag className="w-5 h-5" />
                        {cart.items.length > 0 && (
                            <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-primary rounded-full ring-2 ring-background animate-pulse" />
                        )}
                    </Button>
                    <div className="w-px h-6 bg-white/10 mx-2" />
                    
                    {isAuthenticated ? (
                        <>
                             <Button variant="ghost" asChild className="text-muted-foreground hover:text-primary font-semibold">
                                <Link href="/dashboard">Dashboard</Link>
                            </Button>
                            <Button onClick={logout} className="rounded-full font-bold shadow-lg shadow-primary/20 hover:scale-105 transition-all">
                                Logout
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button variant="ghost" asChild className="text-muted-foreground hover:text-primary font-semibold">
                                <Link href="/dashboard/login">Log in</Link>
                            </Button>
                            <Button asChild className="rounded-full font-bold shadow-lg shadow-primary/20 hover:scale-105 transition-all">
                                <Link href="/dashboard/register">
                                    Get Started
                                    <ArrowRight className="w-4 h-4 ml-2" />
                                </Link>
                            </Button>
                        </>
                    )}
                </div>

                {/* Mobile Toggle & Sheet */}
                <div className="md:hidden flex items-center gap-4">
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        className="relative rounded-full hover:bg-white/10 text-muted-foreground hover:text-primary transition-colors"
                        onClick={cart.openCart}
                    >
                        <ShoppingBag className="w-5 h-5" />
                        {cart.items.length > 0 && (
                            <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-primary rounded-full ring-2 ring-background animate-pulse" />
                        )}
                    </Button>
                    <Sheet open={isOpen} onOpenChange={setIsOpen}>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon" className="rounded-full">
                                <Menu className="w-6 h-6" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right" className="w-[300px] sm:w-[400px] flex flex-col justify-center border-l-primary/10 bg-background/95 backdrop-blur-xl">
                            <SheetHeader className="absolute top-4 left-4">
                               <SheetTitle className="text-left flex items-center gap-2">
                                    <Logo />
                               </SheetTitle>
                            </SheetHeader>
                            <div className="flex flex-col items-center space-y-6 w-full relative z-10">
                                {navLinks.map((link, i) => (
                                    <Link
                                        key={link.id || link.href || i}
                                        href={link.href}
                                        onClick={() => setIsOpen(false)}
                                        className={cn(
                                            "block w-full text-center text-2xl font-bold py-2 transition-all duration-300 hover:tracking-widest flex items-center justify-center gap-3",
                                            pathname === link.href 
                                                ? "text-primary" 
                                                : "text-foreground/80 hover:text-foreground"
                                        )}
                                    >
                                        {link.label}
                                        {link.label === "Shop" && cart.items.length > 0 && (
                                            <span className="flex items-center justify-center w-6 h-6 text-xs font-bold text-white bg-red-500 rounded-full animate-pulse shadow-lg shadow-red-500/50">
                                                {cart.items.length}
                                            </span>
                                        )}
                                    </Link>
                                ))}
                                
                                <div className="w-full pt-8 flex flex-col gap-4 px-4">
                                    {isAuthenticated ? (
                                        <>
                                            <Button size="lg" className="w-full font-bold rounded-xl shadow-xl shadow-primary/20" asChild>
                                                <Link href="/dashboard" onClick={() => setIsOpen(false)}>
                                                    Dashboard
                                                </Link>
                                            </Button>
                                            <Button 
                                                variant="outline" 
                                                size="lg" 
                                                className="w-full font-semibold rounded-xl" 
                                                onClick={() => {
                                                    logout();
                                                    setIsOpen(false);
                                                }}
                                            >
                                                Logout
                                            </Button>
                                        </>
                                    ) : (
                                        <>
                                            <Button size="lg" className="w-full font-bold rounded-xl shadow-xl shadow-primary/20" asChild>
                                                <Link href="/dashboard/register" onClick={() => setIsOpen(false)}>
                                                    Get Started Now
                                                </Link>
                                            </Button>
                                            <Button variant="outline" size="lg" className="w-full font-semibold rounded-xl" asChild>
                                                <Link href="/dashboard/login" onClick={() => setIsOpen(false)}>
                                                    Client Login
                                                </Link>
                                            </Button>
                                        </>
                                    )}
                                </div>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </motion.nav>
    );
}
