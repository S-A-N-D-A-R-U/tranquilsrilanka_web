
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us — Family-Owned Tour Operator in Kandy",
  description: "Meet Tranquil Sri Lanka, a family-owned travel company in Kandy crafting private, tailor-made Sri Lanka tours with expert local chauffeur-guides for over 10 years.",
  alternates: { canonical: "/about" },
};

import Link from "next/link";
import { Star, Users, Map, Award, Check, ChevronRight } from "lucide-react";
import PageHero from "@/components/ui/PageHero";
import SectionHeader from "@/components/ui/SectionHeader";

const stats = [
  { Icon: Star, n: "10+", l: "Years of Excellence" },
  { Icon: Users, n: "500+", l: "Happy Travellers" },
  { Icon: Map, n: "50+", l: "Tour Packages" },
  { Icon: Award, n: "4.9/5", l: "Customer Rating" },
];

const values = [
  { t: "Expert Local Guides", d: "Our guides are passionate Sri Lankans with deep knowledge of every destination, culture and hidden gem." },
  { t: "Tailor-made Itineraries", d: "No two journeys are the same. We tailor every trip to your interests, pace and budget." },
  { t: "24/7 Support", d: "From the moment you enquire to the day you fly home — we're a phone call away." },
  { t: "Responsible Tourism", d: "We partner with eco-friendly stays and community-based experiences to protect Sri Lanka's beauty." },
];

const team = [
  { name: "Sudesh Priyadarshana", role: "Founder & Lead Guide", img: "/team1.webp" }
];

export default function About() {
  return (
    <>
      <PageHero image="/about_hero.webp" eyebrow="Our Story" title="About Tranquil Sri Lanka" subtitle="A family-owned travel atelier sharing the magic of the Pearl of the Indian Ocean." />

      <section className="container-page mt-12 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          {stats.map(({ Icon, n, l }) => (
            <div key={l} className="card-surface p-5 text-center">
              <span className="inline-grid place-items-center h-10 w-10 rounded-full bg-accent-soft text-accent mb-2"><Icon className="h-5 w-5" /></span>
              <div className="font-display text-2xl font-bold text-primary-deep">{n}</div>
              <div className="text-[11px] uppercase tracking-widest text-muted-foreground mt-1">{l}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="container-page section-y grid lg:grid-cols-2 gap-14 items-center">
        <div className="relative">
          <img src="/tranquil-group-tour.webp" alt="Happy travellers with the Tranquil Sri Lanka team on a south coast beach" className="rounded-3xl shadow-elegant w-full h-[500px] object-cover" />
          <div className="absolute -bottom-6 -right-6 bg-primary-deep text-primary-foreground p-5 rounded-2xl shadow-elegant">
            <div className="text-3xl font-display font-bold text-accent">10+</div>
            <div className="text-xs uppercase tracking-widest mt-1">Years</div>
          </div>
        </div>
        <div>
          <p className="eyebrow">Who we are</p>
          <h2 className="mt-4 font-display font-bold text-3xl sm:text-4xl text-primary-deep leading-tight">Your trusted travel partner in Sri Lanka</h2>
          <div className="gold-divider mt-6" />
          <p className="mt-6 text-muted-foreground leading-relaxed">
            Founded over a decade ago in Kandy, Tranquil Sri Lanka was born from a simple belief — that every
            traveller deserves an authentic, memorable and stress-free journey.
          </p>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            We're a passionate team of local travel experts, storytellers and adventurers who live and breathe
            Sri Lanka. From the misty hill country to the golden southern shores, we know every road, temple and
            hidden waterfall.
          </p>
          <div className="mt-8 space-y-4">
            {values.map((v) => (
              <div key={v.t} className="flex items-start gap-4">
                <span className="grid place-items-center h-9 w-9 rounded-full bg-accent-soft text-accent shrink-0"><Check className="h-4 w-4" /></span>
                <div><h3 className="font-semibold text-primary-deep">{v.t}</h3><p className="text-sm text-muted-foreground">{v.d}</p></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-sand/40 section-y">
        <div className="container-page">
          <SectionHeader eyebrow="Meet the team" title={<>The faces behind your <span className="italic text-accent">journey</span></>} />
          <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((m) => (
              <div key={m.name} className="text-center group">
                <div className="relative rounded-3xl overflow-hidden mb-4 aspect-[4/5]">
                  <img src={m.img} alt={m.name} className="absolute inset-0 h-full w-full object-cover group-hover:scale-105 transition-transform duration-[1000ms]" />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary-deep/40 to-transparent" />
                </div>
                <h3 className="font-display text-lg font-semibold text-primary-deep">{m.name}</h3>
                <p className="text-xs uppercase tracking-widest text-accent mt-1">{m.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gradient-emerald section-y-sm text-primary-foreground text-center">
        <div className="container-page">
          <h2 className="font-display text-3xl font-bold">Ready to explore Sri Lanka?</h2>
          <p className="mt-3 text-primary-foreground/80 max-w-xl mx-auto">Let us craft your perfect Sri Lankan adventure.</p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/tours" className="btn-gold">Browse tours <ChevronRight className="h-4 w-4" /></Link>
            <Link href="/contact" className="btn-ghost">Contact us</Link>
          </div>
        </div>
      </section>
    </>
  );
}