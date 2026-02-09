"use client";

import { motion } from "framer-motion";
import { AlertCircle } from "lucide-react";

interface DeleteDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    projectTitle: string;
}

export function DeleteDialog({ isOpen, onClose, onConfirm, projectTitle }: DeleteDialogProps) {
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
