/**
 * Features Page Content API
 * Backend integration for features page CMS
 */

import { api } from './client';
import type { FeaturesPageContent } from '@/lib/store/features-content';

export const featuresContentEndpoints = {
    get: 'content/features',
    update: 'content/features',
    publish: 'content/features/publish',
};

/**
 * Fetch features page content
 */
export async function getFeaturesContent(): Promise<FeaturesPageContent> {
    return api.get<FeaturesPageContent>(featuresContentEndpoints.get);
}

/**
 * Update features page content (draft)
 */
export async function updateFeaturesContent(content: FeaturesPageContent): Promise<FeaturesPageContent> {
    return api.put<FeaturesPageContent>(featuresContentEndpoints.update, content);
}

/**
 * Publish features page content
 */
export async function publishFeaturesContent(): Promise<FeaturesPageContent> {
    return api.post<FeaturesPageContent>(featuresContentEndpoints.publish);
}
