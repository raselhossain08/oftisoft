
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

export const shopCategories: Category[] = [
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
    },
    {
        id: "js-frameworks",
        name: "JavaScript Frameworks",
        subcategories: ["React Templates", "Next.js Templates", "Vue.js Templates", "Angular Templates", "Svelte Templates", "Node.js Backends", "Full-Stack Kits"],
        icon: "Code2"
    },
    {
        id: "ecommerce",
        name: "E-commerce Solutions",
        subcategories: ["WooCommerce Themes", "Shopify Themes", "Custom E-commerce", "Payment Gateways", "Inventory Systems", "POS Systems"],
        icon: "ShoppingCart"
    },
    {
        id: "cms",
        name: "CMS Themes & Plugins",
        subcategories: ["WordPress Themes", "WordPress Plugins", "Joomla Templates", "Drupal Themes", "Headless CMS", "Custom CMS"],
        icon: "FileText"
    },
    {
        id: "ui-ux",
        name: "UI/UX Components",
        subcategories: ["UI Kits", "Component Libraries", "Design Systems", "Icon Sets", "Illustration Packs", "Animation Libraries"],
        icon: "Palette"
    },
    {
        id: "dev-services",
        name: "Development Services",
        subcategories: ["Custom Web Development", "Mobile App Development", "Website Redesign", "API Development", "System Migration", "Performance Optimization"],
        icon: "Wrench"
    },
    {
        id: "maintenance",
        name: "Maintenance & Support",
        subcategories: ["Website Fixing", "Bug Fixing", "Security Updates", "Regular Maintenance", "Technical Support", "Emergency Support"],
        icon: "ShieldAlert"
    },
    {
        id: "digital-marketing",
        name: "Digital Marketing",
        subcategories: ["SEO Optimization", "Social Media Marketing", "PPC Management", "Content Marketing", "Email Marketing", "Analytics Setup"],
        icon: "TrendingUp"
    },
    {
        id: "business-solutions",
        name: "Business Solutions",
        subcategories: ["CRM Systems", "ERP Solutions", "HR Management", "Inventory Management", "Accounting Software", "Booking Systems"],
        icon: "Briefcase"
    },
    {
        id: "game-dev",
        name: "Game Development",
        subcategories: ["HTML5 Games", "Mobile Games", "Game Assets", "AR/VR Experiences", "Game Development Services"],
        icon: "Gamepad2"
    },
    {
        id: "industry-specific",
        name: "Industry-Specific",
        subcategories: ["Restaurant Solutions", "Medical/Healthcare", "Education/LMS", "Real Estate", "Travel & Tourism", "Financial/Banking"],
        icon: "Building2"
    },
    {
        id: "enterprise",
        name: "Enterprise Solutions",
        subcategories: ["Custom Software", "Cloud Solutions", "DevOps Services", "Database Management", "Scalability Solutions", "Enterprise Support"],
        icon: "Globe"
    },
    {
        id: "starter-kits",
        name: "Starter Kits & Boilerplates",
        subcategories: ["Full-Stack Boilerplates", "SaaS Starter Kits", "MVP Templates", "Authentication Systems", "Payment Integration Kits"],
        icon: "Rocket"
    }
];

