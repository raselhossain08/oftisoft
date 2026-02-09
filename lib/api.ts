import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
    baseURL: API_URL,
    withCredentials: true, // Important: Send cookies with requests
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor
api.interceptors.request.use(
    (config) => {
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor - no automatic redirect on 401
// Auth is handled via auth.service + useProtectedRoute
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // If 401 and not yet retried, try token refresh
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                await api.post('/auth/refresh');
                return api(originalRequest);
            } catch {
                // Don't redirect - avoid reload loop on login page
                // useProtectedRoute handles auth redirects
            }
        }

        return Promise.reject(error);
    }
);

export interface RegisterData {
    name: string;
    email: string;
    phone: string;
    password: string;
}

export interface LoginData {
    email: string;
    password: string;
    remember?: boolean;
}

export interface UpdateProfileData {
    name?: string;
    phone?: string;
    jobTitle?: string;
    bio?: string;
    address?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    unit?: string;
    emailNotifications?: boolean;
    pushNotifications?: boolean;
    smsNotifications?: boolean;
    marketingNotifications?: boolean;
    avatarUrl?: string;
    artifactDeploymentNotifications?: boolean;
    mentionNotifications?: boolean;
    milestoneNotifications?: boolean;
    allocationNotifications?: boolean;
    ledgerNotifications?: boolean;
    transactionNotifications?: boolean;
    loginAlertNotifications?: boolean;
    securityAlertNotifications?: boolean;
    kernelUpdateNotifications?: boolean;
}

export interface User {
    id: string;
    email: string;
    name: string;
    avatarUrl?: string;
    phone: string;
    jobTitle?: string;
    bio?: string;
    address?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    unit?: string;
    emailNotifications: boolean;
    pushNotifications: boolean;
    smsNotifications: boolean;
    marketingNotifications: boolean;
    artifactDeploymentNotifications: boolean;
    mentionNotifications: boolean;
    milestoneNotifications: boolean;
    allocationNotifications: boolean;
    ledgerNotifications: boolean;
    transactionNotifications: boolean;
    loginAlertNotifications: boolean;
    securityAlertNotifications: boolean;
    kernelUpdateNotifications: boolean;
    isActive: boolean;
    isEmailVerified: boolean;
    isTwoFactorEnabled: boolean;
    role: string;
    password?: string;
    createdAt: string;
    updatedAt: string;
}

export interface AuthResponse {
    message: string;
    user: User;
    accessToken?: string;
}

// Session interface
export interface Session {
    id: string;
    token: string;
    userId: string;
    userAgent?: string;
    ipAddress?: string;
    isRevoked: boolean;
    expiresAt: string;
    createdAt: string;
    updatedAt: string;
}

