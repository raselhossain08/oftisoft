"use client";

import { useEffect } from "react";
import { usePageContent } from "@/hooks/usePageContent";
import ServicesOverview from "@/components/sections/services-page/services-overview";
import ServiceComparison from "@/components/sections/services-page/service-comparison";
import ServicePackages from "@/components/sections/services-page/service-packages";
import ServiceProcess from "@/components/sections/services-page/service-process";
import ServiceFAQ from "@/components/sections/services-page/service-faq";
import ServiceTechStack from "@/components/sections/services-page/service-tech-stack";
import CTA from "@/components/sections/cta";
import { useServicesContentStore } from "@/lib/store/services-content";

export default function ServicesPage() {
    const { pageContent, isLoading } = usePageContent('services');
    const setContent = useServicesContentStore((state) => state.setContent);

    useEffect(() => {
        if (pageContent?.content) {
            setContent(pageContent.content);
        }
    }, [pageContent, setContent]);

    if (isLoading && !pageContent) {
        return (
            <div className="fixed inset-0 bg-[#020202] flex items-center justify-center z-[100]">
                <div className="text-primary font-black italic animate-pulse tracking-[0.3em] uppercase">
                    Configuring Service Modules...
                </div>
            </div>
        );
    }

    return (
        <main className="flex min-h-screen flex-col bg-background text-foreground overflow-hidden">
            <ServicesOverview />
            <ServiceComparison />
            <ServicePackages />
            <ServiceProcess />
            <ServiceTechStack />
            <ServiceFAQ />
            <CTA />
        </main>
    );
}
