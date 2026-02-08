
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
        badge: "Global Interoperability Hub",
        titlePrefix: "Integrations",
        titleHighlight: "Matrix",
        description: "Connect your Oftisoft environment with the world's most powerful developer tools and neural services."
    },
    integrations: [
        {
            id: "int-1",
            name: "GitHub Protocol",
            description: "Instant sync with your repository pipelines for continuous artifact deployment.",
            iconName: "Github",
            status: "Active",
            order: 1
        },
        {
            id: "int-2",
            name: "Slack Signal",
            description: "Real-time notifications for proposal activations and delivery status updates.",
            iconName: "Slack",
            status: "Beta",
            order: 2
        },
        {
            id: "int-3",
            name: "OpenAI Neural",
            description: "Powering the core intelligence of your bot templates and RAG systems.",
            iconName: "Bot",
            status: "Live",
            order: 3
        },
        {
            id: "int-4",
            name: "Mobile Edge",
            description: "Dedicated push-sync for cross-platform application frameworks.",
            iconName: "Smartphone",
            status: "Live",
            order: 4
        },
    ],
    cta: {
        title: "Custom API Access",
        description: "Building something unique? Access our full neural API suite and forge your own custom integrations.",
        buttonText: "Request API Access Node"
    },
    lastUpdated: new Date().toISOString()
};

export const useIntegrationsContentStore = create<IntegrationsContentState>()(
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

            resetToDefaults: () => set({ content: defaultContent })
        })),
        {
            name: 'integrations-content-storage',
            storage: createJSONStorage(() => localStorage),
        }
    )
);
