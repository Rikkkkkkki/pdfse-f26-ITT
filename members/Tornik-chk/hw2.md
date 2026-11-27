# Homework 2 · Tornike Tchkoidze (@Tornik-chk) · ITT

**Save this file as:** `members/Tornik-chk/hw2.md`, committed from your own account

## 1. Ship report

What I personally built, wired, deployed, tested, or reviewed since Lab 6.

| What I shipped | Story or rung | Commit link(s), from my account | Live at the production URL? | Walked or checked by |
|---|---|---|---|---|
| Built StackLock single-screen selection UI, opinionated stack cards, and commit lock trigger | S1 | [684f4f0](https://github.com/Rikkkkkkki/pdfse-f26-ITT/commit/684f4f0), [cdc5f24](https://github.com/Rikkkkkkki/pdfse-f26-ITT/commit/cdc5f24) | Yes | TT (walked on phone) |
| Day 1 interactive milestone checklist and terminal starter command clipboard copy | S2 | [22c54a0](https://github.com/Rikkkkkkki/pdfse-f26-ITT/commit/22c54a0), [500011d](https://github.com/Rikkkkkkki/pdfse-f26-ITT/commit/500011d) | Yes | IG (walked on desktop and phone) |
| PostHog analytics proxy: `/ingest` rewrite in `app/next.config.ts` and `app/lib/posthog.ts` so ad-blockers do not drop events | S3 | [684f4f0](https://github.com/Rikkkkkkki/pdfse-f26-ITT/commit/684f4f0), [22c54a0](https://github.com/Rikkkkkkki/pdfse-f26-ITT/commit/22c54a0) | Yes | TT (verified events live in Activity) |
| Gate reconcile written up in `03-build/analytics/event-schema.md`: PostHog 3 = walk 3 | Rung 4 | [6ab418d](https://github.com/Rikkkkkkki/pdfse-f26-ITT/commit/6ab418d) | Yes | TT (ran the walk) |

**The piece I am least sure works for a real person, and how I will know by Lab 8:** The terminal starter command copy button on mobile (Safari and Chrome). Learners on phones can copy the command but cannot run it in a mobile terminal. I will compare `starter_command_copied` against `milestone_step_toggled` in PostHog; copies with no checked milestones mean we must prompt them to send the command to their desktop.

**One thing I did that was not my assigned story:** Fixed mobile breakpoints and padding in `app/app/globals.css` after our first mobile walk showed the commit card title wrapping badly ([500011d](https://github.com/Rikkkkkkki/pdfse-f26-ITT/commit/500011d)).

## 2. Pattern journal, Weeks 5 to 7

### Week 5 · One metric that matters
In the event schema debate I pushed back on page views and category clicks as our metric. In interview log 01, Giorgi spent weeks browsing tutorials without committing to code, so browsing is passive. I argued our North Star must be `user_commits_stack`, because locking the decision is the move from tutorial hoarding to building. Beyond my lane: I drafted the `project_category` and `stack_name` properties to see which domain causes the most hesitation (`03-build/analytics/event-schema.md`). Hack: fired dummy events from the browser console to test ad-blocker capture before the app existed.

### Week 6 · The smallest complete journey
When planning Sprint 1 we were tempted by a tutorial search and a login. Following our discovery logs, I insisted on a single screen: category selector, opinionated stack card, commit button, and 3 Day 1 milestones (`03-build/mvp-boundary.md`, Wk6 DECISIONS line). Beyond my lane: I worked with Tatia so the acceptance criteria matched the frozen test plan. Hack: I used `localStorage` to keep locked state across refreshes before server persistence existed.

### Week 7 · Ship to learn
Shipping to Vercel and watching events in PostHog replaced assumptions with real behavior. Walking the live URL on a phone over mobile data showed the product under real constraints, and it confirmed the `/ingest` proxy stopped event loss (gate reconcile in `event-schema.md`, Wk7 DECISIONS line). Beyond my lane: I co-ran the mobile walk with Tatia and checked the PostHog live stream. Hack: I ran the walk over a cellular hotspot with Wi-Fi off to rule out local caching.

## 3. My DECISIONS.md lines

> `Wk6 · MVP boundary: 5-step journey (category selection to Day 1 milestone execution); cut tutorial library, stack comparison matrix, and user authentication · evidence: 03-build/mvp-boundary.md, 01-discovery/interview-logs/01-student-kutaisi.md, 05-gamer-kutaisi.md, 06-bootcamp-tbilisi.md · owner: TTC`

I wrote the 5-step journey and the cut list; the evidence is the three interview logs where tutorials and comparisons fed starting paralysis.

> `Wk6 · Prototype track: the first deployed screen of the journey is the prototype; frozen test from 02-design/user-testing/test-plan.md runs on it, 3 sessions before the Week 7 lab · evidence: 03-build/sprints/sprint-1.md S1 · owner: TTC`

The deployed S1 screen was the prototype, so the frozen test plan could run on it without a separate build.

> `Wk7 · Gate passed: live at https://pdfse-f26-itt.vercel.app, north star event firing from production, PostHog 3 = walk 3 · evidence: README links, 03-build/analytics/event-schema.md · owner: TTC`

The evidence is the matching PostHog and walk counts in the "Gate reconcile" section of `event-schema.md`.

## 4. My person this week

**The field-week person I am responsible for:** Giorgi-K, 1st-year CS student (log 01) · **how and when the link reaches them:** a direct Messenger message on Friday at 18:00 with the live Vercel link, then a check-in on Saturday afternoon to see if he got as far as local setup.
