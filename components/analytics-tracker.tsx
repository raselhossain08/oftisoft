"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, Suspense } from "react";
import { analyticsAPI } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";

function TrackerContent() {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const { user } = useAuth();

    useEffect(() => {
        const track = async () => {
            try {
                // Handle Referral Tracking
                const ref = searchParams.get('ref');
                if (ref) {
                    localStorage.setItem('ofti_referral', ref);
                }

                await analyticsAPI.trackVisit({
                    page: pathname,
                    referrer: document.referrer || undefined,
                    userId: user?.id
                });
            } catch (err) {
                // Silent error for tracking
            }
        };

        track();
    }, [pathname, searchParams]);

    return null;
}

export function AnalyticsTracker() {
    return (
        <Suspense fallback={null}>
            <TrackerContent />
        </Suspense>
    );
}
