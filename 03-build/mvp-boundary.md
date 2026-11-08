# MVP Boundary

**Save this file as:** `03-build/mvp-boundary.md`

The smallest complete user journey that tests whether the product creates value by eliminating stack paralysis and driving first-time builders to execute code on Day 1.

**Value hypothesis under test:** First-time software builders commit to one opinionated tech stack and complete their Day 1 starter milestone in under 30 minutes, replacing weeks of tutorial hoarding and spreadsheet comparisons.

**The one person walking this journey:** Giorgi, 19, first-year student in Kutaisi with an idea for an app and no clear plan for building it (`00-foundation/icp.md`).

## The journey

1. **Giorgi arrives at StackLock** and selects his project category (Web App, Bot, 2D Game, Mobile).
2. **Giorgi enters his project idea** into the single-sentence idea input.
3. **Giorgi reviews his single locked stack** (tools, why locked, and strictly ruled-out distractions).
4. **Giorgi clicks "Commit to This Stack & Start Day 1"**, locking the decision and firing the North Star event.
5. **Giorgi copies the CLI starter command** to his terminal, launches the template, and marks his 3 Day 1 milestones as complete.

**Why this is complete:** Giorgi transitions from weeks of passive tutorial hoarding to executing real code on `localhost` in under 30 minutes, with the decision locked.

**Why this is smallest:** We considered removing the Day 1 checklist, but without concrete initial commands, the learner immediately returns to Google or YouTube and falls back into the comparison trap.

## Cut list

| Feature | Reason (cite the log, session, or hypothesis) | Comes back when |
|---|---|---|
| Course curation feed / tutorial links | Ruled out by log 01: hoarding 30 course playlists in Notion created an illusion of progress without code. Adding tutorials reinforces the problem. | Never (anti-pattern) |
| Multi-stack comparison table | Ruled out by log 06: creating 9-column comparison spreadsheets stalled development for weeks across three empty repositories. | Never (anti-pattern) |
| Engine/framework switcher | Ruled out by log 05: tool-hopping between Unity and Godot caused 3 abandoned projects and weeks lost. | Milestone 3 (if advanced users require custom overrides) |
| User registration / login | Unnecessary friction on Day 1; Giorgi needs to lock his stack immediately without creating credentials. | Sprint 2 (when persisting saved progress across devices) |
| Cloud deployment automation | Over-engineering for Day 1; running `localhost` within 30 minutes proves initial commitment. | Sprint 2 |

## Step to event

| Step | Event (actor_verb_object) | In the schema? |
|---|---|---|
| 1 | `learner_opens_app` | yes |
| 2 | `learner_selects_category` | yes |
| 3 | (view screen state) | yes |
| 4 | `user_commits_stack` ★ | yes (North Star) |
| 5 | `starter_command_copied`, `milestone_step_toggled` | yes |

**North star step:** Step 4 (`user_commits_stack`).

## The DECISIONS.md line

`Wk6 · MVP boundary: 5-step journey (category selection to Day 1 milestone execution); cut tutorial library, stack comparison matrix, and user authentication · evidence: 03-build/mvp-boundary.md, 01-discovery/interview-logs/01-student-kutaisi.md, 05-gamer-kutaisi.md, 06-bootcamp-tbilisi.md · owner: TTC`
