type SectionBlockProps = {
  title: string;
  content: string;
};

function ParagraphBlock({ text }: { text: string }) {
  const trimmed = text.trim();
  if (!trimmed) return null;
  return (
    <p className="mb-5 last:mb-0 leading-[1.8] text-neutral-800 dark:text-neutral-200">
      {trimmed}
    </p>
  );
}

export default function SectionBlock({ title, content }: SectionBlockProps) {
  const paragraphs = content
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <section className="space-y-4">
      <h2 className="text-lg font-semibold tracking-tight text-neutral-900 dark:text-neutral-100 border-b border-neutral-200 dark:border-neutral-700 pb-2">
        {title}
      </h2>
      <div className="space-y-1">
        {paragraphs.length > 0 ? (
          paragraphs.map((p, i) => <ParagraphBlock key={i} text={p} />)
        ) : (
          <ParagraphBlock text={content} />
        )}
      </div>
    </section>
  );
}
