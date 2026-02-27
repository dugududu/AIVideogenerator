import Link from "next/link";
import type { PricingPlan } from "@/types";

const PLANS: PricingPlan[] = [
  {
    id: "free",
    name: "Free",
    monthlyPrice: 0,
    yearlyPrice: 0,
    videosPerMonth: 3,
    features: [
      "3 AI avatar videos / month",
      "D-ID & HeyGen avatars",
      "ElevenLabs voice (free tier)",
      "720p export",
      "Watermark",
    ],
  },
  {
    id: "starter",
    name: "Starter",
    monthlyPrice: 29,
    yearlyPrice: 19,
    videosPerMonth: 30,
    highlighted: true,
    features: [
      "30 AI avatar videos / month",
      "All avatars + face-swap",
      "ElevenLabs Pro voices",
      "1080p export, no watermark",
      "Auto-captions",
      "Kling AI b-roll generation",
      "Email support",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    monthlyPrice: 99,
    yearlyPrice: 69,
    videosPerMonth: 150,
    features: [
      "150 AI avatar videos / month",
      "Voice cloning",
      "4K export",
      "Custom avatar upload",
      "API access",
      "Priority support",
      "White-label option",
    ],
  },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gray-950">
      {/* Nav */}
      <nav className="border-b border-gray-800 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link
            href="/"
            className="text-xl font-bold bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent"
          >
            UGC Studio
          </Link>
          <Link
            href="/generate"
            className="px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium transition-colors"
          >
            Start Free
          </Link>
        </div>
      </nav>

      <main className="px-6 py-20">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h1 className="text-4xl font-bold text-gray-100 mb-3">
              Simple, transparent pricing
            </h1>
            <p className="text-gray-400">
              You only pay for what you use. API costs are included in every plan.
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-6">
            {PLANS.map((plan) => (
              <div
                key={plan.id}
                className={`rounded-xl border p-6 flex flex-col ${
                  plan.highlighted
                    ? "border-violet-500 bg-violet-500/5 ring-1 ring-violet-500/20"
                    : "border-gray-800 bg-gray-900/50"
                }`}
              >
                {plan.highlighted && (
                  <div className="text-xs font-semibold text-violet-400 mb-3 uppercase tracking-wider">
                    Most Popular
                  </div>
                )}
                <div className="mb-4">
                  <h2 className="text-xl font-bold text-gray-100">{plan.name}</h2>
                  <div className="flex items-end gap-1 mt-2">
                    <span className="text-4xl font-bold text-gray-100">
                      ${plan.monthlyPrice}
                    </span>
                    <span className="text-gray-500 text-sm mb-1">/month</span>
                  </div>
                  {plan.yearlyPrice > 0 && (
                    <p className="text-xs text-green-400 mt-1">
                      ${plan.yearlyPrice}/mo billed annually
                    </p>
                  )}
                </div>

                <p className="text-sm text-gray-400 mb-4">
                  {plan.videosPerMonth} videos / month
                </p>

                <ul className="space-y-2 mb-6 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-gray-300">
                      <svg
                        className="w-4 h-4 text-green-400 mt-0.5 shrink-0"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      {f}
                    </li>
                  ))}
                </ul>

                <Link
                  href="/generate"
                  className={`w-full text-center py-2.5 rounded-lg text-sm font-semibold transition-all ${
                    plan.highlighted
                      ? "bg-violet-600 hover:bg-violet-500 text-white shadow-lg shadow-violet-500/20"
                      : "border border-gray-700 hover:border-gray-500 text-gray-300 hover:text-white"
                  }`}
                >
                  {plan.monthlyPrice === 0 ? "Get started free" : "Start 7-day trial"}
                </Link>
              </div>
            ))}
          </div>

          {/* Cost breakdown note */}
          <div className="mt-12 rounded-xl border border-gray-800 bg-gray-900/50 p-6">
            <h3 className="font-semibold text-gray-200 mb-2">
              💡 Underlying API costs (for reference)
            </h3>
            <p className="text-sm text-gray-400 mb-4">
              These are the raw API costs per video that our plans cover. This is how tools
              like Creatify AI and JoggAI are priced — they add a margin on top of API costs.
            </p>
            <div className="grid sm:grid-cols-2 gap-3">
              {[
                { provider: "ElevenLabs", cost: "~$0.30/min audio (Starter plan)", link: "https://elevenlabs.io/pricing" },
                { provider: "D-ID Talks", cost: "~$0.10/credit (~1 video)", link: "https://www.d-id.com/pricing" },
                { provider: "HeyGen", cost: "~$0.10–0.30/video min", link: "https://www.heygen.com/pricing" },
                { provider: "Kling AI", cost: "~$0.14/5s video (Std)", link: "https://klingai.com/pricing" },
                { provider: "Akool Face Swap", cost: "~$0.08/video", link: "https://akool.com/pricing" },
                { provider: "Vercel hosting", cost: "Free tier / $20/mo Pro", link: "https://vercel.com/pricing" },
              ].map((item) => (
                <div key={item.provider} className="flex items-start gap-3 text-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-violet-400 mt-2 shrink-0" />
                  <div>
                    <span className="text-gray-200 font-medium">{item.provider}:</span>{" "}
                    <span className="text-gray-400">{item.cost}</span>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-600 mt-4">
              * Costs are approximate and subject to change. Check each provider&apos;s pricing page.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