export const mockProducts: Product[] = [
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
        image: "/images/products/neon-store.jpg",
        tags: ["Figma", "React Native", "UI Kit"],
        features: ["50+ Screens", "Dark Mode Ready", "Vector Icons", "Auto Layout"],
        screenshots: ["/images/products/neon-store-1.jpg", "/images/products/neon-store-2.jpg", "/images/products/neon-store-3.jpg"],
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
        image: "/images/products/ai-bot.jpg",
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
    },
    {
        id: "3",
        name: "SaaS Starter Kit",
        slug: "saas-starter-kit",
        description: "The ultimate boilerplate for building production-ready SaaS applications.",
        price: 299,
        rating: 5.0,
        reviews: 210,
        category: "Starter Kits & Boilerplates",
        subcategory: "SaaS Starter Kits",
        image: "/images/products/saas-kit.jpg",
        tags: ["Next.js", "Tailwind", "Prisma", "Stripe"],
        features: ["Authentication", "Subscription Billing", "User Dashboard", "Email Templates"],
        screenshots: ["/images/products/saas-kit-1.jpg"],
        demoUrl: "https://saas-starter.demo",
        docUrl: "https://docs.saas-starter.tech",
        compatibility: ["Next.js 15+", "Tailwind 4+", "PostgreSQL"],
        version: "v3.0.1",
        updatePolicy: "1 year of updates included",
        licenseRegular: 299,
        licenseExtended: 1299,
        lastUpdated: "2026-02-05",
        faqs: [
            { question: "Is Stripe integration ready?", answer: "Yes, it includes full webhook handling and subscription logic." }
        ]
    },
    {
        id: "4",
        name: "RealEstate X",
        slug: "realestate-x",
        description: "Complete real estate platform solution with booking and property management.",
        price: 149,
        rating: 4.7,
        reviews: 56,
        category: "Industry-Specific",
        subcategory: "Real Estate",
        image: "/images/products/real-estate.jpg",
        tags: ["React", "Node.js", "Google Maps"],
        features: ["Property Listing", "Agent Portal", "Map Integration", "Booking System"],
        screenshots: [],
        demoUrl: "#",
        docUrl: "#",
        compatibility: ["React 18+", "Node.js 20+"],
        version: "v1.0.0",
        updatePolicy: "Updates for life",
        licenseRegular: 149,
        licenseExtended: 599,
        lastUpdated: "2025-12-20",
        faqs: []
    },
    {
        id: "5",
        name: "CryptoDash - Admin Template",
        slug: "cryptodash-admin",
        description: "Professional cryptocurrency exchange dashboard template.",
        price: 79,
        rating: 4.6,
        reviews: 92,
        category: "Web Templates",
        subcategory: "Admin Dashboard Templates",
        image: "/images/products/crypto-dash.jpg",
        tags: ["React", "Chart.js", "Tailwind"],
        features: ["Real-time Charts", "Wallet Management", "Trading Interface", "Light/Dark Mode"],
        screenshots: [],
        demoUrl: "#",
        docUrl: "#",
        compatibility: ["React 18+", "Tailwind 3+"],
        version: "v1.2.0",
        updatePolicy: "Updates for 12 months",
        licenseRegular: 79,
        licenseExtended: 399,
        lastUpdated: "2026-01-10",
        faqs: []
    },
    {
        id: "6",
        name: "HealthPlus - Telemedicine App",
        slug: "healthplus-telemedicine",
        description: "Full-featured telemedicine application template for iOS and Android.",
        price: 129,
        rating: 4.8,
        reviews: 45,
        category: "Industry-Specific",
        subcategory: "Medical/Healthcare",
        image: "/images/products/health-app.jpg",
        tags: ["Flutter", "Dart", "Firebase"],
        features: ["Video Calling", "Appointment Booking", "Prescription Management", "Chat with Doctor"],
        screenshots: [],
        demoUrl: "#",
        docUrl: "#",
        compatibility: ["Flutter 3.16+", "Firebase"],
        version: "v2.0.0",
        updatePolicy: "Updates for 6 months",
        licenseRegular: 129,
        licenseExtended: 649,
        lastUpdated: "2026-01-28",
        faqs: []
    }
];

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

export const shopBundles: Bundle[] = [
    {
        id: "b1",
        name: "Ultimate SaaS Enterprise Bundle",
        description: "Everything you need to launch a high-scale SaaS: UI Kit + Backend Boilerplate + AI Bot.",
        products: ["1", "2", "3"],
        price: 499,
        originalPrice: 847,
        savings: 348,
        image: "/images/bundles/saas-bundle.jpg",
        tags: ["Save $348", "Best Value"],
        status: "active"
    }
];

export const shopTestimonials = [
    {
        id: "t1",
        name: "Alex Rivers",
        role: "Lead Developer @ TechFlow",
        content: "The NeonStore UI Kit saved us weeks of design time. The code quality is exceptional and highly modular.",
        rating: 5,
        avatar: "/images/avatars/alex.jpg"
    },
    {
        id: "t2",
        name: "Sarah Chen",
        role: "SaaS Founder",
        content: "Using the SaaS Starter Kit was the best decision for our MVP. We went from zero to production in 10 days.",
        rating: 5,
        avatar: "/images/avatars/sarah.jpg"
    }
];

