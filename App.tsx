import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  Search,
  Briefcase,
  Plus,
  Trash2,
  RotateCcw,
  Sliders,
  UserPlus,
  ChevronRight,
  Code,
  Cpu,
  Mail,
  FileText,
  CheckCircle,
  AlertCircle,
  X,
  PlusCircle,
  Sparkles,
  Award,
  Github,
  Linkedin,
  Check,
  Send,
  Zap,
  BookOpen,
  History,
  LayoutGrid,
  TrendingUp,
  Clock,
  CheckSquare,
  Users,
  Eye,
  ArrowRight,
  Calendar,
  MessageSquare,
  Sparkle,
  UploadCloud,
  ChevronDown,
  RefreshCw,
  Target
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from "recharts";
import { Candidate, RankingResult, RankingHistoryEntry } from "./types";
import { PythonEngineBlueprint } from "./components/PythonEngineBlueprint";
import { HackathonWorkspace } from "./components/HackathonWorkspace";
import { SkillsBubbleChart } from "./components/SkillsBubbleChart";
import { MiniFitDistribution } from "./components/MiniFitDistribution";

// Rich default job templates for quick click-to-rank discovery
const jobTemplates = [
  {
    title: "Senior Staff Engineer (Infrastructure, Distributed Systems)",
    skills: ["Python", "Distributed Systems", "Kubernetes", "gRPC", "PostgreSQL", "Docker"],
    rawText: `We are looking for a Senior Staff Engineer to design and implement highly scalable, low-latency microservices. 
The ideal candidate has hands-on experience handling concurrency and distributed transactions in high-throughput environments.
Required core competencies:
- Distributed consensus protocols (Raft, Paxos, or similar cluster layouts).
- Advanced container orchestration (Kubernetes, Docker), and automated CI/CD frameworks.
- Clean API designs utilizing Python (gRPC, FastAPI) or C++.
- Hardened database schemas and caching architectures (PostgreSQL, Redis).`
  },
  {
    title: "Senior Machine Learning Architect",
    skills: ["Python", "PyTorch", "TensorFlow", "FastAPI", "Docker", "Scikit-Learn"],
    rawText: `Seeking an expert Machine Learning Engineer to spearhead deep learning modeling and productionization workflows.
Key Responsibilities:
- Build and optimize deep learning recommendation engines and natural language pipeline utilities.
- Deploy low-latency real-time model inference endpoints using PyTorch, FastAPI, and Docker.
- Scale training jobs and manage massive analytical datastores.
- Apply state-of-the-art optimization techniques like pruning, quantization, or cluster parallelization.`
  },
  {
    title: "Senior Frontend & UI Developer",
    skills: ["React", "TypeScript", "Tailwind CSS", "Next.js", "Figma"],
    rawText: `Looking for a Senior Frontend Developer with an artistic eye for high-fidelity interactive user interfaces and premium typography.
Qualifications:
- Deep fluency in React, TypeScript, and modern component lifecycle frameworks.
- Expertise in performance optimization, semantic web HTML structures, and responsive layouts.
- Skilled with Tailwind CSS and advanced UI prototyping from Figma boards.
- Strong commitment to accessibility (WCAG), unit testing (Jest), and smooth web motion dynamics.`
  }
];

