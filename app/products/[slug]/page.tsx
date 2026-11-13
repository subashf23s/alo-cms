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
  return (
    <article>
      <h1>{slug}</h1>
    </article>
  );
}
