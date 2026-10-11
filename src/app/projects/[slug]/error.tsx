'use client';
import Link from 'next/link';
export default function ErrorPage({ reset }: { reset: () => void }) {
  return <div className="mx-auto max-w-xl px-6 py-40 text-center"><h1 className="text-3xl font-bold">Chưa tải được dự án</h1><p className="my-6 text-slate-500">Máy chủ có thể đang khởi động. Bạn hãy thử lại sau một lát.</p><button onClick={reset} className="rounded-xl bg-cyan-500 px-6 py-3 text-slate-950">Thử lại / Retry</button><Link href="/#projects" className="block mt-6">← Quay lại các dự án</Link></div>;
}