// Auth API functions
export const authAPI = {
    // Register new user
    register: async (data: RegisterData): Promise<AuthResponse> => {
        const response = await api.post('/auth/register', data);
        return response.data;
    },

    // Login user
    login: async (data: LoginData): Promise<AuthResponse> => {
        const response = await api.post('/auth/login', data);
        return response.data;
    },

    // Logout user
    logout: async (): Promise<{ message: string }> => {
        const response = await api.post('/auth/logout');
        return response.data;
    },

    // Get current user profile
    getProfile: async (): Promise<User> => {
        const response = await api.get('/auth/profile');
        return response.data;
    },

    // Update user profile
    updateProfile: async (data: Partial<User>): Promise<User> => {
        const response = await api.post('/auth/profile', data);
        return response.data;
    },

    uploadAvatar: async (file: File): Promise<User> => {
        const formData = new FormData();
        formData.append('file', file);
        const response = await api.post('/auth/avatar', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    // Change password
    changePassword: async (data: { oldPassword: string; newPassword: string }): Promise<{ message: string }> => {
        const response = await api.post('/auth/change-password', data);
        return response.data;
    },

    // Get active sessions
    getSessions: async (): Promise<Session[]> => {
        const response = await api.get('/auth/sessions');
        return response.data;
    },

    // Revoke a session
    revokeSession: async (id: string): Promise<{ message: string }> => {
        const response = await api.post(`/auth/sessions/revoke/${id}`);
        return response.data;
    },

    // Check if user is authenticated
    checkAuth: async (): Promise<{ authenticated: boolean; user: User }> => {
        const response = await api.get('/auth/check');
        return response.data;
    },

    // Refresh access token
    refreshToken: async (): Promise<{ message: string; accessToken: string }> => {
        const response = await api.post('/auth/refresh');
        return response.data;
    },

    // Revoke all tokens (logout from all devices)
    revokeAllTokens: async (): Promise<{ message: string }> => {
        const response = await api.post('/auth/revoke-all');
        return response.data;
    },

    // 2FA Endpoints
    setup2FA: async (): Promise<{ message: string; secret: string; qrCode: string }> => {
        const response = await api.post('/auth/2fa/setup');
        return response.data;
    },

    verify2FA: async (code: string): Promise<{ message: string; enabled: boolean }> => {
        const response = await api.post('/auth/2fa/verify', { code });
        return response.data;
    },

    disable2FA: async (code: string): Promise<{ message: string; enabled: boolean }> => {
        const response = await api.post('/auth/2fa/disable', { code });
        return response.data;
    },
};

export enum TicketStatus {
    OPEN = 'open',
    PENDING = 'pending',
    RESOLVED = 'resolved',
    CLOSED = 'closed'
}

export enum TicketPriority {
    LOW = 'low',
    MEDIUM = 'medium',
    HIGH = 'high',
    URGENT = 'urgent'
}

export interface TicketMessage {
    id: string;
    content: string;
    sender: User;
    createdAt: string;
}

export interface Ticket {
    id: string;
    subject: string;
    status: TicketStatus;
    priority: TicketPriority;
    category: string;
    customer: User;
    messages?: TicketMessage[];
    createdAt: string;
    updatedAt: string;
}

export const supportAPI = {
    getTickets: async (status?: string): Promise<Ticket[]> => {
        const response = await api.get('/support/tickets', { params: { status } });
        return response.data;
    },
    getTicket: async (id: string): Promise<Ticket> => {
        const response = await api.get(`/support/tickets/${id}`);
        return response.data;
    },
    createTicket: async (data: { subject: string; category: string; priority: string; description: string }): Promise<Ticket> => {
        const response = await api.post('/support/tickets', data);
        return response.data;
    },
    updateTicketStatus: async (id: string, status: string): Promise<Ticket> => {
        const response = await api.patch(`/support/tickets/${id}/status`, { status });
        return response.data;
    },
    addMessage: async (id: string, content: string): Promise<TicketMessage> => {
        const response = await api.post(`/support/tickets/${id}/messages`, { content });
        return response.data;
    },
    getStats: async (): Promise<any> => {
        const response = await api.get('/support/stats');
        return response.data;
    }
};

export interface PaymentMethod {
    id: string;
    brand: string;
    last4: string;
    expiry: string;
    isDefault: boolean;
    type: string;
    createdAt: string;
}

export interface Transaction {
    id: string;
    invoiceId: string;
    amount: string;
    type: string;
    status: string;
    createdAt: string;
    dueAt?: string;
}

export const billingAPI = {
    getPaymentMethods: async (): Promise<PaymentMethod[]> => {
        const response = await api.get('/billing/payment-methods');
        return response.data;
    },
    addPaymentMethod: async (data: Partial<PaymentMethod>): Promise<PaymentMethod> => {
        const response = await api.post('/billing/payment-methods', data);
        return response.data;
    },
    setDefaultPaymentMethod: async (id: string): Promise<PaymentMethod> => {
        const response = await api.patch(`/billing/payment-methods/${id}/default`);
        return response.data;
    },
    deletePaymentMethod: async (id: string): Promise<void> => {
        await api.delete(`/billing/payment-methods/${id}`);
    },
    getTransactions: async (): Promise<Transaction[]> => {
        const response = await api.get('/billing/transactions');
        return response.data;
    },
    createTransaction: async (data: Partial<Transaction>): Promise<Transaction> => {
        const response = await api.post('/billing/transactions', data);
        return response.data;
    },
    getSubscription: async (): Promise<{ plan: string; status: string }> => {
        const response = await api.get('/billing/subscription');
        return response.data;
    },
    updateSubscription: async (plan: string): Promise<any> => {
        const response = await api.patch('/billing/subscription', { plan });
        return response.data;
    },
    getUsage: async (): Promise<any> => {
        const response = await api.get('/billing/usage');
        return response.data;
    },
    createPaymentIntent: async (amount: number, currency: string = 'usd'): Promise<{ clientSecret: string; id: string }> => {
        const response = await api.post('/billing/create-payment-intent', { amount, currency });
        return response.data;
    },
};

export const downloadsAPI = {
    getInventory: async (): Promise<any[]> => {
        const response = await api.get('/downloads/inventory');
        return response.data;
    },
    getHistory: async (): Promise<any[]> => {
        const response = await api.get('/downloads/history');
        return response.data;
    },
    getNotifications: async (): Promise<any[]> => {
        const response = await api.get('/downloads/notifications');
        return response.data;
    },
    recordDownload: async (id: string): Promise<any> => {
        const response = await api.post(`/downloads/${id}/record`);
        return response.data;
    },
    getVersions: async (productId: string): Promise<any[]> => {
        const response = await api.get(`/downloads/${productId}/versions`);
        return response.data;
    },
    getChangelog: async (productId: string): Promise<any> => {
        const response = await api.get(`/downloads/${productId}/changelog`);
        return response.data;
    },
};

export const favoritesAPI = {
    getFavorites: async (): Promise<any[]> => {
        const response = await api.get('/favorites');
        return response.data;
    },
    addFavorite: async (productId: string): Promise<any> => {
        const response = await api.post(`/favorites/${productId}`);
        return response.data;
    },
    removeFavorite: async (productId: string): Promise<any> => {
        const response = await api.delete(`/favorites/${productId}`);
        return response.data;
    },
    checkFavorite: async (productId: string): Promise<{ isFavorite: boolean }> => {
        const response = await api.get(`/favorites/${productId}/check`);
        return response.data;
    },
};

export const marketingAPI = {
    getCoupons: async (): Promise<any[]> => {
        const response = await api.get('/marketing/coupons');
        return response.data;
    },
    createCoupon: async (data: any): Promise<any> => {
        const response = await api.post('/marketing/coupons', data);
        return response.data;
    },
    deleteCoupon: async (id: string): Promise<any> => {
        const response = await api.delete(`/marketing/coupons/${id}`);
        return response.data;
    },
    getBundles: async (): Promise<any[]> => {
        const response = await api.get('/marketing/bundles');
        return response.data;
    },
    createBundle: async (data: any): Promise<any> => {
        const response = await api.post('/marketing/bundles', data);
        return response.data;
    },
    getProducts: async (): Promise<any[]> => {
        const response = await api.get('/marketing/products');
        return response.data;
    },
    deleteBundle: async (id: string): Promise<any> => {
        const response = await api.delete(`/marketing/bundles/${id}`);
        return response.data;
    },
    updateCoupon: async (id: string, data: any): Promise<any> => {
        const response = await api.put(`/marketing/coupons/${id}`, data);
        return response.data;
    },
    updateBundle: async (id: string, data: any): Promise<any> => {
        const response = await api.put(`/marketing/bundles/${id}`, data);
        return response.data;
    },
    getSubscriptionPlans: async (): Promise<any[]> => {
        const response = await api.get('/marketing/subscription-plans');
        return response.data;
    },
    createSubscriptionPlan: async (data: any): Promise<any> => {
        const response = await api.post('/marketing/subscription-plans', data);
        return response.data;
    },
    updateSubscriptionPlan: async (id: string, data: any): Promise<any> => {
        const response = await api.put(`/marketing/subscription-plans/${id}`, data);
        return response.data;
    },
    deleteSubscriptionPlan: async (id: string): Promise<any> => {
        const response = await api.delete(`/marketing/subscription-plans/${id}`);
        return response.data;
    },
};

export interface SystemConfig {
    id: number;
    shopName: string;
    supportEmail: string;
    description: string;
    currency: string;
    timezone: string;
    dateFormat: string;
    maintenanceMode: boolean;
    passwordPolicy: 'low' | 'medium' | 'high';
    allowedIps: string;
    stripePublishableKey?: string;
    stripeSecretKey?: string;
    paypalClientId?: string;
    paypalClientSecret?: string;
    updatedAt: string;
}

export interface ApiKey {
    id: string;
    name: string;
    key: string;
    status: 'active' | 'revoked';
    createdAt: string;
    lastUsedAt?: string;
}

export interface EmailTemplate {
    id: string;
    name: string;
    subject: string;
    body: string;
    status: 'active' | 'draft';
    createdAt: string;
    updatedAt: string;
}

export const systemAPI = {
    getConfig: async (): Promise<SystemConfig> => {
        const response = await api.get('/system/config');
        return response.data;
    },
    getPublicConfig: async (): Promise<{ stripePublishableKey?: string; paypalClientId?: string; shopName: string; currency: string }> => {
        const response = await api.get('/system/public/config');
        return response.data;
    },
    updateConfig: async (data: Partial<SystemConfig>): Promise<SystemConfig> => {
        const response = await api.post('/system/config', data);
        return response.data;
    },
    getAllStaff: async (): Promise<User[]> => {
        const response = await api.get('/system/staff');
        return response.data;
    },
    updateStaffRole: async (id: string, role: string): Promise<User> => {
        const response = await api.patch(`/system/staff/${id}/role`, { role });
        return response.data;
    },
    removeStaff: async (id: string): Promise<void> => {
        await api.delete(`/system/staff/${id}`);
    },
    getApiKeys: async (): Promise<ApiKey[]> => {
        const response = await api.get('/system/api-keys');
        return response.data;
    },
    createApiKey: async (name: string): Promise<ApiKey> => {
        const response = await api.post('/system/api-keys', { name });
        return response.data;
    },
    revokeApiKey: async (id: string): Promise<void> => {
        await api.patch(`/system/api-keys/${id}/revoke`);
    },
    getEmailTemplates: async (): Promise<EmailTemplate[]> => {
        const response = await api.get('/system/email-templates');
        return response.data;
    },
    createEmailTemplate: async (data: Partial<EmailTemplate>): Promise<EmailTemplate> => {
        const response = await api.post('/system/email-templates', data);
        return response.data;
    },
    updateEmailTemplate: async (id: string, data: Partial<EmailTemplate>): Promise<EmailTemplate> => {
        const response = await api.patch(`/system/email-templates/${id}`, data);
        return response.data;
    },
    deleteEmailTemplate: async (id: string): Promise<void> => {
        await api.delete(`/system/email-templates/${id}`);
    },
};

export const integrationsAPI = {
    getIntegrations: async (): Promise<any[]> => {
        const response = await api.get('/integrations');
        return response.data;
    },
    toggleIntegration: async (id: string, connected: boolean): Promise<any> => {
        const response = await api.post(`/integrations/${id}/toggle`, { connected });
        return response.data;
    }
};

export const adminUserAPI = {
    getUsers: async (params?: { search?: string; role?: string; isActive?: boolean }) => {
        const response = await api.get<User[]>("/admin/users", { params });
        return response.data;
    },
    getUser: async (id: string) => {
        const response = await api.get<User>(`/admin/users/${id}`);
        return response.data;
    },
    getUserStats: async (id: string) => {
        const response = await api.get<{ ltv: string; orderCount: number; ticketCount: number }>(`/admin/users/${id}/stats`);
        return response.data;
    },
    createUser: async (data: any) => {
        const response = await api.post<User>("/admin/users", data);
        return response.data;
    },
    updateUser: async (id: string, data: Partial<User>) => {
        const response = await api.patch<User>(`/admin/users/${id}`, data);
        return response.data;
    },
    deleteUser: async (id: string) => {
        await api.delete(`/admin/users/${id}`);
    },
    toggleUserStatus: async (id: string) => {
        const response = await api.patch<User>(`/admin/users/${id}/toggle-status`);
        return response.data;
    },
    getActivity: async (id: string) => {
        const response = await api.get<any[]>(`/admin/users/${id}/activity`);
        return response.data;
    }
};

export const adminFinanceAPI = {
    getTransactions: async () => {
        const response = await api.get<any[]>("/admin/billing/transactions");
        return response.data;
    },
    getStats: async () => {
        const response = await api.get<any>("/admin/billing/stats");
        return response.data;
    },
    getPayouts: async () => {
        const response = await api.get<any[]>("/admin/billing/payouts");
        return response.data;
    },
    processPayout: async (data: any) => {
        const response = await api.post("/admin/billing/process-payout", data);
        return response.data;
    },
    getConfig: async () => {
        const response = await api.get<any>("/admin/billing/config");
        return response.data;
    },
    updateConfig: async (config: any) => {
        const response = await api.patch("/admin/billing/config", config);
        return response.data;
    }
};

export const messagesAPI = {
    getConversations: async (): Promise<any[]> => {
        const response = await api.get('/messages/conversations');
        return response.data;
    },
    getMessages: async (conversationId: string): Promise<any[]> => {
        const response = await api.get(`/messages/${conversationId}`);
        return response.data;
    },
    sendMessage: async (conversationId: string, content: string): Promise<any> => {
        const response = await api.post(`/messages/${conversationId}`, { content });
        return response.data;
    },
    startConversation: async (recipientId: string): Promise<any> => {
        const response = await api.post('/messages', { recipientId });
        return response.data;
    },
    getSupportBot: async (): Promise<any> => {
        const response = await api.get('/messages/support-bot');
        return response.data;
    }
};

export const notificationsAPI = {
    getNotifications: async (): Promise<any[]> => {
        const response = await api.get('/notifications');
        return response.data;
    },
    getArchivedNotifications: async (): Promise<any[]> => {
        const response = await api.get('/notifications/archived');
        return response.data;
    },
    markAsRead: async (id: string): Promise<void> => {
        await api.put(`/notifications/${id}/read`);
    },
    markAllAsRead: async (): Promise<void> => {
        await api.put('/notifications/read-all');
    },
    archive: async (id: string): Promise<void> => {
        await api.put(`/notifications/${id}/archive`);
    },
    delete: async (id: string): Promise<void> => {
        await api.delete(`/notifications/${id}`);
    }
};

export interface OrderItem {
    id: string;
    productId: string;
    productName: string;
    price: number;
    quantity: number;
    downloadUrl?: string;
}

export interface Order {
    id: string;
    user: User;
    status: 'pending' | 'processing' | 'completed' | 'cancelled' | 'refunded';
    total: number;
    paymentMethod: string;
    items: OrderItem[];
    shippingAddress?: {
        street: string;
        city: string;
        country: string;
        zip: string;
    };
    trackingNumber?: string;
    createdAt: string;
    updatedAt: string;
}

export const ordersAPI = {
    getOrders: async (): Promise<Order[]> => {
        const response = await api.get('/orders');
        return response.data;
    },
    getOrder: async (id: string): Promise<Order> => {
        const response = await api.get(`/orders/${id}`);
        return response.data;
    },
    createOrder: async (data: any): Promise<Order> => {
        const response = await api.post('/orders', data);
        return response.data;
    },
    updateStatus: async (id: string, status: string): Promise<Order> => {
        const response = await api.patch(`/orders/${id}/status`, { status });
        return response.data;
    },
    downloadInvoice: async (id: string): Promise<void> => {
        const response = await api.get(`/orders/${id}/invoice`, {
            responseType: 'blob',
        });
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `invoice_${id}.pdf`);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
    },
    exportReport: async (): Promise<void> => {
        const response = await api.get('/orders/export', {
            responseType: 'blob',
        });
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'orders_report.csv');
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
    }
};

