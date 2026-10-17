'use client';

import Link from 'next/link';
import { useI18n } from '@/store/i18n-provider';

export default function ErrorPage({ reset }: { reset: () => void }) {
  const { language } = useI18n();
  const isEn = language === 'en';

  return (
    <div className="mx-auto max-w-xl px-6 py-40 text-center">
      <h1 className="text-3xl font-bold">
        {isEn ? 'Unable to load project' : 'Chưa tải được dự án'}
      </h1>
      <p className="my-6 text-slate-500">
        {isEn
          ? 'The server might be starting up. Please try again in a moment.'
          : 'Máy chủ có thể đang khởi động. Bạn hãy thử lại sau một lát.'}
      </p>
      <button
        onClick={reset}
        className="rounded-xl bg-cyan-500 px-6 py-3 text-slate-950 font-bold"
      >
        {isEn ? 'Retry' : 'Thử lại'}
      </button>
      <Link href={`/${language}#projects`} className="block mt-6 text-sm text-cyan-500 hover:underline">
        {isEn ? '← Back to projects' : '← Quay lại các dự án'}
      </Link>
    </div>
  );
}
