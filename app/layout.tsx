import type { Metadata } from "next";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "Youtube 摘要博客",
  description: "將 YouTube 的長影片整理成結構清晰、易於閱讀的文章。",
  metadataBase: new URL("https://yoursite.com"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh">
      <body className="antialiased">{children}</body>
    </html>
  );
}
