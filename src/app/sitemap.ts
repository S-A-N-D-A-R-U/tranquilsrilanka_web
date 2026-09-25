import { MetadataRoute } from 'next';
import { getTours, getPosts, getActivities, getOffers } from '@/lib/api';
import { SITE_URL } from '@/lib/seo';

// Rebuild the sitemap at most once an hour instead of querying the DB on every crawl
export const revalidate = 3600;

type Doc = { slug?: string; id?: string; updatedAt?: string; createdAt?: string; externalLink?: string };

const lastModified = (doc: Doc) => {
  const date = doc.updatedAt || doc.createdAt;
  return date ? new Date(date) : undefined;
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [tours, posts, activities, offers] = await Promise.all([
    getTours(),
    getPosts(),
    getActivities(),
    getOffers(),
  ]);

  const entries = (
    docs: Doc[],
    path: string,
    changeFrequency: 'weekly' | 'monthly',
    priority: number,
  ): MetadataRoute.Sitemap =>
    docs
      .filter((doc) => doc.slug || doc.id)
      .map((doc) => ({
        url: `${SITE_URL}/${path}/${doc.slug || doc.id}`,
        lastModified: lastModified(doc),
        changeFrequency,
        priority,
      }));

  const staticRoutes: MetadataRoute.Sitemap = [
    '',
    '/about',
    '/tours',
    '/things-to-do',
    '/offers',
    '/seat-in-coach',
    '/travel-guide',
    '/transfer',
    '/plan-form',
    '/contact',
    '/blog',
  ].map((route) => ({
    url: `${SITE_URL}${route}`,
    changeFrequency: 'monthly',
    priority: route === '' ? 1.0 : 0.8,
  }));

  return [
    ...staticRoutes,
    ...entries(tours, 'tours', 'weekly', 0.9),
    ...entries(activities, 'activities', 'monthly', 0.8),
    ...entries(offers, 'offers', 'weekly', 0.7),
    // External-link posts redirect off-site, so they don't belong in the sitemap
    ...entries(posts.filter((p: Doc) => !p.externalLink), 'blog', 'monthly', 0.7),
  ];
}
