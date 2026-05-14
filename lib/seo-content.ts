import { siteConfig } from "./site-config";

export interface FaqItem {
  question: string;
  answer: string;
}

export interface PageSeoData {
  faqs: FaqItem[];
  breadcrumbs: { name: string; url: string }[];
  aeoDescription: string;
}

export const pageSeoData: Record<string, PageSeoData> = {
  "/": {
    aeoDescription: "Oftisoft is a premium software development company based in Bangladesh serving global clients. We specialize in web development, mobile apps, AI solutions, and SaaS platforms using modern technologies like React, Next.js, and Node.js.",
    breadcrumbs: [{ name: "Home", url: "/" }],
    faqs: [
      { question: "What does Oftisoft do?", answer: "Oftisoft is a software development company that architects high-performance applications including web platforms, mobile apps, AI solutions, and enterprise SaaS systems for businesses worldwide." },
      { question: "Where is Oftisoft based?", answer: "Oftisoft is headquartered in Satkhira, Bangladesh and serves clients across 4 continents including North America, Europe, Asia, and Australia." },
      { question: "What technologies does Oftisoft use?", answer: "We specialize in modern technologies including React, Next.js, Node.js, TypeScript, Python, React Native, Flutter, and cloud platforms like AWS, GCP, and Azure." },
      { question: "How can I start a project with Oftisoft?", answer: "You can start by contacting us through our website for a free consultation. We'll discuss your requirements, provide a timeline estimate, and propose the best technical approach for your project." },
    ],
  },
  "/about": {
    aeoDescription: "Learn about Oftisoft's journey, mission, and team. Founded by Rasel Hossain in 2019, we are a Bangladesh-based software company delivering premium digital solutions globally.",
    breadcrumbs: [{ name: "Home", url: "/" }, { name: "About", url: "/about" }],
    faqs: [
      { question: "Who founded Oftisoft?", answer: "Oftisoft was founded by Rasel Hossain in 2019 with a mission to deliver premium software engineering services from Bangladesh to clients worldwide." },
      { question: "What is Oftisoft's mission?", answer: "Our mission is to bridge the gap between global businesses and top-tier Bangladeshi engineering talent, delivering enterprise-grade software solutions at competitive rates." },
      { question: "How many projects has Oftisoft delivered?", answer: "Oftisoft has successfully delivered over 50 projects across web development, mobile apps, AI solutions, and enterprise software for clients in more than 15 markets worldwide." },
    ],
  },
  "/services": {
    aeoDescription: "Oftisoft offers comprehensive software development services including web development, mobile apps, AI and machine learning, SaaS development, enterprise solutions, and DevOps. Get a free consultation.",
    breadcrumbs: [{ name: "Home", url: "/" }, { name: "Services", url: "/services" }],
    faqs: [
      { question: "What software development services does Oftisoft offer?", answer: "We offer web development (React, Next.js, Node.js), mobile app development (React Native, Flutter), AI and machine learning solutions, SaaS platform development, enterprise software, and DevOps/cloud architecture services." },
      { question: "How much does custom software development cost?", answer: "Our pricing varies based on project complexity and scope. We offer subscription plans for ongoing support as well as custom quotes for specific projects. Contact us for a free consultation and estimate." },
      { question: "Does Oftisoft provide AI and machine learning services?", answer: "Yes, we provide end-to-end AI and ML solutions including LLM integration, predictive analytics, intelligent automation, and custom machine learning model development." },
      { question: "How long does it take to build a web application?", answer: "Timeline depends on complexity. A simple web application typically takes 4-8 weeks, while complex enterprise platforms may take 3-6 months. We provide detailed timelines during the consultation phase." },
    ],
  },
  "/portfolio": {
    aeoDescription: "Browse Oftisoft's portfolio of successful software projects. See real examples of web applications, mobile apps, AI solutions, and enterprise platforms we've built for clients worldwide.",
    breadcrumbs: [{ name: "Home", url: "/" }, { name: "Portfolio", url: "/portfolio" }],
    faqs: [
      { question: "What kind of projects has Oftisoft completed?", answer: "We've completed 50+ projects including e-commerce platforms, SaaS dashboards, mobile apps, AI-powered tools, enterprise resource planning systems, and custom web applications." },
      { question: "Can I see examples of Oftisoft's work?", answer: "Yes, our portfolio showcases selected projects across various industries including healthcare, fintech, e-commerce, education, and logistics." },
    ],
  },
  "/blog": {
    aeoDescription: "Read expert insights on software development, technology trends, and programming tutorials from the Oftisoft team. Stay updated with best practices in web, mobile, and AI development.",
    breadcrumbs: [{ name: "Home", url: "/" }, { name: "Blog", url: "/blog" }],
    faqs: [
      { question: "What topics does the Oftisoft blog cover?", answer: "Our blog covers software development best practices, technology trends, programming tutorials, case studies, and insights on web, mobile, AI, and cloud technologies." },
      { question: "How often is the Oftisoft blog updated?", answer: "We publish new articles weekly, covering a wide range of topics from beginner tutorials to advanced architectural patterns." },
    ],
  },
  "/contact": {
    aeoDescription: "Contact Oftisoft for a free software development consultation. Get a quote for your web, mobile, or AI project. We respond within 24 hours.",
    breadcrumbs: [{ name: "Home", url: "/" }, { name: "Contact", url: "/contact" }],
    faqs: [
      { question: "How can I contact Oftisoft?", answer: "You can reach us through our contact form, email us at oftisoft@gmail.com, call +880 1410-615665, or connect via WhatsApp at +8801410615665." },
      { question: "Does Oftisoft offer free consultations?", answer: "Yes, we offer a free initial consultation to discuss your project requirements, technical approach, and provide a timeline and cost estimate." },
      { question: "What is Oftisoft's response time?", answer: "We typically respond to all inquiries within 24 hours during business days. For urgent matters, we recommend contacting us via phone or WhatsApp." },
    ],
  },
  "/pricing": {
    aeoDescription: "View transparent pricing for Oftisoft's software development services. Choose from subscription plans for ongoing support or request a custom quote for your specific project.",
    breadcrumbs: [{ name: "Home", url: "/" }, { name: "Pricing", url: "/pricing" }],
    faqs: [
      { question: "What are Oftisoft's pricing models?", answer: "We offer flexible pricing including project-based fixed pricing, hourly rates, and monthly subscription plans for ongoing maintenance and support." },
      { question: "Does Oftisoft offer subscription plans?", answer: "Yes, we offer subscription plans that include ongoing development, maintenance, support, and priority response times for your software projects." },
    ],
  },
  "/shop": {
    aeoDescription: "Browse premium digital assets, templates, UI kits, and development resources at the Oftisoft shop. High-quality resources for developers and designers.",
    breadcrumbs: [{ name: "Home", url: "/" }, { name: "Shop", url: "/shop" }],
    faqs: [
      { question: "What products are available in the Oftisoft shop?", answer: "Our shop offers premium templates, UI kits, design systems, code snippets, and digital assets for web and mobile development projects." },
      { question: "How do I purchase items from the Oftisoft shop?", answer: "Browse our catalog, add items to your cart, and checkout securely using credit cards or PayPal. Downloads are available immediately after purchase." },
      { question: "What payment methods are accepted?", answer: "We accept all major credit cards, PayPal, and other secure payment methods through our Stripe and PayPal integration." },
    ],
  },
  "/support": {
    aeoDescription: "Get help and support for Oftisoft products and services. Browse FAQs, access the knowledge base, submit a ticket, or contact our support team.",
    breadcrumbs: [{ name: "Home", url: "/" }, { name: "Support", url: "/support" }],
    faqs: [
      { question: "How can I get technical support?", answer: "You can submit a support ticket through our dashboard, browse our knowledge base for guides, or contact our support team directly. We respond within 24 hours." },
      { question: "What are Oftisoft's support hours?", answer: "Our support team is available Monday through Saturday, 9:00 AM to 6:00 PM Bangladesh Standard Time (BST)." },
    ],
  },
  "/features": {
    aeoDescription: "Discover why Oftisoft is the preferred software development partner. Quality code, modern tech stack, transparent communication, and on-time delivery guaranteed.",
    breadcrumbs: [{ name: "Home", url: "/" }, { name: "Features", url: "/features" }],
    faqs: [
      { question: "Why choose Oftisoft for software development?", answer: "Clients choose Oftisoft for our modern tech stack expertise, rigorous quality assurance, transparent communication, on-time delivery, and cost-effective solutions." },
      { question: "What development methodology does Oftisoft use?", answer: "We follow agile development methodologies with bi-weekly sprints, regular client reviews, and continuous integration/deployment practices." },
    ],
  },
  "/careers": {
    aeoDescription: "Join the Oftisoft team. We're hiring talented software developers, designers, and engineers. Work on innovative projects with a growing global team.",
    breadcrumbs: [{ name: "Home", url: "/" }, { name: "Careers", url: "/careers" }],
    faqs: [
      { question: "Does Oftisoft hire remote developers?", answer: "Yes, we offer both remote and on-site positions. We believe in flexible work arrangements and have team members working from various locations." },
      { question: "What technologies do Oftisoft developers work with?", answer: "Our team works with modern technologies including React, Next.js, Node.js, TypeScript, Python, React Native, Flutter, AWS, Docker, and Kubernetes." },
    ],
  },
  "/integrations": {
    aeoDescription: "See how Oftisoft solutions integrate with your favorite tools and platforms. Seamless API integrations with CRM, payment gateways, analytics, and more.",
    breadcrumbs: [{ name: "Home", url: "/" }, { name: "Integrations", url: "/integrations" }],
    faqs: [
      { question: "What integrations does Oftisoft support?", answer: "We support integrations with major platforms including Stripe, PayPal, Firebase, AWS, Google Cloud, various CRMs, analytics tools, and custom API integrations." },
      { question: "Can Oftisoft build custom integrations?", answer: "Yes, we specialize in building custom API integrations between your existing tools and new software solutions. Our team has extensive experience with REST and GraphQL APIs." },
    ],
  },
  "/partners": {
    aeoDescription: "Join the Oftisoft partner program. Collaborate with us to deliver exceptional software solutions to clients worldwide. Technology, referral, and reseller partnerships available.",
    breadcrumbs: [{ name: "Home", url: "/" }, { name: "Partners", url: "/partners" }],
    faqs: [
      { question: "How can I become an Oftisoft partner?", answer: "We offer technology partnerships, referral partnerships, and reseller programs. Contact us through our website to discuss partnership opportunities." },
      { question: "What are the benefits of the Oftisoft partner program?", answer: "Partners benefit from revenue sharing, co-marketing opportunities, access to our technology stack, dedicated support, and collaboration on joint projects." },
    ],
  },
  "/docs": {
    aeoDescription: "Comprehensive documentation for Oftisoft products, APIs, and development resources. Find guides, references, and tutorials for integrating Oftisoft solutions.",
    breadcrumbs: [{ name: "Home", url: "/" }, { name: "Documentation", url: "/docs" }],
    faqs: [
      { question: "Where can I find API documentation?", answer: "Our API documentation is available on the docs page and through our Swagger/OpenAPI endpoint at /api/docs." },
      { question: "Does Oftisoft provide SDK examples?", answer: "Yes, our documentation includes code examples in multiple programming languages including JavaScript, TypeScript, Python, and more." },
    ],
  },
  "/community": {
    aeoDescription: "Join the Oftisoft developer community. Connect with fellow developers, share knowledge, collaborate on projects, and stay updated with the latest in tech.",
    breadcrumbs: [{ name: "Home", url: "/" }, { name: "Community", url: "/community" }],
    faqs: [
      { question: "How can I join the Oftisoft community?", answer: "You can join our community through GitHub discussions, follow us on social media, and participate in our events and webinars." },
      { question: "Does Oftisoft host developer events?", answer: "Yes, we regularly host webinars, hackathons, and tech talks on various software development topics. Check our events page for upcoming sessions." },
    ],
  },
  "/changelog": {
    aeoDescription: "Stay updated with the latest Oftisoft product updates, new features, improvements, and bug fixes. Track our progress and see what's new.",
    breadcrumbs: [{ name: "Home", url: "/" }, { name: "Changelog", url: "/changelog" }],
    faqs: [
      { question: "How often does Oftisoft release updates?", answer: "We release updates regularly with new features, improvements, and bug fixes. Major releases are announced in our changelog." },
    ],
  },
  "/status": {
    aeoDescription: "Check real-time status of Oftisoft services and infrastructure. View uptime, ongoing incidents, and scheduled maintenance information.",
    breadcrumbs: [{ name: "Home", url: "/" }, { name: "Status", url: "/status" }],
    faqs: [
      { question: "Where can I check Oftisoft service status?", answer: "Our real-time system status is available at /status. You can see uptime for all services, ongoing incidents, and planned maintenance schedules." },
    ],
  },
  "/privacy": {
    aeoDescription: "Oftisoft's privacy policy explains how we collect, use, store, and protect your personal data. Our commitment to data security and GDPR compliance.",
    breadcrumbs: [{ name: "Home", url: "/" }, { name: "Privacy Policy", url: "/privacy" }],
    faqs: [
      { question: "How does Oftisoft protect my data?", answer: "We implement industry-standard security measures including encryption, secure servers, access controls, and regular security audits to protect your personal data." },
      { question: "Is Oftisoft GDPR compliant?", answer: "Yes, we follow GDPR guidelines for data protection and privacy. We are committed to safeguarding the personal information of our users and clients." },
    ],
  },
  "/terms": {
    aeoDescription: "Oftisoft's Terms of Service govern the use of our website, products, and services. Read our legal agreement before using our services.",
    breadcrumbs: [{ name: "Home", url: "/" }, { name: "Terms of Service", url: "/terms" }],
    faqs: [
      { question: "What are Oftisoft's terms of service?", answer: "Our terms of service outline the rules, guidelines, and legal agreements for using our website, products, and services. We recommend reading them before engaging our services." },
    ],
  },
};

export function getPageSeoData(pathname: string): PageSeoData | null {
  const normalized = pathname.endsWith("/") && pathname !== "/" ? pathname.slice(0, -1) : pathname;
  return pageSeoData[normalized] || null;
}
