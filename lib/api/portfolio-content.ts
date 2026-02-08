/**
 * Portfolio Page Content API
 * Backend integration for portfolio page CMS
 */

import { api } from './client';
import type { PortfolioPageContent } from '@/lib/store/portfolio-content';

export const portfolioContentEndpoints = {
    get: 'content/portfolio',
    update: 'content/portfolio',
    publish: 'content/portfolio/publish',
};

/**
 * Fetch portfolio page content
 */
export async function getPortfolioContent(): Promise<PortfolioPageContent> {
    return api.get<PortfolioPageContent>(portfolioContentEndpoints.get);
}

/**
 * Update portfolio page content (draft)
 */
export async function updatePortfolioContent(content: PortfolioPageContent): Promise<PortfolioPageContent> {
    return api.put<PortfolioPageContent>(portfolioContentEndpoints.update, content);
}

/**
 * Publish portfolio page content
 */
export async function publishPortfolioContent(): Promise<PortfolioPageContent> {
    return api.post<PortfolioPageContent>(portfolioContentEndpoints.publish);
}
