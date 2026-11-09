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
    setLockSnap(true);
    window.setTimeout(() => setLockSnap(false), 400);
    window.setTimeout(() => {
      buildRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
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
      ? "download link"
      : "starter command";
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

      {/* Top chrome */}
      <header className="relative z-10 border-b border-[var(--line)] bg-[var(--panel)]/70 backdrop-blur-sm">
        <div className="mx-auto flex h-14 max-w-[1120px] items-center justify-between px-6">
          <div className="flex items-center gap-2.5">
            <span
              className={`grid h-7 w-7 place-items-center rounded-md border ${
                isCommitted
                  ? "border-[var(--amber)] bg-[var(--amber-soft)] text-[var(--amber)]"
                  : "border-[var(--line-strong)] text-[var(--muted)]"
              }`}
            >
              <Padlock locked={isCommitted} snap={lockSnap} />
            </span>
            <div className="leading-none">
              <div
                className="text-[15px] font-extrabold tracking-tight"
                style={{ fontFamily: "var(--font-display), sans-serif" }}
              >
                StackLock
              </div>
              <div className="mt-0.5 font-[family-name:var(--font-mono)] text-[10px] tracking-[0.14em] text-[var(--dim)] uppercase">
                day-1 commit tool
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4 font-[family-name:var(--font-mono)] text-[11px] text-[var(--dim)]">
            <span className="hidden items-center gap-1.5 sm:inline-flex">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--green)]" />
              live · no login
            </span>
            <span>lab 6 · itt</span>
          </div>
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-[1120px] px-6 py-8">
        {/* Compact intro — not a full-bleed empty hero */}
        <section className="sl-rise mb-7 grid items-end gap-4 border-b border-[var(--line)] pb-7 md:grid-cols-[1fr_auto]">
          <div>
            <h1
              className="max-w-2xl text-[clamp(1.75rem,3.2vw,2.35rem)] leading-[1.15] font-extrabold tracking-tight text-balance"
              style={{ fontFamily: "var(--font-display), sans-serif" }}
            >
              Pick one stack.
              <span className="text-[var(--green)]"> Ship it tonight.</span>
              <span
                className="sl-blink ml-1 inline-block h-[0.85em] w-[0.45ch] translate-y-[0.08em] bg-[var(--green)] align-baseline"
                aria-hidden="true"
              />
            </h1>
            <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-[var(--muted)]">
              Comparing courses feels like progress but ships nothing. Choose a
              category, lock the stack, finish three steps, paste proof.
            </p>
          </div>
          <div className="font-[family-name:var(--font-mono)] text-[11px] leading-5 text-[var(--dim)] md:text-right">
            <div>target · ~30 min</div>
            <div>north star · lock commit</div>
            <div>status · {isCommitted ? "locked" : "awaiting lock"}</div>
          </div>
        </section>

        {/* Product workspace */}
        <section
          aria-labelledby="choose-heading"
          className="sl-rise overflow-hidden rounded-xl border border-[var(--line-strong)] bg-[var(--panel)] shadow-[0_24px_80px_rgba(0,0,0,0.35)]"
          style={{ animationDelay: "60ms" }}
        >
          <div className="flex items-center justify-between border-b border-[var(--line)] bg-[var(--panel-2)] px-4 py-2.5">
            <div className="flex items-center gap-2 font-[family-name:var(--font-mono)] text-[11px] text-[var(--dim)]">
              <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
              <span className="ml-2">stacklock://select</span>
            </div>
            <span className="font-[family-name:var(--font-mono)] text-[11px] text-[var(--dim)]">
              {isCommitted ? "mode: locked" : "mode: choose"}
            </span>
          </div>

          <div className="grid lg:grid-cols-[340px_1fr]">
            {/* Stack list */}
            <div className="border-b border-[var(--line)] lg:border-r lg:border-b-0">
              <div className="border-b border-[var(--line)] px-4 py-3">
                <h2
                  id="choose-heading"
                  className="font-[family-name:var(--font-mono)] text-[11px] tracking-[0.16em] text-[var(--dim)] uppercase"
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
                        className={`relative flex w-full items-start gap-3 border-b border-[var(--line)] px-4 py-3.5 text-left last:border-b-0 focus:outline-none focus-visible:bg-[var(--green-soft)] ${
                          isSelected
                            ? "bg-[var(--green-soft)]"
                            : "hover:bg-white/[0.025] cursor-pointer"
                        } ${isCommitted ? "cursor-default" : ""}`}
                      >
                        {isSelected && (
                          <span
                            aria-hidden="true"
                            className="absolute inset-y-0 left-0 w-[3px] bg-[var(--green)]"
                          />
                        )}
                        <span className="mt-0.5 font-[family-name:var(--font-mono)] text-[11px] text-[var(--dim)]">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span
                            className="block text-[15px] font-bold tracking-tight"
                            style={{
                              fontFamily: "var(--font-display), sans-serif",
                            }}
                          >
                            {config.category}
                          </span>
                          <span className="mt-0.5 block truncate font-[family-name:var(--font-mono)] text-[11px] text-[var(--muted)]">
                            {config.name}
                          </span>
                        </span>
                        {isCommitted && isSelected ? (
                          <Padlock
                            locked
                            snap={lockSnap}
                            className="mt-0.5 text-[var(--amber)]"
                          />
                        ) : (
                          <span
                            aria-hidden="true"
                            className={`mt-1.5 h-3.5 w-3.5 shrink-0 rounded-full border ${
                              isSelected
                                ? "border-[var(--green)] bg-[var(--green)]"
                                : "border-[var(--line-strong)]"
                            }`}
                          />
                        )}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Detail pane */}
            <div className="flex flex-col">
              <div className="border-b border-[var(--line)] px-5 py-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-[family-name:var(--font-mono)] text-[11px] tracking-[0.14em] text-[var(--green)] uppercase">
                      {stack.id} · selected
                    </p>
                    <h3
                      className="mt-1 text-xl font-bold tracking-tight"
                      style={{
                        fontFamily: "var(--font-display), sans-serif",
                      }}
                    >
                      {stack.category}
                    </h3>
                    <p className="mt-1 max-w-lg text-sm leading-relaxed text-[var(--muted)]">
                      {stack.tagline}
                    </p>
                  </div>
                  {isCommitted && (
                    <button
                      type="button"
                      onClick={handleChangeSelection}
                      className="font-[family-name:var(--font-mono)] text-[11px] text-[var(--muted)] underline underline-offset-4 hover:text-[var(--ink)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--green)]"
                    >
                      unlock / change
                    </button>
                  )}
                </div>
              </div>

              <div className="grid flex-1 gap-0 md:grid-cols-2">
                <div className="border-b border-[var(--line)] px-5 py-4 md:border-r md:border-b-0">
                  <h4 className="font-[family-name:var(--font-mono)] text-[10px] tracking-[0.16em] text-[var(--dim)] uppercase">
                    you will use
                  </h4>
                  <dl className="mt-3 space-y-3">
                    {stack.coreTools.map((tool) => (
                      <div key={tool.role}>
                        <dt className="font-[family-name:var(--font-mono)] text-[10px] tracking-wide text-[var(--dim)] uppercase">
                          {tool.role}
                        </dt>
                        <dd className="mt-0.5">
                          <div className="text-sm font-semibold tracking-tight">
                            {tool.tool}
                          </div>
                          <div className="mt-0.5 text-[13px] leading-snug text-[var(--muted)]">
                            {tool.why}
                          </div>
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>

                <div className="px-5 py-4">
                  <h4 className="font-[family-name:var(--font-mono)] text-[10px] tracking-[0.16em] text-[var(--dim)] uppercase">
                    skip for now
                  </h4>
                  <ul className="mt-3 space-y-2">
                    {stack.skipForNow.map((item) => (
                      <li
                        key={item}
                        className="flex gap-2 text-[13px] leading-snug text-[var(--muted)]"
                      >
                        <span className="font-[family-name:var(--font-mono)] text-[var(--danger)]">
                          //
                        </span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-auto border-t border-[var(--line)] bg-[var(--panel-2)] px-5 py-4">
                <label
                  htmlFor="idea"
                  className="font-[family-name:var(--font-mono)] text-[10px] tracking-[0.16em] text-[var(--dim)] uppercase"
                >
                  project in one sentence
                  <span className="ml-2 normal-case tracking-normal opacity-70">
                    optional · local only
                  </span>
                </label>
                <input
                  id="idea"
                  type="text"
                  disabled={isCommitted}
                  value={idea}
                  onChange={(e) => setIdea(e.target.value)}
                  placeholder="A budgeting tracker for university students"
                  className="mt-2 w-full rounded-md border border-[var(--line-strong)] bg-[var(--bg)] px-3 py-2.5 font-[family-name:var(--font-mono)] text-sm text-[var(--ink)] placeholder:text-[var(--dim)] focus:border-[var(--green)] focus:outline-none disabled:opacity-50"
                />

                {!isCommitted ? (
                  <div className="mt-4 flex flex-wrap items-center gap-3">
                    <button
                      type="button"
                      onClick={handleCommit}
                      className="inline-flex items-center gap-2 rounded-md bg-[var(--amber)] px-4 py-2.5 font-[family-name:var(--font-mono)] text-sm font-semibold tracking-wide text-[#1a1405] hover:brightness-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--green)] cursor-pointer"
                    >
                      <Padlock locked={false} />
                      lock this stack & start
                    </button>
                    <p className="max-w-xs font-[family-name:var(--font-mono)] text-[11px] leading-relaxed text-[var(--dim)]">
                      Opens 3 Day 1 steps. You can unlock later — we log that.
                    </p>
                  </div>
                ) : (
                  <p className="mt-3 inline-flex items-center gap-2 font-[family-name:var(--font-mono)] text-[12px] text-[var(--amber)]">
                    <Padlock locked snap={lockSnap} />
                    stack locked · scroll to Day 1 steps
                  </p>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Build section after commit */}
        {isCommitted && (
          <section
            ref={buildRef}
            aria-labelledby="build"
            className="sl-rise mt-8 scroll-mt-6 overflow-hidden rounded-xl border border-[var(--line-strong)] bg-[var(--panel)]"
          >
            <div className="flex items-center justify-between border-b border-[var(--line)] bg-[var(--panel-2)] px-5 py-3">
              <div>
                <p className="font-[family-name:var(--font-mono)] text-[10px] tracking-[0.16em] text-[var(--dim)] uppercase">
                  execute · day 1
                </p>
                <h2
                  id="build"
                  className="text-lg font-bold tracking-tight"
                  style={{ fontFamily: "var(--font-display), sans-serif" }}
                >
                  Your three steps
                </h2>
              </div>
              <div
                className="font-[family-name:var(--font-mono)] text-sm text-[var(--green)]"
                aria-live="polite"
              >
                {checked.length}/{total}
              </div>
            </div>

            <div className="h-1 bg-[var(--line)]" aria-hidden="true">
              <div
                className="h-full bg-[var(--green)] motion-safe:transition-all motion-safe:duration-300"
                style={{ width: `${(checked.length / total) * 100}%` }}
              />
            </div>

            <ol>
              {stack.day1Milestones.map((milestone, idx) => {
                const isChecked = checked.includes(idx);
                return (
                  <li key={milestone} className="border-b border-[var(--line)]">
                    <label
                      className={`flex cursor-pointer items-start gap-4 px-5 py-4 ${
                        isChecked
                          ? "bg-[var(--green-soft)]"
                          : "hover:bg-white/[0.02]"
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
                        className={`grid h-7 w-7 shrink-0 place-items-center rounded-md border font-[family-name:var(--font-mono)] text-[11px] font-semibold peer-focus-visible:ring-2 peer-focus-visible:ring-[var(--green)] ${
                          isChecked
                            ? "border-[var(--green)] bg-[var(--green)] text-[#04140c]"
                            : "border-[var(--line-strong)] text-[var(--muted)]"
                        }`}
                      >
                        {isChecked ? "✓" : String(idx + 1).padStart(2, "0")}
                      </span>
                      <span
                        className={`pt-0.5 text-[15px] leading-relaxed ${
                          isChecked
                            ? "text-[var(--muted)] line-through decoration-[var(--dim)]"
                            : ""
                        }`}
                      >
                        {milestone}
                      </span>
                    </label>
                  </li>
                );
              })}
            </ol>

            <div className="border-b border-[var(--line)] px-5 py-4">
              <div className="mb-2 flex items-center justify-between">
                <span className="font-[family-name:var(--font-mono)] text-[11px] tracking-[0.14em] text-[var(--dim)] uppercase">
                  {commandLabel}
                </span>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="font-[family-name:var(--font-mono)] text-[11px] text-[var(--green)] hover:text-[var(--ink)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--green)] cursor-pointer"
                >
                  {copyLabel}
                </button>
              </div>
              <pre className="overflow-x-auto rounded-md border border-[var(--line)] bg-[var(--bg)] px-4 py-3 font-[family-name:var(--font-mono)] text-[13px] leading-relaxed text-[var(--green)]">
                <span className="select-none text-[var(--dim)]">$ </span>
                {stack.command}
              </pre>
            </div>

            <div className="px-5 py-5">
              <h3
                className="text-base font-bold tracking-tight"
                style={{ fontFamily: "var(--font-display), sans-serif" }}
              >
                Paste what you shipped
              </h3>
              {proofUrl ? (
                <div className="mt-3 rounded-md border border-[var(--green)] bg-[var(--green-soft)] px-4 py-3">
                  <p className="font-[family-name:var(--font-mono)] text-[10px] tracking-[0.16em] text-[var(--green)] uppercase">
                    recorded
                  </p>
                  <a
                    href={proofUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 block break-all font-[family-name:var(--font-mono)] text-sm underline underline-offset-4"
                  >
                    {proofUrl}
                  </a>
                </div>
              ) : (
                <form onSubmit={handleSubmitProof} noValidate className="mt-3">
                  <label
                    htmlFor="proof"
                    className="block text-sm text-[var(--muted)]"
                  >
                    {stack.proofHint}
                  </label>
                  <div className="mt-2 flex gap-2">
                    <input
                      id="proof"
                      type="url"
                      inputMode="url"
                      value={proofDraft}
                      onChange={(e) => setProofDraft(e.target.value)}
                      aria-invalid={proofError !== null}
                      aria-describedby={proofError ? "proof-error" : undefined}
                      placeholder="https://"
                      className="min-w-0 flex-1 rounded-md border border-[var(--line-strong)] bg-[var(--bg)] px-3 py-2.5 font-[family-name:var(--font-mono)] text-sm placeholder:text-[var(--dim)] focus:border-[var(--green)] focus:outline-none"
                    />
                    <button
                      type="submit"
                      className="shrink-0 rounded-md bg-[var(--ink)] px-4 py-2.5 font-[family-name:var(--font-mono)] text-sm font-semibold text-[var(--bg)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--green)] cursor-pointer"
                    >
                      submit
                    </button>
                  </div>
                  {proofError && (
                    <p
                      id="proof-error"
                      role="alert"
                      className="mt-2 font-[family-name:var(--font-mono)] text-sm text-[var(--danger)]"
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

      <footer className="relative z-10 mx-auto max-w-[1120px] px-6 pb-8 font-[family-name:var(--font-mono)] text-[10px] tracking-wide text-[var(--dim)]">
        CS-PD Fall 2026 · Week 7 ship gate · events in
        03-build/analytics/event-schema.md
      </footer>
    </div>
  );
}
