import pdfParse from 'pdf-parse';
import { ResumeData } from '@/lib/types';

const SECTION_KEYS: Record<keyof Omit<ResumeData, 'rawText' | 'name' | 'title' | 'email' | 'phone' | 'location' | 'summary'>, RegExp[]> = {
  skills: [/^skills?$/i, /^tech(nical)? skills?$/i],
  experience: [/^experience$/i, /^work experience$/i, /^employment$/i],
  projects: [/^projects?$/i, /^selected projects?$/i],
  education: [/^education$/i, /^academics?$/i],
  certifications: [/^certifications?$/i, /^licenses?$/i]
};

function detectSection(line: string) {
  const normalized = line.replace(/[:\-]/g, '').trim();
  return (Object.keys(SECTION_KEYS) as Array<keyof typeof SECTION_KEYS>).find((key) =>
    SECTION_KEYS[key].some((regex) => regex.test(normalized))
  );
}

function extractTopField(text: string, regex: RegExp) {
  return text.match(regex)?.[1]?.trim();
}

export async function extractResumeData(fileBuffer: Buffer): Promise<ResumeData> {
  const parsed = await pdfParse(fileBuffer);
  const text = parsed.text.replace(/\t/g, ' ').replace(/\r/g, '');
  const lines = text
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);

  const bySection: Pick<ResumeData, 'skills' | 'experience' | 'projects' | 'education' | 'certifications'> = {
    skills: [],
    experience: [],
    projects: [],
    education: [],
    certifications: []
  };

  let currentSection: keyof typeof bySection | undefined;

  for (const line of lines) {
    const detected = detectSection(line);
    if (detected) {
      currentSection = detected;
      continue;
    }

    if (!currentSection) continue;
    bySection[currentSection].push(line.replace(/^[-•]\s*/, '').trim());
  }

  const firstLine = lines[0] ?? 'Freelancer';
  const summaryIndex = lines.findIndex((line) => /^summary$/i.test(line));

  const email = extractTopField(text, /([A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,})/i);
  const phone = extractTopField(text, /(\+?\d[\d\s().-]{7,}\d)/i);

  return {
    name: firstLine,
    title: lines[1],
    email,
    phone,
    location: extractTopField(text, /(?:Location|Address)\s*[:\-]\s*(.+)/i),
    summary:
      summaryIndex >= 0
        ? lines.slice(summaryIndex + 1, summaryIndex + 4).join(' ')
        : lines.slice(2, 5).join(' '),
    skills: bySection.skills.length ? bySection.skills : lines.filter((line) => /React|Node|Python|Design|Figma|AWS/i.test(line)),
    experience: bySection.experience,
    projects: bySection.projects,
    education: bySection.education,
    certifications: bySection.certifications,
    rawText: text
  };
}
