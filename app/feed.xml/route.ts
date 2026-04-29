import { getAllArticles } from '@/lib/content';

export const revalidate = 3600; // 1 hour

const SITE_URL = 'https://dadhumor.app';
const FEED_TITLE = 'Dad Humor — The Archive';
const FEED_DESCRIPTION =
  'Long-form thoughts on dad jokes, the data behind them, and the people who tell them.';

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function cdata(str: string): string {
  return `<![CDATA[${str.replace(/\]\]>/g, ']]]]><![CDATA[>')}]]>`;
}

function rfc822(iso: string): string {
  return new Date(iso).toUTCString();
}

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const selfHref = `${requestUrl.origin}${requestUrl.pathname}`;
  const articles = getAllArticles();
  const lastBuild = articles[0]?.frontmatter.updated ?? new Date().toISOString();

  const items = articles
    .map(({ frontmatter, content }) => {
      const articleUrl = `${SITE_URL}/blog/${frontmatter.slug}`;

      // Strip JSX components for RSS readers, keep markdown structure
      const plainContent = content
        .replace(/<[A-Z][^>]*\/>/g, '')           // self-closing JSX
        .replace(/<[A-Z][^>]*>[\s\S]*?<\/[A-Z][^>]*>/g, '') // paired JSX
        .trim();

      return `
    <item>
      <title>${escapeXml(frontmatter.title)}</title>
      <link>${articleUrl}</link>
      <guid isPermaLink="true">${articleUrl}</guid>
      <pubDate>${rfc822(frontmatter.date)}</pubDate>
      <author>noreply@dadhumor.app (${escapeXml(frontmatter.author)})</author>
      <category>${cdata(frontmatter.category)}</category>
      ${frontmatter.tags.map(t => `<category>${cdata(t)}</category>`).join('\n      ')}
      <description>${cdata(frontmatter.description)}</description>
      <content:encoded>${cdata(plainContent)}</content:encoded>
    </item>`;
    })
    .join('');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(FEED_TITLE)}</title>
    <link>${SITE_URL}/blog</link>
    <description>${escapeXml(FEED_DESCRIPTION)}</description>
    <language>en-gb</language>
    <atom:link href="${selfHref}" rel="self" type="application/rss+xml" />
    <lastBuildDate>${rfc822(lastBuild)}</lastBuildDate>
    <generator>dadhumor.app</generator>${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}
