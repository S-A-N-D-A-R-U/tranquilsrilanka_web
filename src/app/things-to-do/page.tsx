import { getActivities } from "@/lib/api";
import ThingsToDoClient from "./ThingsToDoClient";

export const revalidate = 3600;

export const metadata = {
  title: "Things to Do in Sri Lanka",
  alternates: { canonical: "/things-to-do" },
  description: "From whale watching to tea tasting — Sri Lanka is endlessly surprising. Browse our top curated experiences.",
};

export default async function ThingsToDo() {
  const activities = await getActivities();

  return <ThingsToDoClient activities={activities} />;
}