
import { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Seat-in-Coach Group Tours in Sri Lanka",
  description: "Affordable seat-in-coach group tours across Sri Lanka — daily departures, English-speaking guides, air-conditioned coaches and hotel pickup from major cities.",
  alternates: { canonical: "/seat-in-coach" },
};

import Link from "next/link";
import { Check, Users, Clock, MapPin } from "lucide-react";
import PageHero from "@/components/ui/PageHero";
import SectionHeader from "@/components/ui/SectionHeader";

const benefits = [
  "Daily departures to popular destinations",
  "Professional English-speaking guides",
  "Meet and connect with fellow travellers",
  "Budget-friendly, transparent pricing",
  "Modern, air-conditioned coaches",
  "Hotel pickup from major cities",
];

const routes = [
  { name: "Cultural Triangle", route: "Colombo → Sigiriya → Polonnaruwa → Dambulla", days: "3 days", price: 195 },
  { name: "Southern Highlights", route: "Colombo → Galle → Mirissa → Yala", days: "3 days", price: 175 },
  { name: "Hill Country", route: "Colombo → Nuwara Eliya → Ella", days: "3 days", price: 185 },
  { name: "Best of Sri Lanka", route: "Colombo → Sigiriya → Kandy → Ella → Yala → Galle", days: "7 days", price: 480 },
];

export default function SeatInCoach() {
  return (
    <>
      <PageHero image="/seat-in-coach.webp" eyebrow="Group Tours" title="Seat-in-Coach Tours" subtitle="Affordable, comfortable group adventures across Sri Lanka." />

      <section className="container-page section-y grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <p className="eyebrow">What is Seat in Coach?</p>
          <h2 className="mt-4 font-display font-bold text-3xl sm:text-4xl text-primary-deep leading-tight">Travel together. Travel for less.</h2>
          <div className="gold-divider mt-6" />
          <p className="mt-6 text-muted-foreground leading-relaxed">
            Seat in Coach (SIC) tours are shared group transfers and excursions — perfect for solo travellers,
            couples or small groups who want to explore Sri Lanka affordably while meeting new friends along the way.
          </p>
          <ul className="mt-8 grid sm:grid-cols-2 gap-3 text-sm">
            {benefits.map((b) => <li key={b} className="flex gap-3"><Check className="h-4 w-4 text-accent mt-0.5 shrink-0" />{b}</li>)}
          </ul>
          <Link href="/contact" className="btn-primary mt-10">Reserve your seat</Link>
        </div>
        <div className="relative">
          <Image src="/Image_group_tour.webp" alt="Seat-in-coach group tour travellers in Sri Lanka" width={1024} height={1024} sizes="(min-width: 1024px) 50vw, 100vw" className="rounded-3xl shadow-elegant w-full h-auto object-cover" />
          <div className="absolute -bottom-6 -left-6 bg-accent text-primary-deep p-5 rounded-2xl shadow-elegant max-w-[200px]">
            <div className="font-display text-3xl font-bold">$65<span className="text-base">/day</span></div>
            <div className="text-xs uppercase tracking-widest mt-1">Average price per traveller</div>
          </div>
        </div>
      </section>

      <section className="bg-sand/40 section-y">
        <div className="container-page">
          <SectionHeader eyebrow="Sample Routes" title={<>Choose your <span className="italic text-accent">adventure</span></>} />
          <div className="mt-12 grid sm:grid-cols-2 gap-5">
            {routes.map((r) => (
              <div key={r.name} className="card-surface p-7 hover:shadow-elegant transition">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-display text-xl font-semibold text-primary-deep">{r.name}</h3>
                    <div className="text-sm text-muted-foreground mt-2 flex items-start gap-2"><MapPin className="h-4 w-4 text-accent mt-0.5 shrink-0" />{r.route}</div>
                    <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="inline-flex items-center gap-1"><Clock className="h-3 w-3 text-accent" /> {r.days}</span>
                      <span className="inline-flex items-center gap-1"><Users className="h-3 w-3 text-accent" /> Min 4 pax</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] uppercase tracking-widest text-muted-foreground">From</div>
                    <div className="font-display text-2xl font-bold text-accent">${r.price}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}