export interface Product {
    id: string;
    name: string;
    slug: string;
    description: string;
    price: number;
    rating: number;
    reviews: number;
    category: string;
    subcategory: string;
    image: string;
    tags: string[];
    features: string[];
    screenshots: string[];
    demoUrl?: string;
    docUrl?: string;
    compatibility: string[];
    version: string;
    updatePolicy: string;
    licenseRegular: number;
    licenseExtended: number;
    lastUpdated?: string;
    createdAt: string;
    updatedAt: string;
}

export const productsAPI = {
    getProducts: async (search?: string, category?: string): Promise<Product[]> => {
        const params: any = {};
        if (search) params.search = search;
        if (category) params.category = category;
        const response = await api.get('/products', { params });
        return response.data;
    },
    getProduct: async (id: string): Promise<Product> => {
        const response = await api.get(`/products/${id}`);
        return response.data;
    },
    createProduct: async (data: Partial<Product>): Promise<Product> => {
        const response = await api.post('/products', data);
        return response.data;
    },
    updateProduct: async (id: string, data: Partial<Product>): Promise<Product> => {
        const response = await api.patch(`/products/${id}`, data);
        return response.data;
    },
    deleteProduct: async (id: string): Promise<void> => {
        await api.delete(`/products/${id}`);
    },
    getStats: async (): Promise<any> => {
        const response = await api.get('/products/stats');
        return response.data;
    }
};

