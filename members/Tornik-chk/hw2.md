# Homework 2 · Tornike Tchkoidze (@Tornik-chk) · ITT

**Save this file as:** `members/Tornik-chk/hw2.md`, committed from your own account

## 1. Ship report

What I personally built, wired, deployed, tested, or reviewed since Lab 6.

| What I shipped | Story or rung | Commit link(s), from my account | Live at the production URL? | Walked or checked by |
|---|---|---|---|---|
| Built StackLock single-screen selection UI, opinionated stack cards, and commit lock trigger | S1 | [684f4f0](https://github.com/Rikkkkkkki/pdfse-f26-ITT/commit/684f4f0), [cdc5f24](https://github.com/Rikkkkkkki/pdfse-f26-ITT/commit/cdc5f24) | Yes | TT (walked on phone) |
| Day 1 interactive milestone checklist and terminal starter command clipboard copy | S2 | [22c54a0](https://github.com/Rikkkkkkki/pdfse-f26-ITT/commit/22c54a0), [500011d](https://github.com/Rikkkkkkki/pdfse-f26-ITT/commit/500011d) | Yes | IG (walked on desktop & phone) |
| PostHog analytics proxy wiring via `/ingest` rewrite in Next.js config to prevent ad-blocker dropoff | S3 | [3bdff3c](https://github.com/Rikkkkkkki/pdfse-f26-ITT/commit/3bdff3c), [d861939](https://github.com/Rikkkkkkki/pdfse-f26-ITT/commit/d861939) | Yes | TTC & TT (verified live in Activity) |
| Reconciled PostHog event stream counts against controlled walk sessions | Rung 4 | [d861939](https://github.com/Rikkkkkkki/pdfse-f26-ITT/commit/d861939) | Yes | TT & TTC (PostHog 3 = Walk 3) |

**The piece I am least sure works for a real person, and how I will know by Lab 8:** The terminal starter command copy button on mobile browsers (Safari / Chrome mobile). Learners browsing on their phones may copy the command but cannot run it immediately in a mobile terminal. I will monitor the ratio of `starter_command_copied` to `milestone_step_toggled` in PostHog; if commands are copied but milestones remain unchecked, we need to prompt them to send the command to their desktop.

**One thing I did that was not my assigned story:** Fixed mobile responsive layout breakpoints and padding in `app/app/globals.css` after our first mobile walk test showed the commit card title wrapping awkwardly on smaller screens.

## 2. Pattern journal, Weeks 5 to 7

### Week 5 · One metric that matters
During our event schema debate, I pushed back against using generic page views or category clicks as our primary metric. In interview log 01, Giorgi spent weeks browsing tutorials without ever committing to code; page browsing is passive. I argued that our North Star must be `user_commits_stack` because locking the decision represents the psychological transition from tutorial hoarding to building. Beyond my lane: I drafted the event property schema to capture `project_category` and `stack_name` so we can see which domain causes the most hesitation. Hack: simulated event dispatch in the browser console using dummy payloads to test ad-blocker capture before the app was built.

### Week 6 · The smallest complete journey
When planning Sprint 1, we were tempted to build a multi-page tutorial search and complex user login. Following the cut list from our discovery logs, I insisted on a single-screen journey: category selector, opinionated stack card, commit button, and 3 Day 1 milestones. Anything else would recreate the comparison paralysis our users complained about. Beyond my lane: worked with Tatia to ensure the acceptance criteria strictly matched the frozen test plan. Hack: utilized browser `localStorage` to persist locked states so learners could refresh the page without losing their Day 1 progress before server persistence was connected.

### Week 7 · Ship to learn
Shipping live to Vercel and watching events fire in PostHog replaced assumptions with real behavior. Walking the live URL on a phone with mobile data forced us to see the product under real constraints. We verified that our ad-blocker rewrite proxy in `next.config.ts` prevented event loss. Beyond my lane: co-conducted the mobile walk with Tatia and verified the PostHog activity live stream. Hack: tested our mobile walk over a cellular hotspot with Wi-Fi disabled to verify zero local network or caching bias.

## 3. My DECISIONS.md lines

> `Wk3 · Prediction "fewer than 2 of 3 people describe losing days to deciding what to learn" verdict: weakened · evidence: 01-discovery/interview-logs/01-student-kutaisi.md, 05-gamer-kutaisi.md, 06-bootcamp-tbilisi.md · owner: TTC`

I drove the tally on our prediction verdict; conducted interviews 01 and 05 as primary asker where both participants explicitly described losing weeks jumping between learning resources.

> `Wk6 · MVP boundary: 5-step journey (category selection to Day 1 milestone execution); cut tutorial library, stack comparison matrix, and user authentication · evidence: 03-build/mvp-boundary.md, 01-discovery/interview-logs/01-student-kutaisi.md, 05-gamer-kutaisi.md, 06-bootcamp-tbilisi.md · owner: TTC`

I formulated the 5-step journey and enforced the cut list, citing the interview logs that proved tutorials and feature comparisons actively feed starting paralysis.

> `Wk7 · Gate passed: live at https://pdfse-f26-itt.vercel.app, north star event firing from production, PostHog 3 = walk 3 · evidence: README links, 03-build/analytics/event-schema.md · owner: TTC`

I verified the live production deployment and ran the reconcile check confirming PostHog event totals matched our controlled test sessions.

## 4. My person this week

**The field-week person I am responsible for:** Giorgi-K (1st-year CS student, from log 01) · **how and when the link reaches them:** Sending a direct Messenger message on Friday at 18:00 with the live Vercel link, followed by a check-in on Saturday afternoon to see if he reached `localhost` setup.
