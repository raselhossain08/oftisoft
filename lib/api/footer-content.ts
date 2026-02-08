/**
 * Footer Content API
 * Backend integration for global footer CMS
 */

import { api } from './client';
import type { FooterContent } from '@/lib/store/footer-content';

export const footerContentEndpoints = {
    get: 'content/footer',
    update: 'content/footer',
    publish: 'content/footer/publish',
};

/**
 * Fetch footer content
 */
export async function getFooterContent(): Promise<FooterContent> {
    return api.get<FooterContent>(footerContentEndpoints.get);
}

/**
 * Update footer content (draft)
 */
export async function updateFooterContent(content: FooterContent): Promise<FooterContent> {
    return api.put<FooterContent>(footerContentEndpoints.update, content);
}

/**
 * Publish footer content
 */
export async function publishFooterContent(): Promise<FooterContent> {
    return api.post<FooterContent>(footerContentEndpoints.publish);
}
