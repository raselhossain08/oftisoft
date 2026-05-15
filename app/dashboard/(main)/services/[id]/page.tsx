"use client"
import { AnimatedDiv, AnimatePresence } from "@/lib/animated";
;

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { 
    ArrowLeft, 
    Calendar, 
    Clock, 
    CheckCircle2, 
    Users, 
    Briefcase, 
    Plus, 
    MoreHorizontal,
    MessageSquare,
    ExternalLink,
    UserPlus,
    Target,
    Zap,
    History,
    Edit3,
    Trash2,
    X,
    AlertCircle,
    Send
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
    Select, 
    SelectContent, 
    SelectItem, 
    SelectTrigger, 
    SelectValue 
} from "@/components/ui/select";
import Link from "next/link";
import { toast } from "sonner";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { useProjects } from "@/hooks/useProjects";
import { useAuth } from "@/hooks/useAuth";
import { RevisionHistory, Revision } from "@/components/dashboard/revision-history";

// Edit Project Dialog
const EditProjectDialog = ({ isOpen, onClose, project }: any) => {
    const { updateProject, isUpdating } = useProjects();
    const [formData, setFormData] = useState({
        title: project?.title || "",
        client: project?.client || "",
        description: project?.description || "",
        status: project?.status || "",
        progress: project?.progress || 0,
        budget: project?.budget || 0,
        members: project?.members || 1,
        dueDate: project?.dueDate ? new Date(project.dueDate).toISOString().split('T')[0] : ""
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        updateProject(project.id, {
            ...formData,
            budget: parseFloat(formData.budget.toString()),
            progress: parseInt(formData.progress.toString()),
            members: parseInt(formData.members.toString())
        }, {
            onSuccess: () => {
                onClose();
            }
        });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <AnimatedDiv initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-card w-full max-w-2xl rounded-3xl border border-border shadow-2xl overflow-hidden"
            >
                <div className="p-6 border-b border-border flex justify-between items-center bg-muted/30">
                    <div>
                        <h3 className="text-xl font-bold">Edit Service Project</h3>
                        <p className="text-sm text-muted-foreground">Update project details</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-muted rounded-full transition-colors">
                        <X size={18} />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="title">Project Title</Label>
                            <Input id="title"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                className="h-12 rounded-xl"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="client">Client</Label>
                            <Input id="client"
                                value={formData.client}
                                onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                                className="h-12 rounded-xl"
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea id="description"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="min-h-[100px] rounded-xl"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="status">Status</Label>
                            <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                                <SelectTrigger className="h-12 rounded-xl">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Planning">Planning</SelectItem>
                                    <SelectItem value="In Progress">In Progress</SelectItem>
                                    <SelectItem value="On Hold">On Hold</SelectItem>
                                    <SelectItem value="Review">Review</SelectItem>
                                    <SelectItem value="Completed">Completed</SelectItem>
                                    <SelectItem value="Delayed">Delayed</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="progress">Progress (%)</Label>
                            <Input id="progress"
                                type="number"
                                min="0"
                                max="100"
                                value={formData.progress}
                                onChange={(e) => setFormData({ ...formData, progress: parseInt(e.target.value) || 0 })}
                                className="h-12 rounded-xl"
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="budget">Budget</Label>
                            <Input id="budget"
                                type="number"
                                value={formData.budget}
                                onChange={(e) => setFormData({ ...formData, budget: parseFloat(e.target.value) || 0 })}
                                className="h-12 rounded-xl"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="members">Team Size</Label>
                            <Input id="members"
                                type="number"
                                min="1"
                                value={formData.members}
                                onChange={(e) => setFormData({ ...formData, members: parseInt(e.target.value) || 1 })}
                                className="h-12 rounded-xl"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="dueDate">Deadline</Label>
                            <Input id="dueDate"
                                type="date"
                                value={formData.dueDate}
                                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                                className="h-12 rounded-xl"
                            />
                        </div>
                    </div>
                    <div className="flex gap-3 pt-4">
                        <button type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-3 border border-border rounded-xl font-bold hover:bg-muted transition-colors"
                        >
                            Cancel
                        </button>
                        <button type="submit"
                            disabled={isUpdating}
                            className="flex-1 px-4 py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-colors disabled:opacity-50"
                        >
                            {isUpdating ? "Updating..." : "Save Changes"}
                        </button>
                    </div>
                </form>
            </AnimatedDiv>
        </div>
    );
};

// Delete Confirmation Dialog
const DeleteDialog = ({ isOpen, onClose, onConfirm, projectTitle }: any) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <AnimatedDiv initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-card w-full max-w-md rounded-3xl border border-border shadow-2xl overflow-hidden"
            >
                <div className="p-6 space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center">
                            <AlertCircle className="w-6 h-6 text-red-500" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold">Delete Project</h3>
                            <p className="text-sm text-muted-foreground">This action cannot be undone</p>
                        </div>
                    </div>
                    <p className="text-sm">
                        Are you sure you want to delete <span className="font-bold">"{projectTitle}"</span>? All project data will be permanently removed.
                    </p>
                    <div className="flex gap-3 pt-4">
                        <button onClick={onClose}
                            className="flex-1 px-4 py-3 border border-border rounded-xl font-bold hover:bg-muted transition-colors"
                        >
                            Cancel
                        </button>
                        <button onClick={onConfirm}
                            className="flex-1 px-4 py-3 bg-red-500 text-white rounded-xl font-bold hover:bg-red-600 transition-colors"
                        >
                            Delete Project
                        </button>
                    </div>
                </div>
            </AnimatedDiv>
        </div>
    );
};

