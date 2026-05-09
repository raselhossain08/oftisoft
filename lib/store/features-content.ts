
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

export interface FeatureItem {
    id: string;
    title: string;
    description: string;
    iconName: string;
    color: string;
    order: number;
}

export interface FeaturesPageContent {
    header: {
        badge: string;
        titlePrefix: string;
        titleHighlight: string;
        description: string;
    };
    features: FeatureItem[];
    showcase: {
        title: string;
        description: string;
        badgeText: string;
        statusText: string;
    };
    lastUpdated: string;
}

interface FeaturesContentState {
    content: FeaturesPageContent | null;
    isLoading: boolean;
    isSaving: boolean;
    error: string | null;

    // Actions
    setContent: (content: FeaturesPageContent) => void;
    updateHeader: (header: Partial<FeaturesPageContent['header']>) => void;
    updateShowcase: (showcase: Partial<FeaturesPageContent['showcase']>) => void;

    // Features
    addFeature: (feature: FeatureItem) => void;
    updateFeature: (id: string, feature: Partial<FeatureItem>) => void;
    deleteFeature: (id: string) => void;

    resetToDefaults: () => void;
}

const defaultContent: FeaturesPageContent = {
    header: {
        badge: "What the site supports",
        titlePrefix: "Platform",
        titleHighlight: "Features",
        description: "Oftisoft pages use reusable content, SEO-friendly structure, and original copy across the full marketing site."
    },
    features: [
        {
            id: "feat-1",
            title: "Original Page Copy",
            description: "Every page is written to match the brand voice instead of sounding like a placeholder demo.",
            iconName: "Cpu",
            color: "text-primary",
            order: 1
        },
        {
            id: "feat-2",
            title: "SEO Structure",
            description: "Headings, descriptions, and page sections are arranged so the content is easier to index and read.",
            iconName: "Globe",
            color: "text-blue-500",
            order: 2
        },
        {
            id: "feat-3",
            title: "Reusable Content Blocks",
            description: "The same content model can power marketing pages, support pages, and blog sections without duplication.",
            iconName: "ShieldCheck",
            color: "text-green-500",
            order: 3
        },
        {
            id: "feat-4",
            title: "Launch Ready",
            description: "The website content is prepared for a real launch, not just a proof of concept.",
            iconName: "Layers",
            color: "text-purple-500",
            order: 4
        }
    ],
    showcase: {
        title: "Content System in Motion",
        description: "Pages, blogs, and supporting sections all share one coherent voice.",
        badgeText: "LIVE",
        statusText: "SITE CONTENT READY"
    },
    lastUpdated: new Date().toISOString()
};

export const useFeaturesContentStore = create<FeaturesContentState>()(
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

            updateShowcase: (showcase) => set((state) => {
                if (state.content) {
                    state.content.showcase = { ...state.content.showcase, ...showcase };
                    state.content.lastUpdated = new Date().toISOString();
                }
            }),

            addFeature: (feature) => set((state) => {
                if (state.content) {
                    state.content.features.push(feature);
                    state.content.lastUpdated = new Date().toISOString();
                }
            }),

            updateFeature: (id, feature) => set((state) => {
                if (state.content) {
                    const index = state.content.features.findIndex(f => f.id === id);
                    if (index !== -1) {
                        state.content.features[index] = { ...state.content.features[index], ...feature };
                        state.content.lastUpdated = new Date().toISOString();
                    }
                }
            }),

            deleteFeature: (id) => set((state) => {
                if (state.content) {
                    state.content.features = state.content.features.filter(f => f.id !== id);
                    state.content.lastUpdated = new Date().toISOString();
                }
            }),

            resetToDefaults: () => set({ content: null })
        })),
        {
            name: 'features-content-storage',
            storage: createJSONStorage(() => localStorage),
        }
    )
);

