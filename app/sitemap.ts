import type { MetadataRoute } from 'next';
import { getAllJokeSlugs } from '@/lib/jokes';
import { getAllArticles } from '@/lib/content';

const SITE_URL = 'https://dadhumor.app';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const slugs = await getAllJokeSlugs();

  const jokeUrls: MetadataRoute.Sitemap = slugs.map(({ slug, updated_at }) => ({
    url: `${SITE_URL}/j/${slug}`,
    lastModified: new Date(updated_at),
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  const articles = getAllArticles();
  const articleUrls: MetadataRoute.Sitemap = articles.map(({ frontmatter }) => ({
    url: `${SITE_URL}/blog/${frontmatter.slug}`,
    lastModified: new Date(frontmatter.updated),
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  const now = new Date();
  const staticPages: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/blog`,                       lastModified: now, changeFrequency: 'weekly',  priority: 0.8 },
    { url: `${SITE_URL}/fathers-day`,                lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${SITE_URL}/collections/dad-classics`,   lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${SITE_URL}/quiz`,                       lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${SITE_URL}/privacy`,                    lastModified: now, changeFrequency: 'yearly',  priority: 0.3 },
    { url: `${SITE_URL}/terms`,                      lastModified: now, changeFrequency: 'yearly',  priority: 0.3 },
  ];

  return [
    {
      url: SITE_URL,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1,
    },
    ...staticPages,
    ...articleUrls,
    ...jokeUrls,
  ];
}
