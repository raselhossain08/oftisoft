/**
 * Partners Page Content API
 * Backend integration for partners page CMS
 */

import { api } from './client';
import type { PartnersPageContent } from '@/lib/store/partners-content';

export const partnersContentEndpoints = {
    get: 'content/partners',
    update: 'content/partners',
    publish: 'content/partners/publish',
};

/**
 * Fetch partners page content
 */
export async function getPartnersContent(): Promise<PartnersPageContent> {
    return api.get<PartnersPageContent>(partnersContentEndpoints.get);
}

/**
 * Update partners page content (draft)
 */
export async function updatePartnersContent(content: PartnersPageContent): Promise<PartnersPageContent> {
    return api.put<PartnersPageContent>(partnersContentEndpoints.update, content);
}

/**
 * Publish partners page content
 */
export async function publishPartnersContent(): Promise<PartnersPageContent> {
    return api.post<PartnersPageContent>(partnersContentEndpoints.publish);
}
