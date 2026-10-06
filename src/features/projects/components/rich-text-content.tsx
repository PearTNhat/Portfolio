'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Maximize2, X } from 'lucide-react';

interface RichTextContentProps {
  content: string;
  className?: string;
}

export function RichTextContent({ content, className }: RichTextContentProps) {
  const [zoomImage, setZoomImage] = React.useState<{ src: string; alt: string } | null>(null);

  // Handle clicking on diagrams or images to zoom in
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    if (target.tagName.toLowerCase() === 'img') {
      const img = target as HTMLImageElement;
      if (img.src) {
        e.stopPropagation();
        setZoomImage({ src: img.src, alt: img.alt || 'Sơ đồ kiến trúc' });
      }
    }
  };

  // Close zoom on Escape
  React.useEffect(() => {
    if (!zoomImage) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setZoomImage(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [zoomImage]);

  return (
    <>
      <div
        onClick={handleClick}
        className={cn(
          '[&_a]:text-cyan-600 [&_a]:underline [&_a]:underline-offset-2 dark:[&_a]:text-cyan-400 ' +
            '[&_h2]:mb-2 [&_h2]:mt-4 [&_h2]:text-xl [&_h2]:font-bold ' +
            '[&_h3]:mb-2 [&_h3]:mt-4 [&_h3]:font-semibold ' +
            '[&_ol]:my-3 [&_ol]:list-decimal [&_ol]:pl-6 ' +
            '[&_p]:mb-3 [&_p:last-child]:mb-0 ' +
            '[&_ul]:my-3 [&_ul]:list-disc [&_ul]:pl-6 ' +
            '[&_code]:rounded [&_code]:bg-slate-100 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-xs dark:[&_code]:bg-slate-800 ' +
            '[&_img]:my-4 [&_img]:rounded-xl [&_img]:border [&_img]:border-slate-200 dark:[&_img]:border-slate-800/90 ' +
            '[&_img]:shadow-xl [&_img]:max-w-full [&_img]:mx-auto [&_img]:block [&_img]:max-h-[500px] ' +
            '[&_img]:object-contain [&_img]:cursor-zoom-in [&_img]:hover:ring-2 [&_img]:hover:ring-cyan-500/50 [&_img]:transition-all ' +
            '[&_img]:bg-slate-900/30 [&_img]:p-1.5',
          className
        )}
        dangerouslySetInnerHTML={{ __html: content }}
      />

      {/* Lightbox Modal for Architecture & Flow Diagrams */}
      {zoomImage && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => setZoomImage(null)}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-in fade-in-0 duration-200"
        >
          {/* Top Bar with Caption & Close */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-5xl flex items-center justify-between pb-3 text-slate-300 text-xs font-mono"
          >
            <div className="flex items-center gap-2 truncate pr-4">
              <Maximize2 className="w-4 h-4 text-cyan-400 shrink-0" />
              <span className="truncate">{zoomImage.alt || 'Sơ đồ luồng hệ thống'}</span>
            </div>
            <button
              type="button"
              onClick={() => setZoomImage(null)}
              className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-white transition-colors border border-slate-700"
              title="Đóng (ESC)"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Full Image */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="max-w-5xl max-h-[85vh] overflow-auto rounded-2xl border border-slate-800 bg-slate-900/90 p-2 shadow-2xl flex items-center justify-center"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={zoomImage.src}
              alt={zoomImage.alt}
              className="max-h-[80vh] max-w-full rounded-xl object-contain"
            />
          </div>
          <p className="text-[11px] font-mono text-slate-400 pt-3">
            Nhấn ESC hoặc click ra ngoài để đóng xem sơ đồ
          </p>
        </div>
      )}
    </>
  );
}
