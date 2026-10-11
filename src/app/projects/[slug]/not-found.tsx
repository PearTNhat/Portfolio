import Link from 'next/link';

export default function ProjectNotFound() {
  return (
    <div className="mx-auto max-w-xl px-6 py-40 text-center">
      <p className="font-mono text-cyan-500">404 / PROJECT NOT FOUND</p>
      <h1 className="mt-5 text-3xl font-bold">Không tìm thấy dự án</h1>
      <p className="my-6 text-slate-500">Đường dẫn có thể đã thay đổi hoặc dự án đã được gỡ.</p>
      <Link href="/#projects" className="inline-block rounded-xl bg-cyan-500 px-6 py-3 text-slate-950">← Xem các dự án khác</Link>
    </div>
  );
}
