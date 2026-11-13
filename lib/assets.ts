import { CFAsset } from './contentful';

export function assetUrl(asset?: CFAsset | null): string | null {
  const url = asset?.fields.file?.url;
  if (!url) return null;
  return url.startsWith('//') ? `https:${url}` : url;
}
