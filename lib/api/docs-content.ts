/**
 * Docs Page Content API
 * Backend integration for documentation page CMS
 */

import { api } from './client';
import type { DocsPageContent } from '@/lib/store/docs-content';

export const docsContentEndpoints = {
    get: 'content/docs',
    update: 'content/docs',
    publish: 'content/docs/publish',
};

/**
 * Fetch docs page content
 */
export async function getDocsContent(): Promise<DocsPageContent> {
    return api.get<DocsPageContent>(docsContentEndpoints.get);
}

/**
 * Update docs page content (draft)
 */
export async function updateDocsContent(content: DocsPageContent): Promise<DocsPageContent> {
    return api.put<DocsPageContent>(docsContentEndpoints.update, content);
}

/**
 * Publish docs page content
 */
export async function publishDocsContent(): Promise<DocsPageContent> {
    return api.post<DocsPageContent>(docsContentEndpoints.publish);
}
