
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

export interface Category {
    id: string;
    name: string;
    subcategories: string[];
    icon?: string;
}

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
    demoUrl: string;
    docUrl: string;
    compatibility: string[];
    version: string;
    updatePolicy: string;
    licenseRegular: number;
    licenseExtended: number;
    lastUpdated: string;
    faqs: { question: string; answer: string }[];
}

export interface Bundle {
    id: string;
    name: string;
    description: string;
    products: string[]; // Product IDs
    price: number;
    originalPrice: number;
    savings: number;
    image: string;
    tags: string[];
    status: "active" | "inactive";
}

export interface Testimonial {
    id: string;
    name: string;
    role: string;
    content: string;
    rating: number;
    avatar: string;
}

export interface ShopPageContent {
    header: {
        title: string;
        description: string;
    };
    categories: Category[];
    products: Product[];
    bundles: Bundle[];
    testimonials: Testimonial[];
    lastUpdated: string;
}

interface ShopContentState {
    content: ShopPageContent | null;
    isLoading: boolean;
    isSaving: boolean;
    error: string | null;

    // Actions
    setContent: (content: ShopPageContent) => void;
    updateHeader: (header: Partial<ShopPageContent['header']>) => void;

    // Categories
    setCategories: (categories: Category[]) => void;

    // Products
    setProducts: (products: Product[]) => void;
    addProduct: (product: Product) => void;
    updateProduct: (id: string, product: Partial<Product>) => void;
    deleteProduct: (id: string) => void;

    // Bundles
    setBundles: (bundles: Bundle[]) => void;

    // Testimonials
    setTestimonials: (testimonials: Testimonial[]) => void;

    resetToDefaults: () => void;
}

const defaultContent: ShopPageContent = {
    header: {
        title: "Marketplace",
        description: "Premium templates, UI kits, and enterprise AI solutions."
    },
    categories: [
        {
            id: "mobile-apps",
            name: "Mobile Apps",
            subcategories: ["iOS App Templates", "Android App Templates", "React Native Templates", "Flutter App Templates", "Cross-Platform Apps", "Mobile UI Kits", "Game Templates"],
            icon: "Smartphone"
        },
        {
            id: "ai-chatbots",
            name: "AI & Chatbots",
            subcategories: ["AI Chatbot Templates", "Voice Assistants", "Machine Learning Models", "NLP Solutions", "AI Automation Tools", "Recommendation Systems", "AI Integration Services"],
            icon: "Bot"
        },
        {
            id: "web-templates",
            name: "Web Templates",
            subcategories: ["HTML5 Templates", "Bootstrap Templates", "Tailwind CSS Templates", "Landing Pages", "Portfolio Templates", "E-commerce Templates", "Admin Dashboard Templates"],
            icon: "Layout"
        }
    ],
    products: [
        {
            id: "1",
            name: "NeonStore - E-commerce UI Kit",
            slug: "neonstore-ecommerce-ui-kit",
            description: "A futuristic, glassmorphic e-commerce UI kit for modern brands.",
            price: 49,
            rating: 4.8,
            reviews: 124,
            category: "Mobile Apps",
            subcategory: "Mobile UI Kits",
            image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=60",
            tags: ["Figma", "React Native", "UI Kit"],
            features: ["50+ Screens", "Dark Mode Ready", "Vector Icons", "Auto Layout"],
            screenshots: ["https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=60", "https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?w=800&q=60", "https://images.unsplash.com/photo-1555421689561-f1960bd74d94?w=800&q=60"],
            demoUrl: "https://neonstore.demo",
            docUrl: "https://docs.neonstore.tech",
            compatibility: ["Figma", "React Native 0.73+", "iOS 15+", "Android 12+"],
            version: "v2.1.0",
            updatePolicy: "Free updates for 6 months",
            licenseRegular: 49,
            licenseExtended: 499,
            lastUpdated: "2026-01-15",
            faqs: [
                { question: "Can I use this for multiple projects?", answer: "The Regular License is for one project. The Extended License allows multiple." },
                { question: "Is Figma file included?", answer: "Yes, fully layered Figma files are included." }
            ]
        },
        {
            id: "2",
            name: "AI ChatBot Pro",
            slug: "ai-chatbot-pro",
            description: "Advanced AI chatbot template integrated with OpenAI GPT-4.",
            price: 199,
            rating: 4.9,
            reviews: 85,
            category: "AI & Chatbots",
            subcategory: "AI Chatbot Templates",
            image: "https://images.unsplash.com/photo-1531746790731-6c087fecd65a?w=800&auto=format&fit=crop&q=60",
            tags: ["Next.js", "TypeScipt", "OpenAI"],
            features: ["GPT-4 Integration", "Stream Responses", "Custom Knowledge Base", "Admin Dashboard"],
            screenshots: ["/images/products/ai-bot-1.jpg", "/images/products/ai-bot-2.jpg"],
            demoUrl: "https://aichat.demo",
            docUrl: "https://docs.aichat.tech",
            compatibility: ["Next.js 14+", "Node.js 18+", "OpenAI API Key"],
            version: "v1.5.2",
            updatePolicy: "Lifetime free updates",
            licenseRegular: 199,
            licenseExtended: 899,
            lastUpdated: "2026-02-01",
            faqs: [
                { question: "Do I need my own API key?", answer: "Yes, you need an OpenAI API key to use the chatbot features." },
                { question: "Can it handle PDF files?", answer: "Yes, it supports RAG with PDF and text files." }
            ]
        }
    ],
    bundles: [
        {
            id: "b1",
            name: "Ultimate SaaS Enterprise Bundle",
            description: "Everything you need to launch a high-scale SaaS: UI Kit + Backend Boilerplate + AI Bot.",
            products: ["1", "2", "3"],
            price: 499,
            originalPrice: 847,
            savings: 348,
            image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=60",
            tags: ["Save $348", "Best Value"],
            status: "active"
        }
    ],
    testimonials: [
        {
            id: "t1",
            name: "Alex Rivers",
            role: "Lead Developer @ TechFlow",
            content: "The NeonStore UI Kit saved us weeks of design time. The code quality is exceptional and highly modular.",
            rating: 5,
            avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&auto=format&fit=crop&q=60"
        }
    ],
    lastUpdated: new Date().toISOString()
};

