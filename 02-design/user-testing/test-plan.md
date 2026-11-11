# Prototype Test Plan

**Prototype v1 link:** [StackLock Prototype on Vercel](../../README.md) (`app/`)

**Riskiest assumption under test:** A stuck beginner will commit to a single opinionated tech stack and launch Day 1 setup commands, rather than continuing to research and compare tutorials.

## The frozen test

**Task, read aloud word for word:** "You have a personal project idea that you want to start building this evening. Open this link and show me what you would do to get started."

**Success:** Selects category, reviews the locked stack, clicks "Commit to This Stack & Start Day 1" within 60 seconds, and copies the terminal setup command without asking for assistance.

**Failure behaviors:**
1. Spends over 60 seconds reading ruled-out distractions and hesitates to click commit.
2. Asks the runner which stack is "better" or asks what to click.
3. Leaves the tab to search Google/YouTube for alternative tutorials before locking.
4. Tries to switch stacks after locking without attempting the Day 1 command.

**Decision rule (out of 5):** 3 or more fail: the assumption is weakened. Before building multi-step checklists, test a version where the CLI starter command is front and center before the stack lock.

**Predicted first mistake:** Clicks between all 4 categories comparing tools instead of focusing on their own project type.

## Five testers

All five from our ICP (`00-foundation/icp.md`). None in this course. Code names only; real names and contacts stay in team chat.

| # | Code name | Role (as in your ICP) | Why they fit the ICP | Session runner (asks) | Session logger (writes) | Target day | Status (messaged / booked / done) |
|---|---|---|---|---|---|---|---|
| 1 | Giorgi-K | 1st-year CS student, Kutaisi | Log 01. Stuck 5 weeks in Notion tutorial hoarding | TT | TTC | Week 7, Tue | booked |
| 2 | Sandro-K | 2nd-year student, Kutaisi | Log 08. Built weather app, stalled on 25-item list | TT | IG | Week 7, Wed | booked |
| 3 | Konstantin-T | Career changer / mathematician, Tbilisi | Log 07. 1 hr/day, rewrites weekly schedule | TT | TTC | Week 7, Wed | booked |
| 4 | Luka-K | 1st-year student gamer, Kutaisi | Log 05. Tool-hopped Unity to Godot | TT | IG | Week 7, Thu | messaged |
| 5 | Elena-M | Colleague learning SQL, Tbilisi | New; introduced by Konstantin in Log 07 | TT | TTC | Week 7, Thu | messaged |

## Session protocol (same every time)

1. The tester opens the link on their own phone or laptop browser. Not yours.
2. The runner reads the task word for word, then says nothing.
3. The logger starts the timer on the last word of the task and writes: time to first tap, time to the one action, every unprompted sentence verbatim.
4. When the tester stops, or at 2 minutes, the runner asks one question only: "What were you expecting to happen?"
5. The logger writes the verdict against the rule before anyone discusses the session.
