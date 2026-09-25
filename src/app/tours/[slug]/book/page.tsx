import { getTourBySlug } from "@/lib/api";
import { notFound } from "next/navigation";
import ClientPage from "@/app/tours/[slug]/book/ClientPage";
import { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const tour = await getTourBySlug(slug);

  return {
    title: tour ? `Book ${tour.title}` : "Book a Tour",
    // Thin form page — keep it out of the index, the tour page is canonical
    robots: { index: false, follow: true },
  };
}

export default async function TourBookingPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const tour = await getTourBySlug(slug);

  if (!tour) {
    notFound();
  }

  // Pass only what is needed to the client
  return <ClientPage tourSlug={tour.slug} tourTitle={tour.title} tourImage={tour.image} />;
}
