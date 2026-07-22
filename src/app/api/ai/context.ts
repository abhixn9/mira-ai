export interface ChatContext {
  appName?: string;
  currentPage?: string;
  currentStep?: string;
  jobTitle?: string;
  skills?: {
    technical?: string[];
    soft?: string[];
    languages?: string[];
  } | null;
  templateId?: string;
  availableFeatures?: string[];
  unavailableFeatures?: string[];
}
 
export function buildContextMessage(context: ChatContext | Record<string, unknown> | null | undefined): string {
  if (!context) return "";
  const ctx = context as ChatContext;
  return `
=========================================
CURRENT APPLICATION CONTEXT
=========================================
Application Name: ${ctx.appName || "Mira AI"}
Current Page: ${ctx.currentPage || "/"}
Current Builder Step: ${ctx.currentStep || "N/A"}
Current Candidate Job Title: ${ctx.jobTitle || "Not Specified"}
Current Resume Technical Skills: ${ctx.skills?.technical ? ctx.skills.technical.join(', ') : "None entered yet"}
Current Resume Soft Skills: ${ctx.skills?.soft ? ctx.skills.soft.join(', ') : "None entered yet"}
Current Selected Resume Template: ${ctx.templateId || "Default"}
 
Available Application Features (Implemented & Active):
${ctx.availableFeatures ? ctx.availableFeatures.map((f: string) => `- ${f}`).join('\n') : ""}
 
Unavailable / Not Implemented Features (Clearly state these are not available if asked):
${ctx.unavailableFeatures ? ctx.unavailableFeatures.map((f: string) => `- ${f}`).join('\n') : ""}
=========================================`;
}
