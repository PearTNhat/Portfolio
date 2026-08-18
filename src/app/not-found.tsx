import Link from 'next/link';
import { Container } from '@/components/layouts/container';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Terminal } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[75vh] flex items-center justify-center py-24">
      <Container size="sm" className="text-center space-y-6">
        <div className="inline-flex p-4 rounded-2xl bg-cyan-500/10 text-cyan-500 border border-cyan-500/20">
          <Terminal className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <div className="text-sm font-mono text-cyan-500 uppercase tracking-wider font-semibold">
            Error 404 • Block Not Found
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">
            Page Does Not Exist
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto">
            The requested route or hash could not be resolved on this network node.
          </p>
        </div>
        <div className="pt-2">
          <Link href="/">
            <Button variant="primary" leftIcon={<ArrowLeft className="w-4 h-4" />}>
              Return to Overview
            </Button>
          </Link>
        </div>
      </Container>
    </div>
  );
}
