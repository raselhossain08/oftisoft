"use client";

import { useCart } from "@/hooks/use-cart";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Truck, ArrowLeft, Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe, Stripe } from "@stripe/stripe-js";
import { StripePaymentForm } from "@/components/checkout/stripe-payment-form";
import { billingAPI, systemAPI } from "@/lib/api";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

export default function CheckoutPage() {
    const { items: cartItems, total, clearCart } = useCart();
    const router = useRouter();
    const [isMounted, setIsMounted] = useState(false);
    const [clientSecret, setClientSecret] = useState("");
    const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'paypal'>('stripe');
    
    // Dynamic payment configs
    const [stripePromise, setStripePromise] = useState<Promise<Stripe | null> | null>(null);
    const [paypalClientId, setPaypalClientId] = useState("");

    const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const tax = subtotal * 0.08;
    const finalTotal = subtotal + tax;

    useEffect(() => {
        setIsMounted(true);
        if (finalTotal > 0) {
            billingAPI.createPaymentIntent(finalTotal)
                .then(data => setClientSecret(data.clientSecret))
                .catch(err => console.error("Failed to init payment intent", err));
        }

        // Fetch dynamic payment config
        systemAPI.getPublicConfig().then(config => {
            if (config.stripePublishableKey) {
                setStripePromise(loadStripe(config.stripePublishableKey));
            } else {
                 // Fallback to env var if not set in DB
                 setStripePromise(loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "pk_test_sample"));
            }
            if (config.paypalClientId) {
                setPaypalClientId(config.paypalClientId);
            } else {
                setPaypalClientId(process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "sb");
            }
        }).catch(() => {
            // Fallback
             setStripePromise(loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "pk_test_sample"));
             setPaypalClientId(process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "sb");
        });

    }, [finalTotal]);

    if (!isMounted) return null;

    if (cartItems.length === 0) {
        return (
            <div className="container px-4 py-24 mx-auto text-center">
                <Card className="max-w-md mx-auto border-border/50 bg-card/80 backdrop-blur-sm">
                    <CardHeader>
                        <CardTitle>Cart is Empty</CardTitle>
                        <CardDescription>You need to add items before checking out.</CardDescription>
                    </CardHeader>
                    <CardFooter>
                        <Button asChild className="w-full">
                            <Link href="/shop">Browse Shop</Link>
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        );
    }

    const initialOptions = {
        clientSecret,
        appearance: {
            theme: 'night' as const,
            variables: {
                colorPrimary: '#7c3aed',
            },
        },
    };

    return (
        <div className="container px-4 py-8 md:py-16 mx-auto">
            <Link href="/shop/cart" className="inline-flex items-center text-muted-foreground hover:text-primary mb-8 transition-colors">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Cart
            </Link>

            <div className="grid lg:grid-cols-2 gap-12">
                {/* Checkout Form */}
                <div className="space-y-8">
                    <div>
                        <h1 className="text-3xl font-bold mb-2">Checkout</h1>
                        <p className="text-muted-foreground">Complete your purchase securely.</p>
                    </div>

                    <div className="space-y-8">
                        {/* Contact Info */}
                        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                            <CardHeader>
                                <CardTitle>Contact Information</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="email">Email Address</Label>
                                    <Input id="email" type="email" placeholder="you@example.com" />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Payment Method Selector */}
                        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                            <CardHeader>
                                <CardTitle>Payment Method</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <Button
                                        variant={paymentMethod === 'stripe' ? 'default' : 'outline'}
                                        onClick={() => setPaymentMethod('stripe')}
                                        className="h-20 flex flex-col gap-2"
                                    >
                                        <span className="font-bold text-lg">Card</span>
                                        <span className="text-xs opacity-70">Credit / Debit</span>
                                    </Button>
                                    <Button
                                        variant={paymentMethod === 'paypal' ? 'default' : 'outline'}
                                        onClick={() => setPaymentMethod('paypal')}
                                        className="h-20 flex flex-col gap-2"
                                    >
                                        <span className="font-bold text-lg">PayPal</span>
                                        <span className="text-xs opacity-70">Checkout securely</span>
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Payment Implementation */}
                        <Card className="border-border/50 bg-card/50 backdrop-blur-sm p-6">
                           {paymentMethod === 'stripe' && (
                                clientSecret && stripePromise ? (
                                    <Elements stripe={stripePromise} options={initialOptions}>
                                        <StripePaymentForm amount={finalTotal} />
                                    </Elements>
                                ) : (
                                    <div className="flex justify-center py-12">
                                        <Loader2 className="w-8 h-8 animate-spin text-primary" />
                                    </div>
                                )
                           )}

                           {paymentMethod === 'paypal' && (
                               <div className="py-4">
                                   {paypalClientId ? (
                                       <PayPalScriptProvider options={{ clientId: paypalClientId }}>
                                            <PayPalButtons 
                                                style={{ layout: "vertical" }}
                                                createOrder={(data, actions) => {
                                                    return actions.order.create({
                                                        intent: "CAPTURE",
                                                        purchase_units: [
                                                            {
                                                                amount: {
                                                                    currency_code: "USD",
                                                                    value: finalTotal.toFixed(2),
                                                                },
                                                            },
                                                        ],
                                                    });
                                                }}
                                                onApprove={(data, actions) => {
                                                    return actions.order!.capture().then((details) => {
                                                        toast.success("Transaction completed by " + details?.payer?.name?.given_name);
                                                        clearCart();
                                                        router.push("/shop/success");
                                                    });
                                                }}
                                            />
                                       </PayPalScriptProvider>
                                   ) : (
                                       <div className="flex justify-center py-12">
                                            <Loader2 className="w-8 h-8 animate-spin text-primary" />
                                        </div>
                                   )}
                               </div>
                           )}
                        </Card>
                    </div>
                </div>

                {/* Order Summary */}
                <div className="lg:sticky lg:top-24 h-fit space-y-6">
                    <Card className="border-primary/10 bg-card/80 backdrop-blur-md shadow-2xl">
                        <CardHeader>
                            <CardTitle>Order Summary</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-4 max-h-[300px] overflow-auto pr-2">
                                {cartItems.map((item) => (
                                    <div key={item.id} className="flex gap-4">
                                        <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-muted shrink-0 border border-border">
                                            <Image 
                                                src={item.image || "/placeholder.png"} 
                                                alt={item.name} 
                                                fill 
                                                className="object-cover"
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-medium text-sm truncate">{item.name}</h4>
                                            <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                                        </div>
                                        <div className="font-medium text-sm">
                                            ${(item.price * item.quantity).toFixed(2)}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <Separator />

                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Subtotal</span>
                                    <span>${subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Tax (8%)</span>
                                    <span>${tax.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm text-green-500 font-medium">
                                    <span className="flex items-center gap-1"><Truck className="w-3 h-3" /> Shipping</span>
                                    <span>Free</span>
                                </div>
                            </div>

                            <Separator />

                            <div className="flex justify-between text-lg font-bold">
                                <span>Total</span>
                                <span className="text-primary">${finalTotal.toFixed(2)}</span>
                            </div>
                        </CardContent>
                        <CardFooter className="text-xs text-muted-foreground text-center justify-center">
                            Secure payment processing powered by Stripe & PayPal
                        </CardFooter>
                    </Card>

                    <div className="text-center text-xs text-muted-foreground space-y-2">
                        <p>By placing this order, you agree to our <Link href="/terms" className="underline hover:text-primary">Terms of Service</Link> and <Link href="/privacy" className="underline hover:text-primary">Privacy Policy</Link>.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
