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
                className='py-10 relative text-gray-600 text-lg font-light  hover:underline'
              >
                {item.fields.label}
              </Link>
              {children.length > 0 && (
                <div className='absolute left-10 right-10 top-18 bg-white shadow invisible group-hover:visible px-10 py-5 border-t border-t-gray-200'>
                  <div className='grid grid-cols-6'>
                    {children.map((child) => {
                      const grandChildren = resolved(child.fields.children);
                      return (
                        <ul key={child.sys.id}>
                          <li className='pb-3'>
                            <Link
                              href={navHref(child)}
                              className='relative text-black text-base font-light hover:underline'
                            >
                              {child.fields.label}
                            </Link>
                          </li>
                          {grandChildren.length > 0 && (
                            <>
                              {grandChildren.map((grandChild) => (
                                <li key={grandChild.sys.id} className='pb-1'>
                                  <Link
                                    href={navHref(grandChild)}
                                    className='relative text-gray-600 text-base font-light hover:underline'
                                  >
                                    {grandChild.fields.label}
                                  </Link>
                                </li>
                              ))}
                            </>
                          )}
                        </ul>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </nav>
    </header>
  );
}
