import Link from "next/link";
import { SITE_NAME_ZH, SUBTITLE_ZH } from "@/lib/site";

export default function HomePage() {
  return (
    <main className="min-h-screen px-4 py-12 sm:px-6">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          {SITE_NAME_ZH}
        </h1>
        <p className="mt-4 text-lg text-neutral-600 dark:text-neutral-400">
          {SUBTITLE_ZH}
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
