export interface WorkExperience {
  role: string;
  company: string;
  duration: string;
  description: string;
}

export interface BehavioralSignals {
  codingScore: number;          // 0 to 100
  responsivenessScore: number;  // 0 to 100 (e.g. email reply speed)
  githubCommits: number;        // commits in last 90 days
  openSourceContributor: boolean;
  activeJobSeeker: boolean;
  profileCompleteness: number;  // 0 to 100
}

export interface Candidate {
  id: string;
  name: string;
  title: string;
  avatar: string;
  location: string;
  experienceYears: number;
  education: string;
  skills: string[];
  bio: string;
  experienceHistory: WorkExperience[];
  behavioralSignals: BehavioralSignals;
}

export interface RankingResult {
  candidateId: string;
  semanticMatchScore: number;     // 0 to 100 (from Gemini)
  signalsScore: number;           // 0 to 100 (calculated from activity signals)
  totalScore: number;             // combined score (e.g. 60% semantic + 40% signals)
  justification: string;          // bullet point summary of why they fit
  skillAlignment: string[];       // overlapping or missing skills
}

export interface JobDescription {
  title: string;
  rawText: string;
  parsedRequirements?: {
    technicalSkills: string[];
    experienceRequired: number;
    educationRequired: string;
    softSkills: string[];
  };
}

export interface RankingHistoryEntry {
  id: string;
  timestamp: string;
  jobTitle: string;
  jobDescription: string;
  semanticWeight: number;
  signalsWeight: number;
}

