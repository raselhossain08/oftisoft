"use client";

import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { ArrowLeft, Calendar, Clock, Share2, Twitter, Linkedin, Facebook, Bookmark, ChevronRight, User, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import Newsletter from "@/components/sections/blog/newsletter";

// Swiper for Related Posts
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

import { useBlogContentStore } from "@/lib/store/blog-content";

// Remove static mock data


export default function BlogPostPage({ params }: { params: { slug: string } }) {
    const { content } = useBlogContentStore();
    const { scrollYProgress } = useScroll();
    const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1]);
    const scrollRef = useRef<HTMLDivElement>(null);
    const [isMounted, setIsMounted] = useState(false);

    // Find post
    // Note: In real app, you might want to fetch by ID or slug physically if using SSR
    // Here we use client store.
    
    // We need to use `slug` to find the post. If `content` is not ready, we wait.
    // Since `slug` might come as ID or actual slug, let's try finding by both.
    const post = content?.posts.find(p => p.id === params.slug || p.slug === params.slug);
    const author = post ? content?.authors.find(a => a.id === post.authorId) : null;
    const category = post ? content?.categories.find(c => c.id === post.category) : null;
    
    // Get related posts (same category, excluding current)
    const relatedPosts = content?.posts.filter(p => p.category === post?.category && p.id !== post?.id).slice(0, 3) || [];

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) return null;

    if (!post) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-4xl font-bold mb-4">Post Not Found</h1>
                    <Link href="/blog">
                        <span className="text-primary hover:underline">Back to Blog</span>
                    </Link>
                </div>
            </div>
        );
    }

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) return null;

    return (
        <main className="min-h-screen bg-background relative overflow-hidden" ref={scrollRef}>
            
            {/* Reading Progress Bar - Top Sticky */}
            <motion.div 
                className="fixed top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-primary to-purple-600 z-[60] origin-left shadow-glow"
                style={{ scaleX }}
            />

            {/* Navbar / Back */}
            <nav className="fixed top-0 left-0 right-0 z-50 p-6 flex justify-between items-center pointer-events-none">
                <Link 
                    href="/blog"
                    className="pointer-events-auto w-12 h-12 rounded-full bg-background/80 backdrop-blur-md border border-border flex items-center justify-center hover:bg-muted transition-all group shadow-lg"
                >
                    <ArrowLeft className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                </Link>
                {/* Share Button Mobile */}
                <button className="pointer-events-auto lg:hidden w-12 h-12 rounded-full bg-background/80 backdrop-blur-md border border-border flex items-center justify-center text-muted-foreground hover:text-primary transition-colors">
                    <Share2 className="w-5 h-5" />
                </button>
            </nav>

            {/* Immersive Hero */}
            <section className="relative h-[85vh] min-h-[600px] flex items-end justify-center pb-24 overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <div className="relative w-full h-full"> 
                        {/* Fallback Image or Post Image */}
                        <div 
                            className="absolute inset-0 bg-cover bg-center"
                            style={{ backgroundImage: `url('${post.coverImage || '/placeholder-image.jpg'}')` }}
                        />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
                    <div className="absolute inset-0 bg-black/30" />
                </div>

                <div className="container px-4 mx-auto relative z-10 text-center max-w-5xl">
                    <motion.div 
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                         <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white text-sm font-bold uppercase tracking-wider mb-8 shadow-xl">
                            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                            <span>{category?.label || "Article"}</span>
                        </div>

                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white mb-8 leading-tight tracking-tight drop-shadow-2xl">
                            {post.title}
                        </h1>

                        <div className="flex flex-wrap items-center justify-center gap-6 text-white/90 text-sm font-medium">
                            <div className="flex items-center gap-3 bg-black/20 backdrop-blur-sm px-4 py-2 rounded-full border border-white/10">
                                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                                    <User className="w-4 h-4" />
                                </div>
                                <div className="text-left">
                                    <div className="text-xs opacity-70 uppercase tracking-wider">Author</div>
                                    <div>{author?.name || "Unknown Author"}</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 bg-black/20 backdrop-blur-sm px-4 py-2 rounded-full border border-white/10">
                                <Calendar className="w-4 h-4 opacity-70" />
                                <span>{post.date}</span>
                            </div>
                            <div className="flex items-center gap-3 bg-black/20 backdrop-blur-sm px-4 py-2 rounded-full border border-white/10">
                                <Clock className="w-4 h-4 opacity-70" />
                                <span>{post.readTime}</span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Content Body */}
            <section className="py-16 md:py-24 relative">
                 {/* Background Grain */}
                 <div className="absolute inset-0 opacity-[0.03] bg-grain mix-blend-overlay pointer-events-none" />

                <div className="container px-4 mx-auto">
                    <div className="flex flex-col lg:flex-row gap-16 max-w-7xl mx-auto">
                        
                        {/* Social Share - Sticky Sidebar (Desktop) */}
                        <aside className="lg:w-20 hidden lg:flex flex-col gap-6 sticky top-32 h-fit items-center">
                             <div className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground vertical-text rotate-180 mb-4">Share Project</div>
                            <ShareButton icon={Twitter} color="hover:text-[#1DA1F2] hover:border-[#1DA1F2]" />
                            <ShareButton icon={Linkedin} color="hover:text-[#0A66C2] hover:border-[#0A66C2]" />
                            <ShareButton icon={Facebook} color="hover:text-[#1877F2] hover:border-[#1877F2]" />
                            <div className="h-12 w-px bg-border my-2" />
                            <ShareButton icon={Bookmark} color="hover:text-primary hover:border-primary" />
                        </aside>

                        {/* Article Content */}
                        <article className="flex-1 max-w-3xl mx-auto">
                            <motion.div 
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5 }}
                                className="prose prose-lg md:prose-xl dark:prose-invert prose-headings:font-bold prose-headings:tracking-tight prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-img:rounded-[2rem] prose-img:shadow-2xl max-w-none"
                            >
                                <p className="lead text-2xl md:text-3xl text-foreground font-light mb-12 border-l-4 border-primary pl-6 italic">
                                    {post.excerpt}
                                </p>
                                <div dangerouslySetInnerHTML={{ __html: post.content || "<p>No content available.</p>" }} />
                            </motion.div>

                            {/* Tags */}
                            <div className="mt-16 pt-10 border-t border-border">
                                <div className="flex items-center gap-4 mb-6">
                                    <span className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Tags:</span>
                                    <div className="flex flex-wrap gap-2">
                                        {/* Mock tags for now as store doesn't have tags yet */}
                                        {['Tech', category?.label || 'Blog'].map(tag => (
                                            <span key={tag} className="px-4 py-2 bg-muted/50 border border-border rounded-full text-xs font-bold text-muted-foreground hover:text-primary hover:border-primary transition-all cursor-pointer">
                                                #{tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Author Bio Box */}
                            <div className="mt-12 p-8 rounded-3xl bg-card border border-border flex flex-col md:flex-row items-center md:items-start gap-6 text-center md:text-left">
                                <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center font-bold text-2xl text-muted-foreground border-2 border-border">
                                    {author?.initials || "Au"}
                                </div>
                                <div className="flex-1">
                                    <h4 className="text-lg font-bold text-foreground">Written by {author?.name || "Unknown"}</h4>
                                    <p className="text-sm text-primary font-medium mb-3">{author?.role || "Contributor"}</p>
                                    <p className="text-muted-foreground text-sm leading-relaxed">
                                        {author?.bio || "A passionate contributor to the team."}
                                    </p>
                                </div>
                                <button className="px-6 py-2 rounded-full border border-border font-bold text-sm hover:bg-foreground hover:text-background transition-colors">
                                    Follow
                                </button>
                            </div>
                        </article>

                        {/* Right Sidebar: Table of Contents & Related (Desktop) */}
                         <aside className="lg:w-80 hidden xl:flex flex-col gap-10">
                            <div className="bg-card/50 backdrop-blur-md border border-border rounded-3xl p-8 sticky top-32">
                                <h3 className="font-bold mb-6 flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-primary" />
                                    On this page
                                </h3>
                                <ul className="space-y-4 text-sm text-muted-foreground relative">
                                    {/* Vertical Line */}
                                    <div className="absolute left-0 top-2 bottom-2 w-px bg-border" />
                                    
                                    <li className="pl-4 border-l-2 border-primary text-foreground font-medium cursor-pointer">Introduction</li>
                                    <li className="pl-4 border-l-2 border-transparent hover:border-border cursor-pointer transition-colors">AI-Native Frameworks</li>
                                    <li className="pl-4 border-l-2 border-transparent hover:border-border cursor-pointer transition-colors">Workflow Automation</li>
                                    <li className="pl-4 border-l-2 border-transparent hover:border-border cursor-pointer transition-colors">Key Benefits</li>
                                    <li className="pl-4 border-l-2 border-transparent hover:border-border cursor-pointer transition-colors">Conclusion</li>
                                </ul>
                            </div>
                        </aside>
                    </div>
                </div>
            </section>

            {/* Related Posts Carousel */}
            <section className="py-24 bg-card/30 border-t border-border relative overflow-hidden">
                <div className="container px-4 mx-auto">
                    <div className="flex items-center justify-between mb-12">
                        <h2 className="text-3xl font-bold">Keep Reading</h2>
                         <Link href="/blog" className="hidden md:flex items-center gap-2 text-primary font-bold hover:gap-3 transition-all">
                            View All Posts <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>

                    <Swiper
                        modules={[Autoplay]}
                        spaceBetween={30}
                        slidesPerView={1}
                        breakpoints={{
                            640: { slidesPerView: 2 },
                            1024: { slidesPerView: 3 }
                        }}
                        autoplay={{ delay: 5000, disableOnInteraction: false }}
                    >
                        {relatedPosts.map((related, i) => (
                            <SwiperSlide key={i}>
                                <div className="group cursor-pointer">
                                    <Link href={`/blog/${related.id}`}>
                                        <div className="relative h-64 w-full rounded-2xl overflow-hidden mb-6 bg-muted">
                                            {related.coverImage ? (
                                                  <img 
                                                    src={related.coverImage} 
                                                    alt={related.title} 
                                                    className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110" 
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20" />
                                            )}
                                          
                                            <div className="absolute top-4 left-4 bg-background/80 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                                                {content?.categories.find(c => c.id === related.category)?.label || "Article"}
                                            </div>
                                        </div>
                                        <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors line-clamp-2">{related.title}</h3>
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium group-hover:translate-x-1 transition-transform">
                                            Read Article <ArrowRight className="w-4 h-4" />
                                        </div>
                                    </Link>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            </section>

            <Newsletter />
        </main>
    );
}

function ShareButton({ icon: Icon, color }: { icon: any, color: string }) {
    return (
        <button className={`w-12 h-12 rounded-full border border-border bg-background flex items-center justify-center text-muted-foreground transition-all duration-300 ${color} hover:bg-muted`}>
            <Icon className="w-5 h-5" />
        </button>
    );
}
