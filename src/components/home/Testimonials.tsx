import { Quote, Star } from "lucide-react";
import SectionHeader from "@/components/ui/SectionHeader";

const items = [
  { name: "Emma & James", country: "United Kingdom", text: "Tranquil organised the most magical 12 days of our lives. From the train ride to Ella to the leopard we spotted in Yala — every moment was beyond expectation." },
  { name: "Marc Dubois", country: "France", text: "Our chauffeur guide Asanka became a friend. He knew every shortcut, every great restaurant, and made sure we saw the real Sri Lanka." },
  { name: "The Tanaka Family", country: "Japan", text: "Travelling with three children isn't easy, but Tranquil made it effortless. The kids still talk about the elephants at Udawalawe." },
];

const initials = (name: string) =>
  name.replace(/^The /, "").split(/[s&]+/).filter(Boolean).slice(0, 2).map((w) => w[0]).join("");

export default function Testimonials() {
  return (
    <section className="container-page section-y">
      <SectionHeader eyebrow="Travellers' words" title={<>Loved by curious <span className="italic text-accent">travellers</span></>} />
      <div className="mt-14 grid md:grid-cols-3 gap-6">
        {items.map((t) => (
          <figure key={t.name} className="card-surface p-7 relative hover:shadow-elegant transition">
            <Quote className="absolute -top-4 left-7 h-8 w-8 text-accent bg-card p-1.5 rounded-full" />
            <div className="flex items-center gap-1 mb-4">
              {Array.from({ length: 5 }).map((_, i) => <Star key={i} className="h-3.5 w-3.5 fill-accent text-accent" />)}
            </div>
            <blockquote className="text-sm leading-relaxed text-foreground/85">"{t.text}"</blockquote>
            <figcaption className="mt-6 flex items-center gap-3">
              <span aria-hidden="true" className="grid place-items-center h-10 w-10 rounded-full bg-accent-soft text-accent text-sm font-bold">
                {initials(t.name)}
              </span>
              <div>
                <div className="font-semibold text-primary-deep text-sm">{t.name}</div>
                <div className="text-xs text-muted-foreground">{t.country}</div>
              </div>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}