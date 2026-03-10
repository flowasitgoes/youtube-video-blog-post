"use client";

import { usePathname, useSearchParams } from "next/navigation";
import Link from "next/link";
import type { Locale } from "@/lib/types";

const LOCALES: { value: Locale; label: string }[] = [
  { value: "zh", label: "繁體中文" },
  { value: "en", label: "English" },
];

export default function LanguageSwitch() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentLang = (searchParams.get("lang") as Locale) || "zh";

  const href = (lang: Locale) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("lang", lang);
    const q = params.toString();
    return q ? `${pathname}?${q}` : pathname;
  };

  return (
    <nav className="flex gap-2" aria-label="語言切換">
      {LOCALES.map(({ value, label }) => (
        <Link
          key={value}
          href={href(value)}
          className={`rounded px-3 py-1.5 text-sm font-medium transition-colors ${
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
