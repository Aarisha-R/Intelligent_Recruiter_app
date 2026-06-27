import { Candidate } from "./types";

export const initialCandidates: Candidate[] = [
  {
    id: "cand-1",
    name: "Aarav Mehta",
    title: "Senior Machine Learning Engineer",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200",
    location: "San Francisco, CA (Hybrid)",
    experienceYears: 8,
    education: "M.S. in Computer Science (Stanford University)",
    skills: ["Python", "PyTorch", "TensorFlow", "Scikit-Learn", "Docker", "Kubernetes", "SQL", "FastAPI"],
    bio: "Passionate ML Architect specializing in building large-scale deep learning models, natural language processing pipelines, and productionizing real-time recommendation engines. Active contributor to open-source PyTorch libraries.",
    experienceHistory: [
      {
        role: "Lead ML Research Engineer",
        company: "NeuralTech Solutions",
        duration: "2022 - Present",
        description: "Led a team of 4 ML engineers to redesign the company's recommendation engine using PyTorch and FastAPI, increasing user CTR by 18%. Spearheaded deployment pipelines via Kubernetes."
      },
      {
        role: "Senior AI Software Engineer",
        company: "Cognitive Labs",
        duration: "2019 - 2022",
        description: "Developed and optimized computer vision models for automated medical imaging diagnostic systems. Improved model inference speed by 35% through quantization and pruning."
      }
    ],
    behavioralSignals: {
      codingScore: 96,
      responsivenessScore: 92,
      githubCommits: 284,
      openSourceContributor: true,
      activeJobSeeker: true,
      profileCompleteness: 100
    }
  },
  {
    id: "cand-2",
    name: "Chloe Dubois",
    title: "Senior Full-Stack Engineer (React & Node)",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200",
    location: "New York, NY (Remote / Onsite)",
    experienceYears: 7,
    education: "B.S. in Software Engineering (McGill University)",
    skills: ["React", "TypeScript", "Node.js", "Express", "Python", "PostgreSQL", "AWS", "Tailwind CSS"],
    bio: "Product-oriented developer focused on building intuitive, beautiful web applications. Deep expertise in backend system performance, responsive client-side UI, and scalable cloud deployment on AWS.",
    experienceHistory: [
      {
        role: "Senior Full Stack Engineer",
        company: "Skyline Creative",
        duration: "2021 - Present",
        description: "Re-architected legacy monolithic dashboard to high-performance Next.js and Node.js microservices. Integrated AWS Lambda serverless endpoints, cutting infrastructure costs by 22%."
      },
      {
        role: "Software Developer",
        company: "Webflow Ventures",
        duration: "2018 - 2021",
        description: "Collaborated in design-to-code efforts using React and CSS modules. Implemented drag-and-drop workspace features using react-beautiful-dnd."
      }
    ],
    behavioralSignals: {
      codingScore: 89,
      responsivenessScore: 85,
      githubCommits: 142,
      openSourceContributor: false,
      activeJobSeeker: false,
      profileCompleteness: 95
    }
  },
  {
    id: "cand-3",
    name: "Marcus Vance",
    title: "Cloud Infrastructure & DevOps Engineer",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200",
    location: "Austin, TX (Remote)",
    experienceYears: 5,
    education: "B.S. in Computer Engineering (UT Austin)",
    skills: ["Terraform", "Kubernetes", "AWS", "Docker", "Python", "Bash", "Prometheus", "CI/CD (GitHub Actions)"],
    bio: "Automated infrastructure pioneer. Specialized in setting up immutable infrastructure-as-code, robust CI/CD deployment pipelines, and high-availability server patterns. Passionate about zero-downtime microservice orchestration.",
    experienceHistory: [
      {
        role: "DevOps Engineer III",
        company: "HoloCloud Systems",
        duration: "2023 - Present",
        description: "Migrated 50+ applications from bare-metal VMs to Kubernetes clusters. Automated developer environments with Terraform, reducing onboarding provisioning from 2 days to 15 minutes."
      },
      {
        role: "Systems Automation Engineer",
        company: "Apex Tech Group",
        duration: "2021 - 2023",
        description: "Designed multi-region AWS backups and disaster recovery workflows. Managed security group auditing and automated compliance checks via Python and Bash scripts."
      }
    ],
    behavioralSignals: {
      codingScore: 82,
      responsivenessScore: 78,
      githubCommits: 412,
      openSourceContributor: true,
      activeJobSeeker: true,
      profileCompleteness: 90
    }
  },
  {
    id: "cand-4",
    name: "Elena Rostova",
    title: "Data Scientist & Quantitative Analyst",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200",
    location: "Chicago, IL (Onsite)",
    experienceYears: 4,
    education: "Ph.D. in Applied Mathematics (Northwestern University)",
    skills: ["Python", "Pandas", "SQL", "R", "Tableau", "Machine Learning", "Statistical Modeling", "Jupyter"],
    bio: "Data-driven decision explorer. Combines advanced academic mathematical foundations with real-world business intelligence. Focused on predictive customer modeling, pricing algorithms, and churn minimization.",
    experienceHistory: [
      {
        role: "Data Scientist",
        company: "Apex Capital Partners",
        duration: "2022 - Present",
        description: "Developed time-series statistical forecasting models to optimize asset allocation strategies. Built interactive visual data analytics dashboards with Python Streamlit and Tableau for executives."
      },
      {
        role: "Quantitative Analyst Fellow",
        company: "Metro Metrics",
        duration: "2020 - 2022",
        description: "Formulated survival analysis algorithms to study customer churn. Discovered risk correlations that helped lower churn rates by 14%."
      }
    ],
    behavioralSignals: {
      codingScore: 78,
      responsivenessScore: 90,
      githubCommits: 88,
      openSourceContributor: false,
      activeJobSeeker: true,
      profileCompleteness: 85
    }
  },
  {
    id: "cand-5",
    name: "Ji-Min Kim",
    title: "Frontend UI Developer",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200",
    location: "Seattle, WA (Remote / Hybrid)",
    experienceYears: 3,
    education: "B.A. in Interactive Media (University of Washington)",
    skills: ["React", "TypeScript", "Tailwind CSS", "Next.js", "Figma", "HTML5/CSS3", "Jest", "Web Accessibility"],
    bio: "User-interface purist. Believes in semantic HTML, flawless responsive layout designs, and smooth motion states. Enjoys translating Figma layouts into pixel-perfect modular React environments.",
    experienceHistory: [
      {
        role: "Associate Frontend Developer",
        company: "Boutique App Studio",
        duration: "2023 - Present",
        description: "Implemented fully responsive web UI features using Tailwind CSS and Framer Motion. Audited and fixed WCAG compliance flaws across 3 major client portals."
      },
      {
        role: "UI Engineer Co-op",
        company: "OmniWeb Corp",
        duration: "2022 - 2023",
        description: "Developed and unit-tested reusable component libraries using React Storybook, streamlining engineer velocity across projects."
      }
    ],
    behavioralSignals: {
      codingScore: 91,
      responsivenessScore: 98,
      githubCommits: 198,
      openSourceContributor: true,
      activeJobSeeker: true,
      profileCompleteness: 98
    }
  },
  {
    id: "cand-6",
    name: "Sarah Jenkins",
    title: "Software Engineer (Python & Django)",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200",
    location: "Denver, CO (Hybrid)",
    experienceYears: 2,
    education: "B.S. in Computer Science (University of Colorado)",
    skills: ["Python", "Django", "PostgreSQL", "REST APIs", "Git", "Docker", "Redis", "Celery"],
    bio: "Enthusiastic backend software engineer. Skilled in clean-architecture API design, relational schema engineering in PostgreSQL, and background task scheduling using Celery and Redis. Enjoys automated unit testing.",
    experienceHistory: [
      {
        role: "Junior Backend Developer",
        company: "Summit Software",
        duration: "2022 - Present",
        description: "Designed and documented RESTful APIs in Django REST Framework. Configured database migration scripts and optimized SQL queries to resolve slow loading speeds."
      }
    ],
    behavioralSignals: {
      codingScore: 93,
      responsivenessScore: 95,
      githubCommits: 155,
      openSourceContributor: false,
      activeJobSeeker: true,
      profileCompleteness: 88
    }
  },
  {
    id: "cand-7",
    name: "Rajesh Kumar",
    title: "Principal Software Architect",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=200",
    location: "Boston, MA (Onsite / Hybrid)",
    experienceYears: 12,
    education: "Ph.D. in Computer Science (MIT)",
    skills: ["Python", "Distributed Systems", "gRPC", "PostgreSQL", "C++", "System Architecture", "Scalability", "Kubernetes"],
    bio: "Enterprise Solutions Architect with over a decade of design experience. Specializes in building high-throughput microservices, asynchronous transaction processing systems, and resolving concurrency hurdles in enterprise banking platforms.",
    experienceHistory: [
      {
        role: "Principal Architect",
        company: "Nexus Finance Corp",
        duration: "2020 - Present",
        description: "Overhauled the core banking transaction pipeline to support 15,000+ operations/second using Python gRPC and PostgreSQL clustering. Advised senior leadership on high-level infrastructure roadmaps."
      },
      {
        role: "Staff Infrastructure Engineer",
        company: "Grid Computing Inc",
        duration: "2014 - 2020",
        description: "Engineered robust consensus cluster layers in C++ and Python. Mentored over 15 junior developers across globally distributed teams."
      }
    ],
    behavioralSignals: {
      codingScore: 98,
      responsivenessScore: 60,
      githubCommits: 75,
      openSourceContributor: true,
      activeJobSeeker: false,
      profileCompleteness: 100
    }
  }
];
