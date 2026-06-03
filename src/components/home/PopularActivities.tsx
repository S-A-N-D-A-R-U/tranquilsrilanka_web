import Link from "next/link";
import SectionHeader from "@/components/ui/SectionHeader";
import ActivityCard from "@/components/ui/ActivityCard";
import type { Activity } from "@/data/types";

export default function PopularActivities({ activities }: { activities: Activity[] }) {
  const list = [...activities].sort((a, b) => Number(b.isPopular) - Number(a.isPopular)).slice(0, 8);
  return (
    <section className="bg-primary-deep text-primary-foreground section-y relative overflow-hidden">
      <div className="absolute inset-0 bg-grain opacity-40 pointer-events-none" />
      <div className="container-page relative">
        <SectionHeader
          invert
          eyebrow="Top Experiences"
          title={<>Unforgettable <span className="italic text-accent">things to do</span></>}
          subtitle="Curated experiences that turn a holiday into the trip of a lifetime."
        />
        <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {list.map((a) => <ActivityCard key={a.id} activity={a} />)}
        </div>
        <div className="mt-12 text-center">
          <Link href="/things-to-do" className="btn-gold">View all experiences</Link>
        </div>
      </div>
    </section>
  );
}