import axios from 'axios';
import { getIsLoggingOut } from '@/store/useAuthStore';

const API_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

function hasAuthCookies(): boolean {
    return document.cookie.includes('access_token=') || document.cookie.includes('refresh_token=');
}

const api = axios.create({
    baseURL: API_URL,
    withCredentials: true,
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use(
    (config) => {
        const isRefreshEndpoint = config.url?.includes('/auth/refresh');
        if (isRefreshEndpoint && !hasAuthCookies()) {
            return Promise.reject(new axios.Cancel('No auth cookies'));
        }
        return config;
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        const isRefreshRequest = originalRequest.url?.includes('/auth/refresh');
        const isLoggingOut = getIsLoggingOut();

        if (error.response?.status === 401 && !originalRequest._retry && !isRefreshRequest && !isLoggingOut) {
            originalRequest._retry = true;
            try {
                await api.post('/auth/refresh');
                return api(originalRequest);
            } catch {
                // useProtectedRoute handles auth redirects
            }
        }

        return Promise.reject(error);
    }
);

export const axiosClient = api;
export { api };
export default api;

// Domain API modules
export * from './api/domains';
