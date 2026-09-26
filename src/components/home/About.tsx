import Link from "next/link";
import Image from "next/image";
import { Check, ChevronRight } from "lucide-react";

const values = [
  { title: "Local Storytellers", desc: "Guides born and raised in Sri Lanka, sharing stories you won't find in guidebooks." },
  { title: "Tailor-made", desc: "Every itinerary handcrafted to your pace, interests and budget." },
  { title: "24/7 on the ground", desc: "From the airport to the coast, we're a phone call away — day or night." },
];

export default function About() {
  return (
    <section className="bg-sand/40 section-y">
      <div className="container-page grid lg:grid-cols-2 gap-14 items-center">
        <div>
          <div className="relative">
            <Image src="/about.webp" alt="Tranquil Sri Lanka local guide and travellers" width={1200} height={896} sizes="(min-width: 1024px) 50vw, 100vw" className="w-full h-[440px] sm:h-[520px] object-cover rounded-3xl" />
            <div className="absolute -bottom-6 right-3 sm:-right-6 bg-primary-deep text-primary-foreground p-6 rounded-2xl shadow-elegant max-w-[220px]">
              <div className="text-4xl font-display font-bold text-accent">10<span className="text-xl">+</span></div>
              <div className="text-xs uppercase tracking-widest text-primary-foreground/70 mt-1">Years crafting Sri Lankan journeys</div>
            </div>
          </div>
        </div>

        <div>
          <p className="eyebrow">About Tranquil</p>
          <h2 className="mt-4 font-display font-bold text-3xl sm:text-4xl md:text-5xl text-primary-deep leading-[1.05]">
            Sri Lanka, the way <span className="italic text-accent">locals</span> see it.
          </h2>
          <div className="gold-divider mt-6" />
          <p className="mt-6 text-base sm:text-lg text-muted-foreground leading-relaxed">
            We're a family-owned travel atelier based in Kandy, the cultural heart of Sri Lanka. For over a decade
            we've been weaving handcrafted journeys for curious travellers — from solo adventurers to honeymooners
            and multi-generational families.
          </p>
          <div className="mt-8 space-y-4">
            {values.map((v) => (
              <div key={v.title} className="flex items-start gap-4">
                <span className="grid place-items-center h-9 w-9 rounded-full bg-accent-soft text-accent shrink-0 mt-0.5">
                  <Check className="h-4 w-4" />
                </span>
                <div>
                  <h3 className="font-semibold text-primary-deep">{v.title}</h3>
                  <p className="text-sm text-muted-foreground mt-0.5">{v.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <Link href="/about" className="btn-primary mt-10">Read our story <ChevronRight className="h-4 w-4" /></Link>
        </div>
      </div>
    </section>
  );
}