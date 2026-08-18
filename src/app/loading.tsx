import { Container } from '@/components/layouts/container';
import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <div className="pt-32 pb-24 space-y-16">
      <Container size="xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-6">
            <Skeleton className="h-6 w-48 rounded-full" />
            <Skeleton className="h-16 w-3/4 rounded-2xl" />
            <Skeleton className="h-6 w-1/2 rounded-xl" />
            <Skeleton className="h-24 w-full rounded-2xl" />
            <div className="flex gap-3">
              <Skeleton className="h-12 w-36 rounded-xl" />
              <Skeleton className="h-12 w-36 rounded-xl" />
            </div>
          </div>
          <div className="lg:col-span-5">
            <Skeleton className="h-80 w-full rounded-2xl" />
          </div>
        </div>

        <div className="mt-16 grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Skeleton className="h-28 rounded-2xl" />
          <Skeleton className="h-28 rounded-2xl" />
          <Skeleton className="h-28 rounded-2xl" />
          <Skeleton className="h-28 rounded-2xl" />
        </div>
      </Container>
    </div>
  );
}
