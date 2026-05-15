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

type BlogSeedTopic = {
    slug: string;
    title: string;
    excerpt: string;
    category: string;
    authorId: string;
    date: string;
    readTime: string;
    views: string;
    keyword: string;
    audience: string;
    promise: string;
    angle: string;
    checklist: string[];
    coverImage: string;
    gradient: string;
};

const imageByCategory: Record<string, string> = {
    web: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1800&auto=format&fit=crop",
    mobile: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=1800&auto=format&fit=crop",
    ai: "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=1800&auto=format&fit=crop",
    devops: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1800&auto=format&fit=crop",
    business: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?q=80&w=1800&auto=format&fit=crop",
};

const blogTopics: BlogSeedTopic[] = [
    {
        slug: "ai-ready-web-app-architecture-2026",
        title: "AI-Ready Web App Architecture: A 2026 Guide for Product Teams",
        excerpt: "A practical architecture guide for teams adding AI features without slowing down performance, security, or release speed.",
        category: "ai",
        authorId: "auth-1",
        date: "Apr 22, 2026",
        readTime: "11 min read",
        views: "24.8k",
        keyword: "AI-ready web app architecture",
        audience: "founders, CTOs, and product teams",
        promise: "design AI features that are useful, measurable, and safe to ship",
        angle: "treat AI as a product capability, not a decorative widget",
        checklist: ["Map the user job before choosing a model", "Keep AI calls behind typed server actions or API boundaries", "Log prompts, latency, cost, and user outcomes", "Add human fallback paths for high-stakes decisions"],
        coverImage: imageByCategory.ai,
        gradient: "from-blue-600 to-violet-600",
    },
    {
        slug: "nextjs-16-2-performance-playbook",
        title: "Next.js 16.2 Performance Playbook for Faster Production Apps",
        excerpt: "How to plan a Next.js performance upgrade around server rendering, caching, Turbopack, image strategy, and real user metrics.",
        category: "web",
        authorId: "auth-1",
        date: "Apr 21, 2026",
        readTime: "10 min read",
        views: "21.3k",
        keyword: "Next.js 16.2 performance",
        audience: "React and Next.js engineering teams",
        promise: "turn framework improvements into visible speed gains",
        angle: "measure the user journey first, then tune the framework",
        checklist: ["Audit routes by traffic and revenue impact", "Review server and client component boundaries", "Optimize image sizes and priority loading", "Track Core Web Vitals before and after release"],
        coverImage: imageByCategory.web,
        gradient: "from-cyan-600 to-blue-700",
    },
    {
        slug: "seo-for-ai-search-and-answer-engines",
        title: "SEO for AI Search and Answer Engines: What Still Works in 2026",
        excerpt: "A people-first SEO framework for appearing in classic search, AI answers, and high-intent discovery journeys.",
        category: "business",
        authorId: "auth-4",
        date: "Apr 20, 2026",
        readTime: "9 min read",
        views: "19.9k",
        keyword: "SEO for AI search",
        audience: "marketing teams and technical founders",
        promise: "build content that earns trust across search surfaces",
        angle: "AI discovery rewards clarity, authority, and consistent proof",
        checklist: ["Publish original experience and examples", "Use structured data where it helps interpretation", "Keep author, company, and service signals consistent", "Refresh pages when product or market facts change"],
        coverImage: imageByCategory.business,
        gradient: "from-orange-500 to-rose-600",
    },
    {
        slug: "react-server-components-business-guide",
        title: "React Server Components: The Business Guide for Faster UX",
        excerpt: "What decision-makers need to know about server components, payload reduction, maintainability, and cost-aware rendering.",
        category: "web",
        authorId: "auth-2",
        date: "Apr 19, 2026",
        readTime: "8 min read",
        views: "16.4k",
        keyword: "React Server Components business guide",
        audience: "product owners and engineering managers",
        promise: "use server-first React without confusing teams or users",
        angle: "make rendering choices around interaction, not fashion",
        checklist: ["Move static data work to the server", "Keep interactive islands small", "Measure bundle size by route", "Document boundaries for future contributors"],
        coverImage: imageByCategory.web,
        gradient: "from-sky-600 to-indigo-600",
    },
    {
        slug: "headless-cms-content-operations",
        title: "Headless CMS Content Operations for Growing SaaS Teams",
        excerpt: "A complete content workflow for teams managing landing pages, docs, changelogs, blogs, and product education across channels.",
        category: "business",
        authorId: "auth-4",
        date: "Apr 18, 2026",
        readTime: "10 min read",
        views: "14.6k",
        keyword: "headless CMS content operations",
        audience: "SaaS marketing and content operations teams",
        promise: "scale content publishing without breaking brand quality",
        angle: "content is a product surface that needs governance",
        checklist: ["Define reusable content models", "Separate draft, review, and published states", "Create SEO fields for every template", "Track updates by page owner and business goal"],
        coverImage: imageByCategory.business,
        gradient: "from-emerald-600 to-teal-700",
    },
    {
        slug: "progressive-web-apps-for-ecommerce",
        title: "Progressive Web Apps for Ecommerce: Speed, Retention, and ROI",
        excerpt: "How modern PWAs help online stores improve repeat visits, offline resilience, push engagement, and checkout speed.",
        category: "mobile",
        authorId: "auth-3",
        date: "Apr 17, 2026",
        readTime: "9 min read",
        views: "13.8k",
        keyword: "Progressive Web Apps for ecommerce",
        audience: "ecommerce owners and mobile product teams",
        promise: "choose PWA investments that improve revenue instead of novelty",
        angle: "mobile web should feel app-like where it matters most",
        checklist: ["Cache product and cart essentials", "Keep install prompts contextual", "Make checkout resilient on unstable networks", "Measure repeat purchase and abandonment changes"],
        coverImage: imageByCategory.mobile,
        gradient: "from-amber-500 to-red-600",
    },
    {
        slug: "edge-computing-for-fast-saas",
        title: "Edge Computing for SaaS: Where It Helps and Where It Does Not",
        excerpt: "A balanced guide to moving authentication, personalization, redirects, and content closer to users without overcomplicating your stack.",
        category: "devops",
        authorId: "auth-3",
        date: "Apr 16, 2026",
        readTime: "12 min read",
        views: "15.2k",
        keyword: "edge computing for SaaS",
        audience: "platform teams and SaaS architects",
        promise: "reduce latency only where the business case is real",
        angle: "edge architecture works best when it is boring and observable",
        checklist: ["Identify latency-sensitive paths", "Keep edge functions stateless", "Avoid moving complex transactions away from the database", "Monitor cold starts, errors, and regional behavior"],
        coverImage: imageByCategory.devops,
        gradient: "from-slate-700 to-cyan-700",
    },
    {
        slug: "design-systems-that-ship-faster",
        title: "Design Systems That Ship Faster: Tokens, Components, and Governance",
        excerpt: "A practical design system blueprint for teams that want consistent UI without turning every component into a committee meeting.",
        category: "web",
        authorId: "auth-2",
        date: "Apr 15, 2026",
        readTime: "8 min read",
        views: "12.7k",
        keyword: "design systems that ship faster",
        audience: "designers, frontend leads, and product squads",
        promise: "turn shared UI into delivery leverage",
        angle: "governance should remove friction, not create ceremony",
        checklist: ["Start with tokens used in production", "Document component intent and constraints", "Create review paths for new variants", "Retire duplicate patterns quickly"],
        coverImage: imageByCategory.web,
        gradient: "from-fuchsia-600 to-pink-600",
    },
    {
        slug: "technical-seo-checklist-nextjs",
        title: "Technical SEO Checklist for Next.js Websites in 2026",
        excerpt: "A complete checklist for metadata, sitemap quality, schema, internal links, image SEO, crawl budget, and performance.",
        category: "web",
        authorId: "auth-4",
        date: "Apr 14, 2026",
        readTime: "13 min read",
        views: "18.1k",
        keyword: "technical SEO checklist for Next.js",
        audience: "Next.js developers and SEO leads",
        promise: "build pages that are easy to crawl, understand, and convert from",
        angle: "technical SEO is product quality made visible to search systems",
        checklist: ["Generate accurate metadata per route", "Keep canonical URLs consistent", "Use JSON-LD for eligible content types", "Test sitemap, robots, redirects, and status codes"],
        coverImage: imageByCategory.web,
        gradient: "from-lime-600 to-green-700",
    },
    {
        slug: "ai-chatbot-for-customer-support",
        title: "How to Build an AI Chatbot for Customer Support Without Losing Trust",
        excerpt: "Design, data, escalation, and analytics patterns for support bots that reduce workload while protecting customer confidence.",
        category: "ai",
        authorId: "auth-1",
        date: "Apr 13, 2026",
        readTime: "10 min read",
        views: "17.6k",
        keyword: "AI chatbot for customer support",
        audience: "support managers and SaaS builders",
        promise: "launch automation that customers actually accept",
        angle: "trust comes from honesty, control, and fast escalation",
        checklist: ["Scope the bot to answerable intents", "Ground responses in approved knowledge", "Show when a human can take over", "Measure resolution quality, not deflection alone"],
        coverImage: imageByCategory.ai,
        gradient: "from-violet-600 to-indigo-700",
    },
    {
        slug: "database-indexing-for-nodejs-apps",
        title: "Database Indexing for Node.js Apps: A Practical Speed Guide",
        excerpt: "How to find slow queries, design indexes, avoid over-indexing, and connect database performance to user-facing speed.",
        category: "devops",
        authorId: "auth-3",
        date: "Apr 12, 2026",
        readTime: "11 min read",
        views: "11.9k",
        keyword: "database indexing for Node.js apps",
        audience: "backend developers and platform teams",
        promise: "make database speed predictable as traffic grows",
        angle: "indexes are product decisions hidden in infrastructure",
        checklist: ["Review query plans for top paths", "Index filters and sort patterns together", "Remove unused indexes after measurement", "Set budgets for p95 database latency"],
        coverImage: imageByCategory.devops,
        gradient: "from-zinc-700 to-blue-700",
    },
    {
        slug: "saas-pricing-page-conversion-guide",
        title: "SaaS Pricing Page Conversion Guide: Clarity Beats Cleverness",
        excerpt: "A conversion-focused guide to pricing tiers, feature comparison, trust signals, FAQs, and checkout handoff.",
        category: "business",
        authorId: "auth-4",
        date: "Apr 11, 2026",
        readTime: "8 min read",
        views: "13.1k",
        keyword: "SaaS pricing page conversion",
        audience: "SaaS founders and growth teams",
        promise: "make pricing easier to understand and easier to buy",
        angle: "buyers convert when risk and confusion go down",
        checklist: ["Name tiers by customer maturity", "Explain limits in plain language", "Show proof near the decision point", "Connect plan selection to a clean checkout flow"],
        coverImage: imageByCategory.business,
        gradient: "from-teal-600 to-emerald-700",
    },
    {
        slug: "mobile-first-dashboard-design",
        title: "Mobile-First Dashboard Design for Busy Business Users",
        excerpt: "How to prioritize dashboard information architecture, gestures, navigation, and alerts for mobile-first workflows.",
        category: "mobile",
        authorId: "auth-2",
        date: "Apr 10, 2026",
        readTime: "7 min read",
        views: "9.8k",
        keyword: "mobile-first dashboard design",
        audience: "product designers and app teams",
        promise: "make complex data usable on small screens",
        angle: "mobile dashboards should answer one urgent question at a time",
        checklist: ["Define the top three mobile decisions", "Use summary cards before deep tables", "Keep actions thumb-reachable", "Design notification states with restraint"],
        coverImage: imageByCategory.mobile,
        gradient: "from-red-500 to-orange-600",
    },
    {
        slug: "secure-authentication-for-mern-stack",
        title: "Secure Authentication for MERN Stack Apps: Sessions, JWTs, and 2FA",
        excerpt: "A current authentication guide covering token storage, refresh rotation, lockouts, email verification, OAuth, and two-factor flows.",
        category: "devops",
        authorId: "auth-3",
        date: "Apr 09, 2026",
        readTime: "12 min read",
        views: "16.9k",
        keyword: "secure authentication for MERN stack",
        audience: "MERN stack developers",
        promise: "reduce account risk without making login painful",
        angle: "authentication quality is a customer trust feature",
        checklist: ["Store refresh tokens defensively", "Rotate and revoke tokens on sensitive changes", "Rate-limit login and reset routes", "Offer 2FA for admins and high-value accounts"],
        coverImage: imageByCategory.devops,
        gradient: "from-red-700 to-slate-800",
    },
    {
        slug: "marketing-automation-for-service-businesses",
        title: "Marketing Automation for Service Businesses: Leads to Revenue",
        excerpt: "A practical automation map for forms, lead scoring, nurture emails, CRM handoff, proposals, and reporting.",
        category: "business",
        authorId: "auth-4",
        date: "Apr 08, 2026",
        readTime: "9 min read",
        views: "10.6k",
        keyword: "marketing automation for service businesses",
        audience: "agencies, consultants, and service teams",
        promise: "turn interested visitors into organized sales conversations",
        angle: "automation should help humans follow up with better context",
        checklist: ["Capture source, service need, and urgency", "Score leads by fit and intent", "Trigger helpful education before sales calls", "Report pipeline value by channel"],
        coverImage: imageByCategory.business,
        gradient: "from-yellow-500 to-orange-600",
    },
    {
        slug: "ai-code-review-workflow",
        title: "AI Code Review Workflow: Faster Feedback Without Lower Standards",
        excerpt: "How to combine automated review, human judgment, tests, and architecture rules for a healthier delivery workflow.",
        category: "ai",
        authorId: "auth-1",
        date: "Apr 07, 2026",
        readTime: "10 min read",
        views: "12.4k",
        keyword: "AI code review workflow",
        audience: "engineering leads and senior developers",
        promise: "speed up pull requests while preserving ownership",
        angle: "AI is best at catching patterns; humans own tradeoffs",
        checklist: ["Give the reviewer project-specific rules", "Separate style comments from risk comments", "Require tests for behavior changes", "Track repeated findings as training material"],
        coverImage: imageByCategory.ai,
        gradient: "from-purple-700 to-blue-700",
    },
    {
        slug: "core-web-vitals-optimization-plan",
        title: "Core Web Vitals Optimization Plan for Revenue-Focused Websites",
        excerpt: "A step-by-step plan to improve LCP, INP, CLS, image loading, script strategy, and conversion paths.",
        category: "web",
        authorId: "auth-2",
        date: "Apr 06, 2026",
        readTime: "11 min read",
        views: "20.2k",
        keyword: "Core Web Vitals optimization plan",
        audience: "marketing site owners and frontend teams",
        promise: "make speed improvements that users and revenue teams can feel",
        angle: "performance work should start with the pages that pay the bills",
        checklist: ["Fix hero image delivery and priority", "Reduce unused client JavaScript", "Stabilize above-the-fold layout", "Monitor real user data after deployment"],
        coverImage: imageByCategory.web,
        gradient: "from-green-600 to-cyan-700",
    },
    {
        slug: "custom-crm-development-guide",
        title: "Custom CRM Development Guide for Teams Outgrowing Spreadsheets",
        excerpt: "How to plan CRM entities, pipelines, permissions, dashboards, integrations, and reporting before writing code.",
        category: "business",
        authorId: "auth-4",
        date: "Apr 05, 2026",
        readTime: "10 min read",
        views: "8.7k",
        keyword: "custom CRM development",
        audience: "operations leaders and service businesses",
        promise: "build CRM software that matches the way your team sells",
        angle: "a CRM succeeds when it removes admin drag from the next action",
        checklist: ["Map the lifecycle from lead to renewal", "Design ownership and permission rules early", "Automate reminders for stalled deals", "Keep reporting tied to operational decisions"],
        coverImage: imageByCategory.business,
        gradient: "from-blue-700 to-emerald-700",
    },
    {
        slug: "api-first-product-development",
        title: "API-First Product Development: Build Once, Reuse Everywhere",
        excerpt: "A guide to contracts, versioning, validation, documentation, SDKs, and governance for API-first product teams.",
        category: "devops",
        authorId: "auth-3",
        date: "Apr 04, 2026",
        readTime: "12 min read",
        views: "9.6k",
        keyword: "API-first product development",
        audience: "backend teams and product platform owners",
        promise: "create APIs that support web, mobile, partner, and automation use cases",
        angle: "an API is a product interface, not a private implementation detail",
        checklist: ["Write contracts before consumers integrate", "Use schema validation at boundaries", "Version breaking changes deliberately", "Document examples for the highest-value workflows"],
        coverImage: imageByCategory.devops,
        gradient: "from-indigo-700 to-slate-800",
    },
    {
        slug: "landing-page-copywriting-for-software",
        title: "Landing Page Copywriting for Software Products: From Click to Demo",
        excerpt: "A practical copy framework for headlines, proof, feature messaging, objection handling, and conversion-focused CTAs.",
        category: "business",
        authorId: "auth-4",
        date: "Apr 03, 2026",
        readTime: "8 min read",
        views: "11.1k",
        keyword: "landing page copywriting for software",
        audience: "software founders and marketers",
        promise: "write pages that explain value before asking for action",
        angle: "clear positioning beats louder persuasion",
        checklist: ["Lead with the customer problem", "Translate features into operational outcomes", "Place proof beside claims", "Use CTAs that match buying readiness"],
        coverImage: imageByCategory.business,
        gradient: "from-rose-600 to-orange-600",
    },
    {
        slug: "cloud-cost-optimization-nodejs",
        title: "Cloud Cost Optimization for Node.js Apps Without Slowing Growth",
        excerpt: "How to reduce hosting bills with observability, right-sizing, caching, job queues, storage lifecycle rules, and release discipline.",
        category: "devops",
        authorId: "auth-3",
        date: "Apr 02, 2026",
        readTime: "11 min read",
        views: "10.2k",
        keyword: "cloud cost optimization for Node.js",
        audience: "technical founders and platform engineers",
        promise: "lower infrastructure cost while protecting customer experience",
        angle: "cost work is performance work when measured by customer value",
        checklist: ["Tag spend by product area", "Cache expensive repeated reads", "Move background work out of request paths", "Set alerts on sudden usage changes"],
        coverImage: imageByCategory.devops,
        gradient: "from-cyan-700 to-slate-800",
    },
    {
        slug: "local-seo-for-software-agencies",
        title: "Local SEO for Software Agencies: Win Better Regional Clients",
        excerpt: "A service-business SEO plan for city pages, case studies, Google Business Profile, reviews, and technical trust signals.",
        category: "business",
        authorId: "auth-4",
        date: "Apr 01, 2026",
        readTime: "9 min read",
        views: "8.9k",
        keyword: "local SEO for software agencies",
        audience: "software agencies and IT service providers",
        promise: "attract local buyers who need credible technical help",
        angle: "regional search rewards proof that you understand nearby businesses",
        checklist: ["Create service pages with local context", "Publish case studies by industry and city", "Ask happy clients for specific reviews", "Keep contact, schema, and directory data consistent"],
        coverImage: imageByCategory.business,
        gradient: "from-emerald-700 to-lime-700",
    },
    {
        slug: "flutter-vs-react-native-2026",
        title: "Flutter vs React Native in 2026: Choosing for Product Reality",
        excerpt: "A practical comparison across team skills, performance needs, UI complexity, ecosystem, maintenance, and hiring.",
        category: "mobile",
        authorId: "auth-2",
        date: "Mar 31, 2026",
        readTime: "10 min read",
        views: "18.4k",
        keyword: "Flutter vs React Native 2026",
        audience: "mobile founders and engineering managers",
        promise: "choose a mobile stack around constraints that matter",
        angle: "the best framework is the one your team can ship and maintain",
        checklist: ["Compare existing team language strengths", "Prototype the hardest UI interaction", "Evaluate native module requirements", "Plan release, testing, and hiring costs"],
        coverImage: imageByCategory.mobile,
        gradient: "from-sky-600 to-blue-800",
    },
    {
        slug: "ai-product-requirements-document",
        title: "How to Write an AI Product Requirements Document",
        excerpt: "A field-tested PRD structure for AI features covering user value, data sources, risk, evaluation, cost, and launch criteria.",
        category: "ai",
        authorId: "auth-1",
        date: "Mar 30, 2026",
        readTime: "9 min read",
        views: "14.8k",
        keyword: "AI product requirements document",
        audience: "product managers and AI builders",
        promise: "define AI features clearly before model experiments begin",
        angle: "AI PRDs need evaluation plans as much as feature specs",
        checklist: ["Describe the user decision being improved", "List approved data sources", "Define unacceptable outputs", "Set accuracy, latency, and cost thresholds"],
        coverImage: imageByCategory.ai,
        gradient: "from-indigo-600 to-purple-700",
    },
    {
        slug: "conversion-rate-optimization-for-saas-homepages",
        title: "Conversion Rate Optimization for SaaS Homepages",
        excerpt: "How to improve homepage clarity, proof, speed, navigation, CTA strategy, and experiment quality.",
        category: "business",
        authorId: "auth-4",
        date: "Mar 29, 2026",
        readTime: "8 min read",
        views: "12.1k",
        keyword: "conversion rate optimization for SaaS homepages",
        audience: "growth teams and founders",
        promise: "find the homepage changes most likely to increase qualified demand",
        angle: "conversion improves when visitors understand fit faster",
        checklist: ["Clarify who the product is for", "Put proof above the first major CTA", "Remove generic benefit language", "Run experiments against qualified conversion goals"],
        coverImage: imageByCategory.business,
        gradient: "from-pink-600 to-red-600",
    },
    {
        slug: "zero-downtime-deployment-guide",
        title: "Zero-Downtime Deployment Guide for Modern Web Apps",
        excerpt: "Deployment patterns for migrations, health checks, feature flags, rollbacks, queues, and observability.",
        category: "devops",
        authorId: "auth-3",
        date: "Mar 28, 2026",
        readTime: "12 min read",
        views: "10.9k",
        keyword: "zero-downtime deployment guide",
        audience: "DevOps engineers and backend teams",
        promise: "ship more often without customer-visible interruptions",
        angle: "deployment reliability comes from rehearsed rollback paths",
        checklist: ["Make database migrations backward compatible", "Use health checks that test dependencies", "Release risky behavior behind flags", "Keep rollback instructions short and current"],
        coverImage: imageByCategory.devops,
        gradient: "from-slate-800 to-violet-800",
    },
    {
        slug: "web-accessibility-checklist-for-startups",
        title: "Web Accessibility Checklist for Startups Shipping Fast",
        excerpt: "A founder-friendly accessibility guide for semantic HTML, keyboard support, contrast, forms, modals, and testing.",
        category: "web",
        authorId: "auth-2",
        date: "Mar 27, 2026",
        readTime: "9 min read",
        views: "9.4k",
        keyword: "web accessibility checklist for startups",
        audience: "startup teams and frontend developers",
        promise: "make accessibility part of shipping instead of a late audit",
        angle: "accessible interfaces are clearer interfaces for everyone",
        checklist: ["Use semantic elements before custom patterns", "Test every flow with keyboard only", "Label form errors clearly", "Run automated checks plus manual screen reader passes"],
        coverImage: imageByCategory.web,
        gradient: "from-blue-600 to-green-700",
    },
    {
        slug: "microservices-vs-modular-monolith",
        title: "Microservices vs Modular Monolith: Choose the Right Backend Shape",
        excerpt: "A practical architecture comparison for growing products, covering team ownership, deployment, data boundaries, and complexity.",
        category: "devops",
        authorId: "auth-3",
        date: "Mar 26, 2026",
        readTime: "11 min read",
        views: "15.7k",
        keyword: "microservices vs modular monolith",
        audience: "technical founders and architecture teams",
        promise: "avoid architecture that is bigger than your organization",
        angle: "team topology should drive service boundaries",
        checklist: ["Map domains before splitting services", "Separate modules inside the monolith first", "Split only where independent deployment matters", "Plan observability before distributed failure appears"],
        coverImage: imageByCategory.devops,
        gradient: "from-neutral-700 to-cyan-800",
    },
    {
        slug: "ai-content-workflow-for-seo-teams",
        title: "AI Content Workflow for SEO Teams That Protects Quality",
        excerpt: "How to use AI for research, outlines, briefs, refreshes, and internal linking while keeping original expertise at the center.",
        category: "ai",
        authorId: "auth-4",
        date: "Mar 25, 2026",
        readTime: "10 min read",
        views: "13.6k",
        keyword: "AI content workflow for SEO teams",
        audience: "content marketers and SEO teams",
        promise: "publish faster without flooding your site with thin content",
        angle: "AI should accelerate expertise, not replace it",
        checklist: ["Start with customer questions and data", "Use AI for structure, not unsupported claims", "Add first-hand examples and screenshots", "Review every page for usefulness before publishing"],
        coverImage: imageByCategory.ai,
        gradient: "from-purple-600 to-fuchsia-700",
    },
    {
        slug: "secure-file-upload-system",
        title: "Secure File Upload System Design for Web Applications",
        excerpt: "A practical guide to upload validation, malware scanning, signed URLs, storage permissions, image processing, and audit logs.",
        category: "devops",
        authorId: "auth-3",
        date: "Mar 24, 2026",
        readTime: "10 min read",
        views: "8.6k",
        keyword: "secure file upload system",
        audience: "backend developers and SaaS teams",
        promise: "let users upload files without opening avoidable risk",
        angle: "file upload is a security boundary disguised as convenience",
        checklist: ["Validate MIME type and extension", "Store files outside public execution paths", "Use signed URLs for private access", "Scan and resize files asynchronously"],
        coverImage: imageByCategory.devops,
        gradient: "from-red-700 to-orange-700",
    },
    {
        slug: "analytics-dashboard-kpi-design",
        title: "Analytics Dashboard KPI Design: From Data Noise to Decisions",
        excerpt: "How to choose metrics, design charts, reduce cognitive load, and connect dashboards to action.",
        category: "web",
        authorId: "auth-2",
        date: "Mar 23, 2026",
        readTime: "8 min read",
        views: "7.9k",
        keyword: "analytics dashboard KPI design",
        audience: "product teams and business operators",
        promise: "build dashboards that help teams decide what to do next",
        angle: "a useful dashboard has fewer numbers and better questions",
        checklist: ["Tie each metric to an owner", "Show trend and context together", "Separate executive and operator views", "Add drilldowns only where they support action"],
        coverImage: imageByCategory.web,
        gradient: "from-cyan-600 to-emerald-700",
    },
    {
        slug: "b2b-website-redesign-checklist",
        title: "B2B Website Redesign Checklist: Strategy Before Visual Polish",
        excerpt: "A complete redesign plan for positioning, sitemap, SEO migration, component systems, analytics, and launch QA.",
        category: "business",
        authorId: "auth-4",
        date: "Mar 22, 2026",
        readTime: "12 min read",
        views: "9.1k",
        keyword: "B2B website redesign checklist",
        audience: "B2B marketing teams and founders",
        promise: "launch a better website without losing search equity or sales clarity",
        angle: "a redesign should improve buyer understanding, not just aesthetics",
        checklist: ["Audit current traffic and conversion paths", "Map pages to buying stages", "Prepare redirect and metadata plans", "QA forms, analytics, speed, and mobile layouts"],
        coverImage: imageByCategory.business,
        gradient: "from-blue-700 to-violet-700",
    },
    {
        slug: "payment-integration-best-practices",
        title: "Payment Integration Best Practices for SaaS and Marketplaces",
        excerpt: "How to handle checkout, invoices, webhooks, taxes, refunds, subscriptions, and failed payment recovery.",
        category: "devops",
        authorId: "auth-3",
        date: "Mar 21, 2026",
        readTime: "11 min read",
        views: "12.8k",
        keyword: "payment integration best practices",
        audience: "SaaS builders and ecommerce developers",
        promise: "make payments reliable, auditable, and customer-friendly",
        angle: "billing code needs product, finance, and support thinking",
        checklist: ["Treat webhooks as the source of truth", "Store payment provider IDs carefully", "Design clear invoice and refund states", "Test renewal, failure, and cancellation flows"],
        coverImage: imageByCategory.devops,
        gradient: "from-green-700 to-slate-800",
    },
    {
        slug: "ai-personalization-for-ecommerce",
        title: "AI Personalization for Ecommerce: Useful Recommendations Without Creepiness",
        excerpt: "How to personalize product discovery, merchandising, email, and offers while respecting privacy and user control.",
        category: "ai",
        authorId: "auth-1",
        date: "Mar 20, 2026",
        readTime: "9 min read",
        views: "11.5k",
        keyword: "AI personalization for ecommerce",
        audience: "online store owners and product teams",
        promise: "increase relevance without damaging trust",
        angle: "personalization should feel helpful, not invasive",
        checklist: ["Use behavior signals with clear purpose", "Let shoppers reset or adjust preferences", "Avoid sensitive inference categories", "Measure margin, returns, and satisfaction together"],
        coverImage: imageByCategory.ai,
        gradient: "from-pink-600 to-purple-700",
    },
    {
        slug: "content-calendar-for-tech-companies",
        title: "Content Calendar for Tech Companies: Plan Topics That Compound",
        excerpt: "A simple framework for building a technical content calendar around product goals, search demand, sales questions, and expertise.",
        category: "business",
        authorId: "auth-4",
        date: "Mar 19, 2026",
        readTime: "8 min read",
        views: "7.2k",
        keyword: "content calendar for tech companies",
        audience: "technical marketers and founders",
        promise: "publish content that keeps working after launch week",
        angle: "a strong calendar connects customer questions to business outcomes",
        checklist: ["Group topics by customer journey stage", "Balance evergreen and timely posts", "Assign subject matter experts early", "Refresh winners every quarter"],
        coverImage: imageByCategory.business,
        gradient: "from-amber-600 to-lime-700",
    },
    {
        slug: "typescript-for-large-react-apps",
        title: "TypeScript for Large React Apps: Patterns That Keep Teams Moving",
        excerpt: "Practical TypeScript patterns for props, forms, API responses, server data, utility types, and migration strategy.",
        category: "web",
        authorId: "auth-1",
        date: "Mar 18, 2026",
        readTime: "10 min read",
        views: "14.2k",
        keyword: "TypeScript for large React apps",
        audience: "frontend developers and team leads",
        promise: "make types helpful without slowing delivery",
        angle: "great TypeScript expresses product contracts in code",
        checklist: ["Type API boundaries before UI details", "Prefer explicit domain types", "Avoid clever utility types in shared code", "Use schema validation for untrusted data"],
        coverImage: imageByCategory.web,
        gradient: "from-blue-700 to-cyan-700",
    },
    {
        slug: "push-notification-strategy-for-mobile-apps",
        title: "Push Notification Strategy for Mobile Apps: Helpful, Timely, Respectful",
        excerpt: "How to design notification permission prompts, segments, frequency caps, deep links, and re-engagement journeys.",
        category: "mobile",
        authorId: "auth-2",
        date: "Mar 17, 2026",
        readTime: "8 min read",
        views: "6.8k",
        keyword: "push notification strategy for mobile apps",
        audience: "mobile product managers and growth teams",
        promise: "increase engagement without training users to mute you",
        angle: "the best notification is a service, not an interruption",
        checklist: ["Ask permission after value is understood", "Segment by intent and lifecycle", "Use deep links to finish the task", "Cap frequency and monitor opt-outs"],
        coverImage: imageByCategory.mobile,
        gradient: "from-orange-600 to-pink-700",
    },
    {
        slug: "observability-for-startups",
        title: "Observability for Startups: Logs, Metrics, Traces, and Sanity",
        excerpt: "A pragmatic observability setup for small teams that need production confidence without enterprise overhead.",
        category: "devops",
        authorId: "auth-3",
        date: "Mar 16, 2026",
        readTime: "9 min read",
        views: "8.4k",
        keyword: "observability for startups",
        audience: "startup engineers and founders",
        promise: "know what broke, who is affected, and what to fix first",
        angle: "observability should answer urgent production questions quickly",
        checklist: ["Log request IDs and user-safe context", "Track golden signals by service", "Add traces around slow external calls", "Create alerts for symptoms, not every possible cause"],
        coverImage: imageByCategory.devops,
        gradient: "from-slate-700 to-green-800",
    },
    {
        slug: "website-maintenance-plan",
        title: "Website Maintenance Plan: Security, Speed, SEO, and Content Freshness",
        excerpt: "A monthly maintenance plan for businesses that rely on their website for leads, trust, sales, and support.",
        category: "business",
        authorId: "auth-4",
        date: "Mar 15, 2026",
        readTime: "7 min read",
        views: "7.7k",
        keyword: "website maintenance plan",
        audience: "business owners and marketing managers",
        promise: "keep a high-performing site healthy after launch",
        angle: "a website is an operating asset, not a one-time project",
        checklist: ["Update dependencies and security patches", "Review forms and conversion tracking", "Refresh outdated service or pricing copy", "Check speed, broken links, and search coverage"],
        coverImage: imageByCategory.business,
        gradient: "from-teal-700 to-blue-800",
    },
    {
        slug: "app-store-optimization-for-startups",
        title: "App Store Optimization for Startups: Metadata, Screenshots, and Reviews",
        excerpt: "A practical ASO guide for improving mobile app discovery, conversion, ratings, and release messaging.",
        category: "mobile",
        authorId: "auth-2",
        date: "Mar 14, 2026",
        readTime: "9 min read",
        views: "6.5k",
        keyword: "app store optimization for startups",
        audience: "mobile founders and app marketers",
        promise: "make app store pages easier to find and easier to trust",
        angle: "store conversion depends on proof, clarity, and current visuals",
        checklist: ["Research terms buyers actually use", "Lead screenshots with core outcomes", "Respond to reviews with product context", "Align release notes with user value"],
        coverImage: imageByCategory.mobile,
        gradient: "from-indigo-600 to-sky-700",
    },
    {
        slug: "ai-data-privacy-for-saas",
        title: "AI Data Privacy for SaaS Products: Practical Guardrails",
        excerpt: "How to design AI features around consent, retention, redaction, vendor boundaries, permissions, and customer transparency.",
        category: "ai",
        authorId: "auth-1",
        date: "Mar 13, 2026",
        readTime: "10 min read",
        views: "10.7k",
        keyword: "AI data privacy for SaaS",
        audience: "SaaS founders, product teams, and security leads",
        promise: "ship AI features that respect customer data expectations",
        angle: "privacy guardrails should be designed before prompts reach production",
        checklist: ["Classify data before model access", "Redact sensitive fields where possible", "Document vendor data handling", "Give admins control over AI-enabled features"],
        coverImage: imageByCategory.ai,
        gradient: "from-slate-800 to-purple-800",
    },
    {
        slug: "portfolio-case-study-template",
        title: "Portfolio Case Study Template for Software Agencies",
        excerpt: "A conversion-focused case study structure covering problem, constraints, process, technology, results, and next steps.",
        category: "business",
        authorId: "auth-4",
        date: "Mar 12, 2026",
        readTime: "8 min read",
        views: "6.9k",
        keyword: "portfolio case study template",
        audience: "software agencies and freelancers",
        promise: "turn project work into stronger sales proof",
        angle: "case studies convert when they show judgment, not just screenshots",
        checklist: ["Name the business problem clearly", "Explain constraints and tradeoffs", "Show measurable results where possible", "End with services related to the proof"],
        coverImage: imageByCategory.business,
        gradient: "from-violet-700 to-rose-700",
    },
    {
        slug: "serverless-vs-containers",
        title: "Serverless vs Containers: Picking the Right Deployment Model",
        excerpt: "A practical comparison of cost, scaling, cold starts, operational control, vendor lock-in, and team maturity.",
        category: "devops",
        authorId: "auth-3",
        date: "Mar 11, 2026",
        readTime: "10 min read",
        views: "11.6k",
        keyword: "serverless vs containers",
        audience: "engineering managers and platform teams",
        promise: "choose infrastructure that matches workload and team reality",
        angle: "deployment models are tradeoffs, not identities",
        checklist: ["Classify workloads by runtime and traffic shape", "Estimate steady vs burst cost", "Check observability and debugging needs", "Choose the model your team can operate calmly"],
        coverImage: imageByCategory.devops,
        gradient: "from-cyan-800 to-indigo-800",
    },
    {
        slug: "ecommerce-search-ux",
        title: "Ecommerce Search UX: Help Shoppers Find and Decide Faster",
        excerpt: "How to improve search relevance, filters, empty states, autocomplete, merchandising, and analytics for online stores.",
        category: "web",
        authorId: "auth-2",
        date: "Mar 10, 2026",
        readTime: "9 min read",
        views: "7.5k",
        keyword: "ecommerce search UX",
        audience: "ecommerce teams and UX designers",
        promise: "turn product search into a higher-converting journey",
        angle: "search UX should reduce the distance between intent and confidence",
        checklist: ["Support synonyms and common misspellings", "Show useful filters after query context", "Design helpful empty states", "Track searches that lead to no purchase"],
        coverImage: imageByCategory.web,
        gradient: "from-emerald-700 to-blue-700",
    },
    {
        slug: "software-project-discovery-workshop",
        title: "Software Project Discovery Workshop: What to Decide Before Development",
        excerpt: "A complete discovery agenda for goals, users, workflows, integrations, risks, budget, timeline, and MVP scope.",
        category: "business",
        authorId: "auth-4",
        date: "Mar 09, 2026",
        readTime: "9 min read",
        views: "8.2k",
        keyword: "software project discovery workshop",
        audience: "clients, founders, and product owners",
        promise: "start development with fewer surprises and better priorities",
        angle: "discovery is where expensive assumptions become visible",
        checklist: ["Define business outcomes and success metrics", "Map user roles and critical workflows", "List integration and compliance constraints", "Prioritize MVP scope by risk and value"],
        coverImage: imageByCategory.business,
        gradient: "from-blue-600 to-orange-600",
    },
    {
        slug: "ai-agent-workflows-for-business",
        title: "AI Agent Workflows for Business: Where Automation Actually Pays Off",
        excerpt: "How to identify agent-worthy workflows, design approval gates, connect tools, monitor outcomes, and avoid brittle automation.",
        category: "ai",
        authorId: "auth-1",
        date: "Mar 08, 2026",
        readTime: "11 min read",
        views: "15.1k",
        keyword: "AI agent workflows for business",
        audience: "operations teams and business owners",
        promise: "automate repeatable work without losing control",
        angle: "the best agent workflows start narrow and earn trust through logs",
        checklist: ["Choose workflows with clear inputs and outputs", "Require approval for money, legal, or customer-impacting actions", "Connect only the tools needed for the job", "Review failures weekly and refine instructions"],
        coverImage: imageByCategory.ai,
        gradient: "from-blue-800 to-purple-800",
    },
];

