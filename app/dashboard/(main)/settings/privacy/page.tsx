"use client";

import { useState } from "react";
import { Shield, Download, Trash2, AlertTriangle, Loader2, CheckCircle2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { authAPI } from "@/lib/api";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function PrivacySettings() {
    const [isExporting, setIsExporting] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [deletionRequested, setDeletionRequested] = useState(false);

    const handleExportData = async () => {
        setIsExporting(true);
        try {
            const blob = await authAPI.exportData();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `account-export-${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
            toast.success("Data exported successfully");
        } catch {
            toast.error("Failed to export data");
        } finally {
            setIsExporting(false);
        }
    };

    const handleDeleteAccount = async () => {
        setIsDeleting(true);
        try {
            await authAPI.deleteAccount();
            setDeletionRequested(true);
            setShowDeleteDialog(false);
            toast.success("Account deletion requested", {
                description: "Your account will be permanently deleted after 30 days. You can cancel this within the grace period."
            });
        } catch {
            toast.error("Failed to request account deletion");
        } finally {
            setIsDeleting(false);
        }
    };

    const handleCancelDeletion = async () => {
        try {
            await authAPI.cancelDeletion();
            setDeletionRequested(false);
            toast.success("Deletion request cancelled");
        } catch {
            toast.error("Failed to cancel deletion request");
        }
    };

    return (
        <div className="space-y-12 max-w-4xl mx-auto pb-20">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-border/50 pb-10">
                <div>
                    <h2 className="text-3xl md:text-3xl font-semibold bg-gradient-to-r from-foreground via-foreground to-foreground/40 bg-clip-text text-transparent">
                        Data & Privacy
                    </h2>
                    <p className="text-muted-foreground font-medium mt-2">Manage your data, export information, or close your account.</p>
                </div>
                <Badge variant="outline" className="h-8 px-4 border-primary/20 bg-primary/5 text-primary font-semibold uppercase text-sm rounded-full">
                    GDPR Compliant
                </Badge>
            </div>

            {/* Data Export */}
            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                        <Download className="w-5 h-5" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold">Export Your Data</h3>
                        <p className="text-sm text-muted-foreground">Download all your personal data in a portable format.</p>
                    </div>
                </div>
                <Card className="border-border/50 rounded-3xl">
                    <CardContent className="p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                        <div className="space-y-2">
                            <p className="text-sm font-semibold">Request a copy of your data</p>
                            <p className="text-xs text-muted-foreground">Includes your profile, orders, downloads, messages, and activity history.</p>
                        </div>
                        <Button
                            onClick={handleExportData}
                            disabled={isExporting}
                            className="rounded-xl gap-2 shrink-0"
                        >
                            {isExporting ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <Download className="w-4 h-4" />
                            )}
                            {isExporting ? "Exporting..." : "Export Data"}
                        </Button>
                    </CardContent>
                </Card>
            </div>

            {/* Danger Zone */}
            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500">
                        <Trash2 className="w-5 h-5" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-red-500">Danger Zone</h3>
                        <p className="text-sm text-muted-foreground">Irreversible actions related to your account.</p>
                    </div>
                </div>
                <Card className="border-red-500/20 rounded-3xl bg-red-500/[0.02]">
                    <CardContent className="p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                        {deletionRequested ? (
                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 w-full">
                                <div className="flex items-center gap-3">
                                    <CheckCircle2 className="w-8 h-8 text-orange-500" />
                                    <div>
                                        <p className="font-semibold">Deletion Scheduled</p>
                                        <p className="text-sm text-muted-foreground">Your account is scheduled for permanent deletion after 30 days.</p>
                                    </div>
                                </div>
                                <Button
                                    variant="outline"
                                    onClick={handleCancelDeletion}
                                    className="rounded-xl gap-2 shrink-0 border-orange-500/20 text-orange-500 hover:bg-orange-500/10"
                                >
                                    <RefreshCw className="w-4 h-4" />
                                    Cancel Deletion
                                </Button>
                            </div>
                        ) : (
                            <>
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center text-red-500 shrink-0">
                                        <AlertTriangle className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="font-semibold">Delete Account</p>
                                        <p className="text-sm text-muted-foreground">
                                            Permanently delete your account and all associated data. This action has a 30-day grace period.
                                        </p>
                                    </div>
                                </div>
                                <Button
                                    variant="outline"
                                    onClick={() => setShowDeleteDialog(true)}
                                    className="rounded-xl gap-2 shrink-0 border-red-500/20 text-red-500 hover:bg-red-500/10"
                                >
                                    <Trash2 className="w-4 h-4" />
                                    Delete Account
                                </Button>
                            </>
                        )}
                    </CardContent>
                </Card>
            </div>

            <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <AlertDialogContent className="rounded-2xl border-red-500/20 max-w-md">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="flex items-center gap-2 text-red-500">
                            <AlertTriangle className="w-5 h-5" /> Delete your account?
                        </AlertDialogTitle>
                        <AlertDialogDescription className="space-y-3">
                            <p>This will schedule your account for permanent deletion. During the 30-day grace period:</p>
                            <ul className="text-sm space-y-1 list-disc pl-4">
                                <li>You can log in and cancel the deletion</li>
                                <li>Your data will be anonymized</li>
                                <li>Active subscriptions will be cancelled</li>
                                <li>After 30 days, all data is permanently removed</li>
                            </ul>
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="gap-2">
                        <AlertDialogCancel className="rounded-xl font-bold">Keep Account</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDeleteAccount}
                            disabled={isDeleting}
                            className="rounded-xl font-bold bg-red-500 hover:bg-red-600"
                        >
                            {isDeleting ? "Processing..." : "Delete Account"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* GDPR Info */}
            <Card className="rounded-[48px] bg-primary/[0.03] border border-primary/10 p-8 md:p-12">
                <CardContent className="p-0 flex flex-col sm:flex-row items-start gap-6">
                    <div className="w-16 h-16 rounded-3xl bg-background border border-primary/20 flex items-center justify-center text-primary shadow-xl shrink-0">
                        <Shield className="w-8 h-8" />
                    </div>
                    <div className="space-y-2">
                        <h3 className="font-semibold text-xl">Your Privacy Rights</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl">
                            You have the right to access, rectify, and erase your personal data in accordance with GDPR and CCPA regulations.
                            Data exports include all personally identifiable information stored on our platform. Account deletion anonymizes
                            your data within 30 days and permanently removes it thereafter.
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}