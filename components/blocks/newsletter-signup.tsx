'use client';
import React, { useState } from 'react';
import { Section } from '../layout/section';
import { Card } from '../ui/card';
import type { Template } from 'tinacms';
import { sectionBlockSchemaField } from '../layout/section';

export const NewsletterSignup = () => {
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
    <Section>
      <div className="container my-12">
        <Card className="p-6 lg:p-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h3 className="text-xl font-semibold">Subscribe to YakShaver</h3>
              <p className="text-sm text-muted-foreground">
                Practical engineering tips and product updates. No spam—just yaks shaved.
              </p>
            </div>
            <form onSubmit={onSubmit} className="flex w-full max-w-md gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                className="flex-1 rounded-md border bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-ring"
                aria-label="Email address"
              />
              <button
                type="submit"
                className="rounded-md bg-primary px-4 py-2 text-primary-foreground hover:opacity-90"
              >
                Sign up
              </button>
            </form>
          </div>
          {status === 'success' && (
            <p className="mt-3 text-sm text-green-600">Thanks for subscribing!</p>
          )}
          {status === 'error' && (
            <p className="mt-3 text-sm text-red-600">Please enter a valid email.</p>
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
    defaultItem: {},
  },
  fields: [
    sectionBlockSchemaField as any,
  ],
};


