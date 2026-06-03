import Link from "next/link";
import { Clock, MapPin } from "lucide-react";
import type { Activity } from "@/data/types";

export default function ActivityCard({ activity }: { activity: Activity }) {
  return (
    <Link href={`/activities/${activity.id}`} className="group block card-surface overflow-hidden hover:shadow-elegant hover:-translate-y-1 transition-all duration-500">
      <div className="relative h-52 overflow-hidden">
        <img src={activity.image} alt={activity.title} className="absolute inset-0 h-full w-full object-cover group-hover:scale-110 transition-transform duration-[1200ms]" loading="lazy" />
        <div className="absolute inset-0 bg-gradient-to-t from-primary-deep/60 via-transparent to-transparent" />
        <span className="absolute top-3 left-3 bg-white/95 text-primary-deep text-[11px] font-semibold px-2.5 py-1 rounded-full">
          {activity.category}
        </span>
      </div>
      <div className="p-5">
        <h3 className="font-display text-base font-semibold text-primary-deep group-hover:text-primary transition leading-snug line-clamp-2">{activity.title}</h3>
        <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1"><MapPin className="h-3.5 w-3.5 text-accent" />{activity.destination}</span>
          <span className="inline-flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{activity.duration}</span>
        </div>
        <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
          <div>
            <span className="text-xs text-muted-foreground">From</span>
            <div className="flex items-baseline gap-1">
              {activity.isOfferAvailable && activity.offerPrice ? (
                <>
                  <span className="font-display text-xl font-bold text-primary-deep">${activity.offerPrice}</span>
                  <span className="text-xs text-muted-foreground line-through">${activity.price}</span>
                </>
              ) : (
                <span className="font-display text-xl font-bold text-primary-deep">${activity.price}</span>
              )}
            </div>
          </div>
          <span className="text-xs font-semibold text-primary group-hover:text-accent">View Details →</span>
        </div>
      </div>
    </Link>
  );
}