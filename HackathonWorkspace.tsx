import React, { useState } from "react";
import {
  Download,
  CheckCircle,
  AlertTriangle,
  Code,
  Terminal,
  Search,
  BookOpen,
  Copy,
  Check,
  Upload,
  AlertCircle,
  Cpu,
  RefreshCw,
  Eye,
  X
} from "lucide-react";

interface SubmissionCandidate {
  id: string;
  rank: number;
  score: number;
  reasoning: string;
};

// Exactly 100 entries mapping to submission.csv
const submissionCandidates: SubmissionCandidate[] = [
  { id: "CAND_0004989", rank: 1, score: 0.9920, reasoning: "HR Manager with 6.1 yrs; 9 AI core skills; response rate 0.76." },
  { id: "CAND_0001195", rank: 2, score: 0.9840, reasoning: "HR Manager with 8.7 yrs; 9 AI core skills; response rate 0.20." },
  { id: "CAND_0003114", rank: 3, score: 0.9760, reasoning: "ML Engineer with 6.4 yrs; 4 AI core skills; response rate 0.88." },
  { id: "CAND_0000339", rank: 4, score: 0.9680, reasoning: "Content Writer with 8.3 yrs; 8 AI core skills; response rate 0.72." },
  { id: "CAND_0001082", rank: 5, score: 0.9600, reasoning: "HR Manager with 5.0 yrs; 8 AI core skills; response rate 0.62." },
  { id: "CAND_0001218", rank: 6, score: 0.9520, reasoning: "Graphic Designer with 10.4 yrs; 9 AI core skills; response rate 0.56." },
  { id: "CAND_0004558", rank: 7, score: 0.9440, reasoning: "Business Analyst with 5.1 yrs; 8 AI core skills; response rate 0.54." },
  { id: "CAND_0001753", rank: 8, score: 0.9360, reasoning: "Content Writer with 8.3 yrs; 8 AI core skills; response rate 0.53." },
  { id: "CAND_0001503", rank: 9, score: 0.9280, reasoning: "Marketing Manager with 8.0 yrs; 8 AI core skills; response rate 0.32." },
  { id: "CAND_0004548", rank: 10, score: 0.9200, reasoning: "HR Manager with 7.3 yrs; 8 AI core skills; response rate 0.30." },
  { id: "CAND_0002164", rank: 11, score: 0.9120, reasoning: "Marketing Manager with 13.2 yrs; 9 AI core skills; response rate 0.24." },
  { id: "CAND_0001154", rank: 12, score: 0.9040, reasoning: "Mechanical Engineer with 6.9 yrs; 8 AI core skills; response rate 0.18." },
  { id: "CAND_0002622", rank: 13, score: 0.8960, reasoning: "Accountant with 14.2 yrs; 9 AI core skills; response rate 0.18." },
  { id: "CAND_0000002", rank: 14, score: 0.8880, reasoning: "Civil Engineer with 8.0 yrs; 8 AI core skills; response rate 0.15." },
  { id: "CAND_0000718", rank: 15, score: 0.8800, reasoning: "Accountant with 8.2 yrs; 8 AI core skills; response rate 0.15." },
  { id: "CAND_0004224", rank: 16, score: 0.8720, reasoning: "Graphic Designer with 5.0 yrs; 8 AI core skills; response rate 0.11." },
  { id: "CAND_0000239", rank: 17, score: 0.8640, reasoning: "Project Manager with 5.0 yrs; 8 AI core skills; response rate 0.10." },
  { id: "CAND_0001771", rank: 18, score: 0.8560, reasoning: "Accountant with 7.4 yrs; 8 AI core skills; response rate 0.06." },
  { id: "CAND_0002782", rank: 19, score: 0.8480, reasoning: "Sales Executive with 7.8 yrs; 8 AI core skills; response rate 0.06." },
  { id: "CAND_0003693", rank: 20, score: 0.8400, reasoning: "Sales Executive with 7.2 yrs; 7 AI core skills; response rate 0.77." },
  { id: "CAND_0004937", rank: 21, score: 0.8320, reasoning: "Operations Manager with 13.5 yrs; 8 AI core skills; response rate 0.77." },
  { id: "CAND_0001397", rank: 22, score: 0.8240, reasoning: "Business Analyst with 11.3 yrs; 8 AI core skills; response rate 0.76." },
  { id: "CAND_0001381", rank: 23, score: 0.8160, reasoning: "Accountant with 14.1 yrs; 8 AI core skills; response rate 0.75." },
  { id: "CAND_0004201", rank: 24, score: 0.8080, reasoning: "Mechanical Engineer with 13.7 yrs; 8 AI core skills; response rate 0.75." },
  { id: "CAND_0002019", rank: 25, score: 0.8000, reasoning: "Marketing Manager with 2.0 yrs; 8 AI core skills; response rate 0.73." },
  { id: "CAND_0004645", rank: 26, score: 0.7920, reasoning: "Project Manager with 10.2 yrs; 8 AI core skills; response rate 0.71." },
  { id: "CAND_0004824", rank: 27, score: 0.7840, reasoning: "AI Engineer with 6.1 yrs; 3 AI core skills; response rate 0.71." },
  { id: "CAND_0002592", rank: 28, score: 0.7760, reasoning: "Business Analyst with 11.4 yrs; 8 AI core skills; response rate 0.65." },
  { id: "CAND_0001586", rank: 29, score: 0.7680, reasoning: "Operations Manager with 6.5 yrs; 7 AI core skills; response rate 0.60." },
  { id: "CAND_0001653", rank: 30, score: 0.7600, reasoning: "Mechanical Engineer with 4.5 yrs; 8 AI core skills; response rate 0.59." },
  { id: "CAND_0000007", rank: 31, score: 0.7520, reasoning: "AI Engineer with 6.6 yrs; 3 AI core skills; response rate 0.57." },
  { id: "CAND_0001795", rank: 32, score: 0.7440, reasoning: "Mechanical Engineer with 4.4 yrs; 8 AI core skills; response rate 0.57." },
  { id: "CAND_0003531", rank: 33, score: 0.7360, reasoning: "Operations Manager with 3.2 yrs; 8 AI core skills; response rate 0.55." },
  { id: "CAND_0002989", rank: 34, score: 0.7280, reasoning: "Graphic Designer with 6.0 yrs; 7 AI core skills; response rate 0.54." },
  { id: "CAND_0000581", rank: 35, score: 0.7200, reasoning: "HR Manager with 8.5 yrs; 7 AI core skills; response rate 0.53." },
  { id: "CAND_0004680", rank: 36, score: 0.7120, reasoning: "Mechanical Engineer with 8.0 yrs; 7 AI core skills; response rate 0.53." },
  { id: "CAND_0001257", rank: 37, score: 0.7040, reasoning: "Mechanical Engineer with 6.9 yrs; 7 AI core skills; response rate 0.52." },
  { id: "CAND_0002018", rank: 38, score: 0.6960, reasoning: "Civil Engineer with 6.4 yrs; 7 AI core skills; response rate 0.52." },
  { id: "CAND_0004952", rank: 39, score: 0.6880, reasoning: "Project Manager with 6.5 yrs; 7 AI core skills; response rate 0.52." },
  { id: "CAND_0001378", rank: 40, score: 0.6800, reasoning: "Project Manager with 5.6 yrs; 7 AI core skills; response rate 0.51." },
  { id: "CAND_0000164", rank: 41, score: 0.6720, reasoning: "Business Analyst with 3.0 yrs; 8 AI core skills; response rate 0.50." },
  { id: "CAND_0003406", rank: 42, score: 0.6640, reasoning: "Graphic Designer with 6.0 yrs; 7 AI core skills; response rate 0.44." },
  { id: "CAND_0000557", rank: 43, score: 0.6560, reasoning: "Civil Engineer with 14.3 yrs; 8 AI core skills; response rate 0.43." },
  { id: "CAND_0003107", rank: 44, score: 0.6480, reasoning: "Customer Support with 6.6 yrs; 7 AI core skills; response rate 0.41." },
  { id: "CAND_0000168", rank: 45, score: 0.6400, reasoning: "Marketing Manager with 6.3 yrs; 7 AI core skills; response rate 0.39." },
  { id: "CAND_0000268", rank: 46, score: 0.6320, reasoning: "Accountant with 3.7 yrs; 8 AI core skills; response rate 0.39." },
  { id: "CAND_0000791", rank: 47, score: 0.6240, reasoning: "Customer Support with 11.5 yrs; 8 AI core skills; response rate 0.39." },
  { id: "CAND_0003050", rank: 48, score: 0.6160, reasoning: "ML Engineer with 6.0 yrs; 3 AI core skills; response rate 0.38." },
  { id: "CAND_0003241", rank: 49, score: 0.6080, reasoning: "ML Engineer with 3.6 yrs; 4 AI core skills; response rate 0.36." },
  { id: "CAND_0000776", rank: 50, score: 0.6000, reasoning: "Operations Manager with 14.2 yrs; 8 AI core skills; response rate 0.35." },
  { id: "CAND_0002234", rank: 51, score: 0.5920, reasoning: "Content Writer with 9.9 yrs; 8 AI core skills; response rate 0.35." },
  { id: "CAND_0004217", rank: 52, score: 0.5840, reasoning: "Accountant with 1.8 yrs; 8 AI core skills; response rate 0.33." },
  { id: "CAND_0003702", rank: 53, score: 0.5760, reasoning: "Graphic Designer with 6.9 yrs; 7 AI core skills; response rate 0.26." },
  { id: "CAND_0004154", rank: 54, score: 0.5680, reasoning: "HR Manager with 6.2 yrs; 7 AI core skills; response rate 0.26." },
  { id: "CAND_0000542", rank: 55, score: 0.5600, reasoning: "Mechanical Engineer with 8.5 yrs; 7 AI core skills; response rate 0.25." },
  { id: "CAND_0002466", rank: 56, score: 0.5520, reasoning: "Marketing Manager with 14.6 yrs; 8 AI core skills; response rate 0.25." },
  { id: "CAND_0002974", rank: 57, score: 0.5440, reasoning: "Operations Manager with 13.4 yrs; 8 AI core skills; response rate 0.25." },
  { id: "CAND_0000450", rank: 58, score: 0.5360, reasoning: "Operations Manager with 7.7 yrs; 7 AI core skills; response rate 0.24." },
  { id: "CAND_0002438", rank: 59, score: 0.5280, reasoning: "Accountant with 1.0 yrs; 8 AI core skills; response rate 0.24." },
  { id: "CAND_0000217", rank: 60, score: 0.5200, reasoning: "Sales Executive with 11.4 yrs; 8 AI core skills; response rate 0.23." },
  { id: "CAND_0001424", rank: 61, score: 0.5120, reasoning: "Content Writer with 13.6 yrs; 8 AI core skills; response rate 0.22." },
  { id: "CAND_0004711", rank: 62, score: 0.5040, reasoning: "Content Writer with 14.2 yrs; 8 AI core skills; response rate 0.22." },
  { id: "CAND_0001294", rank: 63, score: 0.4960, reasoning: "HR Manager with 3.0 yrs; 8 AI core skills; response rate 0.21." },
  { id: "CAND_0001724", rank: 64, score: 0.4880, reasoning: "Mechanical Engineer with 7.4 yrs; 7 AI core skills; response rate 0.20." },
  { id: "CAND_0002794", rank: 65, score: 0.4800, reasoning: "Project Manager with 13.9 yrs; 8 AI core skills; response rate 0.20." },
  { id: "CAND_0001292", rank: 66, score: 0.4720, reasoning: "Customer Support with 7.6 yrs; 7 AI core skills; response rate 0.16." },
  { id: "CAND_0004655", rank: 67, score: 0.4640, reasoning: "Mechanical Engineer with 4.4 yrs; 8 AI core skills; response rate 0.16." },
  { id: "CAND_0004133", rank: 68, score: 0.4560, reasoning: "Sales Executive with 8.5 yrs; 7 AI core skills; response rate 0.14." },
  { id: "CAND_0000958", rank: 69, score: 0.4480, reasoning: "Business Analyst with 4.3 yrs; 8 AI core skills; response rate 0.13." },
  { id: "CAND_0003259", rank: 70, score: 0.4400, reasoning: "Project Manager with 5.3 yrs; 7 AI core skills; response rate 0.13." },
  { id: "CAND_0004851", rank: 71, score: 0.4320, reasoning: "HR Manager with 6.3 yrs; 7 AI core skills; response rate 0.12." },
  { id: "CAND_0002626", rank: 72, score: 0.4240, reasoning: "Operations Manager with 11.0 yrs; 8 AI core skills; response rate 0.11." },
  { id: "CAND_0004410", rank: 73, score: 0.4160, reasoning: "Marketing Manager with 11.6 yrs; 8 AI core skills; response rate 0.07." },
  { id: "CAND_0003477", rank: 74, score: 0.4080, reasoning: "Junior ML Engineer with 6.9 yrs; 2 AI core skills; response rate 0.86." },
  { id: "CAND_0000799", rank: 75, score: 0.4000, reasoning: "Senior Machine Learning Engineer with 6.3 yrs; 6 AI core skills; response rate 0.83." },
  { id: "CAND_0003242", rank: 76, score: 0.3920, reasoning: "Project Manager with 13.9 yrs; 7 AI core skills; response rate 0.77." },
  { id: "CAND_0003846", rank: 77, score: 0.3840, reasoning: "Content Writer with 8.2 yrs; 6 AI core skills; response rate 0.77." },
  { id: "CAND_0000459", rank: 78, score: 0.3760, reasoning: "HR Manager with 1.9 yrs; 7 AI core skills; response rate 0.76." },
  { id: "CAND_0004223", rank: 79, score: 0.3680, reasoning: "Civil Engineer with 5.6 yrs; 6 AI core skills; response rate 0.76." },
  { id: "CAND_0004640", rank: 80, score: 0.3600, reasoning: "Civil Engineer with 11.2 yrs; 7 AI core skills; response rate 0.76." },
  { id: "CAND_0000251", rank: 81, score: 0.3520, reasoning: "HR Manager with 12.6 yrs; 7 AI core skills; response rate 0.75." },
  { id: "CAND_0002255", rank: 82, score: 0.3440, reasoning: "Accountant with 3.0 yrs; 7 AI core skills; response rate 0.73." },
  { id: "CAND_0003638", rank: 83, score: 0.3360, reasoning: "Sales Executive with 13.3 yrs; 7 AI core skills; response rate 0.73." },
  { id: "CAND_0003002", rank: 84, score: 0.3280, reasoning: "Project Manager with 11.0 yrs; 7 AI core skills; response rate 0.71." },
  { id: "CAND_0002880", rank: 85, score: 0.3200, reasoning: "Mechanical Engineer with 11.9 yrs; 7 AI core skills; response rate 0.70." },
  { id: "CAND_0000084", rank: 86, score: 0.3120, reasoning: "Sales Executive with 12.4 yrs; 7 AI core skills; response rate 0.69." },
  { id: "CAND_0003300", rank: 87, score: 0.3040, reasoning: "Graphic Designer with 6.2 yrs; 6 AI core skills; response rate 0.69." },
  { id: "CAND_0000699", rank: 88, score: 0.2960, reasoning: "Graphic Designer with 11.7 yrs; 7 AI core skills; response rate 0.68." },
  { id: "CAND_0002446", rank: 89, score: 0.2880, reasoning: "Customer Support with 10.2 yrs; 7 AI core skills; response rate 0.67." },
  { id: "CAND_0003918", rank: 90, score: 0.2800, reasoning: "Marketing Manager with 4.3 yrs; 7 AI core skills; response rate 0.66." },
  { id: "CAND_0002661", rank: 91, score: 0.2720, reasoning: "Graphic Designer with 7.9 yrs; 6 AI core skills; response rate 0.65." },
  { id: "CAND_0000899", rank: 92, score: 0.2640, reasoning: "Sales Executive with 10.2 yrs; 7 AI core skills; response rate 0.64." },
  { id: "CAND_0001550", rank: 93, score: 0.2560, reasoning: "Mechanical Engineer with 2.4 yrs; 7 AI core skills; response rate 0.64." },
  { id: "CAND_0002317", rank: 94, score: 0.2480, reasoning: "Content Writer with 7.2 yrs; 6 AI core skills; response rate 0.62." },
  { id: "CAND_0002720", rank: 95, score: 0.2400, reasoning: "Civil Engineer with 7.4 yrs; 6 AI core skills; response rate 0.61." },
  { id: "CAND_0001355", rank: 96, score: 0.2320, reasoning: "Civil Engineer with 12.9 yrs; 7 AI core skills; response rate 0.59." },
  { id: "CAND_0001839", rank: 97, score: 0.2240, reasoning: "Operations Manager with 8.2 yrs; 6 AI core skills; response rate 0.58." },
  { id: "CAND_0004366", rank: 98, score: 0.2160, reasoning: "Accountant with 3.6 yrs; 7 AI core skills; response rate 0.58." },
  { id: "CAND_0001021", rank: 99, score: 0.2080, reasoning: "Data Scientist with 3.1 yrs; 3 AI core skills; response rate 0.57." },
  { id: "CAND_0002689", rank: 100, score: 0.2000, reasoning: "Content Writer with 14.7 yrs; 7 AI core skills; response rate 0.57." }
];

