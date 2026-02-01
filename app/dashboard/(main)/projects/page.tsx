
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Search, Filter, Plus, LayoutGrid, List, MoreVertical,
    Calendar, Users, AlertCircle, CheckCircle2, Clock
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

// --- Mock Data ---

const PROJECTS = [
    { id: 1, title: "E-commerce Redesign", client: "EcoLife Inc", status: "In Progress", progress: 65, due: "Oct 24", members: 4, budget: "$12,000" },
    { id: 2, title: "FinTech Dashboard", client: "FinanceFlow", status: "Completed", progress: 100, due: "Sep 12", members: 6, budget: "$45,000" },
    { id: 3, title: "AI Chat Integration", client: "TechHelp", status: "Review", progress: 90, due: "Oct 30", members: 3, budget: "$8,500" },
    { id: 4, title: "Mobile App MVP", client: "StartUp X", status: "Delayed", progress: 30, due: "Nov 15", members: 5, budget: "$22,000" },
    { id: 5, title: "Cloud Migration", client: "Enterprise Corp", status: "In Progress", progress: 45, due: "Dec 01", members: 8, budget: "$120,000" },
    { id: 6, title: "Marketing Website", client: "BrandNew", status: "Planning", progress: 10, due: "Jan 10", members: 2, budget: "$5,000" },
];

const STATUS_COLORS = {
    "In Progress": "bg-blue-500/10 text-blue-500 border-blue-500/20",
    "Completed": "bg-green-500/10 text-green-500 border-green-500/20",
    "Review": "bg-purple-500/10 text-purple-500 border-purple-500/20",
    "Delayed": "bg-red-500/10 text-red-500 border-red-500/20",
    "Planning": "bg-orange-500/10 text-orange-500 border-orange-500/20",
};

export default function ProjectsOverview() {
    const [view, setView] = useState<"grid" | "table">("grid");
    const [filter, setFilter] = useState("All");
    const [search, setSearch] = useState("");

    const filteredProjects = PROJECTS.filter(p =>
        (filter === "All" || p.status === filter) &&
        (p.title.toLowerCase().includes(search.toLowerCase()) || p.client.toLowerCase().includes(search.toLowerCase()))
    );

    return (
        <div className="space-y-8">

            {/* Header & Controls */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold">Projects</h1>
                    <p className="text-muted-foreground">Manage and track all your ongoing projects.</p>
                </div>

                <Link
                    href="/dashboard/projects/new"
                    className="px-4 py-2 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-colors flex items-center gap-2 shadow-lg shadow-primary/20"
                >
                    <Plus className="w-4 h-4" /> New Project
                </Link>
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
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: i * 0.05 }}
                                whileHover={{ y: -5 }}
                                className="bg-card border border-border rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all group relative overflow-hidden"
                            >
                                <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-primary to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                                <div className="flex justify-between items-start mb-4">
                                    <div className={cn("px-2.5 py-1 rounded-full text-xs font-bold border", STATUS_COLORS[project.status as keyof typeof STATUS_COLORS])}>
                                        {project.status}
                                    </div>
                                    <button className="text-muted-foreground hover:text-foreground">
                                        <MoreVertical className="w-4 h-4" />
                                    </button>
                                </div>

                                <h3 className="text-lg font-bold mb-1 group-hover:text-primary transition-colors cursor-pointer">
                                    <Link href={`/dashboard/projects/${project.id}`}>{project.title}</Link>
                                </h3>
                                <p className="text-sm text-muted-foreground mb-6">{project.client}</p>

                                <div className="space-y-4">
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
                                            <button className="p-2 hover:bg-muted rounded-full text-muted-foreground hover:text-foreground">
                                                <MoreVertical className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </motion.div>
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
