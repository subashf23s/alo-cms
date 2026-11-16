import { CFEntry } from './contentful';

export function hrefFor(entry?: CFEntry | null): string | null {
  const slug = entry?.fields?.slug as string | undefined;
  if (!entry || !slug) return null;
  switch (entry.sys.contentType?.sys.id) {
    case 'category':
      return `/categories/${slug}`;
    case 'product':
      return `/products/${slug}`;

    default:
      return null;
  }
}

export function navHref(item: CFEntry): string {
  return item.fields.externalUrl ?? hrefFor(item.fields.target) ?? '#';
}
