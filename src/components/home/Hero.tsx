"use client";
import { Fragment, useEffect, useState, type CSSProperties } from "react";
import CmsImage from "@/components/ui/CmsImage";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

type Slide = {
  url: string;
  title?: string;
  description?: string;
  tagline?: string;
};

const defaultSliderImages: Slide[] = [
  { url: "/sun_and_beach.webp", title: "Golden Beaches", description: "Relax on the sun-kissed shores of Sri Lanka's stunning coastline.", tagline: "Where the Ocean Meets Serenity" },
  { url: "/culture_and_heritage.webp", title: "Cultural Wonders", description: "Step into a world of ancient kingdoms and sacred temples.", tagline: "Echoes of the Past" },
  { url: "/safari_and_wildlife.webp", title: "Untamed Wildlife", description: "Witness majestic elephants and elusive leopards in the wild.", tagline: "Nature in its Purest Form" },
  { url: "/eco_and_nature.webp", title: "Lush Tea Estates", description: "Breathe in the fresh mountain air as you stroll through tea plantations.", tagline: "Sip the Essence of Sri Lanka" },
];

/** Stagger for the CSS `.enter` animation (globals.css). */
const delay = (seconds: number) => ({ "--enter-delay": `${seconds}s` }) as CSSProperties;

export default function Hero({ slides }: { slides?: Slide[] }) {
  const displaySlides = slides && slides.length > 0 ? slides : defaultSliderImages;
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;
    const t = setInterval(() => {
      setCurrentSlide((p) => (p === displaySlides.length - 1 ? 0 : p + 1));
    }, 7000);
    return () => clearInterval(t);
  }, [isAutoPlaying, currentSlide, displaySlides.length]);

  const slide = displaySlides[currentSlide] || defaultSliderImages[0];
  const titleWords = slide.title ? slide.title.split(" ") : [];
  const taglineWords = slide.tagline ? slide.tagline.split(" ") : [];

  return (
    <div className="relative h-[100dvh] w-full overflow-hidden bg-black">
      <div className="absolute inset-0 w-full">
        {displaySlides.map((s, idx) => (
          <div
            key={idx}
            className={`absolute inset-0 transition-[opacity,transform] duration-[900ms] ease-in-out ${idx === currentSlide ? "opacity-100 scale-100 z-[1]" : "opacity-0 scale-[1.06] z-0"}`}
          >
            <CmsImage src={s.url} alt={s.title ?? ""} fill sizes="100vw" loading={idx === 0 ? "eager" : "lazy"} fetchPriority={idx === 0 ? "high" : "auto"} className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/20 to-black/50" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/20 to-transparent" />
          </div>
        ))}
      </div>

      <div className="absolute inset-0 z-20 flex flex-col justify-center px-4 sm:px-10 lg:px-20 xl:px-28">
        <div className="max-w-5xl w-full">
          {/* key remounts the text so the CSS entrance replays on every slide */}
          <div key={currentSlide}>
            <h1 className="flex flex-wrap gap-x-3 sm:gap-x-5 text-4xl font-extrabold leading-none tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-display">
              {titleWords.map((word, i) => (
                <Fragment key={`t-${i}`}>{i > 0 && " "}<span className="enter inline-block" style={delay(i * 0.07)}>{word}</span></Fragment>
              ))}
            </h1>

            <div className="mt-3 flex flex-wrap gap-x-2 sm:gap-x-3 text-base font-light text-blue-200 sm:text-xl md:text-2xl lg:text-3xl">
              {taglineWords.map((word, i) => (
                <Fragment key={`tag-${i}`}>{i > 0 && " "}<span className="enter inline-block" style={delay((titleWords.length + i) * 0.07)}>{word}</span></Fragment>
              ))}
            </div>

            <p className="enter mt-4 max-w-xl text-sm text-gray-300 drop-shadow sm:mt-6 sm:text-base md:text-lg xl:text-xl" style={delay(0.7)}>
              {slide.description}
            </p>

            <div className="enter" style={delay(0.95)}>
              <Link
                href="/plan-form"
                className="group relative inline-block mt-6 sm:mt-10 overflow-hidden rounded-full bg-accent px-7 py-3.5 sm:px-10 sm:py-5 text-sm sm:text-lg font-bold text-white shadow-[0_0_0_4px_rgba(15,141,234,0.25),0_8px_32px_rgba(15,141,234,0.45)] transition-all duration-300 hover:shadow-[0_0_0_6px_rgba(15,141,234,0.35),0_12px_48px_rgba(15,141,234,0.55)] hover:-translate-y-1 animate-pulse-glow"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Plan Your Tour
                  <ChevronRight className="transition-transform group-hover:translate-x-1" />
                </span>
                <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-accent via-sky-300 to-accent transition-transform duration-500 ease-in-out group-hover:translate-x-0" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-10 right-6 z-30 flex items-center gap-2 sm:bottom-14 sm:right-12 sm:gap-3">
        {displaySlides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => { setCurrentSlide(idx); setIsAutoPlaying(false); }}
            className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentSlide ? "w-10 bg-blue-400" : "w-3 bg-white/40 hover:bg-white/70"}`}
            aria-label={`Slide ${idx + 1}`}
          />
        ))}
      </div>

      <div className="absolute bottom-6 left-1/2 z-30 -translate-x-1/2 hidden sm:block">
        <div className="enter flex flex-col items-center gap-3" style={delay(2.2)}>
          <span className="text-[9px] font-semibold uppercase tracking-[0.35em] text-white/50">Scroll to Explore</span>
          <div className="flex h-[44px] w-[26px] items-start justify-center rounded-full border-2 border-white/30 pt-2">
            <div className="scroll-dot h-2 w-1.5 rounded-full bg-blue-400" />
          </div>
        </div>
      </div>
    </div>
  );
}
