
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

export interface JobPosition {
    id: string;
    title: string;
    team: string; // e.g. "Core Intelligence", "Design"
    type: string; // e.g. "Full-Time / Remote"
    location: string;
    description: string;
    requirements: string[]; // List of requirements
    iconName?: string; // Stored as string, mapped in component
    color?: string; // tailwind color class
    isActive: boolean;
}

export interface CultureValue {
    id: string;
    title: string;
    description: string;
    iconName: string;
    color: string;
}

export interface CareersPageContent {
    hero: {
        badge: string;
        titlePrefix: string;
        titleHighlight: string;
        titleSuffix: string; // "."
        description: string;
    };
    cultureValues: CultureValue[];
    jobs: JobPosition[];
    contact: {
        title: string;
        description: string;
        buttonText: string;
    };
    lastUpdated: string;
}

interface CareersContentState {
    content: CareersPageContent | null;
    isLoading: boolean;
    isSaving: boolean;
    error: string | null;

    // Actions
    setContent: (content: CareersPageContent) => void;
    updateHero: (hero: Partial<CareersPageContent['hero']>) => void;
    updateContact: (contact: Partial<CareersPageContent['contact']>) => void;

    // Jobs
    addJob: (job: JobPosition) => void;
    updateJob: (id: string, job: Partial<JobPosition>) => void;
    deleteJob: (id: string) => void;

    // Culture
    updateCultureValue: (id: string, value: Partial<CultureValue>) => void;

    resetToDefaults: () => void;
}

const defaultContent: CareersPageContent = {
    hero: {
        badge: "Architectural Talent Acquisition",
        titlePrefix: "Forge the",
        titleHighlight: "Future",
        titleSuffix: ".",
        description: "Join our global operative and engineer the high-fidelity infrastructure that powers the next generation of digital design."
    },
    cultureValues: [
        {
            id: "val-1",
            title: "Synaptic Velocity",
            description: "We don't just build fast; we move at the speed of thought. Our engineering culture thrives on rapid iteration and high-fidelity output.",
            iconName: "Flame",
            color: "text-primary"
        },
        {
            id: "val-2",
            title: "Decentralized Hubs",
            description: "Oftisoft is a borderless operative. We empower architects to build from anywhere in the world, synchronized by our global edge core.",
            iconName: "Rocket",
            color: "text-blue-500"
        }
    ],
    jobs: [
        {
            id: "job-1",
            title: "Senior Neural Engineer",
            team: "Core Intelligence",
            type: "Full-Time / Remote",
            location: "Remote",
            description: "Lead the development of our core AI reasoning engine.",
            requirements: ["5+ years in AI/ML", "PyTorch/TensorFlow mastery", "Distributed systems experience"],
            iconName: "Cpu",
            color: "text-primary",
            isActive: true
        },
        {
            id: "job-2",
            title: "Visual Systems Architect",
            team: "Design Artifacts",
            type: "Full-Time / SF Hub",
            location: "San Francisco",
            description: "Define the visual language of our next-gen interfaces.",
            requirements: ["Strong portfolio", "Figma expert", "React/Three.js knowledge is a plus"],
            iconName: "Sparkles",
            color: "text-blue-500",
            isActive: true
        },
        {
            id: "job-3",
            title: "Edge Reliability Ops",
            team: "Infrastructure",
            type: "Contract / Remote",
            location: "Remote",
            description: "Ensure 99.99% uptime for our global edge network.",
            requirements: ["Kubernetes", "Terraform", "Go/Rust"],
            iconName: "Globe",
            color: "text-green-500",
            isActive: true
        },
        {
            id: "job-4",
            title: "Headless Framework Lead",
            team: "Development",
            type: "Full-Time / Remote",
            location: "Remote",
            description: "Build the SDKs that developers love to use.",
            requirements: ["TypeScript patterns", "Open source maintainer experience"],
            iconName: "Terminal",
            color: "text-purple-500",
            isActive: true
        },
    ],
    contact: {
        title: "Don't see your node?",
        description: "If you're a high-fidelity engineer or visual architect, initiate a direct sync. We're always expanding.",
        buttonText: "Direct Sync (Speculative)"
    },
    lastUpdated: new Date().toISOString()
};

export const useCareersContentStore = create<CareersContentState>()(
    persist(
        immer((set) => ({
            content: defaultContent,
            isLoading: false,
            isSaving: false,
            error: null,

            setContent: (content) => set({ content: { ...content, lastUpdated: new Date().toISOString() } }),

            updateHero: (hero) => set((state) => {
                if (state.content) {
                    state.content.hero = { ...state.content.hero, ...hero };
                    state.content.lastUpdated = new Date().toISOString();
                }
            }),

            updateContact: (contact) => set((state) => {
                if (state.content) {
                    state.content.contact = { ...state.content.contact, ...contact };
                    state.content.lastUpdated = new Date().toISOString();
                }
            }),

            addJob: (job) => set((state) => {
                if (state.content) {
                    state.content.jobs.push(job);
                    state.content.lastUpdated = new Date().toISOString();
                }
            }),

            updateJob: (id, job) => set((state) => {
                if (state.content) {
                    const index = state.content.jobs.findIndex(j => j.id === id);
                    if (index !== -1) {
                        state.content.jobs[index] = { ...state.content.jobs[index], ...job };
                        state.content.lastUpdated = new Date().toISOString();
                    }
                }
            }),

            deleteJob: (id) => set((state) => {
                if (state.content) {
                    state.content.jobs = state.content.jobs.filter(j => j.id !== id);
                    state.content.lastUpdated = new Date().toISOString();
                }
            }),

            updateCultureValue: (id, value) => set((state) => {
                if (state.content) {
                    const index = state.content.cultureValues.findIndex(c => c.id === id);
                    if (index !== -1) {
                        state.content.cultureValues[index] = { ...state.content.cultureValues[index], ...value };
                        state.content.lastUpdated = new Date().toISOString();
                    }
                }
            }),

            resetToDefaults: () => set({ content: defaultContent })
        })),
        {
            name: 'careers-content-storage',
            storage: createJSONStorage(() => localStorage),
        }
    )
);
