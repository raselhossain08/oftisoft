/**
 * Blog Content Store
 * Manages all blog related content:
 * - Featured Posts (Header)
 * - Blog Posts (List/Grid)
 * - Categories
 * - Popular Posts
 * - Authors
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

// Types
export interface BlogCategory {
    id: string;
    label: string;
    slug: string;
    icon?: string; // Lucide icon name
    iconImage?: string; // Image icon URL
}

export interface Author {
    id: string;
    name: string;
    role: string;
    avatar: string;
    bio?: string;
    initials: string;
    stats?: { label: string; value: string }[];
    tags?: string[];
    socials?: { twitter?: string; linkedin?: string; github?: string; website?: string };
}

export interface BlogPost {
    id: string;
    slug: string;
    title: string;
    excerpt: string;
    content?: string; // HTML or Markdown content
    coverImage: string;
    category: string; // Category ID
    authorId: string;
    date: string;
    readTime: string;
    views: string;
    featured: boolean;
    popularResult?: boolean; // If true, shows in popular list manually
    popularRank?: string; // "01", "02" etc.
    gradient?: string; // For card backgrounds
    videoUrl?: string; // For hero video or content video
    status: 'draft' | 'published';
}

export interface BlogPageContent {
    hero: {
        title: string;
        subtitle: string;
    };
    categories: BlogCategory[];
    posts: BlogPost[];
    authors: Author[];
    lastUpdated: string;
}

interface BlogContentState {
    content: BlogPageContent | null;
    isLoading: boolean;
    isSaving: boolean;
    error: string | null;

    // Actions
    setContent: (content: BlogPageContent) => void;
    updateHero: (hero: Partial<BlogPageContent['hero']>) => void;

    // Post Actions
    addPost: (post: BlogPost) => void;
    updatePost: (id: string, data: Partial<BlogPost>) => void;
    deletePost: (id: string) => void;

    // Category Actions
    addCategory: (category: BlogCategory) => void;
    updateCategory: (id: string, data: Partial<BlogCategory>) => void;
    deleteCategory: (id: string) => void;

    // Author Actions
    addAuthor: (author: Author) => void;
    updateAuthor: (id: string, data: Partial<Author>) => void;
    deleteAuthor: (id: string) => void;

    reset: () => void;
}

const defaultContent: BlogPageContent = {
    hero: {
        title: "Latest Insights",
        subtitle: "Discover the latest trends, tutorials, and deep dives from our engineering team."
    },
    categories: [
        { id: "all", label: "All View", slug: "all", icon: "Grid" },
        { id: "web", label: "Engineering", slug: "engineering", icon: "Code" },
        { id: "mobile", label: "Mobile", slug: "mobile", icon: "Smartphone" },
        { id: "ai", label: "AI & Data", slug: "ai-data", icon: "Brain" },
        { id: "devops", label: "DevOps", slug: "devops", icon: "Cloud" },
        { id: "business", label: "Growth", slug: "growth", icon: "Briefcase" },
    ],
    authors: [
        {
            id: "auth-1",
            name: "Rasel Hossain",
            role: "Software Engineer",
            avatar: "",
            initials: "RH",
            bio: "Passionate software engineer with 6+ years of experience helping startups and enterprises scale their digital products.",
            stats: [
                { label: "Articles", value: "150+" },
                { label: "Readers", value: "50k+" },
                { label: "Followers", value: "12k+" },
            ],
            tags: ["Architecture", "AI", "Frontend"],
            socials: { twitter: "#", linkedin: "#", github: "#" }
        },
        {
            id: "auth-2",
            name: "Sarah Jenkins",
            role: "Product Designer",
            avatar: "",
            initials: "SJ",
            bio: "Creative force behind intuitive digital experiences. Specializing in micro-interactions, accessibility, and design systems.",
            stats: [
                { label: "Designs", value: "80+" },
                { label: "Awards", value: "12" },
                { label: "Students", value: "5k+" },
            ],
            tags: ["UI/UX", "Figma", "Design Systems"],
            socials: { twitter: "#", linkedin: "#", website: "#" }
        },
        {
            id: "auth-3",
            name: "David Chen",
            role: "Cloud Architect",
            avatar: "",
            initials: "DC",
            bio: "Architecting scalable cloud solutions and optimizing database performance. Deeply interested in distributed systems.",
            stats: [
                { label: "APIs", value: "200+" },
                { label: "Uptime", value: "99.9%" },
                { label: "Contribs", value: "1.2k" },
            ],
            tags: ["Backend", "Cloud", "DevOps"],
            socials: { github: "#", linkedin: "#", website: "#" }
        },
    ],
    posts: [
        // Featured Posts
        {
            id: "post-1",
            slug: "future-web-dev-ai",
            title: "The Future of Web Development: How AI is Changing the Landscape",
            excerpt: "Why traditional UI components are being replaced by generative interfaces that adapt to user intent in real-time.",
            content: "",
            coverImage: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=2665&auto=format&fit=crop",
            category: "ai",
            authorId: "auth-1",
            date: "Oct 24, 2026",
            readTime: "5 min read",
            views: "125k",
            featured: true,
            status: "published",
            gradient: "from-blue-600 to-violet-600"
        },
        {
            id: "post-2",
            slug: "fluid-ui-design",
            title: "Creating Fluid User Interfaces with Modern CSS Tech",
            excerpt: "Advanced techniques for creating responsive, animation-driven interfaces that feel alive.",
            content: "",
            coverImage: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070",
            category: "web",
            authorId: "auth-2",
            date: "Oct 20, 2026",
            readTime: "7 min read",
            views: "98k",
            featured: true,
            status: "published",
            gradient: "from-emerald-500 to-teal-500"
        },
        // Standard Posts
        {
            id: "post-3",
            slug: "nextjs-15-server-actions",
            title: "Mastering Next.js 15 Server Actions",
            excerpt: "Learn how to build type-safe mutations without API routes in the modern React ecosystem.",
            content: "",
            coverImage: "",
            category: "web",
            authorId: "auth-1",
            date: "Dec 10, 2025",
            readTime: "8 min",
            views: "45k",
            featured: false,
            status: "published"
        },
        {
            id: "post-4",
            slug: "rise-of-edge-computing",
            title: "The Rise of Edge Computing",
            excerpt: "Why moving logic closer to the user is the future of performance and low latency.",
            content: "",
            coverImage: "",
            category: "devops",
            authorId: "auth-3",
            date: "Nov 28, 2025",
            readTime: "12 min",
            views: "32k",
            featured: false,
            status: "published"
        },
        // Popular Posts
        {
            id: "pop-1",
            slug: "10-ai-tools-2026",
            title: "10 AI Tools Every Developer Needs in 2026",
            excerpt: "A curated list of productivity boosting AI tools for modern software engineers.",
            content: "",
            coverImage: "",
            category: "ai",
            authorId: "auth-1",
            date: "Oct 15, 2026",
            readTime: "8 min",
            views: "125k",
            featured: false,
            popularResult: true,
            popularRank: "01",
            gradient: "from-purple-600 to-indigo-600",
            status: "published"
        },
        {
            id: "pop-2",
            slug: "nextjs-vs-remix",
            title: "Next.js 15 vs Remix: The Ultimate Comparison",
            excerpt: "Which framework should you choose for your next big project? We break down the pros and cons.",
            content: "",
            coverImage: "",
            category: "web",
            authorId: "auth-1",
            date: "Sep 20, 2026",
            readTime: "12 min",
            views: "98k",
            featured: false,
            popularResult: true,
            popularRank: "02",
            gradient: "from-blue-600 to-cyan-600",
            status: "published"
        }
    ],
    lastUpdated: new Date().toISOString()
};

export const useBlogContentStore = create<BlogContentState>()(
    persist(
        immer((set) => ({
            content: defaultContent,
            isLoading: false,
            isSaving: false,
            error: null,

            setContent: (content) => set({ content: { ...content, lastUpdated: new Date().toISOString() } }),

            updateHero: (hero) => set((state) => {
                if (state.content) {
                    state.content.hero = { ...state.content.hero, ...hero };
                    state.content.lastUpdated = new Date().toISOString();
                }
            }),

            addPost: (post) => set((state) => {
                if (state.content) {
                    state.content.posts.push(post);
                    state.content.lastUpdated = new Date().toISOString();
                }
            }),

            updatePost: (id, data) => set((state) => {
                if (state.content) {
                    const index = state.content.posts.findIndex(p => p.id === id);
                    if (index !== -1) {
                        state.content.posts[index] = { ...state.content.posts[index], ...data };
                        state.content.lastUpdated = new Date().toISOString();
                    }
                }
            }),

            deletePost: (id) => set((state) => {
                if (state.content) {
                    state.content.posts = state.content.posts.filter(p => p.id !== id);
                    state.content.lastUpdated = new Date().toISOString();
                }
            }),

            addCategory: (category) => set((state) => {
                if (state.content) {
                    state.content.categories.push(category);
                    state.content.lastUpdated = new Date().toISOString();
                }
            }),

            updateCategory: (id, data) => set((state) => {
                if (state.content) {
                    const index = state.content.categories.findIndex(c => c.id === id);
                    if (index !== -1) {
                        state.content.categories[index] = { ...state.content.categories[index], ...data };
                        state.content.lastUpdated = new Date().toISOString();
                    }
                }
            }),

            deleteCategory: (id) => set((state) => {
                if (state.content) {
                    state.content.categories = state.content.categories.filter(c => c.id !== id);
                    state.content.lastUpdated = new Date().toISOString();
                }
            }),

            addAuthor: (author) => set((state) => {
                if (state.content) {
                    state.content.authors.push(author);
                    state.content.lastUpdated = new Date().toISOString();
                }
            }),

            updateAuthor: (id, data) => set((state) => {
                if (state.content) {
                    const index = state.content.authors.findIndex(a => a.id === id);
                    if (index !== -1) {
                        state.content.authors[index] = { ...state.content.authors[index], ...data };
                        state.content.lastUpdated = new Date().toISOString();
                    }
                }
            }),

            deleteAuthor: (id) => set((state) => {
                if (state.content) {
                    state.content.authors = state.content.authors.filter(a => a.id !== id);
                    state.content.lastUpdated = new Date().toISOString();
                }
            }),

            reset: () => set({ content: defaultContent })
        })),
        {
            name: 'blog-content-storage',
            storage: createJSONStorage(() => localStorage),
        }
    )
);
