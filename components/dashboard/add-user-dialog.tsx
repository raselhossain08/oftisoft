"use client";

import { useState } from "react";
import { 
    Dialog, 
    DialogContent, 
    DialogHeader, 
    DialogTitle, 
    DialogDescription, 
    DialogFooter 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
    Select, 
    SelectContent, 
    SelectItem, 
    SelectTrigger, 
    SelectValue 
} from "@/components/ui/select";
import { UserPlus, Loader2 } from "lucide-react";
import { adminUserAPI } from "@/lib/api";
import { toast } from "sonner";

interface AddUserDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess: () => void;
}

export function AddUserDialog({ open, onOpenChange, onSuccess }: AddUserDialogProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        role: "User",
        phone: ""
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await adminUserAPI.createUser(formData);
            toast.success("User created successfully");
            onSuccess();
            onOpenChange(false);
            setFormData({
                name: "",
                email: "",
                password: "",
                role: "User",
                phone: ""
            });
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to create user");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px] rounded-2xl border-border/50">
                <DialogHeader>
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                        <UserPlus className="w-6 h-6 text-primary" />
                    </div>
                    <DialogTitle className="text-2xl font-bold tracking-tight">Add New User</DialogTitle>
                    <DialogDescription>
                        Create a new user account and assign them a role.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input 
                            id="name" 
                            placeholder="John Doe" 
                            className="rounded-xl"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input 
                            id="email" 
                            type="email" 
                            placeholder="john@example.com" 
                            className="rounded-xl"
                            required
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="password">Initial Password</Label>
                        <Input 
                            id="password" 
                            type="password" 
                            placeholder="••••••••" 
                            className="rounded-xl"
                            required
                            minLength={8}
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="role">Role</Label>
                            <Select 
                                value={formData.role} 
                                onValueChange={(value) => setFormData({ ...formData, role: value })}
                            >
                                <SelectTrigger className="rounded-xl">
                                    <SelectValue placeholder="Select role" />
                                </SelectTrigger>
                                <SelectContent className="rounded-xl">
                                    <SelectItem value="User">User</SelectItem>
                                    <SelectItem value="Support">Support</SelectItem>
                                    <SelectItem value="Editor">Editor</SelectItem>
                                    <SelectItem value="Admin">Admin</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="phone">Phone (Optional)</Label>
                            <Input 
                                id="phone" 
                                placeholder="+1..." 
                                className="rounded-xl"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            />
                        </div>
                    </div>
                    <DialogFooter className="pt-4">
                        <Button 
                            type="button" 
                            variant="outline" 
                            className="rounded-xl"
                            onClick={() => onOpenChange(false)}
                        >
                            Cancel
                        </Button>
                        <Button 
                            type="submit" 
                            className="rounded-xl px-8 shadow-lg shadow-primary/20"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Creating...
                                </>
                            ) : (
                                "Create User"
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
