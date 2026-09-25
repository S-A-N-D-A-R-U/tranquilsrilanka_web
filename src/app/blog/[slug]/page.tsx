import { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { getPostBySlug, getPosts } from "@/lib/api";
import PageHero from "@/components/ui/PageHero";
import { Calendar } from "lucide-react";
import Link from "next/link";
import { SITE_NAME, SITE_URL, jsonLdScript, stripHtml, truncate } from "@/lib/seo";
import { sanitizeRichText } from "@/lib/sanitize";

export const revalidate = 3600;

// Pre-render existing pages at build; new slugs are rendered on first visit and then cached
export async function generateStaticParams() {
  const items = await getPosts();
  return items.filter((p: { externalLink?: string }) => !p.externalLink).filter((i: { slug?: string }) => i.slug).map((i: { slug: string }) => ({ slug: i.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { title: "Post Not Found" };

  const description = truncate(post.excerpt || stripHtml(post.content));
  const url = `/blog/${post.slug}`;

  return {
    title: post.title,
    description,
    alternates: { canonical: url },
    // External-link posts only render a stub page here
    robots: post.externalLink ? { index: false, follow: true } : undefined,
    openGraph: {
      title: post.title,
      description,
      url,
      siteName: SITE_NAME,
      images: [post.image],
      type: "article",
      publishedTime: post.createdAt,
      modifiedTime: post.updatedAt || post.createdAt,
    },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  // External posts have no content here — send visitors straight to the source
  if (post.externalLink) {
    redirect(post.externalLink);
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: truncate(post.excerpt || stripHtml(post.content)),
    image: [new URL(post.image, SITE_URL).href],
    mainEntityOfPage: `${SITE_URL}/blog/${post.slug}`,
    datePublished: post.createdAt,
    dateModified: post.updatedAt || post.createdAt,
    author: [{
      "@type": "Organization",
      name: "Tranquil Sri Lanka",
      url: "https://www.tranquilsrilanka.com"
    }],
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      logo: { "@type": "ImageObject", url: `${SITE_URL}/logo.png` },
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLdScript(jsonLd)}
      />
      <PageHero 
        image={post.image} 
        eyebrow={post.category} 
        title={post.title} 
        subtitle={`${new Date(post.createdAt).toLocaleDateString()} · ${post.readTime}`}
      />

      <section className="container-page section-y">
        <div className="max-w-4xl mx-auto bg-white rounded-3xl p-8 md:p-12 shadow-elegant -mt-32 relative z-10 border border-gray-100">
          
          <div className="mb-10 text-center">
            <h1 className="text-3xl md:text-5xl font-display font-bold text-primary-deep leading-tight mb-6">
              {post.title}
            </h1>
            <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4"/> {new Date(post.createdAt).toLocaleDateString()}</span>
              <span>•</span>
              <span>{post.readTime}</span>
              <span>•</span>
              <span className="uppercase tracking-wider font-semibold text-accent">{post.category}</span>
            </div>
          </div>

          <div className="prose prose-lg prose-headings:font-display prose-headings:text-primary-deep prose-a:text-accent prose-img:rounded-xl mx-auto max-w-none">
            {post.isHtml ? (
              <div dangerouslySetInnerHTML={{ __html: sanitizeRichText(post.content) }} />
            ) : (
              <div className="whitespace-pre-line text-gray-700 leading-relaxed text-lg">
                {post.content}
              </div>
            )}
          </div>

          <div className="mt-16 pt-8 border-t border-border flex justify-between items-center">
            <Link href="/blog" className="text-primary hover:text-primary-deep font-semibold transition flex items-center gap-2">
              ← Back to all posts
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
