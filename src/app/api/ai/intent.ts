export type IntentType = 
  | 'Greeting' 
  | 'General Knowledge' 
  | 'Programming' 
  | 'Resume' 
  | 'ATS' 
  | 'Interview' 
  | 'Cover Letter' 
  | 'LinkedIn' 
  | 'GitHub' 
  | 'Website Feature' 
  | 'Builder Help' 
  | 'SEO' 
  | 'Marketing' 
  | 'Writing' 
  | 'Career' 
  | 'Technology' 
  | 'Education' 
  | 'Other';
 
export function detectIntent(query: string, pathname?: string): IntentType {
  const q = query.toLowerCase();
  
  if (pathname && pathname.includes('/builder')) {
    // contextual parsing
  }
  
  // Website Feature / GitHub
  if (q.includes('github') || q.includes('git hub')) return 'GitHub';
  if (q.includes('linkedin') || q.includes('linked in')) return 'LinkedIn';
  
  // Greetings
  const greetings = ['hi', 'hello', 'hey', 'greetings', 'yo', 'hi there', 'hello there', 'hola'];
  if (greetings.some(g => q === g || q.startsWith(g + ' ') || q.startsWith(g + ','))) return 'Greeting';
  
  // Programming / Tech
  if (q.includes('code') || q.includes('javascript') || q.includes('python') || q.includes('programming') || q.includes('closure') || q.includes('variable') || q.includes('function') || q.includes('database') || q.includes('sql') || q.includes('html') || q.includes('css') || q.includes('typescript') || q.includes('java')) {
    return 'Programming';
  }
 
  // Resume / ATS
  if (q.includes('resume') || q.includes('cv ') || q.includes('curriculum vitae')) return 'Resume';
  if (q.includes('ats') || q.includes('scanner') || q.includes('score') || q.includes('parsing')) return 'ATS';
  
  // Cover Letter
  if (q.includes('cover letter') || q.includes('letter of interest') || q.includes('letter of intent')) return 'Cover Letter';
  
  // Interview
  if (q.includes('interview') || q.includes('question') || q.includes('star method') || q.includes('mock interview')) return 'Interview';
  
  // SEO / Marketing
  if (q.includes('seo') || q.includes('marketing') || q.includes('google ads') || q.includes('analytics') || q.includes('campaign')) return 'Marketing';
 
  // Website Feature
  if (q.includes('feature') || q.includes('template') || q.includes('download') || q.includes('export') || q.includes('pdf') || q.includes('docx') || q.includes('mira') || q.includes('website')) {
    return 'Website Feature';
  }
 
  // Builder Help
  if (q.includes('step') || q.includes('builder') || q.includes('how to use') || q.includes('help')) return 'Builder Help';
 
  // Writing
  if (q.includes('write') || q.includes('draft') || q.includes('rewrite') || q.includes('summarize')) return 'Writing';
 
  // Education / Career
  if (q.includes('career') || q.includes('job') || q.includes('negotiate') || q.includes('salary') || q.includes('promotion')) return 'Career';
  if (q.includes('education') || q.includes('course') || q.includes('learn') || q.includes('degree') || q.includes('university')) return 'Education';
 
  // Default to General Knowledge if it asks a question
  if (q.includes('what') || q.includes('how') || q.includes('who') || q.includes('where') || q.includes('why') || q.includes('when') || q.includes('define') || q.includes('explain') || q.includes('joke')) {
    return 'General Knowledge';
  }
 
  return 'Other';
}
