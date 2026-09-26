import type { Metadata } from "next";
import Link from "next/link";
import { Compass, ChevronRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Page not found",
};

const suggestions = [
  { href: "/tours", label: "Browse our tours" },
  { href: "/things-to-do", label: "Things to do in Sri Lanka" },
  { href: "/travel-guide", label: "Sri Lanka travel guide" },
  { href: "/contact", label: "Talk to our team" },
];

export default function NotFound() {
  return (
    <div className="min-h-[80vh] grid place-items-center bg-gradient-to-b from-background to-sand/40 pt-32 pb-20">
      <div className="container-page max-w-xl text-center">
        <span className="inline-grid place-items-center h-16 w-16 rounded-full bg-accent-soft text-accent mb-6">
          <Compass className="h-8 w-8" />
        </span>
        <p className="eyebrow">Error 404</p>
        <h1 className="mt-3 font-display font-bold text-4xl sm:text-5xl text-primary-deep">
          This path isn&apos;t on our map
        </h1>
        <p className="mt-4 text-muted-foreground leading-relaxed">
          The page may have moved, or the tour is no longer available. Here are some good places to continue your journey.
        </p>
        <ul className="mt-8 grid sm:grid-cols-2 gap-3 text-left">
          {suggestions.map((s) => (
            <li key={s.href}>
              <Link
                href={s.href}
                className="group flex items-center justify-between gap-3 rounded-2xl border border-border bg-card px-5 py-4 font-medium text-primary-deep hover:border-accent hover:text-accent transition"
              >
                {s.label}
                <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </li>
          ))}
        </ul>
        <Link href="/" className="btn-primary mt-8">Back to home</Link>
      </div>
    </div>
  );
}
