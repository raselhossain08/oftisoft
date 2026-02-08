
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

export interface PartnerItem {
    id: string;
    name: string;
    role: string;
    desc: string;
    iconName: string;
    logoImage?: string;
    color: string;
    order: number;
}

export interface EcosystemBrand {
    id: string;
    name: string;
}

export interface PartnersPageContent {
    header: {
        badge: string;
        titlePrefix: string;
        titleHighlight: string;
        description: string;
        videoUrl?: string;
    };
    partners: PartnerItem[];
    cta: {
        title: string;
        description: string;
        buttonText: string;
        subText: string;
    };
    ecosystem: {
        title: string;
        brands: EcosystemBrand[];
    };
    lastUpdated: string;
}

interface PartnersContentState {
    content: PartnersPageContent | null;
    isLoading: boolean;
    isSaving: boolean;
    error: string | null;

    // Actions
    setContent: (content: PartnersPageContent) => void;
    updateHeader: (header: Partial<PartnersPageContent['header']>) => void;
    updateCTA: (cta: Partial<PartnersPageContent['cta']>) => void;
    updateEcosystemTitle: (title: string) => void;

    // Partners
    addPartner: (item: PartnerItem) => void;
    updatePartner: (id: string, item: Partial<PartnerItem>) => void;
    deletePartner: (id: string) => void;

    // Ecosystem Brands
    addBrand: (brand: EcosystemBrand) => void;
    updateBrand: (id: string, brand: Partial<EcosystemBrand>) => void;
    deleteBrand: (id: string) => void;

    resetToDefaults: () => void;
}

const defaultContent: PartnersPageContent = {
    header: {
        badge: "Global Alliance Matrix",
        titlePrefix: "Strategic",
        titleHighlight: "Partners",
        description: "Collaborating with the world's most innovative neural operatives to expand the Oftisoft architectural meta-layer.",
        videoUrl: ""
    },
    partners: [
        {
            id: "part-1",
            name: "Neural Foundry",
            role: "Intelligence Infrastructure",
            desc: "Collaborating on the core RAG engines that power Oftisoft's visual forge.",
            iconName: "Zap",
            color: "text-primary",
            order: 1
        },
        {
            id: "part-2",
            name: "Edge Stream",
            role: "CDN Optimization",
            desc: "Ensuring sub-10ms delivery of development artifacts across 48+ global zones.",
            iconName: "Globe",
            color: "text-blue-500",
            order: 2
        },
        {
            id: "part-3",
            name: "Artifact Labs",
            role: "UI Kit Distribution",
            desc: "Primary contributor to our baseline 2026 aesthetics and primitive UI nodes.",
            iconName: "Sparkles",
            color: "text-purple-500",
            order: 3
        },
        {
            id: "part-4",
            name: "Sync Security",
            role: "Identity Governance",
            desc: "Powering the hyper-secure MFA and biometric neural verification protocols.",
            iconName: "ShieldCheck",
            color: "text-green-500",
            order: 4
        }
    ],
    cta: {
        title: "Join the Alliance.",
        description: "Are you building the next generation of neural design tools or high-fidelity development infrastructure? Sync with our partnership core.",
        buttonText: "Initiate Partnership Node",
        subText: "Alliance Sync Response: Sub-48h Cycle"
    },
    ecosystem: {
        title: "Synchronized Ecosystem Operatives",
        brands: [
            { id: "brand-1", name: "NEURAL" },
            { id: "brand-2", name: "FORGE" },
            { id: "brand-3", name: "EDGE" },
            { id: "brand-4", name: "SYNC" },
            { id: "brand-5", name: "VAULT" }
        ]
    },
    lastUpdated: new Date().toISOString()
};

export const usePartnersContentStore = create<PartnersContentState>()(
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

            updateEcosystemTitle: (title) => set((state) => {
                if (state.content) {
                    state.content.ecosystem.title = title;
                    state.content.lastUpdated = new Date().toISOString();
                }
            }),

            addPartner: (item) => set((state) => {
                if (state.content) {
                    state.content.partners.push(item);
                    state.content.lastUpdated = new Date().toISOString();
                }
            }),

            updatePartner: (id, item) => set((state) => {
                if (state.content) {
                    const index = state.content.partners.findIndex(p => p.id === id);
                    if (index !== -1) {
                        state.content.partners[index] = { ...state.content.partners[index], ...item };
                        state.content.lastUpdated = new Date().toISOString();
                    }
                }
            }),

            deletePartner: (id) => set((state) => {
                if (state.content) {
                    state.content.partners = state.content.partners.filter(p => p.id !== id);
                    state.content.lastUpdated = new Date().toISOString();
                }
            }),

            addBrand: (brand) => set((state) => {
                if (state.content) {
                    state.content.ecosystem.brands.push(brand);
                    state.content.lastUpdated = new Date().toISOString();
                }
            }),

            updateBrand: (id, brand) => set((state) => {
                if (state.content) {
                    const index = state.content.ecosystem.brands.findIndex(b => b.id === id);
                    if (index !== -1) {
                        state.content.ecosystem.brands[index] = { ...state.content.ecosystem.brands[index], ...brand };
                        state.content.lastUpdated = new Date().toISOString();
                    }
                }
            }),

            deleteBrand: (id) => set((state) => {
                if (state.content) {
                    state.content.ecosystem.brands = state.content.ecosystem.brands.filter(b => b.id !== id);
                    state.content.lastUpdated = new Date().toISOString();
                }
            }),

            resetToDefaults: () => set({ content: defaultContent })
        })),
        {
            name: 'partners-content-storage',
            storage: createJSONStorage(() => localStorage),
        }
    )
);
