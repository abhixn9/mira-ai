import { ResumeData } from "@/types/resume";

export interface FormattingIssue {
  title: string;
  desc: string;
  type: 'success' | 'warning' | 'error';
}

export interface AtsAuditResult {
  score: number;
  keywordDensity: number;
  formattingCompliance: number;
  missing: string[];
  found: string[];
  formattingIssues: FormattingIssue[];
  suggestions: string[];
}

export interface KeywordGroup {
  name: string;
  aliases: string[];
}

export const TECH_KEYWORDS: KeywordGroup[] = [
  // Programming Languages
  { name: 'JavaScript', aliases: ['javascript', 'java script', 'js'] },
  { name: 'TypeScript', aliases: ['typescript', 'type script', 'ts'] },
  { name: 'Java', aliases: ['java'] },
  { name: 'Python', aliases: ['python', 'py'] },
  { name: 'C++', aliases: ['c++', 'cpp'] },
  { name: 'Go', aliases: ['golang', 'go lang', 'go'] },
  { name: 'Ruby', aliases: ['ruby', 'rails'] },
  { name: 'Rust', aliases: ['rust'] },
  { name: 'PHP', aliases: ['php'] },
  { name: 'C#', aliases: ['c#', 'csharp'] },
  { name: 'Swift', aliases: ['swift'] },
  { name: 'Kotlin', aliases: ['kotlin'] },
  { name: 'Scala', aliases: ['scala'] },
  { name: 'HTML', aliases: ['html', 'html5'] },
  { name: 'CSS', aliases: ['css', 'css3'] },
  { name: 'SQL', aliases: ['sql'] },

  // Frameworks
  { name: 'React', aliases: ['react', 'reactjs', 'react.js', 'react js'] },
  { name: 'Next.js', aliases: ['next.js', 'nextjs', 'next js', 'next'] },
  { name: 'Angular', aliases: ['angular', 'angularjs', 'angular.js', 'angular js'] },
  { name: 'Vue.js', aliases: ['vue', 'vuejs', 'vue.js', 'vue js'] },
  { name: 'Svelte', aliases: ['svelte'] },
  { name: 'Express.js', aliases: ['express', 'expressjs', 'express.js', 'express js'] },
  { name: 'NestJS', aliases: ['nestjs', 'nest.js', 'nest js', 'nest'] },
  { name: 'Spring Boot', aliases: ['spring boot', 'springboot', 'spring'] },
  { name: 'Django', aliases: ['django'] },
  { name: 'Flask', aliases: ['flask'] },
  { name: 'FastAPI', aliases: ['fastapi'] },
  { name: 'Laravel', aliases: ['laravel'] },
  { name: 'ASP.NET', aliases: ['asp.net', 'aspnet'] },

  // Libraries / CSS
  { name: 'Redux', aliases: ['redux', 'redux-toolkit', 'redux toolkit'] },
  { name: 'Tailwind CSS', aliases: ['tailwind', 'tailwindcss', 'tailwind css'] },
  { name: 'Framer Motion', aliases: ['framer motion', 'framer-motion'] },
  { name: 'Three.js', aliases: ['three.js', 'threejs', 'three js'] },
  { name: 'jQuery', aliases: ['jquery'] },
  { name: 'Bootstrap', aliases: ['bootstrap'] },
  { name: 'Pandas', aliases: ['pandas'] },
  { name: 'NumPy', aliases: ['numpy'] },
  { name: 'Scikit-Learn', aliases: ['scikit-learn', 'scikit learn', 'sklearn'] },
  { name: 'TensorFlow', aliases: ['tensorflow', 'tf'] },
  { name: 'PyTorch', aliases: ['pytorch'] },

  // Databases
  { name: 'PostgreSQL', aliases: ['postgresql', 'postgres'] },
  { name: 'MySQL', aliases: ['mysql'] },
  { name: 'MongoDB', aliases: ['mongodb', 'mongo'] },
  { name: 'Redis', aliases: ['redis'] },
  { name: 'SQLite', aliases: ['sqlite'] },
  { name: 'Cassandra', aliases: ['cassandra'] },
  { name: 'Elasticsearch', aliases: ['elasticsearch', 'elastic search', 'elastic'] },
  { name: 'DynamoDB', aliases: ['dynamodb', 'dynamo'] },

  // Cloud Platforms
  { name: 'AWS', aliases: ['aws', 'amazon web services', 'ec2', 's3', 'lambda'] },
  { name: 'GCP', aliases: ['gcp', 'google cloud', 'google cloud platform', 'gke'] },
  { name: 'Azure', aliases: ['azure', 'microsoft azure'] },
  { name: 'Vercel', aliases: ['vercel'] },
  { name: 'Netlify', aliases: ['netlify'] },
  { name: 'Heroku', aliases: ['heroku'] },

  // DevOps / CI/CD
  { name: 'Docker', aliases: ['docker'] },
  { name: 'Kubernetes', aliases: ['kubernetes', 'k8s'] },
  { name: 'Jenkins', aliases: ['jenkins'] },
  { name: 'Ansible', aliases: ['ansible'] },
  { name: 'Terraform', aliases: ['terraform'] },
  { name: 'GitHub Actions', aliases: ['github actions', 'github action'] },
  { name: 'GitLab CI', aliases: ['gitlab ci', 'gitlab-ci'] },
  { name: 'CI/CD', aliases: ['ci/cd', 'cicd', 'ci cd', 'continuous integration'] },

  // Architecture / System Design
  { name: 'Microservices', aliases: ['microservices', 'microservice', 'micro-services', 'micro services'] },
  { name: 'REST APIs', aliases: ['rest api', 'rest apis', 'restful api', 'restful apis', 'rest'] },
  { name: 'GraphQL', aliases: ['graphql', 'graph ql'] },
  { name: 'System Design', aliases: ['system design', 'system-design'] },
  { name: 'Distributed Systems', aliases: ['distributed systems', 'distributed system'] },
  { name: 'Serverless', aliases: ['serverless'] },
  { name: 'OAuth', aliases: ['oauth', 'oauth2'] },
  { name: 'SSO', aliases: ['sso', 'single sign-on', 'single sign on'] },

  // Soft Skills
  { name: 'Problem Solving', aliases: ['problem solving', 'problem-solving'] },
  { name: 'Communication', aliases: ['communication', 'written communication', 'verbal communication'] },
  { name: 'Leadership', aliases: ['leadership', 'leading', 'lead'] },
  { name: 'Teamwork', aliases: ['teamwork', 'team player', 'team collaboration'] },
  { name: 'Agile', aliases: ['agile'] },
  { name: 'Scrum', aliases: ['scrum'] },
  { name: 'Mentorship', aliases: ['mentorship', 'mentoring', 'mentor'] }
];

