"use client";

import { shopTestimonials } from "@/lib/shop-data";
import { Star, Quote } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { motion } from "framer-motion";

export function ShopTestimonials() {
    return (
        <section className="py-24 border-t border-border/50">
            <div className="container px-4 mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold mb-4">Trusted by Developers</h2>
                    <p className="text-muted-foreground text-lg">See why thousands of developers choose Oftisoft for their projects.</p>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    {shopTestimonials.map((t, i) => (
                        <motion.div
                            key={t.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            viewport={{ once: true }}
                        >
                            <Card className="h-full border-primary/10 bg-gradient-to-br from-primary/5 to-transparent relative overflow-hidden">
                                <Quote className="absolute top-6 right-6 w-12 h-12 text-primary/10" />
                                <CardContent className="p-8">
                                    <div className="flex gap-1 mb-6">
                                        {[...Array(t.rating)].map((_, i) => (
                                            <Star key={i} className="w-4 h-4 text-yellow-500 fill-current" />
                                        ))}
                                    </div>
                                    <p className="text-xl italic mb-8 leading-relaxed">"{t.content}"</p>
                                    <div className="flex items-center gap-4">
                                        <Avatar className="h-12 w-12 border-2 border-primary/20">
                                            <AvatarImage src={t.avatar} />
                                            <AvatarFallback>{t.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="font-bold">{t.name}</p>
                                            <p className="text-sm text-muted-foreground">{t.role}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
