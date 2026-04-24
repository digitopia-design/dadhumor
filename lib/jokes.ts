import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export type Joke = {
  id: number;
  setup: string;
  punchline: string;
  category: string;
  rating: string;
  slug: string;
  props_count: number;
  groans_count: number;
  stash_count: number;
  share_count: number;
  view_count: number;
  image_url: string | null;
  audio_url: string | null;
  created_at: string;
  updated_at: string;
};

export async function getRandomJoke(excludeIds: number[] = []): Promise<Joke | null> {
  try {
    const { data, error } = await supabase.rpc('get_random_joke', {
      exclude_ids: excludeIds,
    });
    if (error) throw error;
    return data?.[0] ?? null;
  } catch (err) {
    console.error('getRandomJoke:', err);
    return null;
  }
}

export async function getJokeBySlug(slug: string): Promise<Joke | null> {
  try {
    const { data, error } = await supabase.rpc('get_joke_by_slug', {
      slug_param: slug,
    });
    if (error) throw error;
    return data?.[0] ?? null;
  } catch (err) {
    console.error('getJokeBySlug:', err);
    return null;
  }
}

export async function getJokeById(id: number): Promise<Joke | null> {
  try {
    const { data, error } = await supabase.rpc('get_joke_by_id', {
      id_param: id,
    });
    if (error) throw error;
    return data?.[0] ?? null;
  } catch (err) {
    console.error('getJokeById:', err);
    return null;
  }
}

export async function giveProps(jokeId: number): Promise<number> {
  try {
    const { data, error } = await supabase.rpc('increment_props', {
      joke_id: jokeId,
    });
    if (error) throw error;
    return data ?? 0;
  } catch (err) {
    console.error('giveProps:', err);
    return 0;
  }
}

export async function giveGroan(jokeId: number): Promise<number> {
  try {
    const { data, error } = await supabase.rpc('increment_groans', {
      joke_id: jokeId,
    });
    if (error) throw error;
    return data ?? 0;
  } catch (err) {
    console.error('giveGroan:', err);
    return 0;
  }
}

export async function recordShare(jokeId: number): Promise<number> {
  try {
    const { data, error } = await supabase.rpc('increment_shares', {
      joke_id: jokeId,
    });
    if (error) throw error;
    return data ?? 0;
  } catch (err) {
    console.error('recordShare:', err);
    return 0;
  }
}

export async function getTopJokes(
  metric: 'props' | 'groans' | 'shares' | 'views',
  limit = 10
): Promise<Joke[]> {
  try {
    const { data, error } = await supabase.rpc('get_top_jokes', {
      by_metric: metric,
      limit_count: limit,
    });
    if (error) throw error;
    return data ?? [];
  } catch (err) {
    console.error('getTopJokes:', err);
    return [];
  }
}
