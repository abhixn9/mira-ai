import { NextResponse } from 'next/server';
import { getGeminiClient } from './gemini';
import { detectIntent } from './intent';
import { buildContextMessage, ChatContext } from './context';
import { getSystemPrompt } from './prompts';
import { safeJsonParse, handleLocalFallback } from './helpers';

async function queryGeminiNative(prompt: string, systemInstruction?: string): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("No GEMINI_API_KEY present");
  }
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }]
        }
      ],
      systemInstruction: systemInstruction ? {
        parts: [{ text: systemInstruction }]
      } : undefined,
      generationConfig: {
        temperature: 0.6,
        responseMimeType: "application/json"
      }
    })
  });
  
  if (!response.ok) {
    throw new Error(`Gemini native response error: ${response.statusText}`);
  }
  const data = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
  return text;
}
 
export async function POST(req: Request) {
  let type = "";
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let payload: Record<string, any> = {};
  
  try {
    const body = await req.json();
    type = body.type;
    payload = body.payload;
 
    if (!type || !payload) {
      return NextResponse.json({ error: "Missing type or payload parameter" }, { status: 400 });
    }
 
    const openai = getGeminiClient();
    const keyExists = !!(process.env.GEMINI_API_KEY || process.env.OPENAI_API_KEY);
 
    console.log("========== GEMINI API KEY STATUS ==========");
    console.log(`GEMINI_API_KEY configured in environment: ${keyExists}`);
 
    // Fallback to simulator if no Gemini client can be initialized (no key present)
    if (!openai) {
      console.log("[AI API Route] Selected Model: Fallback Simulator");
      console.log("[AI API Route] Mode: Fallback");
      if (type === 'career-advice') {
        console.log("=====================");
        console.log("MIRA AI REQUEST");
        console.log("=====================");
        console.log("Provider:\nGemini\n");
        console.log("Model:\ngemini-2.5-flash\n");
        console.log("API Success:\nfalse\n");
        console.log("Fallback Used:\ntrue\n");
        console.log("=====================");
        console.log("END REQUEST");
        console.log("=====================");
      }
      return handleLocalFallback(type, payload);
    }
 
    console.log("[AI API Route] Selected Model: gemini-2.5-flash");
    console.log("[AI API Route] Mode: Live API Client (OpenAI-compatible)");
 
    switch (type) {
      case 'generate-summary': {
        const { jobTitle, tone } = payload as { jobTitle: string; tone: string };
        const systemInstruction = `You are an expert resume writer. Write a professional, high-impact resume summary statement for a candidate targeting the job: "${jobTitle}". Use a ${tone} tone. Keep it concise, action-oriented, and under 3-4 sentences (approx 60-80 words). Do not include placeholders, formatting markdown, or introduction sentences.`;
 
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const messages: any[] = [
          { role: 'system', content: systemInstruction },
          { role: 'user', content: `Generate summary targeting: "${jobTitle}"` }
        ];
 
        console.log("========== REQUEST PAYLOAD ==========");
        console.log(JSON.stringify({ model: 'gemini-2.5-flash', messages, temperature: 0.7 }, null, 2));
 
        const response = await openai.chat.completions.create({
          model: 'gemini-2.5-flash',
          messages: messages,
          temperature: 0.7
        });
 
        const rawResponse = response.choices[0]?.message?.content?.trim() || '';
        console.log("========== GEMINI RAW RESPONSE ==========");
        console.log(rawResponse);
        console.log("========== FINAL RESPONSE ==========");
        console.log(rawResponse);
        return NextResponse.json({ result: rawResponse });
      }
 
      case 'improve-experience':
      case 'rewrite-bullets': {
        const { jobTitle, role, company, bullets } = payload as { jobTitle?: string; role?: string; company?: string; bullets?: string[] };
        const items = bullets || [];
        const context = jobTitle || `${role} at ${company}`;
        const systemInstruction = `You are a premium career strategist. Revise the following duties/bullet points for a "${context}" to make them stronger, action-focused, and quantified with high-impact metrics (e.g. percentages, dollars, scale).
        Return ONLY a JSON array of strings representing the revised bullet points. Follow this schema exactly: ["bullet 1", "bullet 2"]`;
        const prompt = `Revise these bullets: ${JSON.stringify(items)}`;

        try {
          const rawResponse = await queryGeminiNative(prompt, systemInstruction);
          console.log("========== NATIVE GEMINI RESPONSE ==========");
          console.log(rawResponse);
          const parsed = safeJsonParse<{ bullets?: string[]; revised?: string[] } | string[]>(rawResponse, { bullets: [] });
          const results = Array.isArray(parsed) ? parsed : (parsed.bullets || parsed.revised || []);
          return NextResponse.json({ result: results });
        } catch (err) {
          console.warn("[Native Gemini Failed] Falling back to OpenAI compatible SDK:", err);
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const messages: any[] = [
            { role: 'system', content: systemInstruction },
            { role: 'user', content: prompt }
          ];
          const response = await openai!.chat.completions.create({
            model: 'gemini-2.5-flash',
            messages: messages,
            response_format: { type: "json_object" },
            temperature: 0.6
          });
          const rawResponse = response.choices[0]?.message?.content || '';
          const parsed = safeJsonParse<{ bullets?: string[]; revised?: string[] } | string[]>(rawResponse, { bullets: [] });
          const results = Array.isArray(parsed) ? parsed : (parsed.bullets || parsed.revised || []);
          return NextResponse.json({ result: results });
        }
      }
 
      case 'generate-skills': {
        const { jobTitle } = payload as { jobTitle: string };
        const systemInstruction = `Suggest a list of technical skills (max 10) and soft skills (max 5) for a candidate targeting: "${jobTitle}". 
        Return ONLY a valid JSON object matching the format: {"technical": ["Next.js", ...], "soft": ["Communication", ...]}`;
 
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const messages: any[] = [
          { role: 'system', content: systemInstruction },
          { role: 'user', content: `Generate skills for: ${jobTitle}` }
        ];
 
        console.log("========== REQUEST PAYLOAD ==========");
        console.log(JSON.stringify({ model: 'gemini-2.5-flash', messages, response_format: { type: "json_object" }, temperature: 0.6 }, null, 2));
 
        const response = await openai.chat.completions.create({
          model: 'gemini-2.5-flash',
          messages: messages,
          response_format: { type: "json_object" },
          temperature: 0.6
        });
 
        const rawResponse = response.choices[0]?.message?.content || '';
        console.log("========== GEMINI RAW RESPONSE ==========");
        console.log(rawResponse);
        return NextResponse.json({ result: safeJsonParse(rawResponse, { technical: [], soft: [] }) });
      }
 
      case 'generate-projects': {
        const { jobTitle, skills } = payload as { jobTitle: string; skills: string[] };
        const systemInstruction = `Create 2 relevant portfolio project ideas for a candidate targeting "${jobTitle}" using skills: ${JSON.stringify(skills)}.
        Return ONLY a valid JSON object matching the format: {"projects": [{"title": "Project A", "description": "Short description of what was built and why..."}]}`;
 
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const messages: any[] = [
          { role: 'system', content: systemInstruction },
          { role: 'user', content: `Generate projects using skills: ${JSON.stringify(skills)}` }
        ];
 
        console.log("========== REQUEST PAYLOAD ==========");
        console.log(JSON.stringify({ model: 'gemini-2.5-flash', messages, response_format: { type: "json_object" }, temperature: 0.7 }, null, 2));
 
        const response = await openai.chat.completions.create({
          model: 'gemini-2.5-flash',
          messages: messages,
          response_format: { type: "json_object" },
          temperature: 0.7
        });
 
        const rawResponse = response.choices[0]?.message?.content || '';
        console.log("========== GEMINI RAW RESPONSE ==========");
        console.log(rawResponse);
        return NextResponse.json({ result: safeJsonParse<{ projects?: { title: string; description: string }[] }>(rawResponse, { projects: [] }).projects || [] });
      }
 
      case 'generate-cover-letter': {
        const { jobTitle, jobDescription, tone, resumeData } = payload as { 
          jobTitle: string; 
          jobDescription: string; 
          tone: string; 
          resumeData?: {
            personalInfo?: { name?: string };
            summary?: string;
            skills?: { technical?: string[] };
          };
        };
        const resumeSummary = resumeData ? `Name: ${resumeData.personalInfo?.name}, Summary: ${resumeData.summary}, Skills: ${resumeData.skills?.technical?.join(', ')}` : '';
        const systemInstruction = `Write a customized, highly engaging cover letter in a ${tone} tone for a "${jobTitle}" position. 
        Candidate Resume Context: ${resumeSummary}.
        Target Job Requirements: ${jobDescription}.
        Format as a clean letter. Keep it compelling and fit for a professional application.`;
 
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const messages: any[] = [
          { role: 'system', content: systemInstruction },
          { role: 'user', content: `Generate cover letter for role: ${jobTitle}` }
        ];
 
        console.log("========== REQUEST PAYLOAD ==========");
        console.log(JSON.stringify({ model: 'gemini-2.5-flash', messages, temperature: 0.7 }, null, 2));
 
        const response = await openai.chat.completions.create({
          model: 'gemini-2.5-flash',
          messages: messages,
          temperature: 0.7
        });
 
        const rawResponse = response.choices[0]?.message?.content || '';
        console.log("========== GEMINI RAW RESPONSE ==========");
        console.log(rawResponse);
        return NextResponse.json({ result: rawResponse });
      }
 
      case 'optimize-resume':
      case 'keyword-suggestions': {
        const { jobTitle, jobDescription, currentText } = payload as { jobTitle: string; jobDescription: string; currentText: string };
        const systemInstruction = `You are a Senior Software Engineer and ATS algorithm specialist. Audit the candidate's resume text against the target job description requirements for the role of "${jobTitle}".
        Perform a thorough keyword match analysis and document formatting review.
        Calculate realistic metrics:
        - score: final ATS rating from 0-100 weighted by keyword match (50%), skills (15%), experience (15%), education (10%), and formatting compliance (10%).
        - keywordDensity: matched keywords / required keywords ratio from 0-100.
        - formattingCompliance: score from 0-100 evaluating standard headings, contact details, chronology/dates, single-column flow, and bullet point counts.
        Identify:
        - missing: array of required skills/keywords from the job description that do NOT exist in the resume text.
        - found: array of required skills/keywords from the job description that DO exist in the resume text.
        - formattingIssues: array of structured objects with:
          * title: string
          * desc: string explaining the formatting item or issue
          * type: "success" | "warning" | "error"
        - suggestions: array of actual, highly personalized suggestions based on keyword gaps, formatting, and content improvements.
        
        Resume text: "${currentText}"
        Job Description: "${jobDescription}"

        Return ONLY a valid JSON object with this exact schema:
        {
          "score": number,
          "keywordDensity": number,
          "formattingCompliance": number,
          "missing": string[],
          "found": string[],
          "formattingIssues": [{"title": "...", "desc": "...", "type": "success|warning|error"}],
          "suggestions": string[]
        }
        Do not include markdown wrappers or any conversational text.`;
 
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const messages: any[] = [
          { role: 'system', content: systemInstruction },
          { role: 'user', content: `Perform resume optimization audit` }
        ];
 
        console.log("========== REQUEST PAYLOAD ==========");
        console.log(JSON.stringify({ model: 'gemini-2.5-flash', messages, response_format: { type: "json_object" }, temperature: 0.5 }, null, 2));
 
        const response = await openai.chat.completions.create({
          model: 'gemini-2.5-flash',
          messages: messages,
          response_format: { type: "json_object" },
          temperature: 0.5
        });
 
        const rawResponse = response.choices[0]?.message?.content || '';
        console.log("========== GEMINI RAW RESPONSE ==========");
        console.log(rawResponse);
        return NextResponse.json({ result: safeJsonParse(rawResponse, { score: 70, keywordDensity: 50, formattingCompliance: 90, missing: [], found: [], formattingIssues: [], suggestions: [] }) });
      }
 
      case 'interview-questions': {
        const { jobTitle, resumeData } = payload as {
          jobTitle: string;
          resumeData?: {
            personalInfo?: { name?: string };
            summary?: string;
            experience?: unknown[];
          };
        };
        const context = resumeData ? `Name: ${resumeData.personalInfo?.name}, Summary: ${resumeData.summary}, Experience: ${JSON.stringify(resumeData.experience)}` : '';
        const systemInstruction = `You are an interviewer. Formulate 5 tailored technical and situational interview questions for a candidate seeking a "${jobTitle}" position. Candidate Details: ${context}.`;
 
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const messages: any[] = [
          { role: 'system', content: systemInstruction },
          { role: 'user', content: `Formulate interview questions` }
        ];
 
        console.log("========== REQUEST PAYLOAD ==========");
        console.log(JSON.stringify({ model: 'gemini-2.5-flash', messages, temperature: 0.8 }, null, 2));
 
        const response = await openai.chat.completions.create({
          model: 'gemini-2.5-flash',
          messages: messages,
          temperature: 0.8
        });
 
        const rawResponse = response.choices[0]?.message?.content || '';
        console.log("========== GEMINI RAW RESPONSE ==========");
        console.log(rawResponse);
        return NextResponse.json({ result: rawResponse });
      }
 
      case 'career-advice': {
        const { query, history, context } = payload as {
          query: string;
          history: { sender: string; text: string }[];
          context?: ChatContext;
        };
        console.log("========== USER QUESTION ==========");
        console.log(query);
 
        const intent = detectIntent(query, context?.currentPage);
 
        const page = context?.currentPage || '';
        const isWorkspaceRoute = page.includes('builder') || page.includes('resume') || page.includes('ats') || page.includes('cover-letter') || page.includes('dashboard');
        const isWorkspaceIntent = ['Website Feature', 'Builder Help', 'Resume', 'ATS', 'Cover Letter', 'LinkedIn', 'GitHub'].includes(intent);
        
        const includeBuilderPrompt = isWorkspaceRoute || isWorkspaceIntent;
        const injectContext = intent !== 'General Knowledge' && intent !== 'Greeting';
 
        const contextMessage = injectContext ? buildContextMessage(context) : "";
        const systemInstruction = getSystemPrompt(includeBuilderPrompt, contextMessage);
 
        const cleanHistory = Array.isArray(history) ? [...history] : [];
        if (cleanHistory.length > 0 && cleanHistory[cleanHistory.length - 1].text === query) {
          cleanHistory.pop();
        }
 
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const messages: any[] = [
          { role: 'system', content: systemInstruction }
        ];
 
        cleanHistory.forEach((msg) => {
          messages.push({
            role: msg.sender === 'user' ? 'user' : 'assistant',
            content: msg.text
          });
        });
 
        messages.push({
          role: 'user',
          content: query
        });
 
        console.log("========== MESSAGES ==========");
        console.log(JSON.stringify(messages, null, 2));
 
        const response = await openai.chat.completions.create({
          model: 'gemini-2.5-flash',
          messages: messages,
          temperature: 0.3,
          max_tokens: 2048
        });
 
        const finalResponse = response.choices[0]?.message?.content || '';
        console.log("========== GEMINI RAW RESPONSE ==========");
        console.log(finalResponse);
        console.log("========== FINAL RESPONSE ==========");
        console.log(finalResponse);
        console.log("=====================");
        console.log("MIRA AI REQUEST");
        console.log("=====================");
        console.log("Provider:\nGemini\n");
        console.log("Model:\ngemini-2.5-flash\n");
        console.log("API Success:\ntrue\n");
        console.log("Fallback Used:\nfalse\n");
        console.log("=====================");
        console.log("END REQUEST");
        console.log("=====================");

        return NextResponse.json({ result: finalResponse });
      }
 
      default:
        return NextResponse.json({ error: "Unsupported API request type" }, { status: 400 });
    }
 
  } catch (error: unknown) {
    console.error("========== FULL ERROR DETAILS ==========");
    console.error(error);
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const err = error as any;
    const errMsg = err?.message || String(error);
    const errStatus = err?.status || 500;
 
    // Detect if this is a network/connectivity error (no connection, DNS fail, timeout)
    const isNetworkError = 
      err?.code === 'ENOTFOUND' || 
      err?.code === 'ETIMEDOUT' || 
      err?.code === 'ECONNREFUSED' || 
      errMsg.toLowerCase().includes('fetch failed') ||
      errMsg.toLowerCase().includes('network') ||
      errMsg.toLowerCase().includes('timeout') ||
      errMsg.toLowerCase().includes('unreachable');
 
    if (isNetworkError) {
      if (type === 'career-advice') {
        console.log("=====================");
        console.log("MIRA AI REQUEST");
        console.log("=====================");
        console.log("Provider:\nGemini\n");
        console.log("Model:\ngemini-2.5-flash\n");
        console.log("API Success:\nfalse\n");
        console.log("Fallback Used:\ntrue\n");
        console.log("=====================");
        console.log("END REQUEST");
        console.log("=====================");
      }
      console.log(`[AI API] Network error detected. Falling back to local simulator for type: ${type}`);
      return handleLocalFallback(type, payload);
    }
 
    // Return direct, human-understandable API errors for 400, 401, 403, 404, 429
    let userFacingMsg = errMsg;
    if (errStatus === 401) {
      userFacingMsg = "Invalid API key provided. Please verify your GEMINI_API_KEY in .env.local.";
    } else if (errStatus === 429) {
      userFacingMsg = "Gemini quota exceeded or rate limit hit. Please try again later.";
    } else if (errStatus === 404) {
      userFacingMsg = "Model or endpoint not found. Please check the model name (gemini-2.5-flash).";
    } else if (errStatus === 403) {
      userFacingMsg = "Access forbidden. Ensure your API key has permission for the Generative Language API.";
    } else if (errStatus === 400) {
      userFacingMsg = `Bad Request: ${errMsg}`;
    }
 
    return NextResponse.json(
      { error: userFacingMsg, status: errStatus, fallback: false },
      { status: errStatus }
    );
  }
}
