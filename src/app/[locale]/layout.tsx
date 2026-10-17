import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { I18nProvider } from '@/store/i18n-provider';
import { Navbar } from '@/components/layouts/navbar';
import { Footer } from '@/components/layouts/footer';
import { AnimatedBackground } from '@/components/ui/animated-background';
import { Language } from '@/lib/i18n/types';
import { SITE_METADATA } from '@/lib/constants';

export async function generateStaticParams() {
  return [{ locale: 'vi' }, { locale: 'en' }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isEn = locale === 'en';

  const title = isEn
    ? 'Lê Tuấn Nhật | Blockchain & Golang Backend Engineer'
    : SITE_METADATA.title;

  const description = isEn
    ? 'Portfolio of Lê Tuấn Nhật - Blockchain & Golang Backend Engineer specialized in Layer 1 EVM consensus (12K TPS), Rust QUIC storage, LevelDB/Xapian, and event-driven microservices with Kafka & gRPC.'
    : SITE_METADATA.description;

  return {
    title: {
      default: title,
      template: `%s | ${SITE_METADATA.author}`,
    },
    description,
    keywords: SITE_METADATA.keywords,
    authors: [{ name: SITE_METADATA.author, url: SITE_METADATA.github }],
    creator: SITE_METADATA.author,
    alternates: {
      canonical: `/${locale}`,
      languages: {
        vi: '/vi',
        en: '/en',
      },
    },
    openGraph: {
      type: 'website',
      locale: isEn ? 'en_US' : 'vi_VN',
      title,
      description,
      siteName: title,
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (locale !== 'vi' && locale !== 'en') {
    notFound();
  }

  const validLocale: Language = locale;

  return (
    <I18nProvider initialLanguage={validLocale}>
      <AnimatedBackground />
      <div className="flex flex-col min-h-screen relative z-10">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    </I18nProvider>
  );
}
