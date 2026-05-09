/**
 * About Page Content Store
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

export interface AboutHeroSection {
    badge: string;
    title: string;
    highlightedWord: string;
    description: string;
    ctaText: string;
    ctaLink: string;
    cardTitle: string;
    cardDescription: string;
}

export interface AboutStat {
    id: string;
    label: string;
    value: string;
    icon: string;
}

export interface AboutValue {
    id: string;
    title: string;
    description: string;
}


export interface AboutCTA {
    title: string;
    description: string;
    buttonText: string;
    buttonLink: string;
}

export interface AboutAward {
    id: string;
    title: string;
    org: string;
    year: string;
    description: string;
    gradient: string;
}


export interface AboutTimelineItem {
    id: string;
    year: string;
    title: string;
    desc: string;
    icon: string;
    gradient: string;
}

export interface AboutFounder {
    name: string;
    role: string;
    tagline: string;
    bioPar1: string;
    bioPar2: string;
    stats: { num: number, label: string, suffix: string }[];
    socials: { twitter: string, linkedin: string, github: string };
    image?: string; // Optional for now, assuming placeholder or upload later
    badgeTitle: string;
    titleLine1: string;
    titleLine2: string;
}

export interface AboutMission {
    badge: string;
    titleLine1: string;
    titleLine2: string;
    quote: string;
    quoteHighlight: string;
}

export interface AboutCultureItem {
    id: string;
    type: 'image' | 'video';
    title: string;
    location: string;
    thumb: string; // Using tailwind class for color as placeholder, or image url later
    size: string; // 'col-span-1' | 'col-span-2'
}

export interface AboutCulture {
    badge: string;
    titleLine1: string;
    titleLine2: string;
    items: AboutCultureItem[];
}

export interface AboutTeamMember {
    id: string;
    name: string;
    role: string;
    category: string;
    image: string; // Placeholder or URL
    gradient: string;
    socials: { linkedin: string, twitter: string, github: string };
}

export interface AboutTeam {
    badge: string;
    titleLine1: string;
    titleLine2: string;
    members: AboutTeamMember[];
}

export interface AboutPageContent {
    hero: AboutHeroSection;
    stats: AboutStat[];
    mission: AboutMission;
    culture: AboutCulture;
    team: AboutTeam;
    valuesBadge: string;
    valuesTitle: string;
    valuesHighlight: string;
    values: AboutValue[];
    awardsBadge: string;
    awardsTitle: string;
    awardsTitleHighlight: string;
    awardsDescription: string;
    awards: AboutAward[];
    timelineBadge: string;
    timelineTitle: string;
    timelineTitleHighlight: string;
    timeline: AboutTimelineItem[];
    founder: AboutFounder;
    cta: AboutCTA;
    seo: {
        title: string;
        description: string;
        keywords: string[];
    };
    lastUpdated: string;
    status: 'draft' | 'published';
}

interface AboutContentState {
    content: AboutPageContent | null;
    isSaving: boolean;
    setContent: (content: AboutPageContent) => void;
    updateHero: (data: Partial<AboutHeroSection>) => void;
    updateStats: (stats: AboutStat[]) => void;
    updateMission: (data: Partial<AboutMission>) => void;
    updateCulture: (data: Partial<AboutCulture>) => void;
    updateTeam: (data: Partial<AboutTeam>) => void;
    updateValues: (values: AboutValue[]) => void;
    updateAwards: (awards: AboutAward[]) => void;
    updateAwardsInfo: (data: Partial<{
        awardsBadge: string;
        awardsTitle: string;
        awardsTitleHighlight: string;
        awardsDescription: string;
    }>) => void;
    updateValuesInfo: (data: Partial<{
        valuesBadge: string;
        valuesTitle: string;
        valuesHighlight: string;
    }>) => void;
    updateTimeline: (timeline: AboutTimelineItem[]) => void;
    updateTimelineInfo: (data: Partial<{
        timelineBadge: string;
        timelineTitle: string;
        timelineTitleHighlight: string;
    }>) => void;
    updateFounder: (data: Partial<AboutFounder>) => void;
    updateCTA: (data: Partial<AboutCTA>) => void;
    updateSEO: (data: Partial<AboutPageContent['seo']>) => void;
    setStatus: (status: 'draft' | 'published') => void;
    setSaving: (saving: boolean) => void;
    resetToDefaults: () => void;
}

const defaultContent: AboutPageContent = {
    hero: {
        badge: 'About Oftisoft',
        title: 'We build the',
        highlightedWord: 'brand behind the site.',
        description: 'Oftisoft creates original websites, content systems, and SEO-ready page copy that sound like a real business instead of a template.',
        ctaText: 'Explore Services',
        ctaLink: '/services',
        cardTitle: 'Content With Structure',
        cardDescription: 'Clear pages, stronger messaging, and SEO-friendly layouts.',
    },
    stats: [
        { id: '1', label: 'Pages Written', value: '19+', icon: 'Globe' },
        { id: '2', label: 'Blog Posts', value: '46', icon: 'Users' },
        { id: '3', label: 'Original Copy', value: '100%', icon: 'Zap' },
    ],
    mission: {
        badge: 'Our Mission',
        titleLine1: 'Build websites',
        titleLine2: 'people trust.',
        quote: 'To help businesses communicate with clarity through original copy, useful structure, and page experiences that stay easy to maintain.',
        quoteHighlight: 'clarity through original copy'
    },
    culture: {
        badge: 'Inside Oftisoft',
        titleLine1: 'Where strategy meets',
        titleLine2: 'execution.',
        items: [
            {
                id: '1',
                type: "video",
                thumb: "bg-slate-900",
                title: "Content Review Session",
                location: "Remote Workshop",
                size: "col-span-1 md:col-span-2 row-span-2"
            },
            {
                id: '2',
                type: "image",
                thumb: "bg-blue-900",
                title: "SEO Planning",
                location: "Writing Board",
                size: "col-span-1"
            },
            {
                id: '3',
                type: "image",
                thumb: "bg-green-900",
                title: "Section Mapping",
                location: "Content Desk",
                size: "col-span-1"
            },
            {
                id: '4',
                type: "image",
                thumb: "bg-purple-900",
                title: "Page Polish",
                location: "UI Review",
                size: "col-span-1"
            },
            {
                id: '5',
                type: "image",
                thumb: "bg-orange-900",
                title: "Launch Check",
                location: "Final QA",
                size: "col-span-1"
            },
        ]
    },
    team: {
        badge: 'The Team',
        titleLine1: 'People who care',
        titleLine2: 'about the details.',
        members: [
            { id: '1', name: "Rasel Hossain", role: "Founder & CEO", category: "Leadership", image: "bg-[#1a1a1a]", gradient: "from-blue-600 to-indigo-600", socials: { linkedin: '#', twitter: '#', github: '#' } },
            { id: '2', name: "Nadia Rahman", role: "Content Strategist", category: "Strategy", image: "bg-[#1a1a1a]", gradient: "from-purple-600 to-pink-600", socials: { linkedin: '#', twitter: '#', github: '#' } },
            { id: '3', name: "Shuvo Hasan", role: "Frontend Engineer", category: "Development", image: "bg-[#1a1a1a]", gradient: "from-orange-600 to-amber-600", socials: { linkedin: '#', twitter: '#', github: '#' } },
            { id: '4', name: "Sumi Akter", role: "UI Designer", category: "Design", image: "bg-[#1a1a1a]", gradient: "from-cyan-600 to-teal-600", socials: { linkedin: '#', twitter: '#', github: '#' } },
            { id: '5', name: "Imran Hossain", role: "SEO Specialist", category: "Growth", image: "bg-[#1a1a1a]", gradient: "from-green-600 to-emerald-600", socials: { linkedin: '#', twitter: '#', github: '#' } },
            { id: '6', name: "Tania Sultana", role: "Project Manager", category: "Operations", image: "bg-[#1a1a1a]", gradient: "from-red-600 to-rose-600", socials: { linkedin: '#', twitter: '#', github: '#' } },
        ]
    },
    valuesBadge: 'What We Value',
    valuesTitle: 'What',
    valuesHighlight: 'matters most',
    values: [
        { id: '1', title: 'Clarity First', description: 'We make sure every page says something useful in a way people can actually understand.' },
        { id: '2', title: 'Original Voice', description: 'We do not write placeholder copy. We write content that sounds like your brand.' },
        { id: '3', title: 'SEO With Purpose', description: 'Search is useful only when it supports the reader, so we keep keywords natural and relevant.' },
        { id: '4', title: 'Easy Maintenance', description: 'Good content should be easy to update, scale, and reuse as the business grows.' },
    ],
    awardsBadge: "Hall of Fame",
    awardsTitle: "Recognized for",
    awardsTitleHighlight: "practical work.",
    awardsDescription: "We care most about pages that feel polished, useful, and ready for real visitors.",
    awards: [
        {
            id: '1',
            title: "Best Content Structure",
            org: "Internal Review",
            year: "2026",
            description: "Given for improving page flow, clarity, and reader experience across the marketing site.",
            gradient: "from-blue-500 to-cyan-500"
        },
        {
            id: '2',
            title: "Strongest Brand Voice",
            org: "Client Feedback",
            year: "2026",
            description: "Earned for making the site sound like one clear, confident company.",
            gradient: "from-purple-500 to-pink-500"
        },
        {
            id: '3',
            title: "SEO-Ready Delivery",
            org: "Content QA",
            year: "2026",
            description: "Recognized for metadata, structure, and image text that support organic discovery.",
            gradient: "from-orange-500 to-amber-500"
        },
        {
            id: '4',
            title: "Clean Launch Standard",
            org: "Project Team",
            year: "2026",
            description: "Awarded for shipping without placeholder content or loose ends.",
            gradient: "from-green-500 to-emerald-500"
        }
    ],
    timelineBadge: "Our Origins",
    timelineTitle: "A simple path to",
    timelineTitleHighlight: "better pages.",
    timeline: [
        {
            id: '1',
            year: "2018",
            title: "First builds",
            desc: "We started by helping small teams turn rough ideas into useful web pages.",
            icon: "Building2",
            gradient: "from-blue-500 to-indigo-500"
        },
        {
            id: '2',
            year: "2020",
            title: "Content systems",
            desc: "We added reusable content structures so pages could be maintained more easily.",
            icon: "Briefcase",
            gradient: "from-purple-500 to-pink-500"
        },
        {
            id: '3',
            year: "2022",
            title: "SEO focus",
            desc: "We leaned into search-ready copy, metadata, and page structure as part of every build.",
            icon: "Globe",
            gradient: "from-cyan-500 to-teal-500"
        },
        {
            id: '4',
            year: "2024",
            title: "Brand consistency",
            desc: "We standardized how pages, blogs, and support content work together across the site.",
            icon: "Zap",
            gradient: "from-amber-500 to-orange-500"
        },
        {
            id: '5',
            year: "2026",
            title: "Oftisoft today",
            desc: "The site now centers on original copy, practical structure, and content that feels finished.",
            icon: "Rocket",
            gradient: "from-green-500 to-emerald-500"
        }
    ],
    founder: {
        name: "Rasel Hossain",
        role: "Founder & CEO",
        tagline: "Builder . Writer . Consultant",
        bioPar1: "I help businesses turn scattered ideas into clear digital experiences that people can understand quickly.",
        bioPar2: "Oftisoft exists to make websites feel intentional again, with content, structure, and SEO that work together instead of fighting each other.",
        stats: [
            { num: 120, label: "Projects Delivered", suffix: "+" },
            { num: 46, label: "Blog Posts", suffix: "" },
            { num: 19, label: "Page Sets", suffix: "" }
        ],
        socials: {
            twitter: "#",
            linkedin: "#",
            github: "#"
        },
        badgeTitle: "The Founder",
        titleLine1: "Writing the site,",
        titleLine2: "one page at a time."
    },
    cta: {
        title: 'Need your own content refresh?',
        description: 'Let’s replace generic website copy with something that sounds like your business and supports search.',
        buttonText: 'Start a Project',
        buttonLink: '/contact',
    },
    seo: {
        title: 'About Oftisoft - Original Website Content and SEO Copy',
        description: 'Learn how Oftisoft builds original marketing pages, content systems, and search-friendly website copy.',
        keywords: ['about oftisoft', 'content systems', 'seo copy', 'website writing', 'original copy'],
    },
    lastUpdated: new Date().toISOString(),
    status: 'draft',
};

export const useAboutContentStore = create<AboutContentState>()(
    persist(
        immer((set) => ({
            content: null,
            isSaving: false,

            setContent: (content) => set({ content }),

            updateHero: (data) => set((state) => {
                if (state.content) {
                    state.content.hero = { ...state.content.hero, ...data };
                    state.content.lastUpdated = new Date().toISOString();
                }
            }),

            updateStats: (stats) => set((state) => {
                if (state.content) {
                    state.content.stats = stats;
                    state.content.lastUpdated = new Date().toISOString();
                }
            }),

            updateMission: (data) => set((state) => {
                if (state.content) {
                    state.content.mission = { ...state.content.mission, ...data };
                    state.content.lastUpdated = new Date().toISOString();
                }
            }),

            updateCulture: (data) => set((state) => {
                if (state.content) {
                    state.content.culture = { ...state.content.culture, ...data };
                    state.content.lastUpdated = new Date().toISOString();
                }
            }),

            updateTeam: (data) => set((state) => {
                if (state.content) {
                    state.content.team = { ...state.content.team, ...data };
                    state.content.lastUpdated = new Date().toISOString();
                }
            }),

            updateValues: (values) => set((state) => {
                if (state.content) {
                    state.content.values = values;
                    state.content.lastUpdated = new Date().toISOString();
                }
            }),

            updateAwards: (awards) => set((state) => {
                if (state.content) {
                    state.content.awards = awards;
                    state.content.lastUpdated = new Date().toISOString();
                }
            }),

            updateAwardsInfo: (data) => set((state) => {
                if (state.content) {
                    Object.assign(state.content, data);
                    state.content.lastUpdated = new Date().toISOString();
                }
            }),

            updateValuesInfo: (data) => set((state) => {
                if (state.content) {
                    Object.assign(state.content, data);
                    state.content.lastUpdated = new Date().toISOString();
                }
            }),

            updateTimeline: (timeline) => set((state) => {
                if (state.content) {
                    state.content.timeline = timeline;
                    state.content.lastUpdated = new Date().toISOString();
                }
            }),

            updateTimelineInfo: (data) => set((state) => {
                if (state.content) {
                    Object.assign(state.content, data);
                    state.content.lastUpdated = new Date().toISOString();
                }
            }),

            updateFounder: (data) => set((state) => {
                if (state.content) {
                    state.content.founder = { ...state.content.founder, ...data };
                    state.content.lastUpdated = new Date().toISOString();
                }
            }),

            updateCTA: (data) => set((state) => {
                if (state.content) {
                    state.content.cta = { ...state.content.cta, ...data };
                    state.content.lastUpdated = new Date().toISOString();
                }
            }),

            updateSEO: (data) => set((state) => {
                if (state.content) {
                    state.content.seo = { ...state.content.seo, ...data };
                    state.content.lastUpdated = new Date().toISOString();
                }
            }),

            setStatus: (status) => set((state) => {
                if (state.content) {
                    state.content.status = status;
                    state.content.lastUpdated = new Date().toISOString();
                }
            }),

            setSaving: (saving) => set({ isSaving: saving }),

            resetToDefaults: () => set({ content: null }),
        })),
        {
            name: 'about-content-storage',
            storage: createJSONStorage(() => localStorage),
        }
    )
);


