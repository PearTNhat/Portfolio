'use client';

import * as React from 'react';
import {
  AlertCircle,
  CheckCircle2,
  Globe,
  GraduationCap,
  Loader2,
  Plus,
  RefreshCw,
  Save,
  Trash2,
  Upload,
  UserCheck,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { profileService } from '@/services/profile.service';
import {
  formatMediaUrl,
  registerPendingBlob,
  uploadIfBlob,
} from '@/services/upload.service';
import { invalidatePortfolioCache } from '@/store/i18n-provider';
import {
  RawEducation,
  RawProfile,
  RawQuickStat,
} from '@/types/profile';

const DEFAULT_PROFILE: RawProfile = {
  name: 'Lê Tuấn Nhật',
  title: {
    vi: 'Kỹ Sư Backend (Golang) & Blockchain',
    en: 'Backend (Golang) & Blockchain Engineer',
  },
  tagline: {
    vi: 'Phát triển hệ thống backend bằng Golang, kiến trúc Blockchain Layer 1 và giao thức Rust/QUIC.',
    en: 'Backend development with Golang, Layer 1 blockchain systems, and Rust/QUIC protocols.',
  },
  summary: {
    vi: 'Kỹ sư Backend với 1.5 năm kinh nghiệm phát triển các hệ sinh thái blockchain cốt lõi. Nền tảng vững chắc về lập trình đa luồng (multi-threading), xử lý đồng thời (concurrency) và tối ưu hóa cơ sở dữ liệu từ việc tối ưu mạng Blockchain Layer 1 đạt 12.000 TPS. Đồng thời có kinh nghiệm dày dặn trong việc xây dựng hệ thống RESTful API chuẩn mực bằng Java (Spring Boot), Go, Node.js (Express/NestJS) và TypeScript kết hợp cơ sở dữ liệu (MongoDB, PostgreSQL, MySQL), tối ưu truy vấn cơ sở dữ liệu và khả năng debug hệ thống chuyên sâu để bảo đảm độ tin cậy cao.',
    en: 'Backend Engineer with 1.5 years of professional experience developing core blockchain systems. Strong foundation in multi-threading, concurrency, and database optimization gained from optimizing a Layer 1 blockchain to handle 12,000 TPS. Additionally, I have solid experience building robust RESTful APIs using Java (Spring Boot), Go, Node.js (Express/NestJS), and TypeScript, integrated with databases (MongoDB, PostgreSQL, MySQL), optimizing database queries, and strong capability in deep system debugging to ensure high reliability.',
  },
  location: {
    vi: 'Hồ Chí Minh, Việt Nam',
    en: 'Ho Chi Minh City, Vietnam',
  },
  email: 'letuannhat105@gmail.com',
  phone: '0944477357',
  github: 'https://github.com/PearTNhat',
  githubUsername: 'PearTNhat',
  avatarUrl: '',
  stats: [
    {
      id: 'stat-yoe',
      label: { vi: 'Kinh nghiệm', en: 'Experience' },
      value: '~1.5 YOE',
      description: { vi: 'Blockchain & Go backend', en: 'Blockchain & Go backend' },
      highlight: { vi: 'Hệ thống lõi', en: 'Core Systems' },
    },
    {
      id: 'stat-tps',
      label: { vi: 'Thông lượng đỉnh', en: 'Peak Throughput' },
      value: '12,000 TPS',
      description: { vi: 'Engine giao dịch Layer 1', en: 'Layer 1 transaction engine' },
      highlight: { vi: 'Sub-second', en: 'Sub-second' },
    },
    {
      id: 'stat-systems',
      label: { vi: 'Hệ thống đã làm', en: 'Shipped Systems' },
      value: '4+ Core',
      description: { vi: 'L1, Storage, E-com, RPC', en: 'L1, Storage, E-com, RPC' },
      highlight: { vi: 'Production', en: 'Production' },
    },
    {
      id: 'stat-english',
      label: { vi: 'Ngoại ngữ', en: 'Languages' },
      value: 'Tiếng Anh',
      description: { vi: 'Giao tiếp & Đọc hiểu kỹ thuật', en: 'Technical docs & conversation' },
      highlight: { vi: 'Làm việc nhóm', en: 'Teamwork' },
    },
  ],
  highlights: {
    vi: [
      'Kỹ sư phát triển cốt lõi mạng Blockchain Layer 1; xây dựng và tối ưu hóa đường ống thực thi giao dịch đạt đỉnh 12.000 TPS.',
      'Năng lực chuyên sâu về điều tra, debug lỗi đa luồng, loại bỏ triệt để xung đột tài nguyên (race condition) và khóa chết (deadlock).',
      'Thiết kế kiến trúc lưu trữ trạng thái hai tầng bằng NOMT Trie, Flat Trie kết hợp LevelDB và Xapian indexer.',
      'Xây dựng hệ thống truyền tải phân tán qua giao thức Rust/QUIC và cụm microservices chịu tải cao (Go, gRPC, Java Spring Boot).',
    ],
    en: [
      'Core Layer 1 blockchain developer; engineered high-throughput consensus & transaction execution pipeline achieving 12,000 TPS.',
      'Deep technical expertise in multi-threading debugging, concurrency bottlenecks, race condition elimination, and deadlock mitigation.',
      'Architected low-level dual-trie state storage engine (NOMT Trie, Flat Trie, LevelDB, Xapian).',
      'Built distributed chunked transfer via Rust/QUIC and high-performance backend microservices (Go, gRPC, Java Spring Boot).',
    ],
  },
  education: {
    institution: {
      vi: 'Học viện Công nghệ Bưu chính Viễn thông (PTIT)',
      en: 'Posts and Telecommunications Institute of Technology (PTIT)',
    },
    degree: {
      vi: 'Kỹ sư Công nghệ Thông tin',
      en: 'Engineer in Information Technology',
    },
    period: '2021 - 2026',
    major: {
      vi: 'Công nghệ Thông tin',
      en: 'Information Technology',
    },
  },
};

export function ProfileManager() {
  const [profile, setProfile] = React.useState<RawProfile>(DEFAULT_PROFILE);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isSaving, setIsSaving] = React.useState(false);
  const [avatarError, setAvatarError] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [successMsg, setSuccessMsg] = React.useState<string | null>(null);
  const [activeTab, setActiveTab] = React.useState<'general' | 'bilingual' | 'education' | 'stats'>('general');
  const [contentLang, setContentLang] = React.useState<'vi' | 'en'>('vi');

  const avatarInputRef = React.useRef<HTMLInputElement>(null);

  const fetchProfile = React.useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setAvatarError(false);
    try {
      const data = await profileService.getRawProfile();
      if (data) {
        setProfile({
          ...DEFAULT_PROFILE,
          ...data,
          title: { ...DEFAULT_PROFILE.title, ...(data.title || {}) },
          tagline: { ...DEFAULT_PROFILE.tagline, ...(data.tagline || {}) },
          summary: { ...DEFAULT_PROFILE.summary, ...(data.summary || {}) },
          location: { ...DEFAULT_PROFILE.location, ...(data.location || {}) },
          education: {
            institution: { ...DEFAULT_PROFILE.education?.institution, ...(data.education?.institution || {}) },
            degree: { ...DEFAULT_PROFILE.education?.degree, ...(data.education?.degree || {}) },
            major: { ...DEFAULT_PROFILE.education?.major, ...(data.education?.major || {}) },
            period: data.education?.period || DEFAULT_PROFILE.education?.period || '',
          },
        });
      }
    } catch (err) {
      console.warn('[ProfileManager] Could not load raw profile, using default:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    void fetchProfile();
  }, [fetchProfile]);

  const handleAvatarSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const blobUrl = URL.createObjectURL(file);
    registerPendingBlob(blobUrl, file);
    setProfile((prev) => ({ ...prev, avatarUrl: blobUrl }));
    if (avatarInputRef.current) avatarInputRef.current.value = '';
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);
    setSuccessMsg(null);

    try {
      // Upload avatar if it's a pending blob
      let finalAvatarUrl = profile.avatarUrl;
      if (finalAvatarUrl && finalAvatarUrl.startsWith('blob:')) {
        finalAvatarUrl = await uploadIfBlob(finalAvatarUrl);
      }

      const payload: RawProfile = {
        ...profile,
        avatarUrl: finalAvatarUrl,
      };

      const updated = await profileService.updateProfile(payload);
      invalidatePortfolioCache();
      setProfile((prev) => ({ ...prev, ...updated, avatarUrl: finalAvatarUrl }));
      setSuccessMsg('Đã lưu thông tin hồ sơ cá nhân thành công!');
      setTimeout(() => setSuccessMsg(null), 3500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Lỗi khi cập nhật hồ sơ.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center gap-3 text-slate-400 font-mono text-xs">
        <Loader2 className="w-8 h-8 animate-spin text-cyan-400" />
        <p>Đang tải thông tin hồ sơ...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white tracking-tight">Hồ Sơ Cá Nhân (Profile)</h1>
              <p className="text-xs text-slate-400">Quản lý tiểu sử, chức danh, liên hệ và học vấn</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={fetchProfile}
            disabled={isLoading || isSaving}
            className="text-xs"
          >
            <RefreshCw className="w-3.5 h-3.5 mr-1" /> Làm mới
          </Button>
          <Button
            type="button"
            variant="primary"
            size="sm"
            onClick={handleSave}
            isLoading={isSaving}
            className="text-xs shadow-lg shadow-cyan-500/20"
          >
            <Save className="w-3.5 h-3.5 mr-1.5" /> Lưu Thay Đổi
          </Button>
        </div>
      </div>

      {/* Messages */}
      {error && (
        <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2.5">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {successMsg && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs flex items-center gap-2.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Tabs navigation */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-800/80 pb-3">
        {[
          { id: 'general', label: '1. Thông tin chung & Avatar' },
          { id: 'bilingual', label: '2. Tiêu đề & Giới thiệu (VI/EN)' },
          { id: 'education', label: '3. Học vấn (Education)' },
          { id: 'stats', label: '4. Thống kê nhanh (Stats)' },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
              activeTab === tab.id
                ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Form Content */}
      <form onSubmit={handleSave} className="space-y-6">
        {/* Tab 1: General Info & Avatar */}
        {activeTab === 'general' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Avatar Column */}
            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col items-center text-center space-y-4">
              <span className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-400">
                Ảnh đại diện (Avatar)
              </span>
              <div className="w-32 h-32 rounded-2xl overflow-hidden bg-slate-900 border-2 border-cyan-500/30 shadow-xl flex items-center justify-center relative group">
                {profile.avatarUrl && !avatarError ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={formatMediaUrl(profile.avatarUrl)}
                    alt="Avatar"
                    className="w-full h-full object-cover"
                    onError={() => setAvatarError(true)}
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-tr from-cyan-500/20 via-indigo-500/15 to-purple-500/10 text-cyan-400 p-2">
                    <span className="font-mono font-black text-2xl tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-300">
                      LTN
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono mt-1">Chưa có ảnh</span>
                  </div>
                )}
              </div>

              <input
                ref={avatarInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarSelect}
                className="hidden"
              />

              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => avatarInputRef.current?.click()}
                className="text-xs w-full"
              >
                <Upload className="w-3.5 h-3.5 mr-1.5 text-cyan-400" />
                Chọn ảnh từ máy
              </Button>
              <p className="text-[11px] text-slate-500">
                Chỉ tải lên server khi nhấn &quot;Lưu Thay Đổi&quot; (Upload on Save).
              </p>
            </div>

            {/* General Fields */}
            <div className="md:col-span-2 p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">
                    Họ và tên <span className="text-rose-400">*</span>
                  </label>
                  <Input
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    required
                    placeholder="Lê Tuấn Nhật"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">
                    Email liên hệ
                  </label>
                  <Input
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    placeholder="email@example.com"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">
                    Số điện thoại
                  </label>
                  <Input
                    value={profile.phone}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    placeholder="0372863773"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">
                    Github Username
                  </label>
                  <Input
                    value={profile.githubUsername}
                    onChange={(e) => setProfile({ ...profile, githubUsername: e.target.value })}
                    placeholder="PearTNhat"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">
                  Đường dẫn Github Profile (URL)
                </label>
                <Input
                  value={profile.github}
                  onChange={(e) => setProfile({ ...profile, github: e.target.value })}
                  placeholder="https://github.com/PearTNhat"
                />
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Bilingual (Title, Tagline, Summary, Location) */}
        {activeTab === 'bilingual' && (
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-mono font-semibold uppercase text-slate-300">
                  Nội dung song ngữ (Bilingual Content)
                </span>
              </div>
              <div className="flex rounded-lg bg-slate-950 p-1 border border-slate-800">
                <button
                  type="button"
                  onClick={() => setContentLang('vi')}
                  className={`px-3 py-1 rounded text-xs font-medium cursor-pointer ${
                    contentLang === 'vi' ? 'bg-cyan-500/20 text-cyan-300 font-semibold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  🇻🇳 Tiếng Việt
                </button>
                <button
                  type="button"
                  onClick={() => setContentLang('en')}
                  className={`px-3 py-1 rounded text-xs font-medium cursor-pointer ${
                    contentLang === 'en' ? 'bg-cyan-500/20 text-cyan-300 font-semibold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  🇬🇧 English
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">
                  Chức danh nghề nghiệp ({contentLang.toUpperCase()})
                </label>
                <Input
                  value={profile.title?.[contentLang] || ''}
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      title: { ...profile.title, [contentLang]: e.target.value },
                    })
                  }
                  placeholder={contentLang === 'vi' ? 'Kỹ Sư Backend (Golang) & Blockchain' : 'Backend & Blockchain Engineer'}
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">
                  Câu khẩu hiệu / Slogan ngắn ({contentLang.toUpperCase()})
                </label>
                <Input
                  value={profile.tagline?.[contentLang] || ''}
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      tagline: { ...profile.tagline, [contentLang]: e.target.value },
                    })
                  }
                  placeholder="Phát triển hệ thống backend bằng Golang, kiến trúc Blockchain..."
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">
                  Nơi cư trú / Địa điểm ({contentLang.toUpperCase()})
                </label>
                <Input
                  value={profile.location?.[contentLang] || ''}
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      location: { ...profile.location, [contentLang]: e.target.value },
                    })
                  }
                  placeholder={contentLang === 'vi' ? 'Hồ Chí Minh, Việt Nam' : 'Ho Chi Minh City, Vietnam'}
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">
                  Đoạn giới thiệu bản thân / Tiểu sử dài ({contentLang.toUpperCase()})
                </label>
                <textarea
                  value={profile.summary?.[contentLang] || ''}
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      summary: { ...profile.summary, [contentLang]: e.target.value },
                    })
                  }
                  rows={5}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-cyan-500 text-sm leading-relaxed"
                  placeholder="Giới thiệu chi tiết kinh nghiệm lập trình, điểm mạnh..."
                />
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Education */}
        {activeTab === 'education' && (
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
              <GraduationCap className="w-4 h-4 text-cyan-400" />
              <span className="text-xs font-mono font-semibold uppercase text-slate-300">
                Thông tin học vấn (Education)
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">Trường ĐH (Tiếng Việt)</label>
                <Input
                  value={profile.education?.institution?.vi || ''}
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      education: {
                        ...(profile.education as RawEducation),
                        institution: { ...(profile.education?.institution || {}), vi: e.target.value },
                      },
                    })
                  }
                  placeholder="Đại Học..."
                />
              </div>
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">Trường ĐH (English)</label>
                <Input
                  value={profile.education?.institution?.en || ''}
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      education: {
                        ...(profile.education as RawEducation),
                        institution: { ...(profile.education?.institution || {}), en: e.target.value },
                      },
                    })
                  }
                  placeholder="University..."
                />
              </div>
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">Bằng cấp (VI / EN)</label>
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    value={profile.education?.degree?.vi || ''}
                    onChange={(e) =>
                      setProfile({
                        ...profile,
                        education: {
                          ...(profile.education as RawEducation),
                          degree: { ...(profile.education?.degree || {}), vi: e.target.value },
                        },
                      })
                    }
                    placeholder="Cử Nhân"
                  />
                  <Input
                    value={profile.education?.degree?.en || ''}
                    onChange={(e) =>
                      setProfile({
                        ...profile,
                        education: {
                          ...(profile.education as RawEducation),
                          degree: { ...(profile.education?.degree || {}), en: e.target.value },
                        },
                      })
                    }
                    placeholder="Bachelor's"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">Niên khóa (Period)</label>
                <Input
                  value={profile.education?.period || ''}
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      education: {
                        ...(profile.education as RawEducation),
                        period: e.target.value,
                      },
                    })
                  }
                  placeholder="2020 - 2024"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-mono text-slate-300 mb-1">Chuyên ngành (VI / EN)</label>
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    value={profile.education?.major?.vi || ''}
                    onChange={(e) =>
                      setProfile({
                        ...profile,
                        education: {
                          ...(profile.education as RawEducation),
                          major: { ...(profile.education?.major || {}), vi: e.target.value },
                        },
                      })
                    }
                    placeholder="Khoa Học Máy Tính"
                  />
                  <Input
                    value={profile.education?.major?.en || ''}
                    onChange={(e) =>
                      setProfile({
                        ...profile,
                        education: {
                          ...(profile.education as RawEducation),
                          major: { ...(profile.education?.major || {}), en: e.target.value },
                        },
                      })
                    }
                    placeholder="Computer Science"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Quick Stats */}
        {activeTab === 'stats' && (
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-xs font-mono font-semibold uppercase text-slate-300">
                Chỉ số nhanh (Quick Stats)
              </span>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => {
                  const newStat: RawQuickStat = {
                    id: 'stat-' + Date.now(),
                    value: '10+',
                    label: { vi: 'Thống kê mới', en: 'New Stat' },
                    description: { vi: 'Mô tả', en: 'Description' },
                  };
                  setProfile({ ...profile, stats: [...(profile.stats || []), newStat] });
                }}
                className="text-xs"
              >
                <Plus className="w-3.5 h-3.5 mr-1" /> Thêm chỉ số
              </Button>
            </div>

            <div className="space-y-3">
              {(profile.stats || []).map((s, idx) => (
                <div key={s.id || idx} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 flex flex-col sm:flex-row items-center gap-3">
                  <div className="w-full sm:w-28 shrink-0">
                    <label className="text-[10px] font-mono text-slate-500 uppercase">Giá trị</label>
                    <Input
                      value={s.value}
                      onChange={(e) => {
                        const copy = [...(profile.stats || [])];
                        copy[idx] = { ...copy[idx], value: e.target.value };
                        setProfile({ ...profile, stats: copy });
                      }}
                      placeholder="12.000 TPS"
                    />
                  </div>
                  <div className="w-full sm:flex-1">
                    <label className="text-[10px] font-mono text-slate-500 uppercase">Nhãn (VI / EN)</label>
                    <div className="grid grid-cols-2 gap-2">
                      <Input
                        value={s.label?.vi || ''}
                        onChange={(e) => {
                          const copy = [...(profile.stats || [])];
                          copy[idx] = { ...copy[idx], label: { ...copy[idx].label, vi: e.target.value } };
                          setProfile({ ...profile, stats: copy });
                        }}
                        placeholder="Thông lượng"
                      />
                      <Input
                        value={s.label?.en || ''}
                        onChange={(e) => {
                          const copy = [...(profile.stats || [])];
                          copy[idx] = { ...copy[idx], label: { ...copy[idx].label, en: e.target.value } };
                          setProfile({ ...profile, stats: copy });
                        }}
                        placeholder="Throughput"
                      />
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setProfile({
                        ...profile,
                        stats: (profile.stats || []).filter((_, i) => i !== idx),
                      });
                    }}
                    className="p-2 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 cursor-pointer transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}



        {/* Bottom Save Action */}
        <div className="pt-4 flex justify-end">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={isSaving}
            className="text-xs shadow-lg shadow-cyan-500/20"
          >
            <Save className="w-4 h-4 mr-2" /> Lưu Thay Đổi Hồ Sơ
          </Button>
        </div>
      </form>
    </div>
  );
}
