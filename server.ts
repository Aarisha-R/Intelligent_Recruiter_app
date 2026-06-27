import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";
import fs from "fs";
import { initialCandidates } from "./src/candidatesData";
import { Candidate, RankingResult } from "./src/types";

// Load environment variables
dotenv.config();

// Helper function to parse submission.csv and construct a rich Candidate object for each row
function loadCandidatesFromCSV(): Candidate[] {
  const list: Candidate[] = [];
  try {
    const csvPath = path.join(process.cwd(), "submission.csv");
    if (!fs.existsSync(csvPath)) {
      console.warn("submission.csv not found, using initialCandidates only.");
      return [...initialCandidates];
    }

    const fileContent = fs.readFileSync(csvPath, "utf-8");
    const lines = fileContent.split(/\r?\n/);
    if (lines.length < 2) return [...initialCandidates];

    // First names list for deterministic generation
    const firstNames = [
      "Aarav", "Chloe", "Marcus", "Elena", "Liam", "Sophia", "Jackson", "Olivia", "Lucas", "Emma",
      "Ethan", "Ava", "Oliver", "Isabella", "Aria", "Mateo", "Layla", "Yusuf", "Amara", "Daniel",
      "Zara", "Rohan", "Maya", "Kian", "Ananya", "Arjun", "Priya", "Nikhil", "Siddharth", "Ishaan",
      "Diya", "Kabir", "Meera", "Aditya", "Aisha", "Dev", "Riya", "Vihaan", "Tara", "Samar"
    ];
    // Last names list
    const lastNames = [
      "Mehta", "Dubois", "Vance", "Silva", "Sterling", "Chen", "Patel", "Gomez", "Kim", "Taylor",
      "Sharma", "Sharma", "Nair", "Iyer", "Sen", "Roy", "Joshi", "Rao", "Reddy", "Gupta",
      "Das", "Kulkarni", "Deshmukh", "Choudhury", "Bose", "Mukherjee", "Chatterjee", "Bhattacharya", "Singh", "Prasad",
      "Malhotra", "Kapoor", "Khanna", "Verma", "Saxena", "Sinha", "Mishra", "Trivedi", "Pandey", "Dwivedi"
    ];

    // Curated high-quality Unsplash portrait IDs for candidate avatars
    const portraitIds = [
      "1534528741775-53994a69daeb", "1539571696357-5a69c17a67c6", "1507003211169-0a1dd7228f2d", "1494790108377-be9c29b29330",
      "1500648767791-00dcc994a43e", "1544005313-94ddf0286df2", "1506794778202-cad84cf45f1d", "1522075469751-3a6694fb2f61",
      "1517841905240-472988babdf9", "1438761681033-6461ffad8d80", "1489980508314-941910ded1f4", "1501196354995-cbb51c65aaea",
      "1508214751196-bcfd4ca60f91", "1531746020798-e6953c6e8e04", "1573496359142-b8d87734a5a2", "1580489944761-15a19d654956",
      "1607746882042-944635dfe10e", "1619380061814-58f03707f082", "1508214751196-bcfd4ca60f91", "1544005313-94ddf0286df2"
    ];

    const cities = [
      "San Francisco, CA", "New York, NY", "Austin, TX", "Seattle, WA", "Boston, MA", "Chicago, IL",
      "London, UK", "Toronto, ON", "Berlin, DE", "Singapore", "Sydney, AU", "Tokyo, JP",
      "Bangalore, KA", "Mumbai, MH", "Delhi, DL", "Hyderabad, TG", "Pune, MH"
    ];

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      // Simple CSV parser handling quotes or splitting by comma
      let parts: string[] = [];
      let currentPart = "";
      let inQuotes = false;
      for (let j = 0; j < line.length; j++) {
        const char = line[j];
        if (char === '"') {
          inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
          parts.push(currentPart);
          currentPart = "";
        } else {
          currentPart += char;
        }
      }
      parts.push(currentPart);

      if (parts.length < 4) continue;

      const candidateId = parts[0].trim();
      const rank = parseInt(parts[1].trim(), 10);
      const score = parseFloat(parts[2].trim());
      const reasoning = parts[3].trim().replace(/^"(.*)"$/, "$1"); // remove surrounding quotes

      if (!candidateId.startsWith("CAND_")) continue;

      // Extract attributes from reasoning text
      // e.g. "HR Manager with 6.1 yrs; 9 AI core skills; response rate 0.76."
      let title = "Technology Professional";
      let expYears = 5;
      let aiSkillsCount = 0;
      let responseRate = 0.5;

      const withMatch = reasoning.match(/(.*?)\s+with\s+([0-9.]+)\s*yrs/i);
      if (withMatch) {
        title = withMatch[1].trim();
        expYears = parseFloat(withMatch[2]);
      }

      const skillsMatch = reasoning.match(/(\d+)\s+AI\s+core\s+skill/i);
      if (skillsMatch) {
        aiSkillsCount = parseInt(skillsMatch[1], 10);
      }

      const rateMatch = reasoning.match(/response\s+rate\s+([0-9.]+)/i);
      if (rateMatch) {
        responseRate = parseFloat(rateMatch[1]);
      }

      // Generate deterministic attributes based on numerical part of candidateId
      const numId = parseInt(candidateId.replace("CAND_", ""), 10) || i;
      const firstName = firstNames[numId % firstNames.length];
      const lastName = lastNames[(numId + 7) % lastNames.length];
      const name = `${firstName} ${lastName}`;

      const avatar = `https://images.unsplash.com/photo-${portraitIds[numId % portraitIds.length]}?auto=format&fit=crop&q=80&w=200`;
      const location = cities[numId % cities.length] + (numId % 2 === 0 ? " (Hybrid)" : " (Remote)");

      // Education mapping based on title/role
      let education = "B.S. in Computer Science";
      if (title.toLowerCase().includes("hr") || title.toLowerCase().includes("manager") || title.toLowerCase().includes("business") || title.toLowerCase().includes("operations")) {
        education = "M.B.A. in Management";
      } else if (title.toLowerCase().includes("ml") || title.toLowerCase().includes("ai") || title.toLowerCase().includes("data") || title.toLowerCase().includes("science")) {
        education = "M.S. in Machine Learning & AI";
      } else if (title.toLowerCase().includes("graphic") || title.toLowerCase().includes("designer") || title.toLowerCase().includes("writer") || title.toLowerCase().includes("content")) {
        education = "B.F.A. in Creative Media";
      } else if (title.toLowerCase().includes("mechanical") || title.toLowerCase().includes("civil") || title.toLowerCase().includes("engineer")) {
        education = "B.S. in Engineering Sciences";
      } else if (title.toLowerCase().includes("accountant")) {
        education = "B.B.A. in Financial Accounting";
      }

      // Skills mapping
      let skills: string[] = [];
      if (title.toLowerCase().includes("hr") || title.toLowerCase().includes("manager")) {
        skills = ["HR Operations", "Talent Acquisition", "Conflict Resolution", "Employee Relations", "Performance Management"];
      } else if (title.toLowerCase().includes("ml") || title.toLowerCase().includes("ai") || title.toLowerCase().includes("data") || title.toLowerCase().includes("science")) {
        skills = ["Python", "PyTorch", "TensorFlow", "Scikit-Learn", "SQL", "Pandas"];
      } else if (title.toLowerCase().includes("graphic") || title.toLowerCase().includes("designer")) {
        skills = ["Adobe Illustrator", "Figma", "Photoshop", "UI/UX", "Visual Branding"];
      } else if (title.toLowerCase().includes("writer") || title.toLowerCase().includes("content")) {
        skills = ["Content Writing", "Copywriting", "SEO", "Editing", "Proofreading"];
      } else if (title.toLowerCase().includes("mechanical") || title.toLowerCase().includes("engineer")) {
        skills = ["CAD", "SolidWorks", "MATLAB", "Engineering Design"];
      } else if (title.toLowerCase().includes("civil")) {
        skills = ["Civil CAD", "Structural Engineering", "Project Estimation", "GIS"];
      } else if (title.toLowerCase().includes("accountant")) {
        skills = ["Double-Entry Accounting", "Excel", "Tax Compliance", "Financial Auditing"];
      } else if (title.toLowerCase().includes("sales") || title.toLowerCase().includes("executive")) {
        skills = ["B2B Sales", "Salesforce", "Lead Generation", "Client Negotiations"];
      } else if (title.toLowerCase().includes("operations") || title.toLowerCase().includes("analyst") || title.toLowerCase().includes("project")) {
        skills = ["Business Operations", "Agile Project Management", "Process Optimization", "Jira"];
      } else {
        skills = ["Project Planning", "Agile Methodologies", "Stakeholder Management"];
      }

      // Add AI skills if requested
      if (aiSkillsCount > 0) {
        const aiPool = ["Prompt Engineering", "Large Language Models", "Generative AI", "RAG Architectures", "Vector Databases", "Model Tuning", "Agentic Systems", "Semantic Matching"];
        for (let k = 0; k < Math.min(aiSkillsCount, aiPool.length); k++) {
          if (!skills.includes(aiPool[k])) {
            skills.push(aiPool[k]);
          }
        }
      }

      // Behavioral Signals
      const codingScore = (title.toLowerCase().includes("engineer") || title.toLowerCase().includes("ai") || title.toLowerCase().includes("ml") || title.toLowerCase().includes("developer") || title.toLowerCase().includes("science"))
        ? Math.round(80 + (numId % 18))
        : Math.round(40 + (numId % 35));

      const responsivenessScore = Math.round(responseRate * 100);
      const githubCommits = (codingScore > 75) ? Math.round(80 + (numId % 220)) : Math.round(numId % 40);
      const openSourceContributor = codingScore > 85 && responseRate > 0.4;
      const activeJobSeeker = responseRate > 0.25;

      list.push({
        id: candidateId,
        name,
        title,
        avatar,
        location,
        experienceYears: expYears,
        education,
        skills,
        bio: `${title} with ${expYears} years of deep professional experience. Focused on delivering elegant, scalable solutions and matching advanced industry methodologies.`,
        experienceHistory: [
          {
            role: title,
            company: "Enterprise Corp",
            duration: "2022 - Present",
            description: `Key technical and operational contributor. Solved complex domain problems, improved team efficiency, and leveraged advanced tools.`
          },
          {
            role: `Junior ${title}`,
            company: "Tech Systems LLC",
            duration: "2019 - 2022",
            description: `Collaborated in agile environments to build core product workflows and coordinate releases.`
          }
        ],
        behavioralSignals: {
          codingScore,
          responsivenessScore,
          githubCommits,
          openSourceContributor,
          activeJobSeeker,
          profileCompleteness: 95
        }
      });
    }

    console.log(`Loaded ${list.length} candidate profiles from submission.csv successfully.`);
    return list;
  } catch (err) {
    console.error("Error reading/parsing submission.csv:", err);
    return [...initialCandidates];
  }
}

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));

