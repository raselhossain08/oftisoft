/**
 * Blog Page Content API
 * Backend integration for blog page CMS
 */

import { api } from './client';
import type { BlogPageContent } from '@/lib/store/blog-content';

export const blogContentEndpoints = {
    get: 'content/blog',
    update: 'content/blog',
    publish: 'content/blog/publish',
};

/**
 * Fetch blog page content
 */
export async function getBlogContent(): Promise<BlogPageContent> {
    return api.get<BlogPageContent>(blogContentEndpoints.get);
}

/**
 * Update blog page content (draft)
 */
export async function updateBlogContent(content: BlogPageContent): Promise<BlogPageContent> {
    return api.put<BlogPageContent>(blogContentEndpoints.update, content);
}

/**
 * Publish blog page content
 */
export async function publishBlogContent(): Promise<BlogPageContent> {
    return api.post<BlogPageContent>(blogContentEndpoints.publish);
}
