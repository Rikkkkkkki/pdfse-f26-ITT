# Event Schema

**North star:** Total stack decisions locked and committed per active learner.

**North star event:** `user_commits_stack`

**How the north star is computed from events:** count of unique `user_commits_stack` events fired by learners who selected a project category and locked a non-negotiable tech stack.

## Events

| Step | Event (actor_verb_object) | Fired by | Properties | Owner |
|---|---|---|---|---|
| Acquisition | `learner_opens_app` | learner | `source`, `referrer` | TT |
| Activation (precursor) | `learner_selects_category` | learner | `category_id`, `stack_name` | TTC |
| Activation (north star) ★ | `user_commits_stack` | learner | `project_category`, `stack_name`, `project_idea` | TTC |
| Retention / Progress | `milestone_step_toggled` | learner | `step_index`, `completed`, `stack` | TTC |
| Engagement | `starter_command_copied` | learner | `stack` | IG |

## Rules we are following

- One name per event, one spelling, lowercase with underscores.
- Zero PII (Personally Identifiable Information) leaves the client: no full names, personal phone numbers, or private emails are attached as properties.
- The north star event `user_commits_stack` is fired by the learner directly upon clicking the commitment button that locks their tech stack.

## Reconcile plan

**Event most likely to fail silently:** `user_commits_stack`
**How it would fail:** Double firing on rapid button re-clicks, or being blocked by strict client-side ad-blockers before reaching the endpoint.
**The check that would catch it:** Inspect PostHog Live Events stream against the local button disabled state (which disables the button immediately upon the first click), and proxy events through `/ingest` in `next.config.ts`.
**Who runs the check in Week 7:** TTC (Build lead).
