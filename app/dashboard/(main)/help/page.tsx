"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
    Search, Book, MessageCircle, Mail, FileQuestion, 
    ChevronRight, ExternalLink 
} from "lucide-react";

const FAQ_ITEMS = [
    { q: "How do I upgrade my plan?", a: "You can upgrade your plan anytime from the Billing > Subscription section. Changes take effect immediately." },
    { q: "Can I manage multiple teams?", a: "Yes, the Pro and Business plans support multiple team management with role-based access control." },
    { q: "Where can I find my API keys?", a: "API keys are located in Settings > Developer. Make sure to keep them secure." },
    { q: "Do you offer refunds?", a: "We offer a 14-day money-back guarantee for all new subscriptions. Contact support for assistance." },
];

const GUIDES = [
    { title: "Getting Started", time: "5 min read", category: "Basics" },
    { title: "Setting up Custom Domains", time: "10 min read", category: "Advanced" },
    { title: "API Documentation", time: "15 min read", category: "Developer" },
];

export default function HelpPage() {
    return (
        <div className=" mx-auto space-y-12">
            
            <div className="text-center space-y-4 py-8">
                <h1 className="text-4xl font-bold">How can we help?</h1>
                <div className="relative max-w-lg mx-auto">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
                    <input 
                        placeholder="Search for answers..." 
                        className="w-full pl-12 pr-6 py-4 rounded-2xl bg-card border border-border shadow-sm focus:ring-2 focus:ring-primary/20 outline-none text-lg"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-card border border-border rounded-3xl p-6 hover:border-primary/30 transition-colors group cursor-pointer">
                    <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-500 mb-4 group-hover:scale-110 transition-transform">
                        <Book className="w-6 h-6" />
                    </div>
                    <h3 className="font-bold text-lg mb-2">Documentation</h3>
                    <p className="text-muted-foreground text-sm mb-4">Detailed guides and API references for developers.</p>
                    <span className="text-sm font-bold text-primary flex items-center gap-1 group-hover:underline">Browse Docs <ChevronRight size={14} /></span>
                </div>

                <div className="bg-card border border-border rounded-3xl p-6 hover:border-primary/30 transition-colors group cursor-pointer">
                    <div className="w-12 h-12 bg-green-500/10 rounded-2xl flex items-center justify-center text-green-500 mb-4 group-hover:scale-110 transition-transform">
                        <MessageCircle className="w-6 h-6" />
                    </div>
                    <h3 className="font-bold text-lg mb-2">Live Chat</h3>
                    <p className="text-muted-foreground text-sm mb-4">Chat with our support team in real-time.</p>
                    <span className="text-sm font-bold text-primary flex items-center gap-1 group-hover:underline">Start Chat <ChevronRight size={14} /></span>
                </div>

                <div className="bg-card border border-border rounded-3xl p-6 hover:border-primary/30 transition-colors group cursor-pointer">
                    <div className="w-12 h-12 bg-purple-500/10 rounded-2xl flex items-center justify-center text-purple-500 mb-4 group-hover:scale-110 transition-transform">
                        <Mail className="w-6 h-6" />
                    </div>
                    <h3 className="font-bold text-lg mb-2">Email Support</h3>
                    <p className="text-muted-foreground text-sm mb-4">Get a response within 24 hours.</p>
                    <span className="text-sm font-bold text-primary flex items-center gap-1 group-hover:underline">Send Email <ChevronRight size={14} /></span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div>
                     <h3 className="text-2xl font-bold mb-6">Frequently Asked Questions</h3>
                     <div className="space-y-4">
                        {FAQ_ITEMS.map((item, i) => (
                            <div key={i} className="bg-muted/20 border border-border rounded-2xl p-5 hover:bg-muted/40 transition-colors">
                                <h4 className="font-bold text-sm mb-2 flex items-start gap-2">
                                    <FileQuestion className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                                    {item.q}
                                </h4>
                                <p className="text-sm text-muted-foreground pl-6">{item.a}</p>
                            </div>
                        ))}
                     </div>
                </div>

                <div>
                    <h3 className="text-2xl font-bold mb-6">Popular Guides</h3>
                    <div className="space-y-4">
                        {GUIDES.map((guide, i) => (
                            <div key={i} className="flex items-center justify-between p-4 bg-card border border-border rounded-2xl hover:border-primary/30 transition-all cursor-pointer group">
                                <div>
                                    <h4 className="font-bold group-hover:text-primary transition-colors">{guide.title}</h4>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        <span className="bg-muted px-2 py-0.5 rounded mr-2 uppercase tracking-wide font-bold">{guide.category}</span>
                                        {guide.time}
                                    </p>
                                </div>
                                <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

        </div>
    );
}
