
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

export interface ProjectItem {
    id: string;
    title: string;
    category: string;
    image: string | null;
    tags: string[];
    description: string;
    longDescription: string;
    client: string;
    stats: { label: string; value: string }[];
    gradient: string;
}

export interface PortfolioPageContent {
    header: {
        badge: string;
        title: string;
        description: string;
        videoUrl?: string;
    };
    projects: ProjectItem[];
    lastUpdated: string;
}

interface PortfolioContentState {
    content: PortfolioPageContent | null;
    isLoading: boolean;
    isSaving: boolean;
    error: string | null;

    // Actions
    setContent: (content: PortfolioPageContent) => void;
    updateHeader: (header: Partial<PortfolioPageContent['header']>) => void;

    // Projects
    addProject: (item: ProjectItem) => void;
    updateProject: (id: string, item: Partial<ProjectItem>) => void;
    deleteProject: (id: string) => void;

    resetToDefaults: () => void;
}

const defaultContent: PortfolioPageContent = {
    header: {
        badge: "World Class Engineering",
        title: "Success Stories",
        description: "We build digital products that scale. Explore our portfolio of award-winning applications and systems.",
        videoUrl: ""
    },
    projects: [
        {
            id: "proj-1",
            title: "EcoSmart E-commerce",
            category: "Ecommerce",
            image: null,
            tags: ["Next.js", "Stripe", "Tailwind", "Redis"],
            description: "A sustainable fashion marketplace with real-time inventory.",
            longDescription: "EcoSmart is a pioneering e-commerce platform dedicated to sustainable fashion. We engineered a real-time inventory system using Redis and developed a personalized recommendation engine that increased conversion rates by 40%.",
            client: "EcoLife Inc.",
            stats: [{ label: "ROI", value: "250%" }, { label: "Sales", value: "$2M+" }],
            gradient: "from-emerald-500/20 to-teal-500/20"
        },
        {
            id: "proj-2",
            title: "FinTech Analytics Core",
            category: "Enterprise",
            image: null,
            tags: ["React", "D3.js", "Node.js", "GraphQL"],
            description: "High-performance dashboard processing millions of transactions.",
            longDescription: "Built for high-frequency trading firms, this dashboard visualizes millions of data points in real-time without rendering lag. Utilizes WebWorkers and canvas-based rendering for maximum performance.",
            client: "FinanceFlow",
            stats: [{ label: "Latency", value: "<50ms" }, { label: "Users", value: "50k" }],
            gradient: "from-blue-600/20 to-indigo-600/20"
        },
        {
            id: "proj-3",
            title: "Nexus AI Assistant",
            category: "AI",
            image: null,
            tags: ["Python", "LangChain", "FastAPI", "Pinecone"],
            description: "Customer service automation handling 80% of inquiries.",
            longDescription: "A context-aware AI agent that integrates with existing helpdesk categories. It uses RAG (Retrieval Augmented Generation) to provide accurate answers based on company knowledge bases.",
            client: "TechHelp",
            stats: [{ label: "Automation", value: "80%" }, { label: "Cost Saving", value: "40%" }],
            gradient: "from-purple-600/20 to-pink-600/20"
        },
        {
            id: "proj-4",
            title: "Nomad Travel App",
            category: "Mobile",
            image: null,
            tags: ["React Native", "Firebase", "Google Maps"],
            description: "Cross-platform mobile app for offline travel planning.",
            longDescription: "Designed for digital nomads, this app features robust offline-first architecture. Syncs data automatically when connection is restored, ensuring seamless travel planning in remote areas.",
            client: "GoTravel",
            stats: [{ label: "Downloads", value: "100k+" }, { label: "Rating", value: "4.8" }],
            gradient: "from-orange-500/20 to-yellow-500/20"
        },
        {
            id: "proj-5",
            title: "MediCare Portal",
            category: "Enterprise",
            image: null,
            tags: ["Next.js", "PostgreSQL", "HIPAA", "Docker"],
            description: "Secure patient management system for hospital networks.",
            longDescription: "A HIPAA-compliant platform connecting patients with doctors. Features end-to-end encryption for all medical records and a highly accessible UI for elderly patients.",
            client: "MediCare",
            stats: [{ label: "Efficiency", value: "+45%" }, { label: "Security", value: "100%" }],
            gradient: "from-cyan-500/20 to-blue-500/20"
        },
        {
            id: "proj-6",
            title: "Chronos Luxury",
            category: "Web",
            image: null,
            tags: ["GSAP", "Three.js", "WebGL", "Blender"],
            description: "Award-winning immersive 3D website for luxury watches.",
            longDescription: "To capturing the craftsmanship of luxury timepieces, we built a fully 3D interactive product showcase using Three.js and WebGL. The result is a showroom experience in the browser.",
            client: "Chronos",
            stats: [{ label: "Traffic", value: "500k" }, { label: "Awards", value: "3" }],
            gradient: "from-amber-600/20 to-red-600/20"
        }
    ],
    lastUpdated: new Date().toISOString()
};

export const usePortfolioContentStore = create<PortfolioContentState>()(
    persist(
        immer((set) => ({
            content: defaultContent,
            isLoading: false,
            isSaving: false,
            error: null,

            setContent: (content) => set({ content: { ...content, lastUpdated: new Date().toISOString() } }),

            updateHeader: (header) => set((state) => {
                if (state.content) {
                    state.content.header = { ...state.content.header, ...header };
                    state.content.lastUpdated = new Date().toISOString();
                }
            }),

            addProject: (item) => set((state) => {
                if (state.content) {
                    state.content.projects.push(item);
                    state.content.lastUpdated = new Date().toISOString();
                }
            }),

            updateProject: (id, item) => set((state) => {
                if (state.content) {
                    const index = state.content.projects.findIndex(p => p.id === id);
                    if (index !== -1) {
                        state.content.projects[index] = { ...state.content.projects[index], ...item };
                        state.content.lastUpdated = new Date().toISOString();
                    }
                }
            }),

            deleteProject: (id) => set((state) => {
                if (state.content) {
                    state.content.projects = state.content.projects.filter(p => p.id !== id);
                    state.content.lastUpdated = new Date().toISOString();
                }
            }),

            resetToDefaults: () => set({ content: defaultContent })
        })),
        {
            name: 'portfolio-content-storage',
            storage: createJSONStorage(() => localStorage),
        }
    )
);
