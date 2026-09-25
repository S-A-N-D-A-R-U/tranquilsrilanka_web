import "server-only";
import { cache } from 'react';
import { unstable_cache } from 'next/cache';
import connectToDatabase from './mongodb';
import Tour from '../models/Tour';
import Activity from '../models/Activity';
import HeroSlide from '../models/HeroSlide';
import Offer from '../models/Offer';
import Post from '../models/Post';

/** Cached DB results are refreshed at most this often (seconds), or on demand via /api/revalidate. */
const REVALIDATE_SECONDS = 3600;

/** Tags for on-demand revalidation — one per collection. */
export const CACHE_TAGS = ['tours', 'activities', 'hero-slides', 'offers', 'posts'] as const;
export type CacheTag = (typeof CACHE_TAGS)[number];

// Heavy fields only needed on detail pages — left out of list queries to keep payloads small
const TOUR_LIST_EXCLUDE = '-itinerary -highlights -inclusions -exclusions -gallery';
const ACTIVITY_LIST_EXCLUDE = '-description -highlights -whatToBring';
const POST_LIST_EXCLUDE = '-content';

/**
 * Helper to transform MongoDB _id to string for Next.js serialization
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function serializeDocument(doc: any) {
  if (!doc) return null;
  const serialized = JSON.parse(JSON.stringify(doc));
  if (serialized._id) {
    serialized.id = serialized._id;
    delete serialized._id;
  }
  return serialized;
}

/**
 * Wrap a DB query so it is:
 * - cached across requests for REVALIDATE_SECONDS and tagged for on-demand revalidation
 * - deduplicated within one request (generateMetadata + page share a single query)
 * - never cached on failure: errors are thrown inside the cache and turned into
 *   `fallback` outside it, so a DB outage isn't stored for an hour
 */
function cachedQuery<Args extends string[], Result>(
  key: string,
  tags: CacheTag[],
  query: (...args: Args) => Promise<Result>,
  fallback: Result,
) {
  const cachedFn = unstable_cache(
    async (...args: Args) => {
      await connectToDatabase();
      return query(...args);
    },
    [key],
    { tags, revalidate: REVALIDATE_SECONDS },
  );

  return cache(async (...args: Args): Promise<Result> => {
    try {
      return await cachedFn(...args);
    } catch (error) {
      console.error(`Error running ${key}${args.length ? ` (${args.join(', ')})` : ''}:`, error);
      return fallback;
    }
  });
}

// Tours embed linked offers, so they must also refresh when offers change
export const getTours = cachedQuery('tours:list', ['tours', 'offers'], async () => {
  const tours = await Tour.find({}).select(TOUR_LIST_EXCLUDE).populate('linkedOffers').lean();
  return tours.map(serializeDocument);
}, []);

export const getTourBySlug = cachedQuery('tours:by-slug', ['tours', 'offers'], async (slug: string) => {
  const tour = await Tour.findOne({ slug }).populate('linkedOffers').lean();
  return serializeDocument(tour);
}, null);

export const getActivities = cachedQuery('activities:list', ['activities'], async () => {
  const activities = await Activity.find({}).select(ACTIVITY_LIST_EXCLUDE).lean();
  return activities.map(serializeDocument);
}, []);

export const getActivityBySlug = cachedQuery('activities:by-slug', ['activities'], async (slug: string) => {
  const activity = await Activity.findOne({ slug }).lean();
  return serializeDocument(activity);
}, null);

export const getHeroSlides = cachedQuery('hero-slides:list', ['hero-slides'], async () => {
  const slides = await HeroSlide.find({}).sort({ order: 1, createdAt: -1 }).lean();
  return slides.map(serializeDocument);
}, []);

export const getOffers = cachedQuery('offers:list', ['offers'], async () => {
  const offers = await Offer.find({ isActive: true }).sort({ createdAt: -1 }).lean();
  return offers.map(serializeDocument);
}, []);

export const getOfferBySlug = cachedQuery('offers:by-slug', ['offers'], async (slug: string) => {
  const offer = await Offer.findOne({ slug, isActive: true }).lean();
  return serializeDocument(offer);
}, null);

export const getPosts = cachedQuery('posts:list', ['posts'], async () => {
  const posts = await Post.find({}).select(POST_LIST_EXCLUDE).sort({ createdAt: -1 }).lean();
  return posts.map(serializeDocument);
}, []);

export const getPostBySlug = cachedQuery('posts:by-slug', ['posts'], async (slug: string) => {
  const post = await Post.findOne({ slug }).lean();
  return serializeDocument(post);
}, null);
