/**
 * Changelog Page Content API
 * Backend integration for changelog page CMS
 */

import { api } from './client';
import type { ChangelogPageContent } from '@/lib/store/changelog-content';

export const changelogContentEndpoints = {
    get: 'content/changelog',
    update: 'content/changelog',
    publish: 'content/changelog/publish',
};

/**
 * Fetch changelog page content
 */
export async function getChangelogContent(): Promise<ChangelogPageContent> {
    return api.get<ChangelogPageContent>(changelogContentEndpoints.get);
}

/**
 * Update changelog page content (draft)
 */
export async function updateChangelogContent(content: ChangelogPageContent): Promise<ChangelogPageContent> {
    return api.put<ChangelogPageContent>(changelogContentEndpoints.update, content);
}

/**
 * Publish changelog page content
 */
export async function publishChangelogContent(): Promise<ChangelogPageContent> {
    return api.post<ChangelogPageContent>(changelogContentEndpoints.publish);
}
