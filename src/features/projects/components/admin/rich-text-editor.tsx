'use client';

import * as React from 'react';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import {
  Bold,
  Code2,
  Globe,
  Image as ImageIcon,
  Italic,
  Link2,
  List,
  ListOrdered,
  Loader2,
  Redo2,
  Undo2,
  Upload,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatMediaUrl, registerPendingBlob } from '@/services/upload.service';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

interface ToolbarButtonProps {
  label: string;
  isActive?: boolean;
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
}

function ToolbarButton({ label, isActive, onClick, disabled, children }: ToolbarButtonProps) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        'inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-200 hover:text-slate-900 disabled:pointer-events-none disabled:opacity-40 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white',
        isActive && 'bg-cyan-500/15 text-cyan-600 dark:text-cyan-400'
      )}
    >
      {children}
    </button>
  );
}

export function RichTextEditor({
  value,
  onChange,
  placeholder = 'Viết mô tả dự án…',
  className,
}: RichTextEditorProps) {
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [isUploadingImage, setIsUploadingImage] = React.useState(false);
  const [showImageMenu, setShowImageMenu] = React.useState(false);
  const menuRef = React.useRef<HTMLDivElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-cyan-600 underline underline-offset-2 dark:text-cyan-400',
          rel: 'noopener noreferrer',
          target: '_blank',
        },
      }),
      Image.configure({
        inline: false,
        HTMLAttributes: {
          class:
            'my-4 rounded-xl border border-slate-300 dark:border-slate-800 max-w-full mx-auto block shadow-xl max-h-[440px] object-contain bg-slate-900/40 p-1',
        },
      }),
      Placeholder.configure({ placeholder }),
    ],
    content: value,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          'min-h-48 px-4 py-3 text-sm leading-7 text-slate-800 outline-none dark:text-slate-100',
      },
    },
    onUpdate: ({ editor: currentEditor }) => onChange(currentEditor.getHTML()),
  });

  React.useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value, { emitUpdate: false });
    }
  }, [editor, value]);

  // Click outside to close image menu
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowImageMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const setLink = () => {
    if (!editor) return;

    const previousUrl = editor.getAttributes('link').href as string | undefined;
    const url = window.prompt('Nhập đường dẫn', previousUrl || 'https://');

    if (url === null) return;
    if (!url.trim()) {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange('link').setLink({ href: url.trim() }).run();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editor) return;

    setShowImageMenu(false);

    try {
      const blobUrl = URL.createObjectURL(file);
      registerPendingBlob(blobUrl, file);
      const altText = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
      editor.chain().focus().setImage({ src: blobUrl, alt: altText || 'Sơ đồ luồng' }).run();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Tải ảnh xem trước thất bại.');
    } finally {
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleInsertImageUrl = () => {
    if (!editor) return;
    setShowImageMenu(false);

    const url = window.prompt('Nhập URL sơ đồ luồng / ảnh minh họa:', 'https://');
    if (url && url.trim()) {
      const formatted = formatMediaUrl(url.trim());
      editor.chain().focus().setImage({ src: formatted, alt: 'Sơ đồ luồng hệ thống' }).run();
    }
  };

  const setBlockType = (blockVal: string) => {
    if (!editor) return;

    if (blockVal === 'paragraph') {
      editor.chain().focus().setParagraph().run();
      return;
    }

    editor.chain().focus().toggleHeading({ level: Number(blockVal) as 2 | 3 }).run();
  };

  return (
    <div
      className={cn(
        'overflow-hidden rounded-xl border border-slate-300 bg-white/80 shadow-sm focus-within:border-cyan-400 focus-within:ring-2 focus-within:ring-cyan-400 dark:border-slate-700 dark:bg-slate-950/70',
        className
      )}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/svg+xml,image/gif"
        onChange={handleFileUpload}
        className="hidden"
      />

      <div className="flex flex-wrap items-center gap-0.5 border-b border-slate-200 px-2 py-1.5 dark:border-slate-800">
        <select
          aria-label="Định dạng đoạn văn"
          value={
            editor?.isActive('heading', { level: 2 })
              ? '2'
              : editor?.isActive('heading', { level: 3 })
              ? '3'
              : 'paragraph'
          }
          onChange={(event) => setBlockType(event.target.value)}
          disabled={!editor}
          className="h-8 rounded-lg bg-transparent px-2 text-xs font-medium text-slate-600 outline-none hover:bg-slate-100 disabled:opacity-40 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          <option value="paragraph">Văn bản</option>
          <option value="2">Tiêu đề lớn</option>
          <option value="3">Tiêu đề nhỏ</option>
        </select>
        <span className="mx-1 h-5 w-px bg-slate-200 dark:bg-slate-700" />
        <ToolbarButton
          label="In đậm"
          isActive={editor?.isActive('bold')}
          disabled={!editor}
          onClick={() => editor?.chain().focus().toggleBold().run()}
        >
          <Bold className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          label="In nghiêng"
          isActive={editor?.isActive('italic')}
          disabled={!editor}
          onClick={() => editor?.chain().focus().toggleItalic().run()}
        >
          <Italic className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          label="Mã inline"
          isActive={editor?.isActive('code')}
          disabled={!editor}
          onClick={() => editor?.chain().focus().toggleCode().run()}
        >
          <Code2 className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          label="Thêm liên kết"
          isActive={editor?.isActive('link')}
          disabled={!editor}
          onClick={setLink}
        >
          <Link2 className="h-4 w-4" />
        </ToolbarButton>

        {/* Chèn Sơ đồ / Ảnh luồng Dropdown */}
        <div className="relative" ref={menuRef}>
          <ToolbarButton
            label="Chèn sơ đồ kiến trúc / Ảnh luồng"
            isActive={showImageMenu || isUploadingImage}
            disabled={!editor || isUploadingImage}
            onClick={() => setShowImageMenu((prev) => !prev)}
          >
            {isUploadingImage ? (
              <Loader2 className="h-4 w-4 animate-spin text-cyan-400" />
            ) : (
              <ImageIcon className="h-4 w-4 text-cyan-500 dark:text-cyan-400" />
            )}
          </ToolbarButton>

          {showImageMenu && (
            <div className="absolute left-0 top-full mt-1 w-56 rounded-xl border border-slate-700 bg-slate-900 p-1.5 shadow-2xl z-30 space-y-1 animate-in fade-in-50 zoom-in-95">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-slate-200 hover:bg-slate-800 hover:text-white transition-colors text-left"
              >
                <Upload className="w-3.5 h-3.5 text-cyan-400" />
                <span>Tải sơ đồ từ máy tính</span>
              </button>
              <button
                type="button"
                onClick={handleInsertImageUrl}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-slate-200 hover:bg-slate-800 hover:text-white transition-colors text-left"
              >
                <Globe className="w-3.5 h-3.5 text-emerald-400" />
                <span>Nhập URL ảnh trực tiếp</span>
              </button>
            </div>
          )}
        </div>

        <span className="mx-1 h-5 w-px bg-slate-200 dark:bg-slate-700" />
        <ToolbarButton
          label="Danh sách"
          isActive={editor?.isActive('bulletList')}
          disabled={!editor}
          onClick={() => editor?.chain().focus().toggleBulletList().run()}
        >
          <List className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          label="Danh sách đánh số"
          isActive={editor?.isActive('orderedList')}
          disabled={!editor}
          onClick={() => editor?.chain().focus().toggleOrderedList().run()}
        >
          <ListOrdered className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          label="Hoàn tác"
          disabled={!editor?.can().undo()}
          onClick={() => editor?.chain().focus().undo().run()}
        >
          <Undo2 className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          label="Làm lại"
          disabled={!editor?.can().redo()}
          onClick={() => editor?.chain().focus().redo().run()}
        >
          <Redo2 className="h-4 w-4" />
        </ToolbarButton>
      </div>

      <EditorContent
        editor={editor}
        className="[&_.ProseMirror_p.is-editor-empty:first-child::before]:pointer-events-none [&_.ProseMirror_p.is-editor-empty:first-child::before]:float-left [&_.ProseMirror_p.is-editor-empty:first-child::before]:h-0 [&_.ProseMirror_p.is-editor-empty:first-child::before]:text-slate-400 [&_.ProseMirror_p.is-editor-empty:first-child::before]:content-[attr(data-placeholder)] [&_.ProseMirror_ul]:my-3 [&_.ProseMirror_ul]:list-disc [&_.ProseMirror_ul]:pl-6 [&_.ProseMirror_ol]:my-3 [&_.ProseMirror_ol]:list-decimal [&_.ProseMirror_ol]:pl-6 [&_.ProseMirror_h2]:mb-2 [&_.ProseMirror_h2]:mt-4 [&_.ProseMirror_h2]:text-xl [&_.ProseMirror_h2]:font-bold [&_.ProseMirror_h3]:mb-2 [&_.ProseMirror_h3]:mt-4 [&_.ProseMirror_h3]:text-base [&_.ProseMirror_h3]:font-bold [&_.ProseMirror_code]:rounded [&_.ProseMirror_code]:bg-slate-100 [&_.ProseMirror_code]:px-1 [&_.ProseMirror_code]:font-mono [&_.ProseMirror_code]:text-xs dark:[&_.ProseMirror_code]:bg-slate-800"
      />
    </div>
  );
}
