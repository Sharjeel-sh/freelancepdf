import { notFound } from 'next/navigation';
import { PortfolioPreview } from '@/components/PortfolioPreview';
import { getPortfolio } from '@/lib/store';

export async function generateMetadata({ params }: { params: { subdomain: string } }) {
  const portfolio = await getPortfolio(params.subdomain);

  if (!portfolio) {
    return {
      title: 'Portfolio Not Found | FreelancePDF'
    };
  }

  return {
    title: `${portfolio.data.name} | Freelance Portfolio`,
    description: portfolio.data.summary || `${portfolio.data.name}'s freelancer portfolio.`
  };
}

export default async function PublishedPortfolioPage({ params }: { params: { subdomain: string } }) {
  const portfolio = await getPortfolio(params.subdomain);

  if (!portfolio) {
    notFound();
  }

  return (
    <main className="mx-auto min-h-screen max-w-3xl px-4 py-8">
      <PortfolioPreview
        data={portfolio.data}
        themeMode={portfolio.themeMode}
        fontFamily={portfolio.fontFamily}
      />
    </main>
  );
}