// In-memory persistent database loaded from CSV challenge dataset
let candidateDatabase: Candidate[] = loadCandidatesFromCSV();

// Initialize Gemini Client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || "MOCK_KEY",
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

// Helper: Calculate Behavioral Signal Score from candidates' activity metrics
function calculateSignalsScore(signals: Candidate["behavioralSignals"]): number {
  const codingWeight = 0.40;
  const responsivenessWeight = 0.20;
  const githubWeight = 0.15;
  const openSourceWeight = 0.10;
  const jobSeekerWeight = 0.15;

  const codingTerm = signals.codingScore;
  const responsivenessTerm = signals.responsivenessScore;
  
  // Cap GitHub commits score at 300 commits as 100 points
  const githubTerm = Math.min(100, (signals.githubCommits / 300) * 100);
  
  const openSourceTerm = signals.openSourceContributor ? 100 : 0;
  const jobSeekerTerm = signals.activeJobSeeker ? 100 : 50; // Active gets 100, passive gets 50

  return Math.round(
    codingTerm * codingWeight +
    responsivenessTerm * responsivenessWeight +
    githubTerm * githubWeight +
    openSourceTerm * openSourceWeight +
    jobSeekerTerm * jobSeekerWeight
  );
}

// 1. API: Get Candidates
app.get("/api/candidates", (req, res) => {
  res.json({ success: true, candidates: candidateDatabase });
});