export interface Customer {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    totalOrders: number;
    totalSpent: number;
    joinDate: string;
    status: "active" | "inactive" | "blocked";
    group: "Premium" | "Regular" | "New" | "Enterprise";
    location: string;
}

export const mockCustomers: Customer[] = [
    {
        id: "CUST-001",
        name: "Alex Rivers",
        email: "alex@techflow.com",
        avatar: "/images/avatars/alex.jpg",
        totalOrders: 12,
        totalSpent: 2450,
        joinDate: "2025-10-12",
        status: "active",
        group: "Premium",
        location: "San Francisco, USA"
    },
    {
        id: "CUST-002",
        name: "Sarah Chen",
        email: "sarah@startup.io",
        avatar: "/images/avatars/sarah.jpg",
        totalOrders: 5,
        totalSpent: 890,
        joinDate: "2026-01-05",
        status: "active",
        group: "Regular",
        location: "Singapore"
    },
    {
        id: "CUST-003",
        name: "John Smith",
        email: "john@enterprise.com",
        totalOrders: 24,
        totalSpent: 12400,
        joinDate: "2024-05-20",
        status: "active",
        group: "Enterprise",
        location: "London, UK"
    }
];

export interface Order {
    id: string;
    customerName: string;
    customerEmail: string;
    date: string;
    status: "pending" | "processing" | "completed" | "cancelled" | "refunded";
    total: number;
    paymentMethod: string;
    items: {
        id: string;
        name: string;
        price: number;
        quantity: number;
        downloadUrl?: string;
    }[];
    shippingAddress?: {
        street: string;
        city: string;
        country: string;
        zip: string;
    };
    trackingNumber?: string;
}

export const mockOrders: Order[] = [
    {
        id: "ORD-9821",
        customerName: "Alex Rivers",
        customerEmail: "alex@techflow.com",
        date: "2026-02-05",
        status: "completed",
        total: 299,
        paymentMethod: "Credit Card",
        items: [
            { id: "1", name: "NeonStore UI Kit", price: 299, quantity: 1, downloadUrl: "/downloads/neonstore-v2.zip" }
        ],
        trackingNumber: "DFT-88421092"
    },
    {
        id: "ORD-9822",
        customerName: "Alex Rivers",
        customerEmail: "alex@techflow.com",
        date: "2026-02-06",
        status: "processing",
        total: 547,
        paymentMethod: "PayPal",
        items: [
            { id: "2", name: "SaaS Starter Kit", price: 149, quantity: 1, downloadUrl: "/downloads/saas-starter.zip" },
            { id: "3", name: "Enterprise Admin", price: 398, quantity: 1, downloadUrl: "/downloads/ent-admin.zip" }
        ],
        trackingNumber: "DFT-88421093"
    },
    {
        id: "ORD-9823",
        customerName: "Mike Johnson",
        customerEmail: "mike@tech.io",
        date: "2026-02-06",
        status: "pending",
        total: 499,
        paymentMethod: "bKash",
        items: [
            { id: "b1", name: "Ultimate SaaS Enterprise Bundle", price: 499, quantity: 1, downloadUrl: "/downloads/saas-bundle.zip" }
        ],
        shippingAddress: {
            street: "123 Tech Lane",
            city: "Dhaka",
            country: "Bangladesh",
            zip: "1207"
        }
    }
];

export interface ServiceQuote {
    id: string;
    customerName?: string;
    email?: string;
    serviceType: string;
    description: string;
    budget: string;
    status: "requested" | "responded" | "accepted" | "rejected";
    date: string;
    proposal?: {
        content: string;
        price: number;
        estimatedDays: number;
        validUntil: string;
        milestones: { id: string; title: string; week: number; status: "pending" | "current" | "done" }[];
    };
}

