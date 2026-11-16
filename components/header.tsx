import { CFEntry } from '@/lib/contentful';
import Link from 'next/link';
import CFImage from './cf-image';
import { navHref } from '@/lib/links';

type Props = {
  settings: CFEntry | null;
};

const resolved = (items?: CFEntry[]) => (items ?? []).filter((i) => i?.fields);

export default function Header({ settings }: Props) {
  const fields = settings?.fields ?? {};
  const items = resolved(fields.headerMenu?.fields.items);
  return (
    <header className='px-10 py-5 flex items-end gap-8 border-b border-b-gray-200 relative'>
      <Link href={'/'}>
        {fields.logo ? (
          <CFImage
            asset={fields.logo}
            sizes='120px'
            className='logo'
            priority
          />
        ) : (
          (fields.siteName ?? 'Store')
        )}
      </Link>
      <nav className='flex gap-4 items-center'>
        {items.map((item) => {
          const children = resolved(item.fields.children);
          return (
            <div key={item.sys.id} className='group'>
              <Link
                href={navHref(item)}
                className='py-10 relative text-gray-600 text-sm font-light  after:absolute after:top-14 after:left-0 after:h-0.5 after:w-0 after:bg-gray-500 after:transition-all after:duration-300 hover:after:w-full'
              >
                {item.fields.label}
              </Link>
              {children.length > 0 && (
                <ul className='absolute left-10 right-10 top-18 bg-white shadow invisible group-hover:visible px-10 py-5 border-t border-t-gray-200'>
                  {children.map((child) => {
                    // console.log('CHILD', child.fields);
                    // console.log('CHILD LABEL', child.fields.label);
                    // console.log('CHILD target', child.fields.target);
                    return (
                      <li key={child.sys.id}>
                        <Link
                          href={navHref(child)}
                          className='relative text-gray-600 text-sm font-light pb-0.5 after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-gray-500 after:transition-all after:duration-300 hover:after:w-full'
                        >
                          {child.fields.label}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          );
        })}
      </nav>
    </header>
  );
}
