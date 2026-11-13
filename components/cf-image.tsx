import { assetUrl } from '@/lib/assets';
import { CFAsset } from '@/lib/contentful';
import Image from 'next/image';

type Props = {
  asset?: CFAsset | null;
  sizes?: string;
  priority?: boolean;
  fill?: boolean;
  className?: string;
};

export default function CFImage({
  asset,
  sizes = '100vw',
  priority = false,
  fill = false,
  className,
}: Props) {
  const src = assetUrl(asset);
  if (!src || !asset) return null;
  const dims = asset.fields.file?.details?.image;
  return (
    <Image
      src={src}
      alt={asset.fields.description || asset.fields.title || ''}
      //   width={dims?.width ?? 1200}
      //   height={dims?.height ?? 800}
      sizes={sizes}
      priority={priority}
      fill={fill}
      className={className}
    />
  );
}
