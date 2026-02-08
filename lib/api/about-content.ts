/**
 * About Page Content API
 */

import { api } from './client';
import { AboutPageContent } from '@/lib/store/about-content';

export const aboutContentEndpoints = {
    get: 'content/about',
    update: 'content/about',
    publish: 'content/about/publish',
    history: 'content/about/history',
    restore: (versionId: string) => `content/about/restore/${versionId}`,
};

export async function getAboutContent(): Promise<AboutPageContent> {
    return api.get<AboutPageContent>(aboutContentEndpoints.get);
}

export async function updateAboutContent(content: Partial<AboutPageContent>): Promise<AboutPageContent> {
    return api.put<AboutPageContent>(aboutContentEndpoints.update, content);
}

export async function publishAboutContent(): Promise<AboutPageContent> {
    return api.post<AboutPageContent>(aboutContentEndpoints.publish);
}

export async function getAboutContentHistory(): Promise<Array<{
    id: string;
    content: AboutPageContent;
    createdAt: string;
    createdBy: string;
}>> {
    return api.get(aboutContentEndpoints.history);
}

export async function restoreAboutContentVersion(versionId: string): Promise<AboutPageContent> {
    return api.post(aboutContentEndpoints.restore(versionId));
}
