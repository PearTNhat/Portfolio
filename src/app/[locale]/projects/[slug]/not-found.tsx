'use client';

import Link from 'next/link';
import { useI18n } from '@/store/i18n-provider';

export default function ProjectNotFound() {
  const { language } = useI18n();
  const isEn = language === 'en';

  return (
    <div className="mx-auto max-w-xl px-6 py-40 text-center">
      <p className="font-mono text-cyan-500">404 / PROJECT NOT FOUND</p>
      <h1 className="mt-5 text-3xl font-bold">
        {isEn ? 'Project Not Found' : 'Không tìm thấy dự án'}
      </h1>
      <p className="my-6 text-slate-500">
        {isEn
          ? 'The link may have changed or the project was removed.'
          : 'Đường dẫn có thể đã thay đổi hoặc dự án đã được gỡ.'}
      </p>
      <Link
        href={`/${language}#projects`}
        className="inline-block rounded-xl bg-cyan-500 px-6 py-3 text-slate-950 font-bold"
      >
        {isEn ? '← View other projects' : '← Xem các dự án khác'}
      </Link>
    </div>
  );
}
