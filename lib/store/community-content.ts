
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
        badge: "Community",
        title: "Community",
        highlight: "Hub",
        description: "Join the people reading the blog, building with Oftisoft, and sharing ideas about content and SEO."
    },
    links: [
        {
            id: "link-1",
            title: "GitHub OSS",
            label: "Follow the code and content work",
            iconName: "Github",
            color: "text-white",
            url: "https://github.com",
            isActive: true
        },
        {
            id: "link-2",
            title: "Discord Hub",
            label: "Talk with the team in real time",
            iconName: "MessageSquare",
            color: "text-indigo-400",
            url: "https://discord.com",
            isActive: true
        },
        {
            id: "link-3",
            title: "Slack Matrix",
            label: "Team updates and project notes",
            iconName: "Slack",
            color: "text-blue-400",
            url: "https://slack.com",
            isActive: true
        },
        {
            id: "link-4",
            title: "X Protocol",
            label: "Latest updates and launch notes",
            iconName: "Twitter",
            color: "text-blue-500",
            url: "https://twitter.com",
            isActive: true
        },
    ],
    newsletter: {
        title: "Oftisoft Weekly",
        description: "Get new blog posts, launch notes, and practical content tips in one simple email.",
        placeholder: "Enter your email address",
        buttonText: "Subscribe",
        footerText: "Useful updates, no filler"
    },
    stats: [
        { id: "stat-1", value: "4.8k+", label: "Subscribers", order: 1 },
        { id: "stat-2", value: "1.2m", label: "Page Views", order: 2 },
        { id: "stat-3", value: "100+", label: "Community Threads", order: 3 },
    ],
    lastUpdated: new Date().toISOString()
};

export const useCommunityContentStore = create<CommunityContentState>()(
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

            resetToDefaults: () => set({ content: null })
        })),
        {
            name: 'community-content-storage',
            storage: createJSONStorage(() => localStorage),
        }
    )
);

