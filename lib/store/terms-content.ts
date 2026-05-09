
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

export interface TermsSection {
    id: string;
    title: string;
    iconName: string;
    iconImage?: string;
    content: string;
}

export interface TermsPageContent {
    header: {
        badge: string;
        title: string;
        description: string;
        videoUrl?: string;
    };
    navigationRail: {
        title: string;
        items: string[];
    };
    sections: TermsSection[];
    revision: {
        prefix: string;
        updatedAt: string;
    };
    lastUpdated: string;
}

interface TermsContentState {
    content: TermsPageContent | null;
    isLoading: boolean;
    isSaving: boolean;
    error: string | null;

    // Actions
    setContent: (content: TermsPageContent) => void;
    updateHeader: (header: Partial<TermsPageContent['header']>) => void;
    updateNavigationRail: (rail: Partial<TermsPageContent['navigationRail']>) => void;

    addSection: (section: TermsSection) => void;
    updateSection: (id: string, section: Partial<TermsSection>) => void;
    deleteSection: (id: string) => void;

    updateRevision: (revision: Partial<TermsPageContent['revision']>) => void;

    resetToDefaults: () => void;
}

const defaultContent: TermsPageContent = {
    header: {
        badge: "Terms",
        title: "Terms of Use.",
        description: "The basic rules for using the Oftisoft website and services.",
        videoUrl: ""
    },
    navigationRail: {
        title: "Sections",
        items: ["Acceptable Use", "Content Ownership", "Service Limits", "Privacy", "Payments"]
    },
    sections: [
        {
            id: "access",
            title: "Website Access",
            iconName: "Globe",
            content: "By using the site, you agree to follow these terms and use the content and features in a lawful, respectful way."
        },
        {
            id: "sovereignty",
            title: "Content Ownership",
            iconName: "Scale",
            content: "Unless stated otherwise, the text, branding, and page design on this site belong to Oftisoft."
        },
        {
            id: "integrity",
            title: "Acceptable Use",
            iconName: "ShieldAlert",
            content: "Please do not misuse the site, attempt to break it, or copy content in a way that violates the law or our rights."
        },
        {
            id: "fiscal",
            title: "Payments",
            iconName: "Clock",
            content: "If you purchase services from Oftisoft, payment terms will be shared in your proposal, invoice, or agreement."
        },
    ],
    revision: {
        prefix: "Last updated:",
        updatedAt: "Apr 22, 2026 / 00:44 UTC"
    },
    lastUpdated: new Date().toISOString()
};

export const useTermsContentStore = create<TermsContentState>()(
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

            updateNavigationRail: (rail) => set((state) => {
                if (state.content) {
                    state.content.navigationRail = { ...state.content.navigationRail, ...rail };
                    state.content.lastUpdated = new Date().toISOString();
                }
            }),

            addSection: (section) => set((state) => {
                if (state.content) {
                    state.content.sections.push(section);
                    state.content.lastUpdated = new Date().toISOString();
                }
            }),

            updateSection: (id, section) => set((state) => {
                if (state.content) {
                    const idx = state.content.sections.findIndex(s => s.id === id);
                    if (idx !== -1) {
                        state.content.sections[idx] = { ...state.content.sections[idx], ...section };
                        state.content.lastUpdated = new Date().toISOString();
                    }
                }
            }),

            deleteSection: (id) => set((state) => {
                if (state.content) {
                    state.content.sections = state.content.sections.filter(s => s.id !== id);
                    state.content.lastUpdated = new Date().toISOString();
                }
            }),

            updateRevision: (revision) => set((state) => {
                if (state.content) {
                    state.content.revision = { ...state.content.revision, ...revision };
                    state.content.lastUpdated = new Date().toISOString();
                }
            }),

            resetToDefaults: () => set({ content: null })
        })),
        {
            name: 'terms-content-storage',
            storage: createJSONStorage(() => localStorage),
        }
    )
);

