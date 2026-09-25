import type { Metadata } from "next";
import PlanFormClient from "./PlanFormClient";

export const metadata: Metadata = {
  title: "Plan Your Tailor-Made Sri Lanka Trip",
  description:
    "Tell us your dates, interests and budget and our local experts will send a personalised Sri Lanka itinerary within 48 hours — free and no obligation.",
  alternates: { canonical: "/plan-form" },
};

export default function PlanFormPage() {
  return <PlanFormClient />;
}
