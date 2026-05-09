
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

export interface SystemStatus {
    id: string;
    name: string;
    status: "Operational" | "Degraded" | "Outage";
    uptime: string;
    latency: string;
    iconName: string;
    iconImage?: string;
    color: string;
}

export interface IncidentNode {
    id: string;
    date: string;
    title: string;
    desc: string;
    status: string;
    color: string;
}

export interface StatusPageContent {
    header: {
        badge: string;
        title: string;
        mainStatus: {
            title: string;
            description: string;
        };
        videoUrl?: string;
    };
    systems: SystemStatus[];
    incidents: {
        title: string;
        logs: IncidentNode[];
    };
    monitoring: {
        note: string;
        nextSyncText: string;
    };
    lastUpdated: string;
}

interface StatusContentState {
    content: StatusPageContent | null;
    isLoading: boolean;
    isSaving: boolean;
    error: string | null;

    // Actions
    setContent: (content: StatusPageContent) => void;
    updateHeader: (header: Partial<StatusPageContent['header']>) => void;
    updateMainStatus: (status: Partial<StatusPageContent['header']['mainStatus']>) => void;

    addSystem: (system: SystemStatus) => void;
    updateSystem: (id: string, system: Partial<SystemStatus>) => void;
    deleteSystem: (id: string) => void;

    updateIncidentHeader: (incident: Partial<StatusPageContent['incidents']>) => void;
    addIncident: (incident: IncidentNode) => void;
    updateIncident: (id: string, incident: Partial<IncidentNode>) => void;
    deleteIncident: (id: string) => void;

    updateMonitoring: (monitoring: Partial<StatusPageContent['monitoring']>) => void;

    resetToDefaults: () => void;
}

const defaultContent: StatusPageContent = {
    header: {
        badge: "Status",
        title: "System Status.",
        mainStatus: {
            title: "All Core Pages Live",
            description: "Content, SEO, and blog coverage are active across the marketing site"
        },
        videoUrl: ""
    },
    systems: [
        { id: "edge", name: "Website Content", status: "Operational", uptime: "100%", latency: "14ms", iconName: "Globe", color: "text-green-500" },
        { id: "neural", name: "Blog Library", status: "Operational", uptime: "100%", latency: "42ms", iconName: "Cpu", color: "text-green-500" },
        { id: "forge", name: "SEO Pages", status: "Operational", uptime: "100%", latency: "38ms", iconName: "Zap", color: "text-green-500" },
        { id: "cdn", name: "Media Delivery", status: "Degraded", uptime: "98.2%", latency: "210ms", iconName: "Server", color: "text-orange-500" },
        { id: "identity", name: "Support Routes", status: "Operational", uptime: "100%", latency: "8ms", iconName: "ShieldCheck", color: "text-green-500" },
        { id: "vaults", name: "Stored Content", status: "Operational", uptime: "100%", latency: "31ms", iconName: "Database", color: "text-green-500" },
    ],
    incidents: {
        title: "Recent Updates",
        logs: [
            { id: "i1", date: "Apr 18, 2026", title: "Blog content refresh", desc: "The blog dataset was expanded with full article bodies and SEO-focused topics.", status: "Resolved", color: "bg-green-500" },
            { id: "i2", date: "Apr 20, 2026", title: "Marketing page rewrite", desc: "Placeholder-style copy was replaced with original Oftisoft content across the site.", status: "Resolved", color: "bg-green-500" },
        ]
    },
    monitoring: {
        note: "We keep an eye on content freshness, page consistency, and user-facing copy quality.",
        nextSyncText: "Next Refresh in 5m"
    },
    lastUpdated: new Date().toISOString()
};

export const useStatusContentStore = create<StatusContentState>()(
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

            updateMainStatus: (status) => set((state) => {
                if (state.content) {
                    state.content.header.mainStatus = { ...state.content.header.mainStatus, ...status };
                    state.content.lastUpdated = new Date().toISOString();
                }
            }),

            addSystem: (system) => set((state) => {
                if (state.content) {
                    state.content.systems.push(system);
                    state.content.lastUpdated = new Date().toISOString();
                }
            }),

            updateSystem: (id, system) => set((state) => {
                if (state.content) {
                    const idx = state.content.systems.findIndex(s => s.id === id);
                    if (idx !== -1) {
                        state.content.systems[idx] = { ...state.content.systems[idx], ...system };
                        state.content.lastUpdated = new Date().toISOString();
                    }
                }
            }),

            deleteSystem: (id) => set((state) => {
                if (state.content) {
                    state.content.systems = state.content.systems.filter(s => s.id !== id);
                    state.content.lastUpdated = new Date().toISOString();
                }
            }),

            updateIncidentHeader: (incident) => set((state) => {
                if (state.content) {
                    state.content.incidents = { ...state.content.incidents, ...incident };
                    state.content.lastUpdated = new Date().toISOString();
                }
            }),

            addIncident: (incident) => set((state) => {
                if (state.content) {
                    state.content.incidents.logs.push(incident);
                    state.content.lastUpdated = new Date().toISOString();
                }
            }),

            updateIncident: (id, incident) => set((state) => {
                if (state.content) {
                    const idx = state.content.incidents.logs.findIndex(i => i.id === id);
                    if (idx !== -1) {
                        state.content.incidents.logs[idx] = { ...state.content.incidents.logs[idx], ...incident };
                        state.content.lastUpdated = new Date().toISOString();
                    }
                }
            }),

            deleteIncident: (id) => set((state) => {
                if (state.content) {
                    state.content.incidents.logs = state.content.incidents.logs.filter(i => i.id !== id);
                    state.content.lastUpdated = new Date().toISOString();
                }
            }),

            updateMonitoring: (monitoring) => set((state) => {
                if (state.content) {
                    state.content.monitoring = { ...state.content.monitoring, ...monitoring };
                    state.content.lastUpdated = new Date().toISOString();
                }
            }),

            resetToDefaults: () => set({ content: null })
        })),
        {
            name: 'status-content-storage',
            storage: createJSONStorage(() => localStorage),
        }
    )
);

