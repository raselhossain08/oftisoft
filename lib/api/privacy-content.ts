/**
 * Privacy Page Content API
 * Backend integration for privacy page CMS
 */

import { api } from './client';
import type { PrivacyPageContent } from '@/lib/store/privacy-content';

export const privacyContentEndpoints = {
    get: 'content/privacy',
    update: 'content/privacy',
    publish: 'content/privacy/publish',
};

/**
 * Fetch privacy page content
 */
export async function getPrivacyContent(): Promise<PrivacyPageContent> {
    return api.get<PrivacyPageContent>(privacyContentEndpoints.get);
}

/**
 * Update privacy page content (draft)
 */
export async function updatePrivacyContent(content: PrivacyPageContent): Promise<PrivacyPageContent> {
    return api.put<PrivacyPageContent>(privacyContentEndpoints.update, content);
}

/**
 * Publish privacy page content
 */
export async function publishPrivacyContent(): Promise<PrivacyPageContent> {
    return api.post<PrivacyPageContent>(privacyContentEndpoints.publish);
}
