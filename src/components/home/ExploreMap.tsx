"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { MapPin, Clock, Star, ChevronRight, Compass } from "lucide-react";
import { mapPaths } from "./SriLankaPaths";
import type { Tour, Activity } from "@/data/types";
import SectionHeader from "@/components/ui/SectionHeader";

type Region = {
  id: string;
  name: string;
  tagline: string;
  /** percentage coordinates inside the SVG viewBox (0–100) */
  x: number;
  y: number;
  /** Destination keywords used to match tours & activities (lowercase) */
  match: string[];
};

const REGIONS: Region[] = [
  { id: "cultural-triangle", name: "Cultural Triangle", tagline: "Ancient kingdoms & lion rocks", x: 235, y: 310, match: ["sigiriya", "dambulla", "polonnaruwa", "anuradhapura", "habarana"] },
  { id: "hill-country", name: "Hill Country", tagline: "Tea plantations & misty peaks", x: 235, y: 490, match: ["kandy", "nuwara eliya", "ella", "hill country", "kitulgala", "haputale"] },
  { id: "south-coast", name: "South Coast", tagline: "Golden beaches & Galle Fort", x: 180, y: 710, match: ["galle", "mirissa", "bentota", "koggala", "hikkaduwa", "weligama", "unawatuna"] },
  { id: "west-coast", name: "West Coast", tagline: "Gateway shores & Colombo", x: 110, y: 520, match: ["negombo", "colombo", "wadduwa"] },
  { id: "wildlife-south", name: "Wildlife South", tagline: "Leopards & elephant herds", x: 330, y: 620, match: ["yala", "udawalawe", "tissamaharama"] },
  { id: "east-coast", name: "East Coast", tagline: "Surf breaks & turquoise bays", x: 350, y: 340, match: ["arugam bay", "batticaloa", "trincomalee", "pasikuda"] },
  { id: "north", name: "Northern Sri Lanka", tagline: "Jaffna culture & untouched isles", x: 190, y: 90, match: ["jaffna", "mannar"] },
];

function matchesRegion(dests: string[], region: Region) {
  const hay = dests.join(" ").toLowerCase();
  return region.match.some((k) => hay.includes(k));
}

