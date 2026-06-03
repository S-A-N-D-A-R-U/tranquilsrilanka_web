import { Star, Users, Map, Award } from "lucide-react";
const stats = [
  { Icon: Star, n: "4.9/5", l: "Customer rating" },
  { Icon: Users, n: "500+", l: "Happy travellers" },
  { Icon: Map, n: "50+", l: "Tour packages" },
  { Icon: Award, n: "10+", l: "Years of excellence" },
];
export default function Stats() {
  return (
    <section className="container-page -mt-12 relative z-10">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 bg-card/95 backdrop-blur rounded-3xl p-5 sm:p-7 shadow-elegant border border-border">
        {stats.map(({ Icon, n, l }) => (
          <div key={l} className="text-center">
            <span className="inline-grid place-items-center h-10 w-10 rounded-full bg-accent-soft text-accent mb-2"><Icon className="h-5 w-5" /></span>
            <div className="font-display text-2xl sm:text-3xl font-bold text-primary-deep">{n}</div>
            <div className="text-[11px] sm:text-xs uppercase tracking-widest text-muted-foreground mt-1">{l}</div>
          </div>
        ))}
      </div>
    </section>
  );
}