export interface Category {
    id: string;
    name: string;
    slug: string;
    description?: string;
    subcategories: string[];
    productCount: number;
    order: number;
    createdAt: string;
    updatedAt: string;
}

export const categoriesAPI = {
    getCategories: async (): Promise<Category[]> => {
        const response = await api.get('/categories');
        return response.data;
    },
    getCategory: async (id: string): Promise<Category> => {
        const response = await api.get(`/categories/${id}`);
        return response.data;
    },
    createCategory: async (data: Partial<Category>): Promise<Category> => {
        const response = await api.post('/categories', data);
        return response.data;
    },
    updateCategory: async (id: string, data: Partial<Category>): Promise<Category> => {
        const response = await api.patch(`/categories/${id}`, data);
        return response.data;
    },
    deleteCategory: async (id: string): Promise<void> => {
        await api.delete(`/categories/${id}`);
    },
    addSubcategory: async (id: string, subcategory: string): Promise<Category> => {
        const response = await api.post(`/categories/${id}/subcategories`, { subcategory });
        return response.data;
    },
    removeSubcategory: async (id: string, subcategory: string): Promise<Category> => {
        const response = await api.delete(`/categories/${id}/subcategories/${subcategory}`);
        return response.data;
    }
};

export interface Project {
    id: string;
    title: string;
    description?: string;
    client: string;
    status: string;
    progress: number;
    dueDate?: string;
    members: number;
    budget?: number;
    paymentStatus: string;
    userId?: string;
    notes?: string;
    tags?: string[];
    createdAt: string;
    updatedAt: string;
}

