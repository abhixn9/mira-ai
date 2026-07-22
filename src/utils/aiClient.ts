import { ResumeData } from "@/types/resume";

async function queryAiApi(type: string, payload: unknown): Promise<unknown> {
  try {
    const response = await fetch('/api/ai', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ type, payload }),
    });

    if (!response.ok) {
      const errData = await response.json() as { error?: string };
      throw new Error(errData.error || 'Server error during completion request');
    }

    const data = await response.json() as { result: unknown };
    return data.result;
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    console.warn(`[AI Client Warning] Query failed, using local simulation. Details:`, msg);
    throw error;
  }
}

export async function generateSummaryApi(jobTitle: string, tone: 'professional' | 'executive' | 'creative'): Promise<string> {
  const res = await queryAiApi('generate-summary', { jobTitle, tone });
  return res as string;
}

export async function improveExperienceApi(jobTitle: string, bullets: string[]): Promise<string[]> {
  const res = await queryAiApi('rewrite-bullets', { jobTitle, bullets });
  return res as string[];
}

export async function generateSkillsApi(jobTitle: string): Promise<{ technical: string[]; soft: string[] }> {
  const res = await queryAiApi('generate-skills', { jobTitle });
  return res as { technical: string[]; soft: string[] };
}

export async function generateProjectsApi(jobTitle: string, skills: string[]): Promise<{ title: string; description: string }[]> {
  const res = await queryAiApi('generate-projects', { jobTitle, skills });
  return res as { title: string; description: string }[];
}

export async function generateCoverLetterApi(
  jobTitle: string,
  jobDescription: string,
  tone: 'professional' | 'executive' | 'creative',
  resumeData?: ResumeData
): Promise<string> {
  const res = await queryAiApi('generate-cover-letter', { jobTitle, jobDescription, tone, resumeData });
  return res as string;
}

export async function optimizeResumeApi(
  jobTitle: string,
  jobDescription: string,
  currentText: string
): Promise<{ score: number; missing: string[]; found: string[] }> {
  const res = await queryAiApi('optimize-resume', { jobTitle, jobDescription, currentText });
  return res as { score: number; missing: string[]; found: string[] };
}

export async function getInterviewQuestionsApi(jobTitle: string, resumeData?: ResumeData): Promise<string> {
  const res = await queryAiApi('interview-questions', { jobTitle, resumeData });
  return res as string;
}

export async function getCareerAdviceApi(query: string, resumeData?: ResumeData): Promise<string> {
  const res = await queryAiApi('career-advice', { query, resumeData });
  return res as string;
}
