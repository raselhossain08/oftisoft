
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

// Types for different sections of the services page

export interface ServiceItem {
    id: string;
    label: string;
    iconName: string;
    iconImage?: string;
    gradient: string;
    title: string;
    subtitle?: string;
    description: string;
    features: { iconName: string; title: string; desc: string }[];
    techs?: string[];
}

export interface ComparisonTier {
    id: string;
    name: string;
    price: string;
    description: string;
    iconName: string;
    color: string;
    highlight: boolean;
    features: (boolean | string)[];
    btnVariant?: string;
}

export interface ComparisonFeature {
    name: string;
    tooltip: string;
}

export interface ServicePackage {
    id: string;
    name: string;
    price: number | string;
    monthlyPrice: number | string;
    description: string;
    features: string[];
    highlight: boolean;
    iconName: string;
    gradient: string;
}

export interface ProcessStep {
    id: number;
    title: string;
    desc: string;
    iconName: string;
    color: string;
}

export interface FAQItem {
    id: string;
    category: string;
    question: string;
    answer: string;
}

export interface TechCategory {
    id: string;
    label: string;
    iconName: string;
    description: string;
    techs: string[];
}

export interface ServicesPageContent {
    heroVideoUrl?: string;
    overview: ServiceItem[];
    comparison: {
        features: ComparisonFeature[];
        tiers: ComparisonTier[];
    };
    packages: ServicePackage[];
    process: ProcessStep[];
    startId: number; // to sync process step IDs if needed
    faqs: FAQItem[];
    techStack: TechCategory[];
    lastUpdated: string;
}

interface ServicesContentState {
    content: ServicesPageContent | null;
    isLoading: boolean;
    isSaving: boolean;
    error: string | null;

    // Actions
    setContent: (content: ServicesPageContent) => void;
    updateHeroVideo: (url: string) => void;

    // Services Overview
    addServiceItem: (item: ServiceItem) => void;
    updateServiceItem: (id: string, item: Partial<ServiceItem>) => void;
    deleteServiceItem: (id: string) => void;

    // Comparison
    addComparisonFeature: (feature: ComparisonFeature) => void;
    updateComparisonFeature: (index: number, feature: ComparisonFeature) => void;
    deleteComparisonFeature: (index: number) => void;
    addComparisonTier: (tier: ComparisonTier) => void;
    updateComparisonTier: (id: string, tier: Partial<ComparisonTier>) => void;
    deleteComparisonTier: (id: string) => void;

    // Packages
    addPackage: (pkg: ServicePackage) => void;
    updatePackage: (id: string, pkg: Partial<ServicePackage>) => void;
    deletePackage: (id: string) => void;

    // Process
    addProcessStep: (step: ProcessStep) => void;
    updateProcessStep: (id: number, step: Partial<ProcessStep>) => void;
    deleteProcessStep: (id: number) => void;

    // FAQs
    addFAQ: (item: FAQItem) => void;
    updateFAQ: (id: string, item: Partial<FAQItem>) => void;
    deleteFAQ: (id: string) => void;

    // Tech Stack
    addTechCategory: (category: TechCategory) => void;
    updateTechCategory: (id: string, category: Partial<TechCategory>) => void;
    deleteTechCategory: (id: string) => void;

    resetToDefaults: () => void;
}

