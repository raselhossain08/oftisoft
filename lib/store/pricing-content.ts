
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
        badge: "Pricing",
        titlePrefix: "Pricing",
        titleHighlight: "That fits",
        description: "Straightforward pricing for content, website, and SEO work that actually needs to be used.",
        videoUrl: ""
    },
    plans: [
        {
            id: "plan-1",
            name: "Starter",
            description: "Best for small projects, landing pages, or MVP launches.",
            price: "1,999",
            period: "One-time",
            features: [
                "Up to 5 pages / screens",
                "Responsive design included",
                "Basic SEO optimization",
                "1 revision round",
                "5 business day delivery",
                "Email support"
            ],
            buttonText: "Get Started",
            popular: false,
            order: 1
        },
        {
            id: "plan-2",
            name: "Growth",
            description: "Best for multi-page websites, dashboards, and content platforms.",
            price: "4,999",
            period: "One-time",
            features: [
                "Up to 15 pages / screens",
                "Full-stack development",
                "Database + API integration",
                "Admin dashboard included",
                "3 revision rounds",
                "Priority support (48hr response)",
                "Deployment assistance"
            ],
            buttonText: "Choose Growth",
            popular: true,
            order: 2
        },
        {
            id: "plan-3",
            name: "Enterprise",
            description: "Best for teams needing custom architecture, AI integration, or complex systems.",
            price: "Custom",
            period: "Quote",
            features: [
                "Unlimited pages / screens",
                "Custom architecture design",
                "AI/ML integration ready",
                "Third-party API integrations",
                "CI/CD pipeline setup",
                "Dedicated project manager",
                "Ongoing maintenance options",
                "SLA guarantee"
            ],
            buttonText: "Request Quote",
            popular: false,
            order: 3
        }
    ],
    consultation: {
        text: "Need a custom scope or larger rollout?",
        linkText: "Book a consultation"
    },
    lastUpdated: new Date().toISOString()
};

export const usePricingContentStore = create<PricingContentState>()(
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

            resetToDefaults: () => set({ content: null })
        })),
        {
            name: 'pricing-content-storage',
            storage: createJSONStorage(() => localStorage),
        }
    )
);

