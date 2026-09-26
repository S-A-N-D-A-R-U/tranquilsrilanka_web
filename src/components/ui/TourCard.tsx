import Link from "next/link";
import CmsImage from "@/components/ui/CmsImage";
import { Clock, MapPin, Star, ArrowRight } from "lucide-react";
import type { Tour } from "@/data/types";

export default function TourCard({ tour }: { tour: Tour }) {
  return (
    <Link
      href={`/tours/${tour.slug || tour.id}`}
      className="group block card-surface overflow-hidden hover:shadow-elegant hover:-translate-y-1 transition-all duration-500"
    >
      <div className="relative h-56 overflow-hidden">
        <CmsImage src={tour.image} alt={tour.title} fill sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" className="object-cover group-hover:scale-110 transition-transform duration-[1200ms]" />
        <div className="absolute inset-0 bg-gradient-to-t from-primary-deep/70 via-transparent to-transparent" />

        {tour.linkedOffers && tour.linkedOffers.length > 0 ? (
          <span className="absolute top-3 right-3 bg-gradient-gold text-primary-foreground text-[11px] font-bold px-2.5 py-1 rounded-full shadow-gold">
            {tour.linkedOffers[0].discountBadge}
          </span>
        ) : tour.isOfferAvailable && tour.offerPercentage ? (
          <span className="absolute top-3 right-3 bg-gradient-gold text-primary-foreground text-[11px] font-bold px-2.5 py-1 rounded-full shadow-gold">
            -{tour.offerPercentage}% OFF
          </span>
        ) : null}
        {tour.isPopular && (
          <span className="absolute top-3 left-3 bg-primary-deep/90 text-accent text-[10px] font-semibold uppercase tracking-widest px-2.5 py-1 rounded-full backdrop-blur">
            Popular
          </span>
        )}
        <div className="absolute bottom-3 left-3 flex items-center gap-1.5 text-white text-xs">
          <MapPin className="h-3.5 w-3.5 text-accent" />
          <span className="font-medium">{tour.destinations.slice(0, 2).join(" • ")}</span>
        </div>
      </div>

      <div className="p-5">
        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
          <Clock className="h-3.5 w-3.5" /> <span>{tour.duration}</span>
          <span className="mx-1.5 text-border">|</span>
          <Star className="h-3.5 w-3.5 fill-accent text-accent" />
          <span className="text-foreground font-medium">{tour.rating.toFixed(1)}</span>
          <span>({tour.reviews})</span>
        </div>
        <h3 className="font-display text-lg font-semibold text-primary-deep group-hover:text-primary transition leading-snug line-clamp-2">{tour.title}</h3>
        <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{tour.overview}</p>

        <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
          <div>
            <span className="text-xs text-muted-foreground">From</span>
            <div className="flex items-baseline gap-2">
              <span className="font-display text-2xl font-bold text-primary-deep">${tour.price}</span>
              {tour.originalPrice && <span className="text-xs text-muted-foreground line-through">${tour.originalPrice}</span>}
            </div>
          </div>
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary group-hover:text-accent transition">
            Explore <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition" />
          </span>
        </div>
      </div>
    </Link>
  );
}