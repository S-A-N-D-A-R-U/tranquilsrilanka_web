"use client";
import { motion } from "framer-motion";
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

const wordVariant = {
  hidden: { opacity: 0, y: 36, filter: "blur(8px)" },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const, delay: 0.15 + i * 0.06 },
  }),
};

export default function PageHero({ image, eyebrow, title, subtitle, height = "md", titleTag = "h1" }: Props) {
  const Heading = titleTag;
  const MotionHeading = titleTag === "p" ? motion.p : motion.h1;
  const h = { sm: "h-[52vh]", md: "h-[68vh]", lg: "h-[82vh]" }[height];
  const titleStr = typeof title === "string" ? title : "";
  const words = titleStr ? titleStr.split(" ") : null;

  return (
    <section className={`relative ${h} min-h-[420px] w-full overflow-hidden bg-primary-deep`}>
      {/* Slow Ken-Burns image */}
      <motion.div
        initial={{ scale: 1.12 }}
        animate={{ scale: 1 }}
        transition={{ duration: 12, ease: "easeOut" }}
        className="absolute inset-0"
      >
        <CmsImage src={image} alt="" fill sizes="100vw" loading="eager" fetchPriority="high" className="object-cover" />
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/20 to-black/50" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/20 to-transparent" />

      <div className="relative h-full container-page flex flex-col items-start justify-end pb-16 sm:pb-24 text-white">
        {eyebrow && (
          <motion.span
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.35em] text-accent-soft mb-5"
          >
            <span className="h-px w-10 bg-accent" /> {eyebrow}
          </motion.span>
        )}

        {words ? (
          <Heading aria-label={titleStr} className="font-display font-bold text-4xl sm:text-6xl md:text-7xl lg:text-[5.5rem] leading-[1.02] tracking-tight text-balance max-w-5xl flex flex-wrap gap-x-4">
            {words.map((w, i) => (
              <motion.span key={i} aria-hidden="true" custom={i} variants={wordVariant} initial="hidden" animate="visible" className="inline-block">
                {w}
              </motion.span>
            ))}
          </Heading>
        ) : (
          <MotionHeading
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="font-display font-bold text-4xl sm:text-6xl md:text-7xl leading-[1.02] tracking-tight text-balance max-w-5xl"
          >
            {title}
          </MotionHeading>
        )}

        {subtitle && (
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.55 }}
            className="mt-6 max-w-2xl text-base sm:text-lg text-white/85 leading-relaxed"
          >
            {subtitle}
          </motion.p>
        )}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 1 }}
        className="absolute bottom-5 left-1/2 -translate-x-1/2 hidden sm:flex flex-col items-center gap-2 text-white/60"
      >
        <span className="text-[10px] font-semibold uppercase tracking-[0.4em]">Scroll</span>
        <motion.span
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
        >
          <ChevronDown className="h-4 w-4" />
        </motion.span>
      </motion.div>
    </section>
  );
}