export default function ExploreMap({ tours, activities }: { tours: Tour[]; activities: Activity[] }) {
  const [activeId, setActiveId] = useState<string>("cultural-triangle");
  const active = REGIONS.find((r) => r.id === activeId)!;

  const { regionTours, regionActivities } = useMemo(() => {
    const t = tours.filter((tr) => matchesRegion(tr.destinations, active)).slice(0, 3);
    const a = activities.filter((ac) => matchesRegion([ac.destination], active)).slice(0, 4);
    return { regionTours: t, regionActivities: a };
  }, [active]);

  return (
    <section className="section-y bg-gradient-to-b from-background to-sand/40">
      <div className="container-page">
        <SectionHeader
          eyebrow="Explore the island"
          title={<>Where will your story <span className="italic text-accent">begin</span>?</>}
          subtitle="Tap a region to discover handpicked tours and unforgettable experiences."
        />

        <div className="mt-14 grid lg:grid-cols-[1.05fr_1fr] gap-10 lg:gap-14 items-start">
          {/* Map */}
          <div className="relative min-w-0">
            <div className="relative rounded-3xl bg-gradient-to-br from-primary-deep via-primary to-primary-glow p-6 sm:p-10 shadow-elegant overflow-hidden">
              {/* decorative grain */}
              <div className="absolute inset-0 opacity-[0.07] bg-grain pointer-events-none" />
              {/* compass */}
              <div className="absolute top-5 right-5 text-primary-foreground/60 hidden sm:flex items-center gap-2 text-[10px] uppercase tracking-[0.25em]">
                <Compass className="h-4 w-4" /> N
              </div>

              <div className="relative aspect-[3/4] max-w-[460px] mx-auto">
                <svg viewBox="0 0 450 793" className="absolute inset-0 h-full w-full drop-shadow-[0_10px_30px_rgba(0,0,0,0.35)]" aria-label="Map of Sri Lanka">
                  {/* Stylised Sri Lanka silhouette */}
                  <defs>
                    <linearGradient id="island" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor="hsl(205 95% 75%)" />
                      <stop offset="100%" stopColor="hsl(205 95% 55%)" />
                    </linearGradient>
                  </defs>
                  <g fill="url(#island)" stroke="hsl(210 40% 99%)" strokeWidth="2.5" opacity="0.95" strokeLinejoin="round">
                    {mapPaths.map((d) => (
                      <path key={d.id} d={d.path} />
                    ))}
                  </g>
                  {/* Region pins */}
                  {REGIONS.map((r) => {
                    const isActive = r.id === activeId;
                    return (
                      <g
                        key={r.id}
                        transform={`translate(${r.x} ${r.y})`}
                        className="cursor-pointer"
                        onMouseEnter={() => setActiveId(r.id)}
                        onClick={() => setActiveId(r.id)}
                      >
                        {isActive && (
                          <circle r="25" fill="hsl(210 40% 99%)" opacity="0.25">
                            <animate attributeName="r" values="15;35;15" dur="2.2s" repeatCount="indefinite" />
                            <animate attributeName="opacity" values="0.45;0;0.45" dur="2.2s" repeatCount="indefinite" />
                          </circle>
                        )}
                        <circle
                          r={isActive ? 14 : 10}
                          fill={isActive ? "hsl(210 40% 99%)" : "hsl(215 100% 12%)"}
                          stroke="hsl(210 40% 99%)"
                          strokeWidth={isActive ? 4 : 2.5}
                          className="transition-all"
                        />
                        <title>{r.name}</title>
                      </g>
                    );
                  })}
                </svg>
              </div>

              {/* Region chips */}
              <div className="relative mt-8 flex flex-wrap gap-2 justify-center">
                {REGIONS.map((r) => {
                  const isActive = r.id === activeId;
                  return (
                    <button
                      key={r.id}
                      type="button"
                      onMouseEnter={() => setActiveId(r.id)}
                      onClick={() => setActiveId(r.id)}
                      className={`text-[11px] font-semibold uppercase tracking-[0.15em] rounded-full px-3 py-1.5 transition-all
                        ${isActive
                          ? "bg-accent text-accent-foreground shadow-soft"
                          : "bg-white/10 text-primary-foreground/80 ring-1 ring-white/20 hover:bg-white/20"}`}
                    >
                      {r.name}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Detail panel */}
          <div className="relative min-w-0">
            <div key={active.id} className="card-surface p-6 sm:p-8 animate-in fade-in slide-in-from-bottom-3 duration-500">
              <div className="flex items-start gap-3">
                <span className="grid place-items-center h-11 w-11 rounded-full bg-accent-soft text-accent shrink-0">
                  <MapPin className="h-5 w-5" />
                </span>
                <div>
                  <p className="eyebrow !text-accent">Region focus</p>
                  <h3 className="font-display text-2xl sm:text-3xl font-bold text-primary-deep mt-1 leading-tight">
                    {active.name}
                  </h3>
                  <p className="text-muted-foreground mt-1">{active.tagline}</p>
                </div>
              </div>

              {/* Tours */}
              <div className="mt-8">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-xs uppercase tracking-[0.2em] text-primary font-semibold">Featured tours</h4>
                  <Link href="/tours" className="text-xs text-accent link-underline">View all</Link>
                </div>
                {regionTours.length === 0 ? (
                  <p className="text-sm text-muted-foreground italic">New itineraries launching soon for this region.</p>
                ) : (
                  <ul className="space-y-3">
                    {regionTours.map((t) => (
                      <li key={t.id}>
                        <Link href={`/tours/${t.slug || t.id}`}
                          className="group flex gap-3 items-center rounded-2xl border border-border/70 p-2.5 hover:border-accent/60 hover:shadow-soft transition-all"
                        >
                          <img src={t.image} alt={t.title} loading="lazy" decoding="async" className="h-16 w-20 rounded-xl object-cover" />
                          <div className="min-w-0 flex-1">
                            <p className="font-semibold text-primary-deep truncate group-hover:text-accent transition-colors">{t.title}</p>
                            <div className="flex items-center gap-3 mt-1 text-[11px] text-muted-foreground">
                              <span className="inline-flex items-center gap-1"><Clock className="h-3 w-3" />{t.duration}</span>
                              <span className="inline-flex items-center gap-1"><Star className="h-3 w-3 fill-accent text-accent" />{t.rating}</span>
                            </div>
                          </div>
                          <div className="text-right shrink-0">
                            <div className="text-[10px] uppercase tracking-widest text-muted-foreground">From</div>
                            <div className="font-display font-bold text-primary-deep">${t.price}</div>
                          </div>
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Activities */}
              <div className="mt-8">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-xs uppercase tracking-[0.2em] text-primary font-semibold">Things to do</h4>
                  <Link href="/things-to-do" className="text-xs text-accent link-underline">All activities</Link>
                </div>
                {regionActivities.length === 0 ? (
                  <p className="text-sm text-muted-foreground italic">More experiences coming to this region.</p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {regionActivities.map((a) => (
                      <Link
                        key={a.id}
                        href={`/activities/${a.slug || a.id}`}
                        className="inline-flex items-center gap-2 rounded-full bg-sand/70 hover:bg-accent hover:text-accent-foreground text-primary-deep px-3 py-1.5 text-xs font-medium transition-all"
                      >
                        {a.title}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <Link href="/plan-form"
                className="btn-primary mt-8 w-full sm:w-auto"
              >
                Plan a trip to {active.name} <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}