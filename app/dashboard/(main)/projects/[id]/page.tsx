"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    ChevronLeft, MoreVertical, Calendar, Flag, PieChart,
    MessageSquare, FolderOpen, Clock, Settings,
    Plus, DollarSign, CheckCircle2, AlertCircle, Trash2,
    Share2, TrendingUp, Wallet, Edit3, X
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useProjects } from "@/hooks/useProjects";
import { toast } from "sonner";

const TABS = [
    { id: "overview", label: "Overview", icon: PieChart },
    { id: "details", label: "Details", icon: Flag },
    { id: "budget", label: "Budget", icon: DollarSign },
    { id: "settings", label: "Settings", icon: Settings },
];

// Delete Confirmation Dialog
const DeleteDialog = ({ isOpen, onClose, onConfirm, projectTitle }: any) => {
    if (!isOpen) return null;
    
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-card w-full max-w-md rounded-3xl border border-border shadow-2xl overflow-hidden"
            >
                <div className="p-6 border-b border-border bg-red-500/5">
                    <div className="flex items-center gap-3 text-red-500">
                        <AlertCircle className="w-6 h-6" />
                        <h3 className="text-xl font-bold">Delete Project</h3>
                    </div>
                </div>
                <div className="p-6 space-y-4">
                    <p className="text-muted-foreground">
                        Are you sure you want to delete <strong>{projectTitle}</strong>? This action cannot be undone.
                    </p>
                    <div className="flex gap-3 pt-4">
                        <button
                            onClick={onClose}
                            className="flex-1 px-4 py-3 border border-border rounded-xl font-bold hover:bg-muted transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={onConfirm}
                            className="flex-1 px-4 py-3 bg-red-500 text-white rounded-xl font-bold hover:bg-red-600 transition-colors"
                        >
                            Delete Project
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

// Edit Dialog
const EditDialog = ({ isOpen, onClose, project, onSave }: any) => {
    const [title, setTitle] = useState(project?.title || "");
    const [client, setClient] = useState(project?.client || "");
    const [description, setDescription] = useState(project?.description || "");
    const [status, setStatus] = useState(project?.status || "Planning");
    const [progress, setProgress] = useState(project?.progress || 0);
    const [budget, setBudget] = useState(project?.budget || "");
    const [dueDate, setDueDate] = useState(project?.dueDate ? new Date(project.dueDate).toISOString().split('T')[0] : "");
    const [members, setMembers] = useState(project?.members || 1);

    if (!isOpen) return null;

    const handleSave = () => {
        onSave({
            title,
            client,
            description,
            status,
            progress: parseFloat(progress.toString()),
            budget: budget ? parseFloat(budget.toString()) : undefined,
            dueDate: dueDate || undefined,
            members: parseInt(members.toString()),
        });
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-card w-full max-w-2xl rounded-3xl border border-border shadow-2xl overflow-hidden my-8"
            >
                <div className="p-6 border-b border-border flex justify-between items-center bg-muted/30">
                    <h3 className="text-xl font-bold">Edit Project</h3>
                    <button onClick={onClose} className="p-2 hover:bg-muted rounded-full transition-colors">
                        <X size={18} />
                    </button>
                </div>
                <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-bold">Project Title</label>
                            <input
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full bg-muted/30 border border-border rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/20 outline-none"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold">Client</label>
                            <input
                                value={client}
                                onChange={(e) => setClient(e.target.value)}
                                className="w-full bg-muted/30 border border-border rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/20 outline-none"
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-bold">Description</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={3}
                            className="w-full bg-muted/30 border border-border rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/20 outline-none resize-none"
                        />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-bold">Status</label>
                            <select
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                className="w-full bg-muted/30 border border-border rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/20 outline-none"
                            >
                                {["Planning", "In Progress", "Review", "Completed", "Delayed", "On Hold"].map(s => (
                                    <option key={s} value={s}>{s}</option>
                                ))}
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold">Progress (%)</label>
                            <input
                                type="number"
                                min="0"
                                max="100"
                                value={progress}
                                onChange={(e) => setProgress(parseFloat(e.target.value) || 0)}
                                className="w-full bg-muted/30 border border-border rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/20 outline-none"
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-bold">Budget</label>
                            <input
                                type="number"
                                value={budget}
                                onChange={(e) => setBudget(e.target.value)}
                                className="w-full bg-muted/30 border border-border rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/20 outline-none"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold">Team Members</label>
                            <input
                                type="number"
                                min="1"
                                value={members}
                                onChange={(e) => setMembers(parseInt(e.target.value) || 1)}
                                className="w-full bg-muted/30 border border-border rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/20 outline-none"
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-bold">Due Date</label>
                        <input
                            type="date"
                            value={dueDate}
                            onChange={(e) => setDueDate(e.target.value)}
                            className="w-full bg-muted/30 border border-border rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/20 outline-none"
                        />
                    </div>
                </div>
                <div className="p-6 border-t border-border flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 px-4 py-3 border border-border rounded-xl font-bold hover:bg-muted transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        className="flex-1 px-4 py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-colors"
                    >
                        Save Changes
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

export default function ProjectDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const projectId = params.id as string;
    
    const { project, isLoading, updateProject, deleteProject, isUpdating, isDeleting } = useProjects(projectId);
    
    const [activeTab, setActiveTab] = useState("overview");
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [showEditDialog, setShowEditDialog] = useState(false);

    const handleDelete = () => {
        deleteProject(projectId);
        setTimeout(() => {
            router.push("/dashboard/projects");
        }, 1000);
    };

    const handleUpdate = (data: any) => {
        updateProject(projectId, data);
        setShowEditDialog(false);
    };

    const formatDate = (dateString?: string) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    const STATUS_COLORS: any = {
        "In Progress": "bg-blue-500/10 text-blue-500 border-blue-500/20",
        "Completed": "bg-green-500/10 text-green-500 border-green-500/20",
        "Review": "bg-purple-500/10 text-purple-500 border-purple-500/20",
        "Delayed": "bg-red-500/10 text-red-500 border-red-500/20",
        "Planning": "bg-orange-500/10 text-orange-500 border-orange-500/20",
        "On Hold": "bg-gray-500/10 text-gray-500 border-gray-500/20",
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!project) {
        return (
            <div className="text-center py-20">
                <AlertCircle className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-2">Project Not Found</h3>
                <p className="text-muted-foreground mb-6">The project you're looking for doesn't exist.</p>
                <Link href="/dashboard/projects" className="px-6 py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-all inline-block">
                    Back to Projects
                </Link>
            </div>
        );
    }

    const budgetSpent = project.budget ? (project.budget * (project.progress / 100)) : 0;
    const budgetRemaining = project.budget ? (project.budget - budgetSpent) : 0;

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
                            {project.title.substring(0, 2).toUpperCase()}
                        </motion.div>
                        <div>
                            <h1 className="text-2xl font-bold flex items-center gap-3">
                                {project.title}
                                <span className={cn("px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase border", STATUS_COLORS[project.status])}>
                                    {project.status}
                                </span>
                            </h1>
                            <p className="text-muted-foreground text-sm">Client: {project.client}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <button className="p-2.5 border border-border rounded-xl hover:bg-muted transition-colors">
                            <Share2 className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => setShowEditDialog(true)}
                            className="px-5 py-2.5 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 hover:-translate-y-0.5 text-center flex items-center gap-2"
                        >
                            <Edit3 className="w-4 h-4" /> Edit Project
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
                                        {project.description || "No description provided."}
                                    </p>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-8 border-t border-border">
                                        <div>
                                            <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider mb-1">Created</p>
                                            <p className="font-bold">{formatDate(project.createdAt)}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider mb-1">Deadline</p>
                                            <p className="font-bold text-red-500">{formatDate(project.dueDate)}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider mb-1">Budget</p>
                                            <p className="font-bold text-green-500">${project.budget?.toLocaleString() || 'N/A'}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider mb-1">Team Size</p>
                                            <p className="font-bold">{project.members} members</p>
                                        </div>
                                    </div>
                                </section>

                                {project.notes && (
                                    <section className="bg-card border border-border rounded-3xl p-8 shadow-sm">
                                        <h3 className="font-bold text-lg mb-4">Notes</h3>
                                        <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                                            {project.notes}
                                        </p>
                                    </section>
                                )}
                            </div>

                            <div className="space-y-6">
                                <div className="bg-card border border-border rounded-3xl p-8 shadow-sm space-y-8">
                                    <h3 className="font-bold text-lg">Project Performance</h3>
                                    <div className="space-y-6">
                                        <div>
                                            <div className="flex justify-between text-sm mb-2 font-bold">
                                                <span className="text-muted-foreground">Completion</span>
                                                <span>{project.progress}%</span>
                                            </div>
                                            <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${project.progress}%` }}
                                                    className="bg-primary h-full rounded-full shadow-[0_0_10px_rgba(var(--primary),0.3)]"
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
                                                <p className="text-xs text-muted-foreground font-bold">Payment Status</p>
                                                <p className="font-bold text-lg">{project.paymentStatus}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Tab: DETAILS */}
                    {activeTab === "details" && (
                        <div className="max-w-3xl space-y-6">
                            <div className="bg-card border border-border rounded-3xl p-8 shadow-sm">
                                <h3 className="font-bold text-lg mb-6">Project Information</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider mb-2">Project ID</p>
                                        <p className="font-mono text-sm bg-muted px-3 py-2 rounded-lg">{project.id}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider mb-2">Status</p>
                                        <span className={cn("px-3 py-1.5 rounded-full text-xs font-bold border inline-block", STATUS_COLORS[project.status])}>
                                            {project.status}
                                        </span>
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider mb-2">Created At</p>
                                        <p className="font-bold">{formatDate(project.createdAt)}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider mb-2">Last Updated</p>
                                        <p className="font-bold">{formatDate(project.updatedAt)}</p>
                                    </div>
                                </div>
                            </div>

                            {project.tags && project.tags.length > 0 && (
                                <div className="bg-card border border-border rounded-3xl p-8 shadow-sm">
                                    <h3 className="font-bold text-lg mb-4">Tags</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {project.tags.map((tag, i) => (
                                            <span key={i} className="px-3 py-1.5 bg-muted border border-border rounded-full text-sm font-medium">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Tab: BUDGET */}
                    {activeTab === "budget" && (
                        <div className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="bg-card border border-border rounded-3xl p-8 shadow-sm">
                                    <p className="text-sm text-muted-foreground font-bold mb-2">Total Budget</p>
                                    <h3 className="text-3xl font-bold flex items-center gap-2">
                                        <Wallet className="text-primary" /> ${project.budget?.toLocaleString() || 'N/A'}
                                    </h3>
                                </div>
                                <div className="bg-card border border-border rounded-3xl p-8 shadow-sm">
                                    <p className="text-sm text-muted-foreground font-bold mb-2">Estimated Spent</p>
                                    <h3 className="text-3xl font-bold text-orange-500">${budgetSpent.toLocaleString()}</h3>
                                    <p className="text-xs text-muted-foreground mt-2">Based on {project.progress}% completion</p>
                                </div>
                                <div className="bg-card border border-border rounded-3xl p-8 shadow-sm">
                                    <p className="text-sm text-muted-foreground font-bold mb-2">Remaining</p>
                                    <h3 className="text-3xl font-bold text-green-500">${budgetRemaining.toLocaleString()}</h3>
                                </div>
                            </div>

                            <div className="bg-card border border-border rounded-3xl p-8 shadow-sm">
                                <h3 className="font-bold text-lg mb-4">Budget Breakdown</h3>
                                <div className="space-y-4">
                                    <div>
                                        <div className="flex justify-between text-sm mb-2">
                                            <span className="font-medium">Progress-based Spending</span>
                                            <span className="font-bold">{project.progress}%</span>
                                        </div>
                                        <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
                                            <div style={{ width: `${project.progress}%` }} className="bg-orange-500 h-full rounded-full" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Tab: SETTINGS */}
                    {activeTab === "settings" && (
                        <div className="max-w-2xl space-y-10">
                            <div className="pt-10 border-t border-border">
                                <h3 className="text-xl font-bold text-red-500 mb-6 font-bold flex items-center gap-2">
                                    <AlertCircle className="w-5 h-5" /> Danger Zone
                                </h3>
                                <div className="space-y-4">
                                    <p className="text-sm text-muted-foreground mb-4">
                                        Deleting a project is irreversible. All project data will be permanently removed.
                                    </p>
                                    <button
                                        onClick={() => setShowDeleteDialog(true)}
                                        disabled={isDeleting}
                                        className="px-6 py-3 border-2 border-red-500/20 text-red-500 rounded-2xl font-bold hover:bg-red-500/10 transition-all flex items-center gap-2 disabled:opacity-50"
                                    >
                                        <Trash2 className="w-4 h-4" /> {isDeleting ? "Deleting..." : "Delete This Project"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                </motion.div>
            </AnimatePresence>

            {/* Dialogs */}
            <AnimatePresence>
                {showDeleteDialog && (
                    <DeleteDialog
                        isOpen={showDeleteDialog}
                        onClose={() => setShowDeleteDialog(false)}
                        onConfirm={handleDelete}
                        projectTitle={project.title}
                    />
                )}
                {showEditDialog && (
                    <EditDialog
                        isOpen={showEditDialog}
                        onClose={() => setShowEditDialog(false)}
                        project={project}
                        onSave={handleUpdate}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}
