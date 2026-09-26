import type { Tour, TourCardData } from "@/data/types";
import { truncate } from "@/lib/seo";

export type RelatedFilter = "day" | "round" | "special";

const LIMIT = 6;

const isSpecial = (t: Tour) =>
  t.categories.some((c) => /special|adventure|honeymoon|wildlife|luxur/i.test(c)) || !!t.isPopular;

function toCard(t: Tour): TourCardData {
  return {
    id: t.id,
    slug: t.slug,
    type: t.type,
    title: t.title,
    image: t.image,
    duration: t.duration,
    destinations: t.destinations,
    categories: t.categories,
    price: t.price,
    originalPrice: t.originalPrice,
    isOfferAvailable: t.isOfferAvailable,
    offerPercentage: t.offerPercentage,
    rating: t.rating,
    reviews: t.reviews,
    isPopular: t.isPopular,
    // Cards clamp to two lines, so the full overview is never needed
    overview: truncate(t.overview ?? "", 180),
    linkedOffers: t.linkedOffers?.map((o) => ({ discountBadge: o.discountBadge })),
  };
}

export type RelatedTourLists = {
  /** Each tour once, even if it appears in several tabs */
  cards: TourCardData[];
  /** Tour ids to show per tab, in order */
  tabs: Record<RelatedFilter, string[]>;
};

/**
 * Up to six related tours per tab, ranked by shared categories. Falls back to
 * any other tour when a tab has no matches, so the section is never empty.
 */
export function buildRelatedTours(tour: Tour, tours: Tour[]): RelatedTourLists {
  const others = tours.filter((t) => t.id !== tour.id);

  const rank = (pool: Tour[]) => {
    const scored = pool
      .map((t) => ({ t, score: t.categories.filter((c) => tour.categories.includes(c)).length }))
      .sort((a, b) => b.score - a.score)
      .map((x) => x.t);
    const list = scored.length ? scored : others;
    return list.slice(0, LIMIT);
  };

  const ranked = {
    day: rank(others.filter((t) => t.type === "day")),
    round: rank(others.filter((t) => t.type === "round")),
    special: rank(others.filter(isSpecial)),
  };

  const unique = new Map<string, Tour>();
  for (const t of [...ranked.day, ...ranked.round, ...ranked.special]) unique.set(t.id, t);

  return {
    cards: [...unique.values()].map(toCard),
    tabs: {
      day: ranked.day.map((t) => t.id),
      round: ranked.round.map((t) => t.id),
      special: ranked.special.map((t) => t.id),
    },
  };
}
