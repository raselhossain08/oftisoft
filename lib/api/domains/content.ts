import { api } from "@/lib/api";
import type { User, Category } from "@/lib/api";
export interface Post {
    id: string;
    title: string;
    slug: string;
    content: string;
    excerpt: string;
    type: 'article' | 'tutorial' | 'case_study' | 'news' | 'announcement';
    status: 'draft' | 'pending_review' | 'published' | 'archived' | 'scheduled';
    featuredImage: string;
    featuredImageAlt: string;
    author: User;
    authorId: string;
    category: Category | null;
    categoryId: string;
    tags: Tag[];
    keywords: string[];
    readTime: number;
    views: number;
    likes: number;
    comments?: number;
    allowComments: boolean;
    publishedAt: string;
    scheduledAt: string;
    seoTitle: string;
    seoDescription: string;
    canonicalUrl: string;
    isIndexed: boolean;
    isFeatured: boolean;
    isPinned: boolean;
    popularResult?: boolean;
    popularRank?: string;
    gradient?: string;
    metadata: Record<string, any>;
    createdAt: string;
    updatedAt: string;
}

export interface Tag {
    id: string;
    name: string;
    slug: string;
    description: string;
    color: string;
    usageCount: number;
    seoTitle: string;
    seoDescription: string;
    createdAt: string;
    updatedAt: string;
}

export const postsAPI = {
    getPosts: async (params?: { status?: string; type?: string; categoryId?: string; tag?: string; search?: string; limit?: number; offset?: number }): Promise<{ posts: Post[]; total: number }> => {
        const response = await api.get('/posts', { params });
        return response.data;
    },
    getPost: async (id: string): Promise<Post> => {
        const response = await api.get(`/posts/${id}`);
        return response.data;
    },
    getPostBySlug: async (slug: string): Promise<Post> => {
        const response = await api.get(`/posts/slug/${slug}`);
        return response.data;
    },
    getFeatured: async (): Promise<Post[]> => {
        const response = await api.get('/posts/featured');
        return response.data;
    },
    getTags: async (): Promise<Tag[]> => {
        const response = await api.get('/posts/tags');
        return response.data;
    },
    getCategories: async (): Promise<Category[]> => {
        const response = await api.get('/posts/categories');
        return response.data;
    },
    getStats: async (): Promise<{ total: number; published: number; draft: number; totalViews: number; totalLikes: number }> => {
        const response = await api.get('/posts/stats');
        return response.data;
    },
    getRelated: async (id: string): Promise<Post[]> => {
        const response = await api.get(`/posts/${id}/related`);
        return response.data;
    },
    createPost: async (data: { title: string; content: string; excerpt?: string; slug?: string; type?: string; status?: string; categoryId?: string; tags?: string[]; featuredImage?: string; seoTitle?: string; seoDescription?: string; isFeatured?: boolean; allowComments?: boolean; }): Promise<Post> => {
        const response = await api.post('/posts', data);
        return response.data;
    },
    updatePost: async (id: string, data: Omit<Partial<Post>, 'tags'> & { tags?: string[] }): Promise<Post> => {
        const response = await api.put(`/posts/${id}`, data);
        return response.data;
    },
    deletePost: async (id: string): Promise<void> => {
        await api.delete(`/posts/${id}`);
    },
    publishPost: async (id: string): Promise<Post> => {
        const response = await api.put(`/posts/${id}/publish`);
        return response.data;
    },
    schedulePost: async (id: string, scheduledAt: string): Promise<Post> => {
        const response = await api.put(`/posts/${id}/schedule`, { scheduledAt });
        return response.data;
    },
    archivePost: async (id: string): Promise<Post> => {
        const response = await api.put(`/posts/${id}/archive`);
        return response.data;
    },
    duplicatePost: async (id: string): Promise<Post> => {
        const response = await api.post(`/posts/${id}/duplicate`);
        return response.data;
    },
    unpublishPost: async (id: string): Promise<Post> => {
        const response = await api.put(`/posts/${id}/unpublish`);
        return response.data;
    },
    restorePost: async (id: string): Promise<Post> => {
        const response = await api.put(`/posts/${id}/restore`);
        return response.data;
    },
    likePost: async (id: string): Promise<void> => {
        await api.post(`/posts/${id}/like`);
    },
};

export interface Comment {
    id: string;
    content: string;
    postId: string;
    userId: string;
    parentId: string | null;
    likes: number;
    status: string;
    user: {
        id: string;
        name: string;
        avatarUrl?: string;
    };
    post?: {
        id: string;
        title: string;
        slug: string;
    };
    parent?: Comment;
    createdAt: string;
    updatedAt: string;
}

export const commentsAPI = {
    getByPost: async (postId: string): Promise<Comment[]> => {
        const response = await api.get(`/posts/${postId}/comments`);
        return response.data;
    },
    getAll: async (): Promise<Comment[]> => {
        const response = await api.get('/comments');
        return response.data;
    },
    create: async (postId: string, data: { content: string; parentId?: string }): Promise<Comment> => {
        const response = await api.post(`/posts/${postId}/comments`, data);
        return response.data;
    },
    like: async (id: string): Promise<void> => {
        await api.post(`/comments/${id}/like`);
    },
    updateStatus: async (id: string, status: string): Promise<void> => {
        await api.patch(`/comments/${id}/status`, { status });
    },
    delete: async (id: string): Promise<void> => {
        await api.delete(`/comments/${id}`);
    },
};

export const tagsAPI = {
    getTags: async (): Promise<Tag[]> => {
        const response = await api.get('/tags');
        return response.data;
    },
    getTag: async (id: string): Promise<Tag> => {
        const response = await api.get(`/tags/${id}`);
        return response.data;
    },
    createTag: async (data: { name: string; slug?: string; description?: string; color?: string }): Promise<Tag> => {
        const response = await api.post('/tags', data);
        return response.data;
    },
    updateTag: async (id: string, data: Partial<Tag>): Promise<Tag> => {
        const response = await api.patch(`/tags/${id}`, data);
        return response.data;
    },
    deleteTag: async (id: string): Promise<void> => {
        await api.delete(`/tags/${id}`);
    },
};

