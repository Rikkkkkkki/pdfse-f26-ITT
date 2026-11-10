"use client";

import { useState, useEffect, useRef } from "react";
import type { FormEvent } from "react";
import { Syne, IBM_Plex_Sans, IBM_Plex_Mono } from "next/font/google";
import { initPostHog, captureEvent } from "@/lib/posthog";
import { STACKS, STACK_ORDER, type StackId } from "@/lib/stacks";

const display = Syne({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  weight: ["600", "700", "800"],
});
const body = IBM_Plex_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});
const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const STORAGE_KEY = "stacklock:v2";

const RANDOM_IDEAS = [
  "A Telegram bot that reminds me to drink water",
  "A 2D game where a square dodges taxes",
  "A habit tracker that yells at me",
  "A mobile app for rating local park benches",
  "A web dashboard for my job applications",
];

interface SavedState {
  selected: StackId;
  idea: string;
  committedAt: number | null;
  hasCommittedBefore: boolean;
  checked: number[];
  proofUrl: string | null;
}

type CopyState = "idle" | "copied" | "failed";

function minutesSince(ts: number | null): number | null {
  return ts === null ? null : Math.round((Date.now() - ts) / 60000);
}

function Padlock({
  locked,
  className = "",
  snap = false,
}: {
  locked: boolean;
  className?: string;
  snap?: boolean;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={`${className} ${snap ? "sl-snap" : ""}`}
    >
      <rect
        x="4"
        y="11"
        width="16"
        height="10"
        rx="2"
        fill={locked ? "currentColor" : "none"}
      />
      <path
        d={
          locked
            ? "M7.5 11V8a4.5 4.5 0 0 1 9 0v3"
            : "M7.5 11V8a4.5 4.5 0 0 1 8.6-1.9"
        }
      />
    </svg>
  );
}

