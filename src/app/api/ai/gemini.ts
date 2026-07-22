import OpenAI from 'openai';
 
export function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY || process.env.OPENAI_API_KEY;
  if (!apiKey) return null;
  
  // Return OpenAI instance configured with Gemini OpenAI compatibility base URL
  return new OpenAI({
    apiKey: apiKey,
    baseURL: 'https://generativelanguage.googleapis.com/v1beta/openai/'
  });
}
