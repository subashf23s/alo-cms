import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import Header from '@/components/header';
import Footer from '@/components/footer';
import { getSiteSettings } from '@/lib/contentful';
import { assetUrl } from '@/lib/assets';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export async function generateMetadata(): Promise<Metadata> {
  const fields = (await getSiteSettings()).fields;
  const name: string = fields?.siteName ?? 'Store';
  const image = assetUrl(fields?.logo);
  return {
    metadataBase: new URL(
      process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000',
    ),
    title: {
      default: fields?.defaultSeoTitle ?? name,
      template: `%s | ${name}`,
    },
    description: fields?.defaultSeoDescription,
    openGraph: { siteName: name, images: image ? [image] : undefined },
  };
}

export default async function RootLayout({ children }: LayoutProps<'/'>) {
  const settings = await getSiteSettings();
  // console.log('SETTINS', settings);
  return (
    <html
      lang='en'
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className='min-h-full flex flex-col'>
        <Header settings={settings} />
        <main className='p-10'>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