export interface ServiceOrder {
    id: string;
    title: string;
    customerName: string;
    customerEmail?: string;
    assignedTo?: string;
    status: "planning" | "development" | "review" | "completed";
    deadline: string;
    budget: number;
    progress: number;
    milestones: {
        id: string;
        title: string;
        completed: boolean;
        dueDate: string;
    }[];
    files?: { name: string; size: string; type: string; date: string }[];
    unreadMessages?: number;
}

export const mockQuotes: ServiceQuote[] = [
    {
        id: "QT-2026-X1",
        serviceType: "Custom SaaS Development",
        description: "Need a multi-tenant subscription platform for industrial IoT monitoring with real-time dashboards.",
        budget: "$10,000 - $15,000",
        date: "Feb 05, 2026",
        status: "responded",
        proposal: {
            content: "We propose a headless architecture using Next.js 15, TimescaleDB for time-series IoT data, and a custom MQTT bridge. Our architects will deliver a high-performance, glassmorphic dashboard with sub-100ms latency.",
            price: 12500,
            estimatedDays: 45,
            validUntil: "Feb 20, 2026",
            milestones: [
                { id: "M1", title: "Infrastructure & IoT Gateway", week: 2, status: "pending" },
                { id: "M2", title: "Real-time Data Visualization", week: 4, status: "pending" },
                { id: "M3", title: "Multi-tenant Governance System", week: 6, status: "pending" },
            ]
        }
    },
    {
        id: "QT-2026-X2",
        serviceType: "SEO & Performance Audit",
        description: "Scale our existing e-commerce platform to handle 1M monthly actives. Core Web Vitals optimization required.",
        budget: "$2,000 - $4,000",
        date: "Feb 06, 2026",
        status: "requested"
    },
    {
        id: "QT-2026-X3",
        serviceType: "AI Integration Service",
        description: "Implement a custom RAG system for our internal documentation using proprietary LLMs.",
        budget: "$5,000",
        date: "Jan 25, 2026",
        status: "accepted",
        proposal: {
            content: "Deployment of a vector database (Pinecone) and RAG pipeline with hybrid search. Optimized for professional technical documentation.",
            price: 5200,
            estimatedDays: 21,
            validUntil: "Feb 10, 2026",
            milestones: [
                { id: "M1", title: "Neural Vectorization", week: 1, status: "done" },
                { id: "M2", title: "RAG Feedback Loop", week: 2, status: "current" },
                { id: "M3", title: "Internal API Integration", week: 3, status: "pending" },
            ]
        }
    }
];

export const mockServiceOrders: ServiceOrder[] = [
    {
        id: "SRV-501",
        title: "E-Commerce Extension Development",
        customerName: "TechSolutions",
        customerEmail: "contact@techsolutions.com",
        assignedTo: "Sarah Jenkins",
        status: "development",
        deadline: "2026-03-15",
        budget: 4500,
        progress: 45,
        milestones: [
            { id: "m1", title: "Technical Requirements", completed: true, dueDate: "2026-02-10" },
            { id: "m2", title: "Database Schema", completed: true, dueDate: "2026-02-20" },
            { id: "m3", title: "API Development", completed: false, dueDate: "2026-03-05" }
        ]
    },
    {
        id: "SRV-202",
        title: "Website Bug Fixing & SEO Audit",
        customerName: "Alex Rivers",
        customerEmail: "alex@techflow.com",
        assignedTo: "Jason Dark",
        status: "review",
        deadline: "2026-02-10",
        budget: 1200,
        progress: 85,
        milestones: [
            { id: "m1", title: "Initial Audit", completed: true, dueDate: "2026-02-01" },
            { id: "m2", title: "Core Fixes", completed: true, dueDate: "2026-02-05" },
            { id: "m3", title: "Final Review", completed: false, dueDate: "2026-02-09" }
        ],
        files: [
            { name: "Audit_Report.pdf", size: "2.4 MB", type: "PDF", date: "2026-02-01" },
            { name: "Fix_List.xlsx", size: "1.1 MB", type: "XLSX", date: "2026-02-05" }
        ],
        unreadMessages: 3
    },
    {
        id: "SRV-203",
        title: "Custom SaaS Dashboard",
        customerName: "Alex Rivers",
        customerEmail: "alex@techflow.com",
        assignedTo: "Emily Stone",
        status: "planning",
        deadline: "2026-04-01",
        budget: 8500,
        progress: 10,
        milestones: [
            { id: "m1", title: "UX Wireframes", completed: false, dueDate: "2026-02-15" }
        ]
    }
];

