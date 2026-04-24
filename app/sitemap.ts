import type { MetadataRoute } from 'next';
import { getAllJokeSlugs } from '@/lib/jokes';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const slugs = await getAllJokeSlugs();

  const jokeUrls: MetadataRoute.Sitemap = slugs.map(({ slug, updated_at }) => ({
    url: `https://dadhumor.app/j/${slug}`,
    lastModified: new Date(updated_at),
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  return [
    {
      url: 'https://dadhumor.app',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    ...jokeUrls,
  ];
}
