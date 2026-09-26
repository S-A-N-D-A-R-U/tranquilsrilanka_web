import { getTours } from "@/lib/api";
import ToursClient from "./ToursClient";
import { Metadata } from "next";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Sri Lanka Tours — Round Tours & Day Excursions",
  alternates: { canonical: "/tours" },
  description: "Browse our handpicked multi-day round tours and day excursions across Sri Lanka.",
};

export default async function Tours({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const [tours, { type, category }] = await Promise.all([getTours(), searchParams]);
  const initialType = type === "day" ? "day" : "round";

  // Remount when the Round/Day type changes via a nav link, so the tab state follows the URL
  return (
    <ToursClient
      key={initialType}
      tours={tours}
      initialType={initialType}
      initialCategory={typeof category === "string" ? category : ""}
    />
  );
}