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
      <div className='grid grid-cols-3 gap-4 border-b border-b-gray-500 pb-10 mb-10'>
        {/* Gallery */}
        <div className='col-span-2 grid grid-cols-2 gap-4'>
          {images.map((a, i) => (
            <div key={i} className='relative aspect-square'>
              <CFImage
                key={i}
                asset={a}
                // fill
                priority={i < 2}
                sizes='(min-width: 900px) 12vw, 25vw'
                className='object-cover'
              />
            </div>
          ))}
        </div>
        {/* Product Info */}
        <div className=''>
          <div className='flex items-center gap-4 flex-wrap'>
            {badges.map((b) => (
              <span key={b} className='uppercase'>
                {b}
              </span>
            ))}
          </div>
          <h1 className='text-2xl font-semibold'>{fields.title}</h1>
          {fields.shortDescription && (
            <p className='text-base text-gray-800'>{fields.shortDescription}</p>
          )}
          {features.length > 0 && (
            <ul className='list-disc ml-6 py-4 text-gray-700 text-sm'>
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
