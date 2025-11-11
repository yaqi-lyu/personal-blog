'use client';
import React, { useState } from 'react';
import { Section } from '../layout/section';
import { Card } from '../ui/card';
import type { Template } from 'tinacms';
import { sectionBlockSchemaField } from '../layout/section';
import { tinaField } from 'tinacms/dist/react';
import { PageBlocksNewsletter } from '@/tina/__generated__/types';

export const NewsletterSignup = ({ data }: { data: PageBlocksNewsletter }) => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && /\S+@\S+\.\S+/.test(email)) {
      setStatus('success');
      setEmail('');
    } else {
      setStatus('error');
    }
  };

  return (
    <Section background={data.background as any}>
      <div className="container my-12">
        <Card className="p-6 lg:p-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h3
                className="text-xl font-semibold"
                data-tina-field={tinaField(data, 'title')}
              >
                {data.title || 'Subscribe to our newsletter'}
              </h3>
              <p
                className="text-sm text-muted-foreground"
                data-tina-field={tinaField(data, 'description')}
              >
                {data.description || 'Get the latest updates and articles delivered to your inbox.'}
              </p>
            </div>
            <form onSubmit={onSubmit} className="flex w-full max-w-md gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={data.placeholder || 'you@example.com'}
                className="flex-1 rounded-md border bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-ring"
                aria-label="Email address"
                data-tina-field={tinaField(data, 'placeholder')}
              />
              <button
                type="submit"
                className="rounded-md bg-primary px-4 py-2 text-primary-foreground hover:opacity-90"
                data-tina-field={tinaField(data, 'buttonText')}
              >
                {data.buttonText || 'Sign up'}
              </button>
            </form>
          </div>
          {status === 'success' && (
            <p className="mt-3 text-sm text-green-600">
              {data.successMessage || 'Thanks for subscribing!'}
            </p>
          )}
          {status === 'error' && (
            <p className="mt-3 text-sm text-red-600">
              {data.errorMessage || 'Please enter a valid email.'}
            </p>
          )}
        </Card>
      </div>
    </Section>
  );
}

export const newsletterBlockSchema: Template = {
  name: 'newsletter',
  label: 'Newsletter Signup',
  ui: {
    previewSrc: '/blocks/content.png',
    defaultItem: {
      title: 'Subscribe to our newsletter',
      description: 'Get the latest updates and articles delivered to your inbox.',
      placeholder: 'you@example.com',
      buttonText: 'Sign up',
      successMessage: 'Thanks for subscribing!',
      errorMessage: 'Please enter a valid email.',
    },
  },
  fields: [
    sectionBlockSchemaField as any,
    {
      type: 'string',
      label: 'Title',
      name: 'title',
    },
    {
      type: 'string',
      label: 'Description',
      name: 'description',
      ui: {
        component: 'textarea',
      },
    },
    {
      type: 'string',
      label: 'Email Placeholder',
      name: 'placeholder',
    },
    {
      type: 'string',
      label: 'Button Text',
      name: 'buttonText',
    },
    {
      type: 'string',
      label: 'Success Message',
      name: 'successMessage',
    },
    {
      type: 'string',
      label: 'Error Message',
      name: 'errorMessage',
    },
  ],
};


