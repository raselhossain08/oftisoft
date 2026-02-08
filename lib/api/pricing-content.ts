/**
 * Pricing Page Content API
 * Backend integration for pricing page CMS
 */

import { api } from './client';
import type { PricingPageContent } from '@/lib/store/pricing-content';

export const pricingContentEndpoints = {
    get: 'content/pricing',
    update: 'content/pricing',
    publish: 'content/pricing/publish',
};

/**
 * Fetch pricing page content
 */
export async function getPricingContent(): Promise<PricingPageContent> {
    return api.get<PricingPageContent>(pricingContentEndpoints.get);
}

/**
 * Update pricing page content (draft)
 */
export async function updatePricingContent(content: PricingPageContent): Promise<PricingPageContent> {
    return api.put<PricingPageContent>(pricingContentEndpoints.update, content);
}

/**
 * Publish pricing page content
 */
export async function publishPricingContent(): Promise<PricingPageContent> {
    return api.post<PricingPageContent>(pricingContentEndpoints.publish);
}
