"use client";

import { motion } from "framer-motion";
import { 
    Users, TrendingUp, DollarSign, Activity, Globe, Server, 
    ArrowUpRight, ArrowDownRight, Clock 
} from "lucide-react";
import { cn } from "@/lib/utils";

// Mock Data
const STATS = [
    { title: "Total Revenue", value: "$428,500", change: "+12.5%", trend: "up", icon: DollarSign, color: "text-green-500", bg: "bg-green-500/10" },
    { title: "Active Users", value: "24.6k", change: "+8.2%", trend: "up", icon: Users, color: "text-blue-500", bg: "bg-blue-500/10" },
    { title: "Avg. Session", value: "4m 32s", change: "-2.4%", trend: "down", icon: Clock, color: "text-orange-500", bg: "bg-orange-500/10" },
    { title: "System Health", value: "99.9%", change: "+0.1%", trend: "up", icon: Activity, color: "text-purple-500", bg: "bg-purple-500/10" },
];

export default function AdminAnalyticsPage() {
    return (
        <div className=" mx-auto space-y-8">
             <div className="flex flex-col">
                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-500">
                    System Analytics
                </h1>
                <p className="text-muted-foreground">Real-time platform performance breakdown.</p>
            </div>

            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {STATS.map((stat, i) => (
                    <motion.div
                        key={stat.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-card border border-border rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div className={cn("p-3 rounded-xl", stat.bg, stat.color)}>
                                <stat.icon className="w-5 h-5" />
                            </div>
                            <div className={cn(
                                "flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full border",
                                stat.trend === "up" ? "text-green-500 bg-green-500/5 border-green-500/10" : "text-red-500 bg-red-500/5 border-red-500/10"
                            )}>
                                {stat.trend === "up" ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                                {stat.change}
                            </div>
                        </div>
                        <h3 className="text-3xl font-bold mb-1 text-card-foreground">{stat.value}</h3>
                        <p className="text-sm text-muted-foreground font-medium">{stat.title}</p>
                    </motion.div>
                ))}
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Traffic Map (Mock) */}
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 }}
                    className="bg-card border border-border rounded-3xl p-8 shadow-sm h-[400px] flex flex-col"
                >
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-xl font-bold flex items-center gap-2">
                                <Globe className="w-5 h-5 text-blue-500" /> Global Traffic
                            </h3>
                            <p className="text-sm text-muted-foreground">User distribution by region</p>
                        </div>
                        <button className="text-sm font-bold text-primary hover:underline">View Report</button>
                    </div>
                    
                    {/* Abstract Map Visualization */}
                    <div className="flex-1 relative rounded-2xl overflow-hidden bg-muted/20 border border-border/50 flex items-center justify-center group">
                        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-500/10 via-transparent to-transparent opacity-50" />
                        <div className="relative grid place-items-center">
                             <div className="w-40 h-40 rounded-full border-2 border-blue-500/20 animate-ping absolute" style={{ animationDuration: '3s' }} />
                             <div className="w-60 h-60 rounded-full border border-blue-500/10 animate-ping absolute" style={{ animationDuration: '4s', animationDelay: '1s' }} />
                             <Globe className="w-20 h-20 text-muted-foreground/30 group-hover:text-primary/50 transition-colors" />
                             <div className="absolute top-0 right-10 flex gap-2">
                                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                <span className="text-xs font-bold">5,231 Live</span>
                             </div>
                        </div>
                    </div>
                </motion.div>

                {/* Server Load (Mock) */}
                 <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 }}
                    className="bg-card border border-border rounded-3xl p-8 shadow-sm h-[400px] flex flex-col"
                >
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-xl font-bold flex items-center gap-2">
                                <Server className="w-5 h-5 text-purple-500" /> Server Load
                            </h3>
                            <p className="text-sm text-muted-foreground">CPU & Memory usage history</p>
                        </div>
                         <div className="flex gap-2">
                            <span className="w-3 h-3 rounded-full bg-purple-500" />
                            <span className="text-xs text-muted-foreground">US-East</span>
                        </div>
                    </div>

                    {/* Bar Chart Visualization */}
                    <div className="flex-1 flex items-end justify-between gap-2 px-4 pb-4">
                        {[40, 65, 30, 80, 55, 90, 45, 60, 75, 50, 85, 95].map((h, i) => (
                            <motion.div 
                                key={i}
                                initial={{ height: 0 }}
                                animate={{ height: `${h}%` }}
                                transition={{ delay: 0.6 + (i * 0.05), duration: 1, type: "spring" }}
                                className="w-full bg-muted/50 rounded-t-lg relative group overflow-hidden"
                            >
                                <div className="absolute bottom-0 w-full bg-purple-500/50 group-hover:bg-purple-500 transition-colors rounded-t-lg" style={{ height: '100%' }} />
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
