"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { useSupport } from "@/hooks/useSupport";
import { Loader2 } from "lucide-react";

interface ReportIssueDialogProps {
    isOpen: boolean;
    onClose: () => void;
    orderId: string;
}

export function ReportIssueDialog({ isOpen, onClose, orderId }: ReportIssueDialogProps) {
    const [issueType, setIssueType] = useState("");
    const [description, setDescription] = useState("");
    const { createTicket, isCreating } = useSupport();

    const handleSubmit = () => {
        if (!issueType || !description) {
            toast.error("Please fill in all fields");
            return;
        }

        createTicket({
            subject: `Issue with Order #${orderId.substring(0, 8)}: ${issueType}`,
            category: "Order Issue",
            priority: "high",
            description: `Order ID: ${orderId}\nIssue Type: ${issueType}\n\nDescription:\n${description}`
        }, {
            onSuccess: () => {
                toast.success("Support ticket created successfully");
                onClose();
                setIssueType("");
                setDescription("");
            },
            onError: (error) => {
                toast.error("Failed to create ticket: " + error.message);
            }
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Report an Issue</DialogTitle>
                    <DialogDescription>
                        Submit a ticket for Order #{orderId.substring(0, 8)}. Our support team will review it shortly.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="issue-type">Issue Type</Label>
                        <Select onValueChange={setIssueType} value={issueType}>
                            <SelectTrigger id="issue-type">
                                <SelectValue placeholder="Select issue type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="missing-items">Missing Items</SelectItem>
                                <SelectItem value="damaged-items">Damaged/Defective</SelectItem>
                                <SelectItem value="wrong-items">Wrong Items Received</SelectItem>
                                <SelectItem value="delivery-delay">Delivery Delay</SelectItem>
                                <SelectItem value="billing-issue">Billing/Payment Issue</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            placeholder="Please describe the issue in detail..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="min-h-[100px]"
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose} disabled={isCreating}>Cancel</Button>
                    <Button onClick={handleSubmit} disabled={isCreating}>
                        {isCreating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Submit Ticket
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
