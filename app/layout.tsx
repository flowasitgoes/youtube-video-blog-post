import type { Metadata } from "next";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "YouTube 摘要博客",
  description: "阅读结构化摘要，节省观看长视频的时间",
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
