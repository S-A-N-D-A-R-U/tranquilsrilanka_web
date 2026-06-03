export type Tour = {
  id: string;
  type: "round" | "day";
  title: string;
  slug?: string;
  image: string;
  gallery?: string[];
  duration: string;
  destinations: string[];
  categories: string[];
  price: number;
  originalPrice?: number;
  isOfferAvailable?: boolean;
  offerPercentage?: number;
  rating: number;
  reviews: number;
  isPopular?: boolean;
  overview: string;
  highlights: string[];
  itinerary: { day: string; title: string; description: string }[];
  inclusions: string[];
  exclusions: string[];
  linkedOffers?: any[];
};

export type Activity = {
  id: string;
  slug?: string;
  title: string;
  category: string;
  destination: string;
  duration: string;
  image: string;
  price: number;
  isOfferAvailable?: boolean;
  offerPrice?: number;
  isPopular?: boolean;
  shortDescription: string;
  description: string;
  highlights: string[];
  whatToBring: string[];
};

export type Offer = {
  id: string;
  title: string;
  description: string;
  image: string;
  discount: string;
  valid: string;
  link: string;
};

export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  image: string;
  category: string;
  author: string;
  date: string;
  readTime: string;
  content: string[];
};