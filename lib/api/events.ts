/**
 * Events API - Frontend hooks for events
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from './client';
import { toast } from 'sonner';

export interface Event {
    id: string;
    title: string;
    slug: string;
    description: string;
    shortDescription?: string;
    type: 'webinar' | 'workshop' | 'conference' | 'meetup' | 'hackathon' | 'training';
    status: 'draft' | 'published' | 'cancelled' | 'completed';
    startDate: string;
    endDate: string;
    timezone?: string;
    location?: string;
    venue?: string;
    address?: string;
    onlinePlatform?: string;
    meetingUrl?: string;
    capacity: number;
    registeredCount: number;
    price: number;
    isFree: boolean;
    image?: string;
    tags?: string[];
    agenda?: Array<{
        time: string;
        title: string;
        description: string;
        speaker?: string;
    }>;
    speakers?: Array<{
        id: string;
        name: string;
        bio: string;
        avatar: string;
        role: string;
        company: string;
    }>;
    registrationDeadline?: string;
    requiresApproval: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface EventRegistration {
    id: string;
    eventId: string;
    userId: string;
    status: 'pending' | 'approved' | 'rejected' | 'cancelled' | 'attended' | 'no_show';
    ticketNumber: string;
    customFields?: Record<string, string>;
    hasAttended: boolean;
    attendedAt?: string;
    certificateUrl?: string;
    createdAt: string;
}

const endpoints = {
    list: 'events',
    upcoming: 'events/upcoming',
    get: (id: string) => `events/${id}`,
    getBySlug: (slug: string) => `events/slug/${slug}`,
    register: (id: string) => `events/${id}/register`,
    myRegistrations: 'events/my/registrations',
    registrations: (id: string) => `events/${id}/registrations`,
};

// Fetch all events
export function useEvents(options?: { status?: string; type?: string; upcoming?: boolean }) {
    return useQuery({
        queryKey: ['events', options],
        queryFn: () => api.get<Event[]>(endpoints.list, { params: options }),
    });
}

// Fetch upcoming events
export function useUpcomingEvents() {
    return useQuery({
        queryKey: ['events', 'upcoming'],
        queryFn: () => api.get<Event[]>(endpoints.upcoming),
    });
}

// Fetch single event
export function useEvent(id: string) {
    return useQuery({
        queryKey: ['event', id],
        queryFn: () => api.get<Event>(endpoints.get(id)),
        enabled: !!id,
    });
}

// Fetch event by slug
export function useEventBySlug(slug: string) {
    return useQuery({
        queryKey: ['event', 'slug', slug],
        queryFn: () => api.get<Event>(endpoints.getBySlug(slug)),
        enabled: !!slug,
    });
}

// Register for event
export function useRegisterForEvent() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ eventId, customFields }: { eventId: string; customFields?: Record<string, string> }) =>
            api.post<EventRegistration>(endpoints.register(eventId), { customFields }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['events'] });
            queryClient.invalidateQueries({ queryKey: ['event-registrations'] });
            toast.success('Successfully registered for event');
        },
        onError: () => {
            toast.error('Failed to register for event');
        },
    });
}

// Cancel registration
export function useCancelRegistration() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (eventId: string) => api.delete(endpoints.register(eventId)),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['events'] });
            queryClient.invalidateQueries({ queryKey: ['event-registrations'] });
            toast.success('Registration cancelled');
        },
        onError: () => {
            toast.error('Failed to cancel registration');
        },
    });
}

// Get user's registrations
export function useMyEventRegistrations() {
    return useQuery({
        queryKey: ['event-registrations', 'my'],
        queryFn: () => api.get<EventRegistration[]>(endpoints.myRegistrations),
    });
}

// Admin: Create event
export function useCreateEvent() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: Partial<Event>) => api.post<Event>(endpoints.list, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['events'] });
            toast.success('Event created successfully');
        },
        onError: () => {
            toast.error('Failed to create event');
        },
    });
}

// Admin: Update event
export function useUpdateEvent() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: Partial<Event> }) =>
            api.put<Event>(endpoints.get(id), data),
        onSuccess: (_, { id }) => {
            queryClient.invalidateQueries({ queryKey: ['events'] });
            queryClient.invalidateQueries({ queryKey: ['event', id] });
            toast.success('Event updated successfully');
        },
        onError: () => {
            toast.error('Failed to update event');
        },
    });
}

// Admin: Delete event
export function useDeleteEvent() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => api.delete(endpoints.get(id)),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['events'] });
            toast.success('Event deleted');
        },
        onError: () => {
            toast.error('Failed to delete event');
        },
    });
}

// Admin: Publish event
export function usePublishEvent() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => api.put<Event>(`events/${id}/publish`),
        onSuccess: (_, id) => {
            queryClient.invalidateQueries({ queryKey: ['events'] });
            queryClient.invalidateQueries({ queryKey: ['event', id] });
            toast.success('Event published');
        },
        onError: () => {
            toast.error('Failed to publish event');
        },
    });
}