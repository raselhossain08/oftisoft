
import FeaturedPost from "@/components/sections/blog/featured-post";
import BlogList from "@/components/sections/blog/blog-list";
import PopularPosts from "@/components/sections/blog/popular-posts";
import Newsletter from "@/components/sections/blog/newsletter";
import AuthorSpotlight from "@/components/sections/blog/author-spotlight";
import CTA from "@/components/sections/cta";

export default function BlogPage() {
    return (
        <main className="flex min-h-screen flex-col bg-background text-foreground overflow-hidden">
            <FeaturedPost />
            <PopularPosts />
            <BlogList />
            <Newsletter />
            <AuthorSpotlight />
            <CTA />
        </main>
    );
}
