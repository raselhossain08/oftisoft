
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

export interface CommunityLink {
    id: string;
    title: string;
    label: string;
    iconName: string; // Stored as string, mapped in component
    color: string; // tailwind color class
    url: string;
    isActive: boolean;
}

export interface Statistic {
    id: string;
    value: string;
    label: string;
    order: number;
}

export interface CommunityPageContent {
    header: {
        badge: string;
        title: string;
        highlight: string;
        description: string;
    };
    links: CommunityLink[];
    newsletter: {
        title: string;
        description: string;
        placeholder: string;
        buttonText: string;
        footerText: string;
    };
    stats: Statistic[];
    lastUpdated: string;
}

interface CommunityContentState {
    content: CommunityPageContent | null;
    isLoading: boolean;
    isSaving: boolean;
    error: string | null;

    // Actions
    setContent: (content: CommunityPageContent) => void;
    updateHeader: (header: Partial<CommunityPageContent['header']>) => void;
    updateNewsletter: (newsletter: Partial<CommunityPageContent['newsletter']>) => void;

    // Links
    addLink: (link: CommunityLink) => void;
    updateLink: (id: string, link: Partial<CommunityLink>) => void;
    deleteLink: (id: string) => void;

    // Stats
    addStat: (stat: Statistic) => void;
    updateStat: (id: string, stat: Partial<Statistic>) => void;
    deleteStat: (id: string) => void;

    resetToDefaults: () => void;
}

const defaultContent: CommunityPageContent = {
    header: {
        badge: "Social Intelligence Hub",
        title: "Community",
        highlight: "Nexus",
        description: "Join the global grid of architects, neural engineers, and visual designers building the meta-layer of 2026."
    },
    links: [
        {
            id: "link-1",
            title: "GitHub OSS",
            label: "Contribute to core artifacts",
            iconName: "Github",
            color: "text-white",
            url: "https://github.com",
            isActive: true
        },
        {
            id: "link-2",
            title: "Discord Hub",
            label: "Real-time architect sync",
            iconName: "MessageSquare",
            color: "text-indigo-400",
            url: "https://discord.com",
            isActive: true
        },
        {
            id: "link-3",
            title: "Slack Matrix",
            label: "Enterprise developer signal",
            iconName: "Slack",
            color: "text-blue-400",
            url: "https://slack.com",
            isActive: true
        },
        {
            id: "link-4",
            title: "X Protocol",
            label: "Platform evolution stream",
            iconName: "Twitter",
            color: "text-blue-500",
            url: "https://twitter.com",
            isActive: true
        },
    ],
    newsletter: {
        title: "Neural Digest",
        description: "Receive high-fidelity platform updates, weekly artifact drops, and architectural intelligence nodes directly to your inbox.",
        placeholder: "Enter secure email interface...",
        buttonText: "Initiate Sync",
        footerText: "Trusted by 14k+ Global Architects"
    },
    stats: [
        { id: "stat-1", value: "4.8k+", label: "Sync Nodes Active", order: 1 },
        { id: "stat-2", value: "1.2m", label: "Artifact Pulls", order: 2 },
        { id: "stat-3", value: "100+", label: "OSS Contributors", order: 3 },
    ],
    lastUpdated: new Date().toISOString()
};

export const useCommunityContentStore = create<CommunityContentState>()(
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

            updateNewsletter: (newsletter) => set((state) => {
                if (state.content) {
                    state.content.newsletter = { ...state.content.newsletter, ...newsletter };
                    state.content.lastUpdated = new Date().toISOString();
                }
            }),

            addLink: (link) => set((state) => {
                if (state.content) {
                    state.content.links.push(link);
                    state.content.lastUpdated = new Date().toISOString();
                }
            }),

            updateLink: (id, link) => set((state) => {
                if (state.content) {
                    const index = state.content.links.findIndex(l => l.id === id);
                    if (index !== -1) {
                        state.content.links[index] = { ...state.content.links[index], ...link };
                        state.content.lastUpdated = new Date().toISOString();
                    }
                }
            }),

            deleteLink: (id) => set((state) => {
                if (state.content) {
                    state.content.links = state.content.links.filter(l => l.id !== id);
                    state.content.lastUpdated = new Date().toISOString();
                }
            }),

            addStat: (stat) => set((state) => {
                if (state.content) {
                    state.content.stats.push(stat);
                    state.content.lastUpdated = new Date().toISOString();
                }
            }),

            updateStat: (id, stat) => set((state) => {
                if (state.content) {
                    const index = state.content.stats.findIndex(s => s.id === id);
                    if (index !== -1) {
                        state.content.stats[index] = { ...state.content.stats[index], ...stat };
                        state.content.lastUpdated = new Date().toISOString();
                    }
                }
            }),

            deleteStat: (id) => set((state) => {
                if (state.content) {
                    state.content.stats = state.content.stats.filter(s => s.id !== id);
                    state.content.lastUpdated = new Date().toISOString();
                }
            }),

            resetToDefaults: () => set({ content: defaultContent })
        })),
        {
            name: 'community-content-storage',
            storage: createJSONStorage(() => localStorage),
        }
    )
);
