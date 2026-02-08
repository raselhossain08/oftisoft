/**
 * Home Page Content API
 * Backend integration for home page CMS
 */

import { api, endpoints } from './client';
import { HomePageContent } from '@/lib/store/home-content';

// Extend endpoints
export const homeContentEndpoints = {
    get: 'content/home',
    update: 'content/home',
    publish: 'content/home/publish',
    uploadImage: 'content/home/upload/image',
    uploadVideo: 'content/home/upload/video',
    history: 'content/home/history',
    restore: (versionId: string) => `content/home/restore/${versionId}`,
};

/**
 * Fetch home page content
 */
export async function getHomeContent(): Promise<HomePageContent> {
    return api.get<HomePageContent>(homeContentEndpoints.get);
}

/**
 * Update home page content (draft)
 */
export async function updateHomeContent(content: Partial<HomePageContent>): Promise<HomePageContent> {
    return api.put<HomePageContent>(homeContentEndpoints.update, content);
}

/**
 * Publish home page content
 */
export async function publishHomeContent(): Promise<HomePageContent> {
    return api.post<HomePageContent>(homeContentEndpoints.publish);
}

/**
 * Upload image
 */
export async function uploadImage(file: File): Promise<{ url: string; id: string }> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/${homeContentEndpoints.uploadImage}`, {
        method: 'POST',
        body: formData,
        headers: {
            'Authorization': `Bearer ${typeof window !== 'undefined' ? localStorage.getItem('auth_token') : ''}`,
        },
    });

    if (!response.ok) {
        throw new Error('Upload failed');
    }

    return response.json();
}

/**
 * Upload video
 */
export async function uploadVideo(file: File, onProgress?: (progress: number) => void): Promise<{ url: string; id: string }> {
    return new Promise((resolve, reject) => {
        const formData = new FormData();
        formData.append('file', file);

        const xhr = new XMLHttpRequest();

        // Progress tracking
        xhr.upload.addEventListener('progress', (e) => {
            if (e.lengthComputable && onProgress) {
                const progress = (e.loaded / e.total) * 100;
                onProgress(progress);
            }
        });

        xhr.addEventListener('load', () => {
            if (xhr.status === 200) {
                resolve(JSON.parse(xhr.responseText));
            } else {
                reject(new Error('Upload failed'));
            }
        });

        xhr.addEventListener('error', () => reject(new Error('Upload failed')));

        xhr.open('POST', `${process.env.NEXT_PUBLIC_API_URL}/${homeContentEndpoints.uploadVideo}`);
        xhr.setRequestHeader('Authorization', `Bearer ${typeof window !== 'undefined' ? localStorage.getItem('auth_token') : ''}`);
        xhr.send(formData);
    });
}

/**
 * Get content history/versions
 */
export async function getContentHistory(): Promise<Array<{
    id: string;
    content: HomePageContent;
    createdAt: string;
    createdBy: string;
}>> {
    return api.get(homeContentEndpoints.history);
}

/**
 * Restore a previous version
 */
export async function restoreContentVersion(versionId: string): Promise<HomePageContent> {
    return api.post(homeContentEndpoints.restore(versionId));
}
