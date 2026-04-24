import Link from 'next/link';
import { Stache } from '@/components/Stache';

export const metadata = {
  title: 'Lost the plot — Dad Humor',
  description: "This page walked into a bar. It's not there anymore.",
};

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-8 px-6 text-center">
      <Stache mood="shrugging" size="lg" priority />

      <div className="flex flex-col gap-3 max-w-sm">
        <h1 className="font-display font-bold text-5xl text-yellow">404</h1>
        <p className="font-display font-bold text-2xl text-white">
          This page walked into a bar.
        </p>
        <p className="font-body text-smoke text-lg">
          {"It's not there anymore."}
        </p>
      </div>

      <Link
        href="/"
        className="px-8 py-4 rounded-2xl bg-yellow text-midnight font-body font-bold text-lg hover:bg-yellow/90 transition-colors"
      >
        Back to the jokes →
      </Link>
    </main>
  );
}
