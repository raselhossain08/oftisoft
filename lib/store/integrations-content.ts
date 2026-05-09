
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

export interface IntegrationItem {
    id: string;
    name: string;
    description: string;
    iconName: string;
    status: string; // "Active" | "Beta" | "Live"
    order: number;
}

export interface IntegrationsPageContent {
    header: {
        badge: string;
        titlePrefix: string;
        titleHighlight: string;
        description: string;
    };
    integrations: IntegrationItem[];
    cta: {
        title: string;
        description: string;
        buttonText: string;
    };
    lastUpdated: string;
}

interface IntegrationsContentState {
    content: IntegrationsPageContent | null;
    isLoading: boolean;
    isSaving: boolean;
    error: string | null;

    // Actions
    setContent: (content: IntegrationsPageContent) => void;
    updateHeader: (header: Partial<IntegrationsPageContent['header']>) => void;
    updateCTA: (cta: Partial<IntegrationsPageContent['cta']>) => void;

    // Integrations
    addIntegration: (item: IntegrationItem) => void;
    updateIntegration: (id: string, item: Partial<IntegrationItem>) => void;
    deleteIntegration: (id: string) => void;

    resetToDefaults: () => void;
}

const defaultContent: IntegrationsPageContent = {
    header: {
        badge: "Integrations",
        titlePrefix: "Integrations",
        titleHighlight: "That Fit",
        description: "Connect the site with the tools your team already uses for content, support, publishing, and tracking."
    },
    integrations: [
        {
            id: "int-1",
            name: "GitHub",
            description: "Keep code and content changes in one repo with a clear publishing workflow.",
            iconName: "Github",
            status: "Active",
            order: 1
        },
        {
            id: "int-2",
            name: "Slack",
            description: "Send updates when new pages, posts, or releases are ready to review.",
            iconName: "Slack",
            status: "Beta",
            order: 2
        },
        {
            id: "int-3",
            name: "OpenAI",
            description: "Support drafting, editing, and summarizing content where useful.",
            iconName: "Bot",
            status: "Live",
            order: 3
        },
        {
            id: "int-4",
            name: "Mobile Alerts",
            description: "Share launch updates and support messages through mobile-friendly channels.",
            iconName: "Smartphone",
            status: "Live",
            order: 4
        },
    ],
    cta: {
        title: "Need a custom workflow?",
        description: "We can wire your content, publishing, and support tools together cleanly.",
        buttonText: "Request Integration Help"
    },
    lastUpdated: new Date().toISOString()
};

export const useIntegrationsContentStore = create<IntegrationsContentState>()(
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

            addIntegration: (item) => set((state) => {
                if (state.content) {
                    state.content.integrations.push(item);
                    state.content.lastUpdated = new Date().toISOString();
                }
            }),

            updateIntegration: (id, item) => set((state) => {
                if (state.content) {
                    const index = state.content.integrations.findIndex(i => i.id === id);
                    if (index !== -1) {
                        state.content.integrations[index] = { ...state.content.integrations[index], ...item };
                        state.content.lastUpdated = new Date().toISOString();
                    }
                }
            }),

            deleteIntegration: (id) => set((state) => {
                if (state.content) {
                    state.content.integrations = state.content.integrations.filter(i => i.id !== id);
                    state.content.lastUpdated = new Date().toISOString();
                }
            }),

            resetToDefaults: () => set({ content: null })
        })),
        {
            name: 'integrations-content-storage',
            storage: createJSONStorage(() => localStorage),
        }
    )
);

