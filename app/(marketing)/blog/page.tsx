"use client";
import { useEffect } from "react";
import { usePageContent } from "@/hooks/usePageContent";
import { useBlogContentStore } from "@/lib/store/blog-content";
import FeaturedPost from "@/components/sections/blog/featured-post";
import BlogList from "@/components/sections/blog/blog-list";
import PopularPosts from "@/components/sections/blog/popular-posts";
import Newsletter from "@/components/sections/blog/newsletter";
import AuthorSpotlight from "@/components/sections/blog/author-spotlight";
import CTA from "@/components/sections/cta";

export default function BlogPage() {
    const { pageContent, isLoading } = usePageContent('blog');
    const setContent = useBlogContentStore((state) => state.setContent);

    useEffect(() => {
        if (pageContent?.content) {
            setContent(pageContent.content);
        }
    }, [pageContent, setContent]);

    if (isLoading && !pageContent) {
        return (
            <div className="fixed inset-0 bg-background flex items-center justify-center z-[100]">
                <div className="text-primary font-black italic animate-pulse tracking-[0.3em] uppercase">
                    Initializing Editorial Node...
                </div>
            </div>
        );
    }

    return (
        <main className="flex min-h-screen flex-col bg-background text-foreground overflow-hidden">
            <FeaturedPost />
            <PopularPosts />
            <BlogList />
            <Newsletter />
            <AuthorSpotlight />
            <CTA />
        </main>
    );
}

