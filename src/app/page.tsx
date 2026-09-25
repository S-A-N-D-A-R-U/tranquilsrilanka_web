import Hero from "@/components/home/Hero";
import Stats from "@/components/home/Stats";
import Categories from "@/components/home/Categories";
import About from "@/components/home/About";
import PopularTours from "@/components/home/PopularTours";
import ExploreMap from "@/components/home/ExploreMap";
import PopularActivities from "@/components/home/PopularActivities";
import Testimonials from "@/components/home/Testimonials";
import LatestNews from "@/components/home/LatestNews";
import CTA from "@/components/home/CTA";
import Reveal from "@/components/ui/Reveal";
import { Metadata } from "next";
import { getTours, getActivities, getHeroSlides } from "@/lib/api";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: { absolute: "Tranquil Sri Lanka — Tailor-Made Tours of the Pearl Island" },
  description: "Discover Sri Lanka with handcrafted tours, day excursions, transfers and authentic island experiences led by local experts.",
  alternates: { canonical: "/" },
};

export default async function Home() {
  const [tours, activities, heroSlides] = await Promise.all([getTours(), getActivities(), getHeroSlides()]);

  return (
    <main>
      <Hero slides={heroSlides} />
      <Reveal><Stats /></Reveal>
      <Reveal><Categories /></Reveal>
      <Reveal><About /></Reveal>
      <Reveal><PopularTours tours={tours} /></Reveal>
      <Reveal><ExploreMap tours={tours} activities={activities} /></Reveal>
      <Reveal><PopularActivities activities={activities} /></Reveal>
      <Reveal><Testimonials /></Reveal>
      <Reveal><LatestNews /></Reveal>
      <Reveal><CTA /></Reveal>
    </main>
  );
}
