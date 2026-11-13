import { Metadata } from 'next';
import { assetUrl } from './assets';

export function seoMetadata(f: Record<string, any> | null): Metadata {
  if (!f) return {};
  const title: string | undefined = f.seoTitle ?? f.title ?? f.name;
  const description: string | undefined =
    f.seoDescription ?? f.shortDescription ?? f.excerpt;
  const image =
    assetUrl(f.seoImage) ?? assetUrl(f.coverImage) ?? assetUrl(f.bannerImage);
  return {
    title,
    description,
    openGraph: { title, description, images: image ? [image] : undefined },
  };
}
