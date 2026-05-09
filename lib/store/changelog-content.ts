
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

export interface ChangelogUpdate {
    id: string;
    version: string;
    date: string;
    title: string;
    description: string;
    category: 'Major' | 'Update' | 'Feature' | 'Patch';
    changes: string[]; // List of bullet points
    iconName?: string; // Stored as string, mapped in component
    isActive: boolean;
}

export interface ChangelogPageContent {
    header: {
        badge: string;
        titlePrefix: string;
        titleSuffix: string; // "."
        description: string;
    };
    updates: ChangelogUpdate[];
    lastUpdated: string;
}

interface ChangelogContentState {
    content: ChangelogPageContent | null;
    isLoading: boolean;
    isSaving: boolean;
    error: string | null;

    // Actions
    setContent: (content: ChangelogPageContent) => void;
    updateHeader: (header: Partial<ChangelogPageContent['header']>) => void;

    // Updates
    addUpdate: (update: ChangelogUpdate) => void;
    updateUpdate: (id: string, update: Partial<ChangelogUpdate>) => void;
    deleteUpdate: (id: string) => void;

    resetToDefaults: () => void;
}

const defaultContent: ChangelogPageContent = {
    header: {
        badge: "Change Log",
        titlePrefix: "Changelog",
        titleSuffix: ".",
        description: "Tracking the site updates, content improvements, and page rewrites for Oftisoft."
    },
    updates: [
        {
            id: "v2.4.0",
            version: "v2.4.0",
            date: "Feb 05, 2026",
            title: "Marketing content refresh",
            description: "Rewrote the main site pages with original brand copy and clearer SEO structure.",
            category: "Major",
            changes: [
                "Updated the home and about pages.",
                "Replaced generic language across core sections.",
                "Improved page titles and descriptions.",
                "Standardized image text and CTA copy."
            ],
            iconName: "Sparkles",
            isActive: true
        },
        {
            id: "v2.3.5",
            version: "v2.3.5",
            date: "Jan 28, 2026",
            title: "Support and privacy updates",
            description: "Refined support answers and privacy language so the site reads more clearly.",
            category: "Update",
            changes: [
                "Simplified FAQ wording.",
                "Updated privacy text.",
                "Aligned support copy with the new brand voice."
            ],
            iconName: "ShieldCheck",
            isActive: true
        },
        {
            id: "v2.3.0",
            version: "v2.3.0",
            date: "Jan 15, 2026",
            title: "Content system launch",
            description: "Added structured content stores for the marketing pages and blog library.",
            category: "Feature",
            changes: [
                "Introduced reusable page content models.",
                "Added SEO-aware blog post data.",
                "Aligned page fallbacks with brand copy."
            ],
            iconName: "Box",
            isActive: true
        }
    ],
    lastUpdated: new Date().toISOString()
};

export const useChangelogContentStore = create<ChangelogContentState>()(
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

            addUpdate: (update) => set((state) => {
                if (state.content) {
                    // Add to beginning of array for chronological order
                    state.content.updates.unshift(update);
                    state.content.lastUpdated = new Date().toISOString();
                }
            }),

            updateUpdate: (id, update) => set((state) => {
                if (state.content) {
                    const index = state.content.updates.findIndex(u => u.id === id);
                    if (index !== -1) {
                        state.content.updates[index] = { ...state.content.updates[index], ...update };
                        state.content.lastUpdated = new Date().toISOString();
                    }
                }
            }),

            deleteUpdate: (id) => set((state) => {
                if (state.content) {
                    state.content.updates = state.content.updates.filter(u => u.id !== id);
                    state.content.lastUpdated = new Date().toISOString();
                }
            }),

            resetToDefaults: () => set({ content: null })
        })),
        {
            name: 'changelog-content-storage',
            storage: createJSONStorage(() => localStorage),
        }
    )
);

