
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
        badge: "Partners",
        titlePrefix: "Strategic",
        titleHighlight: "Partners",
        description: "We work with teams that care about content quality, brand clarity, and a site that feels finished.",
        videoUrl: ""
    },
    partners: [
        {
            id: "part-1",
            name: "Content Studio",
            role: "Copy & Messaging",
            desc: "Helps shape clear page language, page titles, and supporting descriptions.",
            iconName: "Zap",
            color: "text-primary",
            order: 1
        },
        {
            id: "part-2",
            name: "Search Partner",
            role: "SEO Support",
            desc: "Helps refine metadata, headings, and content structure for discoverability.",
            iconName: "Globe",
            color: "text-blue-500",
            order: 2
        },
        {
            id: "part-3",
            name: "Design Partner",
            role: "UI Refinement",
            desc: "Keeps the visual language consistent across page sections and content cards.",
            iconName: "Sparkles",
            color: "text-purple-500",
            order: 3
        },
        {
            id: "part-4",
            name: "Support Partner",
            role: "Launch Operations",
            desc: "Helps keep contact, support, and status information current after launch.",
            iconName: "ShieldCheck",
            color: "text-green-500",
            order: 4
        }
    ],
    cta: {
        title: "Want to collaborate?",
        description: "We’re open to teams that want practical help with content, SEO, and website quality.",
        buttonText: "Talk Partnership",
        subText: "Replies within 2 business days"
    },
    ecosystem: {
        title: "Aligned Ecosystem",
        brands: [
            { id: "brand-1", name: "CONTENT" },
            { id: "brand-2", name: "SEO" },
            { id: "brand-3", name: "DESIGN" },
            { id: "brand-4", name: "SUPPORT" },
            { id: "brand-5", name: "LAUNCH" }
        ]
    },
    lastUpdated: new Date().toISOString()
};

export const usePartnersContentStore = create<PartnersContentState>()(
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

            resetToDefaults: () => set({ content: null })
        })),
        {
            name: 'partners-content-storage',
            storage: createJSONStorage(() => localStorage),
        }
    )
);

