import { getTours } from "@/lib/api";
import ToursClient from "./ToursClient";
import { Metadata } from "next";

export const revalidate = 0;

export const metadata: Metadata = {
  title: "Sri Lanka Tours — Round Tours & Day Excursions",
  alternates: { canonical: "/tours" },
  description: "Browse our handpicked multi-day round tours and day excursions across Sri Lanka.",
};

export default async function Tours() {
  const tours = await getTours();

  return <ToursClient tours={tours} />;
}