export const projectsAPI = {
    getProjects: async (status?: string): Promise<Project[]> => {
        const params: any = {};
        if (status) params.status = status;
        const response = await api.get('/projects', { params });
        return response.data;
    },
    getProject: async (id: string): Promise<Project> => {
        const response = await api.get(`/projects/${id}`);
        return response.data;
    },
    createProject: async (data: Partial<Project>): Promise<Project> => {
        const response = await api.post('/projects', data);
        return response.data;
    },
    updateProject: async (id: string, data: Partial<Project>): Promise<Project> => {
        const response = await api.patch(`/projects/${id}`, data);
        return response.data;
    },
    deleteProject: async (id: string): Promise<void> => {
        await api.delete(`/projects/${id}`);
    },
    getStats: async (): Promise<any> => {
        const response = await api.get('/projects/stats');
        return response.data;
    },
    updatePaymentStatus: async (id: string, paymentStatus: string): Promise<Project> => {
        const response = await api.patch(`/projects/${id}/payment-status`, { paymentStatus });
        return response.data;
    }
};

export default api;

// Quotes API
export interface QuoteProposal {
    price: number;
    estimatedDays: number;
    validUntil: string;
    content: string;
    milestones: Array<{
        id: string;
        title: string;
        week: number;
        status: string;
    }>;
}