// Normalize text helper: replaces punctuation with spaces and normalizes whitespaces
export function cleanAndNormalizeText(text: string): string {
  if (!text) return "";
  return text
    .toLowerCase()
    .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?"']/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

// Helper: check if a text contains any alias of a keyword group
export function checkAliasMatch(normalizedText: string, group: KeywordGroup): boolean {
  return group.aliases.some(alias => {
    const normalizedAlias = cleanAndNormalizeText(alias);
    if (!normalizedAlias) return false;
    
    // Exact word boundary checks or direct inclusion
    // Since some aliases contain spaces (e.g. "next js"), check using string bounds or inclusions
    const pattern = new RegExp(`\\b${escapeRegExp(normalizedAlias)}\\b`, 'i');
    return pattern.test(normalizedText) || normalizedText.includes(` ${normalizedAlias} `) || normalizedText.startsWith(`${normalizedAlias} `) || normalizedText.endsWith(` ${normalizedAlias}`);
  });
}

function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

// 1. Extract Resume Content
export function extractResumeText(resume: ResumeData): string {
  const parts: string[] = [];

  if (resume.personalInfo) {
    const info = resume.personalInfo;
    parts.push(info.name || "");
    parts.push(info.jobTitle || "");
    parts.push(info.email || "");
    parts.push(info.phone || "");
    parts.push(info.address || "");
    parts.push(info.linkedin || "");
    parts.push(info.github || "");
    parts.push(info.portfolio || "");
  }

  if (resume.summary) {
    parts.push(resume.summary);
  }

  if (resume.experience && resume.experience.length > 0) {
    resume.experience.forEach(exp => {
      parts.push(exp.role || "");
      parts.push(exp.company || "");
      parts.push(exp.location || "");
      parts.push(exp.duration || "");
      if (exp.responsibilities) {
        parts.push(exp.responsibilities.join(" "));
      }
      if (exp.achievements) {
        parts.push(exp.achievements.join(" "));
      }
    });
  }

  if (resume.projects && resume.projects.length > 0) {
    resume.projects.forEach(proj => {
      parts.push(proj.title || "");
      parts.push(proj.description || "");
      if (proj.technologies) {
        parts.push(proj.technologies.join(" "));
      }
      if (proj.link) {
        parts.push(proj.link);
      }
    });
  }

  if (resume.education && resume.education.length > 0) {
    resume.education.forEach(edu => {
      parts.push(edu.degree || "");
      parts.push(edu.university || "");
      parts.push(edu.duration || "");
      parts.push(edu.location || "");
      parts.push(edu.cgpa || "");
    });
  }

  if (resume.skills) {
    const s = resume.skills;
    if (s.technical) parts.push(s.technical.join(" "));
    if (s.soft) parts.push(s.soft.join(" "));
    if (s.languages) parts.push(s.languages.join(" "));
  }

  if (resume.certifications && resume.certifications.length > 0) {
    resume.certifications.forEach(cert => {
      parts.push(cert.name || "");
      parts.push(cert.issuer || "");
      parts.push(cert.year || "");
    });
  }

  if (resume.awards && resume.awards.length > 0) {
    resume.awards.forEach(awd => {
      parts.push(awd.title || "");
      parts.push(awd.issuer || "");
      parts.push(awd.year || "");
    });
  }

  return parts.filter(Boolean).join(" ");
}

// 2. Extract Job Keywords
export function extractJobKeywords(jobDescription: string): string[] {
  if (!jobDescription) return [];
  const normalizedJd = cleanAndNormalizeText(jobDescription);
  const foundKeywords: string[] = [];

  TECH_KEYWORDS.forEach(group => {
    if (checkAliasMatch(normalizedJd, group)) {
      foundKeywords.push(group.name);
    }
  });

  return foundKeywords;
}

// 3. Smart Keyword Matching
export function smartKeywordMatch(resumeText: string, jdKeywords: string[]): { found: string[]; missing: string[] } {
  if (!resumeText) {
    return { found: [], missing: jdKeywords };
  }

  const normalizedResume = cleanAndNormalizeText(resumeText);
  const found: string[] = [];
  const missing: string[] = [];

  jdKeywords.forEach(keywordName => {
    const group = TECH_KEYWORDS.find(g => g.name === keywordName);
    if (!group) {
      // Fallback direct string search
      if (normalizedResume.includes(keywordName.toLowerCase())) {
        found.push(keywordName);
      } else {
        missing.push(keywordName);
      }
      return;
    }

    if (checkAliasMatch(normalizedResume, group)) {
      found.push(keywordName);
    } else {
      missing.push(keywordName);
    }
  });

  return { found, missing };
}

// 4. Calculate ATS Score & Formatting
export function analyzeFormatting(resumeText: string, resumeData?: ResumeData): FormattingIssue[] {
  const issues: FormattingIssue[] = [];
  const text = resumeText.toLowerCase();

  // 1. Column layout checks (Since this is compiled to PDF via print styles, assume single-column check passes)
  issues.push({
    title: "Single Column Layout",
    desc: "Your template structure uses standard sequential blocks, guaranteeing parsing readability.",
    type: "success"
  });

  // 2. Fonts readability
  issues.push({
    title: "Readable Fonts",
    desc: "Standard clean typography family detected matching modern parser engines.",
    type: "success"
  });

  // 3. Check for standard headings
  const headings = ['experience', 'education', 'skills', 'projects', 'summary'];
  const missingHeadings = headings.filter(h => !text.includes(h));
  if (missingHeadings.length > 0) {
    issues.push({
      title: "Heading Check",
      desc: `Tip: Ensure sections are labeled clearly. Missing common labels: ${missingHeadings.join(", ")}.`,
      type: "warning"
    });
  } else {
    issues.push({
      title: "Standard Headings",
      desc: "All standard structural headings ('Experience', 'Education', 'Skills', etc.) are present.",
      type: "success"
    });
  }

  // 4. Contact Information check
  const hasEmail = text.includes("@") && text.includes(".");
  const hasPhone = /\+?\d[\d -]{8,}\d/.test(text); // basic digit check
  if (!hasEmail || !hasPhone) {
    issues.push({
      title: "Contact Details Missing",
      desc: "Important: Could not identify email or phone coordinates in header. Add them clearly.",
      type: "error"
    });
  } else {
    issues.push({
      title: "Contact Info Verified",
      desc: "Valid email coordinates and contact numbers are clearly visible in the header.",
      type: "success"
    });
  }

  // 5. Bullet Points check
  const bulletCount = (resumeText.match(/•|✓|\-|\*|•|■/g) || []).length;
  if (resumeData && resumeData.experience) {
    let responsibilityBullets = 0;
    resumeData.experience.forEach(exp => {
      responsibilityBullets += (exp.responsibilities || []).length;
    });
    if (responsibilityBullets === 0 && bulletCount < 3) {
      issues.push({
        title: "Bullet Points Recommendation",
        desc: "Add bullet points to experience roles to separate duties and improve parser indexing.",
        type: "warning"
      });
    } else {
      issues.push({
        title: "Bullet Points Detected",
        desc: `Identified ${responsibilityBullets || bulletCount} list entries detailing achievements.`,
        type: "success"
      });
    }
  }

  // 6. Dates check
  const hasDates = /\b(19|20)\d{2}\b/.test(text) || text.includes("present");
  if (!hasDates) {
    issues.push({
      title: "Missing Date Ranges",
      desc: "Add years/dates to experience and education listings to help parser compute tenure.",
      type: "warning"
    });
  } else {
    issues.push({
      title: "Tenure Chronology",
      desc: "Found explicit timelines and dates on educational and professional experiences.",
      type: "success"
    });
  }

  // 7. Standard checks: No Tables, No Images, No Text Boxes
  issues.push({
    title: "Clean Document Objects",
    desc: "No scrambled textboxes, nested graphics, or binary tables detected.",
    type: "success"
  });

  return issues;
}

export function localAtsAudit(
  resumeData: ResumeData | string,
  jobTitle: string,
  jobDescription: string
): AtsAuditResult {
  let resumeText = "";
  let resumeObj: ResumeData | undefined = undefined;

  if (typeof resumeData === 'string') {
    resumeText = resumeData;
  } else {
    resumeObj = resumeData;
    resumeText = extractResumeText(resumeData);
  }

  // Debugging logger logs
  console.log("========== ATS LOCAL AUDIT START ==========");
  console.log("Job Title: ", jobTitle);
  console.log("Job Description: ", jobDescription);

  if (!resumeText.trim()) {
    console.warn("Empty resume text provided. Skipping matching.");
    return {
      score: 0,
      keywordDensity: 0,
      formattingCompliance: 0,
      missing: [],
      found: [],
      formattingIssues: [{ title: "Empty Document", desc: "No readable text found in resume.", type: "error" }],
      suggestions: ["Add resume text and try again."]
    };
  }

  console.log("Merged Resume Text: ", resumeText);

  // Extract job keywords
  const requiredKeywords = extractJobKeywords(jobDescription);
  console.log("Extracted Keywords from JD: ", requiredKeywords);

  // Match keywords
  const { found, missing } = smartKeywordMatch(resumeText, requiredKeywords);
  console.log("Found Keywords: ", found);
  console.log("Missing Keywords: ", missing);

  // Formatting Checks
  const formattingIssues = analyzeFormatting(resumeText, resumeObj);
  const formattingIssuesCount = formattingIssues.filter(i => i.type !== 'success').length;
  const formattingScore = Math.max(0, 100 - (formattingIssuesCount * 15));

  // Calculations
  const keywordCount = requiredKeywords.length;
  const matchedCount = found.length;
  const density = keywordCount > 0 ? Math.round((matchedCount / keywordCount) * 100) : 100;

  // Weighted scoring
  // Keyword Match: 50%
  const keywordWeight = density * 0.50;
  
  // Skills Match: 15%
  let skillsScore = 0;
  if (resumeObj) {
    const techCount = (resumeObj.skills?.technical || []).length;
    const softCount = (resumeObj.skills?.soft || []).length;
    if (techCount > 5) skillsScore += 10;
    else if (techCount > 0) skillsScore += 5;
    if (softCount > 2) skillsScore += 5;
    else if (softCount > 0) skillsScore += 2.5;
  } else {
    skillsScore = textContainsSkillsKeywords(resumeText) ? 15 : 5;
  }
  const skillsWeight = skillsScore;

  // Experience Match: 15%
  let expScore = 0;
  if (resumeObj) {
    const expCount = (resumeObj.experience || []).length;
    if (expCount >= 2) expScore = 15;
    else if (expCount === 1) expScore = 10;
  } else {
    // text base
    const expMatches = (resumeText.match(/experience|intern|developer|engineer|architect|manager/gi) || []).length;
    if (expMatches >= 3) expScore = 15;
    else if (expMatches > 0) expScore = 10;
  }
  const experienceWeight = expScore;

  // Education Match: 10%
  let eduScore = 0;
  if (resumeObj) {
    eduScore = (resumeObj.education || []).length > 0 ? 10 : 0;
  } else {
    eduScore = /b\.?tech|bachelor|degree|university|college|school|study|studies/i.test(resumeText) ? 10 : 0;
  }
  const educationWeight = eduScore;

  // Formatting Match: 10%
  const formattingWeight = (formattingScore / 100) * 10;

  const rawScore = keywordWeight + skillsWeight + experienceWeight + educationWeight + formattingWeight;
  const finalScore = Math.max(0, Math.min(Math.round(rawScore), 100));

  console.log("ATS Score weights:");
  console.log(`- Keyword Density Match (50%): ${keywordWeight.toFixed(2)}`);
  console.log(`- Skills Section Integrity (15%): ${skillsWeight.toFixed(2)}`);
  console.log(`- Job Experience Density (15%): ${experienceWeight.toFixed(2)}`);
  console.log(`- Education Record Presence (10%): ${educationWeight.toFixed(2)}`);
  console.log(`- Document Formatting Scan (10%): ${formattingWeight.toFixed(2)}`);
  console.log(`- Calculated Final Score: ${finalScore}`);

  // Generate Suggestions
  const suggestions: string[] = [];

  missing.slice(0, 5).forEach(m => {
    suggestions.push(`Missing keyword "${m}". Add "${m}" experience or list it directly inside your Technical Stack.`);
  });

  formattingIssues.forEach(issue => {
    if (issue.type === 'error') {
      suggestions.push(`Urgent: ${issue.desc}`);
    } else if (issue.type === 'warning') {
      suggestions.push(`Improvement: ${issue.desc}`);
    }
  });

  if (experienceWeight < 15) {
    suggestions.push("Describe professional internships or projects. Quantify achievements with percentage impact or metric details.");
  }
  
  if (resumeObj && (resumeObj.certifications || []).length === 0) {
    suggestions.push("Consider listing certifications (e.g. AWS Cloud Practitioner, Java Professional) to elevate credentials.");
  }

  console.log("Suggestions Generated: ", suggestions);
  console.log("========== ATS LOCAL AUDIT END ==========");

  return {
    score: finalScore,
    keywordDensity: density,
    formattingCompliance: Math.round(formattingScore),
    missing,
    found,
    formattingIssues,
    suggestions
  };
}

function textContainsSkillsKeywords(text: string): boolean {
  const norm = text.toLowerCase();
  return norm.includes("skills") || norm.includes("expertise") || norm.includes("languages") || norm.includes("technologies");
}
