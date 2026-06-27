import React, { useState } from "react";
import { Copy, Check, Terminal, Play, Cpu, AlertCircle } from "lucide-react";

export function PythonEngineBlueprint() {
  const [copied, setCopied] = useState(false);

  const pythonCode = `import math
from typing import List, Dict, Any

class IntelligentCandidateDiscoveryEngine:
    def __init__(self, semantic_weight: float = 0.60, signals_weight: float = 0.40):
        """
        Initializes the ranking engine.
        :param semantic_weight: Importance of semantic contextual fit (0.0 to 1.0)
        :param signals_weight: Importance of interactive behavioral signals (0.0 to 1.0)
        """
        self.semantic_weight = semantic_weight
        self.signals_weight = signals_weight

    def calculate_signals_score(self, signals: Dict[str, Any]) -> float:
        """
        Processes active engineering performance & behavior indicators into a single score.
        """
        # Defined Weights
        CODING_WEIGHT = 0.40
        RESPONSIVENESS_WEIGHT = 0.20
        GITHUB_WEIGHT = 0.15
        OPEN_SOURCE_WEIGHT = 0.10
        JOB_SEEKER_WEIGHT = 0.15

        coding_term = signals.get("codingScore", 80)
        responsiveness_term = signals.get("responsivenessScore", 80)
        
        # Logarithmic/Linear mapping for active GitHub commits (cap at 300 commits as 100 points)
        github_term = min(100.0, (signals.get("githubCommits", 50) / 300.0) * 100.0)
        
        open_source_term = 100.0 if signals.get("openSourceContributor", False) else 0.0
        job_seeker_term = 100.0 if signals.get("activeJobSeeker", False) else 50.0

        # Compute weighted average
        weighted_signals_score = (
            coding_term * CODING_WEIGHT +
            responsiveness_term * RESPONSIVENESS_WEIGHT +
            github_term * GITHUB_WEIGHT +
            open_source_term * OPEN_SOURCE_WEIGHT +
            job_seeker_term * JOB_SEEKER_WEIGHT
        )
        return round(weighted_signals_score, 1)

    def compute_semantic_match_score(self, candidate: Dict[str, Any], job_requirements: List[str]) -> float:
        """
        Calculates basic semantic alignment in local environments when large model is offline.
        Uses overlap coefficients and skill-match weights.
        """
        candidate_skills = [s.lower() for s in candidate.get("skills", [])]
        required_skills = [req.lower() for req in job_requirements]
        
        if not required_skills:
            return 70.0 # Standard fallback
            
        matches = sum(1 for skill in required_skills if skill in candidate_skills)
        overlap_ratio = matches / len(required_skills)
        
        # Experience fit boost (diminishing returns log scale)
        experience_years = candidate.get("experienceYears", 2)
        exp_multiplier = min(1.2, 0.5 + math.log(experience_years + 1) * 0.3)
        
        raw_score = (overlap_ratio * 100.0) * exp_multiplier
        return round(min(100.0, raw_score), 1)

    def rank_candidates(self, candidates: List[Dict[str, Any]], job_requirements: List[str], custom_semantic_scores: Dict[str, float] = None) -> List[Dict[str, Any]]:
        """
        Ranks all candidates by combining Semantic Match score and Behavioral Signals score.
        """
        ranked_list = []
        for cand in candidates:
            cand_id = cand.get("id")
            
            # Use high-fidelity AI semantic score if provided (e.g. from Gemini API), else fallback to skill-matching
            if custom_semantic_scores and cand_id in custom_semantic_scores:
                semantic_score = custom_semantic_scores[cand_id]
            else:
                semantic_score = self.compute_semantic_match_score(cand, job_requirements)
                
            signals_score = self.calculate_signals_score(cand.get("behavioralSignals", {}))
            
            # Combine scores based on customizable weights
            total_score = round(
                (semantic_score * self.semantic_weight) + 
                (signals_score * self.signals_weight), 
                1
            )
            
            ranked_list.append({
                "id": cand_id,
                "name": cand.get("name"),
                "title": cand.get("title"),
                "semanticScore": semantic_score,
                "signalsScore": signals_score,
                "totalScore": total_score,
                "activeSeeker": cand.get("behavioralSignals", {}).get("activeJobSeeker", False)
            })
            
        # Sort by total score descending
        return sorted(ranked_list, key=lambda x: x["totalScore"], reverse=True)


# =====================================================================
# EXAMPLE RUN
# =====================================================================
if __name__ == "__main__":
    candidates_pool = [
        {
            "id": "cand-1",
            "name": "Aarav Mehta",
            "title": "Senior Machine Learning Engineer",
            "skills": ["Python", "PyTorch", "TensorFlow", "Scikit-Learn", "Docker"],
            "experienceYears": 8,
            "behavioralSignals": {
                "codingScore": 96,
                "responsivenessScore": 92,
                "githubCommits": 284,
                "openSourceContributor": True,
                "activeJobSeeker": True
            }
        },
        {
            "id": "cand-2",
            "name": "Chloe Dubois",
            "title": "Senior Full-Stack Engineer",
            "skills": ["React", "TypeScript", "Node.js", "Python", "AWS"],
            "experienceYears": 7,
            "behavioralSignals": {
                "codingScore": 89,
                "responsivenessScore": 85,
                "githubCommits": 142,
                "openSourceContributor": False,
                "activeJobSeeker": False
            }
        }
    ]

    job_skills_required = ["Python", "PyTorch", "Scikit-Learn", "Docker"]
    
    # Instantiate engine with 60% Semantic Match and 40% Signal priority
    engine = IntelligentCandidateDiscoveryEngine(semantic_weight=0.60, signals_weight=0.40)
    
    results = engine.rank_candidates(candidates_pool, job_skills_required)
    
    print("--- INTELLIGENT DISCOVERY LEADERBOARD ---")
    for rank, res in enumerate(results, 1):
        print(f"Rank {rank}: {res['name']} ({res['title']})")
        print(f"  └─ Total Fit: {res['totalScore']}% | Semantic Fit: {res['semanticScore']}% | Behavioral Signals: {res['signalsScore']}%")
        print()
`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(pythonCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div id="python-blueprint-container" className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-2xl animate-fade-in">
      <div className="bg-slate-950 px-5 py-4 border-b border-slate-800 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-yellow-500/10 flex items-center justify-center text-yellow-500">
            <Terminal size={18} />
          </div>
          <div>
            <h3 className="font-mono text-sm font-semibold text-slate-100 flex items-center gap-2">
              candidate_discovery_engine.py
              <span className="text-[10px] bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 px-1.5 py-0.5 rounded font-mono">Python 3.10+</span>
            </h3>
            <p className="text-xs text-slate-400">Algorithmic core of the recruitment engine design</p>
          </div>
        </div>
        <button
          onClick={copyToClipboard}
          className="flex items-center gap-2 text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 transition px-3 py-1.5 rounded-lg border border-slate-700 cursor-pointer"
        >
          {copied ? (
            <>
              <Check size={14} className="text-green-400" />
              <span className="text-green-400 font-medium">Copied!</span>
            </>
          ) : (
            <>
              <Copy size={14} />
              <span>Copy Code</span>
            </>
          )}
        </button>
      </div>

      <div className="p-4 bg-slate-900 flex flex-col gap-4">
        {/* Warning Alert banner */}
        <div className="bg-blue-950/40 border border-blue-900/30 rounded-lg p-3.5 flex gap-3 text-xs text-blue-200">
          <Cpu className="text-blue-400 shrink-0" size={18} />
          <div>
            <span className="font-semibold text-blue-300">Workable Production Blueprint:</span> This self-contained module can be instantly loaded into your microservices architecture. It integrates with any LLM system (like Gemini or Vertex AI) by passing the parsed semantic scores directly into the `custom_semantic_scores` mapping.
          </div>
        </div>

        {/* Code Blocks */}
        <div className="relative max-h-[460px] overflow-y-auto rounded-lg border border-slate-800/80 bg-slate-950 scrollbar-thin scrollbar-thumb-slate-800">
          <pre className="p-4 text-xs font-mono text-slate-300 leading-relaxed overflow-x-auto select-text">
            <code>{pythonCode}</code>
          </pre>
        </div>
      </div>
    </div>
  );
}
