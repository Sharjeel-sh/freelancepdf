import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'FreelancePDF | PDF to Portfolio Website',
  description: 'Convert your PDF resume into a live portfolio website in 60 seconds.',
  keywords: ['resume builder', 'portfolio', 'freelancer', 'pdf to website']
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-slate-50 text-slate-900">{children}</body>
    </html>
  );
}
