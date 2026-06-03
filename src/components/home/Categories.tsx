"use client";
import Link from "next/link";
import { Waves, Landmark, PawPrint, Mountain, TreePine, Utensils, ArrowUpRight, Heart, Activity, Leaf } from "lucide-react";
import { motion } from "framer-motion";
import SectionHeader from "@/components/ui/SectionHeader";

const cats = [
  { id: "beach", label: "Sun & Beach", img: "/sun_and_beach.webp", icon: Waves, span: "lg:col-span-2 lg:row-span-2" },
  { id: "culture", label: "Culture & Heritage", img: "/culture_and_heritage.webp", icon: Landmark, span: "" },
  { id: "wildlife", label: "Safari & Wildlife", img: "/safari_and_wildlife.webp", icon: PawPrint, span: "" },
  { id: "hill", label: "Hill Country", img: "/hill_country.webp", icon: Mountain, span: "" },
  { id: "eco", label: "Eco & Nature", img: "/eco_and_nature.webp", icon: TreePine, span: "" },
  { id: "food", label: "Food & Culture", img: "/food_and_culture.webp", icon: Utensils, span: "" },
  { id: "wellness and ayurveda", label: "Wellness & Ayurveda", img: "/wellness.webp", icon: Leaf, span: "" },
  { id: "honeymoon", label: "Honeymoon Tour", img: "/honeymoon.webp", icon: Heart, span: "" },
  { id: "adventure", label: "Adventure", img: "/adventure.webp", icon: Activity, span: "" },
];

export default function Categories() {
  return (
    <section className="container-page section-y">
      <SectionHeader
        eyebrow="Explore by Theme"
        title={<>Find your <span className="italic text-accent">perfect</span> Sri Lanka</>}
        subtitle="From sun-drenched beaches to misty highlands — choose the experience that calls to you."
      />
      <div className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 lg:grid-rows-3 gap-4">
        {cats.map((c, idx) => {
          const Icon = c.icon;
          const isHero = c.span.includes("row-span-2");
          return (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: idx * 0.06, duration: 0.6 }}
              className={`group relative overflow-hidden rounded-3xl ${c.span} ${isHero ? "lg:min-h-[480px]" : "min-h-[240px]"}`}
            >
              <Link href={`/tours?category=${c.id}`} className="absolute inset-0 z-10" aria-label={c.label} />
              <img loading="lazy" decoding="async" src={c.img} alt={c.label} className="absolute inset-0 h-full w-full object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
              <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-3xl" />

              <div className={`absolute inset-0 p-6 ${isHero ? "p-8" : ""} flex flex-col justify-end text-white`}>
                
                <h3 className={`font-display font-bold ${isHero ? "text-4xl md:text-5xl" : "text-xl md:text-2xl"} leading-tight`}>
                  {c.label}
                </h3>
                <span className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-accent opacity-0 -translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition">
                  Explore <ArrowUpRight className="h-3.5 w-3.5" />
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}