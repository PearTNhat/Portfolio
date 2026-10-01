'use client';

import * as React from 'react';
import { CheckCircle2, ArrowRight } from 'lucide-react';

export default function AdminProjectsPage() {
  return (
    <div className="space-y-6">
      {/* Page Title & Status */}
      <div className="p-6 sm:p-8 rounded-2xl border border-emerald-500/20 bg-emerald-950/10 backdrop-blur-sm">
        <div className="flex items-start gap-4">
          <div className="w-11 h-11 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-emerald-400">
              Bước 1 Hoàn Tất & Layout Đã Tách Component Chuẩn
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 leading-relaxed">
              Admin Header và Auth Guard đã được đưa vào <code>admin/layout.tsx</code>. Các trang con không còn bị trùng lặp code và giao diện được cấu trúc chuyên nghiệp.
            </p>
          </div>
        </div>
      </div>

      {/* Placeholder for Project Table component */}
      <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/40">
        <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2 mb-2">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          Sẵn sàng cho Bước 2: Bảng Quản Lý Dự Án (Projects Table)
        </h3>
        <p className="text-xs text-slate-400 leading-relaxed mb-4">
          Các component tiếp theo sẽ được chia vào thư mục: <code>src/app/admin/projects/components/</code> gồm:
          <br />• <code>project-table.tsx</code>: Danh sách dự án, lọc theo danh mục, tìm kiếm.
          <br />• <code>project-form-modal.tsx</code>: Modal tạo & chỉnh sửa dự án.
          <br />• <code>project-delete-dialog.tsx</code>: Modal xác nhận xóa an toàn.
        </p>
        <div className="inline-flex items-center gap-1.5 text-xs font-mono text-cyan-400">
          Sẵn sàng bắt đầu Bước 2 <ArrowRight className="w-3.5 h-3.5" />
        </div>
      </div>
    </div>
  );
}