const buildArticleContent = (topic: BlogSeedTopic) => `
    <h2>${topic.title}</h2>
    <p><strong>Primary keyword:</strong> ${topic.keyword}. This guide is written for ${topic.audience} who want to ${topic.promise}. At Oftisoft, we approach this topic with one rule: ${topic.angle}.</p>
    <p>The strongest digital products in 2026 are not winning because they use every new tool. They win because their teams choose the right technical decisions, connect those decisions to business goals, and keep the user experience fast, clear, and trustworthy.</p>

    <h2>Why ${topic.keyword} matters now</h2>
    <p>Customers compare products quickly, search engines expect useful and reliable pages, and internal teams need systems that can adapt without constant rebuilds. ${topic.title.replace(/:.*$/, "")} sits at the center of those pressures. It affects acquisition, retention, support, and the long-term cost of ownership.</p>
    <p>A good plan starts by defining the user problem, the operational constraint, and the measurable outcome. That keeps the project from becoming a list of disconnected features and gives every release a reason to exist.</p>

    <h2>Oftisoft's practical framework</h2>
    <h3>1. Start with the business outcome</h3>
    <p>Before choosing a stack or tactic, write down the result the work should create. That might be a faster checkout, fewer support tickets, more qualified leads, better uptime, stronger search visibility, or a smoother internal workflow.</p>
    <h3>2. Design the simplest reliable system</h3>
    <p>Simple does not mean basic. It means every moving part has a job. The best solution has enough structure for scale, enough observability for confidence, and enough flexibility for the next version.</p>
    <h3>3. Measure the user-facing impact</h3>
    <p>Track metrics that reflect real experience: load time, conversion rate, activation, retention, resolution quality, deployment health, search coverage, and customer satisfaction. Vanity metrics are useful only when they help explain a business decision.</p>

    <h2>Implementation checklist</h2>
    <ul>
        ${topic.checklist.map((item) => `<li>${item}</li>`).join("")}
    </ul>

    <h2>Common mistakes to avoid</h2>
    <p>The most common mistake is treating ${topic.keyword} as a one-time setup. Markets, frameworks, search behavior, and customer expectations keep changing. Plan a review cycle so your implementation stays current instead of slowly drifting out of date.</p>
    <p>Another mistake is copying a pattern from a larger company without checking whether your team has the same traffic, compliance needs, staffing, or budget. Mature engineering is not about using the most complex option; it is about choosing the option your team can operate well.</p>

    <h2>FAQ</h2>
    <h3>How often should this be reviewed?</h3>
    <p>Review high-impact pages, workflows, and infrastructure at least once per quarter. Review security, performance, and conversion paths after every major release.</p>
    <h3>Is this only for large companies?</h3>
    <p>No. Small teams benefit most when they make clear decisions early. The goal is not enterprise complexity; the goal is a reliable foundation that can grow with demand.</p>
    <h3>How can Oftisoft help?</h3>
    <p>Oftisoft helps businesses plan, design, build, optimize, and maintain modern web apps, ecommerce systems, dashboards, AI features, and growth-focused marketing websites. We connect technical decisions to measurable business outcomes.</p>

    <h2>Final thoughts</h2>
    <p>${topic.title} is ultimately about focus. Choose the user problem, build the smallest strong version, measure what changed, and improve from evidence. That rhythm creates software and content that stay useful long after launch day.</p>
`;