export interface Quote {
    id: string;
    serviceType: string;
    description: string;
    budget: string;
    status: string;
    proposal?: QuoteProposal;
    createdAt: string;
    updatedAt: string;
}

export const quotesAPI = {
    getQuotes: async (): Promise<Quote[]> => {
        const response = await api.get('/quotes');
        return response.data;
    },
    getQuote: async (id: string): Promise<Quote> => {
        const response = await api.get(`/quotes/${id}`);
        return response.data;
    },
    createQuote: async (data: Partial<Quote>): Promise<Quote> => {
        const response = await api.post('/quotes', data);
        return response.data;
    },
    updateQuote: async (id: string, data: Partial<Quote>): Promise<Quote> => {
        const response = await api.patch(`/quotes/${id}`, data);
        return response.data;
    },
    updateStatus: async (id: string, status: string): Promise<Quote> => {
        const response = await api.patch(`/quotes/${id}/status`, { status });
        return response.data;
    },
    deleteQuote: async (id: string): Promise<void> => {
        await api.delete(`/quotes/${id}`);
    },
    downloadProposal: async (id: string): Promise<void> => {
        const response = await api.get(`/quotes/${id}/download`, {
            responseType: 'blob',
        });
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `proposal_${id}.pdf`);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
    }
};

// Content Management API
export interface PageContent {
    id: string;
    pageKey: string;
    content: any;
    status: string;
    publishedAt?: string;
    createdAt: string;
    updatedAt: string;
}

