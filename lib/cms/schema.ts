
// CMS Schema Configuration
// This file defines the structure for all dynamic page editors.

const seoSection = {
    id: "seo",
    label: "SEO Metadata",
    fields: [
        { name: "title", label: "Meta Title", type: "text" },
        { name: "description", label: "Meta Description", type: "textarea" },
        { name: "keywords", label: "Keywords", type: "tags" },
        { name: "ogImage", label: "OG Image URL", type: "image" }
    ]
};
export const CMS_SCHEMA = {
    // 1. Home Page
    home: {
        label: "Home Page",
        icon: "Home",
        sections: [
            seoSection,
            {
                id: "hero",
                label: "Hero Section",
                fields: [
                    { name: "enabled", label: "Enabled", type: "boolean" },
                    { name: "badge", label: "Badge", type: "text" },
                    { name: "title", label: "Title", type: "text" },
                    { name: "subtitle", label: "Subtitle", type: "text" },
                    { name: "description", label: "Description", type: "textarea" },
                    { name: "subtitles", label: "Rotating Subtitles", type: "tags" },
                    {
                        name: "primaryCTA",
                        label: "Primary Button",
                        type: "group",
                        fields: [
                            { name: "text", label: "Text", type: "text" },
                            { name: "link", label: "Link", type: "text" }
                        ]
                    },
                    {
                        name: "secondaryCTA",
                        label: "Secondary Button",
                        type: "group",
                        fields: [
                            { name: "text", label: "Text", type: "text" },
                            { name: "link", label: "Link", type: "text" }
                        ]
                    },
                    {
                        name: "stats",
                        label: "Hero Statistics",
                        type: "array",
                        itemLabel: "Stat",
                        fields: [
                            { name: "value", label: "Value", type: "text" },
                            { name: "suffix", label: "Suffix", type: "text" },
                            { name: "label", label: "Label", type: "text" }
                        ]
                    }
                ]
            },
            {
                id: "services",
                label: "Services Section",
                fields: [
                    { name: "enabled", label: "Enabled", type: "boolean" },
                    { name: "badge", label: "Badge", type: "text" },
                    { name: "title", label: "Title", type: "text" },
                    { name: "subtitle", label: "Subtitle", type: "text" },
                    {
                        name: "services",
                        label: "Services List",
                        type: "array",
                        itemLabel: "Service",
                        fields: [
                            { name: "title", label: "Title", type: "text" },
                            { name: "description", label: "Description", type: "textarea" },
                            { name: "icon", label: "Icon Name", type: "text" },
                            { name: "tags", label: "Tags", type: "tags" },
                            { name: "gradient", label: "Gradient Class", type: "text" },
                            { name: "color", label: "Color Class", type: "text" }
                        ]
                    }
                ]
            },
            {
                id: "projects",
                label: "Projects Section",
                fields: [
                    { name: "enabled", label: "Enabled", type: "boolean" },
                    { name: "badge", label: "Badge", type: "text" },
                    { name: "title", label: "Title", type: "text" },
                    { name: "subtitle", label: "Subtitle", type: "text" },
                    {
                        name: "projects",
                        label: "Projects List",
                        type: "array",
                        itemLabel: "Project",
                        fields: [
                            { name: "title", label: "Title", type: "text" },
                            { name: "description", label: "Description", type: "textarea" },
                            { name: "category", label: "Category", type: "text" },
                            { name: "imageGradient", label: "Image Gradient", type: "text" },
                            { name: "tech", label: "Tech Stack", type: "tags" },
                            { name: "year", label: "Year", type: "text" },
                            {
                                name: "stats",
                                label: "Project Stats",
                                type: "array",
                                itemLabel: "Stat",
                                fields: [
                                    { name: "label", label: "Label", type: "text" },
                                    { name: "value", label: "Value", type: "text" }
                                ]
                            }
                        ]
                    }
                ]
            },
            {
                id: "whyUs",
                label: "Why Us Section",
                fields: [
                    { name: "enabled", label: "Enabled", type: "boolean" },
                    { name: "badge", label: "Badge", type: "text" },
                    { name: "title", label: "Title", type: "text" },
                    { name: "subtitle", label: "Subtitle", type: "text" },
                    { name: "description", label: "Description", type: "textarea" },
                    {
                        name: "features",
                        label: "Features List",
                        type: "array",
                        itemLabel: "Feature",
                        fields: [
                            { name: "title", label: "Title", type: "text" },
                            { name: "description", label: "Description", type: "textarea" },
                            { name: "icon", label: "Icon Name", type: "text" },
                            { name: "stat", label: "Key Stat", type: "text" },
                            { name: "statLabel", label: "Stat Label", type: "text" },
                            { name: "gradient", label: "Gradient", type: "text" }
                        ]
                    },
                    {
                        name: "stats",
                        label: "Overall Stats",
                        type: "array",
                        itemLabel: "Stat",
                        fields: [
                            { name: "value", label: "Value", type: "text" },
                            { name: "label", label: "Label", type: "text" }
                        ]
                    }
                ]
            },
            {
                id: "process",
                label: "Process Section",
                fields: [
                    { name: "enabled", label: "Enabled", type: "boolean" },
                    { name: "badge", label: "Badge", type: "text" },
                    { name: "title", label: "Title", type: "text" },
                    { name: "subtitle", label: "Subtitle", type: "text" },
                    {
                        name: "steps",
                        label: "Process Steps",
                        type: "array",
                        itemLabel: "Step",
                        fields: [
                            { name: "number", label: "Step Number", type: "number" },
                            { name: "title", label: "Title", type: "text" },
                            { name: "description", label: "Description", type: "textarea" },
                            { name: "icon", label: "Icon Name", type: "text" },
                            { name: "gradient", label: "Gradient", type: "text" }
                        ]
                    }
                ]
            },
            {
                id: "testimonials",
                label: "Testimonials Section",
                fields: [
                    { name: "enabled", label: "Enabled", type: "boolean" },
                    { name: "badge", label: "Badge", type: "text" },
                    { name: "title", label: "Title", type: "text" },
                    { name: "subtitle", label: "Subtitle", type: "text" },
                    {
                        name: "testimonials",
                        label: "Testimonials List",
                        type: "array",
                        itemLabel: "Testimonial",
                        fields: [
                            { name: "name", label: "Name", type: "text" },
                            { name: "role", label: "Role", type: "text" },
                            { name: "quote", label: "Quote", type: "textarea" },
                            { name: "avatar", label: "Avatar URL", type: "image" },
                            { name: "gradient", label: "Gradient", type: "text" }
                        ]
                    }
                ]
            },
            {
                id: "techStack",
                label: "Tech Stack Section",
                fields: [
                    { name: "enabled", label: "Enabled", type: "boolean" },
                    { name: "badge", label: "Badge", type: "text" },
                    { name: "title", label: "Title", type: "text" },
                    { name: "subtitle", label: "Subtitle", type: "text" },
                    {
                        name: "technologies",
                        label: "Technologies",
                        type: "array",
                        itemLabel: "Tech",
                        fields: [
                            { name: "name", label: "Name", type: "text" },
                            { name: "icon", label: "Icon Name", type: "text" },
                            { name: "color", label: "Color Class", type: "text" }
                        ]
                    }
                ]
            },
            {
                id: "blog",
                label: "Blog Section",
                fields: [
                    { name: "enabled", label: "Enabled", type: "boolean" },
                    { name: "badge", label: "Badge", type: "text" },
                    { name: "title", label: "Title", type: "text" },
                    { name: "subtitle", label: "Subtitle", type: "text" },
                    {
                        name: "posts",
                        label: "Featured Posts",
                        type: "array",
                        itemLabel: "Post",
                        fields: [
                            { name: "title", label: "Title", type: "text" },
                            { name: "slug", label: "Slug", type: "text" },
                            { name: "excerpt", label: "Excerpt", type: "textarea" },
                            { name: "category", label: "Category", type: "text" },
                            { name: "date", label: "Date", type: "text" },
                            { name: "readTime", label: "Read Time", type: "text" },
                            { name: "gradient", label: "Gradient", type: "text" }
                        ]
                    }
                ]
            }
        ]
    },

    // 2. About Page
    about: {
        label: "About Page",
        icon: "Users",
        sections: [
            seoSection,
            {
                id: "hero",
                label: "Hero Section",
                fields: [
                    { name: "badge", label: "Badge", type: "text" },
                    { name: "title", label: "Title Prefix", type: "text" },
                    { name: "highlightedWord", label: "Highlighted Word", type: "text" },
                    { name: "description", label: "Description", type: "textarea" },
                    { name: "ctaText", label: "CTA Text", type: "text" },
                    { name: "cardTitle", label: "Card Title", type: "text" },
                    { name: "cardDescription", label: "Card Description", type: "text" }
                ]
            },
            {
                id: "founder",
                label: "Founder Section",
                fields: [
                    { name: "name", label: "Name", type: "text" },
                    { name: "role", label: "Role", type: "text" },
                    { name: "tagline", label: "Tagline", type: "text" },
                    { name: "bioPar1", label: "Bio Paragraph 1", type: "textarea" },
                    { name: "bioPar2", label: "Bio Paragraph 2", type: "textarea" },
                    { name: "badgeTitle", label: "Badge Title", type: "text" },
                    { name: "titleLine1", label: "Title Line 1", type: "text" },
                    { name: "titleLine2", label: "Title Line 2", type: "text" },
                    { name: "image", label: "Founder Image", type: "image" },
                    {
                        name: "socials",
                        label: "Social Links",
                        type: "group",
                        fields: [
                            { name: "github", label: "GitHub", type: "text" },
                            { name: "linkedin", label: "LinkedIn", type: "text" },
                            { name: "twitter", label: "Twitter", type: "text" }
                        ]
                    },
                    {
                        name: "stats",
                        label: "Founder Stats",
                        type: "array",
                        itemLabel: "Stat",
                        fields: [
                            { name: "num", label: "Number", type: "text" },
                            { name: "label", label: "Label", type: "text" },
                            { name: "suffix", label: "Suffix", type: "text" }
                        ]
                    }
                ]
            },
            {
                id: "mission",
                label: "Mission Section",
                fields: [
                    { name: "badge", label: "Badge", type: "text" },
                    { name: "titleLine1", label: "Title Line 1", type: "text" },
                    { name: "titleLine2", label: "Title Line 2", type: "text" },
                    { name: "quote", label: "Quote", type: "textarea" },
                    { name: "quoteHighlight", label: "Quote Highlight", type: "text" }
                ]
            },
            {
                id: "_root",
                label: "Lists & Collections",
                fields: [
                    {
                        name: "stats",
                        label: "Key Stats",
                        type: "array",
                        itemLabel: "Stat",
                        fields: [
                            { name: "id", label: "ID", type: "text" },
                            { name: "label", label: "Label", type: "text" },
                            { name: "value", label: "Value", type: "text" },
                            { name: "icon", label: "Icon", type: "text" }
                        ]
                    },
                    {
                        name: "values",
                        label: "Core Values",
                        type: "array",
                        itemLabel: "Value",
                        fields: [
                            { name: "title", label: "Title", type: "text" },
                            { name: "description", label: "Description", type: "textarea" },
                            { name: "icon", label: "Icon", type: "text" }
                        ]
                    },
                    { name: "timelineBadge", label: "Timeline Badge", type: "text" },
                    { name: "timelineTitle", label: "Timeline Title", type: "text" },
                    { name: "timelineTitleHighlight", label: "Timeline Highlight", type: "text" },
                    {
                        name: "timeline",
                        label: "Timeline",
                        type: "array",
                        itemLabel: "Event",
                        fields: [
                            { name: "year", label: "Year", type: "text" },
                            { name: "title", label: "Title", type: "text" },
                            { name: "desc", label: "Description", type: "textarea" },
                            { name: "icon", label: "Icon", type: "text" },
                            { name: "gradient", label: "Gradient", type: "text" }
                        ]
                    },
                    { name: "awardsBadge", label: "Awards Badge", type: "text" },
                    { name: "awardsTitle", label: "Awards Title", type: "text" },
                    { name: "awardsTitleHighlight", label: "Awards Highlight", type: "text" },
                    { name: "awardsDescription", label: "Awards Desc", type: "textarea" },
                    {
                        name: "awards",
                        label: "Awards List",
                        type: "array",
                        itemLabel: "Award",
                        fields: [
                            { name: "year", label: "Year", type: "text" },
                            { name: "title", label: "Title", type: "text" },
                            { name: "org", label: "Organization", type: "text" },
                            { name: "description", label: "Description", type: "textarea" },
                            { name: "gradient", label: "Gradient", type: "text" }
                        ]
                    }
                ]
            },
            {
                id: "culture",
                label: "Culture Section",
                fields: [
                    { name: "badge", label: "Badge", type: "text" },
                    { name: "titleLine1", label: "Title 1", type: "text" },
                    { name: "titleLine2", label: "Title 2", type: "text" },
                    {
                        name: "items",
                        label: "Gallery Items",
                        type: "array",
                        itemLabel: "Item",
                        fields: [
                            { name: "title", label: "Title", type: "text" },
                            { name: "location", label: "Location", type: "text" },
                            { name: "thumb", label: "Image URL", type: "image" }
                        ]
                    }
                ]
            },
            {
                id: "team",
                label: "Team Section",
                fields: [
                    { name: "badge", label: "Badge", type: "text" },
                    { name: "titleLine1", label: "Title 1", type: "text" },
                    { name: "titleLine2", label: "Title 2", type: "text" },
                    {
                        name: "members",
                        label: "Members",
                        type: "array",
                        itemLabel: "Member",
                        fields: [
                            { name: "name", label: "Name", type: "text" },
                            { name: "role", label: "Role", type: "text" },
                            { name: "category", label: "Category", type: "text" },
                            { name: "image", label: "Image", type: "image" },
                            {
                                name: "socials",
                                label: "Socials",
                                type: "group",
                                fields: [
                                    { name: "github", label: "GitHub", type: "text" },
                                    { name: "linkedin", label: "LinkedIn", type: "text" },
                                    { name: "twitter", label: "Twitter", type: "text" }
                                ]
                            }
                        ]
                    }
                ]
            },
            {
                id: "cta",
                label: "Call to Action",
                fields: [
                    { name: "badge", label: "Badge", type: "text" },
                    { name: "title", label: "Title", type: "text" },
                    { name: "highlight", label: "Highlight", type: "text" },
                    { name: "description", label: "Description", type: "textarea" },
                    { name: "buttonText", label: "Button Text", type: "text" }
                ]
            }
        ]
    },

    // 3. Careers
    careers: {
        label: "Careers Page",
        icon: "Briefcase",
        sections: [
            seoSection,
            {
                id: "hero",
                label: "Hero",
                fields: [
                    { name: "badge", label: "Badge", type: "text" },
                    { name: "titlePrefix", label: "Title Prefix", type: "text" },
                    { name: "titleHighlight", label: "Highlight", type: "text" },
                    { name: "titleSuffix", label: "Suffix", type: "text" },
                    { name: "description", label: "Description", type: "textarea" }
                ]
            },
            {
                id: "_root",
                label: "Values & Jobs",
                fields: [
                    {
                        name: "cultureValues",
                        label: "Culture Values",
                        type: "array",
                        itemLabel: "Value",
                        fields: [
                            { name: "title", label: "Title", type: "text" },
                            { name: "description", label: "Description", type: "textarea" },
                            { name: "iconName", label: "Icon", type: "text" },
                            { name: "color", label: "Color", type: "text" }
                        ]
                    },
                    {
                        name: "jobs",
                        label: "Job Openings",
                        type: "array",
                        itemLabel: "Job",
                        fields: [
                            { name: "title", label: "Title", type: "text" },
                            { name: "team", label: "Team", type: "text" },
                            { name: "type", label: "Type", type: "text" },
                            { name: "location", label: "Location", type: "text" },
                            { name: "description", label: "Description", type: "textarea" },
                            { name: "requirements", label: "Requirements", type: "tags" },
                            { name: "isActive", label: "Active", type: "boolean" }
                        ]
                    }
                ]
            },
            {
                id: "contact",
                label: "Contact Area",
                fields: [
                    { name: "title", label: "Title", type: "text" },
                    { name: "description", label: "Description", type: "textarea" },
                    { name: "buttonText", label: "Button Text", type: "text" }
                ]
            }
        ]
    },

    // 4. Changelog
    changelog: {
        label: "Changelog",
        icon: "History",
        sections: [
            seoSection,
            {
                id: "header",
                label: "Header",
                fields: [
                    { name: "badge", label: "Badge", type: "text" },
                    { name: "titlePrefix", label: "Prefix", type: "text" },
                    { name: "titleSuffix", label: "Suffix", type: "text" },
                    { name: "description", label: "Description", type: "textarea" }
                ]
            },
            {
                id: "_root",
                label: "Updates",
                fields: [
                    {
                        name: "updates",
                        label: "Version Updates",
                        type: "array",
                        itemLabel: "Version",
                        fields: [
                            { name: "version", label: "Version", type: "text" },
                            { name: "date", label: "Date", type: "text" },
                            { name: "title", label: "Title", type: "text" },
                            { name: "description", label: "Description", type: "textarea" },
                            { name: "category", label: "Category", type: "text" },
                            { name: "changes", label: "Changes", type: "tags" },
                            { name: "isActive", label: "Active", type: "boolean" }
                        ]
                    }
                ]
            }
        ]
    },

    // 5. Community
    community: {
        label: "Community",
        icon: "Users",
        sections: [
            seoSection,
            {
                id: "header",
                label: "Header",
                fields: [
                    { name: "badge", label: "Badge", type: "text" },
                    { name: "title", label: "Title", type: "text" },
                    { name: "highlight", label: "Highlight", type: "text" },
                    { name: "description", label: "Description", type: "textarea" }
                ]
            },
            {
                id: "_root",
                label: "Links & Stats",
                fields: [
                    {
                        name: "links",
                        label: "Community Links",
                        type: "array",
                        itemLabel: "Link",
                        fields: [
                            { name: "title", label: "Title", type: "text" },
                            { name: "label", label: "Label", type: "text" },
                            { name: "url", label: "URL", type: "text" },
                            { name: "iconName", label: "Icon", type: "text" },
                            { name: "color", label: "Color", type: "text" }
                        ]
                    },
                    {
                        name: "stats",
                        label: "Stats",
                        type: "array",
                        itemLabel: "Stat",
                        fields: [
                            { name: "value", label: "Value", type: "text" },
                            { name: "label", label: "Label", type: "text" }
                        ]
                    }
                ]
            },
            {
                id: "newsletter",
                label: "Newsletter",
                fields: [
                    { name: "title", label: "Title", type: "text" },
                    { name: "description", label: "Description", type: "textarea" },
                    { name: "buttonText", label: "Button Text", type: "text" },
                    { name: "footerText", label: "Footer Text", type: "text" }
                ]
            }
        ]
    },

    // 6. Contact
    contact: {
        label: "Contact Page",
        icon: "Mail",
        sections: [
            seoSection,
            {
                id: "header",
                label: "Header",
                fields: [
                    { name: "badge", label: "Badge", type: "text" },
                    { name: "titlePrefix", label: "Prefix", type: "text" },
                    { name: "titleHighlight", label: "Highlight", type: "text" },
                    { name: "titleSuffix", label: "Suffix", type: "text" },
                    { name: "description", label: "Description", type: "textarea" }
                ]
            },
            {
                id: "_root",
                label: "Info & Form",
                fields: [
                    {
                        name: "contactInfo",
                        label: "Contact Info Cards",
                        type: "array",
                        itemLabel: "Card",
                        fields: [
                            { name: "title", label: "Title", type: "text" },
                            { name: "value", label: "Value", type: "text" },
                            { name: "iconName", label: "Icon", type: "text" },
                            { name: "color", label: "Color", type: "text" }
                        ]
                    }
                ]
            },
            {
                id: "statusNode",
                label: "Status Bar",
                fields: [
                    { name: "title", label: "Title", type: "text" },
                    { name: "status", label: "Status", type: "text" },
                    { name: "latencyText", label: "Latency Info", type: "text" }
                ]
            },
            {
                id: "form",
                label: "Form Settings",
                fields: [
                    { name: "title", label: "Title", type: "text" },
                    { name: "description", label: "Description", type: "textarea" },
                    { name: "nameLabel", label: "Name Label", type: "text" },
                    { name: "emailLabel", label: "Email Label", type: "text" },
                    { name: "subjectLabel", label: "Subject Label", type: "text" },
                    { name: "messageLabel", label: "Message Label", type: "text" },
                    { name: "buttonText", label: "Button Text", type: "text" }
                ]
            }
        ]
    },

    // 7. Docs
    docs: {
        label: "Documentation",
        icon: "FileText",
        sections: [
            seoSection,
            {
                id: "header",
                label: "Header",
                fields: [
                    { name: "badge", label: "Badge", type: "text" },
                    { name: "title", label: "Title", type: "text" },
                    { name: "highlight", label: "Highlight", type: "text" },
                    { name: "placeholder", label: "Search Placeholder", type: "text" }
                ]
            },
            {
                id: "_root",
                label: "Categories",
                fields: [
                    {
                        name: "categories",
                        label: "Doc Categories",
                        type: "array",
                        itemLabel: "Category",
                        fields: [
                            { name: "title", label: "Title", type: "text" },
                            { name: "count", label: "Article Count", type: "text" },
                            { name: "iconName", label: "Icon", type: "text" },
                            { name: "color", label: "Color", type: "text" }
                        ]
                    }
                ]
            },
            {
                id: "cta",
                label: "SDK Guide CTA",
                fields: [
                    { name: "title", label: "Title", type: "text" },
                    { name: "description", label: "Description", type: "textarea" },
                    { name: "primaryButton", label: "Primary Button", type: "text" },
                    { name: "secondaryButton", label: "Secondary Button", type: "text" }
                ]
            }
        ]
    },

    // 8. Features
    features: {
        label: "Features Page",
        icon: "Zap",
        sections: [
            seoSection,
            {
                id: "header",
                label: "Header",
                fields: [
                    { name: "badge", label: "Badge", type: "text" },
                    { name: "titlePrefix", label: "Prefix", type: "text" },
                    { name: "titleHighlight", label: "Highlight", type: "text" },
                    { name: "description", label: "Description", type: "textarea" }
                ]
            },
            {
                id: "_root",
                label: "Feature List",
                fields: [
                    {
                        name: "features",
                        label: "Features",
                        type: "array",
                        itemLabel: "Feature",
                        fields: [
                            { name: "title", label: "Title", type: "text" },
                            { name: "description", label: "Description", type: "textarea" },
                            { name: "iconName", label: "Icon", type: "text" },
                            { name: "color", label: "Color", type: "text" }
                        ]
                    }
                ]
            },
            {
                id: "showcase",
                label: "Visual Forge Showcase",
                fields: [
                    { name: "title", label: "Title", type: "text" },
                    { name: "description", label: "Description", type: "textarea" },
                    { name: "badgeText", label: "Badge 1", type: "text" },
                    { name: "statusText", label: "Badge 2", type: "text" }
                ]
            }
        ]
    },

    // 9. Integrations
    integrations: {
        label: "Integrations",
        icon: "Link",
        sections: [
            seoSection,
            {
                id: "header",
                label: "Header",
                fields: [
                    { name: "badge", label: "Badge", type: "text" },
                    { name: "titlePrefix", label: "Prefix", type: "text" },
                    { name: "titleHighlight", label: "Highlight", type: "text" },
                    { name: "description", label: "Description", type: "textarea" }
                ]
            },
            {
                id: "_root",
                label: "Integrations List",
                fields: [
                    {
                        name: "integrations",
                        label: "Items",
                        type: "array",
                        itemLabel: "Integration",
                        fields: [
                            { name: "name", label: "Name", type: "text" },
                            { name: "description", label: "Description", type: "textarea" },
                            { name: "iconName", label: "Icon", type: "text" },
                            { name: "status", label: "Status", type: "text" }
                        ]
                    }
                ]
            },
            {
                id: "cta",
                label: "Custom API CTA",
                fields: [
                    { name: "title", label: "Title", type: "text" },
                    { name: "description", label: "Description", type: "textarea" },
                    { name: "buttonText", label: "Button", type: "text" }
                ]
            }
        ]
    },

    // 10. Partners
    partners: {
        label: "Partners",
        icon: "Handshake",
        sections: [
            seoSection,
            {
                id: "header",
                label: "Header",
                fields: [
                    { name: "badge", label: "Badge", type: "text" },
                    { name: "titlePrefix", label: "Prefix", type: "text" },
                    { name: "titleHighlight", label: "Highlight", type: "text" },
                    { name: "description", label: "Description", type: "textarea" }
                ]
            },
            {
                id: "_root",
                label: "Partners List",
                fields: [
                    {
                        name: "partners",
                        label: "Items",
                        type: "array",
                        itemLabel: "Partner",
                        fields: [
                            { name: "name", label: "Name", type: "text" },
                            { name: "role", label: "Role", type: "text" },
                            { name: "desc", label: "Description", type: "textarea" },
                            { name: "iconName", label: "Icon", type: "text" },
                            { name: "color", label: "Color", type: "text" }
                        ]
                    }
                ]
            }
        ]
    },

    // Services Page
    services: {
        label: "Services Page",
        icon: "Briefcase",
        sections: [
            seoSection,
            { name: "heroVideoUrl", label: "Hero Video URL", type: "text" }, // Root field
            {
                id: "_root",
                label: "Service Collections",
                fields: [
                    {
                        name: "overview",
                        label: "Service Categories",
                        type: "array",
                        itemLabel: "Category",
                        fields: [
                            { name: "id", label: "ID", type: "text" },
                            { name: "label", label: "Label", type: "text" },
                            { name: "iconName", label: "Icon", type: "text" },
                            { name: "gradient", label: "Gradient", type: "text" },
                            { name: "title", label: "Main Title", type: "text" },
                            { name: "subtitle", label: "Subtitle", type: "text" },
                            { name: "description", label: "Description", type: "textarea" },
                            { name: "image", label: "Cover Image", type: "image" },
                            {
                                name: "features",
                                label: "Features",
                                type: "array",
                                itemLabel: "Feature",
                                fields: [
                                    { name: "iconName", label: "Icon", type: "text" },
                                    { name: "title", label: "Title", type: "text" },
                                    { name: "desc", label: "Description", type: "textarea" }
                                ]
                            },
                            { name: "techs", label: "Technologies", type: "tags" }
                        ]
                    },
                    {
                        name: "packages",
                        label: "Pricing Packages",
                        type: "array",
                        itemLabel: "Package",
                        fields: [
                            { name: "id", label: "ID", type: "text" },
                            { name: "name", label: "Name", type: "text" },
                            { name: "price", label: "Price", type: "number" },
                            { name: "monthlyPrice", label: "Monthly Price", type: "number" },
                            { name: "description", label: "Description", type: "textarea" },
                            { name: "features", label: "Features", type: "tags" },
                            { name: "highlight", label: "Highlight", type: "boolean" },
                            { name: "iconName", label: "Icon", type: "text" },
                            { name: "gradient", label: "Gradient", type: "text" }
                        ]
                    },
                    {
                        name: "process",
                        label: "Process Steps",
                        type: "array",
                        itemLabel: "Step",
                        fields: [
                            { name: "id", label: "ID", type: "number" },
                            { name: "title", label: "Title", type: "text" },
                            { name: "desc", label: "Description", type: "textarea" },
                            { name: "iconName", label: "Icon", type: "text" },
                            { name: "color", label: "Color", type: "text" }
                        ]
                    },
                    {
                        name: "faqs",
                        label: "FAQs",
                        type: "array",
                        itemLabel: "Question",
                        fields: [
                            { name: "id", label: "ID", type: "text" },
                            { name: "category", label: "Category", type: "text" },
                            { name: "question", label: "Question", type: "text" },
                            { name: "answer", label: "Answer", type: "textarea" }
                        ]
                    },
                    {
                        name: "techStack",
                        label: "Tech Stack",
                        type: "array",
                        itemLabel: "Stack",
                        fields: [
                            { name: "id", label: "ID", type: "text" },
                            { name: "label", label: "Label", type: "text" },
                            { name: "iconName", label: "Icon", type: "text" },
                            { name: "description", label: "Description", type: "text" },
                            { name: "techs", label: "Techs", type: "tags" }
                        ]
                    }
                ]
            },
            {
                id: "comparison",
                label: "Feature Comparison",
                fields: [
                    {
                        name: "features",
                        label: "Features List",
                        type: "array",
                        itemLabel: "Feature",
                        fields: [
                            { name: "name", label: "Name", type: "text" },
                            { name: "tooltip", label: "Tooltip", type: "text" }
                        ]
                    },
                    {
                        name: "tiers",
                        label: "Tiers",
                        type: "array",
                        itemLabel: "Tier",
                        fields: [
                            { name: "id", label: "ID", type: "text" },
                            { name: "name", label: "Name", type: "text" },
                            { name: "price", label: "Price", type: "text" },
                            { name: "description", label: "Description", type: "text" },
                            { name: "iconName", label: "Icon", type: "text" },
                            { name: "color", label: "Color", type: "text" },
                            { name: "highlight", label: "Highlight", type: "boolean" }
                        ]
                    }
                ]
            }
        ]
    },

    // New Pages: Blog, Portfolio, Pricing, Shop, Status

    blog: {
        label: "Blog Page",
        icon: "Newspaper",
        sections: [
            seoSection,
            {
                id: "hero",
                label: "Hero",
                fields: [
                    { name: "title", label: "Title", type: "text" },
                    { name: "subtitle", label: "Subtitle", type: "text" }
                ]
            },
            {
                id: "_root",
                label: "Content",
                fields: [
                    {
                        name: "categories",
                        label: "Categories",
                        type: "array",
                        itemLabel: "Category",
                        fields: [
                            { name: "label", label: "Label", type: "text" },
                            { name: "slug", label: "Slug", type: "text" },
                            { name: "icon", label: "Icon", type: "text" }
                        ]
                    },
                    {
                        name: "posts",
                        label: "Posts",
                        type: "array",
                        itemLabel: "Post",
                        fields: [
                            { name: "title", label: "Title", type: "text" },
                            { name: "slug", label: "Slug", type: "text" },
                            { name: "excerpt", label: "Excerpt", type: "textarea" },
                            { name: "category", label: "Category", type: "text" },
                            { name: "date", label: "Date", type: "text" },
                            { name: "readTime", label: "Read Time", type: "text" },
                            { name: "gradient", label: "Gradient", type: "text" }
                        ]
                    }
                ]
            }
        ]
    },

    portfolio: {
        label: "Portfolio",
        icon: "Image",
        sections: [
            seoSection,
            {
                id: "header",
                label: "Header",
                fields: [
                    { name: "badge", label: "Badge", type: "text" },
                    { name: "title", label: "Title", type: "text" },
                    { name: "description", label: "Description", type: "textarea" }
                ]
            },
            {
                id: "_root",
                label: "Projects",
                fields: [
                    {
                        name: "projects",
                        label: "Project List",
                        type: "array",
                        itemLabel: "Project",
                        fields: [
                            { name: "title", label: "Title", type: "text" },
                            { name: "category", label: "Category", type: "text" },
                            { name: "description", label: "Description", type: "textarea" },
                            { name: "image", label: "Image", type: "image" },
                            { name: "client", label: "Client", type: "text" }
                        ]
                    }
                ]
            }
        ]
    },

    pricing: {
        label: "Pricing",
        icon: "DollarSign",
        sections: [
            seoSection,
            {
                id: "header",
                label: "Header",
                fields: [
                    { name: "badge", label: "Badge", type: "text" },
                    { name: "titlePrefix", label: "Prefix", type: "text" },
                    { name: "titleHighlight", label: "Highlight", type: "text" },
                    { name: "description", label: "Description", type: "textarea" }
                ]
            },
            {
                id: "_root",
                label: "Plans",
                fields: [
                    {
                        name: "plans",
                        label: "Subscription Plans",
                        type: "array",
                        itemLabel: "Plan",
                        fields: [
                            { name: "name", label: "Name", type: "text" },
                            { name: "price", label: "Price", type: "text" },
                            { name: "period", label: "Period", type: "text" },
                            { name: "description", label: "Description", type: "textarea" },
                            { name: "features", label: "Features", type: "tags" },
                            { name: "buttonText", label: "Button Text", type: "text" },
                            { name: "popular", label: "Is Popular", type: "boolean" }
                        ]
                    }
                ]
            }
        ]
    },

    shop: {
        label: "Shop",
        icon: "ShoppingBag",
        sections: [
            seoSection,
            {
                id: "header",
                label: "Header",
                fields: [
                    { name: "title", label: "Title", type: "text" },
                    { name: "description", label: "Description", type: "textarea" }
                ]
            },
            {
                id: "_root",
                label: "Inventory",
                fields: [
                    {
                        name: "categories",
                        label: "Categories",
                        type: "array",
                        itemLabel: "Category",
                        fields: [
                            { name: "id", label: "ID", type: "text" },
                            { name: "name", label: "Name", type: "text" },
                            { name: "icon", label: "Icon", type: "text" },
                            { name: "subcategories", label: "Subcategories", type: "tags" }
                        ]
                    },
                    {
                        name: "products",
                        label: "Products",
                        type: "array",
                        itemLabel: "Product",
                        fields: [
                            { name: "name", label: "Name", type: "text" },
                            { name: "slug", label: "Slug", type: "text" },
                            { name: "price", label: "Price", type: "number" },
                            { name: "category", label: "Category", type: "text" },
                            { name: "subcategory", label: "Subcategory", type: "text" },
                            { name: "image", label: "Image", type: "image" },
                            { name: "description", label: "Description", type: "textarea" },
                            { name: "features", label: "Features", type: "tags" }
                        ]
                    },
                    {
                        name: "bundles",
                        label: "Bundles",
                        type: "array",
                        itemLabel: "Bundle",
                        fields: [
                            { name: "name", label: "Name", type: "text" },
                            { name: "description", label: "Description", type: "textarea" },
                            { name: "price", label: "Price", type: "number" },
                            { name: "originalPrice", label: "Original Price", type: "number" },
                            { name: "image", label: "Image", type: "image" },
                            { name: "products", label: "Included Product IDs", type: "tags" }
                        ]
                    },
                    {
                        name: "testimonials",
                        label: "Testimonials",
                        type: "array",
                        itemLabel: "Review",
                        fields: [
                            { name: "name", label: "Name", type: "text" },
                            { name: "role", label: "Role", type: "text" },
                            { name: "content", label: "Content", type: "textarea" },
                            { name: "rating", label: "Rating", type: "number" },
                            { name: "avatar", label: "Avatar", type: "image" }
                        ]
                    }
                ]
            }
        ]
    },

    status: {
        label: "System Status",
        icon: "Activity",
        sections: [
            seoSection,
            {
                id: "header",
                label: "Header",
                fields: [
                    { name: "badge", label: "Badge", type: "text" },
                    { name: "title", label: "Title", type: "text" },
                    {
                        name: "mainStatus",
                        label: "Main Status",
                        type: "group",
                        fields: [
                            { name: "title", label: "Title", type: "text" },
                            { name: "description", label: "Description", type: "text" }
                        ]
                    }
                ]
            },
            {
                id: "_root",
                label: "Systems",
                fields: [
                    {
                        name: "systems",
                        label: "System Nodes",
                        type: "array",
                        itemLabel: "Node",
                        fields: [
                            { name: "name", label: "Name", type: "text" },
                            { name: "status", label: "Status", type: "text" },
                            { name: "uptime", label: "Uptime", type: "text" },
                            { name: "latency", label: "Latency", type: "text" },
                            { name: "iconName", label: "Icon", type: "text" },
                            { name: "color", label: "Color", type: "text" }
                        ]
                    }
                ]
            },
            {
                id: "incidents",
                label: "Incidents",
                fields: [
                    { name: "title", label: "Title", type: "text" },
                    {
                        name: "logs",
                        label: "Incident Logs",
                        type: "array",
                        itemLabel: "Log",
                        fields: [
                            { name: "date", label: "Date", type: "text" },
                            { name: "title", label: "Title", type: "text" },
                            { name: "desc", label: "Description", type: "textarea" },
                            { name: "status", label: "Status", type: "text" },
                            { name: "color", label: "Color", type: "text" }
                        ]
                    }
                ]
            },
            {
                id: "monitoring",
                label: "Monitoring",
                fields: [
                    { name: "note", label: "Note", type: "text" },
                    { name: "nextSyncText", label: "Next Sync Text", type: "text" }
                ]
            }
        ]
    },

    privacy: {
        label: "Privacy Policy",
        icon: "Shield",
        sections: [
            seoSection,
            {
                id: "header",
                label: "Header",
                fields: [
                    { name: "badge", label: "Badge", type: "text" },
                    { name: "titlePrefix", label: "Prefix", type: "text" },
                    { name: "titleHighlight", label: "Highlight", type: "text" },
                    { name: "description", label: "Description", type: "textarea" },
                    { name: "videoUrl", label: "Video URL", type: "text" }
                ]
            },
            {
                id: "_root",
                label: "Features & Content",
                fields: [
                    {
                        name: "features",
                        label: "Privacy Features",
                        type: "array",
                        itemLabel: "Feature",
                        fields: [
                            { name: "title", label: "Title", type: "text" },
                            { name: "description", label: "Description", type: "textarea" },
                            { name: "iconName", label: "Icon", type: "text" },
                            { name: "color", label: "Color", type: "text" }
                        ]
                    },
                    { name: "policyText", label: "Full Policy Text (Optional)", type: "rich-text" }
                ]
            },
            {
                id: "guarantee",
                label: "Guarantee",
                fields: [
                    { name: "title", label: "Title", type: "text" },
                    { name: "description", label: "Description", type: "textarea" },
                    {
                        name: "stats",
                        label: "Stats",
                        type: "array",
                        itemLabel: "Stat",
                        fields: [
                            { name: "value", label: "Value", type: "text" },
                            { name: "label", label: "Label", type: "text" }
                        ]
                    }
                ]
            },
            {
                id: "footer",
                label: "Footer",
                fields: [{ name: "status", label: "Status Text", type: "text" }]
            }
        ]
    },

    terms: {
        label: "Terms of Service",
        icon: "FileText",
        sections: [
            seoSection,
            {
                id: "header",
                label: "Header",
                fields: [
                    { name: "badge", label: "Badge", type: "text" },
                    { name: "title", label: "Title", type: "text" }, // Changed from Prefix/Highlight to Title based on seeder "Terms of Sync."
                    { name: "description", label: "Description", type: "textarea" },
                    { name: "videoUrl", label: "Video URL", type: "text" }
                ]
            },
            {
                id: "navigationRail",
                label: "Navigation Rail",
                fields: [
                    { name: "title", label: "Title", type: "text" },
                    { name: "items", label: "Nav Items", type: "tags" }
                ]
            },
            {
                id: "_root",
                label: "Content Sections",
                fields: [
                    {
                        name: "sections",
                        label: "Sections",
                        type: "array",
                        itemLabel: "Section",
                        fields: [
                            { name: "id", label: "ID", type: "text" },
                            { name: "title", label: "Title", type: "text" },
                            { name: "content", label: "Content", type: "textarea" },
                            { name: "iconName", label: "Icon", type: "text" }
                        ]
                    },
                    { name: "termsText", label: "Full Terms Text (Optional)", type: "rich-text" }
                ]
            },
            {
                id: "revision",
                label: "Revision Info",
                fields: [
                    { name: "prefix", label: "Prefix", type: "text" },
                    { name: "updatedAt", label: "Updated Date", type: "text" }
                ]
            }
        ]
    },

    support: {
        label: "Support Page",
        icon: "LifeBuoy",
        sections: [
            seoSection,
            {
                id: "header",
                label: "Header",
                fields: [
                    { name: "badge", label: "Badge", type: "text" },
                    { name: "title", label: "Title", type: "text" },
                    { name: "searchPlaceholder", label: "Search Placeholder", type: "text" },
                    { name: "videoUrl", label: "Video URL", type: "text" }
                ]
            },
            {
                id: "_root",
                label: "Channels",
                fields: [
                    {
                        name: "channels",
                        label: "Support Channels",
                        type: "array",
                        itemLabel: "Channel",
                        fields: [
                            { name: "id", label: "ID", type: "text" },
                            { name: "title", label: "Title", type: "text" },
                            { name: "desc", label: "Description", type: "textarea" },
                            { name: "iconName", label: "Icon", type: "text" },
                            { name: "color", label: "Color", type: "text" }
                        ]
                    }
                ]
            },
            {
                id: "faq",
                label: "FAQ",
                fields: [
                    { name: "badge", label: "Badge", type: "text" },
                    { name: "title", label: "Title", type: "text" },
                    {
                        name: "items",
                        label: "Questions",
                        type: "array",
                        itemLabel: "Question",
                        fields: [
                            { name: "id", label: "ID", type: "text" },
                            { name: "q", label: "Question", type: "text" },
                            { name: "a", label: "Answer", type: "textarea" }
                        ]
                    }
                ]
            },
            {
                id: "priorityRelay",
                label: "Priority Relay",
                fields: [
                    { name: "title", label: "Title", type: "text" },
                    { name: "description", label: "Description", type: "textarea" },
                    {
                        name: "buttons",
                        label: "Buttons",
                        type: "array",
                        itemLabel: "Button",
                        fields: [
                            { name: "label", label: "Label", type: "text" },
                            { name: "iconName", label: "Icon", type: "text" },
                            { name: "variant", label: "Variant", type: "text" }
                        ]
                    },
                    {
                        name: "metrics",
                        label: "Metrics",
                        type: "array",
                        itemLabel: "Metric",
                        fields: [
                            { name: "id", label: "ID", type: "text" },
                            { name: "label", label: "Label", type: "text" },
                            { name: "value", label: "Value", type: "text" },
                            { name: "iconName", label: "Icon", type: "text" }
                        ]
                    }
                ]
            }
        ]
    },
    // 19. Global Settings (Simulator & Forge)
    settings: {
        label: "Visual Forge Settings",
        icon: "Settings",
        sections: [
            {
                id: "_root",
                label: "Architectural Parameters",
                fields: [
                    { name: "heroTitle", label: "Hero Node Label", type: "text" },
                    { name: "pathNode", label: "Primary Path Segment", type: "text" },
                    { name: "glassmorphism", label: "Glassmorphism Protocol", type: "boolean" },
                    { name: "motion", label: "Neural Motion Engine", type: "boolean" },
                    { name: "vfx", label: "Visual Effects Layer", type: "boolean" }
                ]
            }
        ]
    },
    // 20. Global Infrastructure (Navbar, Footer, etc.)
    global: {
        label: "Global Infrastructure",
        icon: "Globe",
        sections: [
            {
                id: "navbar",
                label: "Navbar Architecture",
                fields: [
                    { name: "brandName", label: "Brand Identity", type: "text" },
                    {
                        name: "links",
                        label: "Navigation Nodes",
                        type: "array",
                        itemLabel: "Node",
                        fields: [
                            { name: "label", label: "Label", type: "text" },
                            { name: "href", label: "HREF path", type: "text" }
                        ]
                    }
                ]
            },
            {
                id: "footer",
                label: "Footer Infrastructure",
                fields: [
                    { name: "tagline", label: "Global Tagline", type: "textarea" },
                    {
                        name: "columns",
                        label: "Column Matrix",
                        type: "array",
                        itemLabel: "Column",
                        fields: [
                            { name: "title", label: "Column Title", type: "text" },
                            {
                                name: "links",
                                label: "Link Nodes",
                                type: "array",
                                itemLabel: "Link",
                                fields: [
                                    { name: "label", label: "Label", type: "text" },
                                    { name: "href", label: "HREF path", type: "text" }
                                ]
                            }
                        ]
                    }
                ]
            }
        ]
    }
};

export type PageKey = keyof typeof CMS_SCHEMA;
