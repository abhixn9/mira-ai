import { PersonalInfo } from "@/types/resume";

export interface SimulatorParams {
  jobTitle: string;
  tone: 'professional' | 'executive' | 'creative';
  currentText?: string;
  keywords?: string[];
  companyName?: string;
}

// Industry specific database of high-quality phrases and achievements
const AI_DATABASE = {
  software: {
    summaries: {
      professional: "Detail-oriented Software Engineer with 6+ years of experience designing scalable RESTful APIs and interactive micro-frontend interfaces. Proficient in React, Next.js, and Node.js. Accomplished at leading cross-functional teams to deploy robust CI/CD automation pipelines that reduce delivery overhead by 25%.",
      executive: "Forward-thinking Engineering Leader with a decade of expertise architecting high-throughput cloud platforms and modular SaaS architectures. Proven record of scaling distributed database backends and aligning technology milestones with corporate growth directives, accelerating year-over-year revenue by 40%.",
      creative: "Code craftsman and frontend artisan dedicated to building highly animated, fluid web spaces. Blends technical mastery in React, WebGL, and Framer Motion with an eye for premium luxury design to create interfaces that captivate users and redefine digital products."
    },
    achievements: [
      "Engineered micro-frontend modules that decreased initial page load time by 1.4 seconds (35% Core Web Vitals boost).",
      "Architected serverless AWS Lambda and Node.js API backends supporting 15,000 requests per minute with 99.95% uptime.",
      "Optimized production PostgreSQL queries through strategic indexing, saving 40% CPU utilization.",
      "Spearheaded cloud migration from legacy bare-metal to Google Cloud Kubernetes (GKE), reducing operating costs by $120k annually."
    ],
    skills: ["React / Next.js", "TypeScript", "Node.js / NestJS", "PostgreSQL", "Docker", "AWS / GCP", "REST / GraphQL", "Redis", "CI/CD (GitHub Actions)"]
  },
  marketing: {
    summaries: {
      professional: "Dynamic Digital Marketing Specialist with 5+ years of experience building conversion-driven Google Ads campaigns and organic SEO engines. Adept at conducting cohort analysis, leading content marketing calendars, and increasing customer acquisition rates by 45%.",
      executive: "Strategic Brand Director with over 12 years of experience leading multi-million dollar marketing campaigns across global markets. Expert in market segmentation, product positioning, and building high-performance acquisition teams that consistently increase ROI by 3.4x.",
      creative: "Creative Campaign Storyteller who bridges data-driven analytics with artistic branding. Designs immersive visual experiences, viral social strategies, and brand architectures that cut through market noise and double user engagement rates."
    },
    achievements: [
      "Scaled organic SEO traffic by 180% over 8 months through comprehensive keyword research and link-building frameworks.",
      "Managed a $45,000 monthly search marketing budget, achieving an average client conversion rate increase of 38%.",
      "Pioneered a tailored visual storytelling campaign on TikTok that generated 5.2 million views and $150k in direct sales.",
      "Redesigned the email marketing lead-generation flow, boosting active subscriber click-through rates by 22%."
    ],
    skills: ["Search Ads", "SEO Optimization", "Google Analytics", "Brand Strategy", "Content Marketing", "Copywriting", "A/B Testing", "Email Automation", "Adobe Suite"]
  },
  finance: {
    summaries: {
      professional: "Analytical Financial Analyst with 4+ years of experience constructing valuation spreadsheets, conducting due diligence, and compiling monthly cash flow forecasts. Strong knowledge of financial compliance laws and ERP ledger bookkeeping systems.",
      executive: "Distinguished Chief Financial Officer with 15+ years of experience leading corporate restructurings, M&A due diligence, and capital allocations. Skilled at implementing enterprise risk management protocols and generating capital efficiencies that saved $4.2M in annual costs.",
      creative: "Innovative Financial Strategist specializing in venture capital modeling and rapid-growth SaaS valuations. Blends predictive market analyses with visual data reporting to pitch and close funding rounds for high-potential technology start-ups."
    },
    achievements: [
      "Designed predictive cash flow spreadsheets with 98.6% forecast accuracy, optimizing cash management.",
      "Facilitated a $12M Series A funding round by compiling detailed venture valuation models and investor slide decks.",
      "Audited internal corporate expense records, identifying $45,000 in redundant operational licensing costs.",
      "Re-engineered corporate bookkeeping practices, reducing month-end closing times by 4 business days."
    ],
    skills: ["Financial Modeling", "Corporate Valuation", "M&A Analytics", "Postgres SQL", "Excel Macros", "GAAP Compliance", "Risk Assessment", "ERP systems", "Tableau Data Vis"]
  }
};

export function simulateSummary(params: SimulatorParams): string {
  const category = getCategory(params.jobTitle);
  const data = AI_DATABASE[category];
  return data.summaries[params.tone];
}

export function simulateBulletPoints(params: SimulatorParams): string[] {
  const category = getCategory(params.jobTitle);
  const data = AI_DATABASE[category];
  
  // Pick random subset of achievements matching the domain
  const shuffled = [...data.achievements].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, 3);
}

export function simulateCoverLetter(params: SimulatorParams, personal: PersonalInfo): string {
  const recipient = "Hiring Committee";
  const comp = params.companyName || "Target Company";
  
  const category = getCategory(params.jobTitle);
  const summaries = AI_DATABASE[category].summaries[params.tone];

  return `Dear ${recipient},\n\nI am writing to express my enthusiastic interest in the ${params.jobTitle} position at ${comp}. With my background in this domain and a strong history of executing high-quality projects, I am confident in my capacity to add immediate value to your organization.\n\nAs a professional, I have always prioritized combining technical correctness with strategic goals. ${summaries}\n\nI am eager to bring my capabilities in system building, collaborative troubleshooting, and client delivery to ${comp}. I look forward to discussing how my experience fits your current initiatives.\n\nSincerely,\n\n${personal.name || 'Alexander Sterling'}`;
}

export function simulateKeywords(params: SimulatorParams): { matchScore: number; missing: string[]; found: string[] } {
  const category = getCategory(params.jobTitle);
  const data = AI_DATABASE[category];
  const targetKeywords = data.skills;

  const found: string[] = [];
  const missing: string[] = [];

  const textToAnalyze = (params.currentText || '').toLowerCase();

  targetKeywords.forEach(kw => {
    // Check if keyword is in the text
    const cleanKw = kw.toLowerCase().replace(/[^a-z0-9]/g, '');
    if (textToAnalyze.includes(cleanKw) || textToAnalyze.includes(kw.toLowerCase())) {
      found.push(kw);
    } else {
      missing.push(kw);
    }
  });

  // Calculate score based on found vs target
  const score = targetKeywords.length > 0 
    ? Math.round((found.length / targetKeywords.length) * 100) 
    : 80;

  return {
    matchScore: Math.max(35, Math.min(score, 100)), // ensure reasonable ranges
    missing: missing.slice(0, 4),
    found
  };
}

function getCategory(jobTitle: string): 'software' | 'marketing' | 'finance' {
  const title = (jobTitle || '').toLowerCase();
  if (title.includes('market') || title.includes('seo') || title.includes('brand') || title.includes('sales')) {
    return 'marketing';
  }
  if (title.includes('finance') || title.includes('bank') || title.includes('analyst') || title.includes('ledger') || title.includes('tax')) {
    return 'finance';
  }
  return 'software'; // default
}

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

export function simulateChatResponse(query?: string, context?: ChatContext): string {
  console.log("[AI Simulator] simulating career advice response for:", query, context);
  return "I'm sorry, the AI service is temporarily unavailable.";
}
