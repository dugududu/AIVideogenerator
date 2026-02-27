import Link from "next/link";

const GITHUB_REPO_URL = "https://github.com/dugududu/AIVideogenerator";

const FEATURES = [
  {
    icon: "🎭",
    title: "AI Avatar Characters",
    desc: "Choose from 100+ realistic & animated AI avatars. Or upload your own photo for a personalised talking-head.",
  },
  {
    icon: "🎙️",
    title: "Voice Synthesis",
    desc: "Powered by ElevenLabs. 900+ voices across 28 languages. Clone your own voice in 60 seconds.",
  },
  {
    icon: "🔄",
    title: "Face Swap",
    desc: "Swap any face into template UGC videos in seconds. Powered by Akool's industry-leading face-swap API.",
  },
  {
    icon: "🎬",
    title: "AI Video Generation",
    desc: "Generate background b-roll scenes with Kling AI or Google Veo. Full 9:16 vertical video for TikTok & Reels.",
  },
  {
    icon: "📝",
    title: "Script Templates",
    desc: "Viral UGC hook templates with fill-in-the-blank scripts. Auto-captions included.",
  },
  {
    icon: "🚀",
    title: "1-Click Export",
    desc: "Export in any aspect ratio. Direct publish to TikTok, Instagram, YouTube and Meta Ads.",
  },
];

const HOW_IT_WORKS = [
  {
    step: "01",
    title: "Write or paste your script",
    desc: "Use our viral hook templates or write your own UGC ad script.",
  },
  {
    step: "02",
    title: "Pick an AI avatar & voice",
    desc: "Choose a realistic human avatar from D-ID / HeyGen and a voice from ElevenLabs.",
  },
  {
    step: "03",
    title: "Generate & download",
    desc: "Our pipeline calls ElevenLabs → D-ID/HeyGen → Kling in sequence. Your video is ready in 1–3 minutes.",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-950">
      {/* Nav */}
      <nav className="border-b border-gray-800 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <span className="text-xl font-bold bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
            UGC Studio
          </span>
          <div className="flex items-center gap-4">
            <Link href="/pricing" className="text-sm text-gray-400 hover:text-gray-200 transition-colors">
              Pricing
            </Link>
            <Link
              href="/generate"
              className="px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium transition-colors"
            >
              Start Free
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="px-6 py-24 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-1.5 text-sm text-violet-300 mb-6">
            <span className="w-2 h-2 rounded-full bg-violet-400 animate-pulse" />
            Powered by ElevenLabs · D-ID · HeyGen · Kling AI · Akool
          </div>
          <h1 className="text-5xl sm:text-6xl font-bold tracking-tight mb-6">
            Create AI UGC Videos{" "}
            <span className="bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
              in Minutes
            </span>
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-8">
            Generate studio-quality UGC ads with AI avatars, voice cloning, and face-swap
            technology. The same pipeline used by Creatify AI, JoggAI, and MakeUGC — now open source.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/generate"
              className="px-6 py-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold transition-all shadow-lg shadow-violet-500/25 text-base"
            >
              ✨ Create Your First Video — Free
            </Link>
            <a
              href="#how-it-works"
              className="px-6 py-3 rounded-xl border border-gray-700 hover:border-gray-500 text-gray-300 hover:text-white font-medium transition-all text-base"
            >
              How It Works ↓
            </a>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-6 py-16">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-12 text-gray-100">
            Everything you need to create viral UGC videos
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="rounded-xl border border-gray-800 bg-gray-900/50 p-5 hover:border-gray-700 transition-colors"
              >
                <div className="text-3xl mb-3">{f.icon}</div>
                <h3 className="font-semibold text-gray-100 mb-1">{f.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="px-6 py-16 border-t border-gray-800">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-12 text-gray-100">
            How it works
          </h2>
          <div className="grid sm:grid-cols-3 gap-8">
            {HOW_IT_WORKS.map((step) => (
              <div key={step.step} className="text-center">
                <div className="w-14 h-14 rounded-full bg-violet-500/10 border border-violet-500/30 flex items-center justify-center mx-auto mb-4">
                  <span className="text-violet-400 font-bold text-lg">{step.step}</span>
                </div>
                <h3 className="font-semibold text-gray-100 mb-2">{step.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech stack transparency */}
      <section className="px-6 py-16 border-t border-gray-800 bg-gray-900/30">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-xl font-bold text-gray-100 mb-3">
            Built transparently on the best AI APIs
          </h2>
          <p className="text-gray-400 text-sm mb-8 max-w-2xl mx-auto">
            Like Creatify, JoggAI, and other UGC tools, this platform orchestrates
            best-in-class third-party AI APIs. No proprietary black-box models —
            just smart orchestration on top of the best providers.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { name: "ElevenLabs", role: "Voice Synthesis" },
              { name: "D-ID / HeyGen", role: "Talking Avatars" },
              { name: "Kling AI / Veo", role: "Video Generation" },
              { name: "Akool", role: "Face Swap" },
            ].map((api) => (
              <div
                key={api.name}
                className="rounded-lg border border-gray-800 bg-gray-900 p-4"
              >
                <p className="font-medium text-gray-200 text-sm">{api.name}</p>
                <p className="text-xs text-gray-500 mt-0.5">{api.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-20 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold mb-4 text-gray-100">
            Ready to go viral?
          </h2>
          <p className="text-gray-400 mb-8">
            Start creating AI UGC videos for free. No credit card required.
          </p>
          <Link
            href="/generate"
            className="inline-block px-8 py-4 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold transition-all shadow-lg shadow-violet-500/25 text-base"
          >
            ✨ Create Your First Video
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 px-6 py-6 text-center text-xs text-gray-600">
        UGC Studio — Open-source AI video generator built on Next.js 15.
        See the <a href={GITHUB_REPO_URL} className="text-gray-500 hover:text-gray-400 underline">GitHub repo</a> for full research &amp; architecture notes.
      </footer>
    </div>
  );
}

