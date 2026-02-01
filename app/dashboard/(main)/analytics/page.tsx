
"use client";

import { motion } from "framer-motion";
import {
    Download, Calendar, Filter, ArrowUp, ArrowDown,
    MoreHorizontal, RefreshCw
} from "lucide-react";
import {
    AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, LineChart, Line
} from "recharts";
import { cn } from "@/lib/utils";

// --- Mock Data ---

const PERFORMANCE_DATA = [
    { name: 'Mon', completed: 4, active: 10 },
    { name: 'Tue', completed: 3, active: 12 },
    { name: 'Wed', completed: 7, active: 8 },
    { name: 'Thu', completed: 2, active: 15 },
    { name: 'Fri', completed: 6, active: 11 },
    { name: 'Sat', completed: 3, active: 7 },
    { name: 'Sun', completed: 1, active: 5 },
];

const TASK_DISTRIBUTION = [
    { name: 'Design', value: 35, color: '#f472b6' },
    { name: 'Dev', value: 45, color: '#60a5fa' },
    { name: 'QA', value: 20, color: '#4ade80' },
];

export default function AnalyticsPage() {
    return (
        <div className="space-y-8">

            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold">Analytics</h1>
                    <p className="text-muted-foreground">Detailed insights into project performance.</p>
                </div>

                <div className="flex gap-2">
                    <button className="flex items-center gap-2 px-3 py-2 border border-border rounded-lg text-sm hover:bg-muted transition-colors bg-card">
                        <Calendar className="w-4 h-4" /> Last 7 Days
                    </button>
                    <button className="flex items-center gap-2 px-3 py-2 bg-primary text-white rounded-lg text-sm hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20">
                        <Download className="w-4 h-4" /> Export Report
                    </button>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { title: "Task Completion Rate", value: "87%", trend: "+2.5%", color: "text-green-500", bg: "bg-green-500/10" },
                    { title: "Avg. Turnaround Time", value: "1.2 Days", trend: "-0.4 Days", color: "text-green-500", bg: "bg-green-500/10" },
                    { title: "Critical Bugs", value: "3", trend: "+1", color: "text-red-500", bg: "bg-red-500/10" },
                    { title: "Team Velocity", value: "42 pts", trend: "+5 pts", color: "text-blue-500", bg: "bg-blue-500/10" },
                ].map((stat, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-card border border-border p-6 rounded-2xl shadow-sm"
                    >
                        <p className="text-sm text-muted-foreground font-bold mb-2">{stat.title}</p>
                        <div className="flex items-end gap-2">
                            <h3 className="text-3xl font-bold">{stat.value}</h3>
                            <span className={cn("text-xs font-bold px-1.5 py-0.5 rounded", stat.bg, stat.color)}>
                                {stat.trend}
                            </span>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Charts Block 1 */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                <div className="lg:col-span-2 bg-card border border-border rounded-3xl p-6 shadow-sm">
                    <h3 className="font-bold mb-6">Productivity Trends</h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={PERFORMANCE_DATA}>
                                <defs>
                                    <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#60a5fa" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#60a5fa" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                                <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '8px', color: '#fff' }} />
                                <Area type="monotone" dataKey="completed" stroke="#60a5fa" fill="url(#colorCompleted)" strokeWidth={3} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-card border border-border rounded-3xl p-6 shadow-sm">
                    <h3 className="font-bold mb-6">Task Distribution</h3>
                    <div className="h-[200px] w-full relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={TASK_DISTRIBUTION}
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {TASK_DISTRIBUTION.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div className="text-center">
                                <div className="text-3xl font-bold">142</div>
                                <div className="text-xs text-muted-foreground">Total Tasks</div>
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-center gap-4 mt-6">
                        {TASK_DISTRIBUTION.map((item, i) => (
                            <div key={i} className="flex items-center gap-2 text-xs">
                                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                                <span>{item.name}</span>
                            </div>
                        ))}
                    </div>
                </div>

            </div>

        </div>
    );
}
