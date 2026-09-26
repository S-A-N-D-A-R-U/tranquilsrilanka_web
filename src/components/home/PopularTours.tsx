import Link from "next/link";
import { ChevronRight } from "lucide-react";
import SectionHeader from "@/components/ui/SectionHeader";
import TourCard from "@/components/ui/TourCard";
import type { Tour } from "@/data/types";

export default function PopularTours({ tours }: { tours: Tour[] }) {
  const list = tours.filter((t) => t.isPopular).slice(0, 6);

  return (
    <section className="container-page section-y">
      <SectionHeader
        eyebrow="Hand-picked Tours"
        title={<>Most loved <span className="italic text-accent">journeys</span></>}
        subtitle="Our most-booked itineraries — proven, polished and ready to be made yours."
      />

      <div className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
        {list.map((t) => (
          <TourCard key={t.id} tour={t} />
        ))}
      </div>

      <div className="mt-12 text-center">
        <Link href="/tours" className="btn-outline">View all tours <ChevronRight className="h-4 w-4" /></Link>
      </div>
    </section>
  );
}