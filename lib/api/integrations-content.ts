/**
 * Integrations Page Content API
 * Backend integration for integrations page CMS
 */

import { api } from './client';
import type { IntegrationsPageContent } from '@/lib/store/integrations-content';

export const integrationsContentEndpoints = {
    get: 'content/integrations',
    update: 'content/integrations',
    publish: 'content/integrations/publish',
};

/**
 * Fetch integrations page content
 */
export async function getIntegrationsContent(): Promise<IntegrationsPageContent> {
    return api.get<IntegrationsPageContent>(integrationsContentEndpoints.get);
}

/**
 * Update integrations page content (draft)
 */
export async function updateIntegrationsContent(content: IntegrationsPageContent): Promise<IntegrationsPageContent> {
    return api.put<IntegrationsPageContent>(integrationsContentEndpoints.update, content);
}

/**
 * Publish integrations page content
 */
export async function publishIntegrationsContent(): Promise<IntegrationsPageContent> {
    return api.post<IntegrationsPageContent>(integrationsContentEndpoints.publish);
}
