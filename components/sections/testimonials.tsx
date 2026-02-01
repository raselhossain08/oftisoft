
"use client";

import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { Star, Quote } from "lucide-react";
import Image from "next/image";

const testimonials = [
    {
        name: "John Smith",
        role: "CEO, TechCorp",
        image: "/avatar-1.jpg",
        quote: "Ofitsoft transformed our business with their exceptional software solutions. The team is professional, skilled, and delivered beyond our expectations.",
        rating: 5,
    },
    {
        name: "Sarah Johnson",
        role: "Founder, StyleStudio",
        image: "/avatar-2.jpg",
        quote: "The design expertise and attention to detail Rasel brought to our project was unmatched. Highly recommended for premium web development.",
        rating: 5,
    },
    {
        name: "Michael Chen",
        role: "CTO, InnovationLabs",
        image: "/avatar-3.jpg",
        quote: "Robust backend architecture and seamless frontend integration. A true full-stack partner for complex projects.",
        rating: 5,
    },
];

export default function Testimonials() {
    const [emblaRef] = useEmblaCarousel({ loop: true }, [Autoplay({ delay: 5000 })]);

    return (
        <section className="py-24 bg-card relative">
            <div className="container px-4 mx-auto">
                <h2 className="text-3xl md:text-5xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary mb-16">
                    Client Stories
                </h2>

                <div className="overflow-hidden max-w-4xl mx-auto" ref={emblaRef}>
                    <div className="flex">
                        {testimonials.map((t, i) => (
                            <div key={i} className="flex-[0_0_100%] min-w-0 pl-4">
                                <div className="flex flex-col items-center text-center p-8">
                                    <div className="relative w-20 h-20 mb-6 rounded-full overflow-hidden border-2 border-primary p-1">
                                        {/* Placeholder for real image */}
                                        <div className="w-full h-full rounded-full bg-muted flex items-center justify-center text-xs">
                                            IMG
                                        </div>
                                    </div>

                                    <div className="flex gap-1 mb-6 text-yellow-500">
                                        {[...Array(t.rating)].map((_, i) => (
                                            <Star key={i} className="w-5 h-5 fill-current" />
                                        ))}
                                    </div>

                                    <Quote className="w-12 h-12 text-primary/20 mb-4" />

                                    <p className="text-xl md:text-2xl font-light italic text-muted-foreground mb-8 max-w-2xl">
                                        "{t.quote}"
                                    </p>

                                    <h4 className="font-bold text-lg text-foreground">{t.name}</h4>
                                    <p className="text-sm text-primary">{t.role}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
