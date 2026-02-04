"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Search, Filter, Plus, LayoutGrid, List, MoreVertical,
    Calendar, Users, AlertCircle, CheckCircle2, Clock,
    CreditCard, Wallet, X, ChevronRight, Lock
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useParams } from "next/navigation";

// --- Mock Data ---

const PROJECTS = [
    { id: 1, title: "E-commerce Redesign", client: "EcoLife Inc", status: "In Progress", progress: 65, due: "Oct 24", members: 4, budget: "$12,000", paymentStatus: "Unpaid" },
    { id: 2, title: "FinTech Dashboard", client: "FinanceFlow", status: "Completed", progress: 100, due: "Sep 12", members: 6, budget: "$45,000", paymentStatus: "Paid" },
    { id: 3, title: "AI Chat Integration", client: "TechHelp", status: "Review", progress: 90, due: "Oct 30", members: 3, budget: "$8,500", paymentStatus: "Paid" },
    { id: 4, title: "Mobile App MVP", client: "StartUp X", status: "Delayed", progress: 30, due: "Nov 15", members: 5, budget: "$22,000", paymentStatus: "Unpaid" },
    { id: 5, title: "Cloud Migration", client: "Enterprise Corp", status: "In Progress", progress: 45, due: "Dec 01", members: 8, budget: "$120,000", paymentStatus: "Pending" },
    { id: 6, title: "Marketing Website", client: "BrandNew", status: "Planning", progress: 10, due: "Jan 10", members: 2, budget: "$5,000", paymentStatus: "Unpaid" },
];

const STATUS_COLORS = {
    "In Progress": "bg-blue-500/10 text-blue-500 border-blue-500/20",
    "Completed": "bg-green-500/10 text-green-500 border-green-500/20",
    "Review": "bg-purple-500/10 text-purple-500 border-purple-500/20",
    "Delayed": "bg-red-500/10 text-red-500 border-red-500/20",
    "Planning": "bg-orange-500/10 text-orange-500 border-orange-500/20",
};

const PAYMENT_STATUS_COLORS = {
    "Paid": "text-green-500 bg-green-500/10 border-green-500/20",
    "Unpaid": "text-red-500 bg-red-500/10 border-red-500/20",
    "Pending": "text-orange-500 bg-orange-500/10 border-orange-500/20",
};

