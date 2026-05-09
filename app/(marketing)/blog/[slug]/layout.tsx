import { jsonLdSchemas, constructMetadata } from "@/lib/metadata";
import { Metadata } from "next";
import { notFound } from "next/navigation";

// This would be fetched from API in production
async function getBlogPost(slug: string) {
  // Mock function - replace with actual API call
  return {
    title: "Blog Post",
    description: "Blog post description",
    excerpt: "Excerpt",
    slug,
    coverImage: "/og-image.jpg",
    date: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    author: {
      name: "Oftisoft Team",
    },
  };
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPost(slug);
  
  if (!post) {
    return constructMetadata({
      title: "Post Not Found",
      description: "The requested blog post could not be found.",
    });
  }

  return constructMetadata({
    title: post.title,
    description: post.excerpt || post.description,
    image: post.coverImage,
    keywords: ["blog", "article", post.title.toLowerCase()],
  });
}

export default async function BlogPostLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getBlogPost(slug);
  
  if (!post) {
    notFound();
  }

  const breadcrumbData = [
    { name: "Home", url: "/" },
    { name: "Blog", url: "/blog" },
    { name: post.title, url: `/blog/${post.slug}` },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLdSchemas.article(post)),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLdSchemas.breadcrumb(breadcrumbData)),
        }}
      />
      {children}
    </>
  );
}
