import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import { Logo } from '@/components/Logo';
import { Stache } from '@/components/Stache';
import { ThemeToggle } from '@/components/ThemeToggle';
import { ArticleCard } from '@/components/ArticleCard';
import { mdxComponents } from '@/components/mdx';
import {
  getAllArticleSlugs,
  getArticleBySlug,
  getArticlesByCategory,
} from '@/lib/content';

interface PageProps {
  params: Promise<{ slug: string }>;
}

const CATEGORY_LABELS: Record<string, string> = {
  data: 'Data',
  guides: 'Guides',
  press: 'Press',
  brand: 'Brand',
  jokes: 'Jokes',
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export async function generateStaticParams() {
  return getAllArticleSlugs().map(slug => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) return { title: 'Not found' };

  const { frontmatter } = article;
  const url = `https://dadhumor.app/blog/${frontmatter.slug}`;

  return {
    title: frontmatter.title,
    description: frontmatter.description,
    alternates: { canonical: url },
    openGraph: {
      title: frontmatter.title,
      description: frontmatter.description,
      url,
      type: 'article',
      publishedTime: frontmatter.date,
      modifiedTime: frontmatter.updated,
      authors: [frontmatter.author],
      tags: frontmatter.tags,
      ...(frontmatter.ogImage && {
        images: [{ url: frontmatter.ogImage, width: 1200, height: 630, alt: frontmatter.title }],
      }),
    },
    twitter: {
      card: 'summary_large_image',
      title: frontmatter.title,
      description: frontmatter.description,
      ...(frontmatter.ogImage && { images: [frontmatter.ogImage] }),
    },
  };
}

export default async function ArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) notFound();

  const { frontmatter, content, readingTime } = article;
  const url = `https://dadhumor.app/blog/${frontmatter.slug}`;

  const related = getArticlesByCategory(frontmatter.category)
    .filter(a => a.frontmatter.slug !== frontmatter.slug)
    .slice(0, 3);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: frontmatter.title,
    description: frontmatter.description,
    datePublished: frontmatter.date,
    dateModified: frontmatter.updated,
    author: { '@type': 'Person', name: frontmatter.author },
    publisher: {
      '@type': 'Organization',
      name: 'Dad Humor',
      url: 'https://dadhumor.app',
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    ...(frontmatter.ogImage && { image: frontmatter.ogImage }),
  };

  return (
    <main className="flex flex-col items-center min-h-screen">

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Nav */}
      <nav className="w-full max-w-3xl flex items-center justify-between px-6 py-8">
        <Logo className="text-xl" />
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link
            href="/blog"
            className="font-body text-text-secondary text-sm hover:text-text transition-colors"
          >
            ← Archive
          </Link>
        </div>
      </nav>

      {/* Header */}
      <header className="w-full max-w-3xl px-6 py-8 flex flex-col gap-5">
        <div className="flex items-center gap-3 font-body text-text-secondary text-xs uppercase tracking-widest">
          <span>{CATEGORY_LABELS[frontmatter.category]}</span>
          <span>·</span>
          <span>{formatDate(frontmatter.date)}</span>
          <span>·</span>
          <span>{readingTime}</span>
        </div>

        <h1
          className="font-display font-bold text-4xl md:text-5xl text-text leading-tight"
          style={{ letterSpacing: '-0.02em' }}
        >
          {frontmatter.title}
        </h1>

        <p className="font-body text-text-secondary text-lg md:text-xl leading-relaxed">
          {frontmatter.description}
        </p>

        <div className="flex items-center gap-3 pt-2">
          <Stache mood="pointing" size="sm" />
          <span className="font-body text-text-secondary text-sm">
            By <span className="text-text font-bold">{frontmatter.author}</span>
          </span>
        </div>
      </header>

      <div className="w-full max-w-3xl px-6">
        <div className="h-px bg-bg-border" />
      </div>

      {/* Body */}
      <article className="w-full max-w-3xl px-6 py-10">
        <MDXRemote
          source={content}
          components={mdxComponents}
          options={{
            mdxOptions: {
              remarkPlugins: [remarkGfm],
              rehypePlugins: [
                rehypeSlug,
                [rehypeAutolinkHeadings, { behavior: 'wrap' }],
              ],
            },
          }}
        />
      </article>

      {/* Tags */}
      {frontmatter.tags.length > 0 && (
        <div className="w-full max-w-3xl px-6 pb-10 flex flex-wrap gap-2">
          {frontmatter.tags.map(tag => (
            <span
              key={tag}
              className="px-3 py-1 rounded-full bg-bg-surface border border-bg-border text-text-secondary text-xs font-body"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Related */}
      {related.length > 0 && (
        <section className="w-full max-w-5xl px-6 py-16 border-t border-bg-border">
          <h2
            className="font-display font-bold text-2xl text-text mb-6"
            style={{ letterSpacing: '-0.02em' }}
          >
            More from {CATEGORY_LABELS[frontmatter.category]}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {related.map(a => (
              <ArticleCard key={a.frontmatter.slug} article={a} />
            ))}
          </div>
        </section>
      )}

      {/* CTA back to app */}
      <section className="w-full max-w-3xl px-6 py-16 flex flex-col items-center gap-4 text-center">
        <Stache mood="winking" size="md" />
        <h2
          className="font-display font-bold text-3xl text-text"
          style={{ letterSpacing: '-0.02em' }}
        >
          Enough reading. Time to groan.
        </h2>
        <Link
          href="/"
          className="px-8 py-4 rounded-2xl bg-brand-yellow text-midnight font-body font-bold text-base hover:bg-brand-yellow/90 transition-colors"
        >
          Back to the jokes →
        </Link>
      </section>

      {/* Footer */}
      <footer className="w-full border-t border-bg-border mt-auto">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-8 max-w-5xl mx-auto">
          <Logo className="text-base" />
          <div className="flex items-center gap-6">
            <Link href="/blog" className="font-body text-text-secondary text-sm hover:text-text transition-colors">
              Archive
            </Link>
            <Link href="/" className="font-body text-text-secondary text-sm hover:text-text transition-colors">
              Jokes
            </Link>
            <Link href="/privacy" className="font-body text-text-secondary text-sm hover:text-text transition-colors">
              Privacy
            </Link>
          </div>
        </div>
      </footer>

    </main>
  );
}
