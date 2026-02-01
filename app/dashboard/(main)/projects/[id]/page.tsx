
"use client";

import { useState, useRef, useEffect } from "react";
import {
    motion, AnimatePresence, useScroll, useSpring
} from "framer-motion";
import {
    ChevronLeft, MoreVertical, Calendar, Flag, PieChart,
    MessageSquare, FolderOpen, Clock, Settings, User,
    Plus, Search, Filter, LayoutGrid, List, Download,
    Paperclip, Send, Smile, Play, Pause, DollarSign,
    CheckCircle2, AlertCircle, Trash2, Edit3, Share2,
    FileText, FileImage, FileCode, Search as SearchIcon,
    TrendingUp, UploadCloud, Eye, Wallet, RotateCcw, X
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
    AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
    PieChart as RePie, Pie, Cell
} from "recharts";

// --- Mock Data ---

const PROJECT_DETAILS = {
    id: "1",
    title: "E-commerce Redesign",
    client: "EcoLife Inc",
    status: "In Progress",
    dueDate: "Oct 24, 2026",
    budget: "$12,000",
    spent: "$7,200",
    description: "Complete redesign of the e-commerce platform with focus on mobile UX and performance.",
    team: [
        { name: "Alex M.", role: "Lead", color: "bg-blue-500", avatar: "AM" },
        { name: "Sarah J.", role: "Design", color: "bg-pink-500", avatar: "SJ" },
        { name: "Mike T.", role: "Dev", color: "bg-orange-500", avatar: "MT" },
    ],
    milestones: [
        { title: "Design System", date: "Sep 15", status: "completed" },
        { title: "Frontend Implementation", date: "Oct 01", status: "current" },
        { title: "Backend Integration", date: "Oct 15", status: "pending" },
    ]
};

const KANBAN_COLS = [
    { id: "todo", title: "To Do", count: 3 },
    { id: "inprogress", title: "In Progress", count: 2 },
    { id: "review", title: "Review", count: 1 },
    { id: "done", title: "Done", count: 8 },
];

const TASKS = [
    { id: 1, title: "Home Page UI", col: "inprogress", priority: "High", assignee: "SJ" },
    { id: 2, title: "API Integration", col: "inprogress", priority: "Medium", assignee: "MT" },
    { id: 3, title: "Auth Flow", col: "todo", priority: "High", assignee: "MT" },
    { id: 4, title: "Settings Page", col: "todo", priority: "Low", assignee: "AM" },
    { id: 5, title: "Design Feedback", col: "review", priority: "Medium", assignee: "SJ" },
];

const FILES = [
    { name: "branding-guide.pdf", type: "pdf", size: "2.4 MB", date: "Oct 12", icon: FileText },
    { name: "homepage-v2.fig", type: "design", size: "12.8 MB", date: "Oct 10", icon: LayoutGrid },
    { name: "hero-section.png", type: "image", size: "1.1 MB", date: "Oct 08", icon: FileImage },
    { name: "api-specs.yaml", type: "code", size: "0.5 MB", date: "Oct 05", icon: FileCode },
];

const TABS = [
    { id: "overview", label: "Overview", icon: PieChart },
    { id: "tasks", label: "Tasks", icon: Flag },
    { id: "files", label: "Files", icon: FolderOpen },
    { id: "chat", label: "Messages", icon: MessageSquare, badge: 2 },
    { id: "time", label: "Time", icon: Clock },
    { id: "budget", label: "Budget", icon: DollarSign },
    { id: "settings", label: "Settings", icon: Settings },
];

