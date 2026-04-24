import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          height: '100%',
          background: '#121212',
          gap: '24px',
          fontFamily: 'sans-serif',
        }}
      >
        <span style={{ fontSize: 80, fontWeight: 700, color: '#E3FF00' }}>
          Dad Humor
        </span>
        <span style={{ fontSize: 36, color: '#A0A0A0' }}>
          Professionally unfunny since 2026.
        </span>
        <span style={{ fontSize: 24, color: '#333333' }}>dadhumor.app</span>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
