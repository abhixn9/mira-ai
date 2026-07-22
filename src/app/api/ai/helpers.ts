import { NextResponse } from 'next/server';
import { 
  simulateSummary, 
  simulateBulletPoints, 
  simulateChatResponse 
} from '@/utils/aiSimulator';
import { localAtsAudit } from '@/utils/atsAnalyzer';
 
export function safeJsonParse<T>(text: string, fallback: T): T {
  try {
    let cleanText = text.trim();
    if (cleanText.startsWith('```json')) {
      cleanText = cleanText.substring(7);
    } else if (cleanText.startsWith('```')) {
      cleanText = cleanText.substring(3);
    }
    if (cleanText.endsWith('```')) {
      cleanText = cleanText.substring(0, cleanText.length - 3);
    }
    cleanText = cleanText.trim();

    // Extract JSON string between braces or brackets
    const firstBrace = cleanText.indexOf('{');
    const lastBrace = cleanText.lastIndexOf('}');
    const firstBracket = cleanText.indexOf('[');
    const lastBracket = cleanText.lastIndexOf(']');

    if (firstBrace !== -1 && lastBrace !== -1 && (firstBracket === -1 || firstBrace < firstBracket)) {
      cleanText = cleanText.substring(firstBrace, lastBrace + 1);
    } else if (firstBracket !== -1 && lastBracket !== -1) {
      cleanText = cleanText.substring(firstBracket, lastBracket + 1);
    }

    return JSON.parse(cleanText) as T;
  } catch (e) {
    console.warn("[JSON Parsing Error] Failed to parse text:", text, e);
    return fallback;
  }
}
 
export function handleLocalFallback(type: string, payload: Record<string, unknown>) {
  console.log("[AI API Route] Fallback Status: true");
  let result: unknown = null;
 
  switch (type) {
    case 'generate-summary': {
      const { jobTitle, tone } = payload as { jobTitle: string; tone: 'professional' | 'executive' | 'creative' };
      result = simulateSummary({ jobTitle, tone });
      break;
    }
    case 'improve-experience':
    case 'rewrite-bullets': {
      const { jobTitle } = payload as { jobTitle?: string };
      result = simulateBulletPoints({ jobTitle: jobTitle || 'Engineer', tone: 'professional' });
      break;
    }
    case 'generate-skills': {
      result = {
        technical: ["React", "Next.js", "TypeScript", "Node.js", "PostgreSQL", "Tailwind CSS"],
        soft: ["Leadership", "Communication", "Problem Solving"]
      };
      break;
    }
    case 'generate-projects': {
      result = [
        { title: "Design-Centric SaaS Platform", description: "Engineered a high-performance Next.js application with modular layout components, tailwind utility sets, and automated data syncing." },
        { title: "Real-time Analytics Engine", description: "Constructed pure-CSS chart indicators and mock reporting microservices, reducing payload sizing by 40%." }
      ];
      break;
    }
    case 'generate-cover-letter': {
      const { jobTitle } = payload;
      result = `Dear Hiring Manager,\n\nI am writing to express my enthusiastic interest in the ${jobTitle || 'Engineer'} position. With my extensive background in full-stack architectures and design-centric workflows, I am confident in my ability to immediately deliver high-value deliverables to your team.\n\nThank you for your consideration.\n\nSincerely,\nCandidate`;
      break;
    }
    case 'optimize-resume':
    case 'keyword-suggestions': {
      const { jobTitle, jobDescription, currentText } = payload as { jobTitle?: string; jobDescription?: string; currentText?: string };
      result = localAtsAudit(currentText || '', jobTitle || 'Developer', jobDescription || '');
      break;
    }
    case 'interview-questions': {
      result = "1. Tell me about your Next.js scaling experience.\n2. How do you resolve server rendering bottlenecks?\n3. Walk me through a challenging system architecture choice.";
      break;
    }
    case 'career-advice': {
      const { query, history, context } = payload as { 
        query?: string; 
        history?: { sender: string; text: string }[];
        context?: Record<string, unknown>;
      };
      const lastMessageText = query || (history && history.length > 0 ? history[history.length - 1].text : '');
      result = simulateChatResponse(lastMessageText, context);
      break;
    }
    default:
      result = "Analysis complete.";
  }
 
  return NextResponse.json({ result, fallback: true });
}
