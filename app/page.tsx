import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen px-4 py-12 sm:px-6">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          YouTube 摘要博客
        </h1>
        <p className="mt-4 text-lg text-neutral-600 dark:text-neutral-400">
          阅读结构化摘要，节省观看长视频的时间
        </p>
        <Link
          href="/blog"
          className="mt-8 inline-block rounded-lg bg-neutral-900 px-6 py-3 text-white hover:bg-neutral-800 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-200"
        >
          进入博客
        </Link>
      </div>
    </main>
  );
}