// 2. API: Create or update a candidate
app.post("/api/candidates", (req, res) => {
  const candidateData: Candidate = req.body;
  if (!candidateData.id) {
    candidateData.id = "cand-" + Date.now();
  }

  // Validate behavioral signals
  if (!candidateData.behavioralSignals) {
    candidateData.behavioralSignals = {
      codingScore: 80,
      responsivenessScore: 80,
      githubCommits: 50,
      openSourceContributor: false,
      activeJobSeeker: true,
      profileCompleteness: 85
    };
  }

  const existingIndex = candidateDatabase.findIndex(c => c.id === candidateData.id);
  if (existingIndex !== -1) {
    candidateDatabase[existingIndex] = candidateData;
  } else {
    candidateDatabase.push(candidateData);
  }

  res.json({ success: true, candidate: candidateData });
});

// 3. API: Delete candidate
app.delete("/api/candidates/:id", (req, res) => {
  const { id } = req.params;
  candidateDatabase = candidateDatabase.filter(c => c.id !== id);
  res.json({ success: true, message: "Candidate deleted successfully" });
});

// 4. API: Reset candidates database
app.post("/api/candidates/reset", (req, res) => {
  candidateDatabase = loadCandidatesFromCSV();
  res.json({ success: true, candidates: candidateDatabase });
});

