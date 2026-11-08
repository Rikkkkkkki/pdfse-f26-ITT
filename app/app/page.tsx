"use client";

import { useState, useEffect } from "react";
import { initPostHog, captureEvent } from "@/lib/posthog";

interface StackConfig {
  id: string;
  name: string;
  category: string;
  icon: string;
  tagline: string;
  coreTools: { role: string; tool: string; why: string }[];
  ruledOut: string[];
  day1Milestones: string[];
  command: string;
}

const STACKS: Record<string, StackConfig> = {
  web: {
    id: "web",
    name: "Next.js 15 + Tailwind CSS + Neon Postgres",
    category: "Full-Stack Web App",
    icon: "🌐",
    tagline: "The fastest path from an idea to a deployed SaaS or web product.",
    coreTools: [
      { role: "Framework", tool: "Next.js 15 (React + TypeScript)", why: "Unified frontend & backend with zero routing boilerplate." },
      { role: "Styling", tool: "Tailwind CSS", why: "Utility-first design with no CSS file context switching." },
      { role: "Database", tool: "Neon Postgres (Serverless)", why: "Instant cloud database with serverless connection pooling." },
      { role: "Hosting", tool: "Vercel", why: "Zero-config git push deployments with global CDN." },
    ],
    ruledOut: [
      "No Docker / Kubernetes configurations on Day 1",
      "No Redux or complex global state libraries",
      "No custom authentication server (use Clerk / NextAuth or session cookies)",
      "No switching to Svelte / Vue halfway through",
    ],
    day1Milestones: [
      "Run starter command and verify localhost:3000 loads",
      "Replace the hero heading with your real project idea",
      "Push commit to GitHub and link to free Vercel deployment",
    ],
    command: "npx create-next-app@latest my-app --typescript --tailwind --app --src-dir=false",
  },
  bot: {
    id: "bot",
    name: "Python 3.12 + python-telegram-bot + Render",
    category: "Telegram / Discord Bot",
    icon: "🤖",
    tagline: "Build a responsive chat automation bot in less than 50 lines.",
    coreTools: [
      { role: "Runtime", tool: "Python 3.12", why: "Clean, readable syntax with massive AI and API ecosystem." },
      { role: "Bot Library", tool: "python-telegram-bot (v21+)", why: "Modern async/await architecture with built-in handlers." },
      { role: "Database", tool: "SQLite (local) -> Supabase (cloud)", why: "Zero-setup local persistence that upgrades in 2 lines." },
      { role: "Hosting", tool: "Render Background Worker", why: "Free 24/7 background worker running polling loop." },
    ],
    ruledOut: [
      "No microservice brokers (Celery / RabbitMQ)",
      "No custom webhook SSL certificates (start with long-polling)",
      "No complex database migrations before the bot replies to 1 message",
    ],
    day1Milestones: [
      "Get bot token from @BotFather and save in .env",
      "Run sample ping-pong script and receive reply in Telegram",
      "Commit bot.py to GitHub and deploy worker on Render",
    ],
    command: "pip install python-telegram-bot python-dotenv",
  },
  game: {
    id: "game",
    name: "Godot Engine 4 (GDScript)",
    category: "2D / Indie Game",
    icon: "🎮",
    tagline: "Stop 20GB downloads and compilation loops. Build 2D games immediately.",
    coreTools: [
      { role: "Engine", tool: "Godot 4.3 Standard", why: "Single 50MB executable with instant startup and zero lag." },
      { role: "Language", tool: "GDScript", why: "Python-like syntax tightly coupled to engine node hierarchy." },
      { role: "Physics", tool: "Godot 2D Physics Engine", why: "Built-in CharacterBody2D handles collisions out of the box." },
      { role: "Distribution", tool: "Itch.io HTML5 Export", why: "1-click web export playable directly inside browser tabs." },
    ],
    ruledOut: [
      "No Unity vs Unreal engine debates (overkill for first game)",
      "No custom C++ engine architecture",
      "No complex 3D shader programming before basic movement works",
    ],
    day1Milestones: [
      "Download Godot (50MB) and create new 2D scene",
      "Add CharacterBody2D with Sprite and move with arrow keys",
      "Export HTML5 build and upload draft to Itch.io",
    ],
    command: "# Download Godot 4 from godotengine.org (no installation needed)",
  },
  mobile: {
    id: "mobile",
    name: "React Native + Expo",
    category: "Mobile App (iOS & Android)",
    icon: "📱",
    tagline: "Test native apps directly on your physical phone with a QR code.",
    coreTools: [
      { role: "Framework", tool: "Expo SDK 52", why: "Bypasses Xcode and Android Studio setup entirely for Day 1." },
      { role: "UI Library", tool: "React Native + NativeWind", why: "Tailwind syntax mapped directly to native mobile primitives." },
      { role: "Testing", tool: "Expo Go App", why: "Scan QR code to run live bundle on physical iPhone or Android." },
    ],
    ruledOut: [
      "No native Swift or Kotlin bridging on Day 1",
      "No manual CocoaPods / Gradle debugging",
      "No paid Apple Developer account required for testing",
    ],
    day1Milestones: [
      "Install Expo CLI and run npx create-expo-app",
      "Download Expo Go on phone and scan terminal QR code",
      "Change Text label on screen and watch phone hot-reload",
    ],
    command: "npx create-expo-app@latest my-mobile-app",
  },
};

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<string>("web");
  const [projectIdea, setProjectIdea] = useState<string>("");
  const [isCommitted, setIsCommitted] = useState<boolean>(false);
  const [checkedSteps, setCheckedSteps] = useState<number[]>([]);
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    initPostHog();
  }, []);

  const currentStack = STACKS[selectedCategory];

  const handleCommit = () => {
    setIsCommitted(true);
    captureEvent("user_commits_stack", {
      project_category: selectedCategory,
      stack_name: currentStack.name,
      project_idea: projectIdea.trim() || "Untitled Project",
      timestamp: new Date().toISOString(),
    });
  };

  const handleToggleStep = (index: number) => {
    const nextSteps = checkedSteps.includes(index)
      ? checkedSteps.filter((s) => s !== index)
      : [...checkedSteps, index];
    setCheckedSteps(nextSteps);

    captureEvent("milestone_step_toggled", {
      step_index: index,
      completed: !checkedSteps.includes(index),
      stack: currentStack.name,
    });
  };

  const handleCopyCommand = () => {
    navigator.clipboard.writeText(currentStack.command);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);

    captureEvent("starter_command_copied", {
      stack: currentStack.name,
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Top Banner / Problem Anchor */}
      <header className="border-b border-slate-800 bg-slate-900/60 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">🔒</span>
            <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-indigo-400 to-cyan-300 bg-clip-text text-transparent">
              StackLock
            </span>
            <span className="text-xs bg-indigo-900/60 text-indigo-300 px-2 py-0.5 rounded-full border border-indigo-700/50">
              Lab 6 Prototype · ITT
            </span>
          </div>
          <div className="text-xs text-slate-400 hidden sm:block">
            Evidence-backed anti-paralysis tool
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-4xl mx-auto px-4 py-8 sm:py-12 w-full">
        {/* Hero */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-amber-500/10 text-amber-300 border border-amber-500/20 mb-4">
            <span>⚡</span> Stop collecting courses. Start writing code.
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-4 leading-tight">
            Kill Starting Paralysis. <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-indigo-400 via-sky-300 to-emerald-400 bg-clip-text text-transparent">
              Lock One Stack Tonight.
            </span>
          </h1>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            Discovery showed learners spend weeks comparing 9-column spreadsheets and hoarding Notion playlists.
            StackLock eliminates the illusion of choice. Pick your goal, lock your stack, and execute Day 1 in 30 minutes.
          </p>
        </div>

        {/* Step 1: Goal Selection */}
        <section className="mb-10">
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
            Step 1 · What kind of project are you building?
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {Object.entries(STACKS).map(([key, config]) => {
              const isSelected = selectedCategory === key;
              return (
                <button
                  key={key}
                  disabled={isCommitted}
                  onClick={() => {
                    setSelectedCategory(key);
                    setCheckedSteps([]);
                  }}
                  className={`p-4 rounded-xl border text-left transition-all flex flex-col justify-between ${
                    isSelected
                      ? "border-indigo-500 bg-indigo-950/40 shadow-lg shadow-indigo-500/10 ring-1 ring-indigo-500"
                      : "border-slate-800 bg-slate-900/50 hover:border-slate-700 hover:bg-slate-900"
                  } ${isCommitted ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}`}
                >
                  <div className="text-2xl mb-2">{config.icon}</div>
                  <div>
                    <div className="font-semibold text-sm text-white">{config.category}</div>
                    <div className="text-xs text-slate-400 mt-1 line-clamp-1">{config.name}</div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Project Idea Input */}
          <div className="mt-4">
            <label className="block text-xs text-slate-400 mb-1.5">
              Your one-sentence project idea (optional):
            </label>
            <input
              type="text"
              disabled={isCommitted}
              value={projectIdea}
              onChange={(e) => setProjectIdea(e.target.value)}
              placeholder="e.g. Budgeting tracker for university students with weekly summaries"
              className="w-full px-4 py-2.5 rounded-lg border border-slate-800 bg-slate-900/70 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 disabled:opacity-60"
            />
          </div>
        </section>

        {/* Step 2: The Locked Decision Card */}
        <section className="mb-10">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Step 2 · Your Single, Non-Negotiable Stack
            </span>
            <span className="text-xs text-emerald-400 font-mono flex items-center gap-1">
              <span>●</span> Zero alternatives allowed
            </span>
          </div>

          <div className="p-6 rounded-2xl border border-indigo-900/50 bg-gradient-to-b from-indigo-950/30 to-slate-900/70 backdrop-blur-sm relative overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800/80">
              <div>
                <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">
                  Locked Stack Decision
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-white mt-0.5">
                  {currentStack.name}
                </h2>
                <p className="text-sm text-slate-400 mt-1">{currentStack.tagline}</p>
              </div>
              <div className="text-3xl sm:text-4xl self-start sm:self-center bg-slate-800/80 p-3 rounded-xl border border-slate-700/50">
                {currentStack.icon}
              </div>
            </div>

            {/* Architecture Pillars */}
            <div className="grid sm:grid-cols-2 gap-4 py-6 border-b border-slate-800/80">
              {currentStack.coreTools.map((tool, idx) => (
                <div key={idx} className="bg-slate-900/60 p-3.5 rounded-xl border border-slate-800">
                  <div className="text-xs text-indigo-400 font-semibold">{tool.role}</div>
                  <div className="font-medium text-slate-100 text-sm mt-0.5">{tool.tool}</div>
                  <div className="text-xs text-slate-400 mt-1">{tool.why}</div>
                </div>
              ))}
            </div>

            {/* What is Ruled Out (Anti-Paralysis Boundary) */}
            <div className="pt-6">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-rose-400 mb-2.5">
                ⛔ Strictly Ruled Out (Do Not Waste Time On):
              </h3>
              <ul className="grid sm:grid-cols-2 gap-2 text-xs text-slate-400">
                {currentStack.ruledOut.map((item, idx) => (
                  <li key={idx} className="flex items-start space-x-2">
                    <span className="text-rose-500 font-bold shrink-0">✕</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Step 3: Commitment & Day 1 Action */}
        <section className="mb-10">
          {!isCommitted ? (
            <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/40 text-center">
              <h3 className="text-lg font-bold text-white mb-2">Ready to Stop Second-Guessing?</h3>
              <p className="text-sm text-slate-400 max-w-md mx-auto mb-6">
                Clicking commit locks this decision. It registers your North Star commitment and opens your 30-minute Day 1 milestone runbook.
              </p>
              <button
                onClick={handleCommit}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-lg shadow-indigo-600/30 transition-all transform active:scale-95 flex items-center justify-center gap-2 mx-auto cursor-pointer"
              >
                <span>🔒</span> Commit to This Stack & Start Day 1
              </button>
            </div>
          ) : (
            <div className="p-6 rounded-2xl border border-emerald-500/50 bg-emerald-950/20 animate-in fade-in duration-300">
              <div className="flex items-center justify-between pb-4 border-b border-emerald-900/40">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                    ✓
                  </div>
                  <div>
                    <h3 className="font-bold text-emerald-300 text-base">Decision Locked & Recorded</h3>
                    <p className="text-xs text-emerald-400/80">
                      North Star Event <code className="bg-emerald-950 px-1 py-0.5 rounded">user_commits_stack</code> fired to PostHog.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsCommitted(false)}
                  className="text-xs text-slate-500 hover:text-slate-300 underline cursor-pointer"
                >
                  Change Selection
                </button>
              </div>

              {/* Day 1 Runbook */}
              <div className="mt-6">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                    Day 1 Milestone Checklist (Complete Tonight in &lt; 30 mins)
                  </h4>
                  <span className="text-xs text-indigo-400 font-mono">
                    {checkedSteps.length} of {currentStack.day1Milestones.length} done
                  </span>
                </div>

                <div className="space-y-2 mb-6">
                  {currentStack.day1Milestones.map((milestone, idx) => {
                    const isChecked = checkedSteps.includes(idx);
                    return (
                      <div
                        key={idx}
                        onClick={() => handleToggleStep(idx)}
                        className={`p-3 rounded-lg border text-sm flex items-start space-x-3 cursor-pointer transition-all ${
                          isChecked
                            ? "bg-slate-900/90 border-emerald-500/50 text-slate-300 line-through"
                            : "bg-slate-900/50 border-slate-800 text-slate-200 hover:border-slate-700"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {}}
                          className="mt-1 h-4 w-4 rounded border-slate-700 text-indigo-600 focus:ring-0 cursor-pointer"
                        />
                        <span>{milestone}</span>
                      </div>
                    );
                  })}
                </div>

                {/* Command Block */}
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
                    <span>Copy starter setup command:</span>
                    <button
                      onClick={handleCopyCommand}
                      className="text-indigo-400 hover:text-indigo-300 font-medium cursor-pointer"
                    >
                      {copied ? "✓ Copied!" : "Copy Command"}
                    </button>
                  </div>
                  <pre className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 font-mono text-xs text-slate-200 overflow-x-auto">
                    {currentStack.command}
                  </pre>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* Milestone 2 / Lab 6 Evidence Footer */}
        <footer className="pt-8 border-t border-slate-800/80 text-center text-xs text-slate-500 space-y-1">
          <div>Team ITT · CS-PD Fall 2026 · Week 7 Ship Gate Prototype</div>
          <div>Analytics configured for PostHog event logging under <code>03-build/analytics/event-schema.md</code></div>
        </footer>
      </main>
    </div>
  );
}
