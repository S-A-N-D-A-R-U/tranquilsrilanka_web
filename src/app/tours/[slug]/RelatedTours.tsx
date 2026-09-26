"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import TourCard from "@/components/ui/TourCard";
import type { TourCardData } from "@/data/types";
import type { RelatedFilter, RelatedTourLists } from "./relatedToursData";

const filterTabs: { id: RelatedFilter; label: string; icon: string }[] = [
  { id: "day", label: "Day Tours", icon: "☀️" },
  { id: "round", label: "Round Tours", icon: "🗺️" },
  { id: "special", label: "Special Activities", icon: "✨" },
];

type Props = {
  lists: RelatedTourLists;
  initialFilter: RelatedFilter;
};

export default function RelatedTours({ lists, initialFilter }: Props) {
  const [relatedFilter, setRelatedFilter] = useState<RelatedFilter>(initialFilter);
  const byId = new Map(lists.cards.map((t) => [t.id, t]));
  const related = lists.tabs[relatedFilter].map((id) => byId.get(id)).filter((t): t is TourCardData => !!t);

  const scrollerRef = useRef<HTMLDivElement>(null);
  const scrollBy = (dir: number) => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * (el.clientWidth * 0.8), behavior: "smooth" });
  };

  return (
    <section className="border-t border-border bg-background">
      <div className="container-page section-y">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-8">
          <div>
            <span className="eyebrow">You may also like</span>
            <h2 className="font-display font-bold text-3xl md:text-4xl text-primary-deep mt-2">Related Tours</h2>
            <p className="text-muted-foreground mt-2 max-w-xl">Hand-picked journeys that share the spirit of this experience.</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label="Previous"
              onClick={() => scrollBy(-1)}
              className="hidden md:grid h-11 w-11 rounded-full border border-border bg-card text-primary-deep place-items-center hover:bg-primary hover:text-primary-foreground hover:border-primary transition shadow-soft"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              aria-label="Next"
              onClick={() => scrollBy(1)}
              className="hidden md:grid h-11 w-11 rounded-full border border-border bg-card text-primary-deep place-items-center hover:bg-primary hover:text-primary-foreground hover:border-primary transition shadow-soft"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Filter toggle */}
        <div className="flex flex-wrap gap-2 mb-8">
          {filterTabs.map((tab) => {
            const active = relatedFilter === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                aria-pressed={active}
                onClick={() => setRelatedFilter(tab.id)}
                className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 border ${
                  active
                    ? "bg-primary text-primary-foreground border-primary shadow-soft"
                    : "bg-card text-primary-deep border-border hover:border-primary hover:text-primary"
                }`}
              >
                <span className="text-base">{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {related.length === 0 ? (
          <div className="card-surface p-10 text-center text-muted-foreground">
            No related tours found in this category.
          </div>
        ) : (
          <div
            ref={scrollerRef}
            className="flex gap-6 overflow-x-auto snap-x snap-mandatory pb-4 -mx-4 px-4 scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {related.map((t) => (
              <div
                key={t.id}
                className="snap-start flex-shrink-0 w-[85%] sm:w-[55%] md:w-[42%] lg:w-[32%]"
              >
                <TourCard tour={t} />
              </div>
            ))}
          </div>
        )}

        <div className="mt-8 text-center">
          <Link href="/tours" className="btn-outline inline-flex">
            View All Tours <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
