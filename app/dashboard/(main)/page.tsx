
"use client";

import { motion } from "framer-motion";
import {
    Activity, Users, Clock, ArrowUpRight, ArrowDownRight, MoreHorizontal,
    CheckCircle2, AlertCircle, FileText, Trophy, Zap, Star, Shield,
    Calendar as CalendarIcon, ChevronLeft, ChevronRight
} from "lucide-react";
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell
} from "recharts";
import { useState } from "react";
import { TypeAnimation } from 'react-type-animation';
import { cn } from "@/lib/utils";
import Link from "next/link";

const data = [
    { name: 'Mon', visits: 4000, pv: 2400 },
    { name: 'Tue', visits: 3000, pv: 1398 },
    { name: 'Wed', visits: 2000, pv: 9800 },
    { name: 'Thu', visits: 2780, pv: 3908 },
    { name: 'Fri', visits: 1890, pv: 4800 },
    { name: 'Sat', visits: 2390, pv: 3800 },
    { name: 'Sun', visits: 3490, pv: 4300 },
];

const projectStatus = [
    { name: 'Completed', value: 400, color: '#10b981' },
    { name: 'In Progress', value: 300, color: '#0ea5e9' },
    { name: 'Delayed', value: 100, color: '#ef4444' },
];

const ACHIEVEMENTS = [
    { title: "Project Master", icon: Trophy, color: "text-amber-500", bg: "bg-amber-500/10" },
    { title: "Speed Demon", icon: Zap, color: "text-blue-500", bg: "bg-blue-500/10" },
    { title: "Team Favorite", icon: Star, color: "text-purple-500", bg: "bg-purple-500/10" },
    { title: "Privacy Pro", icon: Shield, color: "text-green-500", bg: "bg-green-500/10" },
];

