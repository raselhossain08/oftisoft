"use client";

import { useEffect, useState, useMemo } from "react";
import { usePageContent } from "@/hooks/usePageContent";
import { ShopSidebar } from "@/components/sections/shop/shop-sidebar";
import { ProductCard } from "@/components/sections/shop/product-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Search, SlidersHorizontal, ArrowUpDown } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion } from "framer-motion";
import { BundleDeals } from "@/components/sections/shop/bundle-deals";
import { ShopTestimonials } from "@/components/sections/shop/shop-testimonials";
import { SupportPromise } from "@/components/sections/shop/support-promise";
import { useShopContentStore } from "@/lib/store/shop-content";
import Link from "next/link";

export default function ShopPage() {
    const { pageContent, isLoading } = usePageContent('shop');
    const setContent = useShopContentStore((state) => state.setContent);

    useEffect(() => {
        if (pageContent?.content) {
            setContent(pageContent.content);
        }
    }, [pageContent, setContent]);

    const { content } = useShopContentStore();
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedSort, setSelectedSort] = useState("newest");

    const products = content?.products || [];
    const header = content?.header;

    const filteredProducts = useMemo(() => {
        let result = [...products];
        
        // Search
        if (searchQuery) {
            result = result.filter(p => 
                p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                p.description.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Sort
        if (selectedSort === "price-low") result.sort((a, b) => a.price - b.price);
        if (selectedSort === "price-high") result.sort((a, b) => b.price - a.price);
        if (selectedSort === "popular") result.sort((a, b) => b.reviews - a.reviews);

        return result;
    }, [searchQuery, selectedSort, products]);

    if (isLoading && !pageContent) {
        return (
            <div className="fixed inset-0 bg-[#020202] flex items-center justify-center z-[100]">
                <div className="text-primary font-black italic animate-pulse tracking-[0.3em] uppercase">
                    Loading Assets...
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-24 pb-20">
            <div className="container px-4 py-8 md:py-12 mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-12">
                    <div className="space-y-2">
                        <h1 className="text-3xl md:text-6xl font-black mb-2 tracking-tighter">{header?.title || "Marketplace"}</h1>
                        <p className="text-muted-foreground text-lg">{header?.description || "Premium templates, UI kits, and enterprise AI solutions."}</p>
                    </div>
                    
                    <div className="flex items-center gap-2 w-full md:w-auto">
                        <div className="relative flex-1 md:w-[400px]">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                            <Input 
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search premium assets..." 
                                className="pl-12 h-14 rounded-2xl bg-secondary/20 border-white/5 focus:bg-background transition-all text-lg" 
                            />
                        </div>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Mobile Filter Trigger */}
                    <div className="lg:hidden flex items-center justify-between gap-4 mb-8">
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant="outline" className="flex-1 h-12 rounded-xl gap-2">
                                    <SlidersHorizontal className="w-4 h-4" />
                                    Filters
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="left" className="w-[300px]">
                                <SheetHeader className="mb-4">
                                    <SheetTitle>Filters</SheetTitle>
                                </SheetHeader>
                                <ShopSidebar />
                            </SheetContent>
                        </Sheet>

                        <Select value={selectedSort} onValueChange={setSelectedSort}>
                            <SelectTrigger className="w-[160px] h-12 rounded-xl">
                                <SelectValue placeholder="Sort by" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="newest">Newest Arrivals</SelectItem>
                                <SelectItem value="popular">Most Popular</SelectItem>
                                <SelectItem value="price-low">Price: Low to High</SelectItem>
                                <SelectItem value="price-high">Price: High to Low</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Desktop Sidebar */}
                    <aside className="hidden lg:block w-[280px] shrink-0">
                        <div className="sticky top-24">
                            <ShopSidebar />
                        </div>
                    </aside>

                    {/* Product Grid */}
                    <div className="flex-1">
                        <div className="hidden lg:flex items-center justify-between mb-8">
                            <span className="text-sm text-muted-foreground font-medium">Found <span className="text-foreground font-black">{filteredProducts.length}</span> premium assets</span>
                            <div className="flex items-center gap-4">
                                <Button asChild variant="ghost" size="sm" className="gap-2 font-bold hover:text-primary">
                                    <Link href="/shop/compare"><ArrowUpDown className="w-4 h-4" /> Compare Assets</Link>
                                </Button>
                                <div className="h-4 w-px bg-border mx-2" />
                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-black uppercase text-muted-foreground">Sort By:</span>
                                    <Select value={selectedSort} onValueChange={setSelectedSort}>
                                        <SelectTrigger className="w-[180px] border-none bg-transparent hover:bg-muted font-bold transition-colors">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="newest">Newest Arrivals</SelectItem>
                                            <SelectItem value="popular">Most Popular</SelectItem>
                                            <SelectItem value="price-low">Price: Low to High</SelectItem>
                                            <SelectItem value="price-high">Price: High to Low</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>

                        {filteredProducts.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                                {filteredProducts.map((product) => (
                                    <ProductCard key={product.id} product={product} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-20 bg-muted/20 rounded-[3rem] border border-dashed border-border">
                                <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                                <h3 className="text-xl font-bold mb-2">No assets found</h3>
                                <p className="text-muted-foreground">Try adjusting your filters or search terms.</p>
                                <Button onClick={() => setSearchQuery("")} variant="link" className="mt-4 text-primary font-bold">Clear all search</Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <BundleDeals />
            
            <SupportPromise />

            <ShopTestimonials />
        </div>
    );
}
