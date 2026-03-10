import Link from "next/link";
import { notFound } from "next/navigation";
import { getSiteName, getSubtitle } from "@/lib/site";
import LanguageSwitch from "@/components/LanguageSwitch";
import type { Locale } from "@/lib/types";

const LOCALES: Locale[] = ["zh", "en"];

type Props = {
  params: Promise<{ lang: string }>;
};

export async function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

export default async function HomePage({ params }: Props) {
  const { lang } = await params;
  if (lang !== "zh" && lang !== "en") notFound();
  const siteName = getSiteName(lang);
  const subtitle = getSubtitle(lang);
  const buttonLabel = lang === "zh" ? "進入博客" : "Enter blog";
  const blogHref = lang === "zh" ? "/zh/blog" : "/en/blog";

  return (
    <main className="flex min-h-screen flex-col px-4 py-12 sm:px-6">
      <header className="absolute right-4 top-4 sm:right-6 sm:top-6">
        <LanguageSwitch currentLang={lang} pathSuffix="" />
      </header>
      <div className="mx-auto flex flex-1 max-w-2xl flex-col items-center justify-center text-center">
        <h1
          className={
            lang === "en"
              ? "text-2xl font-bold tracking-tight sm:text-3xl"
              : "text-3xl font-bold tracking-tight sm:text-4xl"
          }
        >
          {siteName}
        </h1>
        <p className="mt-4 text-lg text-neutral-600 dark:text-neutral-400">
          {subtitle}
        </p>
        <Link
          href={blogHref}
          className="mt-8 inline-block rounded-lg bg-neutral-900 px-6 py-3 text-white hover:bg-neutral-800 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-200"
        >
          {buttonLabel}
        </Link>
      </div>
    </main>
  );
}
