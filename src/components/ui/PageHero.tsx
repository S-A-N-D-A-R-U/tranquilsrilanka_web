import { Fragment, type CSSProperties } from "react";
import CmsImage from "@/components/ui/CmsImage";
import { ChevronDown } from "lucide-react";

type Props = {
  image: string;
  eyebrow?: string;
  title: React.ReactNode;
  subtitle?: string;
  height?: "sm" | "md" | "lg";
  /** Use "p" when the page renders its own <h1> below the hero */
  titleTag?: "h1" | "p";
};

/** Stagger for the CSS `.enter` animation (globals.css). */
const delay = (seconds: number) => ({ "--enter-delay": `${seconds}s` }) as CSSProperties;

export default function PageHero({ image, eyebrow, title, subtitle, height = "md", titleTag = "h1" }: Props) {
  const Heading = titleTag;
  const h = { sm: "h-[52vh]", md: "h-[68vh]", lg: "h-[82vh]" }[height];
  const titleStr = typeof title === "string" ? title : "";
  const words = titleStr ? titleStr.split(" ") : null;

  return (
    <section className={`relative ${h} min-h-[420px] w-full overflow-hidden bg-primary-deep`}>
      {/* Slow Ken-Burns image */}
      <div className="absolute inset-0 ken-burns">
        <CmsImage src={image} alt="" fill sizes="100vw" loading="eager" fetchPriority="high" className="object-cover" />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/20 to-black/50" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/20 to-transparent" />

      <div className="relative h-full container-page flex flex-col items-start justify-end pb-16 sm:pb-24 text-white">
        {eyebrow && (
          <span className="enter inline-flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.35em] text-accent-soft mb-5">
            <span className="h-px w-10 bg-accent" /> {eyebrow}
          </span>
        )}

        {words ? (
          <Heading className="font-display font-bold text-4xl sm:text-6xl md:text-7xl lg:text-[5.5rem] leading-[1.02] tracking-tight text-balance max-w-5xl flex flex-wrap gap-x-4">
            {words.map((w, i) => (
              <Fragment key={i}>
                {i > 0 && " "}
                <span className="enter inline-block" style={delay(0.15 + i * 0.06)}>{w}</span>
              </Fragment>
            ))}
          </Heading>
        ) : (
          <Heading
            className="enter font-display font-bold text-4xl sm:text-6xl md:text-7xl leading-[1.02] tracking-tight text-balance max-w-5xl"
            style={delay(0.15)}
          >
            {title}
          </Heading>
        )}

        {subtitle && (
          <p className="enter mt-6 max-w-2xl text-base sm:text-lg text-white/85 leading-relaxed" style={delay(0.55)}>
            {subtitle}
          </p>
        )}
      </div>

      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 hidden sm:block">
        <div className="enter flex flex-col items-center gap-2 text-white/60" style={delay(1.4)}>
          <span className="text-[10px] font-semibold uppercase tracking-[0.4em]">Scroll</span>
          <span className="nudge">
            <ChevronDown className="h-4 w-4" />
          </span>
        </div>
      </div>
    </section>
  );
}
