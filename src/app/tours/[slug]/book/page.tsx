import { getTourBySlug } from "@/lib/api";
import { notFound } from "next/navigation";
import ClientPage from "@/app/tours/[slug]/book/ClientPage";

export default async function TourBookingPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const tour = await getTourBySlug(slug);

  if (!tour) {
    notFound();
  }

  // Pass only what is needed to the client
  return <ClientPage tourTitle={tour.title} tourImage={tour.image} />;
}
