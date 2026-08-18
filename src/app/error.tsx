'use client';

import * as React from 'react';
import { Container } from '@/components/layouts/container';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RotateCcw } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center py-24">
      <Container size="sm" className="text-center space-y-6">
        <div className="inline-flex p-4 rounded-2xl bg-rose-500/10 text-rose-500 border border-rose-500/20">
          <AlertTriangle className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            Something went wrong!
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            {error.message || 'An unexpected error occurred while loading this page.'}
          </p>
        </div>
        <div className="pt-2">
          <Button
            onClick={() => reset()}
            variant="primary"
            leftIcon={<RotateCcw className="w-4 h-4" />}
          >
            Try Again
          </Button>
        </div>
      </Container>
    </div>
  );
}