export function HackathonWorkspace() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSpecTab, setActiveSpecTab] = useState<"validation" | "csv" | "metadata" | "schema">("validation");
  const [copiedText, setCopiedText] = useState(false);

  // CSV Validator state
  const [csvText, setCsvText] = useState("");
  const [validationResults, setValidationResults] = useState<{
    success: boolean;
    errors: string[];
    tested: boolean;
    stats?: {
      rowsCount: number;
      uniqueIds: number;
    }
  } | null>(null);

  const [isDragging, setIsDragging] = useState(false);

  // Filter candidates based on search
  const filteredCandidates = submissionCandidates.filter(c => 
    c.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.reasoning.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Trigger download of specific file content
  const downloadFile = (fileName: string, content: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const downloadSubmissionCsv = () => {
    const csvContent = "candidate_id,rank,score,reasoning\n" + 
      submissionCandidates.map(c => `${c.id},${c.rank},${c.score.toFixed(4)},"${c.reasoning.replace(/"/g, '""')}"`).join("\n");
    downloadFile("submission.csv", csvContent, "text/csv");
  };

  const downloadValidateScript = () => {
    const code = `#!/usr/bin/env python3
"""
Validate submission CSV per challenge rules (sections 2–3).
Row 1 = header. Rows 2–101 = exactly 100 data rows. CSV only.
"""

import csv
import re
import sys
from pathlib import Path

REQUIRED_HEADER = ["candidate_id", "rank", "score", "reasoning"]
CANDIDATE_ID_PATTERN = re.compile(r"^CAND_[0-9]{7}$")
DATA_ROW_START = 2
EXPECTED_DATA_ROWS = 100

def validate_submission(csv_path):
    errors = []
    path = Path(csv_path)

    if path.suffix.lower() != ".csv":
        errors.append("Filename must use a .csv extension.")
    elif not path.stem:
        errors.append("Filename must be your registered participant ID (e.g. team_xxx.csv).")

    try:
        with open(path, "r", encoding="utf-8", newline="") as f:
            reader = csv.reader(f)

            try:
                header = next(reader)
            except StopIteration:
                errors.append("Row 1 must be the header row; file is empty.")
                return errors

            if header != REQUIRED_HEADER:
                errors.append(f"Row 1 (header) must be exactly: {','.join(REQUIRED_HEADER)}")

            data_rows = []
            for row in reader:
                if any(cell.strip() for cell in row):
                    data_rows.append(row)

    except Exception as e:
        errors.append(f"Cannot read file: {e}")
        return errors

    n = len(data_rows)
    if n != EXPECTED_DATA_ROWS:
        errors.append(f"After the header (row 1), there must be exactly {EXPECTED_DATA_ROWS} data rows; found {n}.")

    seen_ids = set()
    seen_ranks = set()
    by_rank = []

    for i, cells in enumerate(data_rows):
        row_num = DATA_ROW_START + i
        if len(cells) != len(REQUIRED_HEADER):
            errors.append(f"Row {row_num}: expected {len(REQUIRED_HEADER)} columns, got {len(cells)}.")
            continue

        cid = cells[0].strip()
        rank_s = cells[1].strip()
        score_s = cells[2].strip()
        reasoning = cells[3].strip()

        if not CANDIDATE_ID_PATTERN.match(cid):
            errors.append(f"Row {row_num}: candidate_id '{cid}' must match pattern CAND_XXXXXXX.")

        if cid in seen_ids:
            errors.append(f"Row {row_num}: duplicate candidate_id '{cid}'.")
        else:
            seen_ids.add(cid)

        try:
            rank = int(rank_s)
            if not 1 <= rank <= 100:
                errors.append(f"Row {row_num}: rank must be 1-100.")
            elif rank in seen_ranks:
                errors.append(f"Row {row_num}: duplicate rank {rank}.")
            else:
                seen_ranks.add(rank)
        except ValueError:
            errors.append(f"Row {row_num}: rank must be an integer.")
            rank = None

        try:
            score = float(score_s)
        except ValueError:
            errors.append(f"Row {row_num}: score must be a float.")
            score = None

        if rank is not None and score is not None and cid:
            by_rank.append((rank, score, cid))

    missing = set(range(1, 101)) - seen_ranks
    if missing:
        errors.append(f"Ranks missing: {sorted(missing)}")

    by_rank.sort(key=lambda x: x[0])
    for i in range(len(by_rank) - 1):
        r1, s1, _ = by_rank[i]
        r2, s2, _ = by_rank[i+1]
        if s1 < s2:
            errors.append(f"score must be non-increasing by rank: rank {r1} ({s1}) < rank {r2} ({s2}).")

    for i in range(len(by_rank) - 1):
        r1, s1, c1 = by_rank[i]
        r2, s2, c2 = by_rank[i+1]
        if s1 == s2 and c1 > c2:
            errors.append(f"Ties at rank {r1}/{r2}: candidate_id must be sorted ascending ({c1} > {c2}).")

    return errors
`;
    downloadFile("validate_submission.py", code, "text/plain");
  };

  // Run the CSV validation checks locally in JS
  const handleValidateCSV = (textInput: string) => {
    const text = textInput || csvText;
    if (!text.trim()) {
      setValidationResults({
        success: false,
        tested: true,
        errors: ["CSV input is empty. Please paste CSV rows or drop a file."]
      });
      return;
    }

    const errors: string[] = [];
    const lines = text.split("\n").map(l => l.trim()).filter(l => l.length > 0);

    if (lines.length === 0) {
      errors.push("File is empty.");
      setValidationResults({ success: false, tested: true, errors });
      return;
    }

    // Helper to parse CSV row (naive CSV parsing for simple quotes)
    const parseRow = (line: string): string[] => {
      const result: string[] = [];
      let current = "";
      let inQuotes = false;
      for (let i = 0; i < line.length; i++) {
        const char = line[i];
        if (char === '"') {
          inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
          result.push(current);
          current = "";
        } else {
          current += char;
        }
      }
      result.push(current);
      return result;
    };

    const header = parseRow(lines[0]);
    const expectedHeader = ["candidate_id", "rank", "score", "reasoning"];

    const headerMatch = header.length === expectedHeader.length && 
                        header.every((val, i) => val.trim().toLowerCase() === expectedHeader[i]);

    if (!headerMatch) {
      errors.push(`Row 1 (header) must be exactly: candidate_id,rank,score,reasoning (Found: ${header.join(",")})`);
    }

    const dataLines = lines.slice(1);
    if (dataLines.length !== 100) {
      errors.push(`There must be exactly 100 data rows after the header; found ${dataLines.length}.`);
    }

    const seenIds = new Set<string>();
    const seenRanks = new Set<number>();
    const byRank: { rank: number; score: number; cid: string }[] = [];

    dataLines.forEach((line, index) => {
      const rowNum = index + 2;
      const cells = parseRow(line);

      if (cells.length < 4) {
        errors.push(`Row ${rowNum}: expected 4 columns, got ${cells.length}.`);
        return;
      }

      const cid = cells[0].trim();
      const rankS = cells[1].trim();
      const scoreS = cells[2].trim();
      const reasoning = cells[3].trim();

      // Check ID pattern
      const cidPattern = /^CAND_[0-9]{7}$/;
      if (!cidPattern.test(cid)) {
        errors.push(`Row ${rowNum}: candidate_id '${cid}' must match pattern CAND_XXXXXXX (7 digits).`);
      }

      if (seenIds.has(cid)) {
        errors.push(`Row ${rowNum}: duplicate candidate_id '${cid}'.`);
      } else {
        seenIds.add(cid);
      }

      // Check Rank
      const rank = parseInt(rankS, 10);
      if (isNaN(rank) || rank.toString() !== rankS) {
        errors.push(`Row ${rowNum}: rank must be an integer.`);
      } else if (rank < 1 || rank > 100) {
        errors.push(`Row ${rowNum}: rank must be between 1 and 100.`);
      } else if (seenRanks.has(rank)) {
        errors.push(`Row ${rowNum}: duplicate rank ${rank}.`);
      } else {
        seenRanks.add(rank);
      }

      // Check Score
      const score = parseFloat(scoreS);
      if (isNaN(score)) {
        errors.push(`Row ${rowNum}: score must be a float.`);
      }

      if (!isNaN(rank) && !isNaN(score) && cidPattern.test(cid)) {
        byRank.push({ rank, score, cid });
      }
    });

    // Check rank completeness
    const missingRanks: number[] = [];
    for (let r = 1; r <= 100; r++) {
      if (!seenRanks.has(r)) {
        missingRanks.push(r);
      }
    }
    if (missingRanks.length > 0) {
      errors.push(`Each rank 1–100 must appear exactly once; missing ranks: ${missingRanks.slice(0, 5).join(", ")}${missingRanks.length > 5 ? "..." : ""}`);
    }

    // Sort by rank and verify score monotonic non-increasing
    byRank.sort((a, b) => a.rank - b.rank);
    for (let i = 0; i < byRank.length - 1; i++) {
      const current = byRank[i];
      const next = byRank[i + 1];
      if (current.score < next.score) {
        errors.push(`Score must be non-increasing by rank: rank ${current.rank} (${current.score}) < rank ${next.rank} (${next.score}).`);
      }
    }

    // Sort tie breakers
    for (let i = 0; i < byRank.length - 1; i++) {
      const current = byRank[i];
      const next = byRank[i + 1];
      if (current.score === next.score && current.cid > next.cid) {
        errors.push(`Equal scores at ranks ${current.rank} and ${next.rank}: tie-break requires candidate_id ascending ('${current.cid}' > '${next.cid}').`);
      }
    }

    setValidationResults({
      success: errors.length === 0,
      errors,
      tested: true,
      stats: {
        rowsCount: dataLines.length,
        uniqueIds: seenIds.size
      }
    });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        setCsvText(text);
        handleValidateCSV(text);
      };
      reader.readAsText(file);
    }
  };

  const loadExampleSubmission = () => {
    const csvContent = "candidate_id,rank,score,reasoning\n" + 
      submissionCandidates.map(c => `${c.id},${c.rank},${c.score.toFixed(4)},"${c.reasoning}"`).join("\n");
    setCsvText(csvContent);
    handleValidateCSV(csvContent);
  };

  const copyPresetMetadata = () => {
    const text = `team_name: "AI Candidate Discovery Experts"
primary_contact:
  name: "aarishar7"
  email: "aarishar7@gmail.com"
team_members:
  - name: "Aarisha R"
    email: "aarishar7@gmail.com"
github_repo: "https://github.com/aarishar7/intelligent-candidate-discovery"
sandbox_link: "https://huggingface.co/spaces/aarishar7/redrob-ranker"
model_used: "Gemini 1.5 Flash + Custom Semantic Alignment + Profile Completeness Signals"`;
    navigator.clipboard.writeText(text);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  return (
    <div className="flex-1 flex flex-col p-6 gap-6 overflow-y-auto">
      {/* Banner / Header Title */}
      <section className="bg-gradient-to-r from-indigo-950/40 via-purple-950/10 to-transparent border border-indigo-500/20 rounded-2xl p-6 relative overflow-hidden">
        <div className="absolute right-0 top-0 h-full w-1/3 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-indigo-500/10 via-transparent to-transparent pointer-events-none" />
        <div className="flex items-start justify-between gap-6 flex-wrap">
          <div className="space-y-2">
            <span className="px-2.5 py-1 rounded-full text-[10px] bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-bold uppercase tracking-widest">
              Redrob Recruiter Hackathon
            </span>
            <h2 className="text-2xl font-light text-white font-sans tracking-tight">
              Submission Verification Portal
            </h2>
            <p className="text-xs text-zinc-400 max-w-2xl leading-relaxed">
              Explore your generated <code className="text-zinc-200 bg-zinc-900 px-1 py-0.5 rounded">submission.csv</code> dataset containing exactly 100 fully scored, contextually ranked candidates. Validate metadata schema compliance and download reproduction artifacts in real time.
            </p>
          </div>

          <div className="flex gap-2.5">
            <button
              onClick={downloadSubmissionCsv}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-lg shadow-indigo-600/15 transition cursor-pointer"
            >
              <Download size={14} />
              <span>Download submission.csv</span>
            </button>
            <button
              onClick={downloadValidateScript}
              className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 rounded-xl text-xs font-semibold flex items-center gap-2 transition cursor-pointer"
            >
              <Terminal size={14} />
              <span>Download validator.py</span>
            </button>
          </div>
        </div>
      </section>

      {/* Grid Layout: Left is dataset explorer, Right is file specs/validator */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* Left Grid: Scored Candidate List (Columns: 5) */}
        <section className="xl:col-span-5 bg-zinc-950/40 border border-zinc-800 rounded-2xl p-5 flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-sm font-semibold text-white">Scored Dataset Leaderboard</h3>
              <p className="text-xs text-zinc-400">Strictly 100 rows ordered by monotonic score</p>
            </div>
            <span className="text-[10px] bg-indigo-500/10 text-indigo-400 font-mono border border-indigo-500/20 px-2 py-0.5 rounded font-bold">
              100 Rows Valid
            </span>
          </div>

          {/* Search bar inside leaderboard */}
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-zinc-500">
              <Search size={14} />
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter by Candidate ID or description..."
              className="w-full bg-zinc-950 border border-zinc-800 text-xs text-white rounded-lg pl-8.5 pr-8 py-2.5 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 placeholder-zinc-500 transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute inset-y-0 right-0 flex items-center pr-2.5 text-zinc-500 hover:text-zinc-300"
              >
                <X size={13} />
              </button>
            )}
          </div>

          {/* Leaderboard Table */}
          <div className="max-h-[500px] overflow-y-auto border border-zinc-800 rounded-xl bg-zinc-950/20 scrollbar-thin scrollbar-thumb-zinc-800">
            <table className="w-full text-left border-collapse text-xs">
              <thead className="bg-zinc-900/60 sticky top-0 border-b border-zinc-800 text-zinc-400 uppercase font-bold tracking-wider text-[9px]">
                <tr>
                  <th className="p-3 text-center w-12">Rank</th>
                  <th className="p-3 w-32">Candidate ID</th>
                  <th className="p-3 w-20 text-center">Score</th>
                  <th className="p-3">Reasoning Summary</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60 font-sans">
                {filteredCandidates.map((c) => (
                  <tr key={c.id} className="hover:bg-zinc-900/40 transition">
                    <td className="p-3 text-center font-mono font-bold text-indigo-400 bg-indigo-500/5">
                      {c.rank}
                    </td>
                    <td className="p-3 font-mono font-semibold text-white select-all">
                      {c.id}
                    </td>
                    <td className="p-3 text-center font-mono text-emerald-400 font-medium">
                      {c.score.toFixed(4)}
                    </td>
                    <td className="p-3 text-zinc-400 leading-normal max-w-xs truncate" title={c.reasoning}>
                      {c.reasoning}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Right Grid: Specs & Real-time Interactive Validator (Columns: 7) */}
        <section className="xl:col-span-7 bg-zinc-950/40 border border-zinc-800 rounded-2xl p-5 flex flex-col gap-5">
          {/* Tabs for specs & tools */}
          <div className="flex border-b border-zinc-800 gap-4">
            <button
              onClick={() => setActiveSpecTab("validation")}
              className={`pb-3 text-xs font-semibold transition relative cursor-pointer ${
                activeSpecTab === "validation" ? "text-indigo-400" : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              Interactive CSV Validator
              {activeSpecTab === "validation" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500" />}
            </button>
            <button
              onClick={() => setActiveSpecTab("csv")}
              className={`pb-3 text-xs font-semibold transition relative cursor-pointer ${
                activeSpecTab === "csv" ? "text-indigo-400" : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              CSV Content View
              {activeSpecTab === "csv" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500" />}
            </button>
            <button
              onClick={() => setActiveSpecTab("metadata")}
              className={`pb-3 text-xs font-semibold transition relative cursor-pointer ${
                activeSpecTab === "metadata" ? "text-indigo-400" : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              Submission Metadata
              {activeSpecTab === "metadata" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500" />}
            </button>
            <button
              onClick={() => setActiveSpecTab("schema")}
              className={`pb-3 text-xs font-semibold transition relative cursor-pointer ${
                activeSpecTab === "schema" ? "text-indigo-400" : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              Profile JSON Schema
              {activeSpecTab === "schema" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500" />}
            </button>
          </div>

          {/* TAB CONTENT: 1. CSV VALIDATOR */}
          {activeSpecTab === "validation" && (
            <div className="space-y-4 animate-fade-in">
              <div className="space-y-1.5">
                <h4 className="text-xs font-semibold text-white">Upload and Test Any Submission CSV</h4>
                <p className="text-xs text-zinc-400">
                  Runs our real-time client-side JS implementation of the python verification script to check headers, sizes, ranks, monotonic scores, and tie-breaks.
                </p>
              </div>

              {/* Drag/Drop Zone */}
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-xl p-8 text-center transition duration-200 flex flex-col items-center justify-center gap-3 cursor-pointer ${
                  isDragging
                    ? "border-indigo-500 bg-indigo-500/10"
                    : "border-zinc-800 bg-zinc-950 hover:bg-zinc-900/40 hover:border-zinc-700"
                }`}
              >
                <div className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center border border-zinc-800 text-zinc-400">
                  <Upload size={18} />
                </div>
                <div>
                  <p className="text-xs text-white font-medium">Drag & Drop team_xxx.csv file here</p>
                  <p className="text-[10px] text-zinc-500 mt-1">Or paste raw content into the editor box below</p>
                </div>
                <div className="flex gap-2.5 mt-2">
                  <button
                    onClick={loadExampleSubmission}
                    className="px-3 py-1.5 bg-indigo-600/10 hover:bg-indigo-600/20 text-indigo-400 text-[11px] font-semibold rounded-lg border border-indigo-500/20 transition cursor-pointer"
                  >
                    Load & Validate Generated submission.csv
                  </button>
                </div>
              </div>

              {/* Textarea Editor Box */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block">Raw CSV Editor</label>
                <textarea
                  value={csvText}
                  onChange={(e) => setCsvText(e.target.value)}
                  placeholder="candidate_id,rank,score,reasoning&#10;CAND_0004989,1,0.9920,&quot;Some reason&quot;&#10;CAND_0001195,2,0.9840,&quot;Some reason&quot;"
                  className="w-full h-36 bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-[10px] font-mono text-zinc-300 leading-relaxed focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* Trigger Buttons */}
              <div className="flex justify-end gap-2.5">
                <button
                  onClick={() => {
                    setCsvText("");
                    setValidationResults(null);
                  }}
                  className="px-3.5 py-1.5 text-xs text-zinc-400 hover:text-white"
                >
                  Clear
                </button>
                <button
                  onClick={() => handleValidateCSV("")}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-lg transition"
                >
                  Validate Now
                </button>
              </div>

              {/* Validation Status Output */}
              {validationResults && (
                <div className={`p-4 rounded-xl border text-xs flex gap-3 items-start animate-fade-in ${
                  validationResults.success
                    ? "bg-emerald-950/20 border-emerald-800/30 text-emerald-300"
                    : "bg-red-950/20 border-red-800/30 text-red-300"
                }`}>
                  {validationResults.success ? (
                    <CheckCircle size={18} className="shrink-0 text-emerald-400 mt-0.5" />
                  ) : (
                    <AlertTriangle size={18} className="shrink-0 text-red-400 mt-0.5" />
                  )}
                  <div className="space-y-1.5 flex-1">
                    <span className="font-semibold block text-sm">
                      {validationResults.success ? "Validation Succeeded" : "Validation Failed"}
                    </span>
                    {validationResults.stats && (
                      <p className="text-[11px] text-zinc-400">
                        Tested: {validationResults.stats.rowsCount} data rows | Unique candidates: {validationResults.stats.uniqueIds}
                      </p>
                    )}
                    {validationResults.errors.length > 0 ? (
                      <ul className="list-disc pl-4 text-[11px] text-zinc-400 space-y-1 mt-2 max-h-40 overflow-y-auto">
                        {validationResults.errors.map((err, i) => (
                          <li key={i} className="text-red-400">{err}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-[11px] text-emerald-400 font-medium">Your CSV dataset is 100% compliant with the challenge rules (Stage 2 and Stage 3 submission guidelines). You are ready to upload!</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB CONTENT: 2. CSV CONTENT VIEW */}
          {activeSpecTab === "csv" && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex justify-between items-center">
                <div className="space-y-1">
                  <h4 className="text-xs font-semibold text-white">Direct Raw CSV Preview</h4>
                  <p className="text-xs text-zinc-400">Visual snippet of `/submission.csv` at project root.</p>
                </div>
                <button
                  onClick={downloadSubmissionCsv}
                  className="px-2.5 py-1.5 text-[10px] bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white rounded flex items-center gap-1.5 transition cursor-pointer"
                >
                  <Download size={12} />
                  <span>Download</span>
                </button>
              </div>

              <div className="bg-zinc-950 border border-zinc-800 rounded-xl max-h-[350px] overflow-y-auto p-4 font-mono text-[10px] text-zinc-400 select-text leading-relaxed">
                <span className="text-indigo-400 font-semibold block border-b border-zinc-900 pb-1 mb-1">
                  candidate_id,rank,score,reasoning
                </span>
                {submissionCandidates.map((c, i) => (
                  <div key={i} className="py-0.5 hover:bg-zinc-900/30">
                    <span className="text-zinc-200">{c.id}</span>
                    <span className="text-zinc-500">,</span>
                    <span className="text-yellow-400 font-bold">{c.rank}</span>
                    <span className="text-zinc-500">,</span>
                    <span className="text-emerald-400">{c.score.toFixed(4)}</span>
                    <span className="text-zinc-500">,</span>
                    <span className="text-zinc-300">"{c.reasoning}"</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB CONTENT: 3. SUBMISSION METADATA */}
          {activeSpecTab === "metadata" && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex justify-between items-center">
                <div className="space-y-1">
                  <h4 className="text-xs font-semibold text-white">submission_metadata.yaml Specs</h4>
                  <p className="text-xs text-zinc-400">Required reproducibility metadata verifying model parameters.</p>
                </div>
                <button
                  onClick={copyPresetMetadata}
                  className="px-2.5 py-1.5 text-[10px] bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white rounded flex items-center gap-1.5 transition cursor-pointer"
                >
                  {copiedText ? <Check size={12} className="text-green-400" /> : <Copy size={12} />}
                  <span>{copiedText ? "Copied" : "Copy YAML"}</span>
                </button>
              </div>

              <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 font-mono text-xs text-zinc-300 leading-relaxed select-text">
                <div className="text-zinc-500"># Redrob Hackathon — Submission Metadata Template</div>
                <div><span className="text-indigo-400">team_name</span>: <span className="text-emerald-400">"AI Candidate Discovery Experts"</span></div>
                <div className="text-zinc-500 mt-2"># Contact details</div>
                <div><span className="text-indigo-400">primary_contact</span>:</div>
                <div className="pl-4"><span className="text-indigo-400">name</span>: <span className="text-emerald-400">"aarishar7"</span></div>
                <div className="pl-4"><span className="text-indigo-400">email</span>: <span className="text-emerald-400">"aarishar7@gmail.com"</span></div>
                <div className="pl-4"><span className="text-indigo-400">phone</span>: <span className="text-emerald-400 font-mono">"+91-XXXXXXXXXX"</span></div>
                
                <div className="text-zinc-500 mt-2"># Code reproducibility links</div>
                <div><span className="text-indigo-400">github_repo</span>: <span className="text-blue-400 hover:underline">"https://github.com/aarishar7/intelligent-candidate-discovery"</span></div>
                <div><span className="text-indigo-400">sandbox_link</span>: <span className="text-blue-400 hover:underline">"https://huggingface.co/spaces/aarishar7/redrob-ranker"</span></div>
                
                <div className="text-zinc-500 mt-2"># Algorithm descriptors</div>
                <div><span className="text-indigo-400">model_used</span>: <span className="text-emerald-400">"Gemini 1.5 Flash + Custom Semantic Alignment + Profile Completeness Signals"</span></div>
                <div><span className="text-indigo-400">algorithm</span>: <span className="text-zinc-400">"Multi-modal semantic embedding evaluation paired with heuristic signal prioritization matrices."</span></div>
              </div>
            </div>
          )}

          {/* TAB CONTENT: 4. CANDIDATE PROFILE SCHEMA */}
          {activeSpecTab === "schema" && (
            <div className="space-y-4 animate-fade-in">
              <div className="space-y-1">
                <h4 className="text-xs font-semibold text-white">Redrob Candidate Profile JSON Schema</h4>
                <p className="text-xs text-zinc-400">Mandated structure for JSON candidate data inputs.</p>
              </div>

              <div className="bg-zinc-950 border border-zinc-800 rounded-xl max-h-[350px] overflow-y-auto p-4 font-mono text-[11px] text-zinc-300 leading-relaxed select-text">
                <span className="text-yellow-500 font-semibold">// Profile schema highlights</span>
                <div className="text-indigo-400">candidate_id: <span className="text-zinc-400">"string (Format: ^CAND_[0-9]{"{"}7{"}"}$)"</span></div>
                <div className="text-indigo-400">profile:</div>
                <div className="pl-4 text-zinc-400">- years_of_experience (number: 0 - 50)</div>
                <div className="pl-4 text-zinc-400">- current_company_size ("1-10", "11-50", ..., "10001+")</div>
                <div className="text-indigo-400">career_history: <span className="text-zinc-400">"array of companies, titles, durations"</span></div>
                <div className="text-indigo-400">redrob_signals:</div>
                <div className="pl-4 text-zinc-400">- profile_completeness_score (0 - 100)</div>
                <div className="pl-4 text-zinc-400">- recruiter_response_rate (0.0 - 1.0)</div>
                <div className="pl-4 text-zinc-400">- github_activity_score (-1 to 100)</div>
                <div className="pl-4 text-zinc-400">- notice_period_days (0 to 180)</div>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
