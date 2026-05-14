"use client";

import { useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { postsAPI } from "@/lib/api";
import { useBlogContentStore, type BlogPageContent, type BlogPost, type BlogCategory, type Author } from "@/lib/store/blog-content";
import { format } from "date-fns";
import FeaturedPost from "@/components/sections/blog/featured-post";
import BlogList from "@/components/sections/blog/blog-list";
import PopularPosts from "@/components/sections/blog/popular-posts";
import Newsletter from "@/components/sections/blog/newsletter";
import AuthorSpotlight from "@/components/sections/blog/author-spotlight";
import CTA from "@/components/sections/cta";

export default function BlogPage() {
    const setContent = useBlogContentStore((state) => state.setContent);

    const { data, isLoading } = useQuery({
        queryKey: ["blog-posts"],
        queryFn: () => postsAPI.getPosts({ status: "published", limit: 50 }),
    });

    const mappedContent = useMemo<BlogPageContent | null>(() => {
        if (!data?.posts?.length) return null;

        const apiPosts = data.posts;

        const categories: BlogCategory[] = [];
        const categoryMap = new Map<string, BlogCategory>();
        const authors: Author[] = [];
        const authorMap = new Map<string, Author>();

        const posts: BlogPost[] = apiPosts.map((p, i) => {
            const cat = p.category;
            if (cat && !categoryMap.has(cat.id)) {
                const blogCat: BlogCategory = {
                    id: cat.id,
                    label: cat.name,
                    slug: cat.slug,
                };
                categoryMap.set(cat.id, blogCat);
                categories.push(blogCat);
            }

            const auth = p.author;
            if (auth && !authorMap.has(auth.id)) {
                const name = auth.name || "";
                const blogAuthor: Author = {
                    id: auth.id,
                    name,
                    initials: name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2),
                    role: auth.jobTitle || "Author",
                    avatar: auth.avatarUrl || "",
                    bio: auth.bio || "",
                };
                authorMap.set(auth.id, blogAuthor);
                authors.push(blogAuthor);
            }

            const publishedDate = p.publishedAt || p.createdAt;

            return {
                id: p.id,
                slug: p.slug,
                title: p.title,
                excerpt: p.excerpt || "",
                content: p.content || "",
                coverImage: p.featuredImage || "",
                category: p.categoryId || "",
                authorId: p.authorId,
                date: publishedDate ? format(new Date(publishedDate), "MMM d, yyyy") : "",
                readTime: `${p.readTime} min read`,
                views: p.views > 1000 ? `${(p.views / 1000).toFixed(1)}k` : String(p.views),
                featured: p.isFeatured,
                popularResult: p.popularResult,
                popularRank: p.popularRank,
                gradient: p.gradient,
                status: "published" as const,
            };
        });

        return {
            hero: {
                title: "Blog",
                subtitle: "Latest insights and tutorials",
            },
            categories,
            posts,
            authors,
            lastUpdated: new Date().toISOString(),
        };
    }, [data]);

    useEffect(() => {
        if (mappedContent) {
            setContent(mappedContent);
        }
    }, [mappedContent, setContent]);

    if (isLoading && !mappedContent) {
        return (
            <div className="fixed inset-0 bg-background flex items-center justify-center z-[100]">
                <div className="text-primary font-semibold animate-pulse tracking-[0.3em]">
                    Loading posts...
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
