export interface PersonalInfo {
  fullName: string;
  jobTitle: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  photo: string;
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface Skill {
  id: string;
  name: string;
  level: number;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  link: string;
}

export interface Language {
  id: string;
  name: string;
  proficiency: string;
}

export interface ResumeData {
  personal: PersonalInfo;
  summary: string;
  experience: Experience[];
  education: Education[];
  skills: Skill[];
  projects: Project[];
  languages: Language[];
}

export interface Resume {
  id: string;
  title: string;
  data: ResumeData;
  theme: string;
  accent_color: string;
  created_at: string;
  updated_at: string;
}

export const emptyResumeData: ResumeData = {
  personal: {
    fullName: '',
    jobTitle: '',
    email: '',
    phone: '',
    location: '',
    website: '',
    photo: '',
  },
  summary: '',
  experience: [],
  education: [],
  skills: [],
  projects: [],
  languages: [],
};

export const sampleResumeData: ResumeData = {
  personal: {
    fullName: 'Alex Morgan',
    jobTitle: 'Senior Product Designer',
    email: 'alex.morgan@email.com',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    website: 'alexmorgan.design',
    photo: '',
  },
  summary:
    'Award-winning product designer with 8+ years crafting intuitive digital experiences for startups and Fortune 500 companies. Specialized in design systems, user research, and turning complex problems into elegant, accessible interfaces.',
  experience: [
    {
      id: 'e1',
      company: 'Nimbus Labs',
      position: 'Senior Product Designer',
      location: 'San Francisco, CA',
      startDate: '2021-03',
      endDate: '',
      current: true,
      description:
        'Lead designer for the flagship analytics platform serving 200k+ users.\nBuilt and maintain the company-wide design system used across 6 products.\nDrove a 40% increase in user activation through a redesigned onboarding flow.',
    },
    {
      id: 'e2',
      company: 'Brightline Studio',
      position: 'Product Designer',
      location: 'Remote',
      startDate: '2017-06',
      endDate: '2021-02',
      current: false,
      description:
        'Designed mobile and web experiences for 15+ client projects.\nConducted user research and usability testing to validate design decisions.\nMentored 3 junior designers and established the studio design review process.',
    },
  ],
  education: [
    {
      id: 'ed1',
      institution: 'Rhode Island School of Design',
      degree: 'Bachelor of Fine Arts',
      field: 'Graphic Design',
      startDate: '2013-09',
      endDate: '2017-05',
      description: 'Graduated with honors. Thesis on inclusive design systems.',
    },
  ],
  skills: [
    { id: 's1', name: 'Figma', level: 95 },
    { id: 's2', name: 'Design Systems', level: 90 },
    { id: 's3', name: 'User Research', level: 85 },
    { id: 's4', name: 'Prototyping', level: 88 },
    { id: 's5', name: 'HTML & CSS', level: 75 },
    { id: 's6', name: 'Accessibility', level: 82 },
  ],
  projects: [
    {
      id: 'p1',
      name: 'Atlas Design System',
      description: 'An open-source design system with 40+ components, adopted by 12 teams.',
      link: 'github.com/alexmorgan/atlas',
    },
    {
      id: 'p2',
      name: 'Flowstate Mobile App',
      description: 'A habit-tracking app with 50k downloads and a 4.8-star rating.',
      link: 'flowstate.app',
    },
  ],
  languages: [
    { id: 'l1', name: 'English', proficiency: 'Native' },
    { id: 'l2', name: 'Spanish', proficiency: 'Professional' },
    { id: 'l3', name: 'French', proficiency: 'Conversational' },
  ],
};

export function formatDate(date: string, current: boolean = false): string {
  if (current) return 'Present';
  if (!date) return '';
  const [year, month] = date.split('-');
  if (!year) return date;
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
  ];
  const monthIndex = month ? parseInt(month, 10) - 1 : 0;
  return `${months[monthIndex] || ''} ${year}`.trim();
}

export function dateRange(start: string, end: string, current: boolean): string {
  const s = formatDate(start);
  const e = formatDate(end, current);
  if (s && e) return `${s} — ${e}`;
  return s || e;
}