const defaultContent: ServicesPageContent = {
    heroVideoUrl: "",
    overview: [
        {
            id: "web",
            label: "Modern Web",
            iconName: "Globe",
            gradient: "from-blue-600 to-cyan-500",
            title: "High-Performance Web Applications",
            subtitle: "Future-Proof Web Architecture",
            description: "We build pixel-perfect, SEO-optimized web applications using Next.js 15 and React Server Components. Our sites aren't just beautiful; they are lightning fast and score 100 on Core Web Vitals.",
            features: [
                { iconName: "Zap", title: "Speed Optimization", desc: "Sub-second load times and interaction to next paint (INP) optimization." },
                { iconName: "Globe", title: "Edge Scalability", desc: "Global distribution for near-zero latency worldwide." },
                { iconName: "Layers", title: "Modular Architecture", desc: "Service-oriented structure for effortless scaling." },
                { iconName: "ShieldCheck", title: "Enterprise Security", desc: "Advanced protection mechanisms and data privacy compliance." }
            ],
            techs: ["Next.js 15", "React Server Components", "TypeScript", "Tailwind CSS", "Framer Motion", "Vercel Edge"]
        },
        // ... (other default services can be added here, mimicking original file)
    ],
    comparison: {
        features: [
            { name: "Custom Design", tooltip: "Tailored UI/UX specifically for your brand" },
            { name: "SEO Optimization", tooltip: "Advanced technical SEO setup" },
            { name: "CMS Integration", tooltip: "Easy content management" },
            { name: "E-commerce", tooltip: "Full shopping cart & checkout" },
            { name: "API Integration", tooltip: "Connect 3rd party services" },
            { name: "Database Setup", tooltip: "Scalable data architecture" },
            { name: "Maintenance", tooltip: "Ongoing support duration" },
            { name: "Source Code", tooltip: "Full ownership of codebase" }
        ],
        tiers: [
            {
                id: "starter", name: "Starter", price: "$2,999", description: "Perfect for landing pages and small business sites.", iconName: "Zap", color: "text-blue-500", highlight: false, features: [true, true, true, false, false, false, "1 Month", false]
            },
            {
                id: "growth", name: "Growth", price: "$5,499", description: "Ideal for growing startups and e-commerce brands.", iconName: "Sparkles", color: "text-purple-500", highlight: true, features: [true, true, true, true, true, true, "3 Months", true]
            },
            {
                id: "enterprise", name: "Enterprise", price: "Custom", description: "Full-scale solution for large organizations.", iconName: "Crown", color: "text-orange-500", highlight: false, features: [true, true, true, true, true, true, "12 Months", true]
            }
        ]
    },
    packages: [
        {
            id: "starter", name: "Starter", price: 2999, monthlyPrice: 299, description: "Perfect for landing pages and small business websites.", features: ["Custom Design", "Mobile Responsive", "SEO Optimized", "CMS Integration", "1 Month Support"], highlight: false, iconName: "Rocket", gradient: "from-blue-500/20 to-cyan-500/20"
        },
        {
            id: "growth", name: "Growth", price: 5499, monthlyPrice: 599, description: "Ideal for growing startups and e-commerce brands.", features: ["Everything in Starter", "Shopping Cart", "Payment Gateway", "User Authentication", "3 Months Support", "Analytics Dashboard"], highlight: true, iconName: "Sparkles", gradient: "from-purple-500/20 to-pink-500/20"
        },
        {
            id: "enterprise", name: "Enterprise", price: "Custom", monthlyPrice: "Custom", description: "Full-scale solution for large organizations.", features: ["Everything in Growth", "Custom API Integration", "Cloud Infrastructure", "Advanced Security", "12 Months Support", "Dedicated Project Manager"], highlight: false, iconName: "Crown", gradient: "from-orange-500/20 to-red-500/20"
        }
    ],
    process: [
        { id: 1, title: "Discovery & Strategy", desc: "We start by understanding your vision, target audience, and technical requirements. We deliver a detailed project roadmap and technical specifications.", iconName: "Video", color: "text-blue-500" },
        { id: 2, title: "UX/UI Design", desc: "Our designers create high-fidelity interactive prototypes. We focus on user journey mapping and creating a visual identity that resonates with your brand.", iconName: "FileText", color: "text-purple-500" },
        { id: 3, title: "Agile Development", desc: "Development happens in 2-week sprints with regular updates. You get access to a staging environment to see progress in real-time.", iconName: "Code2", color: "text-yellow-500" },
        { id: 4, title: "Quality Assurance", desc: "Rigorous testing across devices and browsers. We perform security audits, performance benchmarking, and accessibility checks.", iconName: "ClipboardCheck", color: "text-red-500" },
        { id: 5, title: "Launch & Training", desc: "Seamless deployment to your production environment. We provide training sessions and documentation for your team to manage the platform.", iconName: "Rocket", color: "text-green-500" },
        { id: 6, title: "Evolution", desc: "Post-launch monitoring and iterative improvements based on user data. We ensure your product stays ahead of the curve.", iconName: "HeartPulse", color: "text-cyan-500" }
    ],
    startId: 1,
    faqs: [
        { id: "timeline", category: "General", question: "How long does a typical project take?", answer: "Timeline depends on complexity. A simple website takes 2-4 weeks, while a complex web app can take 2-4 months. We provide a detailed Gantt chart during the onboarding phase so you always know what to expect." },
        { id: "hosting", category: "Technical", question: "Do you provide hosting services?", answer: "We typically set up hosting for you on industry-standard platforms like AWS, Vercel, or DigitalOcean. You retain full ownership of the accounts. We can also manage the infrastructure for a monthly maintenance fee." },
        { id: "payment", category: "Billing", question: "What is your payment structure?", answer: "We work on a milestone basis to ensure trust. Typically, it's 40% upfront to kickstart resources, 30% after the design phase approval, and 30% upon final delivery and deployment." },
        { id: "redesign", category: "General", question: "Can you update my existing website?", answer: "Yes! We specialize in modernization. We can refactor your legacy code, improve performance metrics (Core Web Vitals), and give the UI a fresh '2026' aesthetic without losing your SEO ranking." },
        { id: "support", category: "Support", question: "Do you offer post-launch support?", answer: "Absolutely. All our packages come with a 30-day bug-fix warranty. Beyond that, we offer tiered maintenance plans that cover security updates, feature additions, and server monitoring." },
        { id: "tech", category: "Technical", question: "What technologies do you use?", answer: "We are full-stack experts. Frontend: React, Next.js, Tailwind, Three.js. Backend: Node.js, Python (Django/FastAPI), Go. Database: PostgreSQL, MongoDB, Redis. We choose the best tool for your specific goals." }
    ],
    techStack: [
        { id: "frontend", label: "Frontend", iconName: "Layout", description: "Pixel-perfect interfaces", techs: ["React", "Next.js 14", "Vue.js", "Tailwind CSS", "Framer Motion", "Three.js", "TypeScript", "Redux"] },
        { id: "backend", label: "Backend", iconName: "Server", description: "Robust scalable logic", techs: ["Node.js", "NestJS", "Express", "Python", "Django", "GoLang", "GraphQL", "WebSockets"] },
        { id: "database", label: "Database", iconName: "Database", description: "High-performance storage", techs: ["PostgreSQL", "MongoDB", "Redis", "Supabase", "Prisma", "MySQL", "Elasticsearch"] },
        { id: "cloud", label: "DevOps & Cloud", iconName: "Cloud", description: "CI/CD & Infrastructure", techs: ["AWS", "Vercel", "Docker", "Kubernetes", "Terraform", "GitHub Actions", "Cloudflare"] },
        { id: "ai", label: "AI & ML", iconName: "Brain", description: "Intelligent solutions", techs: ["OpenAI API", "PyTorch", "TensorFlow", "LangChain", "Hugging Face", "Pinecone", "LlamaIndex"] },
        { id: "mobile", label: "Mobile", iconName: "Smartphone", description: "Native experiences", techs: ["React Native", "Expo", "Flutter", "Swift", "Kotlin", "PWA"] }
    ],
    lastUpdated: new Date().toISOString()
};

