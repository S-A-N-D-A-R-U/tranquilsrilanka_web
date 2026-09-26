"use client";
import { useMemo, useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { Search, X } from "lucide-react";
import PageHero from "@/components/ui/PageHero";
import TourCard from "@/components/ui/TourCard";
import type { Tour } from "@/data/types";

const durations = ["1 Day", "2-3 Days", "4-7 Days", "8-14 Days", "15+ Days"];

const inDuration = (filter: string, dur: string) => {
  if (!filter) return true;
  if (filter === "1 Day") return /^1 Day/i.test(dur);
  const m = dur.match(/(\d+)/); if (!m) return true;
  const d = parseInt(m[1], 10);
  if (filter === "2-3 Days") return d >= 2 && d <= 3;
  if (filter === "4-7 Days") return d >= 4 && d <= 7;
  if (filter === "8-14 Days") return d >= 8 && d <= 14;
  if (filter === "15+ Days") return d >= 15;
  return true;
};

function ToursContent({ tours }: { tours: Tour[] }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [tab, setTab] = useState<"round" | "day">((searchParams.get("type") as "round" | "day") || "round");
  const [q, setQ] = useState("");
  const [loc, setLoc] = useState("");
  const [cat, setCat] = useState(searchParams.get("category") || "");
  const [dur, setDur] = useState("");
  const [sort, setSort] = useState<"popular" | "price-asc" | "price-desc" | "rating">("popular");
  const [maxPrice, setMaxPrice] = useState<number>(0);

  useEffect(() => {
    const next = new URLSearchParams(Array.from(searchParams.entries()));
    next.set("type", tab);
    if (cat) next.set("category", cat); else next.delete("category");
    router.replace(`${pathname}?${next.toString()}`, { scroll: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab, cat, pathname, router]);

  const list = tours.filter((t) => t.type === tab);
  const locations = useMemo(() => Array.from(new Set(list.flatMap((t) => t.destinations))), [list]);
  const categories = useMemo(() => Array.from(new Set(list.flatMap((t) => t.categories))), [list]);
  const priceCeiling = useMemo(() => Math.ceil(Math.max(...list.map((t) => t.price), 100) / 50) * 50, [list]);
  const effectiveMax = maxPrice || priceCeiling;

  const filtered = list.filter((t) => {
    if (q && !`${t.title} ${t.overview}`.toLowerCase().includes(q.toLowerCase())) return false;
    if (loc && !t.destinations.includes(loc)) return false;
    if (cat && !t.categories.some((c) => c.toLowerCase() === cat.toLowerCase())) return false;
    if (!inDuration(dur, t.duration)) return false;
    if (t.price > effectiveMax) return false;
    return true;
  });

  const sorted = useMemo(() => {
    const copy = [...filtered];
    if (sort === "price-asc") copy.sort((a, b) => a.price - b.price);
    else if (sort === "price-desc") copy.sort((a, b) => b.price - a.price);
    else if (sort === "rating") copy.sort((a, b) => b.rating - a.rating);
    else copy.sort((a, b) => Number(!!b.isPopular) - Number(!!a.isPopular) || b.reviews - a.reviews);
    return copy;
  }, [filtered, sort]);

  const clear = () => { setQ(""); setLoc(""); setCat(""); setDur(""); setMaxPrice(0); setSort("popular"); };
  const hasFilters = q || loc || cat || dur || maxPrice;

  return (
    <>
      <PageHero
        image="/tour_hero.webp"
        eyebrow="Curated Itineraries"
        title={tab === "round" ? "Round Tours of Sri Lanka" : "Day Tours & Excursions"}
        subtitle={tab === "round" ? "Multi-day journeys handcrafted by local experts." : "Make every day count with our single-day excursions."}
      />

      <section className="container-page mt-16 relative z-10">
        <div className="card-surface p-5 sm:p-7 shadow-elegant">
          <div className="flex items-center justify-between gap-3 mb-5 flex-wrap">
            <div className="inline-flex bg-muted rounded-full p-1">
              {(["round", "day"] as const).map((k) => (
                <button
                  key={k}
                  onClick={() => setTab(k)}
                  className={`px-5 py-2 text-sm font-semibold rounded-full transition ${
                    tab === k ? "bg-primary text-primary-foreground shadow-soft" : "text-muted-foreground hover:text-primary"
                  }`}
                >
                  {k === "round" ? "Round Tours" : "Day Tours"}
                </button>
              ))}
            </div>
            {hasFilters && (
              <button onClick={clear} className="text-xs font-medium text-accent hover:text-primary flex items-center gap-1.5">
                <X className="h-3.5 w-3.5" /> Clear filters
              </button>
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="relative col-span-1 sm:col-span-2 lg:col-span-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search tours…" className="w-full pl-10 pr-4 py-3 rounded-xl bg-muted text-sm focus:outline-none focus:ring-2 focus:ring-accent" />
            </div>
            <select value={loc} onChange={(e) => setLoc(e.target.value)} className="px-4 py-3 rounded-xl bg-muted text-sm focus:outline-none focus:ring-2 focus:ring-accent">
              <option value="">All destinations</option>
              {locations.map((l) => <option key={l} value={l}>{l}</option>)}
            </select>
            <select value={cat} onChange={(e) => setCat(e.target.value)} className="px-4 py-3 rounded-xl bg-muted text-sm focus:outline-none focus:ring-2 focus:ring-accent">
              <option value="">All themes</option>
              {categories.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            <select value={dur} onChange={(e) => setDur(e.target.value)} className="px-4 py-3 rounded-xl bg-muted text-sm focus:outline-none focus:ring-2 focus:ring-accent">
              <option value="">Any duration</option>
              {durations.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pt-4 border-t border-border/60">
            <div className="flex items-center gap-3">
              <label className="text-xs uppercase tracking-widest font-semibold text-primary-deep whitespace-nowrap">Max price</label>
              <input
                type="range"
                min={50}
                max={priceCeiling}
                step={50}
                value={effectiveMax}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="flex-1 accent-primary"
              />
              <span className="text-sm font-semibold text-primary-deep w-20 text-right">${effectiveMax}</span>
            </div>
            <div className="flex items-center gap-3 justify-start md:justify-end">
              <label className="text-xs uppercase tracking-widest font-semibold text-primary-deep">Sort</label>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as typeof sort)}
                className="px-4 py-2.5 rounded-xl bg-muted text-sm focus:outline-none focus:ring-2 focus:ring-accent"
              >
                <option value="popular">Most popular</option>
                <option value="rating">Top rated</option>
                <option value="price-asc">Price: low to high</option>
                <option value="price-desc">Price: high to low</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      <section className="container-page section-y">
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-muted-foreground">
            <span className="font-semibold text-primary-deep">{sorted.length}</span> {tab === "round" ? "round" : "day"} tours
          </p>
        </div>
        {sorted.length ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-7">
            {sorted.map((t) => <TourCard key={t.id} tour={t} />)}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-lg text-muted-foreground">No tours match your filters.</p>
            <button onClick={clear} className="btn-primary mt-5">Clear filters</button>
          </div>
        )}
      </section>
    </>
  );
}

export default function ToursClient({ tours }: { tours: Tour[] }) {
  return (
    <Suspense fallback={<div className="min-h-screen grid place-items-center"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>}>
      <ToursContent tours={tours} />
    </Suspense>
  );
}
