import { MetadataRoute } from 'next';
import { getTours, getPosts } from '@/lib/api';

const DOMAIN = "https://www.tranquilsrilanka.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const tours = await getTours();
  const posts = await getPosts();

  const tourEntries = tours.map((tour: any) => ({
    url: `${DOMAIN}/tours/${tour.slug || tour.id}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }));

  const blogEntries = posts.map((post: any) => ({
    url: `${DOMAIN}/blog/${post.slug || post._id.toString()}`,
    lastModified: new Date(post.updatedAt || post.createdAt || new Date()),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  const staticRoutes = [
    '',
    '/about',
    '/tours',
    '/things-to-do',
    '/seat-in-coach',
    '/travel-guide',
    '/transfer',
    '/contact',
    '/blog',
  ].map((route) => ({
    url: `${DOMAIN}${route}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: route === '' ? 1.0 : 0.8,
  }));

  return [...staticRoutes, ...tourEntries, ...blogEntries];
}
