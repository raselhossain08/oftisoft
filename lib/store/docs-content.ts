
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
        badge: "Docs",
        title: "Documentation",
        highlight: "Guides",
        placeholder: "Search docs and guides..."
    },
    categories: [
        { id: "cat-1", title: "Getting Started", iconName: "Layers", count: "12 Articles", color: "text-primary", order: 1 },
        { id: "cat-2", title: "Content Models", iconName: "Cpu", count: "8 Articles", color: "text-blue-500", order: 2 },
        { id: "cat-3", title: "SEO Setup", iconName: "ShieldCheck", count: "6 Articles", color: "text-green-500", order: 3 },
        { id: "cat-4", title: "Page Components", iconName: "Terminal", count: "15 Articles", color: "text-purple-500", order: 4 },
        { id: "cat-5", title: "Blog Publishing", iconName: "Zap", count: "24 Articles", color: "text-orange-500", order: 5 },
        { id: "cat-6", title: "Support & Contact", iconName: "Code2", count: "10 Articles", color: "text-indigo-500", order: 6 },
    ],
    cta: {
        title: "Practical Guides",
        description: "Find the instructions that help you edit content, structure pages, and keep the site consistent.",
        primaryButton: "Explore Docs",
        secondaryButton: "View Source"
    },
    support: [
        { id: "sup-1", title: "Support Ready", description: "Practical help for page content and site updates.", iconName: "MessageSquare", color: "text-blue-500" },
        { id: "sup-2", title: "System Healthy", description: "Documentation and content links stay organized and current.", iconName: "Zap", color: "text-green-500" }
    ],
    lastUpdated: new Date().toISOString()
};

export const useDocsContentStore = create<DocsContentState>()(
    persist(
        immer((set) => ({
            content: null,
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

            resetToDefaults: () => set({ content: null })
        })),
        {
            name: 'docs-content-storage',
            storage: createJSONStorage(() => localStorage),
        }
    )
);

