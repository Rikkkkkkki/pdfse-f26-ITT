# Homework 2 · Tatia Tkeshelashvili (@Rikkkkkkki) · ITT

**Save this file as:** `members/Rikkkkkkki/hw2.md`, committed from your own account

## 1. Ship report

What I personally built, wired, deployed, tested, or reviewed since Lab 6.

| What I shipped | Story or rung | Commit link(s), from my account | Live at the production URL? | Walked or checked by |
|---|---|---|---|---|
| Conducted and logged Prototype Usability Testing Sessions 1–3 as Session Runner | S4 / Test Plan | [d861939](https://github.com/Rikkkkkkki/pdfse-f26-ITT/commit/d861939), [05ed20e](https://github.com/Rikkkkkkki/pdfse-f26-ITT/commit/05ed20e) | Yes | TTC & IG (logged & reviewed) |
| Production mobile data walk (Rungs 1 & 2): walked category selection to Day 1 setup without Wi-Fi | Rung 1, Rung 2 | [d861939](https://github.com/Rikkkkkkki/pdfse-f26-ITT/commit/d861939) | Yes | Self (walked on phone), TTC (verified Activity) |
| PostHog live gate reconciliation (Rung 4): walked live app while TTC verified PostHog stream (PostHog 3 = Walk 3) | Rung 4 | [d861939](https://github.com/Rikkkkkkki/pdfse-f26-ITT/commit/d861939) | Yes | TTC (verified match) |
| Reviewed S1 Commitment UI & S2 Milestones; reported mobile title wrapping and padding defects | S1, S2 (as reviewer) | [4a6aa65](https://github.com/Rikkkkkkki/pdfse-f26-ITT/commit/4a6aa65) | Yes, after Tornike's fix | Tornike fixed in [500011d](https://github.com/Rikkkkkkki/pdfse-f26-ITT/commit/500011d) |
| Updated production URLs and test plan status tracking across repo README and design files | Rung 5 / Docs | [d861939](https://github.com/Rikkkkkkki/pdfse-f26-ITT/commit/d861939), [05ed20e](https://github.com/Rikkkkkkki/pdfse-f26-ITT/commit/05ed20e) | Yes | Self |

**The piece I am least sure works for a real person, and how I will know by Lab 8:** The mobile landing experience and idea input prompt. In Session 2, Konstantin-T completely stalled on his phone because the font appeared tiny and there was no obvious input box, prompting him to remark: *"I'd probably just google it at this point"*. I will track the funnel conversion between `learner_opens_app` and `learner_selects_category` in PostHog; if mobile visitors open the link but fail to select a category within 30 seconds, we know the landing view is losing them before they reach the lock.

**One thing I did that was not my assigned story:** Documented the exact mobile layout breakdown from Session 2 in `02-design/user-testing/usability-findings.md` and worked with Tornike to specify responsive font sizes and spacing before distributing links for Field Week.

## 2. Pattern journal, Weeks 5 to 7

### Week 5 · One metric that matters
During our team debate on analytics schema, I fought against using passive vanity metrics like page views or category tab switches. In our discovery interviews (Log 01, Log 05), every learner described hoarding tutorials and bookmarking tools for weeks without writing code; browsing is passive. I insisted our North Star must be `user_commits_stack` because locking the decision represents the psychological shift from endless tutorial comparing to building. Beyond my lane: I drafted event property specifications for `learner_opens_app` and `user_commits_stack` (`project_category`, `stack_name`, `project_idea`) so we can isolate which categories experience the greatest hesitation. Hack: simulated event dispatch sequences in paper wireframes with dummy inputs to confirm the analytics payload captured user intent before any frontend code was written.

### Week 6 · The smallest complete journey
When defining our MVP boundary in `03-build/mvp-boundary.md`, I strictly defended our cut list against feature bloat. The team considered adding a curated tutorial library and a multi-framework comparison grid. Citing Interview Log 01 (30 unwatched Notion courses) and Log 06 (9-column comparison spreadsheet), I argued that tutorial feeds and comparison matrices actively fuel starting paralysis. I locked our journey to 5 minimal steps ending at Day 1 command execution. Beyond my lane: I drafted the frozen test plan in `02-design/user-testing/test-plan.md`, setting strict 60-second completion thresholds and defining observable failure behaviors. Hack: rehearsed the frozen task script on my phone voice memo to eliminate leading inflections before testing live participants.

### Week 7 · Ship to learn
Conducting usability testing on our deployed Vercel URL replaced team assumptions with real user behavior. As session runner for Sessions 1, 2, and 3, I maintained strict silence while observing learners navigate StackLock. Session 1 proved that our opinionated flow works smoothly under 60 seconds when unobstructed (Giorgi-K completed in 40s), while Session 2 revealed that mobile responsiveness defects immediately trigger users to retreat to Google search. Beyond my lane: as a non-builder of the S1 lock trigger, I performed the official mobile cellular walk to verify Rungs 1 to 4 for the gate reconcile. Hack: ran mobile walk tests with Wi-Fi disabled in incognito mode on cellular data to verify that PostHog analytics ingestion functioned reliably without client caching.

## 3. My DECISIONS.md lines

> `Wk4 · Problem statement v1: First-time software builders stall for weeks organizing conflicting tutorials and stacks out of fear of choosing the wrong path · evidence: 01-discovery/problem-statement.md, 01-discovery/synthesis/patterns-analysis.md · owner: TT`

I authored the problem statement and led the synthesis across our initial discovery logs, identifying fear of picking the wrong stack as the root cause of starting paralysis.

> `Wk7 · Prototype test: 1 pass, 2 fails across initial 3 sessions; rule holds to finish sessions 4 & 5; mobile layout fix prioritized · evidence: 02-design/user-testing/usability-findings.md (sessions 1 to 3) · owner: TT`

I ran all 3 prototype usability sessions as session runner and logged the evidence in `02-design/user-testing/usability-findings.md`, establishing that the decision rule requires finishing Sessions 4 and 5 while fixing mobile styling.

## 4. My person this week

**The field-week person I am responsible for:** Mariam-T (Frontend switcher / bootcamp graduate, from `01-discovery/interview-logs/06-bootcamp-tbilisi.md`) · **how and when the link reaches them:** Sending a direct Messenger message on Friday at 19:00 with the live production link (`https://pdfse-f26-itt.vercel.app`), followed by a brief message on Saturday to observe whether she reached the Day 1 setup commands.