export default function ServiceOrderDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const id = params?.id as string;
    
    const { project, isLoading, deleteProject, isDeleting } = useProjects(id);
    const { user } = useAuth();
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [isPostUpdateOpen, setIsPostUpdateOpen] = useState(false);
    const [updateMessage, setUpdateMessage] = useState("");
    const [isPostingUpdate, setIsPostingUpdate] = useState(false);
    const [isRevisionDialogOpen, setIsRevisionDialogOpen] = useState(false);
    const [revisionDescription, setRevisionDescription] = useState("");
    const [revisions, setRevisions] = useState<Revision[]>([
        {
            id: "rev-1",
            timestamp: new Date(Date.now() - 86400000 * 3),
            author: "System",
            description: "Initial deliverable uploaded",
            changes: [{ field: "Status", oldValue: "Planning", newValue: "In Progress" }],
            data: {}
        },
    ]);

    const handleRequestRevision = () => {
        setIsRevisionDialogOpen(true);
    };

    const handleSubmitRevision = () => {
        if (!revisionDescription.trim()) return;
        const newRevision: Revision = {
            id: `rev-${Date.now()}`,
            timestamp: new Date(),
            author: user?.name || "Client",
            description: revisionDescription,
            changes: [{ field: "Status", oldValue: project.status, newValue: "Review" }],
            data: {}
        };
        setRevisions(prev => [newRevision, ...prev]);
        setRevisionDescription("");
        setIsRevisionDialogOpen(false);
        toast.success("Revision request submitted");
    };

    const handleRestoreRevision = (revision: Revision) => {
        toast.info("Restoring revision...");
    };

    const handlePostUpdate = async () => {
        if (!updateMessage.trim()) return;
        setIsPostingUpdate(true);
        await new Promise(r => setTimeout(r, 500));
        toast.success("Status update posted");
        setUpdateMessage("");
        setIsPostUpdateOpen(false);
        setIsPostingUpdate(false);
    };

    const handleDelete = () => {
        deleteProject(id, {
            onSuccess: () => {
                router.push("/dashboard/services");
            }
        });
    };

    const formatDate = (dateString?: string) => {
        if (!dateString) return "Not set";
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "In Progress": return "bg-blue-500/10 text-blue-500";
            case "Completed": return "bg-green-500/10 text-green-500";
            case "Planning": return "bg-orange-500/10 text-orange-500";
            case "On Hold": return "bg-purple-500/10 text-purple-500";
            case "Review": return "bg-amber-500/10 text-amber-500";
            case "Delayed": return "bg-red-500/10 text-red-500";
            default: return "bg-muted/10 text-muted-foreground";
        }
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
            <div className="flex flex-col items-center justify-center py-20 space-y-4">
                <AlertCircle className="w-16 h-16 text-muted-foreground opacity-20" />
                <h2 className="text-2xl font-bold">Service Project Not Found</h2>
                <p className="text-muted-foreground">The project you're looking for doesn't exist or has been removed.</p>
                <Button asChild>
                    <Link href="/dashboard/services/my-requests">
                        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Projects
                    </Link>
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-8 max-w-6xl mx-auto pb-20">
            {/* Header / Primary Actions */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Button asChild variant="ghost" size="icon" className="rounded-full">
                        <Link href="/dashboard/services/my-requests">
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                    </Button>
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-3xl font-semibold">{project.title}</h1>
                            <Badge className={`${getStatusColor(project.status)} border-none uppercase text-sm`}>
                                {project.status}
                            </Badge>
                        </div>
                        <p className="text-muted-foreground text-sm flex items-center gap-2">
                            <Briefcase className="w-3 h-3" /> Client: {project.client} • ID: {project.id.substring(0, 8)}
                        </p>
                    </div>
                </div>
                <div className="flex flex-wrap gap-2">
                    <Button 
                        variant="outline" 
                        className="gap-2 rounded-xl h-11"
                        onClick={() => setIsEditOpen(true)}
                    >
                        <Edit3 className="w-4 h-4" />
                        Edit Project
                    </Button>
                    <Button 
                        variant="outline"
                        className="gap-2 rounded-xl h-11 text-red-500 border-red-500/20 hover:bg-red-500/10"
                        onClick={() => setIsDeleteOpen(true)}
                        disabled={isDeleting}
                    >
                        <Trash2 className="w-4 h-4" />
                        Delete
                    </Button>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Main Tracking Area */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Progress Overview */}
                    <Card className="border-border/50 bg-gradient-to-br from-primary/5 to-transparent">
                        <CardHeader>
                            <div className="flex justify-between items-end mb-2">
                                <CardTitle className="flex items-center gap-2 text-xl">
                                    <Target className="w-5 h-5 text-primary" /> Delivery Progress
                                </CardTitle>
                                <span className="text-2xl font-semibold text-primary">{project.progress}%</span>
                            </div>
                            <Progress value={project.progress} className="h-3" />
                        </CardHeader>
                        <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                            {[
                                { label: "Deadline", value: formatDate(project.dueDate), icon: Calendar },
                                { label: "Budget", value: project.budget ? `$${project.budget.toLocaleString()}` : "Not set", icon: Briefcase },
                                { label: "Type", value: "Custom Service", icon: Zap },
                                { label: "Team", value: `${project.members} ${project.members === 1 ? 'Member' : 'Members'}`, icon: Users },
                            ].map((stat) => (
                                <div key={stat.label} className="p-4 rounded-2xl bg-background/50 border border-border/50">
                                    <p className="text-sm text-muted-foreground uppercase font-semibold mb-1">{stat.label}</p>
                                    <div className="flex items-center gap-2 font-bold text-sm">
                                        <stat.icon className="w-3 h-3 text-primary" />
                                        {stat.value}
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    {/* Project Description */}
                    <Card className="border-border/50">
                        <CardHeader>
                            <CardTitle className="text-lg">Project Description</CardTitle>
                            <CardDescription>Service requirements and objectives</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                {project.description || "No description provided for this project."}
                            </p>
                        </CardContent>
                    </Card>

                    {/* Project Timeline */}
                    <Card className="border-border/50">
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <History className="w-5 h-5 text-primary" />
                                Project Timeline
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex justify-between items-center p-4 rounded-xl bg-muted/20 border border-border/50">
                                <div>
                                    <p className="text-xs font-bold text-muted-foreground uppercase">Created</p>
                                    <p className="font-bold">{formatDate(project.createdAt)}</p>
                                </div>
                                <CheckCircle2 className="w-5 h-5 text-green-500" />
                            </div>
                            <div className="flex justify-between items-center p-4 rounded-xl bg-muted/20 border border-border/50">
                                <div>
                                    <p className="text-xs font-bold text-muted-foreground uppercase">Last Updated</p>
                                    <p className="font-bold">{formatDate(project.updatedAt)}</p>
                                </div>
                                <Clock className="w-5 h-5 text-primary" />
                            </div>
                            <div className="flex justify-between items-center p-4 rounded-xl bg-primary/5 border border-primary/20">
                                <div>
                                    <p className="text-xs font-bold text-primary uppercase">Deadline</p>
                                    <p className="font-bold">{formatDate(project.dueDate)}</p>
                                </div>
                                <Calendar className="w-5 h-5 text-primary" />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Revision History */}
                    <div className="relative">
                        <RevisionHistory
                            revisions={revisions}
                            onRestore={handleRestoreRevision}
                        />
                    </div>
                </div>

                {/* Sidebar Context */}
                <div className="space-y-8">
                    {/* Quick Actions */}
                    <Card className="border-border/50 shadow-xl shadow-primary/5">
                        <CardHeader>
                            <CardTitle className="text-lg">Quick Actions</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <Button 
                                className="w-full rounded-xl gap-2 font-bold h-11"
                                onClick={() => router.push("/dashboard/messages")}
                            >
                                <MessageSquare className="w-4 h-4" />
                                Team Chat
                            </Button>
                            <Button 
                                variant="outline"
                                className="w-full rounded-xl gap-2 font-bold h-11"
                                onClick={() => setIsEditOpen(true)}
                            >
                                <Edit3 className="w-4 h-4" />
                                Edit Details
                            </Button>
                            <Button 
                                variant="outline"
                                className="w-full rounded-xl gap-2 font-bold h-11"
                                onClick={() => setIsPostUpdateOpen(true)}
                            >
                                <History className="w-4 h-4" />
                                Post Update
                            </Button>
                            <Button 
                                variant="outline"
                                className="w-full rounded-xl gap-2 font-bold h-11 text-amber-500 border-amber-500/20 hover:bg-amber-500/10"
                                onClick={handleRequestRevision}
                            >
                                <History className="w-4 h-4" />
                                Request Revision
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Customer Profile Quick View */}
                    <Card className="border-border/50 overflow-hidden">
                        <CardHeader className="bg-muted/30">
                            <CardTitle className="text-base flex items-center gap-2">
                                <Users className="w-4 h-4 text-primary" />
                                Client Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 space-y-4">
                            <div className="flex items-center gap-3">
                                <Avatar className="h-10 w-10 border border-border">
                                    <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                                        {project.client?.[0] || "C"}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-bold">{project.client}</p>
                                    <p className="text-sm text-primary font-mono font-bold">CLIENT ACCOUNT</p>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between text-xs">
                                    <span className="text-muted-foreground">Budget</span>
                                    <span className="font-bold">{project.budget ? `$${project.budget.toLocaleString()}` : "Not set"}</span>
                                </div>
                                <div className="flex justify-between text-xs">
                                    <span className="text-muted-foreground">Payment Status</span>
                                    <Badge variant="outline" className="h-5 text-xs">
                                        {project.paymentStatus || "Pending"}
                                    </Badge>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Project Stats */}
                    <Card className="border-border/50">
                        <CardHeader>
                            <CardTitle className="text-base flex items-center justify-between">
                                Project Stats
                                <Badge variant="secondary" className="h-5 text-xs font-semibold">LIVE</Badge>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex justify-between items-center p-3 rounded-xl bg-muted/20 border border-border/50">
                                <span className="text-xs font-bold">Progress</span>
                                <span className="text-xs font-semibold text-primary">{project.progress}%</span>
                            </div>
                            <div className="flex justify-between items-center p-3 rounded-xl bg-muted/20 border border-border/50">
                                <span className="text-xs font-bold">Team Size</span>
                                <span className="text-xs font-semibold text-primary">{project.members}</span>
                            </div>
                            <div className="flex justify-between items-center p-3 rounded-xl bg-muted/20 border border-border/50">
                                <span className="text-xs font-bold">Status</span>
                                <span className="text-xs font-semibold text-primary capitalize">{project.status}</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Edit Dialog */}
            <AnimatePresence>
                {isEditOpen && (
                    <EditProjectDialog isOpen={isEditOpen}
                        onClose={() => setIsEditOpen(false)}
                        project={project}
                    />
                )}
            </AnimatePresence>

            {/* Post Update Dialog */}
            <Dialog open={isPostUpdateOpen} onOpenChange={(open) => { setIsPostUpdateOpen(open); if (!open) setUpdateMessage(""); }}>
                <DialogContent className="sm:max-w-lg rounded-[2rem] border-border/50">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <History className="w-5 h-5 text-primary" /> Post Status Update
                        </DialogTitle>
                        <DialogDescription>Share a progress update with the project team.</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <Textarea 
                            placeholder="What's the latest update on this project?"
                            className="min-h-[120px] rounded-xl resize-none"
                            value={updateMessage}
                            onChange={(e) => setUpdateMessage(e.target.value)}
                        />
                    </div>
                    <DialogFooter>
                        <Button variant="ghost" className="rounded-xl" onClick={() => setIsPostUpdateOpen(false)}>Cancel</Button>
                        <Button className="rounded-xl gap-2" onClick={handlePostUpdate} disabled={!updateMessage.trim() || isPostingUpdate}>
                            <Send className="w-4 h-4" />{isPostingUpdate ? "Posting..." : "Post Update"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Revision Request Dialog */}
            <Dialog open={isRevisionDialogOpen} onOpenChange={(open) => { setIsRevisionDialogOpen(open); if (!open) setRevisionDescription(""); }}>
                <DialogContent className="sm:max-w-lg rounded-[2rem] border-border/50">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <History className="w-5 h-5 text-amber-500" /> Request Revision
                        </DialogTitle>
                        <DialogDescription>Describe what changes or fixes you need for the current deliverable.</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <Textarea
                            placeholder="Describe the revision needed. Be specific about what should be changed or improved..."
                            className="min-h-[150px] rounded-xl resize-none"
                            value={revisionDescription}
                            onChange={(e) => setRevisionDescription(e.target.value)}
                        />
                        <p className="text-xs text-muted-foreground">
                            Your project status will be updated to &quot;Review&quot; once submitted.
                        </p>
                    </div>
                    <DialogFooter>
                        <Button variant="ghost" className="rounded-xl" onClick={() => setIsRevisionDialogOpen(false)}>Cancel</Button>
                        <Button
                            className="rounded-xl gap-2 bg-amber-500 hover:bg-amber-600"
                            onClick={handleSubmitRevision}
                            disabled={!revisionDescription.trim()}
                        >
                            <History className="w-4 h-4" /> Submit Revision Request
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Dialog */}
            <AnimatePresence>
                {isDeleteOpen && (
                    <DeleteDialog isOpen={isDeleteOpen}
                        onClose={() => setIsDeleteOpen(false)}
                        onConfirm={handleDelete}
                        projectTitle={project.title}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}
