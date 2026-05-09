/**
 * Posts API - Frontend hooks for blog posts
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from './client';
import { toast } from 'sonner';

export interface Post {
    id: string;
    title: string;
    slug: string;
    content: string;
    excerpt?: string;
    type: 'article' | 'tutorial' | 'case_study' | 'news' | 'announcement';
    status: 'draft' | 'pending_review' | 'published' | 'archived' | 'scheduled';
    featuredImage?: string;
    featuredImageAlt?: string;
    author: {
        id: string;
        name: string;
        email: string;
        avatarUrl?: string;
    };
    category?: {
        id: string;
        name: string;
        slug: string;
    };
    tags?: Array<{
        id: string;
        name: string;
        slug: string;
    }>;
    keywords?: string[];
    readTime: number;
    views: number;
    likes: number;
    comments: number;
    allowComments: boolean;
    publishedAt?: string;
    scheduledAt?: string;
    seoTitle?: string;
    seoDescription?: string;
    canonicalUrl?: string;
    isIndexed: boolean;
    isFeatured: boolean;
    isPinned: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface PostStats {
    total: number;
    published: number;
    draft: number;
    totalViews: number;
    totalLikes: number;
}

export interface Tag {
    id: string;
    name: string;
    slug: string;
    description?: string;
    color?: string;
    usageCount: number;
}

const endpoints = {
    list: 'posts',
    featured: 'posts/featured',
    get: (id: string) => `posts/${id}`,
    getBySlug: (slug: string) => `posts/slug/${slug}`,
    tags: 'posts/tags',
    categories: 'posts/categories',
    stats: 'posts/stats',
    related: (id: string) => `posts/${id}/related`,
    publish: (id: string) => `posts/${id}/publish`,
    schedule: (id: string) => `posts/${id}/schedule`,
    archive: (id: string) => `posts/${id}/archive`,
    like: (id: string) => `posts/${id}/like`,
};

// Fetch all posts
export function usePosts(options?: {
    status?: string;
    type?: string;
    categoryId?: string;
    tag?: string;
    search?: string;
    limit?: number;
    offset?: number;
}) {
    return useQuery({
        queryKey: ['posts', options],
        queryFn: () => api.get<{ posts: Post[]; total: number }>(endpoints.list, { params: options }),
    });
}

// Fetch featured posts
export function useFeaturedPosts() {
    return useQuery({
        queryKey: ['posts', 'featured'],
        queryFn: () => api.get<Post[]>(endpoints.featured),
    });
}

// Fetch single post
export function usePost(id: string) {
    return useQuery({
        queryKey: ['post', id],
        queryFn: () => api.get<Post>(endpoints.get(id)),
        enabled: !!id,
    });
}

// Fetch post by slug
export function usePostBySlug(slug: string) {
    return useQuery({
        queryKey: ['post', 'slug', slug],
        queryFn: () => api.get<Post>(endpoints.getBySlug(slug)),
        enabled: !!slug,
    });
}

// Fetch related posts
export function useRelatedPosts(id: string, limit = 5) {
    return useQuery({
        queryKey: ['posts', 'related', id],
        queryFn: () => api.get<Post[]>(endpoints.related(id), { params: { limit } }),
        enabled: !!id,
    });
}

// Fetch tags
export function usePostTags() {
    return useQuery({
        queryKey: ['posts', 'tags'],
        queryFn: () => api.get<Tag[]>(endpoints.tags),
    });
}

// Fetch categories
export function usePostCategories() {
    return useQuery({
        queryKey: ['posts', 'categories'],
        queryFn: () => api.get<{ id: string; name: string; slug: string }[]>(endpoints.categories),
    });
}

// Fetch stats
export function usePostStats() {
    return useQuery({
        queryKey: ['posts', 'stats'],
        queryFn: () => api.get<PostStats>(endpoints.stats),
    });
}

// Create post
export function useCreatePost() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: Partial<Post> & { tags?: string[] }) =>
            api.post<Post>(endpoints.list, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['posts'] });
            toast.success('Post created successfully');
        },
        onError: () => {
            toast.error('Failed to create post');
        },
    });
}

// Update post
export function useUpdatePost() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: Partial<Post> & { tags?: string[] } }) =>
            api.put<Post>(endpoints.get(id), data),
        onSuccess: (_, { id }) => {
            queryClient.invalidateQueries({ queryKey: ['posts'] });
            queryClient.invalidateQueries({ queryKey: ['post', id] });
            toast.success('Post updated successfully');
        },
        onError: () => {
            toast.error('Failed to update post');
        },
    });
}

// Delete post
export function useDeletePost() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => api.delete(endpoints.get(id)),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['posts'] });
            toast.success('Post deleted');
        },
        onError: () => {
            toast.error('Failed to delete post');
        },
    });
}

// Publish post
export function usePublishPost() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => api.put<Post>(endpoints.publish(id)),
        onSuccess: (_, id) => {
            queryClient.invalidateQueries({ queryKey: ['posts'] });
            queryClient.invalidateQueries({ queryKey: ['post', id] });
            toast.success('Post published successfully');
        },
        onError: () => {
            toast.error('Failed to publish post');
        },
    });
}

// Schedule post
export function useSchedulePost() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, scheduledAt }: { id: string; scheduledAt: string }) =>
            api.put<Post>(endpoints.schedule(id), { scheduledAt }),
        onSuccess: (_, { id }) => {
            queryClient.invalidateQueries({ queryKey: ['posts'] });
            queryClient.invalidateQueries({ queryKey: ['post', id] });
            toast.success('Post scheduled');
        },
        onError: () => {
            toast.error('Failed to schedule post');
        },
    });
}

// Archive post
export function useArchivePost() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => api.put<Post>(endpoints.archive(id)),
        onSuccess: (_, id) => {
            queryClient.invalidateQueries({ queryKey: ['posts'] });
            queryClient.invalidateQueries({ queryKey: ['post', id] });
            toast.success('Post archived');
        },
        onError: () => {
            toast.error('Failed to archive post');
        },
    });
}

// Like post
export function useLikePost() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => api.post(endpoints.like(id)),
        onSuccess: (_, id) => {
            queryClient.invalidateQueries({ queryKey: ['post', id] });
        },
    });
}