export default function ProjectDetailsPage() {
    const params = useParams();
    const [activeTab, setActiveTab] = useState("overview");
    const [isTiming, setIsTiming] = useState(false);
    const [time, setTime] = useState(0);
    const [previewFile, setPreviewFile] = useState<any>(null);

    // Timer Logic
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isTiming) {
            interval = setInterval(() => setTime(prev => prev + 1), 1000);
        }
        return () => clearInterval(interval);
    }, [isTiming]);

    const formatTime = (s: number) => {
        const hrs = Math.floor(s / 3600);
        const mins = Math.floor((s % 3600) / 60);
        const secs = s % 60;
        return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="space-y-6 pb-20">
            {/* Header */}
            <div className="flex flex-col space-y-4">
                <Link href="/dashboard/projects" className="text-sm text-muted-foreground hover:text-primary flex items-center gap-1 transition-colors w-fit">
                    <ChevronLeft className="w-4 h-4" /> Back to Projects
                </Link>

                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="flex items-center gap-4">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary font-bold text-2xl border border-primary/20 shadow-lg shadow-primary/5"
                        >
                            ER
                        </motion.div>
                        <div>
                            <h1 className="text-2xl font-bold flex items-center gap-3">
                                {PROJECT_DETAILS.title}
                                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-blue-500/10 text-blue-500 border border-blue-500/20 animate-pulse">
                                    {PROJECT_DETAILS.status}
                                </span>
                            </h1>
                            <p className="text-muted-foreground text-sm">Client: {PROJECT_DETAILS.client}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="flex -space-x-2 mr-2">
                            {PROJECT_DETAILS.team.map((member, i) => (
                                <div
                                    key={i}
                                    className={`w-9 h-9 rounded-full border-2 border-background flex items-center justify-center text-xs font-bold text-white shadow-sm ${member.color}`}
                                    title={`${member.name} - ${member.role}`}
                                >
                                    {member.avatar}
                                </div>
                            ))}
                        </div>
                        <button className="p-2.5 border border-border rounded-xl hover:bg-muted transition-colors">
                            <Share2 className="w-4 h-4" />
                        </button>
                        <button className="px-5 py-2.5 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 hover:-translate-y-0.5">
                            Edit Project
                        </button>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-border sticky top-0 bg-background/80 backdrop-blur-xl z-20 -mx-4 px-4 md:-mx-8 md:px-8">
                <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide">
                    {TABS.map((tab) => {
                        const isActive = activeTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={cn(
                                    "flex items-center gap-2 px-6 py-4 text-sm font-bold transition-all relative whitespace-nowrap",
                                    isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
                                )}
                            >
                                <tab.icon className={cn("w-4 h-4 transition-transform", isActive && "scale-110")} />
                                {tab.label}
                                {tab.badge && (
                                    <span className="bg-primary text-white text-[10px] px-1.5 rounded-full animate-bounce">
                                        {tab.badge}
                                    </span>
                                )}
                                {isActive && (
                                    <motion.div
                                        layoutId="tab-underline-project"
                                        className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-t-full shadow-[0_-2px_8px_rgba(var(--primary),0.3)]"
                                    />
                                )}
                            </button>
                        )
                    })}
                </div>
            </div>

            {/* Content Swapper */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                >

                    {/* Tab: OVERVIEW */}
                    {activeTab === "overview" && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="md:col-span-2 space-y-6">
                                <section className="bg-card border border-border rounded-3xl p-8 shadow-sm">
                                    <h3 className="font-bold text-lg mb-4">About Project</h3>
                                    <p className="text-muted-foreground leading-relaxed text-lg">
                                        {PROJECT_DETAILS.description}
                                    </p>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-8 border-t border-border">
                                        <div>
                                            <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider mb-1">Start Date</p>
                                            <p className="font-bold">Aug 12, 2026</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider mb-1">Deadline</p>
                                            <p className="font-bold text-red-500">{PROJECT_DETAILS.dueDate}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider mb-1">Budget</p>
                                            <p className="font-bold text-green-500">{PROJECT_DETAILS.budget}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider mb-1">Category</p>
                                            <p className="font-bold">Web Dev</p>
                                        </div>
                                    </div>
                                </section>

                                <section className="bg-card border border-border rounded-3xl p-8 shadow-sm">
                                    <h3 className="font-bold text-lg mb-6">Milestone Progress</h3>
                                    <div className="space-y-8 relative pl-6 border-l-2 border-dashed border-border ml-2">
                                        {PROJECT_DETAILS.milestones.map((m, i) => (
                                            <div key={i} className="relative">
                                                <div className={cn(
                                                    "absolute -left-[31px] top-1 w-4 h-4 rounded-full border-4 border-card z-10",
                                                    m.status === "completed" ? "bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.3)]" :
                                                        m.status === "current" ? "bg-blue-500 animate-pulse shadow-[0_0_15px_rgba(59,130,246,0.5)]" : "bg-muted"
                                                )} />
                                                <div className="bg-muted/10 p-4 rounded-2xl border border-border/50 group hover:border-primary/30 transition-colors">
                                                    <h4 className={cn("font-bold", m.status === "completed" && "line-through opacity-50")}>{m.title}</h4>
                                                    <p className="text-xs text-muted-foreground mt-1 flex items-center gap-2">
                                                        <Calendar className="w-3 h-3" /> {m.date}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            </div>

                            <div className="space-y-6">
                                <div className="bg-card border border-border rounded-3xl p-8 shadow-sm space-y-8">
                                    <h3 className="font-bold text-lg">Project Performance</h3>
                                    <div className="space-y-6">
                                        <div>
                                            <div className="flex justify-between text-sm mb-2 font-bold">
                                                <span className="text-muted-foreground">Completion</span>
                                                <span>65%</span>
                                            </div>
                                            <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: "65%" }}
                                                    className="bg-primary h-full rounded-full shadow-[0_0_10px_rgba(var(--primary),0.3)]"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <div className="flex justify-between text-sm mb-2 font-bold">
                                                <span className="text-muted-foreground">Resources Used</span>
                                                <span>82%</span>
                                            </div>
                                            <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: "82%" }}
                                                    className="bg-orange-500 h-full rounded-full shadow-[0_0_10px_rgba(249,115,22,0.3)]"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="pt-6 border-t border-border">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-2xl bg-green-500/10 flex items-center justify-center text-green-500">
                                                <TrendingUp size={24} />
                                            </div>
                                            <div>
                                                <p className="text-xs text-muted-foreground font-bold">Health Score</p>
                                                <p className="font-bold text-lg">Great (94/100)</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Tab: TASKS (Kanban Board) */}
                    {activeTab === "tasks" && (
                        <div className="flex flex-col space-y-6">
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                    <div className="relative">
                                        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                        <input className="pl-9 pr-4 py-2.5 bg-card border border-border rounded-xl text-sm w-64" placeholder="Search tasks..." />
                                    </div>
                                    <button className="p-2.5 border border-border rounded-xl hover:bg-muted transition-colors"><Filter className="w-4 h-4" /></button>
                                </div>
                                <button className="px-5 py-2.5 bg-primary text-white rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-primary/20">
                                    <Plus className="w-4 h-4" /> Add Task
                                </button>
                            </div>

                            <div className="flex gap-6 overflow-x-auto pb-6 scrollbar-thin">
                                {KANBAN_COLS.map((col) => (
                                    <div key={col.id} className="min-w-[320px] bg-muted/20 rounded-3xl p-4 border border-border/50">
                                        <div className="flex justify-between items-center mb-4 px-2">
                                            <h4 className="font-bold text-sm flex items-center gap-2">
                                                {col.title}
                                                <span className="bg-card border border-border text-[10px] px-2 py-0.5 rounded-full">{col.count}</span>
                                            </h4>
                                            <button className="p-1 hover:bg-muted rounded"><MoreVertical className="w-4 h-4" /></button>
                                        </div>

                                        <div className="space-y-4">
                                            {TASKS.filter(t => t.col === col.id).map((task) => (
                                                <div key={task.id} className="bg-card border border-border rounded-2xl p-4 shadow-sm hover:border-primary/50 transition-all cursor-grab group">
                                                    <div className="flex justify-between items-start mb-3">
                                                        <span className={cn(
                                                            "text-[10px] px-2 py-0.5 rounded font-extrabold uppercase",
                                                            task.priority === 'High' ? 'bg-red-500/10 text-red-500' :
                                                                task.priority === 'Medium' ? 'bg-yellow-500/10 text-yellow-500' : 'bg-blue-500/10 text-blue-500'
                                                        )}>
                                                            {task.priority}
                                                        </span>
                                                        <button className="opacity-0 group-hover:opacity-100 transition-opacity"><Edit3 className="w-3.5 h-3.5" /></button>
                                                    </div>
                                                    <h5 className="font-bold text-sm mb-4">{task.title}</h5>
                                                    <div className="flex justify-between items-center">
                                                        <div className="flex items-center gap-2 text-[10px] text-muted-foreground uppercase font-bold">
                                                            <Clock className="w-3 h-3" /> Oct 20
                                                        </div>
                                                        <div className="w-7 h-7 bg-muted rounded-full flex items-center justify-center text-[8px] font-bold border border-border">
                                                            {task.assignee}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                            <button className="w-full py-2 border-2 border-dashed border-border rounded-2xl text-xs font-bold text-muted-foreground hover:bg-muted hover:border-primary/30 transition-all">
                                                + New Task
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Tab: FILES */}
                    {activeTab === "files" && (
                        <div className="space-y-8">
                            <div className="flex justify-between items-center">
                                <h3 className="text-xl font-bold">Project Assets</h3>
                                <div className="flex items-center gap-2">
                                    <div className="bg-muted p-1 rounded-xl flex gap-1">
                                        <button className="p-1.5 bg-card rounded-lg shadow-sm"><LayoutGrid className="w-4 h-4" /></button>
                                        <button className="p-1.5 text-muted-foreground"><List className="w-4 h-4" /></button>
                                    </div>
                                    <button className="px-5 py-2.5 bg-primary text-white rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-primary/20">
                                        <UploadCloud className="w-4 h-4" /> Upload
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                                {FILES.map((file, i) => (
                                    <div key={i} className="bg-card border border-border rounded-3xl p-5 group hover:border-primary transition-all cursor-pointer shadow-sm hover:shadow-xl hover:-translate-y-1">
                                        <div className="relative aspect-square bg-muted/30 rounded-2xl flex items-center justify-center mb-4 overflow-hidden">
                                            <file.icon className="w-12 h-12 text-muted-foreground group-hover:text-primary transition-colors" />
                                            {/* Preview Overlay */}
                                            <div className="absolute inset-0 bg-primary/95 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                                <button
                                                    onClick={() => setPreviewFile(file)}
                                                    className="p-2 bg-white/20 rounded-full text-white hover:bg-white/30"
                                                >
                                                    <Eye size={18} />
                                                </button>
                                                <button className="p-2 bg-white/20 rounded-full text-white hover:bg-white/30"><Download size={18} /></button>
                                            </div>
                                        </div>
                                        <h5 className="font-bold text-sm truncate">{file.name}</h5>
                                        <p className="text-[10px] text-muted-foreground mt-1">{file.size} • {file.date}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Tab: CHAT */}
                    {activeTab === "chat" && (
                        <div className="h-[500px] flex flex-col bg-card border border-border rounded-3xl overflow-hidden shadow-2xl">
                            <div className="flex-1 p-6 space-y-6 overflow-y-auto">
                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 rounded-full bg-pink-500 flex items-center justify-center text-[10px] font-bold text-white shrink-0">SJ</div>
                                    <div className="space-y-1">
                                        <p className="bg-muted px-4 py-2.5 rounded-2xl rounded-tl-none text-sm max-w-sm">I've just uploaded the new Figma designs. Can someone check the hero section?</p>
                                        <p className="text-[10px] text-muted-foreground">10:05 AM</p>
                                    </div>
                                </div>
                                <div className="flex items-end gap-3 flex-row-reverse">
                                    <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-[10px] font-bold text-white shrink-0">AM</div>
                                    <div className="space-y-1 flex flex-col items-end">
                                        <p className="bg-primary text-white px-4 py-2.5 rounded-2xl rounded-br-none text-sm max-w-sm">Looks great, Sarah! I'll take a look right now.</p>
                                        <p className="text-[10px] text-muted-foreground">10:12 AM</p>
                                    </div>
                                </div>
                            </div>
                            <div className="p-4 border-t border-border bg-muted/10">
                                <div className="flex items-center gap-2 bg-card border border-border rounded-2xl p-2 px-4 shadow-inner focus-within:ring-2 focus-within:ring-primary/20 transition-all">
                                    <button className="p-2 text-muted-foreground hover:text-primary transition-colors"><Paperclip className="w-5 h-5" /></button>
                                    <input className="flex-1 bg-transparent border-none focus:outline-none text-sm py-2" placeholder="Send a message..." />
                                    <button className="p-2 text-muted-foreground hover:text-primary transition-colors"><Smile className="w-5 h-5" /></button>
                                    <button className="p-2.5 bg-primary text-white rounded-xl shadow-lg shadow-primary/20"><Send className="w-4 h-4" /></button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Tab: TIME */}
                    {activeTab === "time" && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="bg-card border border-border rounded-3xl p-10 flex flex-col items-center justify-center text-center space-y-8 shadow-xl relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-full h-1 bg-muted">
                                    {isTiming && <motion.div animate={{ x: ["-100%", "100%"] }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }} className="w-1/2 h-full bg-primary" />}
                                </div>
                                <h3 className="font-bold text-xl uppercase tracking-widest text-muted-foreground">Current Session</h3>
                                <div className="text-7xl font-mono font-bold tracking-tighter transition-all tabular-nums">
                                    {formatTime(time)}
                                </div>
                                <div className="flex gap-4">
                                    <button
                                        onClick={() => setIsTiming(!isTiming)}
                                        className={cn(
                                            "w-20 h-20 rounded-full flex items-center justify-center transition-all shadow-2xl",
                                            isTiming ? "bg-red-500 text-white shadow-red-500/30" : "bg-primary text-white shadow-primary/30"
                                        )}
                                    >
                                        {isTiming ? <Pause size={32} /> : <Play size={32} className="ml-1" />}
                                    </button>
                                    <button onClick={() => setTime(0)} className="w-20 h-20 rounded-full bg-muted border border-border flex items-center justify-center text-muted-foreground hover:bg-muted/80 transition-all">
                                        <RotateCcw size={24} />
                                    </button>
                                </div>
                                <p className="text-sm text-muted-foreground font-bold">Project: {PROJECT_DETAILS.title}</p>
                            </div>

                            <div className="bg-card border border-border rounded-3xl p-8 shadow-sm">
                                <h3 className="font-bold text-lg mb-6">Recent Logs</h3>
                                <div className="space-y-4">
                                    {[
                                        { user: "Alex M.", date: "Today, 09:30 - 12:15", dur: "2h 45m" },
                                        { user: "Mike T.", date: "Yesterday, 14:00 - 18:30", dur: "4h 30m" },
                                        { user: "Sarah J.", date: "Oct 18, 11:00 - 13:00", dur: "2h 00m" },
                                    ].map((log, i) => (
                                        <div key={i} className="flex items-center justify-between p-4 bg-muted/20 border border-border/50 rounded-2xl">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary">{log.user.charAt(0)}</div>
                                                <div>
                                                    <p className="text-xs font-bold text-muted-foreground">{log.date}</p>
                                                    <p className="font-bold text-sm">Design Implementation</p>
                                                </div>
                                            </div>
                                            <div className="text-sm font-bold">{log.dur}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Tab: BUDGET */}
                    {activeTab === "budget" && (
                        <div className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="bg-card border border-border rounded-3xl p-8 shadow-sm">
                                    <p className="text-sm text-muted-foreground font-bold mb-2">Total Budget</p>
                                    <h3 className="text-3xl font-bold flex items-center gap-2">
                                        <Wallet className="text-primary" /> {PROJECT_DETAILS.budget}
                                    </h3>
                                </div>
                                <div className="bg-card border border-border rounded-3xl p-8 shadow-sm">
                                    <p className="text-sm text-muted-foreground font-bold mb-2">Remaining</p>
                                    <h3 className="text-3xl font-bold text-green-500">$4,800</h3>
                                </div>
                                <div className="bg-card border border-border rounded-3xl p-8 shadow-sm">
                                    <p className="text-sm text-muted-foreground font-bold mb-2">Burn Rate</p>
                                    <h3 className="text-3xl font-bold text-orange-500">$450/day</h3>
                                </div>
                            </div>

                            <div className="bg-card border border-border rounded-3xl p-10 shadow-sm">
                                <h3 className="font-bold text-lg mb-8">Expense Distribution</h3>
                                <div className="h-[300px] w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={[
                                            { d: 'Week 1', a: 1500 }, { d: 'Week 2', a: 3200 }, { d: 'Week 3', a: 4500 }, { d: 'Week 4', a: 7200 }
                                        ]}>
                                            <defs>
                                                <linearGradient id="colorBudget" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                                                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                                </linearGradient>
                                            </defs>
                                            <Tooltip />
                                            <Area type="monotone" dataKey="a" stroke="#6366f1" fill="url(#colorBudget)" strokeWidth={4} />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Tab: SETTINGS */}
                    {activeTab === "settings" && (
                        <div className="max-w-2xl space-y-10">
                            <div>
                                <h3 className="text-xl font-bold mb-6">General Configuration</h3>
                                <div className="space-y-6">
                                    {[
                                        { label: "Allow client access", desc: "Clients can view progress and files." },
                                        { label: "Auto-archive completed tasks", desc: "Moves and hides tasks in 'Done' column after 7 days." },
                                        { label: "Slack Notifications", desc: "Sync all activity to the project channel." },
                                    ].map((opt, i) => (
                                        <div key={i} className="flex items-center justify-between p-4 bg-muted/10 border border-border rounded-2xl">
                                            <div>
                                                <h4 className="font-bold text-sm">{opt.label}</h4>
                                                <p className="text-xs text-muted-foreground">{opt.desc}</p>
                                            </div>
                                            <div className="relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-muted transition-colors duration-200 ease-in-out">
                                                <span className="translate-x-0 pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="pt-10 border-t border-border">
                                <h3 className="text-xl font-bold text-red-500 mb-6 font-bold flex items-center gap-2">
                                    <AlertCircle className="w-5 h-5" /> Danger Zone
                                </h3>
                                <div className="space-y-4">
                                    <p className="text-sm text-muted-foreground mb-4">Deleting a project is irreversible. All task history, files, and chats will be permanently removed.</p>
                                    <button className="px-6 py-3 border-2 border-red-500/20 text-red-500 rounded-2xl font-bold hover:bg-red-500/10 transition-all flex items-center gap-2">
                                        <Trash2 className="w-4 h-4" /> Delete This Project
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                </motion.div>
            </AnimatePresence>

            {/* File Preview Modal */}
            <AnimatePresence>
                {previewFile && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-xl"
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            className="bg-card border border-border rounded-3xl w-full max-w-4xl max-h-[80vh] overflow-hidden flex flex-col shadow-2xl"
                        >
                            <div className="p-4 border-b border-border flex justify-between items-center bg-muted/20">
                                <div className="flex items-center gap-3">
                                    <previewFile.icon className="w-5 h-5 text-primary" />
                                    <span className="font-bold">{previewFile.name}</span>
                                </div>
                                <button
                                    onClick={() => setPreviewFile(null)}
                                    className="p-2 hover:bg-muted rounded-full transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            <div className="flex-1 overflow-auto p-12 flex flex-col items-center justify-center text-center bg-background/50">
                                <previewFile.icon className="w-40 h-40 text-muted-foreground/20 mb-6" />
                                <h4 className="text-xl font-bold mb-2">No preview available</h4>
                                <p className="text-muted-foreground mb-8">This file type cannot be previewed in the browser.</p>
                                <button className="px-8 py-3 bg-primary text-white rounded-xl font-bold flex items-center gap-2">
                                    <Download size={18} /> Download Now
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

