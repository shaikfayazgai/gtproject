import { randomId, isoPast } from './common'
import type { SkillTaxonomyTag } from '@glimmora/types'

const SKILLS: Record<string, { name: string; usage: number }[]> = {
  Programming: [
    { name: 'TypeScript', usage: 245 },
    { name: 'Python', usage: 198 },
    { name: 'React', usage: 312 },
    { name: 'Node.js', usage: 189 },
    { name: 'SQL', usage: 156 },
    { name: 'Go', usage: 67 },
    { name: 'Rust', usage: 34 },
    { name: 'Java', usage: 142 },
  ],
  Design: [
    { name: 'UI Design', usage: 178 },
    { name: 'UX Research', usage: 134 },
    { name: 'Figma', usage: 223 },
    { name: 'Design Systems', usage: 89 },
    { name: 'Prototyping', usage: 112 },
    { name: 'Motion Design', usage: 45 },
    { name: 'Accessibility', usage: 78 },
  ],
  Data: [
    { name: 'Data Analysis', usage: 167 },
    { name: 'Machine Learning', usage: 89 },
    { name: 'Data Visualization', usage: 123 },
    { name: 'ETL Pipelines', usage: 56 },
    { name: 'Statistical Modeling', usage: 78 },
    { name: 'NLP', usage: 34 },
    { name: 'Computer Vision', usage: 28 },
    { name: 'Data Engineering', usage: 92 },
  ],
  Communication: [
    { name: 'Technical Writing', usage: 145 },
    { name: 'Documentation', usage: 178 },
    { name: 'API Documentation', usage: 89 },
    { name: 'Presentation', usage: 112 },
    { name: 'Stakeholder Communication', usage: 67 },
    { name: 'Content Strategy', usage: 56 },
  ],
  'Project Management': [
    { name: 'Agile', usage: 201 },
    { name: 'Scrum', usage: 178 },
    { name: 'Risk Management', usage: 89 },
    { name: 'Sprint Planning', usage: 134 },
    { name: 'Requirements Gathering', usage: 112 },
    { name: 'Stakeholder Management', usage: 78 },
    { name: 'Resource Planning', usage: 56 },
    { name: 'Quality Assurance', usage: 145 },
  ],
}

export function createMockTaxonomy(): SkillTaxonomyTag[] {
  const tags: SkillTaxonomyTag[] = []

  for (const [category, skills] of Object.entries(SKILLS)) {
    for (const skill of skills) {
      tags.push({
        id: randomId('skill'),
        name: skill.name,
        category,
        isActive: Math.random() > 0.1, // 90% active
        usageCount: skill.usage,
        createdAt: isoPast(90),
        updatedAt: isoPast(Math.floor(Math.random() * 30)),
      })
    }
  }

  return tags
}
