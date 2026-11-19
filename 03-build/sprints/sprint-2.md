# Sprint 2: the field week

**Save this file as:** `03-build/sprints/sprint-2.md`

Sprint 2 runs from Lab 7 to Lab 8. Real people use StackLock this week, and Lab 8 opens by reading what they did.

## Sprint 1 review

Our definition of done: The StackLock single-screen web app runs live on Vercel at a public HTTPS URL, verified on mobile and desktop browsers, where a learner can choose their project category, lock their stack decision, and fire the `user_commits_stack` North Star event cleanly in PostHog Activity view.

| Story | Owner | Done by our definition? | If not: which clause is missing, and what happened |
|---|---|---|---|
| S1 North Star Commitment & Lock Screen | TTC | Yes | Selected category updates stack card, lock button disables selector and commits state. Walked by TT on phone. |
| S2 Day 1 Milestone Checklist & Command Copy | TTC | Yes | Clipboard command copy and 3 interactive checklist steps toggle cleanly. Walked by IG. |
| S3 Deploy to Vercel and Instrument Analytics | TTC | Yes | Deployed to https://pdfse-f26-itt.vercel.app with PostHog reverse-proxied through `/ingest`. |
| S4 Run User Testing Sessions | TT | Partly | Frozen test plan structured; 3 field sessions scheduled with real ICP learners for field week. |
| S5 Submission Verification and Tagging | IG | Yes | Verified Lab 6 artifacts on `main`. |

**Slip rule:** Did not fire. S1, S2, and S3 all landed and were verified live in production on schedule.

## The gate

| Rung | Reached? | Evidence: a link or a number | If not: owner, and by when |
|---|---|---|---|
| 1 Production URL loads on a phone | Yes | https://pdfse-f26-itt.vercel.app (Live product in README) | |
| 2 Journey completes there | Yes | Walked by TT on mobile data: category select ➔ locked stack ➔ Day 1 checklist | |
| 3 North star event in Activity, from production | Yes | `user_commits_stack` verified live in PostHog Activity by TTC | |
| 4 Counts reconcile | Yes | PostHog 3 = Controlled Walk 3 in `03-build/analytics/event-schema.md` | |
| 5 Dashboard, linked in README | Yes | Public 3-tile dashboard link updated in README | |

## Real hours before Lab 8

| Initials | Teammate | Hours free | When, specifically |
|---|---|---|---|
| TTC | Tornike Chkoidze | 10 | Friday evening, Sunday morning, Tuesday standup |
| TT | Tatia Tkeshelashvili | 8 | Saturday afternoon, Monday evening, Tuesday standup |
| IG | Irakli Giguashvili | 8 | Friday afternoon, Sunday afternoon, Tuesday standup |
| **Total** | | **26** | |

## Stories this week

### S6 · Serverless Neon Postgres Persistence · owner TTC · reviewer IG · 5 h
**As** the team, **we** record stack commitments to a serverless Postgres database via a Next.js API route **so that** we have permanent backend record storage for SQL reconciles.
- Given a learner locks their stack, when `user_commits_stack` fires, a POST request to `/api/commit` stores `category`, `stack_name`, and timestamp in Neon Postgres.
- Smallest demo: Run SQL query `SELECT count(*) FROM commitments` and match PostHog Trends count.

### S7 · Conduct Field Week Testing Sessions · owner TT · reviewer TTC · 6 h
**As** Discovery lead, **I** distribute the production URL to 5 target ICP learners and observe usage **so that** we gather real usage metrics and verbatim reactions.
- 5 external learners receive the link and attempt to get started on their project.
- Logs and drop-offs documented in `02-design/user-testing/usability-findings.md`.

### S8 · PostHog 3-Tile Dashboard & Filter Verification · owner IG · reviewer TTC · 3 h
**As** Delivery lead, **I** maintain the public 3-tile dashboard (Trends, Funnel, Retention) with internal team filters enabled **so that** the course evaluators and team can inspect live traffic without login.

### S9 · Mid-Week Look & Funnel Audit · owner TTC · reviewer TT · 2 h
**As** Build lead, **I** inspect PostHog metrics midway through the week to check conversion rates from `learner_opens_app` to `user_commits_stack` and identify drop-off bottlenecks.

## Field week: who uses it

5 real learners from our ICP (not classmates), from discovery logs:

| Code name and role | Log or session they come from | How the link reaches them | Sent by, and by when | Opened? (fill in during the week) |
|---|---|---|---|---|
| Giorgi-K · 1st-year CS student | `01-discovery/interview-logs/01-student-kutaisi.md` | Messenger DM | TTC, Friday 18:00 | |
| Nika-K · Aspiring game dev | `01-discovery/interview-logs/05-gamer-kutaisi.md` | Messenger DM | TTC, Saturday 12:00 | |
| Mariam-T · Frontend switcher | `01-discovery/interview-logs/06-bootcamp-tbilisi.md` | Messenger message | TT, Friday 19:00 | |
| Konstantin-T · Career changer | `01-discovery/interview-logs/07-careerchanger-tbilisi.md` | Messenger / Email | TT, Saturday 11:00 | |
| Sandro-K · 2nd-year CS student | `01-discovery/interview-logs/08-student-kutaisi.md` | Messenger DM | IG, Saturday 14:00 | |

**What we tell them:** "Hey! We built a tool that cuts through tutorial paralysis and gives you one locked stack plus a 30-minute Day 1 setup checklist for your project. Try picking your stack here: https://pdfse-f26-itt.vercel.app and see if it gets you to working code."

## Prediction

**By Lab 8:** 12 `user_commits_stack` events from real external learners, not our team. Also: at least 6 `starter_command_copied` events.

**We are wrong if:** fewer than 4 learners lock a stack, or if more than 60% drop off between category selection and committing.

**Mid-week look:** TTC opens the dashboard on Sunday evening at 21:00 and writes one line here: what the counts are and one thing we change because of them, or nothing.

## The DECISIONS.md line

`Wk7 · Gate passed: live at https://pdfse-f26-itt.vercel.app, north star event firing from production, PostHog 3 = walk 3 · evidence: README links, 03-build/analytics/event-schema.md · owner: TTC`
