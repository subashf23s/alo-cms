import { Document } from '@contentful/rich-text-types';
import {
  documentToReactComponents,
  Options,
} from '@contentful/rich-text-react-renderer';
import React from 'react';

const options: Options = {};

type Props = {
  document?: Document | null;
};

export default function RichText({ document }: Props) {
  if (!document) return null;
  return (
    <div className='prose'> {documentToReactComponents(document, options)}</div>
  );
}
