
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Everything you need to know",
  description: "Discover Sri Lanka",
};

import { Plane, Calendar, DollarSign, Languages, Wifi, Car, Utensils } from "lucide-react";
import PageHero from "@/components/ui/PageHero";
import SectionHeader from "@/components/ui/SectionHeader";

const essentials = [
  { Icon: Plane, t: "Getting There", d: "Bandaranaike Int'l Airport (CMB) is the main hub. Direct flights from Asia, Europe and the Middle East." },
  { Icon: Calendar, t: "Best Time", d: "Dec–Mar for the south & west. Apr–Sep for the east coast. Hill country is glorious year-round." },
  { Icon: DollarSign, t: "Currency", d: "Sri Lankan Rupee (LKR). USD widely accepted. ATMs in cities, cards in hotels." },
  { Icon: Languages, t: "Languages", d: "Sinhala and Tamil are official. English is widely spoken in tourist areas." },
  { Icon: Wifi, t: "Connectivity", d: "4G nationwide. Local SIMs at the airport. Free WiFi in hotels and cafés." },
  { Icon: Car, t: "Getting Around", d: "Private chauffeur is the easiest. Tuk-tuks for short hops. Trains for the hills." },
];

const seasons = [
  { name: "Dry Season", period: "December — April", t: "25–30°C", r: "Minimal", h: "Moderate", regions: [{ name: "South & West Coast", places: ["Galle", "Bentota", "Mirissa", "Hikkaduwa", "Colombo"] }, { name: "Cultural Triangle", places: ["Kandy", "Sigiriya", "Polonnaruwa", "Anuradhapura"] }] },
  { name: "Monsoon Season", period: "May — November", t: "20–28°C", r: "Moderate", h: "High", regions: [{ name: "Hill Country", places: ["Nuwara Eliya", "Ella", "Horton Plains"] }, { name: "East Coast", places: ["Trincomalee", "Arugam Bay", "Pasikuda"] }] },
];

const cuisines = [
  { name: "Rice & Curry", img: "/travel_guide/Rice_and_curry.webp", desc: "The national meal: rice with 5+ curries, sambols and papadums." },
  { name: "Hoppers (Appa)", img: "/travel_guide/Hoppers.webp", desc: "Bowl-shaped pancakes — perfect for breakfast with egg or coconut milk." },
  { name: "Kottu Roti", img: "/travel_guide/Kottu.webp", desc: "Chopped roti stir-fried with vegetables, egg and meat. Sound: cha-cha-cha." },
  { name: "Ceylon Tea", img: "/travel_guide/Cup_of_Ceylon.webp", desc: "World-famous tea from the misty hill country plantations." },
];

const festivals = [
  { name: "Vesak Festival", date: "May (Full Moon)", img: "/travel_guide/wesak.webp" },
  { name: "Esala Perahera", date: "July–August", img: "/travel_guide/Esala_Perahera.webp" },
  { name: "Sinhala & Tamil New Year", date: "April 13–14", img: "/travel_guide/Sinhala_Tamil_New_Year.webp" },
];

export default function TravelGuide() {
  return (
    <div>
      <PageHero image="/travel-guide.webp" eyebrow="Travel Guide" title="Everything you need to know" subtitle="Practical tips and seasonal wisdom for the Pearl of the Indian Ocean." height="lg" />

      <section className="container-page section-y">
        <SectionHeader eyebrow="Before you go" title={<>Essential <span className="italic text-accent">information</span></>} />
        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {essentials.map(({ Icon, t, d }) => (
            <div key={t} className="card-surface p-6 hover:shadow-elegant transition group">
              <span className="grid place-items-center h-12 w-12 rounded-xl bg-accent-soft text-accent group-hover:bg-gradient-gold group-hover:text-primary-foreground transition mb-4">
                <Icon className="h-5 w-5" />
              </span>
              <h3 className="font-display text-lg font-semibold text-primary-deep">{t}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-sand/40 section-y">
        <div className="container-page">
          <SectionHeader eyebrow="When to visit" title={<>Best <span className="italic text-accent">seasons</span> to travel</>} />
          <div className="mt-12 grid lg:grid-cols-2 gap-6">
            {seasons.map((s) => (
              <div key={s.name} className="card-surface p-7">
                <div className="text-xs uppercase tracking-widest text-accent font-semibold">{s.period}</div>
                <h3 className="font-display text-2xl font-bold text-primary-deep mt-1">{s.name}</h3>
                <div className="grid grid-cols-3 gap-3 mt-5">
                  {[["Temp", s.t], ["Rain", s.r], ["Humidity", s.h]].map(([k, v]) => (
                    <div key={k} className="text-center bg-muted rounded-xl p-3">
                      <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{k}</div>
                      <div className="font-semibold text-primary-deep mt-1 text-sm">{v}</div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 space-y-4">
                  {s.regions.map((r) => (
                    <div key={r.name} className="border-l-2 border-accent pl-4">
                      <div className="font-semibold text-primary-deep">{r.name}</div>
                      <div className="text-sm text-muted-foreground mt-1">{r.places.join(" · ")}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container-page section-y">
        <SectionHeader eyebrow="Festivals" title={<>Cultural <span className="italic text-accent">celebrations</span></>} />
        <div className="mt-12 grid sm:grid-cols-3 gap-5">
          {festivals.map((f) => (
            <div key={f.name} className="relative h-72 rounded-2xl overflow-hidden group">
              <img loading="lazy" decoding="async" src={f.img} alt={f.name} className="absolute inset-0 h-full w-full object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-primary-deep/90 to-transparent" />
              <div className="absolute bottom-0 p-6 text-white">
                <div className="text-[10px] uppercase tracking-widest text-accent">{f.date}</div>
                <h3 className="font-display text-xl font-bold mt-1">{f.name}</h3>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-primary-deep section-y text-primary-foreground">
        <div className="container-page">
          <SectionHeader invert eyebrow="Food & Drink" title={<>A taste of <span className="italic text-accent">Sri Lanka</span></>} />
          <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {cuisines.map((c) => (
              <div key={c.name} className="rounded-2xl overflow-hidden bg-white/5 border border-white/10 hover:border-accent transition">
                <div className="relative h-44 overflow-hidden">
                  <img loading="lazy" decoding="async" src={c.img} alt={c.name} className="absolute inset-0 h-full w-full object-cover" />
                </div>
                <div className="p-5">
                  <div className="inline-flex items-center gap-1.5 text-accent text-xs"><Utensils className="h-3.5 w-3.5" /> Must try</div>
                  <h3 className="font-display text-lg font-semibold mt-1">{c.name}</h3>
                  <p className="text-sm text-primary-foreground/70 mt-1.5">{c.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}