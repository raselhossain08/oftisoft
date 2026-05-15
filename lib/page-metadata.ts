import { siteConfig } from '@/lib/site-config';
import type { Metadata } from 'next';

type PageMeta = {
  title: string;
  description: string;
  keywords?: string[];
  ogImage?: string;
};

const pageMetadata: Record<string, PageMeta> = {
  '/': {
    title: siteConfig.name,
    description: siteConfig.description,
  },
  '/about': {
    title: 'About Us | Our Story, Mission & Team',
    description: 'Looking for a trusted software development partner? Learn about Oftisoft\'s journey since 2019, our mission to deliver premium digital solutions, and meet the expert team behind our successful web, mobile, and AI projects.',
    keywords: ['about Oftisoft', 'software company story', 'our mission', 'software development team', 'Bangladesh tech company', 'founder Rasel Hossain'],
  },
  '/services': {
    title: 'Programming Services | Web, Mobile, AI & WordPress Development',
    description: 'Looking for a professional developer? Oftisoft offers 50+ programming services including WordPress development, React/Next.js web apps, mobile apps, AI chatbots, backend APIs, e-commerce stores, website redesign, cloud DevOps, and more. Get your project done by expert developers. Starting at $499.',
    keywords: [
      'WordPress development', 'WordPress fix', 'WordPress speed optimization', 'WordPress website creation',
      'React developer', 'Next.js development', 'frontend developer', 'web application development',
      'mobile app development', 'React Native app', 'iOS Android app builder',
      'AI chatbot development', 'machine learning', 'LLM integration', 'ChatGPT integration',
      'Python developer', 'Node.js backend', 'API development', 'REST API', 'GraphQL API',
      'full stack developer', 'SaaS development', 'custom software development',
      'e-commerce website', 'online store development', 'WooCommerce',
      'website redesign', 'fix my website', 'modernize website',
      'DevOps engineer', 'cloud migration', 'AWS', 'Docker', 'Kubernetes',
      'database design', 'PostgreSQL', 'MongoDB', 'data engineering',
      'hire programmer', 'hire developer', 'programming services',
      'software development', 'web developer', 'software engineer',
      'website maintenance', 'bug fix', 'technical support',
    ],
  },
  '/portfolio': {
    title: 'Portfolio | Our Latest Software Projects & Case Studies',
    description: 'Browse our portfolio of successful software projects. From SaaS platforms and mobile apps to AI-powered solutions, see how Oftisoft has helped businesses transform their digital presence with custom development.',
    keywords: ['software portfolio', 'web development projects', 'mobile app portfolio', 'case studies', 'client work', 'software showcase'],
  },
  '/blog': {
    title: 'Blog | Software Development Insights & Tutorials',
    description: 'Stay ahead with Oftisoft\'s blog. Read about software development best practices, tech tutorials, industry insights, and behind-the-scenes stories from our engineering team.',
    keywords: ['software blog', 'web development tutorial', 'tech insights', 'programming tips', 'developer blog', 'tech articles'],
  },
  '/contact': {
    title: 'Contact Us | Get a Free Software Consultation',
    description: 'Need a software development partner? Contact Oftisoft for a free consultation. Tell us about your project and get expert advice on the best technical approach, timeline, and cost for your web, mobile, or AI application.',
    keywords: ['contact Oftisoft', 'software consultation', 'free consultation', 'hire developers', 'project inquiry', 'software development quote'],
  },
  '/pricing': {
    title: 'Pricing | Transparent Software Development Packages',
    description: 'Explore Oftisoft\'s transparent pricing for web development, mobile apps, AI solutions, and SaaS platforms. Custom enterprise solutions available. No hidden fees, just premium software delivered on time.',
    keywords: ['software development pricing', 'web development cost', 'mobile app price', 'SaaS pricing', 'software packages', 'custom software quote'],
  },
  '/shop': {
    title: 'Shop | Premium Software & Digital Products',
    description: 'Browse and purchase premium software products, templates, and digital solutions from Oftisoft. Ready-to-deploy applications and tools for your business.',
    keywords: ['software shop', 'digital products', 'premium software', 'buy software', 'software templates', 'digital solutions'],
  },
  '/support': {
    title: 'Support | Getting Help & Technical Assistance',
    description: 'Need help with your software project? Oftisoft offers comprehensive support — from technical troubleshooting and maintenance to feature requests and onboarding assistance.',
    keywords: ['software support', 'technical assistance', 'maintenance', 'help center', 'client support', 'software help'],
  },
  '/features': {
    title: 'Features | What Makes Oftisoft Different',
    description: 'Discover the features that set Oftisoft apart — agile development, modern tech stacks, dedicated project management, transparent communication, and a commitment to delivering production-ready software every sprint.',
    keywords: ['software features', 'agile development', 'tech stack', 'project management', 'quality assurance', 'delivery process'],
  },
  '/careers': {
    title: 'Careers | Join the Oftisoft Engineering Team',
    description: 'Join Oftisoft and work on cutting-edge software projects. We\'re hiring engineers, designers, and project managers who are passionate about building world-class digital products.',
    keywords: ['software careers', 'developer jobs', 'tech hiring', 'engineering jobs', 'join our team', 'software company careers'],
  },
  '/integrations': {
    title: 'Integrations | Third-Party Tools & API Partners',
    description: 'Explore Oftisoft\'s technology integrations and partnerships. We work with leading platforms and APIs to deliver comprehensive software solutions.',
    keywords: ['software integrations', 'API partners', 'third-party tools', 'technology partnerships', 'platform integration'],
  },
  '/partners': {
    title: 'Partners | Technology & Business Partnerships',
    description: 'Learn about Oftisoft\'s partner program. We collaborate with technology providers, agencies, and businesses to deliver comprehensive digital solutions.',
    keywords: ['technology partners', 'business partnerships', 'collaboration', 'agency partners', 'strategic alliances'],
  },
  '/docs': {
    title: 'Documentation | Guides, APIs & Technical References',
    description: 'Access Oftisoft\'s technical documentation — API references, integration guides, setup tutorials, and developer resources for our software products and services.',
    keywords: ['documentation', 'API docs', 'technical guides', 'developer resources', 'integration docs', 'software documentation'],
  },
  '/community': {
    title: 'Community | Join the Oftisoft Developer Community',
    description: 'Join the Oftisoft community of developers, designers, and tech enthusiasts. Share knowledge, get help, and stay connected with fellow software professionals.',
    keywords: ['developer community', 'tech community', 'software forum', 'developer network', 'community events'],
  },
  '/changelog': {
    title: 'Changelog | Product Updates & Release Notes',
    description: 'Stay up to date with the latest Oftisoft product updates, feature releases, bug fixes, and improvements across all our software solutions.',
    keywords: ['changelog', 'release notes', 'product updates', 'software updates', 'version history'],
  },
  '/status': {
    title: 'System Status | Service Health & Uptime',
    description: 'Check the current status of Oftisoft services and platforms. Real-time uptime monitoring, incident reports, and maintenance schedules.',
    keywords: ['system status', 'service health', 'uptime', 'incident report', 'maintenance', 'service status'],
  },
  '/terms': {
    title: 'Terms of Service | Legal & Usage Policies',
    description: 'Read Oftisoft\'s terms of service, conditions of use, and legal policies governing the use of our software products, services, and website.',
    keywords: ['terms of service', 'legal', 'usage policy', 'conditions', 'software license'],
  },
  '/privacy': {
    title: 'Privacy Policy | Data Protection & GDPR Compliance',
    description: 'Oftisoft\'s privacy policy explains how we collect, use, and protect your personal data. We are committed to GDPR compliance and data security best practices.',
    keywords: ['privacy policy', 'data protection', 'GDPR', 'data privacy', 'personal data', 'security policy'],
  },
};

export function resolvePageMetadata(pathname: string): Metadata {
  const path = pathname.endsWith('/') && pathname !== '/' ? pathname.slice(0, -1) : pathname;
  const meta = pageMetadata[path];

  if (!meta) return {};

  return {
    title: meta.title,
    description: meta.description,
    keywords: meta.keywords,
    alternates: { canonical: `${siteConfig.url}${path}` },
    openGraph: {
      title: meta.title,
      description: meta.description,
      url: `${siteConfig.url}${path}`,
      images: meta.ogImage ? [{ url: meta.ogImage, width: 1200, height: 630 }] : undefined,
    },
    twitter: {
      title: meta.title,
      description: meta.description,
    },
  };
}

export { pageMetadata };
