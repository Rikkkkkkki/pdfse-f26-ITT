"use client";

import { useState, useEffect, useRef } from "react";
import type { FormEvent } from "react";
import { Bricolage_Grotesque, Source_Serif_4 } from "next/font/google";
import { initPostHog, captureEvent } from "@/lib/posthog";
import { STACKS, STACK_ORDER, type StackId } from "@/lib/stacks";

const display = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});
const body = Source_Serif_4({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const D = { fontFamily: "var(--font-display), system-ui, sans-serif" } as const;

const STORAGE_KEY = "stacklock:v2";

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
}: {
  locked: boolean;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="24"
      height="24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
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

  const loadedAt = useRef<number>(Date.now());
  const selectionCount = useRef(0);

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
    } catch {
      // Storage blocked or corrupted: start fresh.
    }
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
    } catch {
      // Ignore quota or privacy-mode errors.
    }
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
  };

  const handleChangeSelection = () => {
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
    captureEvent("day1_proof_submitted", {
      stack_id: selected,
      proof_host: url.hostname,
      steps_done: checked.length,
      minutes_since_commit: minutesSince(committedAt),
    });
  };

  const commandLabel =
    stack.commandKind === "link"
      ? "Download Godot here"
      : "Run this in your terminal";
  const copyLabel =
    copyState === "copied"
      ? "Copied"
      : copyState === "failed"
        ? "Copy failed. Select the text instead"
        : stack.commandKind === "link"
          ? "Copy link"
          : "Copy command";

  return (
    <div
      className={`${display.variable} ${body.variable} min-h-screen bg-[#E9ECEF] text-[#16181D] antialiased`}
      style={{ fontFamily: "var(--font-body), Georgia, serif" }}
    >
      <header className="max-w-3xl mx-auto px-5 pt-6 flex items-center justify-between">
        <div className="flex items-center gap-2" style={D}>
          <Padlock locked={isCommitted} />
          <span className="text-lg font-bold tracking-tight">StackLock</span>
        </div>
        <span className="text-sm text-[#4A5058]" style={D}>
          Lab 6 prototype · Team ITT
        </span>
      </header>

      <main className="max-w-3xl mx-auto px-5 pt-14 pb-20">
        {/* Hero */}
        <section className="mb-16">
          <h1
            className="text-5xl sm:text-7xl font-extrabold tracking-tight leading-[0.95] text-balance"
            style={D}
          >
            Pick one stack.
            <br />
            Ship it tonight.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-[#2C3138]">
            Comparing courses and frameworks feels like progress, but it
            produces no software. Choose what you are building, follow three
            steps, and paste a link to what you shipped.
          </p>
        </section>

        {/* Choose */}
        <section aria-labelledby="choose" className="mb-14">
          <h2
            id="choose"
            className="text-2xl font-bold tracking-tight"
            style={D}
          >
            {isCommitted ? "Your stack" : "What are you building?"}
          </h2>

          <ul
            className="mt-5 border-t-2 border-[#16181D]"
            role="group"
            aria-labelledby="choose"
          >
            {STACK_ORDER.map((key) => {
              const config = STACKS[key];
              const isSelected = selected === key;
              if (isCommitted && !isSelected) return null;
              return (
                <li
                  key={key}
                  className="border-b border-[#16181D]/25 last:border-b-2 last:border-[#16181D]"
                >
                  <button
                    type="button"
                    aria-pressed={isSelected}
                    disabled={isCommitted}
                    onClick={() => handleSelect(key)}
                    className={`w-full text-left px-4 sm:px-5 py-5 flex items-start justify-between gap-4 motion-safe:transition-colors focus:outline-none focus-visible:ring-4 focus-visible:ring-[#FFD60A] focus-visible:ring-inset ${
                      isSelected
                        ? "bg-[#16181D] text-white"
                        : "hover:bg-[#DDE1E5] cursor-pointer"
                    } ${isCommitted ? "cursor-default" : ""}`}
                  >
                    <span className="block">
                      <span
                        className="block text-xl sm:text-2xl font-bold tracking-tight"
                        style={D}
                      >
                        {config.category}
                      </span>
                      <span
                        className={`block mt-0.5 text-sm ${isSelected ? "text-white/70" : "text-[#4A5058]"}`}
                        style={D}
                      >
                        {config.name}
                      </span>
                      {isSelected && (
                        <span className="block mt-3 text-base text-white/90">
                          {config.tagline}
                        </span>
                      )}
                    </span>
                    <span className="shrink-0 mt-1">
                      {isCommitted && isSelected ? (
                        <Padlock locked className="text-[#FFD60A]" />
                      ) : (
                        <span
                          aria-hidden="true"
                          className={`block h-5 w-5 rounded-full border-2 ${
                            isSelected
                              ? "border-[#FFD60A] bg-[#FFD60A]"
                              : "border-[#16181D]/50"
                          }`}
                        />
                      )}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>

          {/* Stack details */}
          <div className="mt-10 grid md:grid-cols-5 gap-10">
            <div className="md:col-span-3">
              <h3 className="text-sm font-bold text-[#4A5058]" style={D}>
                What you will use
              </h3>
              <dl className="mt-3 border-t border-[#16181D]/25">
                {stack.coreTools.map((tool) => (
                  <div
                    key={tool.role}
                    className="py-3 border-b border-[#16181D]/25 grid grid-cols-[6.5rem_1fr] gap-x-4"
                  >
                    <dt className="text-sm text-[#4A5058]" style={D}>
                      {tool.role}
                    </dt>
                    <dd>
                      <span className="block font-semibold" style={D}>
                        {tool.tool}
                      </span>
                      <span className="block text-sm text-[#2C3138] mt-0.5">
                        {tool.why}
                      </span>
                    </dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="md:col-span-2">
              <h3 className="text-sm font-bold text-[#4A5058]" style={D}>
                Skip these for now
              </h3>
              <ul className="mt-3 border-t border-[#16181D]/25">
                {stack.skipForNow.map((item) => (
                  <li
                    key={item}
                    className="py-3 border-b border-[#16181D]/25 text-sm text-[#2C3138] flex gap-3"
                  >
                    <span
                      aria-hidden="true"
                      className="text-[#B42318] font-bold"
                    >
                      –
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Idea */}
          <div className="mt-10 max-w-xl">
            <label
              htmlFor="idea"
              className="block text-sm font-bold text-[#4A5058]"
              style={D}
            >
              Your project in one sentence (optional, stays on this device)
            </label>
            <input
              id="idea"
              type="text"
              disabled={isCommitted}
              value={idea}
              onChange={(e) => setIdea(e.target.value)}
              placeholder="A budgeting tracker for university students"
              className="mt-2 w-full bg-transparent border-b-2 border-[#16181D] py-2 text-lg placeholder:text-[#4A5058]/70 focus:outline-none focus:border-b-4 disabled:opacity-60"
            />
          </div>
        </section>

        {/* Commit or build */}
        {!isCommitted ? (
          <section aria-labelledby="commit">
            <h2 id="commit" className="sr-only">
              Start
            </h2>
            <button
              type="button"
              onClick={handleCommit}
              className="inline-flex items-center gap-3 bg-[#FFD60A] text-[#16181D] px-7 py-4 rounded-md text-lg font-bold border-2 border-[#16181D] shadow-[0_5px_0_#16181D] motion-safe:transition-transform active:translate-y-[4px] active:shadow-[0_1px_0_#16181D] focus:outline-none focus-visible:ring-4 focus-visible:ring-[#16181D]/40 cursor-pointer"
              style={D}
            >
              <Padlock locked={false} />
              Lock this stack and start
            </button>
            <p className="mt-4 text-sm text-[#4A5058] max-w-md">
              This opens three steps. We aim for about 30 minutes and record how
              long it really takes. You can change your mind, and we log that
              too.
            </p>
          </section>
        ) : (
          <section aria-labelledby="build">
            <div className="flex items-end justify-between gap-4">
              <h2
                id="build"
                className="text-2xl font-bold tracking-tight"
                style={D}
              >
                Your three steps
              </h2>
              <button
                type="button"
                onClick={handleChangeSelection}
                className="text-sm underline underline-offset-4 text-[#4A5058] hover:text-[#16181D] cursor-pointer focus:outline-none focus-visible:ring-4 focus-visible:ring-[#FFD60A] rounded"
                style={D}
              >
                Change stack
              </button>
            </div>

            <div className="mt-4" aria-live="polite">
              <div
                className="flex justify-between text-sm font-semibold"
                style={D}
              >
                <span>
                  {checked.length} of {total} done
                </span>
              </div>
              <div
                className="mt-2 h-2 bg-[#16181D]/15 rounded-full overflow-hidden"
                aria-hidden="true"
              >
                <div
                  className="h-full bg-[#1F7A45] motion-safe:transition-all"
                  style={{ width: `${(checked.length / total) * 100}%` }}
                />
              </div>
            </div>

            <ol className="mt-6 space-y-3">
              {stack.day1Milestones.map((milestone, idx) => {
                const isChecked = checked.includes(idx);
                return (
                  <li key={milestone}>
                    <label
                      className={`flex items-start gap-4 p-4 border-2 cursor-pointer motion-safe:transition-colors ${
                        isChecked
                          ? "border-[#1F7A45] bg-[#DCEFE3]"
                          : "border-[#16181D] bg-white hover:bg-[#F6F7F8]"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => handleToggleStep(idx)}
                        className="peer sr-only"
                      />
                      <span
                        aria-hidden="true"
                        className={`shrink-0 h-8 w-8 grid place-items-center rounded-full border-2 text-sm font-bold peer-focus-visible:ring-4 peer-focus-visible:ring-[#FFD60A] ${
                          isChecked
                            ? "bg-[#1F7A45] border-[#1F7A45] text-white"
                            : "border-[#16181D] text-[#16181D]"
                        }`}
                        style={D}
                      >
                        {isChecked ? "✓" : idx + 1}
                      </span>
                      <span
                        className={`pt-1 text-base ${isChecked ? "text-[#2C3138]" : ""}`}
                      >
                        {milestone}
                      </span>
                    </label>
                  </li>
                );
              })}
            </ol>

            {/* Command */}
            <div className="mt-10">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-bold text-[#4A5058]" style={D}>
                  {commandLabel}
                </span>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="text-sm font-semibold underline underline-offset-4 cursor-pointer focus:outline-none focus-visible:ring-4 focus-visible:ring-[#FFD60A] rounded"
                  style={D}
                >
                  {copyLabel}
                </button>
              </div>
              <pre className="bg-[#16181D] text-[#F4F5F7] font-mono text-sm p-4 rounded-md overflow-x-auto">
                {stack.command}
              </pre>
            </div>

            {/* Proof */}
            <div className="mt-12 pt-8 border-t-2 border-[#16181D]">
              <h3 className="text-2xl font-bold tracking-tight" style={D}>
                Paste what you shipped
              </h3>
              {proofUrl ? (
                <div className="mt-4 p-4 border-2 border-[#1F7A45] bg-[#DCEFE3]">
                  <p className="font-bold text-[#1F7A45]" style={D}>
                    Recorded
                  </p>
                  <a
                    href={proofUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 block break-all underline underline-offset-4"
                  >
                    {proofUrl}
                  </a>
                </div>
              ) : (
                <form onSubmit={handleSubmitProof} noValidate className="mt-4">
                  <label
                    htmlFor="proof"
                    className="block text-sm text-[#2C3138]"
                  >
                    {stack.proofHint}
                  </label>
                  <div className="mt-2 flex flex-col sm:flex-row gap-3">
                    <input
                      id="proof"
                      type="url"
                      inputMode="url"
                      value={proofDraft}
                      onChange={(e) => setProofDraft(e.target.value)}
                      aria-invalid={proofError !== null}
                      aria-describedby={proofError ? "proof-error" : undefined}
                      placeholder="https://"
                      className="flex-1 bg-white border-2 border-[#16181D] px-4 py-3 text-base placeholder:text-[#4A5058]/70 focus:outline-none focus:ring-4 focus:ring-[#FFD60A]"
                    />
                    <button
                      type="submit"
                      className="bg-[#16181D] text-white px-6 py-3 font-bold cursor-pointer focus:outline-none focus-visible:ring-4 focus-visible:ring-[#FFD60A]"
                      style={D}
                    >
                      Submit link
                    </button>
                  </div>
                  {proofError && (
                    <p
                      id="proof-error"
                      role="alert"
                      className="mt-2 text-sm font-semibold text-[#B42318]"
                    >
                      {proofError}
                    </p>
                  )}
                </form>
              )}
            </div>
          </section>
        )}
      </main>

      <footer
        className="max-w-3xl mx-auto px-5 pb-10 text-xs text-[#4A5058]"
        style={D}
      >
        CS-PD Fall 2026 · Week 7 ship gate · Events documented in
        03-build/analytics/event-schema.md
      </footer>
    </div>
  );
}
