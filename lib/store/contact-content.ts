
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
        badge: "Contact",
        titlePrefix: "Start a",
        titleHighlight: "Conversation",
        titleSuffix: ".",
        description: "Reach out for website content, SEO improvements, blog work, or a full page rewrite."
    },
    contactInfo: [
        { id: "info-1", title: "Location", value: "Dhaka, Bangladesh / Remote", iconName: "MapPin", color: "text-blue-500", order: 1 },
        { id: "info-2", title: "Secure Email Sync", value: "hq@oftisoft.com", iconName: "Mail", color: "text-primary", order: 2 },
        { id: "info-3", title: "Support", value: "support@oftisoft.com", iconName: "Headset", color: "text-green-500", order: 3 },
    ],
    statusNode: {
        title: "Response Status",
        status: "ACTIVE",
        latencyText: "We usually reply within one business day."
    },
    form: {
        title: "Send a message",
        description: "Tell us what you need and we’ll come back with a clear next step.",
        nameLabel: "Your name",
        emailLabel: "Your email",
        subjectLabel: "Subject",
        messageLabel: "Message",
        buttonText: "Send Message"
    },
    footer: {
        encryptedText: "Secure message handling",
        agentText: "Human follow-up on every request"
    },
    lastUpdated: new Date().toISOString()
};

export const useContactContentStore = create<ContactContentState>()(
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

            resetToDefaults: () => set({ content: null })
        })),
        {
            name: 'contact-content-storage',
            storage: createJSONStorage(() => localStorage),
        }
    )
);

