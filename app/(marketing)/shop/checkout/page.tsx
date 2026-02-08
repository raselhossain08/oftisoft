"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { 
    CreditCard, 
    Lock, 
    CheckCircle2, 
    User, 
    UserPlus, 
    Wallet, 
    Building2, 
    Smartphone,
    FileText,
    ShieldCheck,
    ArrowRight
} from "lucide-react";
import Link from 'next/link';
import { useState } from "react";
import { cn } from "@/lib/utils";

export default function CheckoutPage() {
    const [checkoutType, setCheckoutType] = useState<'guest' | 'login'>('guest');
    const [paymentMethod, setPaymentMethod] = useState('card');

    return (
        <div className="container px-4 py-8 md:py-16 mx-auto max-w-6xl">
            <div className="flex flex-col items-center mb-12 text-center">
                <h1 className="text-3xl md:text-5xl font-bold mb-4">Finalize Your Order</h1>
                <p className="text-muted-foreground text-lg max-w-2xl">Complete your purchase securely. Choose your preferred checkout method and payment provider.</p>
            </div>
            
            <div className="grid lg:grid-cols-12 gap-12">
                {/* Form Section */}
                <div className="lg:col-span-8 space-y-8">
                    
                    {/* Checkout Method Selection */}
                    <div className="grid grid-cols-2 p-1 bg-muted rounded-2xl border border-border transition-all">
                        <button
                            onClick={() => setCheckoutType('guest')}
                            className={cn(
                                "flex items-center justify-center gap-2 py-3 text-sm font-bold rounded-xl transition-all",
                                checkoutType === 'guest' ? "bg-background shadow-lg text-primary" : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            <UserPlus className="w-4 h-4" />
                            Guest Checkout
                        </button>
                        <button
                            onClick={() => setCheckoutType('login')}
                            className={cn(
                                "flex items-center justify-center gap-2 py-3 text-sm font-bold rounded-xl transition-all",
                                checkoutType === 'login' ? "bg-background shadow-lg text-primary" : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            <User className="w-4 h-4" />
                            Existing Customer
                        </button>
                    </div>

                    {checkoutType === 'login' ? (
                        <Card className="border-primary/20 bg-primary/5">
                            <CardContent className="pt-6 text-center space-y-4">
                                <p className="text-sm font-medium">Log in to speed up your checkout and earn reward points.</p>
                                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                    <Button asChild variant="outline" className="rounded-full px-8">
                                        <Link href="/login">Login to Account</Link>
                                    </Button>
                                    <Button onClick={() => setCheckoutType('guest')} variant="ghost" className="rounded-full">
                                        Continue as Guest
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ) : (
                        <Card className="border-border/50 shadow-sm">
                            <CardHeader>
                                <CardTitle className="text-xl">Contact Information</CardTitle>
                                <CardDescription>Enter your details for order tracking and delivery.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="email" className="font-semibold text-sm">Email Address</Label>
                                        <Input id="email" type="email" placeholder="john@example.com" className="h-11 rounded-xl bg-muted/30 focus-visible:bg-background transition-all" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="phone" className="font-semibold text-sm">Phone Number</Label>
                                        <Input id="phone" type="tel" placeholder="+880 1XXX-XXXXXX" className="h-11 rounded-xl bg-muted/30 focus-visible:bg-background transition-all" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Billing Details */}
                    <Card className="border-border/50 shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-xl">Billing Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="first-name">First Name</Label>
                                    <Input id="first-name" placeholder="John" className="h-11 rounded-xl" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="last-name">Last Name</Label>
                                    <Input id="last-name" placeholder="Doe" className="h-11 rounded-xl" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="address">Full Address</Label>
                                <Input id="address" placeholder="123 Innovation Drive, Tech City" className="h-11 rounded-xl" />
                            </div>
                            <div className="grid md:grid-cols-3 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="city">City</Label>
                                    <Input id="city" placeholder="Dhaka" className="h-11 rounded-xl" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="country">Country</Label>
                                    <Select defaultValue="bd">
                                        <SelectTrigger className="h-11 rounded-xl">
                                            <SelectValue placeholder="Select Country" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="bd">Bangladesh</SelectItem>
                                            <SelectItem value="us">United States</SelectItem>
                                            <SelectItem value="ca">Canada</SelectItem>
                                            <SelectItem value="uk">United Kingdom</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="zip">Postcode / ZIP</Label>
                                    <Input id="zip" placeholder="1230" className="h-11 rounded-xl" />
                                </div>
                            </div>

                            <div className="flex items-center space-x-3 pt-2">
                                <Checkbox id="invoice" className="w-5 h-5 rounded-md" />
                                <Label htmlFor="invoice" className="text-sm font-medium leading-none cursor-pointer">
                                    I require an invoice for my company
                                </Label>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Payment Method */}
                    <Card className="border-border/50 shadow-sm overflow-hidden">
                        <CardHeader className="bg-muted/30">
                            <CardTitle className="text-xl">Payment Method</CardTitle>
                            <CardDescription>All transactions are secure and encrypted.</CardDescription>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Credit Card */}
                                <div className={cn(
                                    "flex items-center space-x-2 border-2 rounded-2xl p-4 cursor-pointer hover:bg-muted/20 transition-all",
                                    paymentMethod === 'card' ? "border-primary bg-primary/5" : "border-border hover:border-primary/20"
                                )}>
                                    <RadioGroupItem value="card" id="card" className="sr-only" />
                                    <Label htmlFor="card" className="flex items-center gap-4 flex-1 cursor-pointer">
                                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                            <CreditCard className="w-5 h-5 text-primary" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-bold">Credit / Debit Card</p>
                                            <p className="text-xs text-muted-foreground">Visa, Mastercard, Amex</p>
                                        </div>
                                    </Label>
                                </div>

                                {/* PayPal */}
                                <div className={cn(
                                    "flex items-center space-x-2 border-2 rounded-2xl p-4 cursor-pointer hover:bg-muted/20 transition-all",
                                    paymentMethod === 'paypal' ? "border-[#0070ba] bg-[#0070ba]/5" : "border-border hover:border-[#0070ba]/20"
                                )}>
                                    <RadioGroupItem value="paypal" id="paypal" className="sr-only" />
                                    <Label htmlFor="paypal" className="flex items-center gap-4 flex-1 cursor-pointer">
                                        <div className="w-10 h-10 rounded-full bg-[#0070ba]/10 flex items-center justify-center text-[#0070ba] font-bold">P</div>
                                        <div className="flex-1">
                                            <p className="font-bold">PayPal</p>
                                            <p className="text-xs text-muted-foreground">Pay with PayPal balance</p>
                                        </div>
                                    </Label>
                                </div>

                                {/* bKash */}
                                <div className={cn(
                                    "flex items-center space-x-2 border-2 rounded-2xl p-4 cursor-pointer hover:bg-muted/20 transition-all",
                                    paymentMethod === 'bkash' ? "border-[#D12053] bg-[#D12053]/5" : "border-border hover:border-[#D12053]/20"
                                )}>
                                    <RadioGroupItem value="bkash" id="bkash" className="sr-only" />
                                    <Label htmlFor="bkash" className="flex items-center gap-4 flex-1 cursor-pointer">
                                        <div className="w-10 h-10 rounded-full bg-[#D12053]/10 flex items-center justify-center text-[#D12053] font-bold">b</div>
                                        <div className="flex-1">
                                            <p className="font-bold">bKash</p>
                                            <p className="text-xs text-muted-foreground">Mobile Banking (BD)</p>
                                        </div>
                                    </Label>
                                </div>

                                {/* Nagad */}
                                <div className={cn(
                                    "flex items-center space-x-2 border-2 rounded-2xl p-4 cursor-pointer hover:bg-muted/20 transition-all",
                                    paymentMethod === 'nagad' ? "border-[#ED1C24] bg-[#ED1C24]/5" : "border-border hover:border-[#ED1C24]/20"
                                )}>
                                    <RadioGroupItem value="nagad" id="nagad" className="sr-only" />
                                    <Label htmlFor="nagad" className="flex items-center gap-4 flex-1 cursor-pointer">
                                        <div className="w-10 h-10 rounded-full bg-[#ED1C24]/10 flex items-center justify-center text-[#ED1C24] font-bold">n</div>
                                        <div className="flex-1">
                                            <p className="font-bold">Nagad</p>
                                            <p className="text-xs text-muted-foreground">Mobile Financial Service</p>
                                        </div>
                                    </Label>
                                </div>

                                {/* Bank Transfer */}
                                <div className={cn(
                                    "flex items-center space-x-2 border-2 rounded-2xl p-4 cursor-pointer hover:bg-muted/20 transition-all md:col-span-2",
                                    paymentMethod === 'bank' ? "border-foreground bg-foreground/5" : "border-border hover:border-foreground/20"
                                )}>
                                    <RadioGroupItem value="bank" id="bank" className="sr-only" />
                                    <Label htmlFor="bank" className="flex items-center gap-4 flex-1 cursor-pointer">
                                        <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                                            <Building2 className="w-5 h-5 text-foreground" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-bold">Direct Bank Transfer</p>
                                            <p className="text-xs text-muted-foreground">Manual verification required (24-48 hours)</p>
                                        </div>
                                    </Label>
                                </div>
                            </RadioGroup>

                             {paymentMethod === 'card' && (
                                <div className="mt-8 p-6 bg-muted/20 rounded-2xl border border-dashed border-border space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="card-number">Card Number</Label>
                                        <div className="relative">
                                            <Input id="card-number" placeholder="0000 0000 0000 0000" className="h-11 pl-10 rounded-xl" />
                                            <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="expiry">Expiry Date</Label>
                                            <Input id="expiry" placeholder="MM / YY" className="h-11 rounded-xl" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="cvc">CVC</Label>
                                            <div className="relative">
                                                <Input id="cvc" placeholder="123" className="h-11 pl-10 rounded-xl" />
                                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                             )}

                             {['bkash', 'nagad'].includes(paymentMethod) && (
                                <div className="mt-8 p-6 bg-muted/20 rounded-2xl border border-dashed border-border text-center space-y-4">
                                    <Smartphone className="w-8 h-8 text-primary mx-auto" />
                                    <p className="text-sm">Enter your 11-digit mobile number and you will receive a secure payment request.</p>
                                    <Input placeholder="01XXX-XXXXXX" className="h-12 text-center text-xl font-mono tracking-widest max-w-[240px] mx-auto rounded-xl" />
                                </div>
                             )}

                             {paymentMethod === 'bank' && (
                                <div className="mt-8 p-6 bg-muted/20 rounded-2xl border border-dashed border-border space-y-4">
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div className="text-muted-foreground">Account Name:</div>
                                        <div className="font-bold">Oftisoft Limited</div>
                                        <div className="text-muted-foreground">Account Number:</div>
                                        <div className="font-bold">XXXX XXXX XXXX XXXX</div>
                                        <div className="text-muted-foreground">Bank Name:</div>
                                        <div className="font-bold">Dutch-Bangla Bank PLC</div>
                                    </div>
                                    <p className="text-[10px] text-muted-foreground italic">Note: Please include your Order ID as the payment reference.</p>
                                </div>
                             )}
                        </CardContent>
                    </Card>
                </div>

                {/* Order Summary */}
                <div className="lg:col-span-4">
                    <Card className="sticky top-24 border-primary/20 shadow-2xl bg-card/50 backdrop-blur-md overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
                        <CardHeader className="relative">
                            <CardTitle className="flex items-center gap-2">
                                <Wallet className="w-5 h-5 text-primary" />
                                Order Summary
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6 relative">
                            <div className="space-y-4">
                                <div className="flex justify-between gap-4">
                                    <div className="flex-1">
                                        <p className="font-bold text-sm">NeonStore E-commerce Kit</p>
                                        <p className="text-xs text-muted-foreground line-clamp-1">Regular License • v2.1.0</p>
                                    </div>
                                    <p className="text-sm font-bold text-primary">$49.00</p>
                                </div>
                                <div className="flex justify-between gap-4">
                                    <div className="flex-1">
                                        <p className="font-bold text-sm">SaaS Starter Boilerplate</p>
                                        <p className="text-xs text-muted-foreground line-clamp-1">Regular License • v3.0.1</p>
                                    </div>
                                    <p className="text-sm font-bold text-primary">$299.00</p>
                                </div>
                            </div>
                            
                            <Separator />
                            
                            <div className="space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Subtotal</span>
                                    <span className="font-medium">$348.00</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Vat (8%)</span>
                                    <span className="font-medium">$27.84</span>
                                </div>
                                <div className="flex justify-between text-2xl font-black pt-2 text-foreground">
                                    <span>Total</span>
                                    <span>$375.84</span>
                                </div>
                            </div>

                            <Separator />

                            <div className="space-y-4">
                                <div className="flex items-start space-x-3">
                                    <Checkbox id="terms" className="mt-1" defaultChecked />
                                    <Label htmlFor="terms" className="text-xs text-muted-foreground leading-tight cursor-pointer">
                                        I have read and agree to the website <Link href="/terms" className="text-primary hover:underline">terms and conditions</Link> and <Link href="/privacy" className="text-primary hover:underline">privacy policy</Link>.
                                    </Label>
                                </div>

                                <Button className="w-full h-14 rounded-2xl text-lg font-bold shadow-xl shadow-primary/20 group overflow-hidden relative" size="lg">
                                    <span className="relative z-10 flex items-center justify-center gap-2">
                                        Place Order
                                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </span>
                                    <div className="absolute inset-0 bg-primary-foreground/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                                </Button>
                            </div>
                            
                            <div className="flex flex-col gap-3">
                                <div className="flex items-center justify-center gap-2 text-[10px] text-muted-foreground">
                                    <ShieldCheck className="w-3.5 h-3.5 text-green-500" />
                                    <span>Encrypted Secure Payment</span>
                                </div>
                                <div className="flex items-center justify-center gap-3">
                                    {/* Small payment icons or text */}
                                    <div className="text-[10px] px-2 py-0.5 border rounded bg-muted/50">VISA</div>
                                    <div className="text-[10px] px-2 py-0.5 border rounded bg-muted/50">MASTERCARD</div>
                                    <div className="text-[10px] px-2 py-0.5 border rounded bg-muted/50">BKASH</div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}

