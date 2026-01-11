import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://keepproof.com';
  
  const routes = [
    '',
    '/pricing',
    '/questions',
    '/security',
    '/verify',  // AJOUT DE LA PAGE
    '/legal/privacy',
    '/new',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  const solutions = ['designers', 'developers', 'musicians', 'startups'].map((slug) => ({
    url: `${baseUrl}/solutions/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }));

  return [...routes, ...solutions];
}