export const contentAPI = {
    getPageContent: async (pageKey: string): Promise<PageContent> => {
        const response = await api.get(`/content/${pageKey}`);
        return response.data;
    },
    updatePageContent: async (pageKey: string, content: any, status?: string): Promise<PageContent> => {
        const response = await api.put(`/content/${pageKey}`, { content, status });
        return response.data;
    },
    publishPageContent: async (pageKey: string): Promise<PageContent> => {
        const response = await api.put(`/content/${pageKey}/publish`);
        return response.data;
    },
    getAllPages: async (): Promise<PageContent[]> => {
        const response = await api.get('/content/pages');
        return response.data;
    }
};

// Leads API
export enum LeadType {
    CTA = 'cta',
    NEWSLETTER = 'newsletter',
    CONTACT = 'contact'
}

export enum LeadStatus {
    NEW = 'new',
    IN_PROGRESS = 'in_progress',
    CONVERTED = 'converted',
    ARCHIVED = 'archived'
}

export interface Lead {
    id: string;
    name?: string;
    email: string;
    message?: string;
    type: LeadType;
    status: LeadStatus;
    metadata?: any;
    createdAt: string;
    updatedAt: string;
}

export const leadsAPI = {
    create: async (data: Partial<Lead>): Promise<Lead> => {
        const response = await api.post('/leads', data);
        return response.data;
    },
    findAll: async (): Promise<Lead[]> => {
        const response = await api.get('/leads');
        return response.data;
    },
    getStats: async (): Promise<any> => {
        const response = await api.get('/leads/stats');
        return response.data;
    },
    updateStatus: async (id: string, status: LeadStatus): Promise<Lead> => {
        const response = await api.patch(`/leads/${id}/status`, { status });
        return response.data;
    },
    delete: async (id: string): Promise<void> => {
        await api.delete(`/leads/${id}`);
    }
};

