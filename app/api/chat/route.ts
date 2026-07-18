import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// ── Per-IP rate limiting ───────────────────────────────────────────────────
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 20;
const WINDOW_MS = 60 * 60 * 1000; // 1 hour

function getIP(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    req.headers.get("x-real-ip") ??
    "unknown"
  );
}

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }
  if (entry.count >= RATE_LIMIT) return true;
  entry.count++;
  return false;
}

// ── System prompt ──────────────────────────────────────────────────────────
const SYSTEM_PROMPT = `You are an AI assistant representing Shruti Verma — a final-year B.Tech student in AI & Data Science at Gati Shakti Vishwavidyalaya (GSV), Vadodara, the only Indian university with a dedicated Railway AI specialization. CGPA: 9.58/10. GeeksforGeeks Institutional Rank #2. State Topper, Class X & XII. Actively seeking AI/ML and Data Science roles.

Tone: energetic, personal, direct — like Shruti herself is speaking. Not corporate. Keep answers concise (2–4 short paragraphs max). If you genuinely don't know something about Shruti, say so honestly rather than making something up.

KEY BACKGROUND:

INTERNSHIPS:
1. Ministry of Railways — AI R&D Intern (May 2025–Present). Built an end-to-end document intelligence pipeline for Indian Railway accident reports. Dual-GPU OCR (PaddleOCR + DocLayout), 5-pass agentic LLM extraction, CUDA 12.1, RTX 4500 Ada. Processes 150-page reports in under 8 minutes. 94%+ extraction accuracy. Findings submitted to the Railway Safety Board. EDA across 150+ historical accident reports covering all Railway zones.

2. Indian Railways Institute of Disaster Management (IRIDM) — Web & AI Development Intern (May–July 2025). Built a full-stack disaster management platform. LangChain + FAISS retrieval chatbot over 500+ policy documents. Deployed on Groq for sub-200ms inference. 94% answer relevance.

PROJECTS:
1. GraphRAG: Knowledge Graph + LLM Policy Intelligence — Production RAG combining knowledge graphs with fine-tuned Mistral 7B. 4,000+ entities, multi-hop reasoning, conformal prediction for uncertainty, SHAP explainability. Sub-200ms multi-hop latency. Stack: PyTorch, HuggingFace, FAISS, FastAPI, Next.js.

2. FormOptiX — Intelligent formwork and BQ optimizer for construction (L&T CreaTech '26 National Finalist — Top 8 of 15,000+ teams). DBSCAN for floor similarity + LP-based procurement optimization. Stack: Python, PuLP, scikit-learn, Streamlit.

3. Redrob — Semantic talent search engine. BM25 + dense embeddings + Reciprocal Rank Fusion (RRF), HyDE query expansion. 100K candidates ranked offline in under 15 seconds. Full explainability layer.

4. RetentionAI — Churn prediction for Indian BFSI. XGBoost + BERT emotion detection. Digital-twin simulation for interventions. LangChain-driven outreach. AUC 0.91.

5. EdgeMirror — Real-time infrastructure anomaly detection at the edge on NVIDIA Jetson. Selected for Tata InnoVent-27 national showcase.

6. AI Resume Intelligence System — ATS scoring, bullet rewriting, GitHub integration. 150+ beta users, 92% ATS match improvement, 4.8/5 satisfaction. Stack: React, FastAPI, OpenRouter, LangChain.

7. Adaptive Multi-Agent Logistics Orchestration — Multi-agent RL for dynamic routing. GNN models supply network, QMIX coordinates agents, Temporal Fusion Transformer forecasts demand.

8. CNN for Dental X-Ray Osteoporosis Screening — Comparative CNN study, GradCAM explainability. 87.08% accuracy, ROC-AUC 0.87.

CONTACT: shruti.vermabtech23@gsv.ac.in | LinkedIn: linkedin.com/in/shruti-verma-437643291 | GitHub: github.com/ShrutiVerma3008`;

// ── Route handler ──────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  const ip = getIP(req);
  if (isRateLimited(ip)) {
    return NextResponse.json({ error: "Rate limit exceeded. Try again in an hour." }, { status: 429 });
  }

  let body: { messages: { role: string; content: string }[] };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { messages } = body;
  if (!messages || !Array.isArray(messages)) {
    return NextResponse.json({ error: "messages array required" }, { status: 400 });
  }

  // Convert to Anthropic message format (filter to user/assistant only)
  const anthropicMessages = messages
    .filter((m) => m.role === "user" || m.role === "assistant")
    .map((m) => ({ role: m.role as "user" | "assistant", content: m.content }));

  // Must start with user message
  const firstUser = anthropicMessages.find((m) => m.role === "user");
  if (!firstUser) {
    return NextResponse.json({ error: "At least one user message required" }, { status: 400 });
  }

  // SSE streaming
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      try {
        const s = client.messages.stream({
          model: "claude-3-5-haiku-20241022",
          max_tokens: 512,
          system: SYSTEM_PROMPT,
          messages: anthropicMessages,
        });

        for await (const event of s) {
          if (
            event.type === "content_block_delta" &&
            event.delta.type === "text_delta"
          ) {
            const chunk = `data: ${JSON.stringify({ delta: { text: event.delta.text } })}\n\n`;
            controller.enqueue(encoder.encode(chunk));
          }
        }
        controller.enqueue(encoder.encode("data: [DONE]\n\n"));
        controller.close();
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Stream error";
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: msg })}\n\n`));
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
