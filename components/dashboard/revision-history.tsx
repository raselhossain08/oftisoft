"use client";

import { useState } from "react";
import { History, RotateCcw, Eye, Trash2, Clock, User, FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export interface Revision {
    id: string;
    timestamp: Date;
    author: string;
    description: string;
    changes: {
        field: string;
        oldValue: string;
        newValue: string;
    }[];
    data: any;
}

interface RevisionHistoryProps {
    revisions: Revision[];
    onRestore: (revision: Revision) => void;
    onDelete?: (revisionId: string) => void;
    currentVersion?: string;
}

export function RevisionHistory({
    revisions,
    onRestore,
    onDelete,
    currentVersion
}: RevisionHistoryProps) {
    const [selectedRevision, setSelectedRevision] = useState<Revision | null>(null);
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);

    const handleRestore = (revision: Revision) => {
        if (confirm(`Are you sure you want to restore to version from ${new Date(revision.timestamp).toLocaleString()}?`)) {
            onRestore(revision);
            toast.success('Content restored successfully!');
        }
    };

    const handleDelete = (revisionId: string) => {
        if (onDelete && confirm('Are you sure you want to delete this revision?')) {
            onDelete(revisionId);
            toast.success('Revision deleted');
        }
    };

    const formatTimestamp = (date: Date) => {
        const now = new Date();
        const diff = now.getTime() - new Date(date).getTime();
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (minutes < 1) return 'Just now';
        if (minutes < 60) return `${minutes}m ago`;
        if (hours < 24) return `${hours}h ago`;
        if (days < 7) return `${days}d ago`;
        return new Date(date).toLocaleDateString();
    };

    return (
        <Card className="rounded-[32px]">
            <CardHeader className="p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="text-lg font-black flex items-center gap-2">
                            <History className="w-5 h-5" />
                            Revision History
                        </CardTitle>
                        <CardDescription className="mt-1">
                            {revisions.length} saved versions
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>
            <Separator />
            <ScrollArea className="h-[400px]">
                <CardContent className="p-6 space-y-3">
                    {revisions.length === 0 ? (
                        <div className="text-center py-12 text-muted-foreground">
                            <FileText className="w-12 h-12 mx-auto mb-3 opacity-20" />
                            <p className="text-sm">No revisions yet</p>
                        </div>
                    ) : (
                        revisions.map((revision, index) => (
                            <div
                                key={revision.id}
                                className={cn(
                                    "group relative p-4 rounded-2xl border transition-all hover:border-primary/50",
                                    currentVersion === revision.id ? "bg-primary/5 border-primary" : "bg-card border-border/50"
                                )}
                            >
                                {/* Timeline dot */}
                                {index < revisions.length - 1 && (
                                    <div className="absolute left-6 top-14 bottom-0 w-px bg-border/50" />
                                )}
                                
                                <div className="flex items-start gap-4">
                                    <div className={cn(
                                        "w-8 h-8 rounded-full flex items-center justify-center shrink-0 relative z-10",
                                        currentVersion === revision.id ? "bg-primary text-white" : "bg-muted"
                                    )}>
                                        <Clock className="w-4 h-4" />
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-2 mb-2">
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-semibold truncate">
                                                    {revision.description}
                                                </p>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <Badge variant="outline" className="text-xs">
                                                        <User className="w-3 h-3 mr-1" />
                                                        {revision.author}
                                                    </Badge>
                                                    <span className="text-xs text-muted-foreground">
                                                        {formatTimestamp(revision.timestamp)}
                                                    </span>
                                                </div>
                                            </div>
                                            {currentVersion === revision.id && (
                                                <Badge className="bg-primary text-white">Current</Badge>
                                            )}
                                        </div>

                                        {/* Changes summary */}
                                        {revision.changes.length > 0 && (
                                            <div className="text-xs text-muted-foreground mb-3">
                                                {revision.changes.length} change{revision.changes.length !== 1 ? 's' : ''}
                                            </div>
                                        )}

                                        {/* Actions */}
                                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Dialog open={isPreviewOpen && selectedRevision?.id === revision.id} onOpenChange={setIsPreviewOpen}>
                                                <DialogTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-8 rounded-xl"
                                                        onClick={() => setSelectedRevision(revision)}
                                                    >
                                                        <Eye className="w-3 h-3 mr-1" />
                                                        Preview
                                                    </Button>
                                                </DialogTrigger>
                                                <DialogContent className="max-w-2xl max-h-[80vh] overflow-auto">
                                                    <DialogHeader>
                                                        <DialogTitle>Revision Preview</DialogTitle>
                                                        <DialogDescription>
                                                            {new Date(revision.timestamp).toLocaleString()}
                                                        </DialogDescription>
                                                    </DialogHeader>
                                                    <div className="space-y-4 mt-4">
                                                        {revision.changes.map((change, idx) => (
                                                            <div key={idx} className="p-4 rounded-xl bg-muted/50 space-y-2">
                                                                <p className="text-sm font-semibold">{change.field}</p>
                                                                <div className="grid grid-cols-2 gap-4 text-xs">
                                                                    <div>
                                                                        <p className="text-muted-foreground mb-1">Before:</p>
                                                                        <p className="p-2 rounded bg-red-500/10 text-red-600">{change.oldValue}</p>
                                                                    </div>
                                                                    <div>
                                                                        <p className="text-muted-foreground mb-1">After:</p>
                                                                        <p className="p-2 rounded bg-green-500/10 text-green-600">{change.newValue}</p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </DialogContent>
                                            </Dialog>

                                            {currentVersion !== revision.id && (
                                                <>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-8 rounded-xl"
                                                        onClick={() => handleRestore(revision)}
                                                    >
                                                        <RotateCcw className="w-3 h-3 mr-1" />
                                                        Restore
                                                    </Button>
                                                    {onDelete && (
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="h-8 rounded-xl text-destructive hover:text-destructive"
                                                            onClick={() => handleDelete(revision.id)}
                                                        >
                                                            <Trash2 className="w-3 h-3" />
                                                        </Button>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </CardContent>
            </ScrollArea>
        </Card>
    );
}
