
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
        badge: "Evolution Log",
        titlePrefix: "Changelog",
        titleSuffix: ".",
        description: "Tracking the architectural development and platform iterative cycles of the Ofitsoft ecosystem."
    },
    updates: [
        {
            id: "v2.4.0",
            version: "v2.4.0",
            date: "Feb 05, 2026",
            title: "Neural Engine Integration",
            description: "Implemented a new core processing engine with sub-10ms response times for all AI-driven artifacts.",
            category: "Major",
            changes: [
                "Introduced Headless Forge for rapid component deployment.",
                "Visual editor now supports real-time multi-device simulation.",
                "Optimized global edge distribution protocols.",
                "Added support for 2026 aesthetics design tokens."
            ],
            iconName: "Sparkles",
            isActive: true
        },
        {
            id: "v2.3.5",
            version: "v2.3.5",
            date: "Jan 28, 2026",
            title: "Financial Infrastructure Hardening",
            description: "Significant upgrades to the billing and settlement system for multi-regional support.",
            category: "Update",
            changes: [
                "Enhanced MFA protocols for admin finance dashboards.",
                "Integrated cross-border fiscal reconciliation nodes.",
                "Improved PDF generation latency for invoices."
            ],
            iconName: "ShieldCheck",
            isActive: true
        },
        {
            id: "v2.3.0",
            version: "v2.3.0",
            date: "Jan 15, 2026",
            title: "Marketplace Expansion",
            description: "Launching the new category matrix for bespoke development services.",
            category: "Feature",
            changes: [
                "Added service request quotes and proposal tracking.",
                "Unified digital library interface for asset management.",
                "New glassmorphic UI kit for e-commerce artifacts."
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

            resetToDefaults: () => set({ content: defaultContent })
        })),
        {
            name: 'changelog-content-storage',
            storage: createJSONStorage(() => localStorage),
        }
    )
);
