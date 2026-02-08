
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

export interface DocCategory {
    id: string;
    title: string;
    iconName: string;
    count: string;
    color: string;
    order: number;
}

export interface SupportCard {
    id: string;
    title: string;
    description: string;
    iconName: string;
    color: string;
}

export interface DocsPageContent {
    header: {
        badge: string;
        title: string;
        highlight: string;
        placeholder: string;
    };
    categories: DocCategory[];
    cta: {
        title: string;
        description: string;
        primaryButton: string;
        secondaryButton: string;
    };
    support: SupportCard[];
    lastUpdated: string;
}

interface DocsContentState {
    content: DocsPageContent | null;
    isLoading: boolean;
    isSaving: boolean;
    error: string | null;

    // Actions
    setContent: (content: DocsPageContent) => void;
    updateHeader: (header: Partial<DocsPageContent['header']>) => void;
    updateCTA: (cta: Partial<DocsPageContent['cta']>) => void;

    // Categories
    addCategory: (category: DocCategory) => void;
    updateCategory: (id: string, category: Partial<DocCategory>) => void;
    deleteCategory: (id: string) => void;

    // Support Cards
    updateSupportCard: (id: string, card: Partial<SupportCard>) => void;

    resetToDefaults: () => void;
}

const defaultContent: DocsPageContent = {
    header: {
        badge: "Intelligence Repositorium",
        title: "Documentation",
        highlight: "Protocol",
        placeholder: "Find architectural intelligence nodes..."
    },
    categories: [
        { id: "cat-1", title: "Core Architectural Nodes", iconName: "Layers", count: "12 Articles", color: "text-primary", order: 1 },
        { id: "cat-2", title: "Neural Forge Integration", iconName: "Cpu", count: "8 Articles", color: "text-blue-500", order: 2 },
        { id: "cat-3", title: "Identity & Security Governance", iconName: "ShieldCheck", count: "6 Articles", color: "text-green-500", order: 3 },
        { id: "cat-4", title: "Global SDK & Protocols", iconName: "Terminal", count: "15 Articles", color: "text-purple-500", order: 4 },
        { id: "cat-5", title: "Dashboard Implementation", iconName: "Zap", count: "24 Articles", color: "text-orange-500", order: 5 },
        { id: "cat-6", title: "API Configuration Engine", iconName: "Code2", count: "10 Articles", color: "text-indigo-500", order: 6 },
    ],
    cta: {
        title: "Advanced SDK Guides",
        description: "Unlock the full architectural potential of your development environment with our hyper-scaled SDK documentation nodes.",
        primaryButton: "Explore SDK Repo",
        secondaryButton: "View GitHub"
    },
    support: [
        { id: "sup-1", title: "Support Node ACTIVE", description: "Direct architectural assistance protocols.", iconName: "MessageSquare", color: "text-blue-500" },
        { id: "sup-2", title: "Status Operational", description: "99.99% Node uptime across all proxies.", iconName: "Zap", color: "text-green-500" }
    ],
    lastUpdated: new Date().toISOString()
};

export const useDocsContentStore = create<DocsContentState>()(
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

            updateCTA: (cta) => set((state) => {
                if (state.content) {
                    state.content.cta = { ...state.content.cta, ...cta };
                    state.content.lastUpdated = new Date().toISOString();
                }
            }),

            addCategory: (category) => set((state) => {
                if (state.content) {
                    state.content.categories.push(category);
                    state.content.lastUpdated = new Date().toISOString();
                }
            }),

            updateCategory: (id, category) => set((state) => {
                if (state.content) {
                    const index = state.content.categories.findIndex(c => c.id === id);
                    if (index !== -1) {
                        state.content.categories[index] = { ...state.content.categories[index], ...category };
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

            updateSupportCard: (id, card) => set((state) => {
                if (state.content) {
                    const index = state.content.support.findIndex(s => s.id === id);
                    if (index !== -1) {
                        state.content.support[index] = { ...state.content.support[index], ...card };
                        state.content.lastUpdated = new Date().toISOString();
                    }
                }
            }),

            resetToDefaults: () => set({ content: defaultContent })
        })),
        {
            name: 'docs-content-storage',
            storage: createJSONStorage(() => localStorage),
        }
    )
);
