/**
 * Careers Page Content API
 * Backend integration for careers page CMS
 */

import { api } from './client';
import type { CareersPageContent } from '@/lib/store/careers-content';

export const careersContentEndpoints = {
    get: 'content/careers',
    update: 'content/careers',
    publish: 'content/careers/publish',
};

/**
 * Fetch careers page content
 */
export async function getCareersContent(): Promise<CareersPageContent> {
    return api.get<CareersPageContent>(careersContentEndpoints.get);
}

/**
 * Update careers page content (draft)
 */
export async function updateCareersContent(content: CareersPageContent): Promise<CareersPageContent> {
    return api.put<CareersPageContent>(careersContentEndpoints.update, content);
}

/**
 * Publish careers page content
 */
export async function publishCareersContent(): Promise<CareersPageContent> {
    return api.post<CareersPageContent>(careersContentEndpoints.publish);
}