// ADS API
export enum AdType {
    IMAGE = 'image',
    GOOGLE_ADS = 'google-ads',
    CUSTOM_HTML = 'custom-html',
    SCRIPT = 'script'
}

export enum AdPosition {
    BLOG_LIST_TOP = 'blog-list-top',
    BLOG_LIST_MIDDLE = 'blog-list-middle',
    BLOG_SIDEBAR = 'blog-sidebar',
    POST_CONTENT_TOP = 'post-content-top',
    POST_CONTENT_BOTTOM = 'post-content-bottom',
    FOOTER_ABOVE = 'footer-above'
}

export enum AdSize {
    LEADERBOARD = '728x90',
    BANNER = '468x60',
    SQUARE = '250x250',
    RECTANGLE = '300x250',
    SKY_SCRAPER = '120x600',
    AUTO = 'responsive'
}

export interface Ad {
    id: string;
    title: string;
    type: AdType;
    content: string;
    link?: string;
    position: AdPosition;
    size: AdSize;
    isActive: boolean;
    views: number;
    clicks: number;
    createdAt: string;
    updatedAt: string;
}

export const adsAPI = {
    getActiveByPosition: async (position: string): Promise<Ad[]> => {
        const response = await api.get(`/ads/public/${position}`);
        return response.data;
    },
    trackView: async (id: string): Promise<void> => {
        await api.post(`/ads/track-view/${id}`);
    },
    trackClick: async (id: string): Promise<void> => {
        await api.post(`/ads/track-click/${id}`);
    },
    // Admin methods
    getAll: async (): Promise<Ad[]> => {
        const response = await api.get('/ads');
        return response.data;
    },
    getOne: async (id: string): Promise<Ad> => {
        const response = await api.get(`/ads/${id}`);
        return response.data;
    },
    create: async (data: Partial<Ad>): Promise<Ad> => {
        const response = await api.post('/ads', data);
        return response.data;
    },
    update: async (id: string, data: Partial<Ad>): Promise<Ad> => {
        const response = await api.patch(`/ads/${id}`, data);
        return response.data;
    },
    remove: async (id: string): Promise<void> => {
        await api.delete(`/ads/${id}`);
    }
};

export interface Review {
    id: string;
    product: Product;
    user: User;
    rating: number;
    comment: string;
    status: 'pending' | 'approved' | 'rejected';
    helpfulCount: number;
    createdAt: string;
    updatedAt: string;
}

export const reviewsAPI = {
    createReview: async (data: { productId: string; rating: number; comment: string }): Promise<Review> => {
        const response = await api.post('/reviews', data);
        return response.data;
    },
    getReviews: async (): Promise<Review[]> => {
        const response = await api.get('/reviews');
        return response.data;
    },
    getReviewsByProduct: async (productId: string): Promise<Review[]> => {
        const response = await api.get(`/reviews/${productId}`);
        return response.data;
    },
    updateReview: async (id: string, data: { status?: string }): Promise<Review> => {
        const response = await api.patch(`/reviews/${id}`, data);
        return response.data;
    },
    deleteReview: async (id: string): Promise<void> => {
        await api.delete(`/reviews/${id}`);
    }
};
export const analyticsAPI = {
    trackVisit: async (data: { page: string; referrer?: string; userId?: string }): Promise<void> => {
        await api.post('/analytics/track/visit', data);
    },
    trackEvent: async (data: { eventType: string; eventLabel?: string; page?: string; metadata?: any }): Promise<void> => {
        await api.post('/analytics/track/event', data);
    },
    getStats: async (): Promise<any> => {
        const response = await api.get('/analytics/stats');
        return response.data;
    },
};

export const affiliateAPI = {
    getStats: async (): Promise<any> => {
        const response = await api.get('/affiliate/stats');
        return response.data;
    },
    withdraw: async (data: { amount: number; method: string }): Promise<any> => {
        const response = await api.post('/affiliate/withdraw', data);
        return response.data;
    },
};