// 5. API: Rank candidates using Gemini + Behavioral Signals
app.post("/api/rank", async (req, res) => {
  const { jobTitle, jobDescriptionText, semanticWeight = 60, signalsWeight = 40 } = req.body;

  if (!jobDescriptionText || jobDescriptionText.trim() === "") {
    return res.status(400).json({ success: false, error: "Job description is required" });
  }

  try {
    // If API key is missing, mock the Gemini scores to keep the app working gracefully as instructed by guidelines
    const hasRealKey = process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== "MY_GEMINI_API_KEY";

    let geminiEvaluations: {
      candidateId: string;
      semanticMatchScore: number;
      justification: string;
      skillAlignment: string[];
    }[] = [];

    if (hasRealKey) {
      // Build structured candidate digests for the prompt
      const candidatesPromptDigest = candidateDatabase.map(c => {
        return `
Candidate ID: ${c.id}
Name: ${c.name}
Current Title: ${c.title}
Primary Skills: ${c.skills.join(", ")}
Bio: ${c.bio}
Career History:
${c.experienceHistory.map(h => `- ${h.role} at ${h.company} (${h.duration}): ${h.description}`).join("\n")}
`;
      }).join("\n--- NEXT CANDIDATE ---\n");

      const systemPrompt = `You are an elite, objective technical recruiting coordinator and principal engineer. 
Your goal is to parse the target job description, deeply comprehend its nuances, and evaluate the list of candidates based strictly on semantic and conceptual fit (seeing past exact keyword matching).
You will score each candidate's semantic match from 0 (completely irrelevant) to 100 (perfect, direct alignment in senior expertise, domain knowledge, and architectural vision).
Be highly objective and critical. If a candidate lacks core experience requested, give them a realistically low semantic match score.

Format the output strictly as a JSON array of objects fitting the provided schema. Do not include markdown codeblocks or extra text.`;

      const promptText = `
JOB DESCRIPTION TO MATCH:
Title: ${jobTitle || "Not Specified"}
Details:
${jobDescriptionText}

CANDIDATES TO EVALUATE:
${candidatesPromptDigest}

Generate semantic match evaluations for each candidate.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: promptText,
        config: {
          systemInstruction: systemPrompt,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                candidateId: {
                  type: Type.STRING,
                  description: "The unique ID of the candidate being evaluated"
                },
                semanticMatchScore: {
                  type: Type.INTEGER,
                  description: "The contextual semantic score from 0 to 100 representing how well the candidate's career history and actual skills map to the target role requirements"
                },
                justification: {
                  type: Type.STRING,
                  description: "A short paragraph or 2 bullet points detailing why the candidate is or is not a match, highlighting specific projects, domain expertise or clear gaps."
                },
                skillAlignment: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: "List of the key overlapping or missing skills that influenced the evaluation"
                }
              },
              required: ["candidateId", "semanticMatchScore", "justification", "skillAlignment"]
            }
          }
        }
      });

      const responseText = response.text || "[]";
      geminiEvaluations = JSON.parse(responseText.trim());
    } else {
      // Mock evaluations for preview environment if no valid API key is present
      // We perform standard keyword overlap in code to make it somewhat realistic
      const jobLower = `${jobTitle || ""} ${jobDescriptionText}`.toLowerCase();
      
      geminiEvaluations = candidateDatabase.map(c => {
        // Compute simple keyword overlap for simulation
        let overlapCount = 0;
        c.skills.forEach(skill => {
          if (jobLower.includes(skill.toLowerCase())) overlapCount++;
        });

        // Add matching weight if candidate title overlaps
        const titleOverlap = jobLower.includes(c.title.toLowerCase().split(" ")[0]);
        const calculatedMockScore = Math.min(100, Math.round((overlapCount / Math.max(3, c.skills.length)) * 75 + (titleOverlap ? 25 : 0) + 20));

        let justification = "";
        let skillAlignment: string[] = [];
        
        if (calculatedMockScore > 80) {
          justification = `Excellent alignment detected. Extensive background in ${c.skills.slice(0, 3).join(", ")} aligns directly with the target specifications. Solid career velocity at ${c.experienceHistory[0]?.company || "previous company"}.`;
          skillAlignment = c.skills.filter(s => jobLower.includes(s.toLowerCase()));
        } else if (calculatedMockScore > 55) {
          justification = `Moderate fit. Demonstrates strong baseline capability in ${c.skills.slice(0, 2).join(", ")}, but requires upskilling on specific advanced architectures or deep-domain requirements.`;
          skillAlignment = c.skills.filter(s => jobLower.includes(s.toLowerCase()));
        } else {
          justification = `Low semantic alignment. The candidate's primary expertise (${c.title}) is orthogonal or too junior for the seniority and domain specifications of this role.`;
          skillAlignment = c.skills.filter(s => jobLower.includes(s.toLowerCase()));
        }

        return {
          candidateId: c.id,
          semanticMatchScore: calculatedMockScore,
          justification,
          skillAlignment
        };
      });
    }

    // Combine semantic match score with behavioral signal score
    const results: RankingResult[] = candidateDatabase.map(c => {
      const evalItem = geminiEvaluations.find(e => e.candidateId === c.id) || {
        semanticMatchScore: 50,
        justification: "Calculated default score due to missing AI profile matching.",
        skillAlignment: []
      };

      const signalsScore = calculateSignalsScore(c.behavioralSignals);
      
      // Weighted combination
      const semW = semanticWeight / 100;
      const sigW = signalsWeight / 100;
      const totalScore = Math.round(evalItem.semanticMatchScore * semW + signalsScore * sigW);

      return {
        candidateId: c.id,
        semanticMatchScore: evalItem.semanticMatchScore,
        signalsScore,
        totalScore,
        justification: evalItem.justification,
        skillAlignment: evalItem.skillAlignment
      };
    }).sort((a, b) => b.totalScore - a.totalScore); // Sort descending

    res.json({
      success: true,
      results,
      modelUsed: hasRealKey ? "gemini-3.5-flash" : "Mock Matching Engine (No GEMINI_API_KEY configured)",
      isMock: !hasRealKey
    });

  } catch (error: any) {
    console.error("Ranking error:", error);
    res.status(500).json({ success: false, error: error.message || "Failed to compile candidate ranking list." });
  }
});

