"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Trash, Minus, Plus, ShoppingBag, ArrowRight, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { mockProducts } from "@/lib/shop-data";
import { useState } from "react";

export default function CartPage() {
    // Mock cart state
    const [cartItems, setCartItems] = useState([
        { ...mockProducts[0], quantity: 1 },
        { ...mockProducts[2], quantity: 1 }
    ]);

    const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const tax = subtotal * 0.08;
    const total = subtotal + tax;

    const removeItem = (id: string) => {
        setCartItems(cartItems.filter(item => item.id !== id));
    };

    const updateQuantity = (id: string, delta: number) => {
        setCartItems(cartItems.map(item => {
            if (item.id === id) {
                const newQuantity = Math.max(1, item.quantity + delta);
                return { ...item, quantity: newQuantity };
            }
            return item;
        }));
    };

    if (cartItems.length === 0) {
        return (
            <div className="container px-4 py-24 mx-auto text-center">
                <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                    <ShoppingBag className="w-10 h-10 text-muted-foreground" />
                </div>
                <h1 className="text-3xl font-bold mb-4">Your cart is empty</h1>
                <p className="text-muted-foreground mb-8">Looks like you haven't added anything to your cart yet.</p>
                <Button asChild size="lg" className="rounded-full">
                    <Link href="/shop">Continue Shopping</Link>
                </Button>
            </div>
        );
    }

    return (
        <div className="container px-4 py-8 md:py-16 mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold mb-8">Shopping Cart</h1>

            <div className="flex flex-col lg:flex-row gap-12">
                {/* Cart Items */}
                <div className="flex-1 space-y-6">
                    {cartItems.map((item) => (
                        <Card key={item.id} className="overflow-hidden border-border/50 bg-card/80 backdrop-blur-sm">
                            <CardContent className="p-4 md:p-6 flex gap-6 items-center">
                                <div className="h-24 w-24 relative rounded-xl overflow-hidden bg-muted shrink-0 border border-border">
                                    <Image
                                        src={item.image || "/placeholder.png"}
                                        alt={item.name}
                                        fill
                                        className="object-cover"
                                    />
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <h3 className="font-bold text-lg truncate pr-4">{item.name}</h3>
                                            <p className="text-sm text-muted-foreground">{item.category}</p>
                                        </div>
                                        <p className="font-bold text-lg">${item.price * item.quantity}</p>
                                    </div>
                                    
                                    <div className="flex items-center justify-between mt-4">
                                        <div className="flex items-center gap-3 bg-secondary/30 rounded-full px-3 py-1">
                                            <button 
                                                onClick={() => updateQuantity(item.id, -1)}
                                                className="p-1 hover:text-primary transition-colors disabled:opacity-50"
                                            >
                                                <Minus className="w-3 h-3" />
                                            </button>
                                            <span className="text-sm font-medium w-4 text-center">{item.quantity}</span>
                                            <button 
                                                onClick={() => updateQuantity(item.id, 1)}
                                                className="p-1 hover:text-primary transition-colors"
                                            >
                                                <Plus className="w-3 h-3" />
                                            </button>
                                        </div>

                                        <Button 
                                            variant="ghost" 
                                            size="sm" 
                                            onClick={() => removeItem(item.id)}
                                            className="text-muted-foreground hover:text-red-500 hover:bg-red-500/10"
                                        >
                                            <Trash2 className="w-4 h-4 mr-2" />
                                            Remove
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Summary */}
                <div className="w-full lg:w-[380px] shrink-0">
                    <Card className="sticky top-24 bg-card/50 backdrop-blur-md border-primary/10 shadow-2xl">
                        <CardHeader>
                            <CardTitle>Order Summary</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Subtotal</span>
                                <span className="font-medium">${subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Tax (8%)</span>
                                <span className="font-medium">${tax.toFixed(2)}</span>
                            </div>
                            <Separator />
                            <div className="flex justify-between text-lg font-bold">
                                <span>Total</span>
                                <span className="text-primary">${total.toFixed(2)}</span>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button asChild className="w-full rounded-full h-12 text-base font-bold shadow-lg shadow-primary/25" size="lg">
                                <Link href="/shop/checkout">
                                    Proceed to Checkout
                                    <ArrowRight className="ml-2 w-4 h-4" />
                                </Link>
                            </Button>
                        </CardFooter>
                    </Card>

                    <div className="mt-6 text-center text-sm text-muted-foreground">
                        <p>Secure Checkout powered by Stripe</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
