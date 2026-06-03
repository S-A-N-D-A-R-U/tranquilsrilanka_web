import Link from "next/link";
import { ChevronRight } from "lucide-react";

export default function CTA() {
  return (
    <section className="relative isolate overflow-hidden">
      <img src="/tour_hero.webp" alt="" loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-black/50" />
      <div className="container-page relative section-y text-primary-foreground text-center">
        <p className="eyebrow !text-accent">Ready to wander?</p>
        <h2 className="mt-5 font-display font-bold text-3xl sm:text-5xl text-balance max-w-3xl mx-auto leading-tight">
          Your Sri Lankan story is <span className="italic text-accent">waiting</span> to be written.
        </h2>
        <p className="mt-5 max-w-xl mx-auto text-primary-foreground/80">
          Tell us your dates, your dreams and your pace. We'll send back a tailor-made itinerary within 48 hours.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/plan-form" className="btn-gold">Plan Your Tour <ChevronRight className="h-4 w-4" /></Link>
          <Link href="/contact" className="btn-ghost">Talk to a specialist</Link>
        </div>
      </div>
    </section>
  );
}