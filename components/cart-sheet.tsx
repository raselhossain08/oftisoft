"use client";

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useCart } from "@/hooks/use-cart";
import { ShoppingBag, X, Plus, Minus, Trash2, ArrowRight } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

export const CartSheet = () => {
    const [isMounted, setIsMounted] = useState(false);
    const cart = useCart();
    const router = useRouter();

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return null;
    }

    const onCheckout = () => {
        cart.closeCart();
        router.push("/shop/checkout");
    };

    return (
        <Sheet open={cart.isOpen} onOpenChange={cart.isOpen ? cart.closeCart : cart.openCart}>
            <SheetContent className="w-full sm:max-w-md flex flex-col p-0 border-l border-white/10 bg-background/80 backdrop-blur-xl">
                <SheetHeader className="px-6 py-4 border-b border-white/5">
                    <SheetTitle className="text-xl font-black italic flex items-center gap-2">
                        <ShoppingBag className="w-5 h-5 text-primary" />
                        Quick Cart ({cart.items.length})
                    </SheetTitle>
                </SheetHeader>

                {cart.items.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center space-y-4 px-6">
                        <div className="w-20 h-20 rounded-full bg-muted/10 flex items-center justify-center">
                            <ShoppingBag className="w-10 h-10 text-muted-foreground opacity-50" />
                        </div>
                        <p className="text-muted-foreground font-medium text-center">Your cart is empty.</p>
                        <Button 
                            variant="outline" 
                            className="rounded-xl font-bold" 
                            onClick={cart.closeCart}
                        >
                            Continue Browsing
                        </Button>
                    </div>
                ) : (
                    <>
                        <ScrollArea className="flex-1 px-6">
                            <div className="space-y-6 py-6">
                                {cart.items.map((item) => (
                                    <div key={item.id} className="flex gap-4 group">
                                        <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-muted/10 border border-white/5 flex-shrink-0">
                                            {item.image ? (
                                                <Image
                                                    src={item.image}
                                                    alt={item.name}
                                                    fill
                                                    className="object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center bg-secondary">
                                                    <ShoppingBag className="w-6 h-6 text-muted-foreground/50" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1 flex flex-col justify-between">
                                            <div>
                                                <h4 className="font-bold text-sm line-clamp-2 leading-tight">{item.name}</h4>
                                                <p className="text-xs text-muted-foreground mt-1 capitalize">{item.type || 'Product'}</p>
                                            </div>
                                            <div className="flex items-center justify-between mt-2">
                                                <div className="flex items-center gap-2 bg-secondary/50 rounded-lg p-1 border border-white/5">
                                                    <Button 
                                                        variant="ghost" 
                                                        size="icon" 
                                                        className="h-6 w-6 rounded-md hover:bg-white/10"
                                                        onClick={() => cart.updateQuantity(item.id, item.quantity - 1)}
                                                    >
                                                        <Minus className="w-3 h-3" />
                                                    </Button>
                                                    <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                                                    <Button 
                                                        variant="ghost" 
                                                        size="icon" 
                                                        className="h-6 w-6 rounded-md hover:bg-white/10"
                                                        onClick={() => cart.updateQuantity(item.id, item.quantity + 1)}
                                                    >
                                                        <Plus className="w-3 h-3" />
                                                    </Button>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <span className="font-bold text-sm">${(item.price * item.quantity).toLocaleString()}</span>
                                                    <Button 
                                                        variant="ghost" 
                                                        size="icon" 
                                                        className="h-7 w-7 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded-full transition-colors"
                                                        onClick={() => cart.removeItem(item.id)}
                                                    >
                                                        <Trash2 className="w-3.5 h-3.5" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>
                        
                        <div className="p-6 border-t border-white/5 bg-background/50 backdrop-blur-xl">
                            <div className="space-y-4 mb-4">
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Subtotal</span>
                                    <span className="font-bold">${cart.total().toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Taxes</span>
                                    <span className="text-muted-foreground italic">Calculated at checkout</span>
                                </div>
                                <Separator className="bg-white/10" />
                                <div className="flex justify-between items-end">
                                    <span className="text-base font-bold">Total</span>
                                    <span className="text-xl font-black text-primary">${cart.total().toLocaleString()}</span>
                                </div>
                            </div>
                            <Button 
                                className="w-full h-12 rounded-xl font-bold text-lg shadow-xl shadow-primary/20 hover:scale-[1.02] transition-transform" 
                                onClick={onCheckout}
                            >
                                Security Checkout <ArrowRight className="w-5 h-5 ml-2" />
                            </Button>
                        </div>
                    </>
                )}
            </SheetContent>
        </Sheet>
    );
}
