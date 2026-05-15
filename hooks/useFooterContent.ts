"use client";

import { useFooterContentStore } from "@/lib/store/footer-content";

export function useFooterContent() {
    const { content } = useFooterContentStore();
    return { footerContent: content, isLoading: false };
}
