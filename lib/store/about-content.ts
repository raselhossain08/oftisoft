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
        badge: 'Evolution & Architecture',
        title: 'We build the',
        highlightedWord: 'meta-layer',
        description: 'Oftisoft is a hyper-scale design and development operative engineering high-fidelity artifacts for the next generation of digital builders.',
        ctaText: 'Explore Our Ecosystem',
        ctaLink: '/services',
        cardTitle: 'Global Presence Node',
        cardDescription: 'Decentralized hubs operating across 48+ zones.',
    },
    stats: [
        { id: '1', label: 'Development Hubs', value: '48+', icon: 'Globe' },
        { id: '2', label: 'Active Architects', value: '14k+', icon: 'Users' },
        { id: '3', label: 'Success Nodes', value: '98.4%', icon: 'Zap' },
    ],
    mission: {
        badge: 'Our DNA',
        titleLine1: 'Driven by Purpose,',
        titleLine2: 'Define by Quality.',
        quote: 'To empower bold visionaries with intelligent, scalable, and premium digital ecosystems that not only solve problems but inspire the next generation of users.',
        quoteHighlight: 'intelligent, scalable, and premium'
    },
    culture: {
        badge: 'Life at Ofitsoft',
        titleLine1: 'Where Culture Meets',
        titleLine2: 'Creativity.',
        items: [
            {
                id: '1',
                type: "video",
                thumb: "bg-red-900",
                title: "Annual Hackathon 2025",
                location: "San Francisco HQ",
                size: "col-span-1 md:col-span-2 row-span-2"
            },
            {
                id: '2',
                type: "image",
                thumb: "bg-blue-900",
                title: "Brainstorming Session",
                location: "Design Studio",
                size: "col-span-1"
            },
            {
                id: '3',
                type: "image",
                thumb: "bg-green-900",
                title: "Team Lunch Friday",
                location: "Rooftop Lounge",
                size: "col-span-1"
            },
            {
                id: '4',
                type: "image",
                thumb: "bg-purple-900",
                title: "Deep Work Zone",
                location: "Quiet Area",
                size: "col-span-1"
            },
            {
                id: '5',
                type: "image",
                thumb: "bg-orange-900",
                title: "Client Presentation",
                location: "Conference Room A",
                size: "col-span-1"
            },
        ]
    },
    team: {
        badge: 'The Collective',
        titleLine1: 'Architects of the',
        titleLine2: 'Impossible.',
        members: [
            { id: '1', name: "Rasel Hossain", role: "Founder & CEO", category: "Leadership", image: "bg-[#1a1a1a]", gradient: "from-blue-600 to-indigo-600", socials: { linkedin: '#', twitter: '#', github: '#' } },
            { id: '2', name: "Alex Morgan", role: "CTO", category: "Leadership", image: "bg-[#1a1a1a]", gradient: "from-purple-600 to-pink-600", socials: { linkedin: '#', twitter: '#', github: '#' } },
            { id: '3', name: "Sarah Chen", role: "Lead Designer", category: "Design", image: "bg-[#1a1a1a]", gradient: "from-orange-600 to-amber-600", socials: { linkedin: '#', twitter: '#', github: '#' } },
            { id: '4', name: "David Kim", role: "Senior Engineer", category: "Development", image: "bg-[#1a1a1a]", gradient: "from-cyan-600 to-teal-600", socials: { linkedin: '#', twitter: '#', github: '#' } },
            { id: '5', name: "Emily Watson", role: "Product Manager", category: "Product", image: "bg-[#1a1a1a]", gradient: "from-green-600 to-emerald-600", socials: { linkedin: '#', twitter: '#', github: '#' } },
            { id: '6', name: "Lucas Silva", role: "DevOps Engineer", category: "Development", image: "bg-[#1a1a1a]", gradient: "from-red-600 to-rose-600", socials: { linkedin: '#', twitter: '#', github: '#' } },
        ]
    },
    valuesBadge: 'Foundational Protocols',
    valuesTitle: 'What we believe',
    valuesHighlight: 'matters',
    values: [
        { id: '1', title: 'Architectural Integrity', description: 'Every artifact we forge is built on a foundation of clean, scalable, and verifiable logic nodes.' },
        { id: '2', title: 'Visual Velocity', description: 'Design is not just aesthetic; it\'s a performance metric. We engineer interfaces that move at synaptic speeds.' },
        { id: '3', title: 'Open Interoperability', description: 'Our ecosystem thrives on connectivity. Every node we build is designed to sync with the global dev-stack.' },
        { id: '4', title: 'Neural Sovereignty', description: 'Intelligence must be decentralized. We provide the tools for you to forge your own neural artifacts.' },
    ],
    awardsBadge: "Hall of Fame",
    awardsTitle: "Recognized for",
    awardsTitleHighlight: "Digital Excellence.",
    awardsDescription: "Our relentless pursuit of perfection has earned us accolades from the industry's most prestigious bodies.",
    awards: [
        {
            id: '1',
            title: "Global Tech Innovator",
            org: "Web3 Summit",
            year: "2025",
            description: "Awarded for breakthrough architecture in decentralized finance platforms.",
            gradient: "from-blue-500 to-cyan-500"
        },
        {
            id: '2',
            title: "Best UX/UI Design",
            org: "Awwwards",
            year: "2025",
            description: "Recognized for setting new standards in user-centric digital experiences.",
            gradient: "from-purple-500 to-pink-500"
        },
        {
            id: '3',
            title: "Enterprise Solution",
            org: "SaaS Awards",
            year: "2024",
            description: "Top-tier reliability and scalability for high-traffic enterprise systems.",
            gradient: "from-orange-500 to-amber-500"
        },
        {
            id: '4',
            title: "Fastest Growing Agency",
            org: "Inc. 5000",
            year: "2024",
            description: "Ranked among the top 100 fastest growing software agencies globally.",
            gradient: "from-green-500 to-emerald-500"
        }
    ],
    timelineBadge: "Our Origins",
    timelineTitle: "Evolution of",
    timelineTitleHighlight: "Innovation.",
    timeline: [
        {
            id: '1',
            year: "2018",
            title: "The Genesis",
            desc: "Founded in a garage with a single laptop and a vision to simplify complex software.",
            icon: "Building2",
            gradient: "from-blue-500 to-indigo-500"
        },
        {
            id: '2',
            year: "2020",
            title: "First Major Pivot",
            desc: "Transitioned from general web dev to Specialized Enterprise SaaS engineering.",
            icon: "Briefcase",
            gradient: "from-purple-500 to-pink-500"
        },
        {
            id: '3',
            year: "2022",
            title: "Scale & Expansion",
            desc: "Doubled the team size and opened our first international office in Singapore.",
            icon: "Globe",
            gradient: "from-cyan-500 to-teal-500"
        },
        {
            id: '4',
            year: "2024",
            title: "AI Integration",
            desc: "launched 'OfitAI', our proprietary engine for automating frontend workflows.",
            icon: "Zap",
            gradient: "from-amber-500 to-orange-500"
        },
        {
            id: '5',
            year: "2026",
            title: "Industry Leader",
            desc: "Recognized as a Top 10 Global Tech Partner with 500+ successful deployments.",
            icon: "Rocket",
            gradient: "from-green-500 to-emerald-500"
        }
    ],
    founder: {
        name: "Rasel Hossain",
        role: "Founder & CEO",
        tagline: "Visionary . Engineer . Consultant",
        bioPar1: "I am a passionate software engineer and technology consultant dedicated to building modern, scalable, and high-performance digital solutions.",
        bioPar2: "With a vision to bridge the gap between complex engineering and intuitive design, I founded Ofitsoft. We don't just write code; we architect digital ecosystems that empower businesses to scale effortlessly in the AI era.",
        stats: [
            { num: 150, label: "Projects Delivered", suffix: "+" },
            { num: 50, label: "Happy Clients", suffix: "+" },
            { num: 6, label: "Years Experience", suffix: "Y" }
        ],
        socials: {
            twitter: "#",
            linkedin: "#",
            github: "#"
        },
        badgeTitle: "The Architect",
        titleLine1: "Coding the Future,",
        titleLine2: "One Line at a Time."
    },
    cta: {
        title: 'Join the architectural elite.',
        description: 'We are always searching for high-fidelity builders and neural engineers to expand our global hubs.',
        buttonText: 'Initiate Recruitment Node',
        buttonLink: '/contact',
    },
    seo: {
        title: 'About Oftisoft - Building the Meta-Layer',
        description: 'Hyper-scale design and development operative engineering high-fidelity artifacts for the next generation.',
        keywords: ['about oftisoft', 'company', 'team', 'values', 'mission'],
    },
    lastUpdated: new Date().toISOString(),
    status: 'draft',
};

export const useAboutContentStore = create<AboutContentState>()(
    persist(
        immer((set) => ({
            content: defaultContent,
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

            resetToDefaults: () => set({ content: defaultContent }),
        })),
        {
            name: 'about-content-storage',
            storage: createJSONStorage(() => localStorage),
        }
    )
);

