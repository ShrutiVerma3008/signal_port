export type Stop = {
  id: string;
  title: string;
  subtype: "milestone" | "project";
  org?: string;
  years: string;
  description: string;
  metric: string;
  tech: string[];
  link?: string;
};

export const stops: Stop[] = [
  {
    id: "gsv-vadodara",
    title: "Gati Shakti Vishwavidyalaya, Vadodara",
    subtype: "milestone",
    org: "B.Tech, AI & Data Science (Railway Specialization)",
    years: "Aug 2023 – May 2027",
    description:
      "GeeksforGeeks Institutional Rank #2. State Topper, Class X & XII.",
    metric: "CGPA 9.58/10.0",
    tech: [],
  },
  {
    id: "ministry-of-railways",
    title: "Ministry of Railways",
    subtype: "milestone",
    org: "AI Research & Development Intern",
    years: "May 2025 – Present",
    description:
      "Architected an end-to-end document intelligence pipeline for Indian Railway accident reports using dual-GPU OCR, DocLayout, and 5-pass agentic LLM extraction — processing 150-page reports in under 8 minutes on RTX 4500 Ada + CUDA 12.1. Ran EDA across 150+ historical accident reports covering all Railway zones, with findings submitted to the Railway Safety Board.",
    metric: "94%+ extraction accuracy",
    tech: ["PaddleOCR", "DocLayout", "CUDA 12.1", "Pydantic"],
  },
  {
    id: "iridm",
    title: "Indian Railways Institute of Disaster Management",
    subtype: "milestone",
    org: "Web & AI Development Intern",
    years: "May – July 2025",
    description:
      "Built a full-stack disaster management platform for institutional emergency response operations, with a LangChain + FAISS retrieval chatbot over 500+ policy documents, deployed on Groq for sub-200ms production inference.",
    metric: "94% answer relevance",
    tech: ["React", "Node.js", "PostgreSQL", "LangChain", "FAISS", "Groq"],
  },
  {
    id: "formoptix",
    title: "FormOptiX",
    subtype: "project",
    years: "2026",
    description:
      "Intelligent formwork and Bill of Quantities optimizer for large-scale construction. DBSCAN clustering for floor similarity plus an LP-based procurement optimizer, advancing to production with L&T Infratech.",
    metric: "L&T CreaTech '26 National Finalist — Top 8 of 15,000+ teams",
    tech: ["Python", "PuLP", "scikit-learn", "Streamlit"],
  },
  {
    id: "graphrag",
    title: "GraphRAG: Knowledge Graph + LLM Policy Intelligence",
    subtype: "project",
    years: "2025 – 2026",
    description:
      "Production RAG system combining knowledge graphs with a fine-tuned Mistral 7B over 4,000+ entities. Multi-hop reasoning with conformal prediction for uncertainty and SHAP explainability on every response.",
    metric: "<200ms multi-hop latency",
    tech: ["PyTorch", "HuggingFace", "FAISS", "FastAPI", "Next.js"],
  },
  {
    id: "ai-resume-intelligence",
    title: "AI Resume Intelligence System",
    subtype: "project",
    years: "2025",
    description:
      "ATS scoring, bullet rewriting, and GitHub integration for job seekers. Deployed on Vercel + Railway.",
    metric: "150+ beta users · 92% ATS match improvement · 4.8/5 satisfaction",
    tech: ["React", "FastAPI", "OpenRouter", "LangChain"],
    link: "https://github.com/ShrutiVerma3008",
  },
  {
    id: "retentionai",
    title: "RetentionAI: Churn Prediction Platform",
    subtype: "project",
    years: "2025",
    description:
      "Churn prediction for the Indian BFSI sector, with SHAP explainability and BERT-based emotion detection. Includes a digital-twin simulation for intervention impact analysis and LangChain-driven outreach generation.",
    metric: "AUC 0.91",
    tech: ["FastAPI", "XGBoost", "SHAP", "BERT", "LangChain"],
  },
  {
    id: "redrob",
    title: "Redrob: Semantic Talent Search Engine",
    subtype: "project",
    years: "2025",
    description:
      "Hybrid BM25 + dense embedding retrieval with Reciprocal Rank Fusion (RRF) and HyDE query expansion. Ranked 100K+ candidates offline in under 15 seconds with a full explainability layer.",
    metric: "100K candidates ranked in <15s",
    tech: ["FastAPI", "FAISS", "SentenceTransformers", "BM25"],
  },
  {
    id: "edgemirror",
    title: "EdgeMirror: On-Device AI Monitoring",
    subtype: "project",
    years: "2025",
    description:
      "Real-time infrastructure anomaly detection pipeline running entirely at the edge on NVIDIA Jetson hardware, no cloud dependency. Selected for Tata InnoVent-27 national showcase.",
    metric: "Tata InnoVent-27 National Showcase",
    tech: ["PyTorch", "NVIDIA Jetson", "TensorRT", "ONNX"],
  },
  {
    id: "adaptive-logistics",
    title: "Adaptive Multi-Agent Logistics Orchestration",
    subtype: "project",
    years: "2025",
    description:
      "Multi-agent reinforcement learning system for dynamic logistics routing. Graph Neural Networks model the supply network, QMIX coordinates agent policies, and Temporal Fusion Transformer forecasts demand.",
    metric: "End-to-end dynamic routing",
    tech: ["PyTorch Geometric", "QMIX", "TFT", "GNN"],
  },
  {
    id: "dental-cnn",
    title: "CNN for Dental X-Ray Osteoporosis Screening",
    subtype: "project",
    years: "2025",
    description:
      "Comparative study of CNN architectures for early osteoporosis detection from panoramic dental X-rays. Includes GradCAM explainability and full evaluation across multiple backbone models.",
    metric: "87.08% accuracy · ROC-AUC 0.87",
    tech: ["PyTorch", "OpenCV", "GradCAM", "scikit-learn"],
  },
];

export const projectStops = stops.filter((s) => s.subtype === "project");
export const milestoneStops = stops.filter((s) => s.subtype === "milestone");
