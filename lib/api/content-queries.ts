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
    return api.get<PageContentResponse>(endpoints.content.page(pageKey));
};

// 2. Update Page Content
const updatePageContent = async ({ pageKey, content }: { pageKey: string; content: any }): Promise<PageContentResponse> => {
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
        onError: (error) => {
            toast.error("Failed to save content");
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
    return api.get<PageContentResponse[]>('content/pages');
};

export function useAllPages() {
    return useQuery({
        queryKey: ["all-pages"],
        queryFn: fetchAllPages,
    });
}
