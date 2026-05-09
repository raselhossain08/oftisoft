import { jsonLdSchemas, constructMetadata } from "@/lib/metadata";
import { Metadata } from "next";
import { notFound } from "next/navigation";

// This would be fetched from API in production
async function getProduct(slug: string) {
  // Mock function - replace with actual API call
  return {
    name: "Product",
    description: "Product description",
    slug,
    image: "/og-image.jpg",
    price: 99,
    rating: 4.5,
    reviews: 10,
  };
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    return constructMetadata({
      title: "Product Not Found",
      description: "The requested product could not be found.",
    });
  }

  return constructMetadata({
    title: `${product.name} | Premium Digital Asset`,
    description: product.description,
    image: product.image,
    keywords: [
      product.name.toLowerCase(),
      "digital asset",
      "template",
      "UI kit",
      "premium template",
    ],
  });
}

export default async function ProductLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    notFound();
  }

  const breadcrumbData = [
    { name: "Home", url: "/" },
    { name: "Shop", url: "/shop" },
    { name: product.name, url: `/shop/${product.slug}` },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLdSchemas.softwareApplication(product)),
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
