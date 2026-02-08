/**
 * Footer Content Store
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

export interface SocialLink {
    id: string;
    icon: string;
    href: string;
    label: string;
}

export interface FooterLink {
    id: string;
    label: string;
    href: string;
}

export interface FooterColumn {
    id: string;
    title: string;
    links: FooterLink[];
}

export interface FooterContent {
    brandName: string;
    tagline: string;
    description: string;
    newsletterTitle: string;
    newsletterDescription: string;
    newsletterPlaceholder: string;
    newsletterButtonText: string;
    newsletterDisclaimer: string;
    socialLinks: SocialLink[];
    columns: FooterColumn[];
    copyright: string;
    statusText: string;
    lastUpdated: string;
}

interface FooterContentState {
    content: FooterContent | null;
    isSaving: boolean;
    setContent: (content: FooterContent) => void;
    updateBranding: (data: Partial<Pick<FooterContent, 'brandName' | 'tagline' | 'description'>>) => void;
    updateNewsletter: (data: Partial<Pick<FooterContent, 'newsletterTitle' | 'newsletterDescription' | 'newsletterPlaceholder' | 'newsletterButtonText' | 'newsletterDisclaimer'>>) => void;
    updateSocialLinks: (links: SocialLink[]) => void;
    updateColumns: (columns: FooterColumn[]) => void;
    updateBottom: (data: Partial<Pick<FooterContent, 'copyright' | 'statusText'>>) => void;
    setSaving: (saving: boolean) => void;

    addSocialLink: (link: SocialLink) => void;
    removeSocialLink: (id: string) => void;
    addColumn: (column: FooterColumn) => void;
    removeColumn: (id: string) => void;
    addColumnLink: (columnId: string, link: FooterLink) => void;
    removeColumnLink: (columnId: string, linkId: string) => void;
    resetToDefaults: () => void;
}

const defaultContent: FooterContent = {
    brandName: 'Oftisoft',
    tagline: 'Building the next generation of digital experiences.',
    description: 'Based in San Francisco, operating globally.',
    newsletterTitle: 'Subscribe to our newsletter',
    newsletterDescription: 'Get the latest updates, articles, and resources.',
    newsletterPlaceholder: 'Enter your email address',
    newsletterButtonText: 'Subscribe',
    newsletterDisclaimer: 'Join 10,000+ developers. Unsubscribe at any time.',
    socialLinks: [
        { id: '1', icon: 'Github', href: '#', label: 'GitHub' },
        { id: '2', icon: 'Twitter', href: '#', label: 'Twitter' },
        { id: '3', icon: 'Linkedin', href: '#', label: 'LinkedIn' },
        { id: '4', icon: 'Instagram', href: '#', label: 'Instagram' },
    ],
    columns: [
        {
            id: '1',
            title: 'Product',
            links: [
                { id: '1-1', label: 'Features', href: '/#features' },
                { id: '1-2', label: 'Integrations', href: '/#integrations' },
                { id: '1-3', label: 'Pricing', href: '/#pricing' },
                { id: '1-4', label: 'Changelog', href: '/changelog' },
                { id: '1-5', label: 'Docs', href: '/docs' },
            ]
        },
        {
            id: '2',
            title: 'Company',
            links: [
                { id: '2-1', label: 'About Us', href: '/about' },
                { id: '2-2', label: 'Careers', href: '/careers' },
                { id: '2-3', label: 'Blog', href: '/blog' },
                { id: '2-4', label: 'Contact', href: '/#contact' },
                { id: '2-5', label: 'Partners', href: '/partners' },
            ]
        },
        {
            id: '3',
            title: 'Resources',
            links: [
                { id: '3-1', label: 'Community', href: '/community' },
                { id: '3-2', label: 'Contact Support', href: '/support' },
                { id: '3-3', label: 'Status', href: '/status' },
                { id: '3-4', label: 'Terms of Service', href: '/terms' },
                { id: '3-5', label: 'Privacy Policy', href: '/privacy' },
            ]
        }
    ],
    copyright: `© ${new Date().getFullYear()} Oftisoft Inc. All rights reserved.`,
    statusText: 'All Systems Operational',
    lastUpdated: new Date().toISOString(),
};

export const useFooterContentStore = create<FooterContentState>()(
    persist(
        immer((set) => ({
            content: defaultContent,
            isSaving: false,

            setContent: (content) => set({ content }),

            updateBranding: (data) => set((state) => {
                if (state.content) {
                    Object.assign(state.content, data);
                    state.content.lastUpdated = new Date().toISOString();
                }
            }),

            updateNewsletter: (data) => set((state) => {
                if (state.content) {
                    Object.assign(state.content, data);
                    state.content.lastUpdated = new Date().toISOString();
                }
            }),

            updateSocialLinks: (links) => set((state) => {
                if (state.content) {
                    state.content.socialLinks = links;
                    state.content.lastUpdated = new Date().toISOString();
                }
            }),

            updateColumns: (columns) => set((state) => {
                if (state.content) {
                    state.content.columns = columns;
                    state.content.lastUpdated = new Date().toISOString();
                }
            }),

            updateBottom: (data) => set((state) => {
                if (state.content) {
                    Object.assign(state.content, data);
                    state.content.lastUpdated = new Date().toISOString();
                }
            }),

            setSaving: (saving) => set({ isSaving: saving }),

            addSocialLink: (link) => set((state) => {
                if (state.content) {
                    state.content.socialLinks.push(link);
                    state.content.lastUpdated = new Date().toISOString();
                }
            }),

            removeSocialLink: (id) => set((state) => {
                if (state.content) {
                    state.content.socialLinks = state.content.socialLinks.filter((l) => l.id !== id);
                    state.content.lastUpdated = new Date().toISOString();
                }
            }),

            addColumn: (column) => set((state) => {
                if (state.content) {
                    state.content.columns.push(column);
                    state.content.lastUpdated = new Date().toISOString();
                }
            }),

            removeColumn: (id) => set((state) => {
                if (state.content) {
                    state.content.columns = state.content.columns.filter((c) => c.id !== id);
                    state.content.lastUpdated = new Date().toISOString();
                }
            }),

            addColumnLink: (columnId, link) => set((state) => {
                if (state.content) {
                    const col = state.content.columns.find((c) => c.id === columnId);
                    if (col) {
                        col.links.push(link);
                        state.content!.lastUpdated = new Date().toISOString();
                    }
                }
            }),

            removeColumnLink: (columnId, linkId) => set((state) => {
                if (state.content) {
                    const col = state.content.columns.find((c) => c.id === columnId);
                    if (col) {
                        col.links = col.links.filter((l) => l.id !== linkId);
                        state.content!.lastUpdated = new Date().toISOString();
                    }
                }
            }),

            resetToDefaults: () => set({ content: defaultContent }),
        })),
        {
            name: 'footer-content-storage',
            storage: createJSONStorage(() => localStorage),
        }
    )
);
