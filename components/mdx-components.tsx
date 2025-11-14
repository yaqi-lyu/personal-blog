import { format } from 'date-fns';
import React from 'react';
import { Components, TinaMarkdown, TinaMarkdownContent } from 'tinacms/dist/rich-text';
import Image from 'next/image';
import { Prism } from 'tinacms/dist/rich-text/prism';
import { Video } from './blocks/video';
import { PageBlocksVideo } from '@/tina/__generated__/types';
import { Mermaid } from './blocks/mermaid';

// Helper function to generate ID from text
const generateId = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
};

// Helper function to extract text from TinaMarkdown content
const extractText = (children: any): string => {
  if (!children) return '';
  if (typeof children === 'string') return children;
  if (typeof children === 'number') return String(children);

  if (Array.isArray(children)) {
    return children.map(extractText).join('');
  }

  // Handle React elements
  if (React.isValidElement(children)) {
    // Check if it's a TinaMarkdown component with content prop
    if ((children as any).props?.content) {
      // Content is an array of text nodes
      return extractText((children as any).props.content);
    }
    // Otherwise extract from children
    return extractText((children as any).props?.children);
  }

  // Handle TinaCMS content nodes with text property
  if ((children as any)?.type === 'text' && (children as any)?.text) {
    return (children as any).text;
  }

  // Handle objects with children property
  if ((children as any)?.props?.children) {
    return extractText((children as any).props.children);
  }

  // Handle objects with text property (TinaCMS format)
  if ((children as any)?.text && typeof (children as any).text === 'string') {
    return (children as any).text;
  }

  // Handle objects with value property
  if ((children as any)?.value) {
    return String((children as any).value);
  }

  return '';
};

// Custom heading components with IDs
const createHeading = (level: 1 | 2 | 3 | 4 | 5 | 6) => {
  const HeadingComponent = (props: any) => {
    const text = extractText(props.children);
    const id = generateId(text);
    const Tag = `h${level}` as keyof JSX.IntrinsicElements;

    return React.createElement(Tag, { id, 'data-heading-id': id, className: 'scroll-mt-24' }, props.children);
  };

  HeadingComponent.displayName = `Heading${level}`;
  return HeadingComponent;
};

export const components: Components<{
  BlockQuote: {
    children: TinaMarkdownContent;
    authorName: string;
  };
  DateTime: {
    format?: string;
  };
  NewsletterSignup: {
    placeholder: string;
    buttonText: string;
    children: TinaMarkdownContent;
    disclaimer?: TinaMarkdownContent;
  };
  video: PageBlocksVideo;
}> = {
  h1: createHeading(1) as any,
  h2: createHeading(2) as any,
  h3: createHeading(3) as any,
  h4: createHeading(4) as any,
  h5: createHeading(5) as any,
  h6: createHeading(6) as any,
  code_block: (props) => {
    if (!props) {
      return <></>;
    }
    
    if (props.lang === 'mermaid') {
      return <Mermaid value={props.value} />
    }

    return <Prism lang={props.lang} value={props.value} />;
  },
  BlockQuote: (props: {
    children: TinaMarkdownContent;
    authorName: string;
  }) => {
    return (
      <div>
        <blockquote>
          <TinaMarkdown content={props.children} />
          {props.authorName}
        </blockquote>
      </div>
    );
  },
  DateTime: (props) => {
    const dt = React.useMemo(() => {
      return new Date();
    }, []);

    switch (props.format) {
      case 'iso':
        return <span>{format(dt, 'yyyy-MM-dd')}</span>;
      case 'utc':
        return <span>{format(dt, 'eee, dd MMM yyyy HH:mm:ss OOOO')}</span>;
      case 'local':
        return <span>{format(dt, 'P')}</span>;
      default:
        return <span>{format(dt, 'P')}</span>;
    }
  },
  NewsletterSignup: (props) => {
    return (
      <div className='bg-zinc-950 py-8'>
        <div className='max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4'>
          <div className='text-gray-200'>
            <TinaMarkdown content={props.children} />
          </div>
          <form className='flex flex-col sm:flex-row gap-3'>
            <label htmlFor='email-address' className='sr-only'>
              Email address
            </label>
            <input
              id='email-address'
              name='email-address'
              type='email'
              autoComplete='email'
              required
              className='flex-1 px-4 py-2 border border-zinc-700 rounded-md bg-zinc-900 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-600'
              placeholder={props.placeholder}
            />
            <button
              type='submit'
              className='px-6 py-2 bg-gradient-to-r from-red-700 to-red-900 text-white font-medium rounded-md hover:from-red-600 hover:to-red-800 transition-all duration-300 whitespace-nowrap'
            >
              {props.buttonText}
            </button>
          </form>
          {props.disclaimer && (
            <div className='text-sm text-gray-400 mt-2'>
              <TinaMarkdown content={props.disclaimer} />
            </div>
          )}
        </div>
      </div>
    );
  },
  img: (props) => {
    if (!props) {
      return <></>;
    }
    return (
      <span className='flex items-center justify-center'>
        <Image src={props.url} alt={props.alt || ''} width={500} height={500} />
      </span>
    );
  },
  mermaid: (props: any) => <Mermaid {...props} />,
  video: (props) => {
    return <Video data={props} />;
  },
};
