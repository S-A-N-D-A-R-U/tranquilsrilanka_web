"use client";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import PageHero from "@/components/ui/PageHero";
import ActivityCard from "@/components/ui/ActivityCard";
import type { Activity } from "@/data/types";

export default function ThingsToDoClient({ activities }: { activities: Activity[] }) {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("All");
  const [dest, setDest] = useState("All");

  const cats = useMemo(() => ["All", ...Array.from(new Set(activities.map((a) => a.category)))], [activities]);
  const dests = useMemo(() => ["All", ...Array.from(new Set(activities.map((a) => a.destination)))], [activities]);

  const list = activities.filter((a) => {
    if (q && !`${a.title} ${a.shortDescription}`.toLowerCase().includes(q.toLowerCase())) return false;
    if (cat !== "All" && a.category !== cat) return false;
    if (dest !== "All" && a.destination !== dest) return false;
    return true;
  });

  return (
    <>
      <PageHero
        image="/things-to-do.jpg"
        eyebrow="Things to Do"
        title="Experiences across the island"
        subtitle="From whale watching to tea tasting — Sri Lanka is endlessly surprising."
      />

      <section className="container-page mt-16 relative z-10">
        <div className="card-surface p-5 sm:p-7 shadow-elegant grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search experiences…" className="w-full pl-10 pr-4 py-3 rounded-xl bg-muted text-sm focus:outline-none focus:ring-2 focus:ring-accent" />
          </div>
          <select value={cat} onChange={(e) => setCat(e.target.value)} className="px-4 py-3 rounded-xl bg-muted text-sm focus:outline-none focus:ring-2 focus:ring-accent">
            {cats.map((c) => <option key={c}>{c}</option>)}
          </select>
          <select value={dest} onChange={(e) => setDest(e.target.value)} className="px-4 py-3 rounded-xl bg-muted text-sm focus:outline-none focus:ring-2 focus:ring-accent">
            {dests.map((d) => <option key={d}>{d}</option>)}
          </select>
        </div>
      </section>

      <section className="container-page section-y">
        {list.length ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {list.map((a) => <ActivityCard key={a.id} activity={a} />)}
          </div>
        ) : (
          <p className="text-center text-muted-foreground py-20">No activities match your filters.</p>
        )}
      </section>
    </>
  );
}
