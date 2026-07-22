import { ResumeData } from '@/types/resume';

export interface AIExecutionResult {
  applied: boolean;
  feedbackMessage: string;
}

/**
 * Parses user chat commands and directly mutates active resume/builder state.
 */
export function parseAndExecuteResumeChange(
  query: string,
  activeResume: ResumeData | null,
  updateResume: (updates: Partial<ResumeData>) => void,
  setThemeColor?: (color: 'purple' | 'blue' | 'emerald') => void,
  setBuilderStep?: (step: number) => void
): AIExecutionResult {
  if (!query) return { applied: false, feedbackMessage: '' };

  const q = query.trim().toLowerCase();

  // 1. Theme Color Change
  if (q.includes('theme') || q.includes('accent color') || q.includes('change color') || q.includes('set color')) {
    if (q.includes('emerald') || q.includes('green')) {
      if (setThemeColor) setThemeColor('emerald');
      return { applied: true, feedbackMessage: '🎨 Updated workspace theme accent to Emerald Green!' };
    }
    if (q.includes('blue') || q.includes('cyan')) {
      if (setThemeColor) setThemeColor('blue');
      return { applied: true, feedbackMessage: '🎨 Updated workspace theme accent to Ocean Blue!' };
    }
    if (q.includes('purple') || q.includes('violet')) {
      if (setThemeColor) setThemeColor('purple');
      return { applied: true, feedbackMessage: '🎨 Updated workspace theme accent to Royal Purple!' };
    }
  }

  // 2. Step Navigation
  if (setBuilderStep && (q.includes('go to') || q.includes('open') || q.includes('navigate to') || q.includes('move to') || q.includes('step'))) {
    if (q.includes('personal') || q.includes('contact') || q.includes('info') || q.includes('step 1')) {
      setBuilderStep(1);
      return { applied: true, feedbackMessage: '📍 Navigated to Step 1: Personal Information.' };
    }
    if (q.includes('summary') || q.includes('objective') || q.includes('step 2')) {
      setBuilderStep(2);
      return { applied: true, feedbackMessage: '📍 Navigated to Step 2: Professional Summary.' };
    }
    if (q.includes('experience') || q.includes('work') || q.includes('job') || q.includes('step 3')) {
      setBuilderStep(3);
      return { applied: true, feedbackMessage: '📍 Navigated to Step 3: Work Experience.' };
    }
    if (q.includes('education') || q.includes('degree') || q.includes('college') || q.includes('step 4')) {
      setBuilderStep(4);
      return { applied: true, feedbackMessage: '📍 Navigated to Step 4: Education & Qualifications.' };
    }
    if (q.includes('skill') || q.includes('tech stack') || q.includes('step 5')) {
      setBuilderStep(5);
      return { applied: true, feedbackMessage: '📍 Navigated to Step 5: Technical & Soft Skills.' };
    }
    if (q.includes('template') || q.includes('design') || q.includes('style') || q.includes('step 6')) {
      setBuilderStep(6);
      return { applied: true, feedbackMessage: '📍 Navigated to Step 6: Template Selection & Style.' };
    }
  }

  if (!activeResume) {
    return { applied: false, feedbackMessage: '' };
  }

  // 3. Template Change
  if (q.includes('template') || q.includes('layout')) {
    let tplId = '';
    if (q.includes('luxury') || q.includes('gold')) tplId = 'luxury';
    else if (q.includes('executive')) tplId = 'executive';
    else if (q.includes('corporate')) tplId = 'corporate';
    else if (q.includes('minimal')) tplId = 'minimal';
    else if (q.includes('creative')) tplId = 'creative';
    else if (q.includes('academic')) tplId = 'academic';
    else if (q.includes('ats')) tplId = 'ats-friendly';
    else if (q.includes('dark')) tplId = 'dark';
    else if (q.includes('modern')) tplId = 'modern';

    if (tplId) {
      updateResume({
        style: {
          ...activeResume.style,
          templateId: tplId
        }
      });
      return { applied: true, feedbackMessage: `✨ Applied template "${tplId.toUpperCase()}" to your active resume!` };
    }
  }

  // 4. Job Title Change
  if (q.includes('job title') || q.includes('target role') || q.includes('role to') || q.includes('position to') || q.includes('change title')) {
    const match = query.match(/(?:job title|target role|role|position|title)\s+(?:to|is|=)\s+([^.,;\n]+)/i);
    if (match && match[1]) {
      const newTitle = match[1].trim();
      updateResume({
        personalInfo: {
          ...activeResume.personalInfo,
          jobTitle: newTitle
        }
      });
      return { applied: true, feedbackMessage: `✨ Updated your target job title to "${newTitle}" in your resume!` };
    }
  }

  // 5. Name Change
  if (q.includes('my name is') || q.includes('change my name') || q.includes('update name') || q.includes('name to')) {
    const match = query.match(/(?:my name is|change my name to|update name to|name to)\s+([^.,;\n]+)/i);
    if (match && match[1]) {
      const newName = match[1].trim();
      updateResume({
        personalInfo: {
          ...activeResume.personalInfo,
          name: newName
        }
      });
      return { applied: true, feedbackMessage: `✨ Updated your name to "${newName}" across your resume!` };
    }
  }

  // 6. Contact Info (Email, Phone, Address)
  if (q.includes('email') && query.includes('@')) {
    const emailMatch = query.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
    if (emailMatch) {
      updateResume({
        personalInfo: {
          ...activeResume.personalInfo,
          email: emailMatch[0]
        }
      });
      return { applied: true, feedbackMessage: `✨ Updated your contact email to "${emailMatch[0]}"!` };
    }
  }

  // 7. Add Skill
  if (q.includes('add skill') || q.includes('add skills') || q.includes('include skill') || q.includes('new skill')) {
    const match = query.match(/(?:add skill|add skills|include skill|new skill|skills:?)\s+([^.,;\n]+)/i);
    if (match && match[1]) {
      const newSkillsRaw = match[1].split(/[,;]+/).map(s => s.trim()).filter(Boolean);
      const currentSkills = activeResume.skills?.technical || [];
      const updatedSkills = Array.from(new Set([...currentSkills, ...newSkillsRaw]));
      
      updateResume({
        skills: {
          ...activeResume.skills,
          technical: updatedSkills
        }
      });
      return { applied: true, feedbackMessage: `✨ Added skill(s) "${newSkillsRaw.join(', ')}" to your active resume!` };
    }
  }

  // 8. Remove Skill
  if (q.includes('remove skill') || q.includes('delete skill') || q.includes('drop skill')) {
    const match = query.match(/(?:remove skill|delete skill|drop skill)\s+([^.,;\n]+)/i);
    if (match && match[1]) {
      const skillToRemove = match[1].trim().toLowerCase();
      const currentSkills = activeResume.skills?.technical || [];
      const filtered = currentSkills.filter(s => s.toLowerCase() !== skillToRemove);
      
      updateResume({
        skills: {
          ...activeResume.skills,
          technical: filtered
        }
      });
      return { applied: true, feedbackMessage: `✨ Removed skill "${match[1].trim()}" from your active resume!` };
    }
  }

  // 9. Summary Update
  if (q.includes('summary') && (q.includes('change') || q.includes('update') || q.includes('set') || q.includes('write'))) {
    const match = query.match(/(?:summary to|summary is|summary:)\s+(.+)/i);
    if (match && match[1]) {
      const newSummary = match[1].trim();
      updateResume({ summary: newSummary });
      return { applied: true, feedbackMessage: '✨ Updated your professional summary in your resume!' };
    }
  }

  return { applied: false, feedbackMessage: '' };
}
