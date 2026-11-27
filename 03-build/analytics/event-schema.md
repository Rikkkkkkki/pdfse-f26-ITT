# Event Schema

**North star:** Total stack decisions locked and committed per active learner.

**North star event:** `user_commits_stack`

**How the north star is computed from events:** count of unique `user_commits_stack` events fired by learners who selected a project category and locked a non-negotiable tech stack.

**Rejected as north star:** page views and category clicks. They count passive browsing, which our interviewees already did for weeks without writing code (logs 01 and 05). Locking a stack is the first act of deciding, so it is the event we count.

## Events

| Step | Event (actor_verb_object) | Fired by | Properties | Owner | Live |
|---|---|---|---|---|---|
| Acquisition | `learner_opens_app` | learner | `source`, `referrer` | TT | yes |
| Activation (precursor) | `learner_selects_category` | learner | `category_id`, `stack_name` | TTC | yes |
| Activation (north star) ★ | `user_commits_stack` | learner | `project_category`, `stack_name`, `project_idea` | TTC | yes |
| Retention / Progress | `milestone_step_toggled` | learner | `step_index`, `completed`, `stack` | TTC | yes |
| Engagement | `starter_command_copied` | learner | `stack` | IG | yes |

## Rules we are following

- One name per event, one spelling, lowercase with underscores.
- Zero PII (Personally Identifiable Information) leaves the client: no full names, personal phone numbers, or private emails are attached as properties.
- The north star event `user_commits_stack` is fired by the learner directly upon clicking the commitment button that locks their tech stack.

## Reconcile plan

**Event most likely to fail silently:** `user_commits_stack`
**How it would fail:** Double firing on rapid button re-clicks, or being blocked by strict client-side ad-blockers before reaching the endpoint.
**The check that would catch it:** Inspect PostHog Live Events stream against the local button disabled state (which disables the button immediately upon the first click), and proxy events through `/ingest` in `next.config.ts`.
**Who runs the check in Week 7:** TTC (Build lead).

---

## Gate reconcile (Lab 7)

**Production URL walked:** https://pdfse-f26-itt.vercel.app · **walked by:** TT (did not build S1) · on a phone, mobile data: yes

| Source | Count | Window | Exactly how it was counted |
|---|---|---|---|
| PostHog | 3 | Sprint 1 verification walk window | Trends insight, total count of `user_commits_stack`, internal filter off |
| Controlled Walk | 3 | Same | Verified test stack commitments executed during phone walk |

**Match:** yes

**If no, first:** n/a (matched on first walk)

**Silent failure we predicted in Lab 5:** double firing on rapid button re-clicks or ad-blocker dropoff · **Did it happen?** No; button disables immediately upon lock (`setLockSnap`), and `/ingest` rewrite proxy routed events past ad-blockers.

**Internal filter set in PostHog:** `Host does not contain localhost`, test distinct IDs excluded.

**Checked by:** TTC · **events still not Live, with owner and by when:** none; all 5 journey events verified live.