export interface Coupon {
    id: string;
    code: string;
    description: string;
    discountType: "percentage" | "fixed_amount";
    discountValue: number;
    expiryDate: string;
    usageLimit: number;
    usageCount: number;
    status: "active" | "expired" | "scheduled";
}

export const mockCoupons: Coupon[] = [
    {
        id: "CPN-2026",
        code: "OFTI20",
        description: "Special launch discount for 2026",
        discountType: "percentage",
        discountValue: 20,
        expiryDate: "2026-12-31",
        usageLimit: 1000,
        usageCount: 142,
        status: "active"
    },
    {
        id: "CPN-FEB",
        code: "LOVECODE",
        description: "Valentine's seasonal sale",
        discountType: "fixed_amount",
        discountValue: 50,
        expiryDate: "2026-02-15",
        usageLimit: 500,
        usageCount: 8,
        status: "active"
    }
];

export const mockBundles: Bundle[] = [
    {
        id: "BNDL-002",
        name: "Mini Designer Pack",
        description: "A compact collection of essential UI icons and elements.",
        products: ["4", "5"],
        price: 49,
        originalPrice: 99,
        savings: 50,
        image: "/images/bundles/design-pack.jpg",
        tags: ["Limited Time"],
        status: "active"
    }
];

export const mockAnalyticsData = {
    revenue: [
        { name: "Jan", total: 12000, orders: 120 },
        { name: "Feb", total: 15600, orders: 145 },
        { name: "Mar", total: 18900, orders: 168 },
        { name: "Apr", total: 22400, orders: 198 },
        { name: "May", total: 21200, orders: 185 },
        { name: "Jun", total: 28400, orders: 242 },
        { name: "Jul", total: 32000, orders: 280 }
    ],
    productPerformance: [
        { name: "NeonStore UI Kit", sales: 850, revenue: 125000 },
        { name: "SaaS Starter Kit", sales: 720, revenue: 215000 },
        { name: "Enterprise Admin", sales: 450, revenue: 320000 },
        { name: "AI Bot UI", sales: 320, revenue: 45000 },
        { name: "Icon Pack Pro", sales: 120, revenue: 12000 }
    ],
    customerDemographics: [
        { name: "USA", value: 45 },
        { name: "Europe", value: 30 },
        { name: "Asia", value: 15 },
        { name: "Others", value: 10 }
    ],
    serviceMetrics: [
        { category: "Custom Dev", requests: 45, completion: 92 },
        { category: "UI/UX Design", requests: 38, completion: 85 },
        { category: "Cloud Setup", requests: 22, completion: 100 },
        { category: "SEO Audit", requests: 15, completion: 95 }
    ]
};

export interface Transaction {
    id: string;
    customer: string;
    amount: number;
    status: "success" | "pending" | "failed";
    method: "Stripe" | "PayPal" | "Crypto";
    date: string;
    description: string;
}

export interface Payout {
    id: string;
    recipient: string;
    amount: number;
    status: "paid" | "scheduled" | "processing";
    date: string;
    type: "Affiliate" | "Partner" | "Refund";
}

export const mockTransactions: Transaction[] = [
    {
        id: "TXN-9402",
        customer: "Robert Fox",
        amount: 299.00,
        status: "success",
        method: "Stripe",
        date: "2026-02-06 14:23",
        description: "NeonStore UI Kit Purchase"
    },
    {
        id: "TXN-9401",
        customer: "Bessie Cooper",
        amount: 1500.00,
        status: "pending",
        method: "PayPal",
        date: "2026-02-05 09:12",
        description: "Custom UI/UX Deposit"
    },
    {
        id: "TXN-9400",
        customer: "Arlene McCoy",
        amount: 49.00,
        status: "failed",
        method: "Crypto",
        date: "2026-02-04 22:45",
        description: "Icon Pack Pro Purchase"
    }
];

