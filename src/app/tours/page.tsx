import { getTours } from "@/lib/api";
import ToursClient from "./ToursClient";
import { Metadata } from "next";

export const revalidate = 0;

export const metadata: Metadata = {
  title: "Tours in Sri Lanka | Tranquil Sri Lanka",
  description: "Browse our handpicked multi-day round tours and day excursions across Sri Lanka.",
};

export default async function Tours() {
  const tours = await getTours();

  return <ToursClient tours={tours} />;
}