/**
 * Navbar Content API
 * Backend integration for global navbar CMS
 */

import { api } from './client';
import type { NavbarContent } from '@/lib/store/navbar-content';

export const navbarContentEndpoints = {
    get: 'content/navbar',
    update: 'content/navbar',
    publish: 'content/navbar/publish',
};

/**
 * Fetch navbar content
 */
export async function getNavbarContent(): Promise<NavbarContent> {
    return api.get<NavbarContent>(navbarContentEndpoints.get);
}

/**
 * Update navbar content (draft)
 */
export async function updateNavbarContent(content: NavbarContent): Promise<NavbarContent> {
    return api.put<NavbarContent>(navbarContentEndpoints.update, content);
}

/**
 * Publish navbar content
 */
export async function publishNavbarContent(): Promise<NavbarContent> {
    return api.post<NavbarContent>(navbarContentEndpoints.publish);
}