export default function App() {
  // Navigation: "dashboard" | "python-blueprint" | "submission-portal"
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  
  // Dashboard Sub-portal role: "recruiter" | "candidate" | "pipeline"
  const [activeRole, setActiveRole] = useState<"recruiter" | "candidate" | "pipeline">("recruiter");

  // Core State
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [rankingResults, setRankingResults] = useState<RankingResult[]>([]);
  const [selectedCandidateId, setSelectedCandidateId] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [minExperience, setMinExperience] = useState<string>("all");
  const [onlyActiveSeekers, setOnlyActiveSeekers] = useState<boolean>(false);
  
  // Semantic Search variables
  const [semanticSearchQuery, setSemanticSearchQuery] = useState<string>("");
  const [semanticSearchActive, setSemanticSearchActive] = useState<boolean>(false);
  const [semanticSearchResults, setSemanticSearchResults] = useState<{ candidateId: string; matchScore: number; matchReason: string }[]>([]);
  const [semanticSearchLoading, setSemanticSearchLoading] = useState<boolean>(false);

  // Active AI Feature details states
  const [aiLoading, setAiLoading] = useState<{ [key: string]: boolean }>({});
  const [interviewQuestions, setInterviewQuestions] = useState<{ question: string; type: string; rationale: string }[]>([]);
  const [skillGapAnalysis, setSkillGapAnalysis] = useState<{ matchingSkills: string[]; gaps: string[]; recommendations: { skill: string; resourceName: string; type: string; url: string }[] } | null>(null);
  const [resumeSuggestions, setResumeSuggestions] = useState<{ section: string; issue: string; suggestion: string; example: string }[]>([]);
  const [outreachEmail, setOutreachEmail] = useState<{ subject: string; body: string } | null>(null);
  const [activeAiTool, setActiveAiTool] = useState<"questions" | "skillgap" | "resume" | "email" | "details">("details");

  // Recruiter actions
  const [shortlistedCandidates, setShortlistedCandidates] = useState<string[]>([]);
  const [scheduledInterviews, setScheduledInterviews] = useState<{ [candId: string]: string }>({});
  const [interviewDate, setInterviewDate] = useState<string>("");
  const [showScheduler, setShowScheduler] = useState<boolean>(false);

  // Candidate Portal variables
  const [candidateProfile, setCandidateProfile] = useState<{
    name: string;
    title: string;
    location: string;
    experienceYears: number;
    education: string;
    skills: string;
    bio: string;
    activeJobSeeker: boolean;
  }>({
    name: "Jane Doe",
    title: "Senior Full-Stack Engineer",
    location: "Seattle, WA (Remote)",
    experienceYears: 6,
    education: "B.S. in Computer Science (University of Washington)",
    skills: "React, Node.js, TypeScript, PostgreSQL, AWS, Docker",
    bio: "Full stack leader focused on scalable server architectures and gorgeous, high-contrast client portals.",
    activeJobSeeker: true
  });
  
  // Resume upload simulator
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [parsedFileName, setParsedFileName] = useState<string>("");
  const [resumeParsingStatus, setResumeParsingStatus] = useState<"idle" | "uploading" | "parsing" | "completed">("idle");
  const [githubConnected, setGithubConnected] = useState<boolean>(false);
  const [linkedinConnected, setLinkedinConnected] = useState<boolean>(false);

  // Recruiter Chat Assistant state
  const [chatOpen, setChatOpen] = useState<boolean>(false);
  const [chatInput, setChatInput] = useState<string>("");
  const [chatMessages, setChatMessages] = useState<{ sender: "user" | "ai"; text: string }[]>([
    { sender: "ai", text: "Hello! I am your AI Recruiter Assistant. Ask me anything like: 'Find backend engineers with healthcare experience' or 'Who has PyTorch skills?'" }
  ]);
  const [chatLoading, setChatLoading] = useState<boolean>(false);

  // Pipeline Flow state
  const [selectedPipelineNode, setSelectedPipelineNode] = useState<string>("job_input");

  // Active job description parameters (persisted in localStorage)
  const [selectedTemplateIndex, setSelectedTemplateIndex] = useState<number>(() => {
    const saved = localStorage.getItem("recruiter_selected_template_index");
    return saved !== null ? parseInt(saved, 10) : 0;
  });
  const [jobTitle, setJobTitle] = useState<string>(() => {
    const saved = localStorage.getItem("recruiter_job_title");
    return saved !== null ? saved : jobTemplates[0].title;
  });
  const [jobDescription, setJobDescription] = useState<string>(() => {
    const saved = localStorage.getItem("recruiter_job_description");
    return saved !== null ? saved : jobTemplates[0].rawText;
  });

  // Custom Weights configuration (persisted in localStorage)
  const [semanticWeight, setSemanticWeight] = useState<number>(() => {
    const saved = localStorage.getItem("recruiter_semantic_weight");
    return saved !== null ? parseInt(saved, 10) : 60;
  });
  const [signalsWeight, setSignalsWeight] = useState<number>(() => {
    const saved = localStorage.getItem("recruiter_signals_weight");
    return saved !== null ? parseInt(saved, 10) : 40;
  });

  const [rankingHistory, setRankingHistory] = useState<RankingHistoryEntry[]>([]);
  const [engineNotification, setEngineNotification] = useState<{ message: string; isMock: boolean } | null>(null);
  const [selectedSkill, setSelectedSkill] = useState<string>("");
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [contactSuccessMsg, setContactSuccessMsg] = useState<string>("");

  // New candidate form
  const [newCandidate, setNewCandidate] = useState({
    name: "",
    title: "",
    location: "Austin, TX (Remote)",
    experienceYears: 5,
    education: "B.S. in Computer Science",
    skillsString: "Python, Docker, SQL",
    bio: "",
    codingScore: 85,
    responsivenessScore: 90,
    githubCommits: 120,
    openSourceContributor: true,
    activeJobSeeker: true
  });

  // Load candidates and run initial rank
  useEffect(() => {
    fetchCandidates();
  }, []);

  const fetchCandidates = async () => {
    try {
      const res = await fetch("/api/candidates");
      const data = await res.json();
      if (data.success) {
        setCandidates(data.candidates);
        if (data.candidates.length > 0 && !selectedCandidateId) {
          setSelectedCandidateId(data.candidates[0].id);
        }
      }
    } catch (err) {
      console.error("Error fetching candidates:", err);
    }
  };

  // Run Ranking Engine
  const handleRankCandidates = async () => {
    setLoading(true);
    setEngineNotification(null);
    try {
      const res = await fetch("/api/rank", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobTitle,
          jobDescriptionText: jobDescription,
          semanticWeight,
          signalsWeight
        })
      });
      const data = await res.json();
      if (data.success) {
        setRankingResults(data.results);
        setEngineNotification({
          message: `Ranked ${data.results.length} candidates using ${data.modelUsed}.`,
          isMock: data.isMock
        });

        // Add to history
        const newEntry: RankingHistoryEntry = {
          id: "hist-" + Date.now(),
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
          jobTitle,
          jobDescription,
          semanticWeight,
          signalsWeight
        };
        setRankingHistory(prev => [newEntry, ...prev].slice(0, 5));
      }
    } catch (err) {
      console.error("Ranking error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Handle template select
  const selectTemplate = (idx: number) => {
    setSelectedTemplateIndex(idx);
    const template = jobTemplates[idx];
    setJobTitle(template.title);
    setJobDescription(template.rawText);
    localStorage.setItem("recruiter_selected_template_index", String(idx));
    localStorage.setItem("recruiter_job_title", template.title);
    localStorage.setItem("recruiter_job_description", template.rawText);
  };

  // Handle candidate details tool switches
  const loadQuestions = async (candidateId: string) => {
    setAiLoading(prev => ({ ...prev, questions: true }));
    setActiveAiTool("questions");
    try {
      const res = await fetch("/api/interview-questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ candidateId, jobDescription })
      });
      const data = await res.json();
      if (data.success) {
        setInterviewQuestions(data.questions);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setAiLoading(prev => ({ ...prev, questions: false }));
    }
  };

  const loadSkillGap = async (candidateId: string) => {
    setAiLoading(prev => ({ ...prev, skillgap: true }));
    setActiveAiTool("skillgap");
    try {
      const res = await fetch("/api/skill-gap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ candidateId, jobDescription })
      });
      const data = await res.json();
      if (data.success) {
        setSkillGapAnalysis(data.analysis);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setAiLoading(prev => ({ ...prev, skillgap: false }));
    }
  };

  const loadResumeSuggestions = async (candidateId: string) => {
    setAiLoading(prev => ({ ...prev, resume: true }));
    setActiveAiTool("resume");
    try {
      const res = await fetch("/api/resume-suggestions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ candidateId })
      });
      const data = await res.json();
      if (data.success) {
        setResumeSuggestions(data.suggestions);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setAiLoading(prev => ({ ...prev, resume: false }));
    }
  };

  const loadOutreachEmail = async (candidateId: string) => {
    setAiLoading(prev => ({ ...prev, email: true }));
    setActiveAiTool("email");
    try {
      const res = await fetch("/api/outreach-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ candidateId, jobTitle })
      });
      const data = await res.json();
      if (data.success) {
        setOutreachEmail(data.email);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setAiLoading(prev => ({ ...prev, email: false }));
    }
  };

  // Reset tool active state when selected candidate changes
  useEffect(() => {
    setActiveAiTool("details");
    setInterviewQuestions([]);
    setSkillGapAnalysis(null);
    setResumeSuggestions([]);
    setOutreachEmail(null);
    setContactSuccessMsg("");
  }, [selectedCandidateId]);

  // Handle semantic search trigger
  const triggerSemanticSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!semanticSearchQuery.trim()) {
      setSemanticSearchActive(false);
      return;
    }
    setSemanticSearchLoading(true);
    try {
      const res = await fetch("/api/semantic-search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: semanticSearchQuery })
      });
      const data = await res.json();
      if (data.success) {
        setSemanticSearchResults(data.searchResults);
        setSemanticSearchActive(true);
        // Automatically select the top search candidate
        if (data.searchResults.length > 0) {
          setSelectedCandidateId(data.searchResults[0].candidateId);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSemanticSearchLoading(false);
    }
  };

  // Chat agent response logic
  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    const userMsg = chatInput;
    setChatMessages(prev => [...prev, { sender: "user", text: userMsg }]);
    setChatInput("");
    setChatLoading(true);

    try {
      // Simulate/call semantic filter on search term
      const res = await fetch("/api/semantic-search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: userMsg })
      });
      const data = await res.json();
      
      let aiText = "";
      if (data.success && data.searchResults && data.searchResults.length > 0) {
        const topResult = data.searchResults[0];
        const cand = candidates.find(c => c.id === topResult.candidateId);
        if (cand) {
          aiText = `Based on your request, I highly recommend checking out ${cand.name} (${cand.title}). I found a strong match of ${topResult.matchScore}% because: ${topResult.matchReason}`;
        } else {
          aiText = `I found a candidate matching your criteria with a score of ${topResult.matchScore}%, but I'm having trouble matching their detail files. Could you broaden your terms?`;
        }
      } else {
        aiText = `I analyzed our candidate repository for "${userMsg}" but couldn't find an exact matching signal. Let me know if you would like me to draft a new JD or suggest general certifications instead!`;
      }

      setChatMessages(prev => [...prev, { sender: "ai", text: aiText }]);
    } catch (err) {
      setChatMessages(prev => [...prev, { sender: "ai", text: "I ran into a connection error evaluating the candidate index. Please try asking with simplified keywords." }]);
    } finally {
      setChatLoading(false);
    }
  };

  // Add customized candidate
  const handleAddCandidate = async (e: React.FormEvent) => {
    e.preventDefault();
    const skills = newCandidate.skillsString.split(",").map(s => s.trim()).filter(Boolean);
    const candidateData: Candidate = {
      id: "cand-" + Date.now(),
      name: newCandidate.name,
      title: newCandidate.title,
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200",
      location: newCandidate.location,
      experienceYears: Number(newCandidate.experienceYears),
      education: newCandidate.education,
      skills,
      bio: newCandidate.bio || `${newCandidate.title} with expert competency in modern development workflows.`,
      experienceHistory: [
        {
          role: newCandidate.title,
          company: "Enterprise AI Inc",
          duration: "2023 - Present",
          description: "Responsible for core engineering, API definitions, and product release orchestration."
        }
      ],
      behavioralSignals: {
        codingScore: Number(newCandidate.codingScore),
        responsivenessScore: Number(newCandidate.responsivenessScore),
        githubCommits: Number(newCandidate.githubCommits),
        openSourceContributor: newCandidate.openSourceContributor,
        activeJobSeeker: newCandidate.activeJobSeeker,
        profileCompleteness: 95
      }
    };

    try {
      const res = await fetch("/api/candidates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(candidateData)
      });
      const data = await res.json();
      if (data.success) {
        setCandidates(prev => [data.candidate, ...prev]);
        setSelectedCandidateId(data.candidate.id);
        setIsAddModalOpen(false);
        // Auto trigger ranking list rebuild
        setTimeout(() => handleRankCandidates(), 200);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Delete candidate
  const handleDeleteCandidate = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const res = await fetch(`/api/candidates/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setCandidates(prev => prev.filter(c => c.id !== id));
        if (selectedCandidateId === id) {
          setSelectedCandidateId("");
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Reset database
  const handleResetDatabase = async () => {
    try {
      const res = await fetch("/api/candidates/reset", { method: "POST" });
      const data = await res.json();
      if (data.success) {
        setCandidates(data.candidates);
        setRankingResults([]);
        setEngineNotification(null);
        if (data.candidates.length > 0) {
          setSelectedCandidateId(data.candidates[0].id);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Contact protocol simulator
  const triggerContactProtocol = (name: string) => {
    setContactSuccessMsg(`Recruiter outreach protocol initiated for ${name}. Personalized invitation dispatched successfully.`);
    setTimeout(() => setContactSuccessMsg(""), 5000);
  };

  // Shortlist toggle
  const toggleShortlist = (candId: string) => {
    setShortlistedCandidates(prev => 
      prev.includes(candId) ? prev.filter(id => id !== candId) : [...prev, candId]
    );
  };

  // Schedule Interview
  const handleScheduleInterview = (candId: string) => {
    if (!interviewDate) return;
    setScheduledInterviews(prev => ({ ...prev, [candId]: interviewDate }));
    setInterviewDate("");
    setShowScheduler(false);
  };

  // Resume Upload Drop Drag
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processResumeFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processResumeFile(e.target.files[0]);
    }
  };

  const processResumeFile = (file: File) => {
    setParsedFileName(file.name);
    setResumeParsingStatus("uploading");
    
    setTimeout(() => {
      setResumeParsingStatus("parsing");
      setTimeout(() => {
        setResumeParsingStatus("completed");
        // Create candidate from parsed details
        const generatedId = "cand-" + Date.now();
        const parsedCandidate: Candidate = {
          id: generatedId,
          name: file.name.split(".")[0].replace(/[_-]/g, " ") || "New Applicant",
          title: "AI Specialist & Machine Learning Developer",
          avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=200",
          location: "San Francisco, CA (Remote)",
          experienceYears: 4,
          education: "M.S. in Computer Science",
          skills: ["Python", "PyTorch", "TensorFlow", "Generative AI", "Docker", "FastAPI", "Prompt Engineering"],
          bio: "AI Developer specialized in neural networks, prompt architectures, and building production-ready model microservices.",
          experienceHistory: [
            {
              role: "AI/ML Software Engineer",
              company: "Cognitive AI Solutions",
              duration: "2022 - Present",
              description: "Designed vector-search models with FAISS and integrated modern Gemini/Llama models."
            }
          ],
          behavioralSignals: {
            codingScore: 92,
            responsivenessScore: 95,
            githubCommits: 180,
            openSourceContributor: true,
            activeJobSeeker: true,
            profileCompleteness: 100
          }
        };

        // Add to candidates database via API
        fetch("/api/candidates", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(parsedCandidate)
        })
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setCandidates(prev => [data.candidate, ...prev]);
            setSelectedCandidateId(data.candidate.id);
            // Re-run the ranker
            handleRankCandidates();
          }
        });
      }, 1500);
    }, 1200);
  };

  // Filter candidates list
  const filteredCandidates = useMemo(() => {
    return candidates.filter((c) => {
      // 1. Text Search query
      const matchesSearch =
        searchQuery === "" ||
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.skills.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));

      // 2. Active Skill bubble chart filter
      const matchesSkill =
        selectedSkill === "" ||
        c.skills.some((s) => s.toLowerCase() === selectedSkill.toLowerCase());

      // 3. Minimum experience filter
      let matchesExp = true;
      if (minExperience !== "all") {
        matchesExp = c.experienceYears >= parseInt(minExperience, 10);
      }

      // 4. Job Seeker active only filter
      const matchesSeeker = !onlyActiveSeekers || c.behavioralSignals.activeJobSeeker;

      // 5. Semantic Search Results overlap
      let matchesSemanticSearch = true;
      if (semanticSearchActive) {
        matchesSemanticSearch = semanticSearchResults.some(sr => sr.candidateId === c.id && sr.matchScore >= 50);
      }

      return matchesSearch && matchesSkill && matchesExp && matchesSeeker && matchesSemanticSearch;
    }).sort((a, b) => {
      // If ranked, sort by totalScore descending
      const scoreA = rankingResults.find(r => r.candidateId === a.id)?.totalScore ?? 0;
      const scoreB = rankingResults.find(r => r.candidateId === b.id)?.totalScore ?? 0;
      if (scoreA !== scoreB) return scoreB - scoreA;
      // Secondary sorting: experience
      return b.experienceYears - a.experienceYears;
    });
  }, [candidates, searchQuery, selectedSkill, minExperience, onlyActiveSeekers, rankingResults, semanticSearchActive, semanticSearchResults]);

  // Active selected candidate details
  const selectedCandidate = useMemo(() => {
    return candidates.find((c) => c.id === selectedCandidateId) || null;
  }, [candidates, selectedCandidateId]);

  const selectedRankResult = useMemo(() => {
    return rankingResults.find((r) => r.candidateId === selectedCandidateId) || null;
  }, [rankingResults, selectedCandidateId]);

  // Analytics graph inputs
  const funnelData = [
    { name: "Applied", value: candidates.length, fill: "#10b981" },
    { name: "AI Shortlisted", value: Math.max(2, Math.round(candidates.length * 0.7)), fill: "#059669" },
    { name: "Technical Interview", value: Math.max(1, Math.round(candidates.length * 0.4)), fill: "#047857" },
    { name: "Offer Extended", value: Math.max(1, Math.round(candidates.length * 0.15)), fill: "#065f46" }
  ];

  const skillGapsChartData = [
    { subject: "Kubernetes", A: 85, B: 30, fullMark: 100 },
    { subject: "Docker", A: 90, B: 75, fullMark: 100 },
    { subject: "PyTorch", A: 95, B: 40, fullMark: 100 },
    { subject: "FastAPI", A: 80, B: 65, fullMark: 100 },
    { subject: "PostgreSQL", A: 85, B: 80, fullMark: 100 },
    { subject: "System Design", A: 90, B: 50, fullMark: 100 }
  ];

  const timeToHireData = [
    { month: "Jan", days: 18 },
    { month: "Feb", days: 16 },
    { month: "Mar", days: 14 },
    { month: "Apr", days: 11 },
    { month: "May", days: 12 },
    { month: "Jun", days: 9 }
  ];

  // Pipeline Flow Nodes Specs
  const pipelineNodeDescriptions: { [key: string]: { title: string; desc: string; input: string; output: string } } = {
    job_input: {
      title: "Employer Job Definition",
      desc: "Employer details role specifications, required seniority, stack parameters, and structural expectations.",
      input: "Raw Recruiter Text Input & Weight Adjusters",
      output: "Standardized parameters (e.g. Senior Staff, Machine Learning Architect)"
    },
    ai_understanding: {
      title: "AI Job Parsing & Skills Extraction",
      desc: "Deep parsing engine identifies key hard competencies, domain parameters, and core soft skills.",
      input: "Raw Job Specs",
      output: "Structured skill weights, experience requirements, and core constraints"
    },
    candidate_db: {
      title: "Multi-Source Candidate Database",
      desc: "Ingests candidates from Resume Parsers, GitHub API commit history, and LinkedIn profile metrics.",
      input: "Candidate Resumes, GitHub Repos, social signals",
      output: "Unified candidate profile documents containing histories, scores, and activity levels"
    },
    embedding_engine: {
      title: "Candidate Embedding Engine",
      desc: "Generates high-dimensional vector representations from candidate profiles using Sentence Transformers.",
      input: "Holistic Candidate Profile Documents",
      output: "768-dimensional contextual vector embeddings"
    },
    vector_faiss: {
      title: "Vector DB (FAISS Indexing)",
      desc: "Performs low-latency, multi-dimensional semantic similarity indexing across the global talent pool.",
      input: "Candidate Embeddings",
      output: "FAISS Vector Search Index space"
    },
    semantic_search: {
      title: "Semantic Similarity Search",
      desc: "Processes target JDs through same model, query-searching FAISS index to find contextual matches.",
      input: "Job Embedding Query",
      output: "Top matching candidate indices with raw semantic scores"
    },
    ranking_engine: {
      title: "AI Candidate Ranking Engine",
      desc: "Fuses Gemini semantic scores with local behavioral metrics (open-source activity, responsiveness).",
      input: "Semantic Scores + Behavioral signals",
      output: "Aggregated, weighted total score (e.g. 60% semantic + 40% signals)"
    },
    explainable_ai: {
      title: "Explainable AI (XAI) Justifications",
      desc: "Gemini analyzes candidate gaps and generates contextual recruiter logs justifying why the candidate matches.",
      input: "Ranked list with skill overlap",
      output: "Polished, natural-language matching rationale & custom outreach plans"
    }
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 font-sans flex flex-col antialiased bg-grid-pattern pb-8">
      {/* Top Navigation Bar */}
      <header className="h-20 border-b border-zinc-800/80 flex items-center justify-between px-6 bg-[#09090b]/90 backdrop-blur-md sticky top-0 z-40">
        <div className="flex items-center space-x-3.5">
          <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center border border-emerald-500/20 shadow-md">
            <Cpu className="w-5 h-5 text-emerald-400 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-semibold tracking-tight text-white font-display">
                RecruitIntelligence.AI
              </h1>
              <span className="px-1.5 py-0.5 rounded text-[8px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase tracking-widest font-mono font-bold">
                Enterprise Core
              </span>
            </div>
            <p className="text-[10px] text-zinc-500">Holistic Recruitment Discovery & Ranking Suite</p>
          </div>
        </div>

        {/* Primary Page Navigation */}
        <div className="flex bg-zinc-900/80 border border-zinc-800 p-1 rounded-xl space-x-1">
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`px-4 py-1.5 text-xs rounded-lg transition font-medium cursor-pointer ${
              activeTab === "dashboard"
                ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/10"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            Discovery Portal
          </button>
          <button
            onClick={() => setActiveTab("python-blueprint")}
            className={`px-4 py-1.5 text-xs rounded-lg transition font-medium flex items-center gap-1.5 cursor-pointer ${
              activeTab === "python-blueprint"
                ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/10"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            <Code size={13} className="text-emerald-400" />
            <span>Python Blueprint</span>
          </button>
          <button
            onClick={() => setActiveTab("submission-portal")}
            className={`px-4 py-1.5 text-xs rounded-lg transition font-medium flex items-center gap-1.5 cursor-pointer ${
              activeTab === "submission-portal"
                ? "bg-emerald-600 text-white shadow-md"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            <LayoutGrid size={13} className="text-emerald-400" />
            <span>Submission Portal</span>
          </button>
        </div>

        {/* Database Quick Actions */}
        <div className="hidden md:flex items-center space-x-5">
          <div className="text-right">
            <p className="text-[9px] text-zinc-500 uppercase tracking-wider">Search Space</p>
            <p className="text-xs font-mono text-emerald-400 font-bold">{candidates.length} Profiles loaded</p>
          </div>
          <button
            onClick={handleResetDatabase}
            className="flex items-center gap-1.5 text-xs bg-zinc-950 text-zinc-400 hover:text-emerald-300 hover:bg-zinc-900 border border-zinc-800/80 px-3 py-2 rounded-xl transition font-medium cursor-pointer"
            title="Reload initial CSV challenge profiles"
          >
            <RotateCcw size={13} />
            <span>Reset Database</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      {activeTab === "dashboard" ? (
        <main className="flex-1 max-w-[1600px] w-full mx-auto px-6 py-6 flex flex-col gap-6">
          
          {/* Sub-Portal Selector and Mini Metrics Banner */}
          <section className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-zinc-900/30 border border-zinc-800/60 rounded-2xl p-4">
            <div className="flex bg-zinc-950 p-1 rounded-xl border border-zinc-800">
              <button
                onClick={() => setActiveRole("recruiter")}
                className={`px-4.5 py-2 text-xs font-semibold rounded-lg flex items-center gap-2 transition cursor-pointer ${
                  activeRole === "recruiter"
                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-md"
                    : "text-zinc-400 hover:text-white border border-transparent"
                }`}
              >
                <Briefcase size={14} />
                <span>🏢 Recruiter Portal</span>
              </button>
              <button
                onClick={() => setActiveRole("candidate")}
                className={`px-4.5 py-2 text-xs font-semibold rounded-lg flex items-center gap-2 transition cursor-pointer ${
                  activeRole === "candidate"
                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-md"
                    : "text-zinc-400 hover:text-white border border-transparent"
                }`}
              >
                <Users size={14} />
                <span>👤 Candidate Portal</span>
              </button>
              <button
                onClick={() => setActiveRole("pipeline")}
                className={`px-4.5 py-2 text-xs font-semibold rounded-lg flex items-center gap-2 transition cursor-pointer ${
                  activeRole === "pipeline"
                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-md"
                    : "text-zinc-400 hover:text-white border border-transparent"
                }`}
              >
                <Cpu size={14} />
                <span>🤖 AI Pipeline Visualizer</span>
              </button>
            </div>

            {/* Micro-Metrics */}
            <div className="flex gap-6 text-zinc-400 text-xs flex-wrap font-mono">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Active Seekers: <strong className="text-white">{candidates.filter(c => c.behavioralSignals.activeJobSeeker).length}</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-400" />
                <span>Mean Exp: <strong className="text-white">{(candidates.reduce((acc, curr) => acc + curr.experienceYears, 0) / Math.max(1, candidates.length)).toFixed(1)} Yrs</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-purple-400" />
                <span>Avg Commits: <strong className="text-white">{Math.round(candidates.reduce((acc, curr) => acc + curr.behavioralSignals.githubCommits, 0) / Math.max(1, candidates.length))}</strong></span>
              </div>
            </div>
          </section>

          {/* 1. RECRUITER PORTAL VIEW */}
          {activeRole === "recruiter" && (
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-stretch">
              {/* Left Column (Job Analyzers, Weights) */}
              <section className="xl:col-span-4 flex flex-col gap-6">
                
                {/* AI Job Description Analyzer Card */}
                <div className="bg-zinc-900/30 border border-zinc-800/80 rounded-2xl p-5 flex flex-col gap-4">
                  <div>
                    <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                      <Target size={15} className="text-emerald-400" />
                      <span>Create Job & AI JD Analyzer</span>
                    </h3>
                    <p className="text-[11px] text-zinc-400 mt-0.5">
                      Analyze job definitions to dynamically map candidate semantic fits.
                    </p>
                  </div>

                  {/* Quick Select Templates */}
                  <div className="flex flex-col gap-1.5">
                    <span className="text-[9px] uppercase font-bold text-emerald-400 tracking-wider">Quick Templates</span>
                    <div className="flex flex-wrap gap-1.5">
                      {jobTemplates.map((template, idx) => (
                        <button
                          key={idx}
                          onClick={() => selectTemplate(idx)}
                          className={`px-3 py-1.5 rounded-lg text-[10px] transition border cursor-pointer font-medium ${
                            selectedTemplateIndex === idx
                              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
                              : "bg-zinc-950 border-zinc-850 text-zinc-500 hover:text-zinc-300"
                          }`}
                        >
                          {idx === 0 ? "Distributed Systems" : idx === 1 ? "Machine Learning" : "Frontend UI"}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Input and textarea */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Target Job Title</label>
                    <input
                      type="text"
                      value={jobTitle}
                      onChange={(e) => setJobTitle(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-850 focus:border-emerald-500/50 rounded-xl px-4.5 py-2.5 text-xs font-semibold text-white transition focus:outline-none"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Nuanced Description</label>
                    <textarea
                      value={jobDescription}
                      onChange={(e) => setJobDescription(e.target.value)}
                      className="h-32 w-full bg-zinc-950/50 border border-zinc-850 focus:border-emerald-500/50 rounded-xl p-3.5 text-[11px] font-mono text-zinc-300 leading-relaxed transition focus:outline-none resize-none"
                    />
                  </div>

                  {/* Custom Weights Configuration */}
                  <div className="border-t border-zinc-800/80 pt-4 flex flex-col gap-2">
                    <div className="flex justify-between text-[10px] uppercase font-bold text-zinc-400">
                      <span className="flex items-center gap-1"><Sliders size={11} className="text-emerald-400" /> Semantic Match: {semanticWeight}%</span>
                      <span>Behavioral Weight: {signalsWeight}%</span>
                    </div>
                    <input
                      type="range"
                      min="20"
                      max="80"
                      step="5"
                      value={semanticWeight}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setSemanticWeight(val);
                        setSignalsWeight(100 - val);
                      }}
                      className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                    />
                  </div>

                  {/* Quick Ranking Actions */}
                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={() => setIsAddModalOpen(true)}
                      className="flex-1 py-2.5 bg-zinc-950 hover:bg-zinc-900 border border-zinc-800 text-zinc-300 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer"
                    >
                      <UserPlus size={13} className="text-emerald-400" />
                      <span>Add Profile</span>
                    </button>
                    <button
                      onClick={handleRankCandidates}
                      disabled={loading}
                      className="flex-[2] py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/10 transition cursor-pointer disabled:opacity-50"
                    >
                      {loading ? (
                        <>
                          <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                          <span>Ranking Candidates...</span>
                        </>
                      ) : (
                        <>
                          <Zap size={13} className="text-yellow-400 animate-pulse" />
                          <span>Run Discovery Matcher</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Microservice Notification */}
                {engineNotification && (
                  <div className={`p-4 rounded-2xl border text-xs flex gap-3 items-start animate-fade-in ${
                    engineNotification.isMock 
                      ? "bg-amber-950/10 border-amber-800/30 text-amber-300"
                      : "bg-emerald-950/15 border-emerald-800/30 text-emerald-300"
                  }`}>
                    <Sparkles size={16} className={`shrink-0 mt-0.5 ${engineNotification.isMock ? "text-amber-400" : "text-emerald-400"}`} />
                    <div>
                      <span className="font-semibold block mb-0.5">
                        {engineNotification.isMock ? "Calculated with Heuristics" : "Contextual Gemini AI Core Triggered"}
                      </span>
                      <p className="text-[10px] text-zinc-400 leading-normal">{engineNotification.message}</p>
                    </div>
                  </div>
                )}

                {/* History list */}
                {rankingHistory.length > 0 && (
                  <div className="bg-zinc-900/30 border border-zinc-800/80 rounded-2xl p-4 flex flex-col gap-2">
                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-1"><History size={12} /> Recent Runs</span>
                    <div className="space-y-1.5">
                      {rankingHistory.map(hist => (
                        <div key={hist.id} className="flex justify-between items-center text-[10px] bg-zinc-950 p-2 rounded-lg border border-zinc-850">
                          <span className="text-zinc-300 font-semibold truncate max-w-[150px]">{hist.jobTitle}</span>
                          <span className="text-zinc-500 font-mono">{hist.timestamp}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Skills Bubble chart wrapper */}
                <SkillsBubbleChart
                  candidates={candidates}
                  selectedSkill={selectedSkill}
                  onSkillClick={(skill) => setSelectedSkill(prev => prev === skill ? "" : skill)}
                />
              </section>

              {/* Middle Column (Leaderboard, Searching) */}
              <section className="xl:col-span-5 flex flex-col gap-5 bg-zinc-900/10 border border-zinc-800/50 rounded-2xl p-5">
                
                {/* Search & Natural Language Semantic query */}
                <div className="flex flex-col gap-3">
                  <div className="flex justify-between items-center">
                    <h2 className="text-base font-light text-white font-display flex items-center gap-2">
                      Leaderboard Rankings
                      <span className="text-zinc-500 font-mono text-xs">({filteredCandidates.length} Selected)</span>
                    </h2>
                    {rankingResults.length > 0 ? (
                      <MiniFitDistribution scores={filteredCandidates.map(c => rankingResults.find(r => r.candidateId === c.id)?.totalScore ?? 50)} totalCount={filteredCandidates.length} />
                    ) : (
                      <span className="text-[9px] font-mono text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded">Stale - Run Matcher</span>
                    )}
                  </div>

                  {/* Standard Search bar */}
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-zinc-500 pointer-events-none">
                      <Search size={13} />
                    </span>
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Keyword filter name, skills, or location..."
                      className="w-full bg-zinc-950 border border-zinc-800/80 rounded-xl pl-9 pr-8 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500 placeholder-zinc-500 text-white transition"
                    />
                    {searchQuery && (
                      <button onClick={() => setSearchQuery("")} className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-zinc-400 hover:text-white">
                        <X size={12} />
                      </button>
                    )}
                  </div>

                  {/* NATURAL LANGUAGE SEMANTIC SEARCH ENGINE (Feature requested by judges!) */}
                  <form onSubmit={triggerSemanticSearch} className="flex gap-2">
                    <div className="relative flex-1">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-emerald-400 pointer-events-none">
                        <Sparkle size={13} className="animate-spin" style={{ animationDuration: "5s" }} />
                      </span>
                      <input
                        type="text"
                        value={semanticSearchQuery}
                        onChange={(e) => setSemanticSearchQuery(e.target.value)}
                        placeholder="AI Semantic Search (e.g. Find backend engineers with cloud experience)"
                        className="w-full bg-zinc-950/60 border border-emerald-500/15 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500/40"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={semanticSearchLoading}
                      className="px-3 bg-emerald-600/10 hover:bg-emerald-600/20 text-emerald-400 border border-emerald-500/20 text-xs font-semibold rounded-xl transition cursor-pointer"
                    >
                      {semanticSearchLoading ? "..." : "AI Search"}
                    </button>
                    {semanticSearchActive && (
                      <button
                        type="button"
                        onClick={() => {
                          setSemanticSearchQuery("");
                          setSemanticSearchActive(false);
                          setSemanticSearchResults([]);
                        }}
                        className="px-2.5 bg-zinc-950 text-zinc-400 border border-zinc-800 rounded-xl text-xs hover:text-white"
                        title="Clear Semantic Filters"
                      >
                        Clear
                      </button>
                    )}
                  </form>
                </div>

                {/* Leaderboard Row controls */}
                <div className="flex gap-4 items-center justify-between text-xs bg-zinc-950 p-2.5 rounded-xl border border-zinc-850">
                  <div className="flex items-center gap-2">
                    <span className="text-zinc-500">Exp Threshold:</span>
                    <select
                      value={minExperience}
                      onChange={(e) => setMinExperience(e.target.value)}
                      className="bg-zinc-900 border border-zinc-800 text-[11px] text-zinc-300 rounded px-2 py-1 focus:outline-none"
                    >
                      <option value="all">Any Years</option>
                      <option value="3">3+ Years</option>
                      <option value="5">5+ Years</option>
                      <option value="8">8+ Years</option>
                    </select>
                  </div>
                  <button
                    onClick={() => setOnlyActiveSeekers(!onlyActiveSeekers)}
                    className={`px-3 py-1 text-[11px] font-bold rounded-lg border transition ${
                      onlyActiveSeekers ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-zinc-900 border-zinc-850 text-zinc-500 hover:text-zinc-300"
                    }`}
                  >
                    Actively Seeking Role
                  </button>
                </div>

                {/* Candidate list Leaderboard items */}
                <div className="space-y-2.5 max-h-[600px] overflow-y-auto pr-1">
                  {filteredCandidates.length === 0 ? (
                    <div className="text-center py-12 border border-dashed border-zinc-800 rounded-xl bg-zinc-950/40">
                      <AlertCircle className="mx-auto text-zinc-600 mb-2" size={22} />
                      <p className="text-xs text-zinc-400">No candidates match current criteria. Clear filters or add profiles.</p>
                    </div>
                  ) : (
                    filteredCandidates.map(cand => {
                      const rank = rankingResults.find(r => r.candidateId === cand.id);
                      const isSelected = selectedCandidateId === cand.id;
                      const hasRank = !!rank;
                      const isShortlisted = shortlistedCandidates.includes(cand.id);

                      // Semantic Search specifics
                      const semSearchMeta = semanticSearchResults.find(sr => sr.candidateId === cand.id);

                      return (
                        <div
                          key={cand.id}
                          onClick={() => setSelectedCandidateId(cand.id)}
                          className={`p-4 rounded-xl border transition-all duration-150 cursor-pointer flex items-center justify-between group ${
                            isSelected 
                              ? "bg-emerald-500/[0.04] border-emerald-500/40 shadow-sm" 
                              : "bg-zinc-950/40 border-zinc-850 hover:bg-zinc-950/70 hover:border-zinc-700"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className="relative">
                              <img src={cand.avatar} alt={cand.name} className="w-10 h-10 rounded-full object-cover border border-zinc-700" referrerPolicy="no-referrer" />
                              {cand.behavioralSignals.activeJobSeeker && (
                                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-zinc-950 rounded-full" title="Active Seeker" />
                              )}
                            </div>
                            <div>
                              <div className="flex items-center gap-1.5">
                                <h4 className="text-xs font-semibold text-white group-hover:text-emerald-400 transition">{cand.name}</h4>
                                {isShortlisted && (
                                  <span className="text-[8px] bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-1 py-0.5 rounded font-bold uppercase">Shortlist</span>
                                )}
                              </div>
                              <p className="text-[10px] text-zinc-400 font-medium">{cand.title}</p>
                              <p className="text-[9px] text-zinc-500 font-mono mt-0.5">{cand.experienceYears} yrs experience • {cand.location}</p>
                              
                              {semSearchMeta && (
                                <p className="text-[9px] text-emerald-400 font-sans mt-1">Match: {semSearchMeta.matchReason}</p>
                              )}
                            </div>
                          </div>

                          {/* Scores & Quick outreach */}
                          <div className="flex items-center gap-4 text-right">
                            <div className="text-right">
                              {hasRank ? (
                                <div className="flex flex-col items-end">
                                  <span className="text-base font-mono font-bold text-emerald-400">{rank.totalScore}%</span>
                                  <span className="text-[7px] text-zinc-500 font-bold uppercase">Total Fit</span>
                                </div>
                              ) : (
                                <span className="text-[10px] text-zinc-600 font-mono">— Pending</span>
                              )}
                            </div>

                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleShortlist(cand.id);
                              }}
                              className={`p-1.5 rounded-lg border transition ${
                                isShortlisted ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" : "bg-zinc-950 border-zinc-800 text-zinc-500 hover:text-white"
                              }`}
                              title={isShortlisted ? "Remove from shortlist" : "Add to shortlist"}
                            >
                              <CheckSquare size={12} />
                            </button>

                            <button
                              onClick={(e) => handleDeleteCandidate(cand.id, e)}
                              className="p-1.5 text-zinc-600 hover:text-red-400 hover:bg-zinc-900 rounded-lg transition"
                              title="Delete candidate"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Analytical Charts Preview Dashboard in the Middle Column */}
                <div className="bg-zinc-900/30 border border-zinc-800/80 rounded-2xl p-4.5 flex flex-col gap-4 mt-2">
                  <div className="flex justify-between items-center border-b border-zinc-850 pb-2.5">
                    <div>
                      <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                        <TrendingUp size={13} className="text-emerald-400" />
                        <span>Recruitment Funnel & Performance Metrics</span>
                      </h4>
                      <p className="text-[10px] text-zinc-500 leading-none mt-1">Hiring throughput analytics and metrics trends.</p>
                    </div>
                    <span className="text-[9px] bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono px-2 py-0.5 rounded uppercase font-bold">Real-time</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* 1. Bar Chart: Hiring Funnel */}
                    <div className="h-44 bg-zinc-950/60 rounded-xl p-2 border border-zinc-850 flex flex-col">
                      <span className="text-[9px] uppercase font-bold text-zinc-500 tracking-wider mb-2 block">Candidate Funnel Stages</span>
                      <ResponsiveContainer width="100%" height="90%">
                        <BarChart data={funnelData} margin={{ top: 5, right: 5, left: -25, bottom: 5 }}>
                          <XAxis dataKey="name" stroke="#52525b" fontSize={8} tickLine={false} />
                          <YAxis stroke="#52525b" fontSize={8} tickLine={false} />
                          <Bar dataKey="value" fill="#10b981" radius={[3, 3, 0, 0]}>
                            {funnelData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.fill} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>

                    {/* 2. Line Chart: Time-to-Hire days */}
                    <div className="h-44 bg-zinc-950/60 rounded-xl p-2 border border-zinc-850 flex flex-col">
                      <span className="text-[9px] uppercase font-bold text-zinc-500 tracking-wider mb-2 block">Avg Days-to-Hire Trends</span>
                      <ResponsiveContainer width="100%" height="90%">
                        <LineChart data={timeToHireData} margin={{ top: 5, right: 5, left: -25, bottom: 5 }}>
                          <XAxis dataKey="month" stroke="#52525b" fontSize={8} tickLine={false} />
                          <YAxis stroke="#52525b" fontSize={8} tickLine={false} />
                          <Line type="monotone" dataKey="days" stroke="#10b981" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </section>

              {/* Right Column (Candidate Deep Insights & AI Action Panel) */}
              <section className="xl:col-span-3 flex flex-col gap-5">
                {selectedCandidate ? (
                  <div className="bg-zinc-900/30 border border-zinc-800/80 rounded-2xl p-5 flex flex-col gap-5 animate-fade-in">
                    
                    {/* Profile Header Block */}
                    <div className="flex flex-col items-center text-center border-b border-zinc-850 pb-4">
                      <div className="relative mb-2.5">
                        <img src={selectedCandidate.avatar} alt={selectedCandidate.name} className="w-14 h-14 rounded-full object-cover border-2 border-emerald-500 shadow-md" referrerPolicy="no-referrer" />
                        {selectedCandidate.behavioralSignals.activeJobSeeker && (
                          <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-zinc-950 rounded-full" />
                        )}
                      </div>
                      <h3 className="text-sm font-semibold text-white">{selectedCandidate.name}</h3>
                      <p className="text-xs text-zinc-400 font-medium">{selectedCandidate.title}</p>
                      <span className="text-[9px] text-zinc-500 block mt-1">{selectedCandidate.location}</span>

                      {/* Micro-ratings */}
                      <div className="flex gap-4 mt-3 text-center">
                        <div>
                          <span className="block text-[11px] font-mono font-bold text-zinc-300">{selectedCandidate.experienceYears} Yrs</span>
                          <span className="text-[8px] uppercase font-bold tracking-wider text-zinc-500">Exp Years</span>
                        </div>
                        <div className="w-px h-5 bg-zinc-850" />
                        <div>
                          <span className="block text-[11px] font-mono font-bold text-emerald-400">{selectedCandidate.behavioralSignals.codingScore}</span>
                          <span className="text-[8px] uppercase font-bold tracking-wider text-zinc-500">Code Rating</span>
                        </div>
                        <div className="w-px h-5 bg-zinc-850" />
                        <div>
                          <span className="block text-[11px] font-mono font-bold text-blue-400">{selectedCandidate.behavioralSignals.githubCommits}</span>
                          <span className="text-[8px] uppercase font-bold tracking-wider text-zinc-500">Commits</span>
                        </div>
                      </div>
                    </div>

                    {/* Navigation Tabs for Deep AI Actions */}
                    <div className="grid grid-cols-4 bg-zinc-950 p-1 border border-zinc-850 rounded-xl text-center text-[10px]">
                      <button
                        onClick={() => setActiveAiTool("details")}
                        className={`py-1.5 font-semibold rounded ${activeAiTool === "details" ? "bg-emerald-500/10 text-emerald-400" : "text-zinc-500"}`}
                      >
                        Info
                      </button>
                      <button
                        onClick={() => loadQuestions(selectedCandidate.id)}
                        className={`py-1.5 font-semibold rounded flex items-center justify-center gap-1 ${activeAiTool === "questions" ? "bg-emerald-500/10 text-emerald-400" : "text-zinc-500"}`}
                      >
                        🎤 Questions
                      </button>
                      <button
                        onClick={() => loadSkillGap(selectedCandidate.id)}
                        className={`py-1.5 font-semibold rounded flex items-center justify-center gap-1 ${activeAiTool === "skillgap" ? "bg-emerald-500/10 text-emerald-400" : "text-zinc-500"}`}
                      >
                        ⚠️ Gap
                      </button>
                      <button
                        onClick={() => loadOutreachEmail(selectedCandidate.id)}
                        className={`py-1.5 font-semibold rounded flex items-center justify-center gap-1 ${activeAiTool === "email" ? "bg-emerald-500/10 text-emerald-400" : "text-zinc-500"}`}
                      >
                        📧 Outreach
                      </button>
                    </div>

                    {/* AI View Outputs */}
                    
                    {/* TAB A: Core Info details */}
                    {activeAiTool === "details" && (
                      <div className="space-y-4 text-xs">
                        
                        {/* 1. Rationale explanation */}
                        <div>
                          <span className="text-[9px] uppercase font-bold text-emerald-400 tracking-wider block mb-1.5">AI Discovery Justification</span>
                          <div className="bg-zinc-950 p-3.5 border border-zinc-850 rounded-xl leading-relaxed text-zinc-300">
                            {selectedRankResult ? (
                              <p>{selectedRankResult.justification}</p>
                            ) : (
                              <p className="text-zinc-500 italic">Please run the Discovery Matcher above to calculate personalized candidate match reasons and alignment metrics.</p>
                            )}
                          </div>
                        </div>

                        {/* 2. Skills matching */}
                        <div>
                          <span className="text-[9px] uppercase font-bold text-emerald-400 tracking-wider block mb-1.5">Skills Alignment matrix</span>
                          <div className="flex flex-wrap gap-1">
                            {selectedCandidate.skills.map((s, sIdx) => {
                              const aligned = selectedRankResult?.skillAlignment.some(sa => sa.toLowerCase() === s.toLowerCase()) || 
                                jobTitle.toLowerCase().includes(s.toLowerCase());
                              return (
                                <span key={sIdx} className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                                  aligned ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" : "bg-zinc-950 border-zinc-850 text-zinc-400"
                                }`}>
                                  {s} {aligned && "✓"}
                                </span>
                              );
                            })}
                          </div>
                        </div>

                        {/* 3. Experience progression */}
                        <div>
                          <span className="text-[9px] uppercase font-bold text-emerald-400 tracking-wider block mb-1.5">Role Chronology</span>
                          <div className="space-y-3 border-l border-zinc-800 pl-2">
                            {selectedCandidate.experienceHistory.map((history, hIdx) => (
                              <div key={hIdx} className="relative">
                                <span className="absolute -left-[11.5px] top-1.5 w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                <h5 className="font-bold text-white">{history.role}</h5>
                                <p className="text-[10px] text-zinc-500">{history.company} • {history.duration}</p>
                                <p className="text-[10px] text-zinc-400 mt-1">{history.description}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* TAB B: Tailored Questions */}
                    {activeAiTool === "questions" && (
                      <div className="space-y-3.5 text-xs">
                        <span className="text-[9px] uppercase font-bold text-emerald-400 tracking-wider block">Tailored Interview Questions</span>
                        {aiLoading.questions ? (
                          <div className="text-center py-6 text-zinc-500">Generating questions with Gemini AI...</div>
                        ) : (
                          <div className="space-y-3">
                            {interviewQuestions.map((q, qIdx) => (
                              <div key={qIdx} className="bg-zinc-950 p-3 border border-zinc-850 rounded-xl space-y-1">
                                <div className="flex justify-between items-center text-[9px] font-bold text-emerald-400">
                                  <span>QUESTION #{qIdx + 1}</span>
                                  <span className="uppercase">{q.type}</span>
                                </div>
                                <p className="text-white font-medium text-[11px] leading-relaxed">"{q.question}"</p>
                                <p className="text-[9px] text-zinc-500 italic mt-1 leading-normal">Rationale: {q.rationale}</p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {/* TAB C: Skill gap analysis */}
                    {activeAiTool === "skillgap" && (
                      <div className="space-y-3 text-xs">
                        <span className="text-[9px] uppercase font-bold text-emerald-400 tracking-wider block">AI Skill-Gap & Study Recommendations</span>
                        {aiLoading.skillgap ? (
                          <div className="text-center py-6 text-zinc-500 font-mono text-[10px]">Analyzing skill gaps with Gemini...</div>
                        ) : skillGapAnalysis ? (
                          <div className="space-y-3.5">
                            <div>
                              <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5">Identified Gaps</p>
                              <div className="flex flex-wrap gap-1.5">
                                {skillGapAnalysis.gaps.map((gap, idx) => (
                                  <span key={idx} className="bg-red-500/10 border border-red-500/20 text-red-400 font-mono text-[10px] px-2 py-0.5 rounded">
                                    {gap}
                                  </span>
                                ))}
                              </div>
                            </div>

                            <div className="space-y-2">
                              <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Recommended Training resources</p>
                              {skillGapAnalysis.recommendations.map((rec, rIdx) => (
                                <div key={rIdx} className="bg-zinc-950 p-3 border border-zinc-850 rounded-xl text-[11px]">
                                  <span className="text-[9px] font-bold text-emerald-400 block mb-0.5">Topic: {rec.skill}</span>
                                  <p className="text-white font-medium">{rec.resourceName}</p>
                                  <span className="text-[9px] text-zinc-500 uppercase mt-1 block">Type: {rec.type}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        ) : (
                          <div className="text-zinc-500 italic text-[11px]">Click standard tabs to reload gap matrices.</div>
                        )}
                      </div>
                    )}

                    {/* TAB D: Recruiter Outreach email draft */}
                    {activeAiTool === "email" && (
                      <div className="space-y-3 text-xs">
                        <span className="text-[9px] uppercase font-bold text-emerald-400 tracking-wider block">Recruiter Outreach Draft</span>
                        {aiLoading.email ? (
                          <div className="text-center py-6 text-zinc-500 font-mono text-[10px]">Composing outreach draft with Gemini...</div>
                        ) : outreachEmail ? (
                          <div className="bg-zinc-950 p-3.5 border border-zinc-850 rounded-xl space-y-3">
                            <div>
                              <span className="text-[8px] text-zinc-500 font-bold uppercase block">Subject Line</span>
                              <p className="text-white font-semibold text-[11px] mt-0.5 border-b border-zinc-850 pb-1.5">{outreachEmail.subject}</p>
                            </div>
                            <div>
                              <span className="text-[8px] text-zinc-500 font-bold uppercase block">Email Body</span>
                              <pre className="text-zinc-300 font-sans text-[10px] whitespace-pre-wrap leading-relaxed mt-1 select-all">{outreachEmail.body}</pre>
                            </div>
                          </div>
                        ) : (
                          <div className="text-zinc-500 italic text-[11px]">Outreach generation pending context.</div>
                        )}
                      </div>
                    )}

                    {/* Final Action Buttons */}
                    <div className="pt-2 border-t border-zinc-850 space-y-2.5">
                      <button
                        onClick={() => triggerContactProtocol(selectedCandidate.name)}
                        className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition"
                      >
                        Contact & Email Invite
                      </button>
                      <button
                        onClick={() => setShowScheduler(true)}
                        className="w-full py-2.5 bg-zinc-950 hover:bg-zinc-900 text-zinc-300 border border-zinc-800 text-xs font-semibold rounded-xl transition flex items-center justify-center gap-1.5"
                      >
                        <Calendar size={13} />
                        <span>Schedule Interview</span>
                      </button>

                      {scheduledInterviews[selectedCandidate.id] && (
                        <p className="text-[10px] bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-2 rounded text-center">
                          Interview Scheduled for: <strong className="font-mono">{scheduledInterviews[selectedCandidate.id]}</strong>
                        </p>
                      )}

                      {contactSuccessMsg && (
                        <p className="p-2.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] rounded text-center font-medium">
                          {contactSuccessMsg}
                        </p>
                      )}
                    </div>

                  </div>
                ) : (
                  <div className="bg-zinc-900/30 border border-zinc-850 rounded-2xl p-6 text-center text-zinc-500">
                    <AlertCircle className="mx-auto mb-2 text-zinc-600" />
                    <p className="text-xs">Select a candidate profile from the Leaderboard to view AI justifications and run interview prep operations.</p>
                  </div>
                )}
              </section>
            </div>
          )}

          {/* 2. CANDIDATE PORTAL HUB */}
          {activeRole === "candidate" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              {/* Left Column (Create profile / Resume parser upload) */}
              <section className="lg:col-span-5 flex flex-col gap-6">
                
                {/* Profile Edit / Signup card */}
                <div className="bg-zinc-900/30 border border-zinc-800/80 rounded-2xl p-6 flex flex-col gap-5">
                  <div>
                    <h3 className="text-sm font-semibold text-white flex items-center gap-1.5">
                      <UserPlus size={15} className="text-emerald-400" />
                      <span>Candidate Sign Up & Profile Hub</span>
                    </h3>
                    <p className="text-[11px] text-zinc-400 mt-0.5">Define your skills, experience, and availability to matching recruiter indexes.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Candidate Name</label>
                      <input
                        type="text"
                        value={candidateProfile.name}
                        onChange={(e) => setCandidateProfile({ ...candidateProfile, name: e.target.value })}
                        className="bg-zinc-950 border border-zinc-850 px-3.5 py-2 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Target Title</label>
                      <input
                        type="text"
                        value={candidateProfile.title}
                        onChange={(e) => setCandidateProfile({ ...candidateProfile, title: e.target.value })}
                        className="bg-zinc-950 border border-zinc-850 px-3.5 py-2 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="flex flex-col gap-1.5 col-span-2">
                      <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Location</label>
                      <input
                        type="text"
                        value={candidateProfile.location}
                        onChange={(e) => setCandidateProfile({ ...candidateProfile, location: e.target.value })}
                        className="bg-zinc-950 border border-zinc-850 px-3.5 py-2 rounded-xl text-xs text-white focus:outline-none"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Exp. Years</label>
                      <input
                        type="number"
                        value={candidateProfile.experienceYears}
                        onChange={(e) => setCandidateProfile({ ...candidateProfile, experienceYears: Number(e.target.value) })}
                        className="bg-zinc-950 border border-zinc-850 px-3.5 py-2 rounded-xl text-xs text-white focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Skills (Comma-separated)</label>
                    <input
                      type="text"
                      value={candidateProfile.skills}
                      onChange={(e) => setCandidateProfile({ ...candidateProfile, skills: e.target.value })}
                      className="bg-zinc-950 border border-zinc-850 px-3.5 py-2.5 rounded-xl text-xs text-white focus:outline-none font-mono"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Personal Bio Narrative</label>
                    <textarea
                      value={candidateProfile.bio}
                      onChange={(e) => setCandidateProfile({ ...candidateProfile, bio: e.target.value })}
                      className="bg-zinc-950 border border-zinc-850 px-3.5 py-2.5 rounded-xl text-xs text-white focus:outline-none h-16 resize-none"
                    />
                  </div>

                  <div className="flex justify-between items-center text-xs border-t border-zinc-850 pt-3">
                    <span className="text-zinc-400">Actively seeking roles</span>
                    <button
                      onClick={() => setCandidateProfile({ ...candidateProfile, activeJobSeeker: !candidateProfile.activeJobSeeker })}
                      className={`px-3 py-1 rounded text-[11px] font-bold border transition ${
                        candidateProfile.activeJobSeeker ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" : "bg-zinc-950 border-zinc-850 text-zinc-500"
                      }`}
                    >
                      {candidateProfile.activeJobSeeker ? "Active SEEKER ✓" : "PASSIVE SEEKER"}
                    </button>
                  </div>

                  {/* Register Candidate profile in memory */}
                  <button
                    onClick={async () => {
                      const skillsArr = candidateProfile.skills.split(",").map(s => s.trim()).filter(Boolean);
                      const payload: Candidate = {
                        id: "candidate-user",
                        name: candidateProfile.name,
                        title: candidateProfile.title,
                        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200",
                        location: candidateProfile.location,
                        experienceYears: candidateProfile.experienceYears,
                        education: candidateProfile.education,
                        skills: skillsArr,
                        bio: candidateProfile.bio,
                        experienceHistory: [
                          {
                            role: candidateProfile.title,
                            company: "Global Tech LLC",
                            duration: "2021 - Present",
                            description: "Primary engineering and microservice orchestration."
                          }
                        ],
                        behavioralSignals: {
                          codingScore: 94,
                          responsivenessScore: 98,
                          githubCommits: githubConnected ? 210 : 0,
                          openSourceContributor: githubConnected,
                          activeJobSeeker: candidateProfile.activeJobSeeker,
                          profileCompleteness: 100
                        }
                      };

                      const res = await fetch("/api/candidates", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(payload)
                      });
                      const data = await res.json();
                      if (data.success) {
                        setCandidates(prev => [data.candidate, ...prev.filter(c => c.id !== "candidate-user")]);
                        setSelectedCandidateId(data.candidate.id);
                        alert("Profile successfully indexed! You are now searchable on the recruiter leaderboard.");
                        handleRankCandidates();
                      }
                    }}
                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition cursor-pointer"
                  >
                    Index My Profile
                  </button>

                </div>

                {/* RESUME PARSER UPLOAD DRAG BOX (Touch Upload + Drag Drop requested by usability guidelines!) */}
                <div
                  onDragEnter={handleDrag}
                  onDragOver={handleDrag}
                  onDragLeave={handleDrag}
                  onDrop={handleDrop}
                  className={`bg-zinc-900/30 border border-dashed rounded-2xl p-6 text-center transition-all flex flex-col items-center justify-center gap-3 relative overflow-hidden ${
                    dragActive ? "border-emerald-400 bg-emerald-500/[0.02]" : "border-zinc-800 hover:border-zinc-700"
                  }`}
                >
                  <input
                    type="file"
                    id="resume-file-picker"
                    multiple={false}
                    accept=".pdf,.doc,.docx,.txt"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <UploadCloud size={36} className="text-zinc-500 group-hover:text-emerald-400 animate-bounce" style={{ animationDuration: "3s" }} />
                  <div>
                    <span className="font-bold text-xs text-white block">Upload Resume (Drag & Drop or Click)</span>
                    <p className="text-[10px] text-zinc-500 mt-1 leading-normal">Supports PDF, DOCX, TXT. Our AI parsing model will instantly map your skills and index your profile.</p>
                  </div>
                  <label
                    htmlFor="resume-file-picker"
                    className="px-4 py-2 bg-zinc-950 hover:bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-300 text-[11px] font-semibold rounded-xl cursor-pointer transition"
                  >
                    Select File
                  </label>

                  {/* Status displays */}
                  {resumeParsingStatus !== "idle" && (
                    <div className="absolute inset-0 bg-zinc-950/95 backdrop-blur-sm flex flex-col items-center justify-center p-4">
                      {resumeParsingStatus === "uploading" && (
                        <div className="flex flex-col items-center gap-2">
                          <span className="w-5 h-5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></span>
                          <span className="text-xs font-mono text-zinc-400">Uploading {parsedFileName}...</span>
                        </div>
                      )}
                      {resumeParsingStatus === "parsing" && (
                        <div className="flex flex-col items-center gap-2">
                          <span className="w-5 h-5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></span>
                          <span className="text-xs font-mono text-emerald-400">Sentence Transformers Mapping Gaps...</span>
                        </div>
                      )}
                      {resumeParsingStatus === "completed" && (
                        <div className="flex flex-col items-center gap-2">
                          <CheckCircle size={22} className="text-emerald-400 animate-pulse" />
                          <span className="text-xs font-mono text-white">Successfully Synced {parsedFileName}!</span>
                          <p className="text-[9px] text-zinc-500">Indexed profile created and ranked in FAISS index.</p>
                          <button
                            onClick={() => setResumeParsingStatus("idle")}
                            className="mt-2 text-[9px] bg-zinc-900 px-3 py-1 rounded text-zinc-300"
                          >
                            Upload Another
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Third-Party Integrations Block (GitHub, LinkedIn) */}
                <div className="bg-zinc-900/30 border border-zinc-800/80 rounded-2xl p-5 flex flex-col gap-3">
                  <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block">Social Integrations</span>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setGithubConnected(!githubConnected)}
                      className={`p-3 border rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition cursor-pointer ${
                        githubConnected ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" : "bg-zinc-950 border-zinc-850 text-zinc-400 hover:text-white"
                      }`}
                    >
                      <Github size={14} />
                      <span>{githubConnected ? "GitHub Synced" : "Connect GitHub"}</span>
                    </button>
                    <button
                      onClick={() => setLinkedinConnected(!linkedinConnected)}
                      className={`p-3 border rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition cursor-pointer ${
                        linkedinConnected ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" : "bg-zinc-950 border-zinc-850 text-zinc-400 hover:text-white"
                      }`}
                    >
                      <Linkedin size={14} />
                      <span>{linkedinConnected ? "LinkedIn Synced" : "Import LinkedIn"}</span>
                    </button>
                  </div>
                </div>
              </section>

              {/* Right Column (Candidate AI dashboard stats) */}
              <section className="lg:col-span-7 flex flex-col gap-6">
                
                {/* Visual Skills Radar / stats */}
                <div className="bg-zinc-900/30 border border-zinc-800/80 rounded-2xl p-6 flex flex-col gap-5">
                  <div className="flex justify-between items-center border-b border-zinc-850 pb-3">
                    <div>
                      <h3 className="text-sm font-semibold text-white">AI Candidate Scoring Dashboard</h3>
                      <p className="text-[11px] text-zinc-400">Dynamic capability evaluations based on indexed code bases and logs.</p>
                    </div>
                    <span className="text-xl font-mono font-bold text-emerald-400">95% Match Score</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                    
                    {/* Visual Radar chart */}
                    <div className="h-56 flex items-center justify-center bg-zinc-950/40 border border-zinc-850 rounded-xl p-2">
                      <ResponsiveContainer width="100%" height="100%">
                        <RadarChart cx="50%" cy="50%" outerRadius="75%" data={skillGapsChartData}>
                          <PolarGrid stroke="#27272a" />
                          <PolarAngleAxis dataKey="subject" stroke="#71717a" fontSize={9} />
                          <PolarRadiusAxis stroke="#27272a" fontSize={8} />
                          <Radar name="Candidate Spectrum" dataKey="A" stroke="#10b981" fill="#10b981" fillOpacity={0.25} />
                        </RadarChart>
                      </ResponsiveContainer>
                    </div>

                    {/* Numeric Bars */}
                    <div className="space-y-4 text-xs">
                      <div>
                        <div className="flex justify-between font-bold text-zinc-400 mb-1">
                          <span>Skill Match Alignment</span>
                          <span className="text-emerald-400">100%</span>
                        </div>
                        <div className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-500 rounded-full" style={{ width: "100%" }} />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between font-bold text-zinc-400 mb-1">
                          <span>Workplace Experience</span>
                          <span className="text-emerald-400">90%</span>
                        </div>
                        <div className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-500 rounded-full" style={{ width: "90%" }} />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between font-bold text-zinc-400 mb-1">
                          <span>Culture Alignment Fit</span>
                          <span className="text-emerald-400">80%</span>
                        </div>
                        <div className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-500 rounded-full" style={{ width: "80%" }} />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between font-bold text-zinc-400 mb-1">
                          <span>Collaboration & Communication</span>
                          <span className="text-emerald-400">70%</span>
                        </div>
                        <div className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-500 rounded-full" style={{ width: "70%" }} />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between font-bold text-zinc-400 mb-1">
                          <span>Continuous Learning Index</span>
                          <span className="text-emerald-400">100%</span>
                        </div>
                        <div className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-500 rounded-full" style={{ width: "100%" }} />
                        </div>
                      </div>
                    </div>

                  </div>
                </div>

                {/* Candidate Career Suggestions & Roadmap (Action requested!) */}
                <div className="bg-zinc-900/30 border border-zinc-800/80 rounded-2xl p-6 flex flex-col gap-5">
                  <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block">AI Career Suggestions & Roadmap</span>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-zinc-950 p-4 border border-zinc-850 rounded-xl space-y-2">
                      <span className="text-emerald-400 font-semibold text-xs flex items-center gap-1">🎯 Personalized Job Recommendation</span>
                      <p className="text-white text-[11px] font-medium leading-relaxed">Based on your stack, you align 95% with: "Distributed Systems & Infrastructure Architect".</p>
                      <span className="text-[10px] text-zinc-500 block">Recommended Action: Submit application to target Distributed template index.</span>
                    </div>

                    <div className="bg-zinc-950 p-4 border border-zinc-850 rounded-xl space-y-2">
                      <span className="text-amber-400 font-semibold text-xs flex items-center gap-1">⚠️ Key Gaps & Skill-Set Improvements</span>
                      <p className="text-white text-[11px] font-medium leading-relaxed">Consider upskilling in "Kubernetes Cluster Scaling" and "gRPC Client Definitions".</p>
                      <span className="text-[10px] text-zinc-500 block">Recommended course: Certified Kubernetes Administrator.</span>
                    </div>
                  </div>
                </div>

              </section>
            </div>
          )}

          {/* 3. AI DATA PIPELINE VISUALIZER (Flowchart requested!) */}
          {activeRole === "pipeline" && (
            <div className="bg-zinc-900/30 border border-zinc-800/80 rounded-2xl p-6 flex flex-col gap-6 animate-fade-in">
              <div>
                <h3 className="text-base font-semibold text-white flex items-center gap-2">
                  <Cpu size={16} className="text-emerald-400 animate-spin" style={{ animationDuration: "12s" }} />
                  <span>AI Candidate Discovery pipeline Diagram</span>
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Click on any pipeline node block below to inspect raw inputs, processes, and structural data transformations.
                </p>
              </div>

              {/* FLOWCHART STAGE DIAGRAM (Pulsating paths, hover highlights!) */}
              <div className="bg-zinc-950 rounded-2xl p-6 border border-zinc-850 flex flex-col items-center gap-8 relative overflow-hidden min-h-[420px]">
                
                {/* Horizontal Flow Wires block */}
                <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-4 gap-6 relative z-10">
                  
                  {/* Node 1 */}
                  <div
                    onClick={() => setSelectedPipelineNode("job_input")}
                    className={`p-4 border rounded-xl text-center cursor-pointer transition ${
                      selectedPipelineNode === "job_input" ? "bg-emerald-500/10 border-emerald-400 shadow" : "bg-zinc-900 border-zinc-800"
                    }`}
                  >
                    <span className="text-[9px] uppercase font-bold text-zinc-500 font-mono block mb-1">ST-1</span>
                    <h5 className="text-xs font-semibold text-white">Employer Portal & JD</h5>
                  </div>

                  {/* Node 2 */}
                  <div
                    onClick={() => setSelectedPipelineNode("ai_understanding")}
                    className={`p-4 border rounded-xl text-center cursor-pointer transition ${
                      selectedPipelineNode === "ai_understanding" ? "bg-emerald-500/10 border-emerald-400 shadow" : "bg-zinc-900 border-zinc-800"
                    }`}
                  >
                    <span className="text-[9px] uppercase font-bold text-zinc-500 font-mono block mb-1">ST-2</span>
                    <h5 className="text-xs font-semibold text-white">AI Job Understanding</h5>
                  </div>

                  {/* Node 3 */}
                  <div
                    onClick={() => setSelectedPipelineNode("candidate_db")}
                    className={`p-4 border rounded-xl text-center cursor-pointer transition ${
                      selectedPipelineNode === "candidate_db" ? "bg-emerald-500/10 border-emerald-400 shadow" : "bg-zinc-900 border-zinc-800"
                    }`}
                  >
                    <span className="text-[9px] uppercase font-bold text-zinc-500 font-mono block mb-1">ST-3</span>
                    <h5 className="text-xs font-semibold text-white">Candidate DB Ingestion</h5>
                  </div>

                  {/* Node 4 */}
                  <div
                    onClick={() => setSelectedPipelineNode("embedding_engine")}
                    className={`p-4 border rounded-xl text-center cursor-pointer transition ${
                      selectedPipelineNode === "embedding_engine" ? "bg-emerald-500/10 border-emerald-400 shadow" : "bg-zinc-900 border-zinc-800"
                    }`}
                  >
                    <span className="text-[9px] uppercase font-bold text-zinc-500 font-mono block mb-1">ST-4</span>
                    <h5 className="text-xs font-semibold text-white">Embedding Generator</h5>
                  </div>

                  {/* Connection Arrows Row 1 */}
                  <div className="hidden md:block absolute top-1/2 left-[23%] w-[5%] border-b border-dashed border-emerald-500/40 animate-pulse" />
                  <div className="hidden md:block absolute top-1/2 left-[48%] w-[5%] border-b border-dashed border-emerald-500/40 animate-pulse" />
                  <div className="hidden md:block absolute top-1/2 left-[73%] w-[5%] border-b border-dashed border-emerald-500/40 animate-pulse" />
                </div>

                {/* Flow Wire Divider line */}
                <div className="hidden md:block w-[2px] h-8 border-r border-dashed border-emerald-500/30 my-2 animate-pulse" />

                {/* Row 2 Flow Nodes */}
                <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-4 gap-6 relative z-10">
                  
                  {/* Node 5 */}
                  <div
                    onClick={() => setSelectedPipelineNode("vector_faiss")}
                    className={`p-4 border rounded-xl text-center cursor-pointer transition ${
                      selectedPipelineNode === "vector_faiss" ? "bg-emerald-500/10 border-emerald-400 shadow" : "bg-zinc-900 border-zinc-800"
                    }`}
                  >
                    <span className="text-[9px] uppercase font-bold text-zinc-500 font-mono block mb-1">ST-5</span>
                    <h5 className="text-xs font-semibold text-white">Vector DB (FAISS Index)</h5>
                  </div>

                  {/* Node 6 */}
                  <div
                    onClick={() => setSelectedPipelineNode("semantic_search")}
                    className={`p-4 border rounded-xl text-center cursor-pointer transition ${
                      selectedPipelineNode === "semantic_search" ? "bg-emerald-500/10 border-emerald-400 shadow" : "bg-zinc-900 border-zinc-800"
                    }`}
                  >
                    <span className="text-[9px] uppercase font-bold text-zinc-500 font-mono block mb-1">ST-6</span>
                    <h5 className="text-xs font-semibold text-white">Similarity Search</h5>
                  </div>

                  {/* Node 7 */}
                  <div
                    onClick={() => setSelectedPipelineNode("ranking_engine")}
                    className={`p-4 border rounded-xl text-center cursor-pointer transition ${
                      selectedPipelineNode === "ranking_engine" ? "bg-emerald-500/10 border-emerald-400 shadow" : "bg-zinc-900 border-zinc-800"
                    }`}
                  >
                    <span className="text-[9px] uppercase font-bold text-zinc-500 font-mono block mb-1">ST-7</span>
                    <h5 className="text-xs font-semibold text-white">Ranking Fusion Engine</h5>
                  </div>

                  {/* Node 8 */}
                  <div
                    onClick={() => setSelectedPipelineNode("explainable_ai")}
                    className={`p-4 border rounded-xl text-center cursor-pointer transition ${
                      selectedPipelineNode === "explainable_ai" ? "bg-emerald-500/10 border-emerald-400 shadow" : "bg-zinc-900 border-zinc-800"
                    }`}
                  >
                    <span className="text-[9px] uppercase font-bold text-zinc-500 font-mono block mb-1">ST-8</span>
                    <h5 className="text-xs font-semibold text-white">Explainable AI logs</h5>
                  </div>

                  {/* Connection Arrows Row 2 */}
                  <div className="hidden md:block absolute top-1/2 left-[23%] w-[5%] border-b border-dashed border-emerald-500/40 animate-pulse" />
                  <div className="hidden md:block absolute top-1/2 left-[48%] w-[5%] border-b border-dashed border-emerald-500/40 animate-pulse" />
                  <div className="hidden md:block absolute top-1/2 left-[73%] w-[5%] border-b border-dashed border-emerald-500/40 animate-pulse" />
                </div>

                {/* Node details display */}
                {selectedPipelineNode && pipelineNodeDescriptions[selectedPipelineNode] && (
                  <div className="w-full max-w-xl mt-6 bg-zinc-900 p-5 border border-zinc-800 rounded-xl space-y-3.5 animate-fade-in relative z-20">
                    <div className="flex justify-between items-center border-b border-zinc-800 pb-2">
                      <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-widest">{pipelineNodeDescriptions[selectedPipelineNode].title}</h4>
                      <span className="text-[9px] bg-zinc-950 border border-zinc-800 text-zinc-400 px-2 py-0.5 rounded font-mono font-bold uppercase">Pipeline Step</span>
                    </div>
                    <p className="text-xs text-zinc-300 leading-relaxed font-medium">{pipelineNodeDescriptions[selectedPipelineNode].desc}</p>
                    <div className="grid grid-cols-2 gap-4 text-[10px] font-mono pt-1">
                      <div className="bg-zinc-950 p-2.5 rounded-lg border border-zinc-850">
                        <span className="text-zinc-500 block mb-0.5">INPUT DATA</span>
                        <span className="text-zinc-300 font-semibold">{pipelineNodeDescriptions[selectedPipelineNode].input}</span>
                      </div>
                      <div className="bg-zinc-950 p-2.5 rounded-lg border border-zinc-850">
                        <span className="text-zinc-500 block mb-0.5">OUTPUT DATA</span>
                        <span className="text-zinc-300 font-semibold">{pipelineNodeDescriptions[selectedPipelineNode].output}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* AI RECUIER ASSISTANT CHAT BOT PANEL */}
          <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
            {chatOpen ? (
              <div className="w-80 h-[400px] bg-zinc-950 border border-zinc-800 rounded-2xl flex flex-col shadow-2xl overflow-hidden animate-fade-in">
                {/* Chat header */}
                <div className="bg-zinc-900 px-4 py-3 border-b border-zinc-800 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-xs font-bold text-white">AI Recruiter Assistant</span>
                  </div>
                  <button onClick={() => setChatOpen(false)} className="text-zinc-400 hover:text-white cursor-pointer">
                    <X size={15} />
                  </button>
                </div>

                {/* Message logs */}
                <div className="flex-1 p-3 overflow-y-auto space-y-3.5 flex flex-col">
                  {chatMessages.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed ${
                        msg.sender === "user"
                          ? "bg-emerald-600 text-white self-end rounded-tr-none font-medium"
                          : "bg-zinc-900 text-zinc-300 self-start rounded-tl-none border border-zinc-850"
                      }`}
                    >
                      {msg.text}
                    </div>
                  ))}
                  {chatLoading && (
                    <div className="bg-zinc-900 text-zinc-500 self-start rounded-tl-none border border-zinc-850 max-w-[85%] rounded-2xl p-3 text-xs italic animate-pulse">
                      Analyzing talent indexes...
                    </div>
                  )}
                </div>

                {/* Input form */}
                <form onSubmit={handleChatSubmit} className="p-2 border-t border-zinc-850 bg-zinc-900/40 flex gap-1.5">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Ask assistant to discover..."
                    className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                  <button
                    type="submit"
                    className="p-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl transition cursor-pointer"
                  >
                    <Send size={13} />
                  </button>
                </form>
              </div>
            ) : (
              <button
                onClick={() => setChatOpen(true)}
                className="p-3.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full shadow-2xl transition-all hover:scale-105 flex items-center justify-center cursor-pointer border border-emerald-500/20"
                title="Open AI Recruiter Assistant Chat"
              >
                <MessageSquare size={18} />
              </button>
            )}
          </div>

        </main>
      ) : activeTab === "python-blueprint" ? (
        <div className="max-w-5xl mx-auto px-6 py-8 w-full">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-white mb-1 flex items-center gap-2">
              <Code className="text-emerald-400" />
              Python Core AI Matcher Blueprint
            </h2>
            <p className="text-xs text-zinc-400">
              The reference mathematics and FAISS cosine similarity scoring used to compute deep semantic rankings.
            </p>
          </div>
          <PythonEngineBlueprint />
        </div>
      ) : (
        <HackathonWorkspace />
      )}

      {/* Add Candidate Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl w-full max-w-xl overflow-hidden animate-fade-in shadow-2xl">
            <div className="bg-zinc-900 px-6 py-4 border-b border-zinc-850 flex justify-between items-center">
              <h3 className="font-semibold text-sm text-white flex items-center gap-2">
                <UserPlus size={16} className="text-emerald-400" />
                <span>Add Candidate to Index</span>
              </h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-zinc-400 hover:text-white transition cursor-pointer">
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleAddCandidate} className="p-6 space-y-4 max-h-[500px] overflow-y-auto text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Candidate Name</label>
                  <input
                    type="text"
                    required
                    value={newCandidate.name}
                    onChange={(e) => setNewCandidate({ ...newCandidate, name: e.target.value })}
                    className="bg-zinc-900 border border-zinc-800 rounded-xl p-2.5 text-white focus:outline-none"
                    placeholder="e.g. Rachel Foster"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Professional Title</label>
                  <input
                    type="text"
                    required
                    value={newCandidate.title}
                    onChange={(e) => setNewCandidate({ ...newCandidate, title: e.target.value })}
                    className="bg-zinc-900 border border-zinc-800 rounded-xl p-2.5 text-white focus:outline-none"
                    placeholder="e.g. Senior Backend Architect"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Location</label>
                  <input
                    type="text"
                    required
                    value={newCandidate.location}
                    onChange={(e) => setNewCandidate({ ...newCandidate, location: e.target.value })}
                    className="bg-zinc-900 border border-zinc-800 rounded-xl p-2.5 text-white focus:outline-none"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Years of Experience</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={newCandidate.experienceYears}
                    onChange={(e) => setNewCandidate({ ...newCandidate, experienceYears: Number(e.target.value) })}
                    className="bg-zinc-900 border border-zinc-800 rounded-xl p-2.5 text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Skills (Comma-separated)</label>
                <input
                  type="text"
                  required
                  value={newCandidate.skillsString}
                  onChange={(e) => setNewCandidate({ ...newCandidate, skillsString: e.target.value })}
                  className="bg-zinc-900 border border-zinc-800 rounded-xl p-2.5 text-white focus:outline-none font-mono"
                  placeholder="e.g. Python, gRPC, Docker"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Candidate Bio</label>
                <textarea
                  value={newCandidate.bio}
                  onChange={(e) => setNewCandidate({ ...newCandidate, bio: e.target.value })}
                  className="bg-zinc-900 border border-zinc-800 rounded-xl p-2.5 text-white focus:outline-none h-16 resize-none"
                />
              </div>

              <div className="border-t border-zinc-850 pt-4 space-y-4">
                <h4 className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Behavioral Activity Metrics</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-zinc-500">Coding Score (0-100)</label>
                    <input
                      type="number"
                      value={newCandidate.codingScore}
                      onChange={(e) => setNewCandidate({ ...newCandidate, codingScore: Number(e.target.value) })}
                      className="bg-zinc-900 border border-zinc-850 rounded-lg p-2 text-white"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-zinc-500">Commits volume (90 Days)</label>
                    <input
                      type="number"
                      value={newCandidate.githubCommits}
                      onChange={(e) => setNewCandidate({ ...newCandidate, githubCommits: Number(e.target.value) })}
                      className="bg-zinc-900 border border-zinc-850 rounded-lg p-2 text-white"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-zinc-850 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 bg-zinc-900 hover:bg-zinc-850 text-zinc-400 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold"
                >
                  Create Index Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Scheduler Modal */}
      {showScheduler && selectedCandidate && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-zinc-950 border border-zinc-850 rounded-2xl w-full max-w-sm overflow-hidden animate-fade-in shadow-2xl">
            <div className="bg-zinc-900 px-5 py-3.5 border-b border-zinc-850 flex justify-between items-center">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <Calendar size={14} className="text-emerald-400" />
                <span>Schedule Interview</span>
              </span>
              <button onClick={() => setShowScheduler(false)} className="text-zinc-500 hover:text-white">
                <X size={15} />
              </button>
            </div>
            <div className="p-5 space-y-4 text-xs">
              <p className="text-zinc-400">Select target interview parameters for <strong>{selectedCandidate.name}</strong>.</p>
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-zinc-500 uppercase">Interview Date & Time</label>
                <input
                  type="datetime-local"
                  value={interviewDate}
                  onChange={(e) => setInterviewDate(e.target.value)}
                  className="bg-zinc-900 border border-zinc-800 rounded-xl p-2.5 text-white text-xs focus:outline-none"
                />
              </div>
              <button
                onClick={() => handleScheduleInterview(selectedCandidate.id)}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition"
              >
                Confirm Booking
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
