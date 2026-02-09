"use client";

import { useState } from "react";
import { 
    Star, 
    MessageSquare, 
    CheckCircle2, 
    Clock, 
    ThumbsUp, 
    MoreHorizontal, 
    PenLine, 
    Search,
    Filter,
    ChevronRight,
    SearchX,
    Trash2,
    ShieldCheck,
    Megaphone,
    Package,
    Loader2
} from "lucide-react";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { 
    Dialog, 
    DialogContent, 
    DialogDescription, 
    DialogHeader, 
    DialogTitle, 
    DialogTrigger,
    DialogFooter
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useReviews } from "@/hooks/useReviews";
import { useProducts } from "@/hooks/useProducts";

export default function ReviewsPage() {
    const { reviews, isLoading: isReviewsLoading, createReview, deleteReview, isCreating } = useReviews();
    const { products, isLoading: isProductsLoading } = useProducts();
    const [searchQuery, setSearchQuery] = useState("");
    const [isWritingReview, setIsWritingReview] = useState(false);
    const [selectedProductId, setSelectedProductId] = useState("");
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [comment, setComment] = useState("");

    const selectedProduct = products?.find(p => p.id === selectedProductId);

    const filteredReviews = reviews?.filter(r => 
        r.product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.comment.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

    const handleSubmitReview = () => {
        if (!selectedProductId) {
            toast.error("Please select a product to review.");
            return;
        }
        if (rating === 0) {
            toast.error("Please select a rating level.");
            return;
        }
        if (comment.length < 10) {
            toast.error("Comment must be at least 10 characters.");
            return;
        }

        createReview({
            productId: selectedProductId,
            rating,
            comment
        }, {
            onSuccess: () => {
                setIsWritingReview(false);
                setRating(0);
                setComment("");
                setSelectedProductId("");
            }
        });
    };

    const handleDeleteReview = (id: string) => {
        deleteReview(id);
    };

    const isLoading = isReviewsLoading || isProductsLoading;

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-8 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black italic tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                        Feedback & Intelligence
                    </h1>
                    <p className="text-muted-foreground font-medium mt-1">Review your acquired artifacts and contribution to the builder ecosystem.</p>
                </div>
                <div className="flex gap-2">
                    <Dialog open={isWritingReview} onOpenChange={setIsWritingReview}>
                        <DialogTrigger asChild>
                            <Button className="rounded-xl gap-2 font-bold h-11 bg-primary text-white shadow-lg shadow-primary/20">
                                <PenLine className="w-4 h-4" /> Share Feedback
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl rounded-[40px] border-border/50 bg-card/95 backdrop-blur-xl p-10">
                            <DialogHeader className="space-y-2">
                                <DialogTitle className="text-3xl font-black italic">Create Intelligence Node</DialogTitle>
                                <DialogDescription className="text-sm font-medium">Your feedback helps architects refine their artifacts for the global network.</DialogDescription>
                            </DialogHeader>
                            
                            <div className="py-8 space-y-8">
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black uppercase text-muted-foreground italic">Target Artifact</label>
                                    <Select value={selectedProductId} onValueChange={setSelectedProductId}>
                                        <SelectTrigger className="w-full h-14 rounded-2xl bg-muted/20 border-border/30 px-4 font-bold">
                                            <SelectValue placeholder="Select a product to review" />
                                        </SelectTrigger>
                                        <SelectContent className="max-h-[300px]">
                                            {products?.map((product) => (
                                                <SelectItem key={product.id} value={product.id} className="font-medium">
                                                    {product.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    
                                    {selectedProduct && (
                                        <div className="flex items-center gap-4 p-4 rounded-2xl bg-muted/20 border border-border/30 animate-in fade-in slide-in-from-top-2">
                                            <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-border bg-muted">
                                                {selectedProduct.image ? (
                                                     <Image src={selectedProduct.image} alt={selectedProduct.name} fill className="object-cover" />
                                                ) : <div className="w-full h-full bg-primary/10 flex items-center justify-center text-primary font-bold">{selectedProduct.name[0]}</div>}
                                            </div>
                                            <div>
                                                <p className="font-black italic text-lg">{selectedProduct.name}</p>
                                                <p className="text-[10px] text-muted-foreground font-bold uppercase">{selectedProduct.version} Build</p>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-4">
                                    <label className="text-[10px] font-black uppercase text-muted-foreground italic text-center block">Satisfaction Level</label>
                                    <div className="flex justify-center gap-2">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button
                                                key={star}
                                                onMouseEnter={() => setHoverRating(star)}
                                                onMouseLeave={() => setHoverRating(0)}
                                                onClick={() => setRating(star)}
                                                className="p-2 transition-all hover:scale-125 focus:outline-none"
                                            >
                                                <Star 
                                                    className={cn("w-10 h-10 transition-all", 
                                                        (hoverRating || rating) >= star ? "fill-primary text-primary" : "text-muted-foreground opacity-30"
                                                    )} 
                                                />
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <label className="text-[10px] font-black uppercase text-muted-foreground italic">Feedback Payload</label>
                                    <Textarea 
                                        placeholder="Detailed analysis of the artifact's performance, build quality, and implementation..."
                                        className="h-32 rounded-2xl bg-muted/20 border-border/50 focus:ring-primary/20 p-6 font-medium resize-none"
                                        value={comment}
                                        onChange={(e) => setComment(e.target.value)}
                                    />
                                </div>
                            </div>

                            <DialogFooter className="gap-2">
                                <Button variant="outline" className="rounded-xl h-auto font-bold px-8" onClick={() => setIsWritingReview(false)}>Cancel Activation</Button>
                                <Button 
                                    className="rounded-xl h-auto bg-primary text-white font-black italic px-10 shadow-lg shadow-primary/20" 
                                    onClick={handleSubmitReview}
                                    disabled={isCreating}
                                >
                                    {isCreating ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : "Deploy Review"}
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            <Tabs defaultValue="my-reviews" className="space-y-6">
                <TabsList className="bg-muted/50 p-1 rounded-2xl h-14 w-fit border border-border">
                    <TabsTrigger value="my-reviews" className="rounded-xl h-auto gap-2 data-[state=active]:bg-background data-[state=active]:shadow-md font-bold px-10">
                        <MessageSquare className="w-4 h-4" /> My Node Contributions
                    </TabsTrigger>
                    <TabsTrigger value="pending" className="rounded-xl h-auto gap-2 data-[state=active]:bg-background data-[state=active]:shadow-md font-bold px-10 relative">
                        <Clock className="w-4 h-4" /> Signal Moderation
                        <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-[8px] flex items-center justify-center rounded-full text-white font-black border-2 border-background">
                            {reviews?.filter(r => r.status === "pending").length || 0}
                        </span>
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="my-reviews" className="space-y-8">
                     <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                        <div className="relative max-w-md w-full">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input 
                                placeholder="Filter feedback nodes..." 
                                className="pl-11 h-auto rounded-2xl bg-card/50 border-border/50 focus:ring-primary/20 transition-all shadow-sm"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <div className="flex gap-2">
                            <Button variant="outline" className="h-auto rounded-2xl border-border/50 bg-card/50"><Filter className="w-4 h-4 mr-2" /> All Ratings</Button>
                        </div>
                    </div>

                    <div className="grid gap-6">
                        <AnimatePresence>
                            {filteredReviews.length > 0 ? (
                                filteredReviews.map((review) => (
                                    <motion.div
                                        key={review.id}
                                        layout
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                    >
                                        <Card className="border-border/50 bg-card/60 backdrop-blur-md overflow-hidden rounded-[40px] hover:border-primary/20 transition-all group">
                                            <div className="flex flex-col lg:flex-row">
                                                <div className="p-8 lg:p-10 flex-1 flex flex-col md:flex-row gap-8">
                                                    <div className="w-24 h-24 rounded-[32px] overflow-hidden bg-muted shrink-0 border border-border shadow-inner relative group-hover:scale-110 transition-transform duration-500 flex items-center justify-center">
                                                        {review.product.image ? (
                                                            <Image src={review.product.image} alt={review.product.name} fill className="object-cover" />
                                                        ) : <Package className="w-10 h-10 text-muted-foreground opacity-50" />}
                                                    </div>
                                                    <div className="flex-1 space-y-4">
                                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                                            <div>
                                                                <h3 className="font-black italic text-xl group-hover:text-primary transition-colors">{review.product.name}</h3>
                                                                <div className="flex items-center gap-1.5 mt-1">
                                                                    {[1, 2, 3, 4, 5].map((star) => (
                                                                        <Star key={star} className={cn("w-3.5 h-3.5", star <= review.rating ? "fill-primary text-primary" : "text-muted-foreground opacity-30")} />
                                                                    ))}
                                                                    <span className="text-[10px] font-black text-muted-foreground ml-2 uppercase tracking-widest">{new Date(review.createdAt).toLocaleDateString()}</span>
                                                                </div>
                                                            </div>
                                                            <div className="flex items-center gap-3">
                                                                <Badge className={cn("text-[9px] font-black uppercase tracking-tighter px-3 h-6 border-none", 
                                                                    review.status === "approved" ? "bg-green-500 text-white" : 
                                                                    review.status === "pending" ? "bg-orange-500 text-white" : "bg-red-500 text-white"
                                                                )}>
                                                                    {review.status === "approved" ? <CheckCircle2 className="w-3 h-3 mr-1" /> : <Clock className="w-3 h-3 mr-1" />}
                                                                    {review.status}
                                                                </Badge>
                                                                <button onClick={() => handleDeleteReview(review.id)} className="p-2 h-10 w-10 rounded-xl bg-muted/30 hover:bg-red-500/10 hover:text-red-500 transition-colors">
                                                                    <Trash2 size={16} />
                                                                </button>
                                                            </div>
                                                        </div>
                                                        <p className="text-muted-foreground font-medium leading-relaxed italic border-l-4 border-primary/20 pl-4 py-2 break-words">
                                                            "{review.comment}"
                                                        </p>
                                                        <div className="flex items-center gap-6 pt-2">
                                                            <div className="flex items-center gap-2 text-xs font-black text-muted-foreground uppercase italic cursor-default">
                                                                <ThumbsUp className="w-3.5 h-3.5" /> {review.helpfulCount} Build Architects found this helpful
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="p-8 lg:w-[300px] bg-primary/[0.01] border-l border-border/50 flex flex-col justify-center space-y-4">
                                                    <div className="space-y-1">
                                                        <p className="text-[10px] uppercase font-black text-muted-foreground italic">Acquisition Status</p>
                                                        <p className="text-sm font-black flex items-center gap-2"><Package className="w-4 h-4 text-primary" /> Verified Purchase</p>
                                                    </div>
                                                    <div className="space-y-1">
                                                        <p className="text-[10px] uppercase font-black text-muted-foreground italic">Impact Level</p>
                                                        <p className="text-sm font-black flex items-center gap-2"><Megaphone className="w-4 h-4 text-indigo-500" /> Community Signal {(review.rating * 1.7).toFixed(1)}/10</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </Card>
                                    </motion.div>
                                ))
                            ) : (
                                <div className="p-20 text-center space-y-4 bg-muted/20 rounded-[40px] border-2 border-dashed border-border/50">
                                    <SearchX className="w-16 h-16 text-muted-foreground mx-auto opacity-20" />
                                    <div className="space-y-1">
                                        <h3 className="text-xl font-black italic">No Intelligence Nodes Found</h3>
                                        <p className="text-muted-foreground text-sm font-medium">Your reviews and ratings will be cataloged here.</p>
                                    </div>
                                    <Button className="rounded-xl bg-primary font-bold">Explore Marketplace</Button>
                                </div>
                            )}
                        </AnimatePresence>
                    </div>
                </TabsContent>

                <TabsContent value="pending" className="space-y-6">
                    <div className="p-12 rounded-[50px] bg-primary/[0.02] border-2 border-dashed border-primary/10 flex flex-col items-center text-center space-y-6">
                        <div className="w-20 h-20 rounded-[32px] bg-background border border-border flex items-center justify-center text-primary shadow-2xl">
                            <ShieldCheck className="w-10 h-10" />
                        </div>
                        <div className="max-w-2xl space-y-2">
                            <h3 className="text-2xl font-black italic">Verification Infrastructure Active</h3>
                            <p className="text-muted-foreground font-medium leading-relaxed">
                                Our global moderation protocols ensure all intelligence nodes meet the Oftisoft quality threshold. 
                                Pending reviews are typically de-queued within 4-12 temporal cycles.
                            </p>
                        </div>
                        <div className="flex gap-4">
                            <Badge className="bg-green-500 text-white font-black italic rounded-xl px-4 py-1">Anti-AI Pattern Scan: Pass</Badge>
                            <Badge className="bg-blue-500 text-white font-black italic rounded-xl px-4 py-1">Originality Check: 100%</Badge>
                        </div>
                    </div>

                    <div className="grid gap-4">
                        {reviews?.filter(r => r.status === "pending").map(r => (
                            <div key={r.id} className="p-8 rounded-[32px] bg-card/50 border border-orange-500/20 flex items-center justify-between group">
                                <div className="flex items-center gap-6">
                                    <Clock className="w-8 h-8 text-orange-500 animate-pulse" />
                                    <div>
                                        <h4 className="font-black italic text-lg">{r.product.name}</h4>
                                        <p className="text-xs text-muted-foreground font-medium italic mt-0.5 line-clamp-1 truncate max-w-sm">"{r.comment}"</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] font-black uppercase text-muted-foreground mb-1">Queue Status</p>
                                    <Badge className="bg-orange-500/10 text-orange-500 border-orange-500/20 font-black italic px-4">Awaiting Signal Sync</Badge>
                                </div>
                            </div>
                        ))}
                    </div>
                </TabsContent>
            </Tabs>

            {/* Contribution Info */}
            <div className="mt-12 p-12 rounded-[50px] bg-indigo-500/[0.03] border-2 border-indigo-500/10 relative overflow-hidden group">
                <div className="absolute -right-20 -bottom-20 w-96 h-96 bg-indigo-500/10 blur-[100px] rounded-full pointer-events-none group-hover:bg-indigo-500/20 transition-colors duration-1000" />
                <div className="flex flex-col lg:flex-row items-center gap-10 relative z-10">
                    <div className="w-32 h-32 rounded-[40px] bg-background flex items-center justify-center border border-indigo-500/20 shadow-2xl group-hover:scale-110 transition-all duration-700">
                        <Star className="w-14 h-14 text-primary fill-primary shadow-xl shadow-primary/10" />
                    </div>
                    <div className="flex-1 text-center lg:text-left space-y-2">
                        <h3 className="text-3xl font-black italic tracking-tight italic">Ecosystem Merit Protocol</h3>
                        <p className="text-muted-foreground max-w-3xl font-medium text-lg leading-relaxed italic">
                            Your contributions drive the evolution of the Oftisoft marketplace. Architects rely on your intelligence 
                            to iterate on their builds. Frequent high-quality reviewers gain "Market Critic" status, 
                            unlocking exclusive early-access artifacts.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
