import { MetadataRoute } from 'next';

const DOMAIN = "https://www.tranquilsrilanka.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/admin/'], // Protect any future backend/admin routes
    },
    sitemap: `${DOMAIN}/sitemap.xml`,
  };
}