export const useServicesContentStore = create<ServicesContentState>()(
    persist(
        immer((set) => ({
            content: defaultContent,
            isLoading: false,
            isSaving: false,
            error: null,

            setContent: (content) => set({ content: { ...content, lastUpdated: new Date().toISOString() } }),

            updateHeroVideo: (url) => set((state) => {
                if (state.content) {
                    state.content.heroVideoUrl = url;
                    state.content.lastUpdated = new Date().toISOString();
                }
            }),

            addServiceItem: (item) => set((state) => {
                if (state.content) {
                    state.content.overview.push(item);
                    state.content.lastUpdated = new Date().toISOString();
                }
            }),

            updateServiceItem: (id, item) => set((state) => {
                if (state.content) {
                    const index = state.content.overview.findIndex(p => p.id === id);
                    if (index !== -1) {
                        state.content.overview[index] = { ...state.content.overview[index], ...item };
                        state.content.lastUpdated = new Date().toISOString();
                    }
                }
            }),

            deleteServiceItem: (id) => set((state) => {
                if (state.content) {
                    state.content.overview = state.content.overview.filter(p => p.id !== id);
                    state.content.lastUpdated = new Date().toISOString();
                }
            }),

            addComparisonFeature: (feature) => set((state) => {
                if (state.content) {
                    state.content.comparison.features.push(feature);
                    state.content.comparison.tiers.forEach(tier => {
                        tier.features.push(false);
                    });
                    state.content.lastUpdated = new Date().toISOString();
                }
            }),

            updateComparisonFeature: (index, feature) => set((state) => {
                if (state.content && state.content.comparison.features[index]) {
                    state.content.comparison.features[index] = feature;
                    state.content.lastUpdated = new Date().toISOString();
                }
            }),

            deleteComparisonFeature: (index) => set((state) => {
                if (state.content) {
                    state.content.comparison.features.splice(index, 1);
                    state.content.comparison.tiers.forEach(tier => {
                        tier.features.splice(index, 1);
                    });
                    state.content.lastUpdated = new Date().toISOString();
                }
            }),

            addComparisonTier: (tier) => set((state) => {
                if (state.content) {
                    state.content.comparison.tiers.push(tier);
                    state.content.lastUpdated = new Date().toISOString();
                }
            }),

            updateComparisonTier: (id, tier) => set((state) => {
                if (state.content) {
                    const index = state.content.comparison.tiers.findIndex(p => p.id === id);
                    if (index !== -1) {
                        state.content.comparison.tiers[index] = { ...state.content.comparison.tiers[index], ...tier };
                        state.content.lastUpdated = new Date().toISOString();
                    }
                }
            }),

            deleteComparisonTier: (id) => set((state) => {
                if (state.content) {
                    state.content.comparison.tiers = state.content.comparison.tiers.filter(p => p.id !== id);
                    state.content.lastUpdated = new Date().toISOString();
                }
            }),

            addPackage: (pkg) => set((state) => {
                if (state.content) {
                    state.content.packages.push(pkg);
                    state.content.lastUpdated = new Date().toISOString();
                }
            }),

            updatePackage: (id, pkg) => set((state) => {
                if (state.content) {
                    const index = state.content.packages.findIndex(p => p.id === id);
                    if (index !== -1) {
                        state.content.packages[index] = { ...state.content.packages[index], ...pkg };
                        state.content.lastUpdated = new Date().toISOString();
                    }
                }
            }),

            deletePackage: (id) => set((state) => {
                if (state.content) {
                    state.content.packages = state.content.packages.filter(p => p.id !== id);
                    state.content.lastUpdated = new Date().toISOString();
                }
            }),

            addProcessStep: (step) => set((state) => {
                if (state.content) {
                    state.content.process.push(step);
                    state.content.lastUpdated = new Date().toISOString();
                }
            }),

            updateProcessStep: (id, step) => set((state) => {
                if (state.content) {
                    const index = state.content.process.findIndex(p => p.id === id);
                    if (index !== -1) {
                        state.content.process[index] = { ...state.content.process[index], ...step };
                        state.content.lastUpdated = new Date().toISOString();
                    }
                }
            }),

            deleteProcessStep: (id) => set((state) => {
                if (state.content) {
                    state.content.process = state.content.process.filter(p => p.id !== id);
                    state.content.lastUpdated = new Date().toISOString();
                }
            }),

            addFAQ: (item) => set((state) => {
                if (state.content) {
                    state.content.faqs.push(item);
                    state.content.lastUpdated = new Date().toISOString();
                }
            }),

            updateFAQ: (id, item) => set((state) => {
                if (state.content) {
                    const index = state.content.faqs.findIndex(p => p.id === id);
                    if (index !== -1) {
                        state.content.faqs[index] = { ...state.content.faqs[index], ...item };
                        state.content.lastUpdated = new Date().toISOString();
                    }
                }
            }),

            deleteFAQ: (id) => set((state) => {
                if (state.content) {
                    state.content.faqs = state.content.faqs.filter(p => p.id !== id);
                    state.content.lastUpdated = new Date().toISOString();
                }
            }),

            addTechCategory: (category) => set((state) => {
                if (state.content) {
                    state.content.techStack.push(category);
                    state.content.lastUpdated = new Date().toISOString();
                }
            }),

            updateTechCategory: (id, category) => set((state) => {
                if (state.content) {
                    const index = state.content.techStack.findIndex(p => p.id === id);
                    if (index !== -1) {
                        state.content.techStack[index] = { ...state.content.techStack[index], ...category };
                        state.content.lastUpdated = new Date().toISOString();
                    }
                }
            }),

            deleteTechCategory: (id) => set((state) => {
                if (state.content) {
                    state.content.techStack = state.content.techStack.filter(p => p.id !== id);
                    state.content.lastUpdated = new Date().toISOString();
                }
            }),

            resetToDefaults: () => set({ content: defaultContent })
        })),
        {
            name: 'services-content-storage',
            storage: createJSONStorage(() => localStorage),
        }
    )
);
