"use client";

import { PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2, Lock } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCart } from "@/hooks/use-cart";

export function StripePaymentForm({ amount }: { amount: number }) {
    const stripe = useStripe();
    const elements = useElements();
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const clearCart = useCart((state) => state.clearCart);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!stripe || !elements) return;

        setIsLoading(true);

        const { error } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                return_url: `${window.location.origin}/shop/success`,
            },
            redirect: 'if_required', // Handle redirect manually if needed, or let Stripe handle it
        });

        if (error) {
            toast.error(error.message);
            setIsLoading(false);
        } else {
            // If redirect: 'if_required' is used and no redirect happens (e.g. successful card payment without 3DS), we manually redirect.
            // However, confirmPayment usually redirects if success url is provided. 
            // In 'if_required' mode, if payment succeeds immediately:
             clearCart();
             router.push("/shop/success");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <PaymentElement />
            <Button 
                disabled={!stripe || isLoading} 
                className="w-full h-12 text-lg font-bold shadow-lg shadow-primary/25 rounded-full"
            >
                {isLoading ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                    </>
                ) : (
                    <>
                        Pay ${amount.toFixed(2)}
                        <Lock className="w-4 h-4 ml-2" />
                    </>
                )}
            </Button>
            <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                <Lock className="w-3 h-3" />
                Payments are secure and encrypted.
            </div>
        </form>
    );
}
