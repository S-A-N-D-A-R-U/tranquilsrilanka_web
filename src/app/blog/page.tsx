import { Metadata } from "next";
import Link from "next/link";
import { Calendar, ArrowUpRight } from "lucide-react";
import PageHero from "@/components/ui/PageHero";
import { getPosts } from "@/lib/api";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Sri Lanka Travel Blog — Guides, Tips & Stories",
  description: "Sri Lanka travel guides, hidden gems, seasonal tips and news from our local team on the ground — plan your trip with insider knowledge.",
  alternates: { canonical: "/blog" },
};

export default async function Blog() {
  const posts = await getPosts();

  const getPostLink = (post: any) => post.externalLink ? post.externalLink : `/blog/${post.slug}`;
  const getPostTarget = (post: any) => post.externalLink ? "_blank" : "_self";
  return (
    <>
      <PageHero image="/travel-guide.webp" eyebrow="Blog & News" title="Stories from the island" subtitle="Travel guides, hidden gems and seasonal tips from our team in Sri Lanka." />
      <section className="container-page section-y">
        {posts.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            <p>No blog posts or stories available yet. Check back soon!</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-7">
            {posts.map((p: any) => (
              <Link key={p.slug || p.id} href={getPostLink(p)} target={getPostTarget(p)} rel={p.externalLink ? "noopener noreferrer" : undefined} className="group card-surface overflow-hidden hover:shadow-elegant transition flex flex-col">
                <div className="relative h-56 overflow-hidden shrink-0">
                  <img src={p.image} alt={p.title} className="absolute inset-0 h-full w-full object-cover group-hover:scale-110 transition-transform duration-[1200ms]" />
                  <span className="absolute top-3 left-3 bg-accent text-primary-deep text-[10px] uppercase tracking-widest font-bold px-2.5 py-1 rounded-full">{p.category}</span>
                  {p.externalLink && (
                    <span className="absolute top-3 right-3 bg-white/90 text-primary-deep text-[10px] uppercase tracking-widest font-bold px-2.5 py-1 rounded-full flex items-center gap-1 backdrop-blur-sm">
                      External
                    </span>
                  )}
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground"><Calendar className="h-3.5 w-3.5" /> {p.createdAt ? new Date(p.createdAt).toLocaleDateString() : ''} · {p.readTime}</div>
                  <h3 className="mt-3 font-display text-lg font-semibold text-primary-deep group-hover:text-primary leading-snug">{p.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground line-clamp-3 mb-4">{p.excerpt}</p>
                  <div className="mt-auto inline-flex items-center gap-1.5 text-xs font-semibold text-primary group-hover:text-accent">
                    {p.externalLink ? 'Visit Link' : 'Read more'} <ArrowUpRight className="h-3.5 w-3.5" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </>
  );
}