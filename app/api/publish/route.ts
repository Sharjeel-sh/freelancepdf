import { NextResponse } from 'next/server';
import slugify from 'slugify';
import { z } from 'zod';
import { savePortfolio } from '@/lib/store';

const publishSchema = z.object({
  data: z.object({
    name: z.string().min(2),
    title: z.string().optional(),
    email: z.string().optional(),
    phone: z.string().optional(),
    location: z.string().optional(),
    summary: z.string().optional(),
    skills: z.array(z.string()).default([]),
    experience: z.array(z.string()).default([]),
    projects: z.array(z.string()).default([]),
    education: z.array(z.string()).default([]),
    certifications: z.array(z.string()).default([]),
    rawText: z.string().default('')
  }),
  themeMode: z.enum(['light', 'dark']),
  fontFamily: z.enum(['sans', 'serif', 'mono'])
});

export async function POST(req: Request) {
  try {
    const payload = publishSchema.parse(await req.json());
    const subdomain = slugify(payload.data.name, { lower: true, strict: true }) || `freelancer-${Date.now()}`;

    await savePortfolio({
      subdomain,
      createdAt: new Date().toISOString(),
      themeMode: payload.themeMode,
      fontFamily: payload.fontFamily,
      data: payload.data
    });

    const host = process.env.NEXT_PUBLIC_APP_DOMAIN || 'freelancepdf.site';

    return NextResponse.json({
      subdomain,
      url: `https://${subdomain}.${host}`,
      fallbackUrl: `/p/${subdomain}`
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Could not publish website.';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