const StatCard = ({ title, value, change, trend, href }: { title: string, value: string, change: string, trend: 'up' | 'down', href: string }) => (
    <Link href={href}>
        <motion.div
            whileHover={{ y: -5, scale: 1.02 }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-card border border-border p-6 rounded-3xl shadow-sm transition-all hover:shadow-xl group h-full"
        >
            <div className="flex justify-between items-start mb-4">
                <div>
                    <p className="text-sm text-muted-foreground font-bold uppercase tracking-wider mb-1">{title}</p>
                    <h3 className="text-3xl font-extrabold">{value}</h3>
                </div>
                <div className={`p-3 rounded-2xl transition-transform group-hover:rotate-12 ${trend === 'up' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                    {trend === 'up' ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownRight className="w-5 h-5" />}
                </div>
            </div>
            <div className="flex items-center gap-2 text-xs">
                <span className={cn("px-1.5 py-0.5 rounded-full font-bold", trend === 'up' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500')}>
                    {change}
                </span>
                <span className="text-muted-foreground font-medium">vs last month</span>
            </div>
        </motion.div>
    </Link>
);

export default function DashboardHome() {
    return (
        <div className="space-y-8 max-w-[1600px] mx-auto">

            {/* Header / Welcome */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-4xl font-black mb-2 tracking-tight h-12">
                        <TypeAnimation
                            sequence={[
                                'Welcome back, Alex! 👋',
                                2000,
                                'Scale your business today.',
                                2000,
                                'Manage projects like a pro.',
                                2000
                            ]}
                            wrapper="span"
                            speed={50}
                            repeat={Infinity}
                        />
                    </h1>
                    <p className="text-muted-foreground font-medium">You have <span className="text-primary font-bold underline underline-offset-4 Decoration-2">3 critical deadlines</span> approaching this week.</p>
                </div>
                <div className="flex bg-muted p-1 rounded-2xl border border-border">
                    <Link href="/dashboard" className="px-4 py-2 bg-card rounded-xl text-xs font-bold shadow-sm">Overview</Link>
                    <Link href="/dashboard/analytics" className="px-4 py-2 text-muted-foreground text-xs font-bold hover:text-foreground">Analytics</Link>
                    <Link href="/dashboard/settings" className="px-4 py-2 text-muted-foreground text-xs font-bold hover:text-foreground">Settings</Link>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Active Projects" value="12" change="+2" trend="up" href="/dashboard/projects" />
                <StatCard title="Total Revenue" value="$48,200" change="+12.5%" trend="up" href="/dashboard/analytics/financial" />
                <StatCard title="Team Velocity" value="87%" change="-2.4%" trend="down" href="/dashboard/analytics" />
                <StatCard title="Task Efficiency" value="94%" change="+5.1%" trend="up" href="/dashboard/analytics" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                {/* Main Content Area */}
                <div className="lg:col-span-8 space-y-8">

                    {/* Performance Graph */}
                    <div className="bg-card border border-border p-8 rounded-[2.5rem] shadow-sm relative overflow-hidden group">
                        <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none group-hover:bg-primary/10 transition-colors" />
                        <div className="flex justify-between items-center mb-8 relative z-10">
                            <div>
                                <h3 className="font-bold text-xl">Activity Trends</h3>
                                <p className="text-sm text-muted-foreground">Real-time performance metrics</p>
                            </div>
                            <div className="flex gap-2">
                                <button className="p-2 border border-border rounded-xl hover:bg-muted"><Activity className="w-4 h-4" /></button>
                                <button className="p-2 border border-border rounded-xl hover:bg-muted"><MoreHorizontal className="w-4 h-4" /></button>
                            </div>
                        </div>
                        <div className="h-[350px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={data}>
                                    <defs>
                                        <linearGradient id="colorWave" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2} />
                                            <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <Tooltip
                                        cursor={{ stroke: '#6366f1', strokeWidth: 2, strokeDasharray: '4 4' }}
                                        contentStyle={{ backgroundColor: '#1e293b', borderRadius: '16px', border: 'none', boxShadow: '0 20px 50px rgba(0,0,0,0.3)' }}
                                    />
                                    <Area type="monotone" dataKey="visits" stroke="#6366f1" strokeWidth={5} fillOpacity={1} fill="url(#colorWave)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Achievements Card */}
                        <div className="bg-card border border-border p-8 rounded-[2.5rem] shadow-sm">
                            <h3 className="font-bold text-xl mb-6 flex items-center gap-2">
                                <Trophy className="text-amber-500" /> Milestone Badges
                            </h3>
                            <div className="grid grid-cols-2 gap-4">
                                {ACHIEVEMENTS.map((ach, i) => (
                                    <div key={i} className="flex flex-col items-center p-4 bg-muted/20 border border-border rounded-3xl hover:border-primary/50 transition-all group cursor-pointer">
                                        <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform", ach.bg, ach.color)}>
                                            <ach.icon size={24} />
                                        </div>
                                        <p className="text-xs font-bold text-center">{ach.title}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Recent Activity List */}
                        <div className="bg-card border border-border p-8 rounded-[2.5rem] shadow-sm">
                            <h3 className="font-bold text-xl mb-6">Recent Activity</h3>
                            <div className="space-y-6">
                                {[
                                    { name: "Sarah J.", task: "Final UI Designs", time: "10m ago" },
                                    { name: "Mike T.", task: "API Deployment", time: "1h ago" },
                                ].map((act, i) => (
                                    <div key={i} className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-[10px] font-bold">SJ</div>
                                        <div className="flex-1">
                                            <p className="text-sm font-bold">{act.name} <span className="font-normal text-muted-foreground">uploaded</span> {act.task}</p>
                                            <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">{act.time}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                </div>

                {/* Sidebar Column */}
                <div className="lg:col-span-4 space-y-8">

                    {/* Interactive Calendar Widget */}
                    <div className="bg-card border border-border p-8 rounded-[2.5rem] shadow-sm overflow-hidden relative">
                        <div className="flex justify-between items-center mb-8">
                            <h3 className="font-bold text-lg flex items-center gap-2">
                                <CalendarIcon className="w-5 h-5 text-primary" /> Schedule
                            </h3>
                            <div className="flex gap-2">
                                <button className="p-1 hover:bg-muted rounded"><ChevronLeft size={16} /></button>
                                <button className="p-1 hover:bg-muted rounded"><ChevronRight size={16} /></button>
                            </div>
                        </div>

                        <div className="grid grid-cols-7 gap-y-4 text-center mb-4">
                            {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map(d => (
                                <span key={d} className="text-[10px] font-black text-muted-foreground uppercase">{d}</span>
                            ))}
                            {Array.from({ length: 31 }).map((_, i) => (
                                <div key={i} className="relative py-1">
                                    <span className={cn(
                                        "text-xs font-bold w-8 h-8 flex items-center justify-center mx-auto rounded-xl transition-all cursor-pointer",
                                        i + 1 === 24 ? "bg-primary text-white shadow-lg shadow-primary/30" : "hover:bg-muted"
                                    )}>
                                        {i + 1}
                                    </span>
                                    {[12, 18, 28].includes(i + 1) && (
                                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-red-500 rounded-full shadow-[0_0_5px_rgba(239,68,68,0.5)]" />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Team Members List */}
                    <div className="bg-card border border-border p-8 rounded-[2.5rem] shadow-sm">
                        <h3 className="font-bold text-lg mb-6">Online Team</h3>
                        <div className="space-y-5">
                            {[
                                { name: "Rasel Hossain", role: "Manager", status: "online" },
                                { name: "Sarah Jenkins", role: "UI Designer", status: "typing" },
                                { name: "Mike Thompson", role: "Dev", status: "busy" },
                            ].map((tm, i) => (
                                <div key={i} className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="relative">
                                            <div className="w-11 h-11 rounded-2xl bg-slate-800 flex items-center justify-center text-xs font-bold border border-border">
                                                {tm.name.split(' ').map(n => n[0]).join('')}
                                            </div>
                                            <span className={cn(
                                                "absolute -bottom-1 -right-1 w-3.5 h-3.5 border-4 border-card rounded-full",
                                                tm.status === 'online' ? "bg-green-500" : tm.status === 'typing' ? "bg-blue-500 animate-pulse" : "bg-orange-500"
                                            )} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold leading-tight">{tm.name}</p>
                                            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">{tm.role}</p>
                                        </div>
                                    </div>
                                    {tm.status === 'typing' && (
                                        <div className="flex gap-1">
                                            {[0, 1, 2].map(d => (
                                                <motion.div
                                                    key={d}
                                                    animate={{ opacity: [0, 1, 0] }}
                                                    transition={{ repeat: Infinity, duration: 1, delay: d * 0.2 }}
                                                    className="w-1 h-1 bg-primary rounded-full"
                                                />
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                        <Link href="/dashboard/settings/security" className="w-full mt-8 py-3 bg-muted/50 border border-border rounded-2xl text-xs font-bold hover:bg-muted transition-colors inline-block text-center">
                            Manage Permissions
                        </Link>
                    </div>

                </div>

            </div>

        </div>
    );
}
