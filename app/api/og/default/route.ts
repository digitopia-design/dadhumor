import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET() {
  const svg = `<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <rect width="1200" height="630" fill="#121212"/>
  <text x="600" y="260" font-family="sans-serif" font-weight="bold" font-size="80" fill="#E3FF00" text-anchor="middle">Dad Humor</text>
  <text x="600" y="360" font-family="sans-serif" font-size="36" fill="#A0A0A0" text-anchor="middle">Professionally unfunny since 2026.</text>
  <text x="600" y="440" font-family="sans-serif" font-size="28" fill="#333333" text-anchor="middle">dadhumor.app</text>
</svg>`;

  return new NextResponse(svg, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=86400',
    },
  });
}
