/**
 * Contact Page Content API
 * Backend integration for contact page CMS
 */

import { api } from './client';
import type { ContactPageContent } from '@/lib/store/contact-content';

export const contactContentEndpoints = {
    get: 'content/contact',
    update: 'content/contact',
    publish: 'content/contact/publish',
};

/**
 * Fetch contact page content
 */
export async function getContactContent(): Promise<ContactPageContent> {
    return api.get<ContactPageContent>(contactContentEndpoints.get);
}

/**
 * Update contact page content (draft)
 */
export async function updateContactContent(content: ContactPageContent): Promise<ContactPageContent> {
    return api.put<ContactPageContent>(contactContentEndpoints.update, content);
}

/**
 * Publish contact page content
 */
export async function publishContactContent(): Promise<ContactPageContent> {
    return api.post<ContactPageContent>(contactContentEndpoints.publish);
}
