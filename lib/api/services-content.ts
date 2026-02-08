/**
 * Services Page Content API
 * Backend integration for services page CMS
 */

import { api } from './client';
import type { ServicesPageContent } from '@/lib/store/services-content';

export const servicesContentEndpoints = {
    get: 'content/services',
    update: 'content/services',
    publish: 'content/services/publish',
};

/**
 * Fetch services page content
 */
export async function getServicesContent(): Promise<ServicesPageContent> {
    return api.get<ServicesPageContent>(servicesContentEndpoints.get);
}

/**
 * Update services page content (draft)
 */
export async function updateServicesContent(content: ServicesPageContent): Promise<ServicesPageContent> {
    return api.put<ServicesPageContent>(servicesContentEndpoints.update, content);
}

/**
 * Publish services page content
 */
export async function publishServicesContent(): Promise<ServicesPageContent> {
    return api.post<ServicesPageContent>(servicesContentEndpoints.publish);
}
