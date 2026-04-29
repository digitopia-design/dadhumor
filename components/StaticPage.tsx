import Link from 'next/link';
import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import { Logo } from '@/components/Logo';
import { ThemeToggle } from '@/components/ThemeToggle';
import { mdxComponents } from '@/components/mdx';
import { getPageBySlug } from '@/lib/content';

interface StaticPageProps {
  slug: string;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export async function StaticPage({ slug }: StaticPageProps) {
  const page = getPageBySlug(slug);
  if (!page) notFound();

  const { frontmatter, content } = page;

  return (
    <main className="flex min-h-screen flex-col items-center px-6 py-12">
      <div className="w-full max-w-2xl flex flex-col gap-8">
        <header className="flex items-center justify-between">
          <Logo className="text-xl" />
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link
              href="/"
              className="font-body text-text-secondary text-sm hover:text-text transition-colors"
            >
              ← Back
            </Link>
          </div>
        </header>

        <div className="flex flex-col gap-3">
          <h1
            className="font-display font-bold text-4xl md:text-5xl text-text leading-tight"
            style={{ letterSpacing: '-0.02em' }}
          >
            {frontmatter.title}
          </h1>
          <p className="font-body text-text-tertiary text-sm">
            Last updated: {formatDate(frontmatter.updated)}
          </p>
        </div>

        <article className="font-body text-text-secondary leading-relaxed">
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

        <div className="flex items-center gap-6 pt-4 border-t border-bg-border">
          <Link href="/privacy" className="font-body text-text-secondary text-sm hover:text-text transition-colors">
            Privacy
          </Link>
          <Link href="/terms" className="font-body text-text-secondary text-sm hover:text-text transition-colors">
            Terms
          </Link>
          <Link href="/blog" className="font-body text-text-secondary text-sm hover:text-text transition-colors">
            Archive
          </Link>
          <Link href="/" className="font-body text-text-secondary text-sm hover:text-text transition-colors">
            Jokes →
          </Link>
        </div>
      </div>
    </main>
  );
}
