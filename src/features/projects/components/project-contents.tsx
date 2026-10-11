'use client';

import { useEffect, useState } from 'react';
import { ArrowUpRight, ListTree } from 'lucide-react';

export function ProjectContents({ sections, vi }: { sections: { id: string; label: string }[]; vi: boolean }) {
  const [active, setActive] = useState('overview');
  const signature = sections.map(section => section.id).join(',');

  useEffect(() => {
    const ids = signature.split(',');
    let frame = 0;
    const update = () => {
      frame = 0;
      let current = ids[0];
      for (const id of ids) {
        if ((document.getElementById(id)?.getBoundingClientRect().top ?? Infinity) <= 180) current = id;
      }
      setActive(current);
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    schedule();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
    };
  }, [signature]);

  const index = Math.max(0, sections.findIndex(section => section.id === active));
  return (
    <nav aria-label={vi ? 'Mục lục dự án' : 'Project contents'} className="overflow-hidden rounded-2xl border border-slate-200 bg-white/95 shadow-sm backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/95">
      <div className="flex items-center justify-between gap-2 px-3 py-3">
        <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-slate-500"><ListTree size={16} className="text-cyan-500" />{vi ? 'Khám phá dự án' : 'Explore project'}</span>
        <span className="font-mono text-[11px] text-slate-400">{String(index + 1).padStart(2, '0')} / {String(sections.length).padStart(2, '0')}</span>
      </div>
      <div className="h-0.5 bg-slate-100 dark:bg-slate-800"><div className="h-full bg-cyan-500 transition-[width] duration-300" style={{ width: `${((index + 1) / sections.length) * 100}%` }} /></div>
      <ol className="flex gap-1 overflow-x-auto p-2 lg:block lg:space-y-1">
        {sections.map((section, i) => <li key={section.id} className="shrink-0"><a href={`#${section.id}`} aria-current={active === section.id ? 'location' : undefined} className={`group flex items-center gap-3 whitespace-nowrap rounded-xl px-3 py-2 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-cyan-500 ${active === section.id ? 'bg-cyan-500/10 font-semibold text-cyan-700 dark:text-cyan-300' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-white'}`}><span className={`flex h-6 w-6 items-center justify-center rounded-lg font-mono text-[10px] ${active === section.id ? 'bg-cyan-500 text-slate-950' : 'bg-slate-100 dark:bg-slate-800'}`}>{String(i + 1).padStart(2, '0')}</span>{section.label}<ArrowUpRight size={14} className={`ml-auto hidden lg:block ${active === section.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`} /></a></li>)}
      </ol>
      <p className="hidden border-t border-slate-200 px-3 py-3 text-xs leading-5 text-slate-400 dark:border-slate-800 lg:block">{vi ? 'Từ ý tưởng đến cách triển khai. Chọn một phần để tìm hiểu sâu hơn.' : 'From context to implementation. Jump to a section to explore further.'}</p>
    </nav>
  );
}
