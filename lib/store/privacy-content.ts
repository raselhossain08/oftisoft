
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

export interface PrivacyFeature {
    id: string;
    title: string;
    iconName: string;
    iconImage?: string;
    color: string;
    description: string;
}

export interface PrivacyStat {
    value: string;
    label: string;
}

export interface PrivacyPageContent {
    header: {
        badge: string;
        titlePrefix: string;
        titleHighlight: string;
        description: string;
        videoUrl?: string;
    };
    features: PrivacyFeature[];
    guarantee: {
        title: string;
        description: string;
        stats: PrivacyStat[];
    };
    footer: {
        status: string;
    };
    lastUpdated: string;
}

interface PrivacyContentState {
    content: PrivacyPageContent | null;
    isLoading: boolean;
    isSaving: boolean;
    error: string | null;

    // Actions
    setContent: (content: PrivacyPageContent) => void;
    updateHeader: (header: Partial<PrivacyPageContent['header']>) => void;
    updateGuarantee: (guarantee: Partial<PrivacyPageContent['guarantee']>) => void;
    updateFooter: (footer: Partial<PrivacyPageContent['footer']>) => void;

    // Features
    addFeature: (item: PrivacyFeature) => void;
    updateFeature: (id: string, item: Partial<PrivacyFeature>) => void;
    deleteFeature: (id: string) => void;

    // Stats
    updateStat: (index: number, stat: PrivacyStat) => void;
    addStat: (stat: PrivacyStat) => void;
    deleteStat: (index: number) => void;

    resetToDefaults: () => void;
}

const defaultContent: PrivacyPageContent = {
    header: {
        badge: "Privacy",
        titlePrefix: "Privacy",
        titleHighlight: "Policy",
        description: "We keep user data handling clear, responsible, and easy to understand.",
        videoUrl: ""
    },
    features: [
        {
            id: "feat-1",
            title: "Data Minimization",
            iconName: "Lock",
            color: "text-blue-500",
            description: "We only collect the information needed to operate the site and respond to messages."
        },
        {
            id: "feat-2",
            title: "Secure Access",
            iconName: "Fingerprint",
            color: "text-primary",
            description: "Administrative access is limited to the people who need it, with standard authentication controls."
        },
        {
            id: "feat-3",
            title: "Encrypted Storage",
            iconName: "Database",
            color: "text-purple-500",
            description: "Submitted messages and project details are stored with common encryption practices."
        },
        {
            id: "feat-4",
            title: "No Unnecessary Sharing",
            iconName: "Eye",
            color: "text-green-500",
            description: "We do not sell personal data or use it for unrelated profiling."
        },
        {
            id: "feat-5",
            title: "Secure Delivery",
            iconName: "Server",
            color: "text-orange-500",
            description: "Forms and requests are routed through standard secure transport layers."
        },
        {
            id: "feat-6",
            title: "Compliance Mindset",
            iconName: "Globe",
            color: "text-indigo-500",
            description: "We aim to keep our handling of data aligned with common privacy expectations and applicable law."
        },
    ],
    guarantee: {
        title: "Trust built in.",
        description: "We want privacy handling to feel clear, ordinary, and respectful instead of buried in jargon.",
        stats: [
            { value: "Clear", label: "Data Policy" },
            { value: "Limited", label: "Collection Scope" }
        ]
    },
    footer: {
        status: "Privacy review current as of 2026-04-22"
    },
    lastUpdated: new Date().toISOString()
};

export const usePrivacyContentStore = create<PrivacyContentState>()(
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

            updateGuarantee: (guarantee) => set((state) => {
                if (state.content) {
                    state.content.guarantee = { ...state.content.guarantee, ...guarantee };
                    state.content.lastUpdated = new Date().toISOString();
                }
            }),

            updateFooter: (footer) => set((state) => {
                if (state.content) {
                    state.content.footer = { ...state.content.footer, ...footer };
                    state.content.lastUpdated = new Date().toISOString();
                }
            }),

            addFeature: (item) => set((state) => {
                if (state.content) {
                    state.content.features.push(item);
                    state.content.lastUpdated = new Date().toISOString();
                }
            }),

            updateFeature: (id, item) => set((state) => {
                if (state.content) {
                    const index = state.content.features.findIndex(p => p.id === id);
                    if (index !== -1) {
                        state.content.features[index] = { ...state.content.features[index], ...item };
                        state.content.lastUpdated = new Date().toISOString();
                    }
                }
            }),

            deleteFeature: (id) => set((state) => {
                if (state.content) {
                    state.content.features = state.content.features.filter(p => p.id !== id);
                    state.content.lastUpdated = new Date().toISOString();
                }
            }),

            updateStat: (index, stat) => set((state) => {
                if (state.content && state.content.guarantee.stats[index]) {
                    state.content.guarantee.stats[index] = stat;
                    state.content.lastUpdated = new Date().toISOString();
                }
            }),

            addStat: (stat) => set((state) => {
                if (state.content) {
                    state.content.guarantee.stats.push(stat);
                    state.content.lastUpdated = new Date().toISOString();
                }
            }),

            deleteStat: (index) => set((state) => {
                if (state.content && state.content.guarantee.stats[index]) {
                    state.content.guarantee.stats.splice(index, 1);
                    state.content.lastUpdated = new Date().toISOString();
                }
            }),

            resetToDefaults: () => set({ content: null })
        })),
        {
            name: 'privacy-content-storage',
            storage: createJSONStorage(() => localStorage),
        }
    )
);