// 6. API: Semantic Natural Language Search
app.post("/api/semantic-search", async (req, res) => {
  const { query } = req.body;
  if (!query || query.trim() === "") {
    return res.status(400).json({ success: false, error: "Search query is required" });
  }

  try {
    const hasRealKey = process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== "MY_GEMINI_API_KEY";
    
    if (hasRealKey) {
      const candidatesList = candidateDatabase.map(c => ({
        id: c.id,
        name: c.name,
        title: c.title,
        skills: c.skills,
        bio: c.bio
      }));

      const systemPrompt = `You are an expert AI recruiting assistant. Analyze the recruiter's natural language search query and return a list of candidate evaluations showing their relevance to the search.
Only return a JSON array containing objects with candidateId, matchScore (0 to 100), and matchReason. Keep matchReason to 1 short sentence.`;

      const promptText = `
SEARCH QUERY: "${query}"
CANDIDATES AVAILABLE:
${JSON.stringify(candidatesList, null, 2)}

Return evaluations as a JSON array of objects fitting the schema: [{"candidateId": "...", "matchScore": 95, "matchReason": "..."}]`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: promptText,
        config: {
          systemInstruction: systemPrompt,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                candidateId: { type: Type.STRING },
                matchScore: { type: Type.INTEGER },
                matchReason: { type: Type.STRING }
              },
              required: ["candidateId", "matchScore", "matchReason"]
            }
          }
        }
      });

      const parsedResults = JSON.parse(response.text || "[]");
      res.json({ success: true, searchResults: parsedResults, isMock: false });
    } else {
      // Mock semantic matching based on substring match and similarity heuristic
      const searchWords = query.toLowerCase().split(/\s+/).filter((w: string) => w.length > 2);
      const searchResults = candidateDatabase.map(c => {
        let matchCount = 0;
        const candidateText = `${c.name} ${c.title} ${c.skills.join(" ")} ${c.bio}`.toLowerCase();
        
        searchWords.forEach((word: string) => {
          if (candidateText.includes(word)) matchCount++;
        });

        const score = searchWords.length > 0 
          ? Math.min(100, Math.round((matchCount / searchWords.length) * 60 + 40)) 
          : 50;

        return {
          candidateId: c.id,
          matchScore: score,
          matchReason: score > 75 
            ? `Excellent matching signals for '${query}' found in their profile as a ${c.title}.`
            : score > 50 
            ? `Baseline relevant background overlapping with keywords of interest.`
            : `Minimal overlap detected for search query '${query}'.`
        };
      }).sort((a, b) => b.matchScore - a.matchScore);

      res.json({ success: true, searchResults, isMock: true });
    }
  } catch (error: any) {
    console.error("Semantic search error:", error);
    res.status(500).json({ success: false, error: error.message || "Failed to execute semantic search." });
  }
});

