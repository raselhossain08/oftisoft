/**
 * Community Page Content API
 * Backend integration for community page CMS
 */

import { api } from './client';
import type { CommunityPageContent } from '@/lib/store/community-content';

export const communityContentEndpoints = {
    get: 'content/community',
    update: 'content/community',
    publish: 'content/community/publish',
};

/**
 * Fetch community page content
 */
export async function getCommunityContent(): Promise<CommunityPageContent> {
    return api.get<CommunityPageContent>(communityContentEndpoints.get);
}

/**
 * Update community page content (draft)
 */
export async function updateCommunityContent(content: CommunityPageContent): Promise<CommunityPageContent> {
    return api.put<CommunityPageContent>(communityContentEndpoints.update, content);
}

/**
 * Publish community page content
 */
export async function publishCommunityContent(): Promise<CommunityPageContent> {
    return api.post<CommunityPageContent>(communityContentEndpoints.publish);
}
