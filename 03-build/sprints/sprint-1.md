# Sprint 1

**Save this file as:** `03-build/sprints/sprint-1.md`

Sprint 1 runs from Week 6 to the Week 7 lab and ends at the gate: deployed at a public HTTPS URL, with the North Star event firing live in PostHog.

## Definition of done

The StackLock single-screen web app runs live on Vercel at a public HTTPS URL, verified on mobile and desktop browsers, where a learner can choose their project category, lock their stack decision, and fire the `user_commits_stack` North Star event cleanly in PostHog Activity view.

## Real hours before the Week 7 lab

| Initials | Teammate | Hours free | When, specifically |
|---|---|---|---|
| TTC | Tornike Chkoidze | 10 | Tuesday evening, Thursday evening, Saturday standup |
| TT | Tatia Tkeshelashvili | 8 | Wednesday afternoon, Friday evening, Saturday standup |
| IG | Irakli Giguashvili | 8 | Wednesday evening, Thursday afternoon, Saturday standup |
| **Total** | | **26** | |

## The board

Where it lives: GitHub Projects on repository `Rikkkkkkki/pdfse-f26-ITT`. Four columns: Next, Doing, Review, Done. One card per story below.

## Stories

### S1 · North Star Commitment & Lock Screen · owner TTC · reviewer TT · 6 h

**As** Giorgi, a first-time software builder (`00-foundation/icp.md`), **I** view a single opinionated tech stack for my project type and click to lock the decision **so that** I break out of tutorial comparison paralysis.

**Acceptance criteria:**
- Given the learner is on the homepage, when they select "Web App", "Bot", "Game", or "Mobile", then the single locked stack card dynamically updates with tools, rationale, and strictly ruled-out technologies.
- And clicking "Commit to This Stack & Start Day 1" disables the selector and reveals the "Decision Locked" confirmation state.
- And `user_commits_stack` fires with `{ project_category, stack_name, project_idea }` visible in PostHog.

**Smallest demo that proves it:** Select "Web App", enter "Student Budget App", click "Commit to This Stack", and show the event in PostHog Live Events stream within 30 seconds.

### S2 · Day 1 Milestone Checklist & Command Copy · owner TTC · reviewer IG · 4 h

**As** Giorgi, **I** copy the starter setup command and check off the 3 Day 1 milestones **so that** I get working code running on `localhost` within 30 minutes.

**Acceptance criteria:**
- Given the stack decision is locked, when the learner clicks "Copy Command", the terminal setup command is copied to clipboard and button displays "✓ Copied!".
- And clicking any of the 3 Day 1 checkboxes toggles completed state and triggers `milestone_step_toggled`.

**Smallest demo that proves it:** Click "Copy Command", paste into terminal to show command string, and check all 3 checkboxes.

### S3 · Deploy to Vercel and Instrument Analytics · owner TTC · reviewer TT · 5 h

**As** the team, **we** deploy the Next.js app to Vercel and wire PostHog via the `/ingest` rewrite proxy **so that** external testers can access the prototype on mobile and desktop.

**Acceptance criteria:**
- App builds cleanly on Vercel with green status from root `app/`.
- Public HTTPS URL is added to `README.md` under the `Prototype` row.
- PostHog captures events without ad-blocker dropoff.

**Smallest demo that proves it:** Open the Vercel URL on a physical phone, commit a stack, and observe the live event in PostHog dashboard.

### S4 · Run User Testing Sessions · owner TT · reviewer IG · 6 h

**As** the Discovery lead, **I** conduct 3 user testing sessions using the deployed prototype on target learners **so that** we validate whether the locked stack removes starting hesitation.

**Acceptance criteria:**
- 3 student testers complete the task: "Select your project type, commit to the stack, and walk through the Day 1 checklist."
- Observer notes recorded in `02-design/user-testing/`.

### S5 · Submission Verification and Tagging · owner IG · reviewer TTC · 3 h

**As** the Delivery lead, **I** audit all files against the Lab 6 rubric and push milestone tags **so that** all deliverables meet course criteria.

**Acceptance criteria:**
- Git repository contains all 5 required Lab 6 artifacts on `main`.
- Clean commit history verified from owner accounts.

## Slip rule

If S2 (Day 1 milestone checklist) is delayed by the evening before the Week 7 lab, the interactive checklist UI moves to Sprint 2, while S1 (the locked stack selection and the `user_commits_stack` PostHog event) and S3 (the live Vercel deployment) stay no matter what.

## The DECISIONS.md lines

`Wk6 · Prototype track: the first deployed screen of the journey is the prototype; frozen test from 02-design/user-testing/test-plan.md runs on it, 3 sessions before the Week 7 lab · evidence: 03-build/sprints/sprint-1.md S1 · owner: TTC`
