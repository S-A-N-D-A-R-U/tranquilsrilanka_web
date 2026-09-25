import { getTourBySlug, getTours } from "@/lib/api";
import { notFound } from "next/navigation";
import TourClientPage from "./TourClientPage";
import { Metadata } from "next";
import { SITE_NAME, jsonLdScript, truncate } from "@/lib/seo";

export const revalidate = 0;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const tour = await getTourBySlug(slug);
  if (!tour) return { title: "Tour Not Found" };

  const title = `${tour.title} — ${tour.duration}`;
  const description = truncate(tour.overview);
  const url = `/tours/${tour.slug || tour.id}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      images: [tour.image],
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
        dangerouslySetInnerHTML={jsonLdScript(jsonLd)}
      />
      <TourClientPage tour={tour} tours={tours} />
    </>
  );
}