export const useShopContentStore = create<ShopContentState>()(
    persist(
        immer((set) => ({
            content: defaultContent,
            isLoading: false,
            isSaving: false,
            error: null,

            setContent: (content) => set({ content: { ...content, lastUpdated: new Date().toISOString() } }),

            updateHeader: (header) => set((state) => {
                if (state.content) {
                    state.content.header = { ...state.content.header, ...header };
                    state.content.lastUpdated = new Date().toISOString();
                }
            }),

            setCategories: (categories) => set((state) => {
                if (state.content) {
                    state.content.categories = categories;
                    state.content.lastUpdated = new Date().toISOString();
                }
            }),

            setProducts: (products) => set((state) => {
                if (state.content) {
                    state.content.products = products;
                    state.content.lastUpdated = new Date().toISOString();
                }
            }),

            addProduct: (product) => set((state) => {
                if (state.content) {
                    state.content.products.push(product);
                    state.content.lastUpdated = new Date().toISOString();
                }
            }),

            updateProduct: (id, product) => set((state) => {
                if (state.content) {
                    const index = state.content.products.findIndex(p => p.id === id);
                    if (index !== -1) {
                        state.content.products[index] = { ...state.content.products[index], ...product };
                        state.content.lastUpdated = new Date().toISOString();
                    }
                }
            }),

            deleteProduct: (id) => set((state) => {
                if (state.content) {
                    state.content.products = state.content.products.filter(p => p.id !== id);
                    state.content.lastUpdated = new Date().toISOString();
                }
            }),

            setBundles: (bundles) => set((state) => {
                if (state.content) {
                    state.content.bundles = bundles;
                    state.content.lastUpdated = new Date().toISOString();
                }
            }),

            setTestimonials: (testimonials) => set((state) => {
                if (state.content) {
                    state.content.testimonials = testimonials;
                    state.content.lastUpdated = new Date().toISOString();
                }
            }),

            resetToDefaults: () => set({ content: defaultContent })
        })),
        {
            name: 'shop-content-storage-v2',
            storage: createJSONStorage(() => localStorage),
        }
    )
);
