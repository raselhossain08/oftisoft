import { jsonLdSchemas, constructMetadata } from "@/lib/metadata";
import { Metadata } from "next";
import { notFound } from "next/navigation";

async function getBlogPost(slug: string) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5500/api";
  try {
    const res = await fetch(`${apiUrl}/posts/slug/${slug}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
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
    description: post.excerpt || post.seoDescription || "",
    image: post.featuredImage,
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
      <script type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLdSchemas.article(post)),
        }}
      />
      <script type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLdSchemas.breadcrumb(breadcrumbData)),
        }}
      />
      {children}
    </>
  );
}
