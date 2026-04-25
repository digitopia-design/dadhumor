import { NextResponse } from 'next/server';

const MAILERLITE_API = 'https://connect.mailerlite.com/api';

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }

  const { email } = body as Record<string, unknown>;

  if (!email || typeof email !== 'string' || !email.includes('@')) {
    return NextResponse.json({ error: 'Valid email required' }, { status: 400 });
  }

  const apiKey = process.env.MAILERLITE_API_KEY;
  const groupId = process.env.MAILERLITE_FD_GROUP_ID;

  if (!apiKey || !groupId) {
    console.error('Missing MAILERLITE_API_KEY or MAILERLITE_FD_GROUP_ID');
    return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
  }

  const res = await fetch(`${MAILERLITE_API}/subscribers`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
      'Accept': 'application/json',
    },
    body: JSON.stringify({
      email: email.toLowerCase().trim(),
      groups: [groupId],
      status: 'active',
    }),
  });

  // MailerLite returns 200 (update) or 201 (create) on success
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    console.error('MailerLite error:', res.status, data);

    // 422 = validation error (e.g. invalid email format)
    if (res.status === 422) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 422 });
    }

    return NextResponse.json({ error: 'Subscription failed' }, { status: 500 });
  }

  return NextResponse.json({ ok: true }, { status: 200 });
}
