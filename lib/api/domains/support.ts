import { api } from "@/lib/api";
import type { PaymentMethod, Transaction } from "./billing";
import type { User } from "./auth";

export enum TicketStatus {
    OPEN = 'open',
    PENDING = 'pending',
    RESOLVED = 'resolved',
    CLOSED = 'closed'
}

export enum TicketPriority {
    LOW = 'low',
    MEDIUM = 'medium',
    HIGH = 'high',
    URGENT = 'urgent'
}

export interface TicketMessage {
    id: string;
    content: string;
    sender: User;
    createdAt: string;
}

export interface Ticket {
    id: string;
    subject: string;
    description?: string;
    status: TicketStatus;
    priority: TicketPriority;
    category: string;
    customer: User;
    assignedTo?: User;
    messages?: TicketMessage[];
    createdAt: string;
    updatedAt: string;
    resolvedAt?: string;
}

export const supportAPI = {
    getTickets: async (status?: string): Promise<Ticket[]> => {
        const response = await api.get('/support/tickets', { params: { status } });
        return response.data;
    },
    getTicket: async (id: string): Promise<Ticket> => {
        const response = await api.get(`/support/tickets/${id}`);
        return response.data;
    },
    createTicket: async (data: { subject: string; category: string; priority: string; description: string }): Promise<Ticket> => {
        const response = await api.post('/support/tickets', data);
        return response.data;
    },
    updateTicketStatus: async (id: string, status: string): Promise<Ticket> => {
        const response = await api.patch(`/support/tickets/${id}/status`, { status });
        return response.data;
    },
    addMessage: async (id: string, content: string): Promise<TicketMessage> => {
        const response = await api.post(`/support/tickets/${id}/messages`, { content });
        return response.data;
    },
    getStats: async (): Promise<any> => {
        const response = await api.get('/support/stats');
        return response.data;
    }
};



