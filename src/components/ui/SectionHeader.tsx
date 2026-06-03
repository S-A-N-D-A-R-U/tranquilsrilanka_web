"use client";
import { motion } from "framer-motion";

type Props = {
  eyebrow?: string;
  title: React.ReactNode;
  subtitle?: string;
  align?: "left" | "center";
  invert?: boolean;
};

export default function SectionHeader({ eyebrow, title, subtitle, align = "center", invert = false }: Props) {
  return (
    <div className={`max-w-3xl ${align === "center" ? "mx-auto text-center" : ""} ${invert ? "text-primary-foreground" : ""}`}>
      {eyebrow && (
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className={`eyebrow ${invert ? "!text-accent" : ""}`}
        >
          {eyebrow}
        </motion.p>
      )}
      <motion.h2
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className={`mt-4 font-display font-bold text-3xl sm:text-4xl md:text-5xl text-balance leading-[1.05] ${invert ? "text-primary-foreground" : "text-primary-deep"}`}
      >
        {title}
      </motion.h2>
      {subtitle && (
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className={`mt-4 text-base sm:text-lg leading-relaxed ${invert ? "text-primary-foreground/75" : "text-muted-foreground"}`}
        >
          {subtitle}
        </motion.p>
      )}
      {align === "center" && <div className="gold-divider mx-auto mt-6" />}
    </div>
  );
}