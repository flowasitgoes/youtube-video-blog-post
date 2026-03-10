import type { Metadata } from "next";
import "@/styles/globals.css";
import {
  SITE_NAME_ZH,
  META_DESCRIPTION_ZH,
  META_DESCRIPTION_EN,
  KEYWORDS_ZH,
  KEYWORDS_EN,
} from "@/lib/site";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://summary.ifunlove.com";

/** SEO 縮圖：FB/OG 需絕對 URL，用 metadataBase 會自動補，這裡顯式寫絕對路徑確保相容 */
const OG_IMAGE = `${siteUrl}/icons/video-digest-1200x630.jpg`;

export const metadata: Metadata = {
  title: {
    default: `${SITE_NAME_ZH} | Video Digest – 將 YouTube 影片變成好讀文章`,
    template: `%s | ${SITE_NAME_ZH}`,
  },
  description: META_DESCRIPTION_ZH,
  keywords: [KEYWORDS_ZH, KEYWORDS_EN],
  authors: [{ name: "Video Digest" }],
  creator: "Video Digest",
  metadataBase: new URL(siteUrl),
  icons: {
    icon: [
      { url: "/icons/video-digest-32.jpg", sizes: "32x32", type: "image/jpeg" },
      { url: "/icons/video-digest-64.jpg", sizes: "64x64", type: "image/jpeg" },
    ],
    apple: [
      { url: "/icons/video-digest-192.jpg", sizes: "192x192", type: "image/jpeg" },
      { url: "/icons/video-digest-512.jpg", sizes: "512x512", type: "image/jpeg" },
    ],
  },
  openGraph: {
    type: "website",
    locale: "zh_TW",
    alternateLocale: "en",
    siteName: SITE_NAME_ZH,
    title: `${SITE_NAME_ZH} | 將 YouTube 長影片整理成結構化文章`,
    description: META_DESCRIPTION_ZH,
    url: siteUrl,
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "Video Digest – Youtube Summary & Insight",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME_ZH,
    description: META_DESCRIPTION_ZH,
    images: [OG_IMAGE],
  },
  alternates: {
    canonical: siteUrl,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh">
      <body className="flex min-h-screen flex-col antialiased">
        <main className="flex-1">{children}</main>
        <footer className="border-t border-neutral-200 py-6 dark:border-neutral-800">
          <p className="text-center text-sm text-neutral-500 dark:text-neutral-400">
            <a
              href="https://ifunlove.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-neutral-700 dark:hover:text-neutral-300"
            >
              ifunlove.com
            </a>
          </p>
        </footer>
      </body>
    </html>
  );
}
