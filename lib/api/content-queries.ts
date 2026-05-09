import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api, endpoints, apiClient } from "./client";

export interface PageContentResponse {
    id: string;
    pageKey: string;
    content: any;
    status: 'draft' | 'published';
    updatedAt: string;
    lastEditedBy?: string;
}

export interface UploadResponse {
    url: string;
    filename: string;
    mimetype: string;
    size: number;
}

// 1. Fetch Page Content
const fetchPageContent = async (pageKey: string): Promise<PageContentResponse> => {
    console.log(`[Content API] Fetching content for page: ${pageKey}`);
    try {
        const result = await api.get<PageContentResponse>(endpoints.content.page(pageKey));
        console.log(`[Content API] Fetched content for ${pageKey}:`, result);
        return result;
    } catch (error) {
        console.error(`[Content API] Error fetching ${pageKey}:`, error);
        throw error;
    }
};

// 2. Update Page Content
const updatePageContent = async ({ pageKey, content }: { pageKey: string; content: any }): Promise<PageContentResponse> => {
    console.log(`[Content API] Updating content for page: ${pageKey}`);
    return api.put<PageContentResponse>(endpoints.content.update(pageKey), { content });
};

// 3. Publish Page Content
const publishPageContent = async (pageKey: string): Promise<PageContentResponse> => {
    return api.put<PageContentResponse>(endpoints.content.publish(pageKey));
};

// --- Hooks ---

export function usePageContent(pageKey: string) {
    return useQuery({
        queryKey: ["content", pageKey],
        queryFn: () => fetchPageContent(pageKey),
        enabled: !!pageKey,
        retry: 1,
        staleTime: 30000,
    });
}

export function useUpdatePageContent() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updatePageContent,
        onSuccess: (data, variables) => {
            queryClient.setQueryData(["content", variables.pageKey], data);
            queryClient.invalidateQueries({ queryKey: ["all-pages"] });
            toast.success("Content saved successfully");
        },
        onError: (error: any) => {
            const message = error?.message || "Failed to save content";
            toast.error(message);
            console.error(error);
        },
    });
}

export function usePublishPageContent() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: publishPageContent,
        onSuccess: (data, pageKey) => {
            queryClient.invalidateQueries({ queryKey: ["content", pageKey] });
            queryClient.invalidateQueries({ queryKey: ["all-pages"] });
            toast.success("Page published live!");
        },
        onError: (error) => {
            toast.error("Failed to publish page");
            console.error(error);
        },
    });
}

// 5. Fetch Files
export interface FileItem {
    name: string;
    url: string;
    size: number;
    createdAt: string;
}

const fetchFiles = async (): Promise<FileItem[]> => {
    return api.get<FileItem[]>(endpoints.content.list);
};

export function useFiles() {
    return useQuery({
        queryKey: ["files"],
        queryFn: fetchFiles,
    });
}

// 6. Upload File
const uploadFile = async (file: File): Promise<UploadResponse> => {
    const formData = new FormData();
    formData.append('file', file);

    return apiClient.post(endpoints.content.upload, { body: formData }).json<UploadResponse>();
};

export function useUploadFile() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: uploadFile,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["files"] });
            toast.success("File uploaded successfully");
        },
        onError: () => {
            toast.error("Failed to upload file");
        }
    });
}
// 7. Fetch All Pages
const fetchAllPages = async (): Promise<PageContentResponse[]> => {
    console.log('[Content API] Fetching all pages');
    try {
        const result = await api.get<PageContentResponse[]>('content/pages');
        console.log('[Content API] Fetched all pages:', result?.length || 0, 'pages');
        return result;
    } catch (error) {
        console.error('[Content API] Error fetching all pages:', error);
        throw error;
    }
};

// 8. AI Generate (DeepSeek) – content & SEO
export interface AiGenerateParams {
    prompt: string;
    fieldType?: 'meta_title' | 'meta_description' | 'keywords' | 'title' | 'description' | 'tags';
    pageKey?: string;
    sectionId?: string;
    fieldName?: string;
    /** JSON string of existing content + schema hints for context */
    context?: string;
}
export interface AiGenerateResponse {
    text: string;
}

const generateWithAI = async (params: AiGenerateParams): Promise<AiGenerateResponse> => {
    return api.post<AiGenerateResponse>(endpoints.content.aiGenerate, params);
};

export function useGenerateWithAI() {
    return useMutation({
        mutationFn: generateWithAI,
        onError: (err: any) => {
            const msg = err?.response?.data?.message || err?.message || 'AI generation failed';
            toast.error(msg);
        },
    });
}

export function useAllPages() {
    return useQuery({
        queryKey: ["all-pages"],
        queryFn: fetchAllPages,
        retry: 1,
        staleTime: 60000,
    });
}