const makeBlogPost = (topic: BlogSeedTopic, index: number): BlogPost => {
    const rank = index + 1;
    const featured = rank <= 4;
    const popularResult = rank >= 3 && rank <= 12;

    return {
        id: `post-${String(rank).padStart(3, "0")}`,
        slug: topic.slug,
        title: topic.title,
        excerpt: topic.excerpt,
        content: buildArticleContent(topic),
        coverImage: topic.coverImage,
        category: topic.category,
        authorId: topic.authorId,
        date: topic.date,
        readTime: topic.readTime,
        views: topic.views,
        featured,
        popularResult,
        popularRank: popularResult ? String(rank - 2).padStart(2, "0") : undefined,
        gradient: topic.gradient,
        status: "published",
    };
};

const defaultContent: BlogPageContent = {
    hero: {
        title: "Oftisoft Insights",
        subtitle: "Original, practical guides on web development, AI, mobile apps, DevOps, SEO, and digital growth."
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
            bio: "Founder-minded software engineer helping startups and businesses build practical web apps, AI features, dashboards, and scalable digital systems.",
            stats: [
                { label: "Articles", value: "40+" },
                { label: "Focus", value: "AI + Web" },
                { label: "Projects", value: "500+" },
            ],
            tags: ["Architecture", "AI", "MERN Stack"],
            socials: { twitter: "#", linkedin: "#", github: "#" }
        },
        {
            id: "auth-2",
            name: "Nadia Karim",
            role: "Product Designer",
            avatar: "",
            initials: "NK",
            bio: "Design strategist focused on accessible interfaces, conversion-ready user journeys, mobile UX, and scalable design systems.",
            stats: [
                { label: "Articles", value: "12+" },
                { label: "Specialty", value: "UX" },
                { label: "Audits", value: "80+" },
            ],
            tags: ["UI/UX", "Accessibility", "Design Systems"],
            socials: { twitter: "#", linkedin: "#", website: "#" }
        },
        {
            id: "auth-3",
            name: "David Chen",
            role: "Cloud Architect",
            avatar: "",
            initials: "DC",
            bio: "Cloud and backend architect specializing in secure APIs, reliable deployments, database performance, and cost-aware infrastructure.",
            stats: [
                { label: "Articles", value: "15+" },
                { label: "Uptime", value: "99.9%" },
                { label: "Systems", value: "70+" },
            ],
            tags: ["Backend", "Cloud", "DevOps"],
            socials: { github: "#", linkedin: "#", website: "#" }
        },
        {
            id: "auth-4",
            name: "Maya Rahman",
            role: "Growth Strategist",
            avatar: "",
            initials: "MR",
            bio: "SEO and growth strategist helping technical companies turn websites, content, analytics, and automation into qualified demand.",
            stats: [
                { label: "Articles", value: "18+" },
                { label: "Focus", value: "SEO" },
                { label: "Campaigns", value: "60+" },
            ],
            tags: ["SEO", "Content", "Conversion"],
            socials: { twitter: "#", linkedin: "#", website: "#" }
        },
    ],
    posts: blogTopics.map((topic, index) => makeBlogPost(topic, index)),
    lastUpdated: "2026-04-22T00:00:00.000Z"
};

export const useBlogContentStore = create<BlogContentState>()(
    persist(
        immer((set) => ({
            content: null,
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

            reset: () => set({ content: null })
        })),
        {
            name: 'blog-content-storage',
            storage: createJSONStorage(() => localStorage),
        }
    )
);