export const mockPayouts: Payout[] = [
    {
        id: "PAY-501",
        recipient: "Marvin McKinney",
        amount: 342.50,
        status: "paid",
        date: "2026-02-01",
        type: "Affiliate"
    },
    {
        id: "PAY-502",
        recipient: "Jenny Wilson",
        amount: 1200.00,
        status: "scheduled",
        date: "2026-02-15",
        type: "Partner"
    }
];

export interface FAQArticle {
    id: string;
    title: string;
    category: "Technical" | "Billing" | "General";
    views: number;
    updatedAt: string;
    status: "published" | "draft";
}

export interface ChatSession {
    id: string;
    customerName: string;
    lastMessage: string;
    time: string;
    status: "active" | "ended" | "queued";
    isUnread: boolean;
}

export const mockFAQs: FAQArticle[] = [
    { id: "FAQ-001", title: "How to reset my API key?", category: "Technical", views: 1240, updatedAt: "2026-01-20", status: "published" },
    { id: "FAQ-002", title: "Updating your billing info", category: "Billing", views: 850, updatedAt: "2026-01-15", status: "published" },
    { id: "FAQ-003", title: "Bulk license discounts", category: "General", views: 320, updatedAt: "2026-02-01", status: "draft" }
];

export const mockChats: ChatSession[] = [
    { id: "CHT-1", customerName: "Guy Hawkins", lastMessage: "Where can I find the documentation?", time: "2m ago", status: "active", isUnread: true },
    { id: "CHT-2", customerName: "Leslie Alexander", lastMessage: "Thanks for the help!", time: "15m ago", status: "ended", isUnread: false },
    { id: "CHT-3", customerName: "Courtney Henry", lastMessage: "Waiting for connection...", time: "Just now", status: "queued", isUnread: true }
];

export interface StaffMember {
    id: string;
    name: string;
    email: string;
    role: "Admin" | "Editor" | "Support" | "Viewer";
    status: "active" | "invited";
    lastActive: string;
}

export interface APIKey {
    id: string;
    name: string;
    key: string;
    status: "active" | "revoked";
    createdAt: string;
}

export interface EmailTemplate {
    id: string;
    name: string;
    subject: string;
    lastEdit: string;
    status: "active" | "draft";
}

export const mockStaff: StaffMember[] = [
    { id: "ST-1", name: "Esther Howard", email: "esther@oftisoft.com", role: "Admin", status: "active", lastActive: "Just now" },
    { id: "ST-2", name: "Cameron Williamson", email: "cameron@oftisoft.com", role: "Support", status: "active", lastActive: "2h ago" },
    { id: "ST-3", name: "Robert Fox", email: "robert@oftisoft.com", role: "Editor", status: "invited", lastActive: "Never" }
];

export const mockAPIKeys: APIKey[] = [
    { id: "AK-1", name: "Public Storefront", key: "pk_live_********************", status: "active", createdAt: "2026-01-01" },
    { id: "AK-2", name: "Backend Integration", key: "sk_live_********************", status: "active", createdAt: "2026-01-15" }
];

export const mockEmailTemplates: EmailTemplate[] = [
    { id: "EM-1", name: "Order Confirmation", subject: "Thank you for your purchase!", lastEdit: "2026-02-01", status: "active" },
    { id: "EM-2", name: "Password Reset", subject: "Reset your Oftisoft password", lastEdit: "2026-01-20", status: "active" },
    { id: "EM-3", name: "Welcome Email", subject: "Welcome to our marketplace", lastEdit: "2026-02-05", status: "draft" }
];

export interface DownloadRecord {
    id: string;
    productName: string;
    version: string;
    date: string;
    ip: string;
}

export interface UpdateNotification {
    id: string;
    productId: string;
    productName: string;
    oldVersion: string;
    newVersion: string;
    date: string;
    importance: "major" | "minor" | "security";
}

