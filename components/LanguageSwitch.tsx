"use client";

import Link from "next/link";
import type { Locale } from "@/lib/types";

const LOCALES: { value: Locale; label: string }[] = [
  { value: "zh", label: "中文" },
  { value: "en", label: "EN" },
];

type Props = {
  currentLang: Locale;
  /** 當前頁路徑後綴（不含 /zh 或 /en），由 server 傳入，避免 usePathname 在 SSR 出錯 */
  pathSuffix?: string;
};

export default function LanguageSwitch({ currentLang, pathSuffix = "" }: Props) {
  const href = (lang: Locale) => `/${lang}${pathSuffix}`;

  return (
    <nav className="flex shrink-0 gap-1.5" aria-label="語言切換">
      {LOCALES.map(({ value, label }) => (
        <Link
          key={value}
          href={href(value)}
          className={`rounded px-2 py-1 text-xs font-medium transition-colors sm:px-3 sm:py-1.5 sm:text-sm ${
            currentLang === value
              ? "bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900"
              : "text-neutral-600 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800"
          }`}
        >
          {label}
        </Link>
      ))}
    </nav>
  );
}
