"use client";

import { mockProducts } from "@/lib/shop-data";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Check, X, ShoppingCart, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function ComparisonPage() {
    // For demo, we compare the first 3 products
    const compareItems = mockProducts.slice(0, 3);

    const features = [
        "Price",
        "Category",
        "License (Regular)",
        "Update Policy",
        "Responsive",
        "Documentation",
        "Demo Availability",
        "Compatibility"
    ];

    return (
        <div className="container px-4 py-16 mx-auto">
            <div className="mb-12">
                <Button asChild variant="ghost" className="mb-4 -ml-4 gap-2">
                    <Link href="/shop"><ArrowLeft className="w-4 h-4" /> Back to Shop</Link>
                </Button>
                <h1 className="text-4xl md:text-6xl font-black tracking-tighter">Compare Products</h1>
                <p className="text-muted-foreground text-lg">Compare features side-by-side to make the best choice for your project.</p>
            </div>

            <div className="overflow-x-auto rounded-[2rem] border border-border bg-card/30 backdrop-blur-sm">
                <Table>
                    <TableHeader>
                        <TableRow className="hover:bg-transparent border-border/50">
                            <TableHead className="w-[200px] font-black uppercase text-xs">Features</TableHead>
                            {compareItems.map(product => (
                                <TableHead key={product.id} className="min-w-[250px] p-6">
                                    <div className="space-y-4">
                                        <div className="relative aspect-video rounded-xl overflow-hidden border border-border">
                                            <Image src={product.image} alt={product.name} fill className="object-cover" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-base leading-tight mb-1">{product.name}</h3>
                                            <p className="text-2xl font-black text-primary">${product.price}</p>
                                        </div>
                                        <Button className="w-full rounded-xl gap-2 h-10">
                                            <ShoppingCart className="w-4 h-4" />
                                            Add to Cart
                                        </Button>
                                    </div>
                                </TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <TableRow className="border-border/50 hover:bg-primary/5">
                            <TableCell className="font-bold py-6 px-4">Category</TableCell>
                            {compareItems.map(p => (
                                <TableCell key={p.id} className="py-6 px-6">
                                    <Badge variant="secondary" className="bg-primary/5 text-primary border-primary/10 whitespace-nowrap">
                                        {p.category}
                                    </Badge>
                                </TableCell>
                            ))}
                        </TableRow>
                        <TableRow className="border-border/50 hover:bg-primary/5">
                            <TableCell className="font-bold py-6 px-4">License</TableCell>
                            {compareItems.map(p => (
                                <TableCell key={p.id} className="py-6 px-6 text-sm">
                                    Up to 1 project
                                </TableCell>
                            ))}
                        </TableRow>
                        <TableRow className="border-border/50 hover:bg-primary/5">
                            <TableCell className="font-bold py-6 px-4">Updates</TableCell>
                            {compareItems.map(p => (
                                <TableCell key={p.id} className="py-6 px-6 text-sm">
                                    {p.updatePolicy}
                                </TableCell>
                            ))}
                        </TableRow>
                        <TableRow className="border-border/50 hover:bg-primary/5">
                            <TableCell className="font-bold py-6 px-4">Responsive</TableCell>
                            {compareItems.map(p => (
                                <TableCell key={p.id} className="py-6 px-6 text-sm">
                                    <Check className="w-5 h-5 text-green-500" />
                                </TableCell>
                            ))}
                        </TableRow>
                        <TableRow className="border-border/50 hover:bg-primary/5">
                            <TableCell className="font-bold py-6 px-4">Compatibility</TableCell>
                            {compareItems.map(p => (
                                <TableCell key={p.id} className="py-6 px-6">
                                    <div className="flex flex-wrap gap-1">
                                        {p.compatibility.slice(0, 2).map(c => (
                                            <span key={c} className="text-[10px] bg-muted px-2 py-0.5 rounded border border-border">{c}</span>
                                        ))}
                                    </div>
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