// --- Payment Modal Component ---
const PaymentModal = ({ project, onClose }: { project: any, onClose: () => void }) => {
    const [method, setMethod] = useState<"stripe" | "paypal">("stripe");
    const [processing, setProcessing] = useState(false);
    const [success, setSuccess] = useState(false);

    const handlePay = () => {
        setProcessing(true);
        // Simulate API call
        setTimeout(() => {
            setProcessing(false);
            setSuccess(true);
            setTimeout(onClose, 2000);
        }, 2000);
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-card w-full max-w-md rounded-3xl border border-border shadow-2xl overflow-hidden"
            >
                {/* Header */}
                <div className="p-6 border-b border-border flex justify-between items-center bg-muted/30">
                    <div>
                        <h3 className="text-xl font-bold">Secure Payment</h3>
                        <p className="text-xs text-muted-foreground mt-1">Project: {project.title}</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-muted rounded-full transition-colors"><X size={18} /></button>
                </div>

                {/* Body */}
                <div className="p-6 space-y-6">
                    {success ? (
                        <div className="py-10 flex flex-col items-center text-center space-y-4">
                            <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center text-green-500 mb-2">
                                <CheckCircle2 size={32} />
                            </div>
                            <h4 className="text-2xl font-bold text-green-500">Payment Successful!</h4>
                            <p className="text-muted-foreground">Thank you for your payment. A receipt has been sent to your email.</p>
                        </div>
                    ) : (
                        <>
                            <div className="flex bg-muted/50 p-1 rounded-xl">
                                <button 
                                    onClick={() => setMethod("stripe")}
                                    className={cn("flex-1 py-3 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all", method === "stripe" ? "bg-white text-black shadow-sm" : "text-muted-foreground hover:text-foreground")}
                                >
                                    <CreditCard size={16} /> Credit Card
                                </button>
                                <button 
                                    onClick={() => setMethod("paypal")}
                                    className={cn("flex-1 py-3 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all", method === "paypal" ? "bg-[#003087] text-white shadow-sm" : "text-muted-foreground hover:text-foreground")}
                                >
                                    <span className="italic font-serif font-black">P</span> PayPal
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div className="flex justify-between items-center pb-4 border-b border-border">
                                    <span className="text-muted-foreground font-medium">Total Amount</span>
                                    <span className="text-2xl font-bold">{project.budget}</span>
                                </div>

                                {method === "stripe" && (
                                    <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); handlePay(); }}>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold uppercase text-muted-foreground">Card Number</label>
                                            <div className="relative">
                                                <input placeholder="0000 0000 0000 0000" className="w-full bg-muted/30 border border-border rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-primary/20 outline-none" />
                                                <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold uppercase text-muted-foreground">Expiry</label>
                                                <input placeholder="MM/YY" className="w-full bg-muted/30 border border-border rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-primary/20 outline-none" />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold uppercase text-muted-foreground">CVC</label>
                                                <input placeholder="123" className="w-full bg-muted/30 border border-border rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-primary/20 outline-none" />
                                            </div>
                                        </div>
                                        <button disabled={processing} className="w-full py-4 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/25 disabled:opacity-50 flex items-center justify-center gap-2 mt-4">
                                            {processing ? "Processing..." : `Pay ${project.budget}`}
                                        </button>
                                         <div className="flex justify-center items-center gap-2 text-[10px] text-muted-foreground">
                                            <Lock size={10} /> Powered by Stripe
                                        </div>
                                    </form>
                                )}

                                {method === "paypal" && (
                                    <div className="text-center py-4 space-y-6">
                                        <p className="text-sm text-muted-foreground">You will be redirected to PayPal to complete your purchase securely.</p>
                                        <button 
                                            onClick={handlePay}
                                            disabled={processing}
                                            className="w-full py-4 bg-[#FFC439] text-black rounded-xl font-bold hover:brightness-105 transition-all shadow-lg shadow-orange-500/20 flex items-center justify-center gap-2"
                                        >
                                           {processing ? "Connecting..." : "Check out with PayPal"}
                                        </button>
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </motion.div>
        </div>
    );
};


export default function ProjectsOverview() {
    const [view, setView] = useState<"grid" | "table">("grid");
    const [filter, setFilter] = useState("All");
    const [search, setSearch] = useState("");
    const [selectedProject, setSelectedProject] = useState<any>(null);

    const filteredProjects = PROJECTS.filter(p =>
        (filter === "All" || p.status === filter) &&
        (p.title.toLowerCase().includes(search.toLowerCase()) || p.client.toLowerCase().includes(search.toLowerCase()))
    );

    return (
        <div className="space-y-8 relative">

            {/* Header & Controls */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-500">Projects</h1>
                    <p className="text-muted-foreground">Manage and track all your ongoing projects.</p>
                </div>

                <Link
                    href="/dashboard/projects/new"
                    className="relative group px-6 py-3 bg-primary text-white rounded-xl font-bold transition-all hover:scale-105 shadow-lg shadow-primary/25 overflow-hidden"
                >
                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                    <div className="relative flex items-center gap-2">
                        <Plus className="w-4 h-4" /> New Project
                    </div>
                </Link>
            </div>

            {/* Spotlight Carousel */}
            <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm font-bold text-muted-foreground uppercase tracking-wider">
                    <AlertCircle className="w-4 h-4 text-orange-500" /> Urgent Attention
                </div>
                <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x">
                    {PROJECTS.filter(p => p.progress < 50 && p.status === 'In Progress').map((p, i) => (
                         <motion.div
                            key={p.id}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="min-w-[300px] snap-center bg-gradient-to-br from-card to-muted/20 border border-border rounded-3xl p-6 shadow-sm hover:shadow-lg hover:border-primary/30 transition-all cursor-pointer group"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-2 bg-orange-500/10 rounded-xl text-orange-500">
                                    <Clock className="w-5 h-5" />
                                </div>
                                <span className="text-[10px] font-bold bg-background border border-border px-2 py-1 rounded-full">{p.due}</span>
                            </div>
                            <h3 className="font-bold text-lg mb-1 group-hover:text-primary transition-colors">
                                <Link href={`/dashboard/projects/${p.id}`}>{p.title}</Link>
                            </h3>
                            <p className="text-sm text-muted-foreground mb-4">{p.client}</p>
                            <div className="space-y-2">
                                <div className="flex justify-between text-xs font-bold">
                                    <span>Progress</span>
                                    <span className="text-orange-500">{p.progress}%</span>
                                </div>
                                <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                                    <motion.div 
                                        initial={{ width: 0 }}
                                        animate={{ width: `${p.progress}%` }}
                                        className="h-full bg-orange-500 rounded-full"
                                    />
                                </div>
                            </div>
                         </motion.div>
                    ))}
                    {/* Add Placeholder if no urgent projects */}
                    {PROJECTS.filter(p => p.progress < 50 && p.status === 'In Progress').length === 0 && (
                        <div className="w-full p-8 text-center border border-dashed border-border rounded-3xl text-muted-foreground">
                            No urgent projects right now. Good job! 🎉
                        </div>
                    )}
                </div>
            </div>

            {/* Filters Toolbar */}
            <div className="bg-card border border-border rounded-xl p-4 flex flex-col md:flex-row gap-4 justify-between items-center shadow-sm">

                {/* Search */}
                <div className="relative w-full md:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Search projects..."
                        className="w-full pl-9 pr-4 py-2 bg-muted/50 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                {/* Filters */}
                <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
                    {["All", "In Progress", "Completed", "Delayed"].map(status => (
                        <button
                            key={status}
                            onClick={() => setFilter(status)}
                            className={cn(
                                "px-3 py-1.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap",
                                filter === status
                                    ? "bg-foreground text-background"
                                    : "text-muted-foreground hover:bg-muted"
                            )}
                        >
                            {status}
                        </button>
                    ))}
                </div>

                {/* View Toggle */}
                <div className="flex items-center bg-muted/50 rounded-lg p-1 border border-border">
                    <button
                        onClick={() => setView("grid")}
                        className={cn(
                            "p-2 rounded-md transition-all",
                            view === "grid" ? "bg-card shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
                        )}
                    >
                        <LayoutGrid className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => setView("table")}
                        className={cn(
                            "p-2 rounded-md transition-all",
                            view === "table" ? "bg-card shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
                        )}
                    >
                        <List className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Content Area */}
            <AnimatePresence mode="wait">

                {/* Grid View */}
                {view === "grid" && (
                    <motion.div
                        key="grid"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    >
                        {filteredProjects.map((project, i) => (
                            <motion.div
                                key={project.id}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.2 }}
                                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                                className="bg-card border border-border rounded-3xl p-6 shadow-sm hover:shadow-xl hover:border-primary/20 transition-all group relative overflow-hidden flex flex-col"
                            >
                                <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-primary to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                                <div className="flex justify-between items-start mb-4">
                                    <div className={cn("px-2.5 py-1 rounded-full text-xs font-bold border", STATUS_COLORS[project.status as keyof typeof STATUS_COLORS])}>
                                        {project.status}
                                    </div>
                                    <Link href={`/dashboard/projects/${project.id}`} className="text-muted-foreground hover:text-foreground">
                                        <MoreVertical className="w-4 h-4" />
                                    </Link>
                                </div>

                                <h3 className="text-lg font-bold mb-1 group-hover:text-primary transition-colors cursor-pointer">
                                    <Link href={`/dashboard/projects/${project.id}`}>{project.title}</Link>
                                </h3>
                                <p className="text-sm text-muted-foreground mb-6 flex-1">{project.client}</p>

                                <div className="space-y-4 mt-auto">
                                    {/* Payment Status Action */}
                                    {project.paymentStatus === "Unpaid" && (
                                        <div className="bg-red-500/5 border border-red-500/10 rounded-xl p-3 flex justify-between items-center">
                                            <span className="text-xs font-bold text-red-500 flex items-center gap-1">
                                                <AlertCircle size={12} /> Unpaid Invoice
                                            </span>
                                            <button 
                                                onClick={() => setSelectedProject(project)}
                                                className="text-xs font-bold bg-white text-black px-3 py-1.5 rounded-lg hover:alpha-90 transition-opacity"
                                            >
                                                Pay Now
                                            </button>
                                        </div>
                                    )}

                                    <div>
                                        <div className="flex justify-between text-xs mb-1">
                                            <span className="text-muted-foreground">Progress</span>
                                            <span className="font-bold">{project.progress}%</span>
                                        </div>
                                        <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${project.progress}%` }}
                                                transition={{ duration: 1, delay: 0.5 }}
                                                className={cn("h-full rounded-full", project.progress === 100 ? "bg-green-500" : "bg-primary")}
                                            />
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between text-xs text-muted-foreground pt-4 border-t border-border">
                                        <div className="flex items-center gap-1">
                                            <Calendar className="w-3 h-3" />
                                            <span>{project.due}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Users className="w-3 h-3" />
                                            <span>{project.members} Team</span>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                )}

                {/* Table View */}
                {view === "table" && (
                    <motion.div
                        key="table"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm"
                    >
                        <table className="w-full text-left text-sm">
                            <thead className="bg-muted/50 border-b border-border text-muted-foreground">
                                <tr>
                                    <th className="p-4 font-medium">Project Name</th>
                                    <th className="p-4 font-medium">Status</th>
                                    <th className="p-4 font-medium">Payment</th>
                                    <th className="p-4 font-medium">Progress</th>
                                    <th className="p-4 font-medium hidden md:table-cell">Due Date</th>
                                    <th className="p-4 font-medium hidden md:table-cell">Budget</th>
                                    <th className="p-4 font-medium"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredProjects.map((project, i) => (
                                    <motion.tr
                                        key={project.id}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.05 }}
                                        className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors"
                                    >
                                        <td className="p-4">
                                            <div>
                                                <div className="font-bold hover:text-primary cursor-pointer">
                                                    <Link href={`/dashboard/projects/${project.id}`}>{project.title}</Link>
                                                </div>
                                                <div className="text-xs text-muted-foreground">{project.client}</div>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <span className={cn("px-2.5 py-1 rounded-full text-xs font-bold border", STATUS_COLORS[project.status as keyof typeof STATUS_COLORS])}>
                                                {project.status}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                             <div className="flex items-center gap-2">
                                                <span className={cn("px-2 py-0.5 rounded text-[10px] font-bold uppercase border", PAYMENT_STATUS_COLORS[project.paymentStatus as keyof typeof PAYMENT_STATUS_COLORS])}>
                                                    {project.paymentStatus}
                                                </span>
                                                {project.paymentStatus === "Unpaid" && (
                                                    <button 
                                                        onClick={() => setSelectedProject(project)}
                                                        className="text-xs text-primary font-bold hover:underline"
                                                    >
                                                        Pay
                                                    </button>
                                                )}
                                             </div>
                                        </td>
                                        <td className="p-4 w-48">
                                            <div className="flex items-center gap-2">
                                                <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                                                    <div style={{ width: `${project.progress}%` }} className={cn("h-full rounded-full", project.progress === 100 ? "bg-green-500" : "bg-primary")} />
                                                </div>
                                                <span className="text-xs font-medium w-8">{project.progress}%</span>
                                            </div>
                                        </td>
                                        <td className="p-4 hidden md:table-cell text-muted-foreground">
                                            {project.due}
                                        </td>
                                        <td className="p-4 hidden md:table-cell font-medium">
                                            {project.budget}
                                        </td>
                                        <td className="p-4 text-right">
                                            <Link href={`/dashboard/projects/${project.id}`} className="p-2 hover:bg-muted rounded-full text-muted-foreground hover:text-foreground inline-block">
                                                <MoreVertical className="w-4 h-4" />
                                            </Link>
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Payment Modal Render */}
            <AnimatePresence>
                {selectedProject && (
                    <PaymentModal 
                        project={selectedProject} 
                        onClose={() => setSelectedProject(null)} 
                    />
                )}
            </AnimatePresence>

            {filteredProjects.length === 0 && (
                <div className="text-center py-20 bg-card border border-border rounded-2xl border-dashed">
                    <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-bold mb-2">No Projects Found</h3>
                    <p className="text-muted-foreground">Try adjusting your filters or create a new project.</p>
                </div>
            )}

        </div>
    );
}
