import Link from 'next/link';
import type { MDXRemoteProps } from 'next-mdx-remote/rsc';

type MDXComponents = NonNullable<MDXRemoteProps['components']>;

export const mdxComponents: MDXComponents = {
  h1: props => (
    <h1
      className="font-display font-bold text-4xl md:text-5xl text-text mt-12 mb-6 first:mt-0"
      style={{ letterSpacing: '-0.02em' }}
      {...props}
    />
  ),
  h2: props => (
    <h2
      className="font-display font-bold text-2xl md:text-3xl text-text mt-10 mb-4"
      style={{ letterSpacing: '-0.02em' }}
      {...props}
    />
  ),
  h3: props => (
    <h3
      className="font-display font-bold text-xl md:text-2xl text-text mt-8 mb-3"
      {...props}
    />
  ),
  p: props => <p className="font-body text-text-secondary leading-relaxed my-4" {...props} />,
  ul: props => <ul className="list-disc list-outside ml-6 my-4 flex flex-col gap-2 text-text-secondary" {...props} />,
  ol: props => <ol className="list-decimal list-outside ml-6 my-4 flex flex-col gap-2 text-text-secondary" {...props} />,
  li: props => <li className="font-body leading-relaxed" {...props} />,
  blockquote: props => (
    <blockquote
      className="border-l-4 border-brand-yellow pl-6 py-2 my-6 font-body italic text-text"
      {...props}
    />
  ),
  a: ({ href = '', ...props }) => {
    const isExternal = href.startsWith('http');
    if (isExternal) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-reaction-cyan underline underline-offset-2 hover:text-reaction-cyan/80"
          {...props}
        />
      );
    }
    return (
      <Link
        href={href}
        className="text-reaction-cyan underline underline-offset-2 hover:text-reaction-cyan/80"
        {...props}
      />
    );
  },
  code: props => (
    <code
      className="font-mono text-sm bg-bg-surface text-brand-yellow px-1.5 py-0.5 rounded"
      {...props}
    />
  ),
  pre: props => (
    <pre
      className="font-mono text-sm bg-bg-surface border border-bg-border rounded-2xl p-4 my-6 overflow-x-auto"
      {...props}
    />
  ),
  hr: () => <hr className="my-10 border-bg-border" />,
  strong: props => <strong className="font-bold text-text" {...props} />,
};