export const mockDownloadHistory: DownloadRecord[] = [
    { id: "DL-1", productName: "NeonStore UI Kit", version: "v2.1.0", date: "2026-02-06 14:45", ip: "192.168.1.1" },
    { id: "DL-2", productName: "NeonStore UI Kit", version: "v2.0.8", date: "2026-01-20 09:12", ip: "192.168.1.1" },
    { id: "DL-3", productName: "SaaS Starter Kit", version: "v3.0.1", date: "2026-01-16 22:30", ip: "192.168.1.1" }
];

export const mockUpdateNotifications: UpdateNotification[] = [
    { id: "UP-1", productId: "1", productName: "NeonStore UI Kit", oldVersion: "v2.1.0", newVersion: "v2.2.0", date: "2026-02-07", importance: "major" },
    { id: "UP-2", productId: "2", productName: "SaaS Starter Kit", oldVersion: "v3.0.1", newVersion: "v3.0.2", date: "2026-02-05", importance: "security" }
];

export interface AffiliateTransaction {
    id: string;
    date: string;
    productName: string;
    amount: number;
    commission: number;
    status: "pending" | "cleared" | "cancelled";
}

export interface WithdrawalRequest {
    id: string;
    date: string;
    amount: number;
    method: string;
    status: "pending" | "processed" | "rejected";
}

export interface PerformanceData {
    name: string;
    clicks: number;
    referrals: number;
    conversions: number;
}

export const mockAffiliateTransactions: AffiliateTransaction[] = [
    { id: "AT-101", date: "2026-02-06", productName: "NeonStore UI Kit", amount: 49, commission: 9.8, status: "pending" },
    { id: "AT-102", date: "2026-02-05", productName: "AI ChatBot Pro", amount: 199, commission: 39.8, status: "cleared" },
    { id: "AT-103", date: "2026-02-04", productName: "SaaS Starter Kit", amount: 299, commission: 59.8, status: "cleared" },
    { id: "AT-104", date: "2026-02-01", productName: "NeonStore UI Kit", amount: 49, commission: 9.8, status: "cleared" },
];

export const mockWithdrawals: WithdrawalRequest[] = [
    { id: "WR-001", date: "2026-01-31", amount: 250.00, method: "PayPal", status: "processed" },
    { id: "WR-002", date: "2026-02-07", amount: 109.40, method: "Bank Transfer", status: "pending" },
];

export const mockPerformanceReports: PerformanceData[] = [
    { name: "Feb 01", clicks: 120, referrals: 15, conversions: 2 },
    { name: "Feb 02", clicks: 150, referrals: 18, conversions: 3 },
    { name: "Feb 03", clicks: 80, referrals: 8, conversions: 1 },
    { name: "Feb 04", clicks: 200, referrals: 35, conversions: 5 },
    { name: "Feb 05", clicks: 180, referrals: 22, conversions: 4 },
    { name: "Feb 06", clicks: 250, referrals: 45, conversions: 8 },
    { name: "Feb 07", clicks: 310, referrals: 62, conversions: 12 },
];

export interface UserReview {
    id: string;
    productId: string;
    productName: string;
    rating: number;
    comment: string;
    date: string;
    status: "approved" | "pending" | "rejected";
    helpfulCount: number;
}

export const mockUserReviews: UserReview[] = [
    {
        id: "REV-001",
        productId: "1",
        productName: "NeonStore - E-commerce UI Kit",
        rating: 5,
        comment: "The glassmorphism implementation is absolutely stunning. Saved me weeks of UI work!",
        date: "Feb 05, 2026",
        status: "approved",
        helpfulCount: 12
    },
    {
        id: "REV-002",
        productId: "2",
        productName: "SaaS Starter Kit",
        rating: 4,
        comment: "Very solid boilerplate. The authentication flow is seamless. Minor issues with tailwind 4 migration but manageable.",
        date: "Feb 01, 2026",
        status: "approved",
        helpfulCount: 8
    },
    {
        id: "REV-003",
        productId: "3",
        productName: "AI ChatBot Pro",
        rating: 5,
        comment: "The GPT-4 integration is very smooth. Documentation is top-notch.",
        date: "Feb 07, 2026",
        status: "pending",
        helpfulCount: 0
    }
];


