# Homework 2 · Irakli Giguashvili (@Irakligig) · ITT

**Save this file as:** `members/Irakligig/hw2.md`, committed from your own account

## 1. Ship report

What I personally built, wired, deployed, tested, or reviewed since Lab 6.

| What I shipped | Story or rung | Commit link(s), from my account | Live at the production URL? | Walked or checked by |
|---|---|---|---|---|
| Public 3-tile PostHog dashboard (Trends, Funnel, Retention) with the internal team/test filter, documented in S8 | S8 / Rung 5 | [ba3c934](https://github.com/Rikkkkkkki/pdfse-f26-ITT/commit/ba3c934), [5a3c8e9](https://github.com/Rikkkkkkki/pdfse-f26-ITT/commit/5a3c8e9) | Yes (linked in README) | TTC (reviewer) |
| Submission verification: audited Lab 6 artifacts on `main`, confirmed owner-account history and the `m1-discovery` tag | S5 | [5301232](https://github.com/Rikkkkkkki/pdfse-f26-ITT/commit/5301232) | Yes | TTC (reviewer) |
| Walked S2 Day 1 checklist and command copy on desktop and phone, recorded in the Sprint 1 review | S2 (walk) | [ea42582](https://github.com/Rikkkkkkki/pdfse-f26-ITT/commit/ea42582) | Yes | TTC (checked PostHog Activity) |
| Logged usability sessions 3 (Sandro-K) and 5 (Luka-K) and added logger notes | S4 / Test Plan | [f0f1267](https://github.com/Rikkkkkkki/pdfse-f26-ITT/commit/f0f1267) | Yes | TT (ran both sessions) |

**The piece I am least sure works for a real person, and how I will know by Lab 8:** The `learner_selects_category` ➔ `user_commits_stack` step of the funnel on mobile. Session 2 (Konstantin-T) abandoned on a phone, so I do not trust that phone users get from choosing a category to locking a stack. By Lab 8 I will read the mobile funnel conversion; under 40% means the selection screen is still losing phone users.

**One thing I did that was not my assigned story:** My stories are S5 and S8, but I walked S2 (Tornike's story) on desktop and phone ([ea42582](https://github.com/Rikkkkkkki/pdfse-f26-ITT/commit/ea42582)). It needed doing because the gate's rung-2 "journey completes" claim rested on the Day 1 checklist and command copy actually working on a phone, and nobody owned checking the copied command was the exact runnable string on mobile.

## 2. Pattern journal, Weeks 5 to 7

### Week 5 · One metric that matters
My metric work was the engagement end, not the north star argument, which was Tornike's. I specced `starter_command_copied` as the event that tells whether a locked stack actually moved someone to act, so a commit that never leads to a copied command reads as a hollow number (`03-build/analytics/event-schema.md`, owner IG on that row). Beyond my delivery lane, I pushed for the internal filter rule, `Host does not contain localhost` with test IDs excluded, so our own testing could never inflate the metric we report. Hack: I toggled that filter off and on against known test commits to prove it actually removed our traffic before trusting a single count.

### Week 6 · The smallest complete journey
My piece of the smallest journey was the Day 1 end of it and the proof it existed on `main`. I walked S2's checklist and command copy on desktop and phone so the journey did not just lock a stack but got a learner to a runnable first command, and as Delivery lead I verified (S5) that the Lab 6 artifacts were on `main` with history from owner accounts (`03-build/sprints/sprint-1.md` S5). Beyond my lane, I flagged that the last step is worthless if the copied command is wrong on a phone, so I checked the paste on mobile Safari and not only desktop. Hack: I pasted the copied command straight into a terminal to confirm it was the exact runnable string.

### Week 7 · Ship to learn
Shipping let me read real behavior instead of guessing, so I stood up the public 3-tile PostHog dashboard that evaluators and the team read without login (`03-build/sprints/sprint-2.md` S8; the Wk7 dashboard line I added to `DECISIONS.md`, owner IG). As logger on sessions 3 (Sandro-K) and 5 (Luka-K) I wrote down what the dashboard cannot show, like Luka opening a real terminal after copying the command. Beyond my lane, I reconciled the Trends count against the controlled walk by toggling the internal filter. Hack: I opened the shared link logged out to confirm an outsider sees the same filtered numbers we do.

## 3. My DECISIONS.md lines

Since Week 5 the only `DECISIONS.md` line I own is the dashboard decision I drove this week and asked the team to record (my Wk2 problem-pick line is also `owner: IG` but falls before this range):

> `Wk7 · Public analytics dashboard: 3 shared PostHog tiles (Trends on user_commits_stack, Activation funnel opens -> selects -> commits, weekly Retention) with the internal filter excluding localhost and team/test IDs, so evaluators read field-week traffic without login · evidence: README PostHog link, 03-build/sprints/sprint-2.md S8 · owner: IG`

I built and verified the three shared tiles and the internal filter and linked the dashboard in the README; the tile-by-tile write-up and filter check are in `03-build/sprints/sprint-2.md` S8.

## 4. My person this week

**The field-week person I am responsible for:** Sandro-K, 2nd-year student (`01-discovery/interview-logs/08-student-kutaisi.md`) · **how and when the link reaches them:** a Messenger DM on Saturday at 14:00 with https://pdfse-f26-itt.vercel.app.

Sandro-K already took part in usability Session 3, which I logged, where he stalled and asked "Should I pick Python or JavaScript?" and the runner broke silence. So this time I do it differently: I send the link cold with no one over his shoulder, ask him to type his real project idea first instead of guiding the choice, and afterward ask one past-tense question, what he actually did once the stack locked and whether he opened a terminal, rather than whether he "liked" it.
