
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
        badge: "Intelligence Protection Node",
        titlePrefix: "Privacy",
        titleHighlight: "Protocol",
        description: "High-fidelity data governance and identity protection protocols for the Oftisoft architect community.",
        videoUrl: ""
    },
    features: [
        {
            id: "feat-1",
            title: "Zero-Knowledge Sync",
            iconName: "Lock",
            color: "text-blue-500",
            description: "Our global proxies utilize zero-knowledge architecture to ensure your professional artifacts remain private during node transmission."
        },
        {
            id: "feat-2",
            title: "Identity Fingerprinting",
            iconName: "Fingerprint",
            color: "text-primary",
            description: "Advanced MFA and biometric neural verification protect your administrative access to the platform's core-nodes."
        },
        {
            id: "feat-3",
            title: "Encrypted Data Vaults",
            iconName: "Database",
            color: "text-purple-500",
            description: "All project intelligence and digital artifacts are stored in distributed, P2P encrypted repositories across our edge network."
        },
        {
            id: "feat-4",
            title: "Anonymous Intelligence",
            iconName: "Eye",
            color: "text-green-500",
            description: "We anonymize all neural training inputs to prevent the extraction of proprietary logic from your bespoke implementations."
        },
        {
            id: "feat-5",
            title: "Edge Security Proxy",
            iconName: "Server",
            color: "text-orange-500",
            description: "Sub-10ms secure tunneling for all visual engine previews and multi-device simulation requests."
        },
        {
            id: "feat-6",
            title: "Governance Compliance",
            iconName: "Globe",
            color: "text-indigo-500",
            description: "Oftisoft operates in full alignment with global data sovereignty frameworks including GDPR, CCPA, and 2026 Digital Acts."
        },
    ],
    guarantee: {
        title: "Trust the Core.",
        description: "Our commitment to professional privacy is encoded into the very logic-nodes of the Oftisoft engine. We don't just protect data; we engineer trust into the foundation of your digital ecosystem.",
        stats: [
            { value: "AES-256-X", label: "Baseline Encryption" },
            { value: "99.999%", label: "Identity Security" }
        ]
    },
    footer: {
        status: "Digital Privacy Sync Status: OPERATIONAL / 2026.4.2"
    },
    lastUpdated: new Date().toISOString()
};

export const usePrivacyContentStore = create<PrivacyContentState>()(
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

            resetToDefaults: () => set({ content: defaultContent })
        })),
        {
            name: 'privacy-content-storage',
            storage: createJSONStorage(() => localStorage),
        }
    )
);
