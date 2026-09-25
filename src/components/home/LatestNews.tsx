import Link from "next/link";
import { ArrowUpRight, Calendar } from "lucide-react";
import SectionHeader from "@/components/ui/SectionHeader";
import { getPosts } from "@/lib/api";

export default async function LatestNews() {
  const allPosts = await getPosts();
  const featuredPosts = allPosts.filter((p: any) => p.isFeatured);
  const postsToShow = featuredPosts.length >= 4 ? featuredPosts : allPosts.slice(0, 4);
  
  if (postsToShow.length === 0) return null;
  
  const [hero, ...rest] = postsToShow;

  const getPostLink = (post: any) => post.externalLink ? post.externalLink : `/blog/${post.slug}`;
  const getPostTarget = (post: any) => post.externalLink ? "_blank" : "_self";
  return (
    <section className="bg-sand/40 section-y">
      <div className="container-page">
        <SectionHeader eyebrow="Stories & News" title={<>Travel guides & <span className="italic text-accent">island stories</span></>} subtitle="Tips, hidden gems and seasonal travel updates from our team on the ground." />
        <div className="mt-14 grid lg:grid-cols-12 gap-6">
          <Link href={getPostLink(hero)} target={getPostTarget(hero)} rel={hero.externalLink ? "noopener noreferrer" : undefined} className="lg:col-span-7 group block card-surface overflow-hidden hover:shadow-elegant transition">
            <div className="relative h-72 sm:h-96 overflow-hidden">
              <img src={hero.image} loading="lazy" decoding="async" alt={hero.title} className="absolute inset-0 h-full w-full object-cover group-hover:scale-105 transition-transform duration-[1200ms]" />
              <div className="absolute inset-0 bg-gradient-to-t from-primary-deep/80 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-7 text-white">
                <span className="text-[11px] font-semibold uppercase tracking-widest text-accent">{hero.category}</span>
                <h3 className="font-display text-2xl md:text-3xl font-bold mt-2 leading-tight">{hero.title}</h3>
                <div className="mt-3 flex items-center gap-3 text-xs text-white/70">
                  <Calendar className="h-3.5 w-3.5" /> {new Date(hero.createdAt).toLocaleDateString()} · {hero.readTime}
                </div>
              </div>
            </div>
          </Link>
          <div className="lg:col-span-5 grid gap-4">
            {rest.slice(0, 3).map((p: any) => (
              <Link key={p.slug} href={getPostLink(p)} target={getPostTarget(p)} rel={p.externalLink ? "noopener noreferrer" : undefined} className="group flex gap-4 card-surface p-3 hover:shadow-soft transition">
                <img src={p.image} loading="lazy" decoding="async" alt={p.title} className="h-24 w-28 rounded-xl object-cover flex-shrink-0 bg-black/10" />
                <div className="min-w-0 flex flex-col justify-between py-1">
                  <div>
                    <span className="text-[10px] font-semibold uppercase tracking-widest text-accent">{p.category}</span>
                    <h4 className="font-display text-sm font-semibold text-primary-deep group-hover:text-primary line-clamp-2 mt-1">{p.title}</h4>
                  </div>
                  <div className="text-[11px] text-muted-foreground flex items-center justify-between">
                    <span>{new Date(p.createdAt).toLocaleDateString()}</span>
                    <ArrowUpRight className="h-3.5 w-3.5 text-accent" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}