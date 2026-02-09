"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { X, Loader2 } from "lucide-react";
import { Project } from "@/lib/api";
import { STATUS_OPTIONS } from "@/lib/projects";

interface EditDialogProps {
    isOpen: boolean;
    onClose: () => void;
    project: Project;
    onSave: (data: Partial<Project>) => void;
    isUpdating?: boolean;
}

export function EditDialog({ isOpen, onClose, project, onSave, isUpdating }: EditDialogProps) {
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
                                {STATUS_OPTIONS.map(s => (
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
                        disabled={isUpdating}
                        className="flex-1 px-4 py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
                    >
                        {isUpdating && <Loader2 className="w-4 h-4 animate-spin"/>}
                        {isUpdating ? "Saving..." : "Save Changes"}
                    </button>
                </div>
            </motion.div>
        </div>
    );
};
