
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

export interface SupportChannel {
    id: string;
    title: string;
    desc: string;
    iconName: string;
    iconImage?: string;
    color: string;
}

export interface SupportFAQ {
    id: string;
    q: string;
    a: string;
}

export interface SupportMetric {
    id: string;
    label: string;
    value: string;
    iconName: string;
}

export interface SupportPageContent {
    header: {
        badge: string;
        title: string;
        searchPlaceholder: string;
        videoUrl?: string;
    };
    channels: SupportChannel[];
    faq: {
        badge: string;
        title: string;
        items: SupportFAQ[];
    };
    priorityRelay: {
        title: string;
        description: string;
        buttons: { label: string; iconName: string; variant: "default" | "outline" }[];
        metrics: SupportMetric[];
    };
    lastUpdated: string;
}

interface SupportContentState {
    content: SupportPageContent | null;
    isLoading: boolean;
    isSaving: boolean;
    error: string | null;

    // Actions
    setContent: (content: SupportPageContent) => void;
    updateHeader: (header: Partial<SupportPageContent['header']>) => void;

    addChannel: (channel: SupportChannel) => void;
    updateChannel: (id: string, channel: Partial<SupportChannel>) => void;
    deleteChannel: (id: string) => void;

    updateFaqSection: (faq: Partial<SupportPageContent['faq']>) => void;
    addFaqItem: (item: SupportFAQ) => void;
    updateFaqItem: (id: string, item: Partial<SupportFAQ>) => void;
    deleteFaqItem: (id: string) => void;

    updatePriorityRelay: (relay: Partial<SupportPageContent['priorityRelay']>) => void;
    updateMetric: (id: string, metric: Partial<SupportMetric>) => void;

    resetToDefaults: () => void;
}

const defaultContent: SupportPageContent = {
    header: {
        badge: "Architectural Assistance Hub",
        title: "Support Universe.",
        searchPlaceholder: "Find architectural support nodes...",
        videoUrl: ""
    },
    channels: [
        { id: "bot", title: "Neural Chat Bot", desc: "Immediate AI assistance for architectural queries and node status.", iconName: "Bot", color: "text-primary" },
        { id: "chat", title: "Direct Sync (Chat)", desc: "Join the real-time architect's channel for deep implementation syncs.", iconName: "MessageSquare", color: "text-blue-500" },
        { id: "docs", title: "Global SDK Docs", desc: "Exhaustive technical intelligence for independent platform mastery.", iconName: "Terminal", color: "text-purple-500" },
    ],
    faq: {
        badge: "Protocol Intelligence",
        title: "Frequent Sync Questions",
        items: [
            { id: "sync", q: "How do I initiate a neural sync?", a: "Navigate to the Visual Forge in your dashboard and commit your first node artifact. The neural engine will automatically begin the synchronization process." },
            { id: "latency", q: "What is the global edge latency?", a: "Oftisoft utilizes a proprietary proxy matrix ensuring sub-10ms delivery for document nodes and sub-150ms for complex neural computations globally." },
            { id: "saas", q: "Can I deploy custom SaaS kits?", a: "Yes. Our SaaS starter nodes are fully modular and can be extended with bespoke logic via the Oftisoft SDK available in the documentation." },
            { id: "247", q: "Is architectural support available 24/7?", a: "Elite and Enterprise nodes receive priority access to our global support operative, monitored 24/7 by both human architects and neural agents." },
        ]
    },
    priorityRelay: {
        title: "Priority Relay",
        description: "Elite and Enterprise architects can initiate a high-fidelity direct sync with our core engineering operative for ultra-bespoke implementation assistance.",
        buttons: [
            { label: "Initiate Priority Sync", iconName: "Zap", variant: "default" },
            { label: "Email Case Relay", iconName: "Mail", variant: "outline" }
        ],
        metrics: [
            { id: "response", label: "Current Response Window", value: "~ 8 Minutes", iconName: "Clock" },
            { id: "engineers", label: "Active Engineers On-Node", value: "12 Members", iconName: "CheckCircle2" }
        ]
    },
    lastUpdated: new Date().toISOString()
};

export const useSupportContentStore = create<SupportContentState>()(
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

            addChannel: (channel) => set((state) => {
                if (state.content) {
                    state.content.channels.push(channel);
                    state.content.lastUpdated = new Date().toISOString();
                }
            }),

            updateChannel: (id, channel) => set((state) => {
                if (state.content) {
                    const idx = state.content.channels.findIndex(c => c.id === id);
                    if (idx !== -1) {
                        state.content.channels[idx] = { ...state.content.channels[idx], ...channel };
                        state.content.lastUpdated = new Date().toISOString();
                    }
                }
            }),

            deleteChannel: (id) => set((state) => {
                if (state.content) {
                    state.content.channels = state.content.channels.filter(c => c.id !== id);
                    state.content.lastUpdated = new Date().toISOString();
                }
            }),

            updateFaqSection: (faq) => set((state) => {
                if (state.content) {
                    state.content.faq = { ...state.content.faq, ...faq };
                    state.content.lastUpdated = new Date().toISOString();
                }
            }),

            addFaqItem: (item) => set((state) => {
                if (state.content) {
                    state.content.faq.items.push(item);
                    state.content.lastUpdated = new Date().toISOString();
                }
            }),

            updateFaqItem: (id, item) => set((state) => {
                if (state.content) {
                    const idx = state.content.faq.items.findIndex(f => f.id === id);
                    if (idx !== -1) {
                        state.content.faq.items[idx] = { ...state.content.faq.items[idx], ...item };
                        state.content.lastUpdated = new Date().toISOString();
                    }
                }
            }),

            deleteFaqItem: (id) => set((state) => {
                if (state.content) {
                    state.content.faq.items = state.content.faq.items.filter(f => f.id !== id);
                    state.content.lastUpdated = new Date().toISOString();
                }
            }),

            updatePriorityRelay: (relay) => set((state) => {
                if (state.content) {
                    state.content.priorityRelay = { ...state.content.priorityRelay, ...relay };
                    state.content.lastUpdated = new Date().toISOString();
                }
            }),

            updateMetric: (id, metric) => set((state) => {
                if (state.content) {
                    const idx = state.content.priorityRelay.metrics.findIndex(m => m.id === id);
                    if (idx !== -1) {
                        state.content.priorityRelay.metrics[idx] = { ...state.content.priorityRelay.metrics[idx], ...metric };
                        state.content.lastUpdated = new Date().toISOString();
                    }
                }
            }),

            resetToDefaults: () => set({ content: defaultContent })
        })),
        {
            name: 'support-content-storage',
            storage: createJSONStorage(() => localStorage),
        }
    )
);
