"use client";

import { useNavbarContentStore } from "@/lib/store/navbar-content";

export function useNavbarContent() {
    const { content } = useNavbarContentStore();
    return { navbarContent: content, isLoading: false };
}
