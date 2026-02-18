'use client';

import { ChangeEvent, useMemo, useState } from 'react';
import QRCode from 'qrcode';
import { PortfolioPreview } from '@/components/PortfolioPreview';
import { FontFamily, ResumeData, ThemeMode } from '@/lib/types';

const demoData: ResumeData = {
  name: 'Aarav Shah',
  title: 'Full-Stack Freelancer',
  email: 'aarav@demo.com',
  phone: '+1 (555) 112-0099',
  location: 'Remote',
  summary: 'Freelancer helping startups ship polished web products quickly.',
  skills: ['Next.js', 'Node.js', 'Tailwind CSS', 'PostgreSQL'],
  experience: ['Built SaaS MVPs for 20+ clients', 'Reduced landing page bounce by 35% for an e-commerce brand'],
  projects: ['AI Resume Screener', 'Real-time Analytics Dashboard'],
  education: ['B.Tech in Computer Science'],
  certifications: ['AWS Certified Cloud Practitioner'],
  rawText: ''
};

export default function HomePage() {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [data, setData] = useState<ResumeData | null>(null);
  const [themeMode, setThemeMode] = useState<ThemeMode>('light');
  const [fontFamily, setFontFamily] = useState<FontFamily>('sans');
  const [loading, setLoading] = useState(false);
  const [publishUrl, setPublishUrl] = useState<string>('');
  const [qrCode, setQrCode] = useState<string>('');
  const [error, setError] = useState<string>('');

  const previewData = useMemo(() => data ?? demoData, [data]);

  async function onUpload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    setPdfFile(file ?? null);
    setError('');
    if (!file) return;

    const formData = new FormData();
    formData.append('pdf', file);

    setLoading(true);
    try {
      const response = await fetch('/api/parse-pdf', { method: 'POST', body: formData });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error || 'Parse failed.');
      setData(body.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to parse PDF.');
    } finally {
      setLoading(false);
    }
  }

  async function publishPortfolio() {
    if (!data) {
      setError('Upload and parse a PDF first.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data, themeMode, fontFamily })
      });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error || 'Publish failed.');

      setPublishUrl(body.url);
      const qr = await QRCode.toDataURL(body.url, { margin: 1, width: 160 });
      setQrCode(qr);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to publish website.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <section className="rounded-2xl bg-gradient-to-br from-brand-50 to-white p-8 shadow-sm ring-1 ring-slate-200">
        <p className="inline-flex rounded-full bg-brand-500/10 px-3 py-1 text-xs font-semibold text-brand-700">Launch-ready MVP</p>
        <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">PDF → Portfolio Website in 60 Seconds</h1>
        <p className="mt-3 max-w-2xl text-sm text-slate-700 sm:text-base">
          Upload your resume, auto-extract your professional details, and publish a mobile-friendly SEO portfolio instantly.
        </p>

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          {[1, 2, 3].map((card) => (
            <div key={card} className="rounded-xl border bg-white p-4 text-sm text-slate-600 shadow-sm">
              <div className="h-20 rounded-md bg-slate-100" />
              <p className="mt-2 font-medium">Screenshot example {card}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <label className="flex-1 cursor-pointer rounded-lg border border-dashed border-slate-400 bg-white px-4 py-3 text-sm">
            <span className="font-medium">Upload PDF & See Live Demo</span>
            <input type="file" accept="application/pdf" className="mt-2 block w-full" onChange={onUpload} />
          </label>
          <input
            type="email"
            placeholder="Beta waitlist email (optional)"
            className="rounded-lg border px-4 py-3 text-sm"
            aria-label="email capture"
          />
        </div>
        {pdfFile ? <p className="mt-2 text-xs text-slate-500">Selected file: {pdfFile.name}</p> : null}
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-[320px_1fr]">
        <aside className="rounded-xl border bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold">Customize & Publish</h2>

          <label className="mt-4 block text-sm font-medium">Theme</label>
          <select
            value={themeMode}
            onChange={(e) => setThemeMode(e.target.value as ThemeMode)}
            className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>

          <label className="mt-4 block text-sm font-medium">Font</label>
          <select
            value={fontFamily}
            onChange={(e) => setFontFamily(e.target.value as FontFamily)}
            className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
          >
            <option value="sans">Sans</option>
            <option value="serif">Serif</option>
            <option value="mono">Mono</option>
          </select>

          <button
            onClick={publishPortfolio}
            disabled={loading}
            className="mt-5 w-full rounded-md bg-brand-500 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
          >
            {loading ? 'Processing...' : 'Publish Portfolio'}
          </button>

          {publishUrl ? (
            <div className="mt-4 rounded-md bg-emerald-50 p-3 text-xs text-emerald-800">
              <p className="font-semibold">Live URL</p>
              <a href={publishUrl} className="break-all underline" target="_blank" rel="noreferrer">
                {publishUrl}
              </a>
              {qrCode ? <img src={qrCode} alt="QR code for portfolio" className="mt-2 h-24 w-24 rounded border bg-white p-1" /> : null}
            </div>
          ) : null}

          {error ? <p className="mt-3 text-xs text-red-600">{error}</p> : null}
        </aside>

        <div>
          <h2 className="mb-3 text-lg font-semibold">Live Preview</h2>
          <PortfolioPreview data={previewData} themeMode={themeMode} fontFamily={fontFamily} />
        </div>
      </section>
    </main>
  );
}