// 7. API: Tailored Interview Questions Generator
app.post("/api/interview-questions", async (req, res) => {
  const { candidateId, jobDescription } = req.body;
  const candidate = candidateDatabase.find(c => c.id === candidateId);
  if (!candidate) {
    return res.status(404).json({ success: false, error: "Candidate not found" });
  }

  try {
    const hasRealKey = process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== "MY_GEMINI_API_KEY";

    if (hasRealKey) {
      const promptText = `
Candidate Name: ${candidate.name}
Candidate Title: ${candidate.title}
Candidate Skills: ${candidate.skills.join(", ")}
Candidate Bio: ${candidate.bio}

Job Description Details:
${jobDescription || "Not Specified"}

Based on the candidate's profile and the job requirements, generate exactly 3 highly customized interview questions (mix of architectural/technical and deep situational/behavioral) with the rationale for why you are asking each question.
Return as a JSON array of objects: [{"question": "...", "type": "Technical|Behavioral", "rationale": "..."}]`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: promptText,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                question: { type: Type.STRING },
                type: { type: Type.STRING },
                rationale: { type: Type.STRING }
              },
              required: ["question", "type", "rationale"]
            }
          }
        }
      });

      res.json({ success: true, questions: JSON.parse(response.text || "[]"), isMock: false });
    } else {
      // Mock questions based on candidate role
      const questions = [
        {
          question: `Given your experience as a ${candidate.title}, how would you approach scaling our core system when dealing with complex data queries or service bottlenecks?`,
          type: "Technical",
          rationale: "Evaluates their engineering design choices under stress, matching their actual experience."
        },
        {
          question: `In your previous role, you listed skills in: ${candidate.skills.slice(0, 3).join(", ")}. Can you walk me through a complex bug or system failure you resolved using these tools?`,
          type: "Technical",
          rationale: "Validates technical proficiency and real-world execution capacity with their primary skill sets."
        },
        {
          question: "Can you describe a time when you had to align with stakeholders or product requirements that were highly ambiguous? How did you prioritize tasks?",
          type: "Behavioral",
          rationale: "Tests soft skills, conflict resolution, and self-organization in production-paced teams."
        }
      ];
      res.json({ success: true, questions, isMock: true });
    }
  } catch (error: any) {
    console.error("Questions generation error:", error);
    res.status(500).json({ success: false, error: error.message || "Failed to generate interview questions." });
  }
});

