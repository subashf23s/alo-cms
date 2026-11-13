import { createClient } from 'contentful';
import { cacheLife, cacheTag } from 'next/cache';
import { draftMode } from 'next/headers';

export type CFAsset = {
  fields: {
    title?: string;
    description?: string;
    file?: {
      url: string;
      contentType?: string;
      details?: { image?: { width: number; height: number } };
    };
  };
};
export type CFEntry = {
  sys: { id: string; contentType?: { sys: { id: string } } };
  fields: Record<string, any>;
};
const space = process.env.CONTENTFUL_SPACE_ID ?? '';
const environment = process.env.CONTENTFUL_ENVIRONMENT ?? 'master';

export const isConfigured = Boolean(
  space && process.env.CONTENTFUL_DELIVERY_TOKEN,
);

function clientFor(preview: boolean) {
  return createClient(
    preview
      ? {
          space,
          environment,
          accessToken: process.env.CONTENTFUL_PREVIEW_TOKEN ?? '',
          host: 'preview.contentful.com',
        }
      : {
          space,
          environment,
          accessToken: process.env.CONTENTFUL_DELIVERY_TOKEN ?? '',
        },
  );
}

function plain<T>(value: T, ancestors = new WeakSet<object>()): T {
  if (value === null || typeof value !== 'object') return value;
  const obj = value as unknown as object;
  if (ancestors.has(obj)) return undefined as T;
  ancestors.add(obj);
  const out = Array.isArray(value)
    ? value.map((v) => plain(v, ancestors))
    : Object.fromEntries(
        Object.entries(value as Record<string, unknown>).map(([k, v]) => [
          k,
          plain(v, ancestors),
        ]),
      );
  ancestors.delete(obj);
  return out as T;
}

async function load(
  preview: boolean,
  params: Record<string, unknown>,
): Promise<CFEntry[]> {
  const res = await clientFor(preview).getEntries(params as never);
  return plain(res.items) as unknown as CFEntry[];
}
async function loadPublished(
  params: Record<string, unknown>,
): Promise<CFEntry[]> {
  'use cache';
  cacheLife('hours');
  cacheTag('contentful');
  return load(false, params);
}
async function query(
  key: string,
  params: Record<string, unknown>,
): Promise<CFEntry[]> {
  if (!isConfigured) return [];
  const { isEnabled } = await draftMode();
  try {
    return isEnabled ? await load(true, params) : await loadPublished(params);
  } catch (error) {
    console.error(`[contentful] query "${key}" failed`, error);
    return [];
  }
}
const first = (items: CFEntry[]) => items[0] ?? null;
export const getProduct = async (slug: string) =>
  first(
    await query(`product:${slug}`, {
      content_type: 'product',
      'fields.slug': slug,
      include: 3,
      limit: 1,
    }),
  );
