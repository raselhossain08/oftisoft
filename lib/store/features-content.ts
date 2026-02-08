
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
        badge: "Core Capabilities Matrix",
        titlePrefix: "Platform",
        titleHighlight: "Features",
        description: "Engineer high-fidelity digital experiences with our suite of modern development tools and architectural nodes."
    },
    features: [
        {
            id: "feat-1",
            title: "Neural Artifact Generation",
            description: "Deploy production-grade code snippets and UI components using our proprietary neural engine with 2026 aesthetics.",
            iconName: "Cpu",
            color: "text-primary",
            order: 1
        },
        {
            id: "feat-2",
            title: "Global Edge Distribution",
            description: "All digital assets and documentation nodes are served via our high-speed global proxy for sub-10s latency.",
            iconName: "Globe",
            color: "text-blue-500",
            order: 2
        },
        {
            id: "feat-3",
            title: "Hyper-Secure Protocol",
            description: "Advanced MFA and identity governance built into every development node to protect your professional artifacts.",
            iconName: "ShieldCheck",
            color: "text-green-500",
            order: 3
        },
        {
            id: "feat-4",
            title: "Headless Forge Integration",
            description: "Scale your projects with a modular, headless architecture that adapts to any modern framework.",
            iconName: "Layers",
            color: "text-purple-500",
            order: 4
        }
    ],
    showcase: {
        title: "Integrated Visual Forge",
        description: "Real-time multi-device simulation and artifact deployment.",
        badgeText: "OPERATIONAL",
        statusText: "SUDO SYNC --NODES ACTIVE"
    },
    lastUpdated: new Date().toISOString()
};

export const useFeaturesContentStore = create<FeaturesContentState>()(
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

            resetToDefaults: () => set({ content: defaultContent })
        })),
        {
            name: 'features-content-storage',
            storage: createJSONStorage(() => localStorage),
        }
    )
);
