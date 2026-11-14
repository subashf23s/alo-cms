import CFImage from '@/components/cf-image';
import RichText from '@/components/rich-text';
import { getAllSlugs, getCategory } from '@/lib/contentful';
import { seoMetadata } from '@/lib/seo';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';

type CategoriesPageProps = Pick<PageProps<'/categories/[slug]'>, 'params'>;

export async function generateStaticParams() {
  return (await getAllSlugs('category')).map((slug) => {
    return { slug };
  });
}
export async function generateMetadata({
  params,
}: CategoriesPageProps): Promise<Metadata> {
  const { slug } = await params;
  return seoMetadata((await getCategory(slug))?.fields);
}

export default function CategoriesPage({ params }: CategoriesPageProps) {
  return (
    <Suspense fallback={<CategoriesPageSkeleton />}>
      <CategoriesPageView params={params} />
    </Suspense>
  );
}
function CategoriesPageSkeleton() {
  return <section>Loading...</section>;
}
async function CategoriesPageView({ params }: CategoriesPageProps) {
  const { slug } = await params;
  const category = await getCategory(slug);
  if (!category) notFound();
  const fields = category.fields;
  return (
    <>
      <section className='text-center'>
        <h1 className='text-2xl font-semibold'>{fields.name}</h1>
        <RichText document={fields.intro} />
      </section>
    </>
  );
}
