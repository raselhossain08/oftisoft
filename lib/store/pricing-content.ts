
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

export interface PricingPlan {
    id: string;
    name: string;
    description: string;
    price: string;
    period: string; // e.g. "MoonCycle", "Month", "Year"
    features: string[];
    buttonText: string;
    popular: boolean;
    iconImage?: string;
    order: number;
}

export interface PricingPageContent {
    header: {
        badge: string;
        titlePrefix: string;
        titleHighlight: string;
        description: string;
        videoUrl?: string;
    };
    plans: PricingPlan[];
    consultation: {
        text: string;
        linkText: string;
    };
    lastUpdated: string;
}

interface PricingContentState {
    content: PricingPageContent | null;
    isLoading: boolean;
    isSaving: boolean;
    error: string | null;

    // Actions
    setContent: (content: PricingPageContent) => void;
    updateHeader: (header: Partial<PricingPageContent['header']>) => void;
    updateConsultation: (consultation: Partial<PricingPageContent['consultation']>) => void;

    // Plans
    addPlan: (item: PricingPlan) => void;
    updatePlan: (id: string, item: Partial<PricingPlan>) => void;
    deletePlan: (id: string) => void;

    resetToDefaults: () => void;
}

const defaultContent: PricingPageContent = {
    header: {
        badge: "Fiscal Investment Matrix",
        titlePrefix: "Pricing",
        titleHighlight: "Protocol",
        description: "Secure high-fidelity development artifacts and architectural support via our subscription nodes.",
        videoUrl: ""
    },
    plans: [
        {
            id: "plan-1",
            name: "Starter Sync",
            description: "Perfect for individual builders and rapid prototyping.",
            price: "29",
            period: "MoonCycle",
            features: [
                "Access to 5 Premium UI Kits",
                "Next.js 15 Starter Templates",
                "Basic Community Support",
                "Global Edge Distribution",
                "2026 Aesthetic Design Tokens"
            ],
            buttonText: "Initiate Starter Node",
            popular: false,
            order: 1
        },
        {
            id: "plan-2",
            name: "Architect Core",
            description: "Professional grade tools for established development operations.",
            price: "99",
            period: "MoonCycle",
            features: [
                "All-Access Asset Library",
                "Neural Engine Priority Access",
                "24/7 Architectural Support",
                "Custom API Key Deployment",
                "Advanced Identity Governance",
                "Multi-Tenant SaaS Kits"
            ],
            buttonText: "Activate Core Node",
            popular: true,
            order: 2
        },
        {
            id: "plan-3",
            name: "Enterprise Edge",
            description: "Bespoke infrastructure solutions for hyper-scale enterprises.",
            price: "299",
            period: "MoonCycle",
            features: [
                "White-Label Implementation",
                "Private Edge Proxy Setup",
                "Dedicated Engineer Support",
                "Custom RAG System Forge",
                "Infinite Scale Guarantees",
                "On-Premise Deployment Ops"
            ],
            buttonText: "Request Enterprise Sync",
            popular: false,
            order: 3
        }
    ],
    consultation: {
        text: "Need a custom deployment configuration?",
        linkText: "Initiate Consultation Node"
    },
    lastUpdated: new Date().toISOString()
};

export const usePricingContentStore = create<PricingContentState>()(
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

            updateConsultation: (consultation) => set((state) => {
                if (state.content) {
                    state.content.consultation = { ...state.content.consultation, ...consultation };
                    state.content.lastUpdated = new Date().toISOString();
                }
            }),

            addPlan: (item) => set((state) => {
                if (state.content) {
                    state.content.plans.push(item);
                    state.content.lastUpdated = new Date().toISOString();
                }
            }),

            updatePlan: (id, item) => set((state) => {
                if (state.content) {
                    const index = state.content.plans.findIndex(p => p.id === id);
                    if (index !== -1) {
                        state.content.plans[index] = { ...state.content.plans[index], ...item };
                        state.content.lastUpdated = new Date().toISOString();
                    }
                }
            }),

            deletePlan: (id) => set((state) => {
                if (state.content) {
                    state.content.plans = state.content.plans.filter(p => p.id !== id);
                    state.content.lastUpdated = new Date().toISOString();
                }
            }),

            resetToDefaults: () => set({ content: defaultContent })
        })),
        {
            name: 'pricing-content-storage',
            storage: createJSONStorage(() => localStorage),
        }
    )
);
