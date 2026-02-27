# UGC Studio — AI Video Generator

> **Comprehensive research + working SaaS starter** for building an AI UGC video generator like Creatify AI, JoggAI, MakeUGC, and Zeely AI.

[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=nextdotjs)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8?logo=tailwindcss)](https://tailwindcss.com)

---

## Table of Contents

1. [What are AI UGC Video Tools?](#1-what-are-ai-ugc-video-tools)
2. [How They Actually Work — Architecture Deep Dive](#2-how-they-actually-work--architecture-deep-dive)
3. [In-House Models vs API Wrappers?](#3-in-house-models-vs-api-wrappers)
4. [Tool-by-Tool Analysis](#4-tool-by-tool-analysis)
5. [The AI APIs Powering Everything](#5-the-ai-apis-powering-everything)
6. [Building Your Own SaaS — Architecture](#6-building-your-own-saas--architecture)
7. [Tech Stack and Project Structure](#7-tech-stack-and-project-structure)
8. [Initial Cost Breakdown](#8-initial-cost-breakdown)
9. [Free Alternatives (Zero-Cost Stack)](#9-free-alternatives-zero-cost-stack)
10. [Can You Build This Solo? (Vibe-Coding Guide)](#10-can-you-build-this-solo-vibe-coding-guide)
11. [Quick Start](#11-quick-start)
12. [API Reference](#12-api-reference)
13. [Roadmap](#13-roadmap)

---

## 1. What are AI UGC Video Tools?

**UGC (User-Generated Content)** videos are short-form, authentic-looking videos —
typically 15–60 seconds, shot in portrait (9:16) — that perform extremely well as
paid social ads on TikTok, Instagram Reels, and YouTube Shorts.

**AI UGC video tools** let brands generate these videos at scale without hiring
real influencers or filming anything. Instead, they use:

- **AI talking-head avatars** (realistic or animated human characters)
- **AI voice synthesis** (text-to-speech with natural, expressive voices)
- **AI face-swap** (replace the avatar face with a real person's face)
- **AI video generation** (generate b-roll scenes from text prompts)
- **Auto-captions** with customizable styles

The result: a video that looks like a real person recorded a UGC ad, created in ~2 minutes for ~$0.50.

---

## 2. How They Actually Work — Architecture Deep Dive

Every AI UGC video tool follows roughly the same pipeline:

```
User Input
  │
  ├── Script / Prompt
  ├── Avatar selection
  ├── Voice selection
  └── Settings (aspect ratio, captions, etc.)
  │
  ▼
┌─────────────────────────────────────────────────────────────────┐
│                    BACKEND ORCHESTRATION                        │
│                                                                 │
│  Step 1: Text → Speech                                          │
│    Script ──────────────────→ ElevenLabs API ──→ audio.mp3      │
│                                                                 │
│  Step 2: Audio + Avatar → Talking-Head Video                    │
│    audio.mp3 + avatar_image ─→ D-ID / HeyGen ──→ talking.mp4   │
│                                                                 │
│  Step 3: (Optional) Face Swap                                   │
│    user_face.jpg + talking.mp4 ─→ Akool ───────→ swapped.mp4   │
│                                                                 │
│  Step 4: (Optional) B-Roll Generation                           │
│    text_prompt ─────────────→ Kling / Veo ─────→ broll.mp4     │
│                                                                 │
│  Step 5: (Optional) Compose / Edit                              │
│    talking.mp4 + broll.mp4 ──→ FFmpeg / Remotion → final.mp4   │
│                                                                 │
│  Step 6: Add Captions                                           │
│    final.mp4 + transcript ───→ Whisper/Deepgram → captioned.mp4 │
└─────────────────────────────────────────────────────────────────┘
  │
  ▼
Final Video URL → User Dashboard
```

### Key Insight: It's an async job queue

Video generation takes 1–5 minutes. Every serious tool uses:

1. **Frontend** submits a job → gets back a `jobId`
2. **Backend** pushes job to a queue (Redis/BullMQ, SQS, etc.)
3. **Worker** processes the job, calling APIs in sequence
4. **Webhook / polling** notifies the frontend when done
5. **Database** stores job status, video URLs, user history

---

## 3. In-House Models vs API Wrappers?

**Short answer: Almost all of them are API wrappers.**

| Tool | Avatar | Voice | Video Gen | Face Swap |
|------|--------|-------|-----------|-----------|
| **Creatify AI** | HeyGen API | ElevenLabs + own TTS | Kling/Runway | Akool / own |
| **JoggAI** | HeyGen / D-ID | ElevenLabs | Kling | Akool |
| **MakeUGC** | D-ID / HeyGen | ElevenLabs | N/A | Reface API |
| **Zeely AI** | HeyGen | Own TTS | Pika / Runway | Own |
| **AdGPT** | Own / HeyGen | ElevenLabs | Runway | N/A |
| **Superscale** | HeyGen | ElevenLabs | Runway ML | N/A |
| **Tagshop AI** | HeyGen | ElevenLabs | N/A | N/A |

### The Wrapper Premium

These tools charge $29–$499/month. The raw API costs per video:

| API | Cost per video |
|-----|---------------|
| ElevenLabs (voice) | ~$0.05–0.30 |
| D-ID / HeyGen (avatar) | ~$0.10–0.50 |
| Kling AI (video gen) | ~$0.14 per 5s |
| Akool (face swap) | ~$0.08 |
| **Total per video** | **~$0.37–$1.00** |

A $29/month plan offering 30 videos = $0.97/video price to user. Raw cost: ~$0.50/video. **Gross margin: ~50%**.

At scale this compounds beautifully.

### Do any have in-house models?

- **Synthesia** — Yes, they have proprietary avatar models (much higher quality, higher price)
- **HeyGen** — Increasingly in-house (bought their own diffusion model team)
- **D-ID** — Has in-house lip-sync model but uses Stable Diffusion for generation
- **ElevenLabs** — Fully proprietary TTS model
- **Kling AI** — In-house video diffusion model (Kuaishou's internal research)
- **Veo (Google)** — In-house (Google DeepMind)
- **Runway** — In-house Gen-2/Gen-3

> **Conclusion**: The SaaS wrappers (Creatify, JoggAI, etc.) orchestrate
> third-party APIs. The AI companies themselves (ElevenLabs, HeyGen, Kling)
> build proprietary models. You'd be building in the first category.

---

## 4. Tool-by-Tool Analysis

### Creatify AI (creatify.ai)
- **Focus**: AI UGC ads for performance marketing
- **Stack**: HeyGen avatars, ElevenLabs voices, Kling b-roll, custom caption engine
- **Price**: $39–$166/mo
- **Differentiator**: Deep ad platform integrations (Meta, TikTok), analytics, A/B test multiple videos

### JoggAI (jogg.ai)
- **Focus**: URL → UGC video (paste product URL, get video)
- **Stack**: D-ID/HeyGen, ElevenLabs, Kling AI
- **Price**: $8–$59/mo
- **Differentiator**: Product scraping + automatic script generation with LLM

### MakeUGC (makeugc.ai)
- **Focus**: Face-swap into existing UGC template videos
- **Stack**: Akool/Reface for face-swap, large library of template videos
- **Price**: $29–$99/mo
- **Differentiator**: Huge library of proven-performing template videos

### Zeely AI (zeely.app)
- **Focus**: Full marketing suite (landing pages + videos)
- **Stack**: HeyGen, proprietary TTS, Runway for video
- **Price**: $15–$49/mo

### AdGPT (adgpt.io)
- **Focus**: AI ad creative generation (static + video)
- **Stack**: GPT-4 for script, HeyGen for avatar, Runway for motion
- **Price**: $49–$199/mo

### PostEverywhere (posteverywhere.com)
- **Focus**: Social media scheduling + AI content generation
- **Stack**: AI content creation + video built on top of existing video APIs

### Superscale (superscale.ai)
- **Focus**: Gaming / app marketing specifically
- **Stack**: HeyGen, ElevenLabs, Runway

### Tagshop AI (tagshop.ai)
- **Focus**: Social commerce + shoppable video
- **Stack**: HeyGen for avatar video

---

## 5. The AI APIs Powering Everything

### Voice Synthesis

| API | Quality | Price | Free Tier | Best For |
|-----|---------|-------|-----------|---------|
| **ElevenLabs** | 5/5 | $5–$99/mo | 10k chars/mo | Production (used by everyone) |
| **OpenAI TTS** | 4/5 | $0.015/1k chars | No free tier | Budget option |
| **Murf AI** | 4/5 | $19–$49/mo | Limited | Voice cloning |
| **Play.ht** | 4/5 | $31–$99/mo | 12.5k chars/mo | Ultra-realistic voices |
| **Coqui TTS** | 3/5 | Free (open source) | Full | Self-hosted, free |
| **Kokoro TTS** | 4/5 | Free (open source) | Full | Best free quality |

### Talking-Head Avatar Generation

| API | Quality | Price | Free Tier | Best For |
|-----|---------|-------|-----------|---------|
| **D-ID** | 4/5 | $5.9–$299/mo | 5 free videos | Good lip-sync |
| **HeyGen** | 5/5 | $29–$89/mo | 1 free video | Best quality, most used |
| **Synthesia** | 5/5 | $22–$67/mo | No | Enterprise quality |
| **Tavus** | 5/5 | Custom pricing | No | Best face-cloning |
| **SadTalker** | 3/5 | Free (open source) | Full | Self-hosted |
| **MuseTalk** | 4/5 | Free (open source) | Full | Fast lip-sync |

### AI Video Generation (B-Roll / Full Scenes)

| API | Quality | Price | Free Tier | Best For |
|-----|---------|-------|-----------|---------|
| **Kling AI** | 5/5 | ~$7–$28/mo | 166 free credits | Best quality right now |
| **Google Veo 2** | 5/5 | Vertex AI pricing | Limited | Google ecosystem |
| **Runway Gen-3** | 5/5 | $15–$95/mo | 25 free credits | Creative control |
| **Pika 2.0** | 4/5 | $8–$28/mo | Limited free | Fast, good quality |
| **Wan 2.1** | 4/5 | Free (open source) | Full | Best open-source |
| **CogVideoX** | 3/5 | Free (open source) | Full | Self-hosted |

### Face Swap

| API | Quality | Price | Free Tier | Best For |
|-----|---------|-------|-----------|---------|
| **Akool** | 5/5 | ~$30–$100/mo | Limited | Best API quality |
| **Reface API** | 4/5 | Custom | No | Consumer-grade |
| **FaceSwapper.ai** | 3/5 | $9–$29/mo | 3 free swaps | Budget |
| **SimSwap** | 3/5 | Free (open source) | Full | Self-hosted |
| **InsightFace** | 4/5 | Free (open source) | Full | Best open-source |

### Script Generation (LLM)

| API | Price | Best For |
|-----|-------|---------|
| **OpenAI GPT-4o** | $2.50/1M tokens | Best quality scripts |
| **Anthropic Claude 3.5** | $3/1M tokens | Long-form creative |
| **Groq (Llama 3.3)** | Free tier | Fast, cheap |
| **Ollama (local)** | Free | Fully offline |

---

## 6. Building Your Own SaaS — Architecture

### System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND                                │
│              Next.js 15 App Router (TypeScript)                 │
│                                                                 │
│  Landing Page → Script Editor → Avatar Picker → Settings       │
│  Dashboard → Video History → Face Swap Tool → Pricing          │
└───────────────────────────┬─────────────────────────────────────┘
                            │ HTTPS
┌───────────────────────────▼─────────────────────────────────────┐
│                       NEXT.JS API ROUTES                        │
│                                                                 │
│  POST /api/generate-video    POST /api/face-swap                │
│  POST /api/voice-synthesis   GET  /api/avatars                  │
│  GET  /api/jobs/:id          POST /api/webhooks/:provider       │
└───────────────────────────┬─────────────────────────────────────┘
                            │
┌───────────────────────────▼─────────────────────────────────────┐
│                        JOB QUEUE                                │
│              Redis + BullMQ (or Upstash QStash)                 │
│                                                                 │
│  video-generation-queue  face-swap-queue  polling-queue         │
└───────────────────────────┬─────────────────────────────────────┘
                            │
┌───────────────────────────▼─────────────────────────────────────┐
│                       AI API LAYER                              │
│                                                                 │
│  ElevenLabs TTS  →  D-ID / HeyGen  →  Akool  →  Kling AI       │
└───────────────────────────┬─────────────────────────────────────┘
                            │
┌───────────────────────────▼─────────────────────────────────────┐
│                       DATA LAYER                                │
│                                                                 │
│  PostgreSQL (Supabase/Neon) + S3/R2 (video files)              │
│  NextAuth.js (auth) + Stripe (payments)                         │
└─────────────────────────────────────────────────────────────────┘
```

### Database Schema (simplified)

```sql
-- Users
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  plan TEXT DEFAULT 'free',
  videos_used_this_month INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Video Jobs
CREATE TABLE video_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  status TEXT DEFAULT 'pending',
  script TEXT NOT NULL,
  avatar_id TEXT NOT NULL,
  voice_id TEXT NOT NULL,
  settings JSONB,
  provider_job_id TEXT,
  output_url TEXT,
  thumbnail_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- Face Swap Jobs
CREATE TABLE face_swap_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  status TEXT DEFAULT 'pending',
  source_image_url TEXT,
  target_video_url TEXT,
  output_url TEXT,
  provider_job_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 7. Tech Stack and Project Structure

```
AIVideogenerator/
├── src/
│   ├── app/
│   │   ├── page.tsx                 # Landing page
│   │   ├── generate/page.tsx        # Video generation wizard
│   │   ├── pricing/page.tsx         # Pricing page
│   │   └── api/
│   │       ├── generate-video/      # Video generation endpoint
│   │       ├── voice-synthesis/     # ElevenLabs TTS endpoint
│   │       ├── face-swap/           # Akool face-swap endpoint
│   │       └── avatars/             # Avatar catalogue endpoint
│   ├── components/
│   │   └── video/
│   │       ├── VideoGenerator.tsx   # Main multi-step wizard
│   │       ├── AvatarCard.tsx       # Avatar selection card
│   │       ├── ScriptEditor.tsx     # Script editor with templates
│   │       └── VideoSettingsPanel.tsx
│   ├── lib/
│   │   ├── pipeline.ts              # Unified video generation pipeline
│   │   ├── elevenlabs.ts            # ElevenLabs TTS client
│   │   ├── kling.ts                 # Kling AI video gen client
│   │   ├── did.ts                   # D-ID talking avatar client
│   │   ├── heygen.ts                # HeyGen talking avatar client
│   │   ├── akool.ts                 # Akool face-swap client
│   │   └── utils.ts                 # Utility functions
│   └── types/
│       └── index.ts                 # TypeScript type definitions
├── .env.example                     # Environment variables template
└── Readme.md                        # This file
```

---

## 8. Initial Cost Breakdown

### Monthly costs for a solo-built SaaS (0–100 users, MVP stage)

| Item | Free Tier | Paid (starter) |
|------|-----------|----------------|
| **Hosting** (Vercel) | Free | $20/mo Pro |
| **Database** (Supabase) | Free (2 projects) | $25/mo Pro |
| **File Storage** (Cloudflare R2) | Free (10 GB) | $0.015/GB |
| **Auth** (NextAuth + Supabase) | Free | $0 |
| **Queue** (Upstash Redis) | Free (10k requests/day) | $10/mo |
| **ElevenLabs** | Free (10k chars/mo) | $5–$22/mo |
| **D-ID** | Free (5 videos/mo) | $5.9–$49/mo |
| **HeyGen** | 1 free video | $29/mo |
| **Akool** (face-swap) | Limited | ~$30/mo |
| **Kling AI** | Free credits | ~$7/mo |
| **Domain** | — | $10–15/year |
| **TOTAL MVP** | **~$0** | **~$127–$161/mo** |

### Revenue projection to break even at $29/mo starter plan:
- **Break even**: 5–6 paying users → $145–$174/mo
- That's very achievable for a solo dev.

### Realistic 12-month roadmap costs:
- **Month 1–3 (MVP)**: $0–50/mo (free tiers only)
- **Month 4–6 (10–50 users)**: $50–200/mo
- **Month 7–12 (50–200 users)**: $200–500/mo

---

## 9. Free Alternatives (Zero-Cost Stack)

Want to build with $0/month in API costs? Use open-source, self-hosted models:

### Self-Hosted Stack (GPU required)

| Component | Open-Source Alternative | Model | GPU VRAM |
|-----------|------------------------|-------|---------|
| **Voice Synthesis** | Coqui TTS / Kokoro | XTTS-v2 | 4GB |
| **Talking Avatar** | SadTalker / MuseTalk | Various | 8GB |
| **Video Generation** | Wan 2.1 / CogVideoX | Diffusion | 16–24GB |
| **Face Swap** | InsightFace / SimSwap | ONNX models | 4GB |
| **LLM (script)** | Ollama + Llama 3.3 | Llama 3.3 70B | 40GB |

**Cheapest GPU server**: RunPod / Vast.ai at ~$0.20–$0.60/hr (RTX 3090 / A40).
Run 100 videos in 2 hours = $0.40–$1.20 total vs $50+ with APIs.

### Cloud-Free Option (Colab)

Google Colab (free T4 GPU, ~4 hours/day) can run:
- MuseTalk for talking avatars
- Kokoro TTS for voice
- InsightFace for face-swap

**Limitations**: No persistent API server, 4h/day limit, slow.

### Recommended Zero-Cost Stack for Production

1. **Hosting**: Vercel (free)
2. **DB**: Supabase (free tier)
3. **GPU inference**: RunPod serverless (pay-per-use, ~$0.0002/sec)
4. **Models**: Wan 2.1 + MuseTalk + Kokoro + InsightFace
5. **Queue**: Upstash Redis (free tier)

Estimated cost: **~$0.30–0.60 per video** (GPU time only) vs $0.50–1.00 with commercial APIs.

---

## 10. Can You Build This Solo? (Vibe-Coding Guide)

### Yes, absolutely. Here's the honest assessment:

**What's hard:**
- Video composition / FFmpeg pipeline
- Managing async job queues at scale
- Rate limiting and error handling across multiple APIs
- Stripe + credit system integration
- Mobile-responsive video preview

**What's easy (with AI coding assistants):**
- Next.js frontend wizard (Cursor + Claude can do this in a day)
- API route scaffolding
- Tailwind UI components
- Database schema + queries (Prisma)

### 30-Day Solo Build Plan

| Week | Tasks | Tools |
|------|-------|-------|
| **Week 1** | Scaffold Next.js app, connect ElevenLabs + D-ID, basic UI | Cursor + Claude |
| **Week 2** | Job queue (BullMQ), video status polling, S3 upload | Cursor + v0.dev |
| **Week 3** | Face-swap (Akool), avatar library, script templates | Cursor |
| **Week 4** | Auth (NextAuth), Stripe billing, dashboard | Cursor + Vercel |
| **Launch** | Deploy to Vercel, ship to Product Hunt | — |

### Vibe-Coding Tips

1. **Use Cursor AI** with Claude 3.7 Sonnet — best for full-file code generation
2. **Use v0.dev** by Vercel for UI components — generates production-ready Tailwind
3. **Use Bolt.new** for rapid prototyping full-stack features
4. **Never build what an API already does** — use HeyGen/D-ID/ElevenLabs, not in-house models
5. **Ship fast, iterate** — your first 10 customers don't need 4K export or 50 avatar options

### Total Investment to MVP

| Resource | Cost |
|----------|------|
| Cursor Pro (3 months) | $60 |
| Vercel (free) | $0 |
| Supabase (free) | $0 |
| API keys (ElevenLabs/D-ID free tiers) | $0 |
| Domain | $12 |
| **Total** | **~$72** |

---

## 11. Quick Start

```bash
# 1. Clone the repo
git clone https://github.com/dugududu/AIVideogenerator
cd AIVideogenerator

# 2. Install dependencies
npm install

# 3. Configure environment variables
cp .env.example .env.local
# Fill in your API keys in .env.local

# 4. Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Minimum Required API Keys (for MVP)

You need at least one avatar provider + ElevenLabs:

```bash
# .env.local (minimum)
ELEVENLABS_API_KEY=your_key     # Free tier: 10k chars/mo
DID_API_KEY=your_key            # Free tier: 5 videos/mo
```

Get free API keys:
- ElevenLabs: https://elevenlabs.io → Sign up → Profile → API Key
- D-ID: https://studio.d-id.com → Account → API

---

## 12. API Reference

### POST /api/generate-video

Kick off a full UGC video generation pipeline.

```json
// Request
{
  "script": "Stop scrolling! This product changed my life...",
  "avatarIdOrUrl": "https://example.com/avatar.jpg",
  "voiceId": "21m00Tcm4TlvDq8ikWAM",
  "settings": {
    "aspectRatio": "9:16",
    "resolution": "1080p",
    "captions": true
  },
  "avatarProvider": "did"
}

// Response
{
  "jobId": "job_1234_abc123",
  "providerJobId": "tlk_xyz789",
  "status": "pending"
}
```

### POST /api/voice-synthesis

Generate MP3 audio from text.

```json
// Request
{ "text": "Hello world", "voiceId": "21m00Tcm4TlvDq8ikWAM" }

// Response: audio/mpeg binary
```

### GET /api/voice-synthesis

List available ElevenLabs voices.

### POST /api/face-swap

Submit a face-swap job.

```json
// Request
{
  "faceImageUrl": "https://example.com/face.jpg",
  "targetVideoUrl": "https://example.com/template.mp4"
}

// Response
{ "jobId": "akool_job_abc", "status": "pending" }
```

### GET /api/face-swap?jobId=xxx

Poll face-swap job status.

### GET /api/avatars

Get the avatar catalogue.

---

## 13. Roadmap

### Phase 1 — MVP (Current)
- [x] Next.js app scaffold
- [x] ElevenLabs TTS integration
- [x] D-ID talking avatar integration
- [x] HeyGen talking avatar integration
- [x] Akool face-swap integration
- [x] Kling AI video generation integration
- [x] Multi-step video generation wizard
- [x] Avatar selection UI
- [x] Script editor with hook templates
- [x] Video settings panel
- [x] Pricing page

### Phase 2 — Production Ready
- [ ] Job queue with BullMQ + Redis
- [ ] Supabase database integration
- [ ] S3 / Cloudflare R2 file upload
- [ ] NextAuth.js authentication
- [ ] User dashboard with video history
- [ ] Stripe billing + credit system
- [ ] Video preview player
- [ ] Auto-captions (Whisper API)
- [ ] Webhook handling from providers

### Phase 3 — Growth Features
- [ ] Voice cloning (ElevenLabs Instant Clone)
- [ ] Custom avatar upload
- [ ] Bulk video generation (CSV import)
- [ ] Direct social media publish (TikTok, Instagram API)
- [ ] A/B test multiple video variants
- [ ] Analytics dashboard (views, CTR per video)
- [ ] White-label option

### Phase 4 — Scale
- [ ] Self-hosted model option (MuseTalk + Kokoro + Wan 2.1)
- [ ] API-first offering (let others build on top)
- [ ] Team accounts + collaboration
- [ ] Custom avatar training (fine-tune on user's face)

---

## License

MIT — build your SaaS, sell it, keep the profits.

