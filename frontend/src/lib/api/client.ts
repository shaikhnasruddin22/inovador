/**
 * Centralized Strapi API Client and Data Fetching Layer
 * Follows AGENTS.md, Architecture.md, and Phase 3 specifications.
 */

import { StrapiMedia } from '@/types/strapi';

const STRAPI_API_URL = process.env.STRAPI_API_URL || 'http://localhost:1337';
const STRAPI_READ_TOKEN = process.env.STRAPI_READ_TOKEN;

export function getStrapiURL(path = ''): string {
  return `${STRAPI_API_URL}${path.startsWith('/') ? path : `/${path}`}`;
}

export function getMediaUrl(media?: StrapiMedia | string | null): string | undefined {
  if (!media) return undefined;
  if (typeof media === 'string') return media;

  let url: string | undefined = undefined;

  if (media.url) {
    url = media.url;
  } else if (media.attributes?.url) {
    url = media.attributes.url;
  } else if (media.data && !Array.isArray(media.data)) {
    url = media.data.attributes?.url || media.data.url;
  }

  if (!url) return undefined;
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  return `${STRAPI_API_URL}${url}`;
}

export function getMediaGalleryUrls(
  gallery?: (StrapiMedia | string)[] | { data: StrapiMedia[] } | null
): string[] {
  if (!gallery) return [];
  if (Array.isArray(gallery)) {
    return gallery
      .map((item) => getMediaUrl(item))
      .filter((url): url is string => Boolean(url));
  }
  if (gallery.data && Array.isArray(gallery.data)) {
    return gallery.data
      .map((item) => getMediaUrl(item))
      .filter((url): url is string => Boolean(url));
  }
  return [];
}

export interface FetchAPIOptions extends RequestInit {
  params?: Record<string, unknown>;
  tags?: string[];
  revalidate?: number | false;
}

export async function fetchAPI<T = unknown>(
  path: string,
  options: FetchAPIOptions = {}
): Promise<{ data: T; meta?: Record<string, unknown> }> {
  const { params, tags, revalidate = 3600, headers = {}, ...rest } = options;

  let requestUrl = getStrapiURL(path);
  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (Array.isArray(val)) {
        val.forEach((item, idx) => {
          searchParams.append(`${key}[${idx}]`, String(item));
        });
      } else if (typeof val === 'object' && val !== null) {
        Object.entries(val).forEach(([subKey, subVal]) => {
          searchParams.append(`${key}[${subKey}]`, String(subVal));
        });
      } else if (val !== undefined && val !== null) {
        searchParams.append(key, String(val));
      }
    });
    const queryString = searchParams.toString();
    if (queryString) {
      requestUrl += `?${queryString}`;
    }
  }

  const requestHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    ...(headers as Record<string, string>),
  };

  // Attach server-side token if present and not a dummy/placeholder value
  if (
    STRAPI_READ_TOKEN &&
    !STRAPI_READ_TOKEN.toLowerCase().includes('placeholder') &&
    !STRAPI_READ_TOKEN.toLowerCase().includes('your_strapi')
  ) {
    requestHeaders['Authorization'] = `Bearer ${STRAPI_READ_TOKEN}`;
  }

  try {
    const res = await fetch(requestUrl, {
      ...rest,
      headers: requestHeaders,
      next: {
        tags: tags || [],
        revalidate: typeof revalidate === 'number' ? revalidate : undefined,
      },
    });

    if (!res.ok) {
      console.error(`[Strapi API Error] ${res.status} ${res.statusText} on ${path}`);
      throw new Error(`Failed to fetch from Strapi: ${res.status} ${res.statusText}`);
    }

    const json = await res.json();
    return json;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`[Strapi API Network Error] ${path}:`, message);
    throw err;
  }
}
