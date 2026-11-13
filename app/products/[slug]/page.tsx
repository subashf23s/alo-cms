import CFImage from '@/components/cf-image';
import RichText from '@/components/rich-text';
import { CFAsset, getProduct } from '@/lib/contentful';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';

type ProductPageProps = Pick<PageProps<'/products/[slug]'>, 'params'>;
export default function ProductPage({ params }: ProductPageProps) {
  return (
    <Suspense fallback={<ProductPageSkeleton />}>
      <ProductPageView params={params} />
    </Suspense>
  );
}

function ProductPageSkeleton() {
  return <article>Loading</article>;
}

async function ProductPageView({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) notFound();
  const fields = product.fields;
  const gallery: CFAsset[] = (fields.gallery ?? []).filter(
    (a: CFAsset) => a.fields.file,
  );
  const images = gallery.filter((a) =>
    a.fields.file?.contentType?.startsWith('image/'),
  );
  const videos = gallery.filter((a) =>
    a.fields.file?.contentType?.startsWith('video/'),
  );
  const specs = Object.entries((fields.specs ?? {}) as Record<string, unknown>);
  const badges: string[] = fields.badges ?? [];
  const features: string[] = fields.features ?? [];
  return (
    <article>
      <h1>{slug}</h1>
      {/* <pre>{JSON.stringify(fields)}</pre> */}
      {/* Product Layout */}
      <div className='grid grid-cols-7'>
        {/* Gallery */}
        <div className='col-span-4 grid grid-cols-2 gap-4'>
          {images.map((a, i) => (
            <div key={i} className='relative aspect-4/5 w-full h-125'>
              <CFImage
                key={i}
                asset={a}
                fill
                priority={i < 2}
                sizes='(min-width: 900px) 12vw, 25vw'
                className='object-contain'
              />
            </div>
          ))}
        </div>
        {/* Product Info */}
        <div className='col-span-3'>
          <div className='flex items-center gap-4 flex-wrap'>
            {badges.map((b) => (
              <span key={b} className='uppercase'>
                {b}
              </span>
            ))}
          </div>
          <h1>{fields.title}</h1>
          {fields.shortDescription && <p>{fields.shortDescription}</p>}
          {features.length > 0 && (
            <ul>
              {features.map((x) => (
                <li key={x}>{x}</li>
              ))}
            </ul>
          )}
        </div>
      </div>
      <RichText document={fields.description} />
    </article>
  );
}
