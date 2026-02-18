import { FontFamily, ResumeData, ThemeMode } from '@/lib/types';

const fontClass: Record<FontFamily, string> = {
  sans: 'font-sans',
  serif: 'font-serif',
  mono: 'font-mono'
};

export function PortfolioPreview({
  data,
  themeMode,
  fontFamily,
  compact = false
}: {
  data: ResumeData;
  themeMode: ThemeMode;
  fontFamily: FontFamily;
  compact?: boolean;
}) {
  const dark = themeMode === 'dark';

  return (
    <article
      className={`${fontClass[fontFamily]} ${dark ? 'bg-slate-950 text-slate-100' : 'bg-white text-slate-900'} rounded-xl border p-6 shadow-sm`}
    >
      <header className="space-y-1 border-b pb-4">
        <h1 className="text-2xl font-bold">{data.name}</h1>
        {data.title ? <p className="text-base opacity-80">{data.title}</p> : null}
        <p className="text-sm opacity-80">{[data.email, data.phone, data.location].filter(Boolean).join(' • ')}</p>
      </header>

      {data.summary ? <p className="mt-4 text-sm leading-6">{data.summary}</p> : null}

      <Section title="Skills" items={data.skills} compact={compact} />
      <Section title="Experience" items={data.experience} compact={compact} />
      <Section title="Projects" items={data.projects} compact={compact} />
      <Section title="Education" items={data.education} compact={compact} />
      <Section title="Certifications" items={data.certifications} compact={compact} />
    </article>
  );
}

function Section({ title, items, compact }: { title: string; items: string[]; compact?: boolean }) {
  if (!items?.length) return null;

  return (
    <section className="mt-5">
      <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide opacity-75">{title}</h2>
      <ul className="space-y-1 text-sm leading-6">
        {items.slice(0, compact ? 3 : items.length).map((item, idx) => (
          <li key={`${title}-${idx}`} className="list-disc pl-1 marker:text-brand-500">
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
}