// 8. API: Skill-Gap Analysis & Resource Recommendations
app.post("/api/skill-gap", async (req, res) => {
  const { candidateId, jobDescription } = req.body;
  const candidate = candidateDatabase.find(c => c.id === candidateId);
  if (!candidate) {
    return res.status(404).json({ success: false, error: "Candidate not found" });
  }

  try {
    const hasRealKey = process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== "MY_GEMINI_API_KEY";

    if (hasRealKey) {
      const promptText = `
Candidate Name: ${candidate.name}
Candidate Current Skills: ${candidate.skills.join(", ")}
Job Description Details:
${jobDescription || "Not Specified"}

Perform a precise comparison. Extract matching skills, missing skills (the gaps), and recommend specific modern resources (online courses, textbooks, or frameworks) for each gap.
Return a JSON object matching this schema exactly:
{
  "matchingSkills": ["skill1", "skill2"],
  "gaps": ["missing_skill1", "missing_skill2"],
  "recommendations": [{"skill": "...", "resourceName": "...", "type": "Course|Book|Framework", "url": "..."}]
}`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: promptText,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              matchingSkills: { type: Type.ARRAY, items: { type: Type.STRING } },
              gaps: { type: Type.ARRAY, items: { type: Type.STRING } },
              recommendations: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    skill: { type: Type.STRING },
                    resourceName: { type: Type.STRING },
                    type: { type: Type.STRING },
                    url: { type: Type.STRING }
                  },
                  required: ["skill", "resourceName", "type"]
                }
              }
            },
            required: ["matchingSkills", "gaps", "recommendations"]
          }
        }
      });

      res.json({ success: true, analysis: JSON.parse(response.text || "{}"), isMock: false });
    } else {
      // Mock skill gap mapping
      const jobLower = (jobDescription || "").toLowerCase();
      const matchingSkills = candidate.skills.filter(s => jobLower.includes(s.toLowerCase()));
      const potentialGaps = ["Kubernetes & Orchestration", "FastAPI Microservices", "Distributed Caching (Redis)", "RAG Vector Databases", "Pruning and Quantization"];
      const gaps = potentialGaps.filter(g => !candidate.skills.some(s => g.toLowerCase().includes(s.toLowerCase()))).slice(0, 2);

      const recommendations = gaps.map(gap => ({
        skill: gap,
        resourceName: gap.includes("Kubernetes") 
          ? "Certified Kubernetes Administrator (CKA) - Linux Foundation" 
          : gap.includes("Caching") 
          ? "Redis University: Ru101 Introduction to Redis Data Structures" 
          : "DeepLearning.AI: Prompt Engineering & Vector Databases Masterclass",
        type: "Course",
        url: "https://www.deeplearning.ai/"
      }));

      res.json({
        success: true,
        analysis: {
          matchingSkills: matchingSkills.length > 0 ? matchingSkills : candidate.skills.slice(0, 2),
          gaps: gaps.length > 0 ? gaps : ["Advanced Microservice Scaling"],
          recommendations
        },
        isMock: true
      });
    }
  } catch (error: any) {
    console.error("Skill gap analysis error:", error);
    res.status(500).json({ success: false, error: error.message || "Failed to analyze skill gaps." });
  }
});

