
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
        badge: "Support",
        title: "Support Center.",
        searchPlaceholder: "Search help articles...",
        videoUrl: ""
    },
    channels: [
        { id: "bot", title: "Quick Answers", desc: "Simple help for pages, content updates, and common questions.", iconName: "Bot", color: "text-primary" },
        { id: "chat", title: "Direct Chat", desc: "Message the team when you need a quick human response.", iconName: "MessageSquare", color: "text-blue-500" },
        { id: "docs", title: "Help Docs", desc: "Step-by-step guidance for working with the site content.", iconName: "Terminal", color: "text-purple-500" },
    ],
    faq: {
        badge: "FAQ",
        title: "Common Questions",
        items: [
            { id: "sync", q: "How do I update page content?", a: "Open the matching content store or database record, edit the fields, and save the changes." },
            { id: "latency", q: "Do the pages load quickly?", a: "The current setup is optimized for a clean marketing experience and can be extended with more performance work." },
            { id: "saas", q: "Can I add new pages later?", a: "Yes. The content structure is reusable, so new pages can follow the same pattern." },
            { id: "247", q: "Is support available after launch?", a: "Yes. We can keep helping with updates, fixes, and content changes after the site goes live." },
        ]
    },
    priorityRelay: {
        title: "Priority Help",
        description: "For launch blockers or urgent page updates, send us the details and we’ll respond quickly.",
        buttons: [
            { label: "Request Help", iconName: "Zap", variant: "default" },
            { label: "Email Support", iconName: "Mail", variant: "outline" }
        ],
        metrics: [
            { id: "response", label: "Typical Reply", value: "< 1 Business Day", iconName: "Clock" },
            { id: "engineers", label: "People On Support", value: "Small Team", iconName: "CheckCircle2" }
        ]
    },
    lastUpdated: new Date().toISOString()
};

export const useSupportContentStore = create<SupportContentState>()(
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

            resetToDefaults: () => set({ content: null })
        })),
        {
            name: 'support-content-storage',
            storage: createJSONStorage(() => localStorage),
        }
    )
);

