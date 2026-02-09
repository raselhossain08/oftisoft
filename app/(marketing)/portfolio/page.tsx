"use client";
import { useEffect } from "react";
import { usePageContent } from "@/hooks/usePageContent";
import PortfolioMain from "@/components/sections/portfolio/portfolio-main";
import SuccessStories from "@/components/sections/portfolio/success-stories";
import TechBreakdown from "@/components/sections/portfolio/tech-breakdown";
import CTA from "@/components/sections/cta";
import { usePortfolioContentStore } from "@/lib/store/portfolio-content";

export default function PortfolioPage() {
    const { pageContent, isLoading } = usePageContent('portfolio');
    const setContent = usePortfolioContentStore((state) => state.setContent);

    useEffect(() => {
        if (pageContent?.content) {
            setContent(pageContent.content);
        }
    }, [pageContent, setContent]);

    if (isLoading && !pageContent) {
        return (
            <div className="fixed inset-0 bg-[#020202] flex items-center justify-center z-[100]">
                <div className="text-primary font-black italic animate-pulse tracking-[0.3em] uppercase">
                    Compiling Case Studies...
                </div>
            </div>
        );
    }

    return (
        <main className="flex min-h-screen flex-col bg-background text-foreground overflow-hidden">
            <PortfolioMain />
            <SuccessStories />
            <TechBreakdown />
            <CTA />
        </main>
    );
}
