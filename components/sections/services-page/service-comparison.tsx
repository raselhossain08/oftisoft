"use client";

import { motion } from "framer-motion";
import { 
    Check, X, Sparkles, Zap, Shield, Crown, HelpCircle, ArrowRight, Minus,
    Plus, Save, Trash2, LayoutTemplate, Grid, Server, Database, Cloud, 
    Brain, Smartphone, Layout, Video, FileText, Code2, ClipboardCheck, Rocket, 
    HeartPulse, Globe, Code, ShieldCheck, Layers
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { useServicesContentStore, type ComparisonFeature, type ComparisonTier } from "@/lib/store/services-content";

const iconMap: any = {
    Check, X, Sparkles, Zap, Shield, Crown, HelpCircle, ArrowRight, Minus,
    Plus, Save, Trash2, LayoutTemplate, Grid, Server, Database, Cloud, 
    Brain, Smartphone, Layout, Video, FileText, Code2, ClipboardCheck, Rocket, 
    HeartPulse, Globe, Code, ShieldCheck, Layers
};

export default function ServiceComparison() {
    const { content } = useServicesContentStore();
    const features = content?.comparison.features || [];
    const tiers = content?.comparison.tiers || [];
    const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

    return (
        <section className="py-16 md:py-24 bg-background relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] md:w-[800px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

            <div className="container px-4 mx-auto relative z-10">
                <div className="text-center mb-12 md:mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold mb-4 md:mb-6">Compare Plans</h2>
                    <p className="text-base md:text-xl text-muted-foreground max-w-2xl mx-auto">
                        Transparent pricing with no hidden fees. Choose the plan that fits your scale.
                    </p>
                </div>

                {/* Mobile View: Cards Carousel */}
                <div className="lg:hidden">
                    <Swiper
                        modules={[Pagination]}
                        spaceBetween={20}
                        slidesPerView={1.1}
                        centeredSlides={true}
                        pagination={{ clickable: true }}
                        className="pb-12"
                    >
                        {tiers.map((tier) => (
                            <SwiperSlide key={tier.id}>
                                <Card className={cn(
                                    "h-full relative overflow-hidden transition-all",
                                    tier.highlight ? "border-primary shadow-2xl shadow-primary/10 scale-100" : "border-border scale-95 opacity-90"
                                )}>
                                    {tier.highlight && (
                                        <div className="absolute top-0 right-0 bg-primary/10 text-primary text-[10px] font-bold px-3 py-1 rounded-bl-xl border-l border-b border-primary/20">
                                            MOST POPULAR
                                        </div>
                                    )}
                                    <CardHeader className="pb-4">
                                        <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center mb-4 bg-muted", tier.color)}>
                                            {(() => {
                                                const Icon = iconMap[tier.iconName] || Zap;
                                                return <Icon className="w-5 h-5" />;
                                            })()}
                                        </div>
                                        <CardTitle className="text-xl">{tier.name}</CardTitle>
                                        <div className="text-2xl font-bold mt-2">{tier.price}</div>
                                        <CardDescription className="text-xs mt-1 min-h-[40px]">{tier.description}</CardDescription>
                                    </CardHeader>
                                    
                                    <CardContent className="space-y-3 pb-6">
                                        {features.map((feature: ComparisonFeature, i: number) => (
                                            <div key={i} className="flex items-center justify-between text-xs">
                                                <span className="text-muted-foreground">{feature.name}</span>
                                                {typeof tier.features[i] === 'boolean' ? (
                                                    tier.features[i] ? <Check className="w-3.5 h-3.5 text-green-500" /> : <X className="w-3.5 h-3.5 text-muted-foreground/30" />
                                                ) : (
                                                    <span className="font-bold">{tier.features[i]}</span>
                                                )}
                                            </div>
                                        ))}
                                    </CardContent>

                                    <CardFooter>
                                        <Button 
                                            asChild 
                                            className="w-full font-bold" 
                                            variant={tier.highlight ? "default" : "outline"}
                                        >
                                            <Link href="/#contact">
                                                Choose {tier.name}
                                            </Link>
                                        </Button>
                                    </CardFooter>
                                </Card>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>

                {/* Desktop View: Table */}
                <div className="hidden lg:block overflow-hidden rounded-3xl border border-border bg-card/30 backdrop-blur-md shadow-2xl">
                    <Table>
                        <TableHeader>
                            <TableRow className="hover:bg-transparent border-none">
                                <TableHead className="p-8 w-1/4 align-bottom">
                                    <span className="text-2xl font-bold text-foreground">Features</span>
                                </TableHead>
                                {tiers.map((tier: ComparisonTier) => (
                                    <TableHead key={tier.id} className={cn(
                                        "p-8 w-1/4 align-top relative transition-colors duration-300",
                                        tier.highlight ? "bg-primary/5" : "bg-transparent"
                                    )}>
                                        <div className="flex flex-col h-full justify-between gap-6">
                                            <div>
                                                <div className="flex items-center justify-between mb-4">
                                                    <div className={cn("inline-flex p-2 rounded-lg bg-background border border-border", tier.color)}>
                                                        {(() => {
                                                            const Icon = iconMap[tier.iconName] || Zap;
                                                            return <Icon className="w-5 h-5" />;
                                                        })()}
                                                    </div>
                                                    {tier.highlight && (
                                                        <Badge variant="secondary" className="bg-primary/20 text-primary border-primary/20">
                                                            POPULAR
                                                        </Badge>
                                                    )}
                                                </div>
                                                <h3 className="text-2xl font-bold mb-2 text-foreground">{tier.name}</h3>
                                                <div className="flex items-baseline gap-1 text-foreground">
                                                    <span className="text-4xl font-bold tracking-tight">{tier.price}</span>
                                                    {tier.price !== 'Custom' && <span className="text-muted-foreground text-sm font-normal">/project</span>}
                                                </div>
                                                <p className="text-sm text-muted-foreground mt-3 leading-relaxed font-normal normal-case">
                                                    {tier.description}
                                                </p>
                                            </div>
                                            
                                            <Button 
                                                asChild 
                                                className="w-full font-bold" 
                                                variant={tier.highlight ? "default" : "outline"}
                                            >
                                                <Link href="/#contact">
                                                    Get Started <ArrowRight className="w-4 h-4 ml-2" />
                                                </Link>
                                            </Button>
                                        </div>
                                    </TableHead>
                                ))}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {features.map((feature: ComparisonFeature, featureIndex: number) => (
                                <TableRow key={featureIndex} className="group hover:bg-muted/30 transition-colors border-border/50">
                                    <TableCell className="p-6 text-sm font-medium text-muted-foreground">
                                        <div className="flex items-center gap-2">
                                            {feature.name}
                                            <div className="group/tooltip relative">
                                                <HelpCircle className="w-4 h-4 text-muted-foreground/50 cursor-help" />
                                                <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-3 py-2 bg-popover text-popover-foreground text-xs rounded-lg border border-border shadow-md opacity-0 group-hover/tooltip:opacity-100 transition-opacity pointer-events-none w-48 z-50">
                                                    {feature.tooltip}
                                                </div>
                                            </div>
                                        </div>
                                    </TableCell>
                                    {tiers.map((tier: ComparisonTier, tierIndex: number) => (
                                        <TableCell key={tierIndex} className={cn(
                                            "p-6 text-center transition-colors align-middle",
                                            tier.highlight ? "bg-primary/5 group-hover:bg-primary/10" : ""
                                        )}>
                                            <div className="flex justify-start pl-4">
                                                {typeof tier.features[featureIndex] === 'boolean' ? (
                                                    tier.features[featureIndex] ? (
                                                        <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center">
                                                            <Check className="w-5 h-5 text-green-500" />
                                                        </div>
                                                    ) : (
                                                        <div className="w-8 h-8 flex items-center justify-center">
                                                            <Minus className="w-4 h-4 text-muted-foreground/30" />
                                                        </div>
                                                    )
                                                ) : (
                                                    <span className="font-bold text-foreground bg-muted/50 px-3 py-1 rounded-md text-sm border border-border">
                                                        {tier.features[featureIndex]}
                                                    </span>
                                                )}
                                            </div>
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </section>
    );
}
