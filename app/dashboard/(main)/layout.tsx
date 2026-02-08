"use client";

import { DashboardProvider } from "@/lib/dashboard-context";
import Sidebar from "@/components/dashboard/sidebar";
import Header from "@/components/dashboard/header";
import BottomNav from "@/components/dashboard/bottom-nav";
import OnboardingTutorial from "@/components/dashboard/onboarding";
import { useProtectedRoute } from "@/hooks/useProtectedRoute";
import { Loader2 } from "lucide-react";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { isAuthenticated, isLoading } = useProtectedRoute();

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!isAuthenticated) {
        return null;
    }

    return (
        <DashboardProvider>
        <div className="flex min-h-screen bg-background text-foreground font-sans">
            <Sidebar />
            <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
                <Header />
                <main className="flex-1 overflow-y-auto bg-muted/10 p-4 md:p-8 pb-32 md:pb-8">
                    {children}
                </main>
                <BottomNav />
            </div>
            <OnboardingTutorial />
        </div>
        </DashboardProvider>
    );
}