// 9. API: Resume Improvement Suggestions
app.post("/api/resume-suggestions", async (req, res) => {
  const { candidateId } = req.body;
  const candidate = candidateDatabase.find(c => c.id === candidateId);
  if (!candidate) {
    return res.status(404).json({ success: false, error: "Candidate not found" });
  }

  try {
    const hasRealKey = process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== "MY_GEMINI_API_KEY";

    if (hasRealKey) {
      const promptText = `
Candidate Name: ${candidate.name}
Candidate Title: ${candidate.title}
Candidate Bio: ${candidate.bio}
Candidate Skills: ${candidate.skills.join(", ")}
Candidate Experience History:
${JSON.stringify(candidate.experienceHistory, null, 2)}

Identify three actionable ways this candidate can improve their resume presentation, technical highlighting, or metrics inclusion to make it look highly professional and impressive.
Return a JSON array of objects: [{"section": "Header|Skills|Experience|Bio", "issue": "...", "suggestion": "...", "example": "..."}]`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: promptText,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                section: { type: Type.STRING },
                issue: { type: Type.STRING },
                suggestion: { type: Type.STRING },
                example: { type: Type.STRING }
              },
              required: ["section", "issue", "suggestion"]
            }
          }
        }
      });

      res.json({ success: true, suggestions: JSON.parse(response.text || "[]"), isMock: false });
    } else {
      // Mock suggestions
      const suggestions = [
        {
          section: "Experience Highlights",
          issue: "Lack of quantifiable business and technical metrics in role descriptions.",
          suggestion: "Integrate concrete percentages, cost savings, or execution speed enhancements to demonstrate your real impact.",
          example: `Instead of 'Developed recommendation systems,' write: 'Designed PyTorch analytical recommendations, boosting CTR metrics by 18% and scaling queries to 10k/sec.'`
        },
        {
          section: "Skills Indexing",
          issue: "Skills list is un-categorized, which decreases readability for ATS systems.",
          suggestion: "Group your core tools into functional sectors (e.g. Languages, Deep Learning, DevOps/Orchestration).",
          example: "Languages: Python, SQL. Core frameworks: PyTorch, FastAPI, Scikit-Learn. Tools: Docker, Git."
        },
        {
          section: "Bio Narrative",
          issue: "The summary bio is broad and doesn't showcase your unique passion or specialty.",
          suggestion: "Focus the opening line on your exact domain specialization rather than generalized claims.",
          example: `Lead ML Research Engineer focused on high-availability neural pipelines, specialized in quantization and containerized cluster orchestration.`
        }
      ];
      res.json({ success: true, suggestions, isMock: true });
    }
  } catch (error: any) {
    console.error("Resume suggestions error:", error);
    res.status(500).json({ success: false, error: error.message || "Failed to generate resume suggestions." });
  }
});

// 10. API: Automated Outreach Email Generator
app.post("/api/outreach-email", async (req, res) => {
  const { candidateId, jobTitle } = req.body;
  const candidate = candidateDatabase.find(c => c.id === candidateId);
  if (!candidate) {
    return res.status(404).json({ success: false, error: "Candidate not found" });
  }

  try {
    const hasRealKey = process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== "MY_GEMINI_API_KEY";

    if (hasRealKey) {
      const promptText = `
Candidate Name: ${candidate.name}
Candidate Expertise: ${candidate.title}
Key Skills: ${candidate.skills.slice(0, 4).join(", ")}
Target Role Title: ${jobTitle || "Senior Software Engineer"}

Draft a highly personalized, warm, concise, and non-spammy recruiter outreach email inviting this candidate to discuss the role.
Return a JSON object: {"subject": "...", "body": "..."}`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: promptText,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              subject: { type: Type.STRING },
              body: { type: Type.STRING }
            },
            required: ["subject", "body"]
          }
        }
      });

      res.json({ success: true, email: JSON.parse(response.text || "{}"), isMock: false });
    } else {
      // Mock email
      const email = {
        subject: `Opportunity: ${jobTitle || "Senior Software Expert"} position at Enterprise Solutions`,
        body: `Hi ${candidate.name},

I came across your profile and was deeply impressed by your expertise as a ${candidate.title}. Your strong background in tools like ${candidate.skills.slice(0, 3).join(", ")} aligns directly with some of the core distributed systems and architecture challenges we are currently addressing.

We are looking for a key contributor to lead modeling and orchestration efforts, and I think your experience fits perfectly.

Would you be open to a brief, 15-minute introductory call this week to explore this further?

Best regards,
The Talent Discovery Team`
      };
      res.json({ success: true, email, isMock: true });
    }
  } catch (error: any) {
    console.error("Outreach email error:", error);
    res.status(500).json({ success: false, error: error.message || "Failed to generate outreach email." });
  }
});

// Serve client-side static assets or Vite middleware
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`AI Candidate Discovery Engine running on port ${PORT}`);
  });
}

startServer();
