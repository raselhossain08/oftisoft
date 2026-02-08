
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

export interface ContactInfoItem {
    id: string;
    title: string;
    value: string;
    iconName: string;
    color: string;
    order: number;
}

export interface ContactPageContent {
    header: {
        badge: string;
        titlePrefix: string;
        titleHighlight: string;
        titleSuffix: string; // "."
        description: string;
    };
    contactInfo: ContactInfoItem[];
    statusNode: {
        title: string;
        status: string; // "ACTIVE"
        latencyText: string;
    };
    form: {
        title: string;
        description: string;
        nameLabel: string;
        emailLabel: string;
        subjectLabel: string;
        messageLabel: string;
        buttonText: string;
    };
    footer: {
        encryptedText: string;
        agentText: string;
    };
    lastUpdated: string;
}

interface ContactContentState {
    content: ContactPageContent | null;
    isLoading: boolean;
    isSaving: boolean;
    error: string | null;

    // Actions
    setContent: (content: ContactPageContent) => void;
    updateHeader: (header: Partial<ContactPageContent['header']>) => void;
    updateStatusNode: (status: Partial<ContactPageContent['statusNode']>) => void;
    updateForm: (form: Partial<ContactPageContent['form']>) => void;
    updateFooter: (footer: Partial<ContactPageContent['footer']>) => void;

    // Contact Info
    addContactInfo: (item: ContactInfoItem) => void;
    updateContactInfo: (id: string, item: Partial<ContactInfoItem>) => void;
    deleteContactInfo: (id: string) => void;

    resetToDefaults: () => void;
}

const defaultContent: ContactPageContent = {
    header: {
        badge: "Communication Interface",
        titlePrefix: "Initiate",
        titleHighlight: "Sync",
        titleSuffix: ".",
        description: "Connect with our architectural core for bespoke implementations, system consultations, or infrastructure support."
    },
    contactInfo: [
        { id: "info-1", title: "Global Headquarters", value: "San Francisco, CA / Distributed Hubs", iconName: "MapPin", color: "text-blue-500", order: 1 },
        { id: "info-2", title: "Secure Email Sync", value: "hq@oftisoft.com", iconName: "Mail", color: "text-primary", order: 2 },
        { id: "info-3", title: "Arch: Support Node", value: "support.oftisoft.com", iconName: "Headset", color: "text-green-500", order: 3 },
    ],
    statusNode: {
        title: "Support Node Sync",
        status: "ACTIVE",
        latencyText: "Current artifact deployment latency is sub-10s across all global edge proxies."
    },
    form: {
        title: "Transmission Node",
        description: "Construct your communication payload below and commit to our primary processing core.",
        nameLabel: "Identity Token (Name)",
        emailLabel: "Communication Proxy (Email)",
        subjectLabel: "Request Subject Node",
        messageLabel: "Context Payload (Message)",
        buttonText: "Commit Transmission"
    },
    footer: {
        encryptedText: "P2P Encrypted Data Transfer Protocols ACTIVE",
        agentText: "Neural Processing Agents Dispatched on Commit"
    },
    lastUpdated: new Date().toISOString()
};

export const useContactContentStore = create<ContactContentState>()(
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

            updateStatusNode: (status) => set((state) => {
                if (state.content) {
                    state.content.statusNode = { ...state.content.statusNode, ...status };
                    state.content.lastUpdated = new Date().toISOString();
                }
            }),

            updateForm: (form) => set((state) => {
                if (state.content) {
                    state.content.form = { ...state.content.form, ...form };
                    state.content.lastUpdated = new Date().toISOString();
                }
            }),

            updateFooter: (footer) => set((state) => {
                if (state.content) {
                    state.content.footer = { ...state.content.footer, ...footer };
                    state.content.lastUpdated = new Date().toISOString();
                }
            }),

            addContactInfo: (item) => set((state) => {
                if (state.content) {
                    state.content.contactInfo.push(item);
                    state.content.lastUpdated = new Date().toISOString();
                }
            }),

            updateContactInfo: (id, item) => set((state) => {
                if (state.content) {
                    const index = state.content.contactInfo.findIndex(i => i.id === id);
                    if (index !== -1) {
                        state.content.contactInfo[index] = { ...state.content.contactInfo[index], ...item };
                        state.content.lastUpdated = new Date().toISOString();
                    }
                }
            }),

            deleteContactInfo: (id) => set((state) => {
                if (state.content) {
                    state.content.contactInfo = state.content.contactInfo.filter(i => i.id !== id);
                    state.content.lastUpdated = new Date().toISOString();
                }
            }),

            resetToDefaults: () => set({ content: defaultContent })
        })),
        {
            name: 'contact-content-storage',
            storage: createJSONStorage(() => localStorage),
        }
    )
);
