import { NextResponse } from 'next/server';
import { jokeUrl } from '@/lib/url';

export const runtime = 'edge';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
}

export async function GET() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/rpc/get_joke_of_the_day`,
      {
        method: 'POST',
        headers: {
          apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      }
    );

    if (!res.ok) {
      throw new Error(`Supabase error: ${res.status}`);
    }

    const rows = await res.json();
    const joke = Array.isArray(rows) ? rows[0] : rows;

    if (!joke) {
      return NextResponse.json(
        { error: 'No joke of the day found.' },
        { status: 404, headers: CORS_HEADERS }
      );
    }

    const today = new Date().toISOString().slice(0, 10);

    const payload = {
      date: today,
      id: joke.id,
      setup: joke.setup,
      punchline: joke.punchline,
      category: joke.category,
      slug: joke.slug,
      url: jokeUrl(joke.slug),
      stats: {
        props: joke.props_count,
        groans: joke.groans_count,
        shares: joke.share_count,
        views: joke.view_count,
      },
      attribution: 'Dad Humor — dadhumor.app',
    };

    return NextResponse.json(payload, {
      status: 200,
      headers: {
        ...CORS_HEADERS,
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
        'Content-Type': 'application/json',
      },
    });
  } catch (err) {
    console.error('joke-of-the-day error:', err);
    return NextResponse.json(
      { error: 'Something went wrong. Try again later.' },
      { status: 500, headers: CORS_HEADERS }
    );
  }
}