export default function Home() {
  const [selected, setSelected] = useState<StackId>("web");
  const [idea, setIdea] = useState("");
  const [committedAt, setCommittedAt] = useState<number | null>(null);
  const [hasCommittedBefore, setHasCommittedBefore] = useState(false);
  const [checked, setChecked] = useState<number[]>([]);
  const [proofUrl, setProofUrl] = useState<string | null>(null);
  const [proofDraft, setProofDraft] = useState("");
  const [proofError, setProofError] = useState<string | null>(null);
  const [copyState, setCopyState] = useState<CopyState>("idle");
  const [hydrated, setHydrated] = useState(false);
  const [lockSnap, setLockSnap] = useState(false);
  const [unlockConfirm, setUnlockConfirm] = useState(false);
  const [isCelebrating, setIsCelebrating] = useState(false);

  const loadedAt = useRef<number>(Date.now());
  const selectionCount = useRef(0);
  const buildRef = useRef<HTMLElement | null>(null);

  const stack = STACKS[selected];
  const isCommitted = committedAt !== null;
  const total = stack.day1Milestones.length;

  useEffect(() => {
    initPostHog();
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const s = JSON.parse(raw) as Partial<SavedState>;
        if (s.selected && s.selected in STACKS) setSelected(s.selected);
        if (typeof s.idea === "string") setIdea(s.idea);
        if (typeof s.committedAt === "number") setCommittedAt(s.committedAt);
        if (s.hasCommittedBefore) setHasCommittedBefore(true);
        if (Array.isArray(s.checked))
          setChecked(s.checked.filter((n) => Number.isInteger(n)));
        if (typeof s.proofUrl === "string") setProofUrl(s.proofUrl);
      }
    } catch {}
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      const state: SavedState = {
        selected,
        idea,
        committedAt,
        hasCommittedBefore,
        checked,
        proofUrl,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {}
  }, [
    hydrated,
    selected,
    idea,
    committedAt,
    hasCommittedBefore,
    checked,
    proofUrl,
  ]);

  const handleSelect = (id: StackId) => {
    if (isCommitted || id === selected) return;
    selectionCount.current += 1;
    captureEvent("stack_selected", {
      stack_id: id,
      previous_stack_id: selected,
      selection_count: selectionCount.current,
    });
    setSelected(id);
    setChecked([]);
  };

  const handleRollDice = () => {
    const newIdea =
      RANDOM_IDEAS[Math.floor(Math.random() * RANDOM_IDEAS.length)];
    setIdea(newIdea);
  };

  const handleCommit = () => {
    captureEvent(
      hasCommittedBefore ? "stack_recommitted" : "user_commits_stack",
      {
        stack_id: selected,
        stack_name: stack.name,
        has_idea: idea.trim().length > 0,
        stacks_viewed: selectionCount.current + 1,
        ms_since_page_load: Date.now() - loadedAt.current,
      },
    );
    setCommittedAt(Date.now());
    setHasCommittedBefore(true);
    setUnlockConfirm(false);
    setLockSnap(true);
    window.setTimeout(() => setLockSnap(false), 400);
    window.setTimeout(() => {
      buildRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  const handleChangeSelection = () => {
    if (!unlockConfirm) {
      setUnlockConfirm(true);
      return;
    }
    captureEvent("change_selection_clicked", {
      stack_id: selected,
      steps_done: checked.length,
      minutes_since_commit: minutesSince(committedAt),
      had_proof: proofUrl !== null,
    });
    setCommittedAt(null);
    setChecked([]);
    setProofUrl(null);
    setProofDraft("");
    setProofError(null);
    setUnlockConfirm(false);
  };

  const handleToggleStep = (index: number) => {
    const completed = !checked.includes(index);
    setChecked(
      completed ? [...checked, index] : checked.filter((s) => s !== index),
    );
    captureEvent("milestone_step_toggled", {
      stack_id: selected,
      step_index: index,
      completed,
      minutes_since_commit: minutesSince(committedAt),
    });
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(stack.command);
      setCopyState("copied");
      captureEvent("starter_command_copied", { stack_id: selected });
    } catch {
      setCopyState("failed");
    }
    setTimeout(() => setCopyState("idle"), 2000);
  };

  const handleSubmitProof = (e: FormEvent) => {
    e.preventDefault();
    let url: URL;
    try {
      url = new URL(proofDraft.trim());
      if (url.protocol !== "https:" && url.protocol !== "http:")
        throw new Error("protocol");
    } catch {
      setProofError("Paste a full link that starts with https://");
      return;
    }
    setProofError(null);
    setProofUrl(url.href);
    setIsCelebrating(true);
    captureEvent("day1_proof_submitted", {
      stack_id: selected,
      proof_host: url.hostname,
      steps_done: checked.length,
      minutes_since_commit: minutesSince(committedAt),
    });
  };

  const commandLabel =
    stack.commandKind === "link" ? "download link" : "starter command";
  const copyLabel =
    copyState === "copied"
      ? "copied ✓"
      : copyState === "failed"
        ? "failed — select text"
        : "copy";

  return (
    <div
      className={`${display.variable} ${body.variable} ${mono.variable} sl-shell relative text-[var(--ink)]`}
      style={{ fontFamily: "var(--font-body), system-ui, sans-serif" }}
    >
      <div className="sl-noise" aria-hidden="true" />

      {/* Header */}
      <header className="relative z-10 border-b border-[var(--line)] bg-[var(--panel)]/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-[1120px] items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <span
              className={`grid h-8 w-8 place-items-center rounded-lg border shadow-sm ${isCommitted ? "border-[var(--amber)] bg-[var(--amber-soft)] text-[var(--amber)]" : "border-[var(--line-strong)] bg-black/20 text-[var(--muted)]"}`}
            >
              <Padlock locked={isCommitted} snap={lockSnap} />
            </span>
            <div className="leading-none">
              <div
                className="text-lg font-extrabold tracking-tight"
                style={{ fontFamily: "var(--font-display), sans-serif" }}
              >
                StackLock
              </div>
              <div className="mt-1 font-[family-name:var(--font-mono)] text-[10px] tracking-[0.2em] text-[var(--dim)] uppercase font-semibold">
                day-1 commit tool
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4 font-[family-name:var(--font-mono)] text-[11px] font-medium text-[var(--dim)]">
            <span className="hidden items-center gap-2 sm:inline-flex rounded-full border border-[var(--line)] bg-black/20 px-3 py-1">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--green)] animate-pulse" />{" "}
              live · no login
            </span>
            <span>lab 6 · itt</span>
          </div>
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-[1120px] px-6 py-12">
        {/* Hero Section */}
        <section className="sl-rise mb-10 grid items-end gap-6 border-b border-[var(--line)] pb-10 md:grid-cols-[1fr_auto]">
          <div>
            <h1
              className="max-w-2xl text-[clamp(2rem,4vw,3rem)] leading-[1.1] font-extrabold tracking-tight text-white text-balance"
              style={{ fontFamily: "var(--font-display), sans-serif" }}
            >
              Pick one stack. <br className="hidden md:block" />
              <span className="text-[var(--green)]">Ship it tonight.</span>
              <span
                className="sl-blink ml-2 inline-block h-[0.8em] w-[0.45ch] translate-y-[0.1em] bg-[var(--green)] align-baseline"
                aria-hidden="true"
              />
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-[var(--muted)] font-medium">
              Comparing courses feels like progress but ships nothing. Choose a
              category, lock the stack, finish three steps, paste proof.
            </p>
          </div>
          <div className="font-[family-name:var(--font-mono)] text-xs leading-6 text-[var(--dim)] md:text-right p-4 rounded-lg bg-black/20 border border-[var(--line)]">
            <div>
              target <span className="text-[var(--muted)] ml-2">~30 min</span>
            </div>
            <div>
              north star{" "}
              <span className="text-[var(--muted)] ml-2">lock commit</span>
            </div>
            <div>
              status{" "}
              <span
                className={`ml-2 font-bold ${isCommitted ? "text-[var(--amber)]" : "text-[var(--muted)]"}`}
              >
                {isCommitted ? "locked" : "awaiting lock"}
              </span>
            </div>
          </div>
        </section>

        {/* Builder Workspace */}
        <section
          aria-labelledby="choose-heading"
          className="sl-rise overflow-hidden rounded-2xl border border-[var(--line-strong)] bg-[var(--panel)] shadow-[0_32px_96px_rgba(0,0,0,0.5)]"
          style={{ animationDelay: "60ms" }}
        >
          <div className="flex items-center justify-between border-b border-[var(--line)] bg-[var(--panel-2)] px-5 py-3">
            <div className="flex items-center gap-2 font-[family-name:var(--font-mono)] text-[11px] text-[var(--dim)]">
              <span className="h-3 w-3 rounded-full bg-[#ff5f57] border border-black/20" />
              <span className="h-3 w-3 rounded-full bg-[#febc2e] border border-black/20" />
              <span className="h-3 w-3 rounded-full bg-[#28c840] border border-black/20" />
              <span className="ml-3 font-semibold tracking-wide">
                stacklock://select
              </span>
            </div>
            <span className="font-[family-name:var(--font-mono)] text-[11px] font-bold tracking-wider text-[var(--dim)] uppercase">
              {isCommitted ? "mode: locked" : "mode: choose"}
            </span>
          </div>

          <div className="grid lg:grid-cols-[340px_1fr]">
            {/* Sidebar */}
            <div className="border-b border-[var(--line)] lg:border-r lg:border-b-0 bg-[#070a0e]/50">
              <div className="border-b border-[var(--line)] px-5 py-4">
                <h2
                  id="choose-heading"
                  className="font-[family-name:var(--font-mono)] text-[11px] font-bold tracking-[0.2em] text-[var(--dim)] uppercase"
                >
                  {isCommitted ? "locked stack" : "what are you building?"}
                </h2>
              </div>
              <ul role="group" aria-labelledby="choose-heading">
                {STACK_ORDER.map((key, index) => {
                  const config = STACKS[key];
                  const isSelected = selected === key;
                  if (isCommitted && !isSelected) return null;
                  return (
                    <li key={key}>
                      <button
                        type="button"
                        aria-pressed={isSelected}
                        disabled={isCommitted}
                        onClick={() => handleSelect(key)}
                        className={`relative flex w-full items-center gap-4 border-b border-[var(--line)] px-5 py-4 text-left last:border-b-0 transition-colors focus:outline-none focus-visible:bg-[var(--green-soft)] ${isSelected ? "bg-[var(--green-soft)]" : "hover:bg-white/[0.04] cursor-pointer"} ${isCommitted ? "cursor-default" : ""}`}
                      >
                        {isSelected && (
                          <span
                            aria-hidden="true"
                            className="absolute inset-y-0 left-0 w-1 bg-[var(--green)] shadow-[0_0_10px_rgba(57,217,138,0.5)]"
                          />
                        )}
                        <span className="font-[family-name:var(--font-mono)] text-[11px] font-bold text-[var(--dim)]">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span
                            className="block text-base font-bold tracking-tight text-white"
                            style={{
                              fontFamily: "var(--font-display), sans-serif",
                            }}
                          >
                            {config.category}
                          </span>
                          <span className="mt-1 block truncate font-[family-name:var(--font-mono)] text-xs text-[var(--muted)]">
                            {config.name}
                          </span>
                        </span>
                        {isCommitted && isSelected ? (
                          <Padlock
                            locked
                            snap={lockSnap}
                            className="text-[var(--amber)]"
                          />
                        ) : (
                          <span
                            aria-hidden="true"
                            className={`h-4 w-4 shrink-0 rounded-full border-2 ${isSelected ? "border-[var(--green)] bg-[var(--green)] shadow-[0_0_10px_rgba(57,217,138,0.3)]" : "border-[var(--line-strong)]"}`}
                          />
                        )}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Content Area */}
            <div className="flex flex-col">
              <div className="border-b border-[var(--line)] px-6 py-6">
                <p className="font-[family-name:var(--font-mono)] text-xs font-bold tracking-[0.2em] text-[var(--green)] uppercase">
                  {stack.id} · selected
                </p>
                <h3
                  className="mt-2 text-3xl font-extrabold tracking-tight text-white"
                  style={{ fontFamily: "var(--font-display), sans-serif" }}
                >
                  {stack.category}
                </h3>
                <p className="mt-2 max-w-lg text-base leading-relaxed text-[var(--muted)]">
                  {stack.tagline}
                </p>
              </div>

              <div className="grid flex-1 gap-0 md:grid-cols-2">
                <div className="border-b border-[var(--line)] px-6 py-5 md:border-r md:border-b-0 bg-black/10">
                  <h4 className="font-[family-name:var(--font-mono)] text-[10px] font-bold tracking-[0.2em] text-[var(--dim)] uppercase">
                    you will use
                  </h4>
                  <dl className="mt-4 space-y-4">
                    {stack.coreTools.map((tool) => (
                      <div key={tool.role}>
                        <dt className="font-[family-name:var(--font-mono)] text-[10px] font-semibold tracking-wider text-[var(--dim)] uppercase">
                          {tool.role}
                        </dt>
                        <dd className="mt-1">
                          <div className="text-sm font-bold tracking-tight text-[var(--ink)]">
                            {tool.tool}
                          </div>
                          <div className="mt-1 text-xs leading-relaxed text-[var(--muted)]">
                            {tool.why}
                          </div>
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>

                <div className="px-6 py-5 bg-black/10">
                  <h4 className="font-[family-name:var(--font-mono)] text-[10px] font-bold tracking-[0.2em] text-[var(--dim)] uppercase">
                    skip for now
                  </h4>
                  <ul className="mt-4 space-y-3">
                    {stack.skipForNow.map((item) => (
                      <li
                        key={item}
                        className="flex gap-3 text-sm leading-snug text-[var(--muted)] items-start"
                      >
                        <span className="font-[family-name:var(--font-mono)] text-[var(--danger)] font-bold">
                          //
                        </span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Commit Bar */}
              <div className="mt-auto border-t border-[var(--line)] bg-[var(--panel-2)] px-6 py-6">
                <label
                  htmlFor="idea"
                  className="font-[family-name:var(--font-mono)] text-[10px] font-bold tracking-[0.2em] text-[var(--dim)] uppercase"
                >
                  project in one sentence{" "}
                  <span className="ml-2 normal-case font-normal tracking-normal opacity-70">
                    optional
                  </span>
                </label>
                <div className="mt-3 flex gap-2">
                  <input
                    id="idea"
                    type="text"
                    disabled={isCommitted}
                    value={idea}
                    onChange={(e) => setIdea(e.target.value)}
                    placeholder="A budgeting tracker for university students..."
                    className="w-full rounded-lg border border-[var(--line-strong)] bg-black/40 px-4 py-3 font-[family-name:var(--font-mono)] text-sm text-[var(--ink)] placeholder:text-[var(--dim)] focus:border-[var(--green)] focus:ring-1 focus:ring-[var(--green)] focus:outline-none disabled:opacity-50 transition-colors"
                  />
                  {!isCommitted && (
                    <button
                      type="button"
                      onClick={handleRollDice}
                      className="shrink-0 rounded-lg border border-[var(--line-strong)] bg-black/40 px-4 py-3 hover:border-[var(--green)] focus:outline-none transition-colors cursor-pointer"
                      aria-label="Random Idea"
                      title="Roll for a random idea"
                    >
                      🎲
                    </button>
                  )}
                </div>

                {!isCommitted ? (
                  <div className="mt-6 flex flex-wrap items-center gap-4">
                    <button
                      type="button"
                      onClick={handleCommit}
                      className="inline-flex items-center gap-2 rounded-lg bg-[var(--amber)] px-6 py-3.5 font-[family-name:var(--font-mono)] text-sm font-bold tracking-wide text-[#1a1405] hover:bg-[#ffcd57] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--green)] transition-colors shadow-[0_0_15px_rgba(245,193,74,0.2)] cursor-pointer"
                    >
                      <Padlock locked={false} /> lock this stack & start
                    </button>
                    <p className="max-w-xs font-[family-name:var(--font-mono)] text-[11px] leading-relaxed text-[var(--dim)]">
                      Opens 3 Day 1 steps. No login required.
                    </p>
                  </div>
                ) : (
                  <div className="mt-4 flex items-center justify-between">
                    <p className="inline-flex items-center gap-2 font-[family-name:var(--font-mono)] text-xs font-bold text-[var(--amber)] bg-[var(--amber-soft)] px-3 py-1.5 rounded-md border border-[var(--amber)]/20">
                      <Padlock locked snap={lockSnap} /> stack locked · proceed
                      below
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Milestone Tracker */}
        {isCommitted && (
          <section
            ref={buildRef}
            aria-labelledby="build"
            className="sl-rise mt-8 scroll-mt-10 overflow-hidden rounded-2xl border border-[var(--line-strong)] bg-[var(--panel)] shadow-[0_32px_96px_rgba(0,0,0,0.5)]"
          >
            <div className="flex items-center justify-between border-b border-[var(--line)] bg-[var(--panel-2)] px-6 py-4">
              <div>
                <p className="font-[family-name:var(--font-mono)] text-[10px] font-bold tracking-[0.2em] text-[var(--dim)] uppercase">
                  execute · day 1
                </p>
                <h2
                  id="build"
                  className="mt-1 text-xl font-extrabold tracking-tight text-white"
                  style={{ fontFamily: "var(--font-display), sans-serif" }}
                >
                  Your three steps
                </h2>
              </div>
              <div
                className="font-[family-name:var(--font-mono)] text-base font-bold text-[var(--green)] bg-[var(--green-soft)] px-3 py-1 rounded-md border border-[var(--green)]/20"
                aria-live="polite"
              >
                {checked.length} / {total}
              </div>
            </div>

            <div className="h-1.5 bg-[var(--line)]" aria-hidden="true">
              <div
                className="h-full bg-[var(--green)] transition-all duration-500 ease-out shadow-[0_0_10px_rgba(57,217,138,0.5)]"
                style={{ width: `${(checked.length / total) * 100}%` }}
              />
            </div>

            <ol>
              {stack.day1Milestones.map((milestone, idx) => {
                const isChecked = checked.includes(idx);
                return (
                  <li key={milestone} className="border-b border-[var(--line)]">
                    <label
                      className={`flex cursor-pointer items-start gap-5 px-6 py-5 transition-colors ${isChecked ? "bg-[var(--green-soft)]" : "hover:bg-white/[0.02]"}`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => handleToggleStep(idx)}
                        className="peer sr-only"
                      />
                      <span
                        aria-hidden="true"
                        className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg border font-[family-name:var(--font-mono)] text-[12px] font-bold peer-focus-visible:ring-2 peer-focus-visible:ring-[var(--green)] transition-all ${isChecked ? "border-[var(--green)] bg-[var(--green)] text-[#04140c] shadow-[0_0_10px_rgba(57,217,138,0.3)]" : "border-[var(--line-strong)] bg-black/20 text-[var(--muted)]"}`}
                      >
                        {isChecked ? "✓" : String(idx + 1).padStart(2, "0")}
                      </span>
                      <span
                        className={`pt-1 text-base font-medium leading-relaxed transition-colors duration-300 ${isChecked ? "text-[var(--dim)] line-through decoration-[var(--dim)]" : "text-white"}`}
                      >
                        {milestone}
                      </span>
                    </label>
                  </li>
                );
              })}
            </ol>

            <div className="border-b border-[var(--line)] px-6 py-5 bg-black/10">
              <div className="mb-3 flex items-center justify-between">
                <span className="font-[family-name:var(--font-mono)] text-[11px] font-bold tracking-[0.2em] text-[var(--dim)] uppercase">
                  {commandLabel}
                </span>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="font-[family-name:var(--font-mono)] text-[11px] font-bold text-[var(--green)] hover:text-white focus:outline-none transition-colors cursor-pointer bg-[var(--green-soft)] px-3 py-1.5 rounded-md border border-[var(--green)]/20"
                >
                  {copyLabel}
                </button>
              </div>
              <pre className="overflow-x-auto rounded-lg border border-[var(--line-strong)] bg-black/40 px-5 py-4 font-[family-name:var(--font-mono)] text-sm leading-relaxed text-[var(--green)] shadow-inner">
                <span className="select-none text-[var(--dim)] mr-2">❯</span>
                {stack.command}
              </pre>
            </div>

            <div className={`px-6 py-8 ${isCelebrating ? "sl-celebrate" : ""}`}>
              <h3
                className="text-xl font-extrabold tracking-tight text-white"
                style={{ fontFamily: "var(--font-display), sans-serif" }}
              >
                Paste what you shipped
              </h3>
              {proofUrl ? (
                <div className="mt-4 rounded-xl border-2 border-[var(--green)] bg-[var(--green-soft)] px-5 py-4 shadow-[0_0_20px_rgba(57,217,138,0.15)]">
                  <p className="font-[family-name:var(--font-mono)] text-[10px] font-bold tracking-[0.2em] text-[var(--green)] uppercase flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-[var(--green)] animate-pulse" />{" "}
                    Ship Recorded
                  </p>
                  <a
                    href={proofUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 block break-all font-[family-name:var(--font-mono)] text-base font-medium text-white hover:text-[var(--green)] underline underline-offset-4 decoration-[var(--green)]/50 transition-colors"
                  >
                    {proofUrl}
                  </a>
                </div>
              ) : (
                <form onSubmit={handleSubmitProof} noValidate className="mt-4">
                  <label
                    htmlFor="proof"
                    className="block text-sm font-medium text-[var(--muted)]"
                  >
                    {stack.proofHint}
                  </label>
                  <div className="mt-3 flex flex-col sm:flex-row gap-3">
                    <input
                      id="proof"
                      type="url"
                      inputMode="url"
                      value={proofDraft}
                      onChange={(e) => setProofDraft(e.target.value)}
                      aria-invalid={proofError !== null}
                      placeholder="https://"
                      className="min-w-0 flex-1 rounded-lg border border-[var(--line-strong)] bg-black/40 px-4 py-3 font-[family-name:var(--font-mono)] text-sm placeholder:text-[var(--dim)] focus:border-[var(--green)] focus:ring-1 focus:ring-[var(--green)] focus:outline-none transition-colors"
                    />
                    <button
                      type="submit"
                      className="shrink-0 rounded-lg bg-white px-6 py-3 font-[family-name:var(--font-mono)] text-sm font-bold text-black hover:bg-[var(--ink)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--green)] transition-colors cursor-pointer"
                    >
                      Submit Proof
                    </button>
                  </div>
                  {proofError && (
                    <p
                      role="alert"
                      className="mt-3 font-[family-name:var(--font-mono)] text-sm font-bold text-[var(--danger)]"
                    >
                      {proofError}
                    </p>
                  )}
                </form>
              )}
            </div>

            {/* DANGER ZONE - Friction added to unlocking */}
            <div className="border-t border-[var(--danger-soft)] bg-black/30 px-6 py-4 flex justify-between items-center mt-4">
              <span className="font-[family-name:var(--font-mono)] text-[10px] text-[var(--dim)] uppercase tracking-wider">
                Abandon current stack?
              </span>
              <button
                type="button"
                onClick={handleChangeSelection}
                className={`font-[family-name:var(--font-mono)] text-[11px] font-bold px-3 py-1.5 rounded transition-colors cursor-pointer ${unlockConfirm ? "bg-[var(--danger)] text-black" : "text-[var(--danger)] hover:bg-[var(--danger-soft)]"}`}
              >
                {unlockConfirm
                  ? "Confirm Unlock & Wipe Data"
                  : "Unlock / Change Stack"}
              </button>
            </div>
          </section>
        )}
      </main>

      <footer className="relative z-10 mx-auto max-w-[1120px] px-6 pb-12 font-[family-name:var(--font-mono)] text-[11px] font-medium tracking-wide text-[var(--dim)] text-center">
        CS-PD Fall 2026 · Week 7 ship gate · events in
        03-build/analytics/event-schema.md
      </footer>
    </div>
  );
}
