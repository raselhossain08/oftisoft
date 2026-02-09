"use client";

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, ShoppingCart, Heart, Eye } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Product } from "@/lib/store/shop-content";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

import { useState } from "react";
import { toast } from "sonner";
import { useCart } from "@/hooks/use-cart";

interface ProductCardProps {
    product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
    const [isWishlisted, setIsWishlisted] = useState(false);
    const cart = useCart();

    const handleAddToCart = () => {
        cart.addItem({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1,
            type: 'product'
        });
        toast.success(`${product.name} added to cart!`);
    };

    const toggleWishlist = () => {
        setIsWishlisted(!isWishlisted);
        toast(isWishlisted ? "Removed from wishlist" : "Added to wishlist", {
            description: product.name,
            icon: <Heart className={cn("h-4 w-4", !isWishlisted ? "fill-red-500 text-red-500" : "")} />
        });
    };
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -5 }}
            transition={{ duration: 0.3 }}
        >
            <Card className="h-full group relative overflow-hidden bg-card/50 backdrop-blur-sm border-white/5 hover:border-primary/50 transition-colors pt-0">
                <CardHeader className="p-0 relative aspect-[4/3] overflow-hidden">
                    <div className="absolute inset-0 bg-muted animate-pulse" /> {/* Placeholder */}
                    <Image
                        src={product.image || "/placeholder.png"} // Fallback
                        alt={product.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    
                    <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity translate-x-4 group-hover:translate-x-0 duration-300">
                        <Button 
                            onClick={toggleWishlist}
                            size="icon" 
                            variant="secondary" 
                            className="h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm hover:bg-primary hover:text-primary-foreground"
                        >
                            <Heart className={cn("h-4 w-4", isWishlisted && "fill-red-500 text-red-500")} />
                        </Button>
                        <Button size="icon" variant="secondary" className="h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm hover:bg-primary hover:text-primary-foreground">
                            <Eye className="h-4 w-4" />
                        </Button>
                    </div>

                    <Badge className="absolute top-3 left-3 bg-background/80 backdrop-blur-sm text-foreground hover:bg-background">
                        {product.category}
                    </Badge>
                </CardHeader>
                
                <CardContent className="p-5">
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-1 text-yellow-500">
                            <Star className="h-3.5 w-3.5 fill-current" />
                            <span className="text-xs font-semibold text-muted-foreground">{product.rating}</span>
                        </div>
                        <span className="text-xs text-muted-foreground">{product.reviews} reviews</span>
                    </div>
                    
                    <Link href={`/shop/${product.slug}`} className="block group-hover:text-primary transition-colors">
                        <h3 className="font-bold text-lg mb-2 line-clamp-1">{product.name}</h3>
                    </Link>
                    
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-4 h-10">
                        {product.description}
                    </p>

                    <div className="flex flex-wrap gap-1 mb-4">
                        {product.tags.slice(0, 3).map(tag => (
                            <span key={tag} className="text-[10px] px-2 py-1 rounded-full bg-muted/50 border border-white/5 text-muted-foreground">
                                {tag}
                            </span>
                        ))}
                    </div>
                </CardContent>

                <CardFooter className="p-5 pt-0 flex items-center justify-between">
                    <div className="text-xl font-bold">
                        ${product.price}
                    </div>
                    <Button 
                        onClick={handleAddToCart}
                        size="sm" 
                        className="rounded-full gap-2 shadow-lg shadow-primary/20"
                    >
                        <ShoppingCart className="h-4 w-4" />
                        Add to Cart
                    </Button>
                </CardFooter>
            </Card>
        </motion.div>
    );
}
