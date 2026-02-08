"use client";

import { useState } from "react";
import { 
    Heart, 
    Bell, 
    ArrowRightLeft, 
    ShoppingCart, 
    Trash2, 
    TrendingDown, 
    ExternalLink, 
    Star,
    ChevronRight,
    Search,
    Filter,
    X,
    ArrowUpRight,
    Zap,
    ShieldCheck,
    Check
} from "lucide-react";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

import { useFavorites } from "@/hooks/useFavorites";

export default function FavoritesPage() {
    const { wishlist, isLoading, removeFromWishlist } = useFavorites();
    const [compareList, setCompareList] = useState<string[]>([]);
    const [searchQuery, setSearchQuery] = useState("");

    const toggleCompare = (id: string) => {
        if (compareList.includes(id)) {
            setCompareList(compareList.filter(i => i !== id));
        } else {
            if (compareList.length >= 3) {
                toast.warning("Comparison limit reached (Max 3)");
                return;
            }
            setCompareList([...compareList, id]);
            toast.success("Added to comparison engine");
        }
    };

    const filteredWishlist = wishlist ? wishlist.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
    ) : [];

    // Use items from wishlist for comparison source of truth
    const productsToCompare = wishlist ? wishlist.filter(p => compareList.includes(p.id)) : [];

    return (
        <div className="space-y-8 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black italic tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                        Wishlist & Curator
                    </h1>
                    <p className="text-muted-foreground font-medium mt-1">Manage your curated product selection, track price volatility and compare builds.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="rounded-xl gap-2 font-bold h-11 border-border/50 bg-card/50 backdrop-blur-sm">
                        <Bell className="w-4 h-4" /> Signal Alerts
                    </Button>
                    <Link href="/shop" passHref>
                        <Button className="rounded-xl gap-2 font-bold h-11 bg-primary text-white shadow-lg shadow-primary/20">
                            Discover More
                        </Button>
                    </Link>
                </div>
            </div>

            <Tabs defaultValue="saved" className="space-y-6">
                <TabsList className="bg-muted/50 p-1 rounded-2xl h-14 w-fit border border-border">
                    <TabsTrigger value="saved" className="rounded-xl h-auto gap-2 data-[state=active]:bg-background data-[state=active]:shadow-md font-bold px-8">
                        <Heart className="w-4 h-4" /> Saved Items
                    </TabsTrigger>
                    <TabsTrigger value="comparison" className="rounded-xl h-auto gap-2 data-[state=active]:bg-background data-[state=active]:shadow-md font-bold px-8">
                        <ArrowRightLeft className="w-4 h-4" /> Comparison Engine
                        {compareList.length > 0 && <Badge className="ml-2 h-5 min-w-5 px-1 bg-primary text-white border-none">{compareList.length}</Badge>}
                    </TabsTrigger>
                    <TabsTrigger value="alerts" className="rounded-xl h-auto gap-2 data-[state=active]:bg-background data-[state=active]:shadow-md font-bold px-8 relative">
                        <TrendingDown className="w-4 h-4" /> Price Drop Matrix
                        <span className="absolute -top-1 -right-1 w-4 h-4 bg-orange-500 text-[8px] flex items-center justify-center rounded-full text-white font-black border-2 border-background">1</span>
                    </TabsTrigger>
                </TabsList>

                {/* Saved Items Tab */}
                <TabsContent value="saved" className="space-y-6">
                    <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                        <div className="relative max-w-md w-full">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input 
                                placeholder="Filter your wishlist..." 
                                className="pl-11 h-auto rounded-2xl bg-card/50 border-border/50 focus:ring-primary/20 transition-all shadow-sm"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <div className="flex gap-2">
                            <Button variant="outline" className="h-auto rounded-2xl border-border/50 bg-card/50"><Filter className="w-4 h-4 mr-2" /> All Categories</Button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <AnimatePresence>
                            {filteredWishlist.map((product) => (
                                <motion.div
                                    key={product.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    className="group"
                                >
                                    <Card className="border-border/50 bg-card/50 backdrop-blur-md overflow-hidden hover:border-primary/30 transition-all rounded-[32px] h-full flex flex-col shadow-sm">
                                        <div className="relative aspect-video overflow-hidden group/img">
                                            <Image 
                                                src={product.image} 
                                                alt={product.name} 
                                                fill 
                                                className="object-cover group-hover/img:scale-110 transition-transform duration-700" 
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover/img:opacity-100 transition-opacity duration-500" />
                                            <button 
                                                onClick={() => removeFromWishlist(product.id)}
                                                className="absolute top-4 right-4 w-10 h-10 rounded-xl bg-background/80 backdrop-blur-md flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-lg"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                            <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end translate-y-full group-hover/img:translate-y-0 transition-transform duration-500">
                                                <Badge className="bg-primary/90 text-white border-none font-black italic">{product.rating} <Star className="w-3 h-3 ml-1 fill-white" /></Badge>
                                            </div>
                                        </div>
                                        <CardContent className="p-6 flex-1 space-y-4">
                                            <div>
                                                <p className="text-[10px] font-black uppercase text-primary tracking-widest mb-1">{product.category}</p>
                                                <h3 className="font-black italic text-lg leading-tight group-hover:text-primary transition-colors">{product.name}</h3>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <p className="text-2xl font-black italic">${product.price}</p>
                                                <Badge variant="outline" className="text-[8px] uppercase font-bold border-green-500/30 text-green-500 bg-green-500/5">In Stock</Badge>
                                            </div>
                                        </CardContent>
                                        <CardFooter className="px-6 pb-6 pt-0 flex flex-col gap-2">
                                            <Button 
                                                className="w-full rounded-xl bg-primary text-white font-bold h-11 gap-2 shadow-lg shadow-primary/20"
                                                onClick={() => toast.success("Added to integrated cart!")}
                                            >
                                                <ShoppingCart className="w-4 h-4" /> Deploy to Cart
                                            </Button>
                                            <Button 
                                                variant="outline" 
                                                className={cn("w-full rounded-xl h-11 gap-2 font-bold border-border/50", 
                                                    compareList.includes(product.id) ? "bg-primary/10 border-primary text-primary" : "bg-card/50"
                                                )}
                                                onClick={() => toggleCompare(product.id)}
                                            >
                                                <ArrowRightLeft className="w-4 h-4" /> {compareList.includes(product.id) ? "In Comparison" : "Compare Build"}
                                            </Button>
                                        </CardFooter>
                                    </Card>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>

                    {filteredWishlist.length === 0 && (
                        <div className="py-20 text-center space-y-4 bg-muted/20 rounded-[40px] border-2 border-dashed border-border/50">
                            <Heart className="w-16 h-16 text-muted-foreground mx-auto opacity-20" />
                            <div className="space-y-1">
                                <h3 className="text-xl font-black italic">Curated Space Empty</h3>
                                <p className="text-muted-foreground text-sm font-medium">Items you favorite will materialize here for future acquisition.</p>
                            </div>
                            <Button className="rounded-xl bg-primary font-bold">Go Shop</Button>
                        </div>
                    )}
                </TabsContent>

                {/* Comparison Tab */}
                <TabsContent value="comparison" className="space-y-8">
                    {compareList.length > 0 ? (
                        <div className="overflow-x-auto pb-4 custom-scrollbar">
                            <div className="min-w-[800px] grid grid-cols-4 gap-4">
                                <div className="p-8 flex flex-col justify-end space-y-4">
                                    <h4 className="text-sm font-black uppercase text-muted-foreground tracking-widest border-l-4 border-primary pl-4">Build Specifications</h4>
                                    <div className="space-y-8 py-10">
                                        <p className="text-xs font-black uppercase italic text-muted-foreground">Category Matrix</p>
                                        <p className="text-xs font-black uppercase italic text-muted-foreground">Original Price</p>
                                        <p className="text-xs font-black uppercase italic text-muted-foreground">Tech Stack</p>
                                        <p className="text-xs font-black uppercase italic text-muted-foreground">Latest Build</p>
                                        <p className="text-xs font-black uppercase italic text-muted-foreground">Primary Policy</p>
                                    </div>
                                </div>

                                {productsToCompare.map((p) => (
                                    <Card key={p.id} className="border-border/50 bg-card/60 backdrop-blur-md overflow-hidden rounded-[40px] shadow-lg">
                                        <div className="p-6 space-y-6">
                                            <div className="relative aspect-square rounded-3xl overflow-hidden border border-border/50 group">
                                                <Image src={p.image} alt={p.name} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                                                <button 
                                                    onClick={() => toggleCompare(p.id)}
                                                    className="absolute top-3 right-3 w-8 h-8 rounded-full bg-background/80 flex items-center justify-center text-muted-foreground hover:text-red-500 transition-all opacity-0 group-hover:opacity-100"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>
                                            <div className="text-center h-16 flex flex-col justify-center">
                                                <h5 className="font-black italic text-lg leading-tight line-clamp-2">{p.name}</h5>
                                            </div>
                                            
                                            <div className="space-y-8 py-4 text-center border-t border-border/30">
                                                <p className="text-xs font-bold truncate px-2">{p.category}</p>
                                                <p className="text-xl font-black italic">${p.price}</p>
                                                <div className="flex flex-wrap justify-center gap-1">
                                                    {p.tags && p.tags.slice(0, 2).map((t: string, i: number) => (
                                                        <Badge key={i} variant="outline" className="text-[8px] border-primary/20 text-primary font-black uppercase">{t}</Badge>
                                                    ))}
                                                </div>
                                                <p className="text-xs font-bold text-muted-foreground">{p.version}</p>
                                                <p className="text-[10px] font-black uppercase leading-tight italic opacity-70 px-4">{p.updatePolicy}</p>
                                            </div>

                                            <Button className="w-full rounded-2xl h-auto bg-primary text-white font-black italic shadow-lg shadow-primary/20">
                                                Acquire Build
                                            </Button>
                                        </div>
                                    </Card>
                                ))}

                                {compareList.length < 3 && (
                                    <div className="border-2 border-dashed border-border/50 rounded-[40px] bg-muted/10 flex flex-col items-center justify-center p-8 text-center space-y-4 group cursor-pointer hover:bg-primary/[0.02] transition-all">
                                        <div className="w-16 h-16 rounded-full bg-background flex items-center justify-center text-muted-foreground group-hover:scale-110 transition-transform">
                                            <Plus className="w-8 h-8 opacity-20 group-hover:opacity-100" />
                                        </div>
                                        <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest italic group-hover:text-primary">Add Candidate For Comparison</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="py-20 text-center space-y-4 bg-muted/20 rounded-[40px] border-2 border-dashed border-border/50">
                            <ArrowRightLeft className="w-16 h-16 text-muted-foreground mx-auto opacity-20" />
                            <div className="space-y-1">
                                <h3 className="text-xl font-black italic">Engine Standby</h3>
                                <p className="text-muted-foreground text-sm font-medium">Select up to 3 artifacts from your wishlist to initiate side-by-side analysis.</p>
                            </div>
                        </div>
                    )}
                </TabsContent>

                {/* Alerts Tab */}
                <TabsContent value="alerts" className="space-y-6">
                    <div className="grid gap-4 max-w-4xl">
                        <Card className="border-border/50 bg-orange-500/[0.03] overflow-hidden relative group p-8 rounded-[40px] border-2 border-orange-500/20">
                            <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-orange-500/10 blur-[100px] rounded-full pointer-events-none" />
                            <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
                                <div className="w-32 h-32 rounded-[32px] overflow-hidden border-2 border-orange-500/30 shadow-2xl shrink-0 bg-muted">
                                    <Image src={wishlist[0]?.image || '/placeholder.png'} alt="Alert Image" fill className="object-cover" />
                                </div>
                                <div className="flex-1 space-y-3">
                                    <div className="flex items-center gap-3">
                                        <Badge className="bg-orange-500 text-white font-black text-[9px] uppercase tracking-tighter">Volatility Signal</Badge>
                                        <span className="text-[10px] font-bold text-muted-foreground uppercase">Released 2 hours ago</span>
                                    </div>
                                    <h3 className="text-2xl font-black italic tracking-tight">{wishlist[0]?.name || "Oftisoft Prime"}</h3>
                                    <div className="flex items-center gap-6">
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-black text-muted-foreground uppercase italic mb-1">Standard Market Val</span>
                                            <span className="text-lg font-bold text-muted-foreground line-through">$49.00</span>
                                        </div>
                                        <ArrowUpRight className="w-5 h-5 text-green-500 rotate-45" />
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-black text-green-500 uppercase italic mb-1">Target Entry Val</span>
                                            <span className="text-3xl font-black italic text-green-500">$29.00 <span className="text-sm font-black">(-40%)</span></span>
                                        </div>
                                    </div>
                                    <p className="text-xs text-muted-foreground font-medium italic">Signal expires in 14 hours. Act now to secure the acquisition at this preferential rate.</p>
                                </div>
                                <div className="flex flex-col gap-3">
                                    <Button className="rounded-2xl h-14 px-8 bg-orange-500 text-white font-black italic shadow-xl shadow-orange-500/20 hover:scale-[1.02] transition-all">Secure Acquisition</Button>
                                    <Button variant="outline" className="rounded-2xl h-auto font-bold border-orange-500/20">Mute Signal</Button>
                                </div>
                            </div>
                        </Card>

                        <div className="p-10 rounded-[40px] bg-primary/[0.02] border border-border/50 relative overflow-hidden group">
                           <div className="flex items-center gap-8">
                                <div className="w-16 h-16 rounded-[24px] bg-background border border-border/50 flex items-center justify-center text-primary shadow-xl">
                                    <ShieldCheck className="w-8 h-8" />
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-black italic text-lg italic">Signal Infrastructure Active</h4>
                                    <p className="text-xs text-muted-foreground font-medium leading-relaxed max-w-lg mt-1">
                                        We monitor global market fluctuations across your wishlist candidates in real-time. You'll be alerted via Edge Push 
                                        and Satellite SMS when a target build hits your indicated price threshold.
                                    </p>
                                </div>
                                <Button variant="link" className="text-primary font-black text-xs uppercase underline tracking-tighter">Refine Signal Logic</Button>
                           </div>
                        </div>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}

function Plus(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  )
}
