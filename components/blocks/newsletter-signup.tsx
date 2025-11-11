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

  const isGrayBg = data.background?.includes('gray') || data.background?.includes('#222222');
  
  return (
    <Section background={data.background as any}>
      <div className={`container ${isGrayBg ? 'my-12 lg:my-16' : 'my-12'}`}>
        <Card className={`relative border backdrop-blur-sm overflow-hidden transition-all duration-300 ${
          isGrayBg
            ? 'border-red-900/30 bg-[#1a1a1a] p-10 lg:p-12 hover:border-red-700/50 hover:shadow-xl hover:shadow-red-900/40 rounded-2xl'
            : 'border-red-900/20 bg-[#1a1a1a] p-8 lg:p-10 hover:border-red-700/40 hover:shadow-xl hover:shadow-red-900/30'
        }`}>
          {/* Subtle accent line */}
          <div className={`absolute top-0 left-0 w-full bg-gradient-to-r from-transparent via-red-600/40 to-transparent opacity-0 hover:opacity-100 transition-opacity ${
            isGrayBg ? 'h-1 rounded-t-2xl' : 'h-px'
          }`} />
          
          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex-1">
              <h3
                className={`font-bold text-white mb-2 ${isGrayBg ? 'text-3xl lg:text-4xl' : 'text-2xl lg:text-3xl'}`}
                data-tina-field={tinaField(data, 'title')}
              >
                {data.title || 'Subscribe to our newsletter'}
              </h3>
              <p
                className={`text-gray-300 ${isGrayBg ? 'text-base lg:text-lg' : 'text-sm lg:text-base'}`}
                data-tina-field={tinaField(data, 'description')}
              >
                {data.description || 'Get the latest updates and articles delivered to your inbox.'}
              </p>
            </div>
            
            <form onSubmit={onSubmit} className="flex w-full max-w-md gap-3 flex-col sm:flex-row">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={data.placeholder || 'you@example.com'}
                className="flex-1 rounded-lg border border-red-900/30 bg-[#0a0a0a] px-4 py-3 text-white placeholder-gray-500 outline-none transition-all duration-200 focus:border-red-700/40 focus:ring-2 focus:ring-red-900/30"
                aria-label="Email address"
                data-tina-field={tinaField(data, 'placeholder')}
              />
              <button
                type="submit"
                className="px-6 py-3 font-semibold text-white bg-gradient-to-r from-red-700 to-red-900 rounded-lg transition-all duration-300 hover:from-red-600 hover:to-red-800 hover:shadow-lg hover:shadow-red-900/50 hover:scale-105 whitespace-nowrap"
                data-tina-field={tinaField(data, 'buttonText')}
              >
                {data.buttonText || 'Sign up'}
              </button>
            </form>
          </div>
          
          {status === 'success' && (
            <div className="relative mt-4 p-3 rounded-lg bg-green-950/20 border border-green-700/30">
              <p className="text-sm text-green-400 font-medium">
                {data.successMessage || 'Thanks for subscribing!'}
              </p>
            </div>
          )}
          {status === 'error' && (
            <div className="relative mt-4 p-3 rounded-lg bg-red-950/20 border border-red-700/30">
              <p className="text-sm text-red-400 font-medium">
                {data.errorMessage || 'Please enter a valid email.'}
              </p>
            </div>
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


