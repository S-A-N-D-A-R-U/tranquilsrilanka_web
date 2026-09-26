import { getActivities, getActivityBySlug } from "@/lib/api";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Clock, MapPin, Check, ChevronRight } from "lucide-react";
import { Metadata } from "next";
import { SITE_NAME, truncate } from "@/lib/seo";

export const revalidate = 3600;

// Pre-render existing pages at build; new slugs are rendered on first visit and then cached
export async function generateStaticParams() {
  const items = await getActivities();
  return items.filter((i: { slug?: string }) => i.slug).map((i: { slug: string }) => ({ slug: i.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const activity = await getActivityBySlug(slug);
  if (!activity) return { title: "Activity Not Found" };

  const description = truncate(activity.shortDescription);
  const url = `/activities/${activity.slug || activity.id}`;

  return {
    title: activity.title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: activity.title,
      description,
      url,
      siteName: SITE_NAME,
      images: [activity.image],
    },
  };
}

export default async function ActivityPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const a = await getActivityBySlug(slug);
  
  if (!a) {
    notFound();
  }

  return (
    <>
      <section className="relative h-[55vh] min-h-[380px] overflow-hidden">
        <img src={a.image} alt={a.title} className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-primary-deep/90 via-primary-deep/30 to-transparent" />
        <div className="container-page relative h-full flex flex-col justify-end pb-10 text-white">
          <Link href="/things-to-do" className="text-xs uppercase tracking-widest text-accent mb-3 link-underline">← All experiences</Link>
          <span className="bg-accent text-primary-deep text-[10px] uppercase tracking-widest font-bold px-2.5 py-1 rounded-full w-fit mb-3">{a.category}</span>
          <h1 className="font-display font-bold text-3xl sm:text-5xl max-w-3xl leading-tight">{a.title}</h1>
          <div className="mt-4 flex flex-wrap gap-5 text-sm text-white/85">
            <span className="inline-flex items-center gap-1.5"><MapPin className="h-4 w-4 text-accent" /> {a.destination}</span>
            <span className="inline-flex items-center gap-1.5"><Clock className="h-4 w-4 text-accent" /> {a.duration}</span>
          </div>
        </div>
      </section>

      <section className="container-page section-y grid lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-10">
          <div>
            <h2 className="font-display font-bold text-2xl text-primary-deep">About this experience</h2>
            <div className="gold-divider mt-3" />
            <p className="mt-5 text-base text-muted-foreground leading-relaxed">{a.description}</p>
          </div>
          <div>
            <h2 className="font-display font-bold text-2xl text-primary-deep">What's included</h2>
            <div className="gold-divider mt-3" />
            <ul className="mt-5 grid sm:grid-cols-2 gap-3 text-sm">
              {a.highlights.map((h: string) => <li key={h} className="flex gap-3"><Check className="h-4 w-4 text-accent mt-0.5 shrink-0" />{h}</li>)}
            </ul>
          </div>
          <div>
            <h2 className="font-display font-bold text-2xl text-primary-deep">What to bring</h2>
            <div className="gold-divider mt-3" />
            <ul className="mt-5 flex flex-wrap gap-2">
              {a.whatToBring.map((w: string) => <li key={w} className="text-xs px-3 py-1.5 rounded-full bg-accent-soft text-primary-deep">{w}</li>)}
            </ul>
          </div>
        </div>

        <aside className="lg:sticky lg:top-28 self-start">
          <div className="card-surface p-7 shadow-elegant">
            <div className="text-xs uppercase tracking-widest text-muted-foreground">From</div>
            <div className="font-display text-4xl font-bold text-primary-deep mt-1">${a.isOfferAvailable && a.offerPrice ? a.offerPrice : a.price}</div>
            <p className="text-xs text-muted-foreground mt-1">per person</p>
            <Link href={`/contact?subject=${encodeURIComponent(`Booking: ${a.title}`)}`} rel="nofollow" className="btn-primary flex items-center justify-center w-full mt-6 gap-2">Book this experience <ChevronRight className="h-4 w-4" /></Link>
            <Link href="/plan-form" className="btn-outline flex items-center justify-center w-full mt-3">Add to a custom tour</Link>
          </div>
        </aside>
      </section>
    </>
  );
}
