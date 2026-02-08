
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
        badge: "Operational Governance",
        title: "Terms of Sync.",
        description: "Legal framework and architectural governance protocols for the Oftisoft ecosystem.",
        videoUrl: ""
    },
    navigationRail: {
        title: "Nexus Sections",
        items: ["Acceptable Use Node", "Sync Obligations", "Neural Artifact Licensing", "Governance & Jurisdiction", "Fiscal Protocol"]
    },
    sections: [
        {
            id: "access",
            title: "Platform Architecture Access",
            iconName: "Globe",
            content: "By initiating a sync with Oftisoft, you are granted a revocable, non-exclusive license to utilize our high-fidelity digital artifacts and development nodes. This access is governed by the professional scope defined in your subscription matrix."
        },
        {
            id: "sovereignty",
            title: "Neural Logic Sovereignty",
            iconName: "Scale",
            content: "All neural artifacts forged via our private engine remain the intellectual property of the architect (USER), provided that the fundamental core-nodes of the Oftisoft engine are not extracted for unauthorized replication."
        },
        {
            id: "integrity",
            title: "Communication Integrity",
            iconName: "ShieldAlert",
            content: "Architects agree to maintain high-fidelity communication standards. Any manual extraction of platform intelligence for hyper-scale disruption without explicit governance approval will result in immediate node de-sync."
        },
        {
            id: "fiscal",
            title: "Fiscal Settlement Protocol",
            iconName: "Clock",
            content: "Sync fees are architectural investments billed per moon-cycle. Failure to reconcile fiscal settlements within the 10-day grace corridor will initiate a systematic cool-down of all active deployment proxies."
        },
    ],
    revision: {
        prefix: "Last Governance Update:",
        updatedAt: "Feb 07, 2026 / 00:44 UTC"
    },
    lastUpdated: new Date().toISOString()
};

export const useTermsContentStore = create<TermsContentState>()(
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

            resetToDefaults: () => set({ content: defaultContent })
        })),
        {
            name: 'terms-content-storage',
            storage: createJSONStorage(() => localStorage),
        }
    )
);
