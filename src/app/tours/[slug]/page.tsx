import { getTourBySlug, getTours } from "@/lib/api";
import { notFound } from "next/navigation";
import TourClientPage from "./TourClientPage";
import { Metadata } from "next";

export const revalidate = 0;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const tour = await getTourBySlug(slug);
  if (!tour) return { title: "Tour Not Found" };

  return {
    title: `${tour.title} — ${tour.duration}`,
    description: tour.overview.slice(0, 160),
    openGraph: {
      images: [tour.image],
      title: `${tour.title} — ${tour.duration}`,
      description: tour.overview.slice(0, 160),
      type: "article",
    },
  };
}

export default async function TourPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const tour = await getTourBySlug(slug);
  const tours = await getTours();

  if (!tour) {
    notFound();
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: tour.title,
    image: tour.image,
    description: tour.overview,
    offers: {
      "@type": "Offer",
      url: `https://www.tranquilsrilanka.com/tours/${tour.slug || tour.id}`,
      priceCurrency: "USD",
      price: tour.price,
      availability: "https://schema.org/InStock",
      seller: {
        "@type": "Organization",
        name: "Tranquil Sri Lanka"
      }
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: tour.rating || 5.0,
      reviewCount: tour.reviews || 1
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <TourClientPage tour={tour} tours={tours} />
    </>
  );
}
