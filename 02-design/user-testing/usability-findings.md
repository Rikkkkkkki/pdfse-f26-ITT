# Usability Findings

One block per session, written within an hour of running it, in the order you ran them. Same discipline as an interview log: behavior timed, quotes verbatim, verdict against the rule from `02-design/user-testing/test-plan.md`.

## Session 1 · Giorgi-K · 1st-year CS student · his laptop · ran TT, logged TTC

**Task read:** "You have a personal project idea that you want to start building this evening. Open this link and show me what you would do to get started."

| Time | What they did | What they said (verbatim) | Note |
|---|---|---|---|
| 0:00 | Task read | | |
| 0:06 | Clicked the first option on the landing page | | First action, no hesitation |
| 0:15 | Picked a project type, chose a tool | | |
| 0:28 | Reached the "choose a first step" screen, paused about 8 s | | Short pause, no question to runner |
| 0:40 | Picked the smallest step, copied the starter command | "Okay, copy this." | Unprompted |

**Time to first tap/click:** 0:06  
**Time to the one action:** 0:40  
**Result vs rule:** PASS. Under 60 s, no question to the runner, runner stayed silent.  
**Surprise:** None. (Then ask: did we lead? Runner said nothing, so no.)  
**Answer to "what were you expecting to happen?":** "That it would give me a command to run."

---

## Session 2 · Konstantin-T · career changer / mathematician · his phone · ran TT, logged TTC

**Task read:** "You have a personal project idea that you want to start building this evening. Open this link and show me what you would do to get started."

| Time | What they did | What they said (verbatim) | Note |
|---|---|---|---|
| 0:00 | Task read | | |
| 0:20 | Scrolled up and down twice on mobile screen | | Looking for where to begin |
| 0:40 | Tapped the logo (did nothing) | "Where do I put my idea?" | Unprompted; expecting input box |
| 1:10 | Tried to pinch-zoom the text | "The text is tiny." | Mobile layout/readability issue |
| 1:50 | Stalled; could not see where to begin | ★ "I'd probably just google it at this point." | Immediate fallback to search workaround |
| 2:30 | Stopped by tester; closed the tab | | Abandoned session |

**Time to first tap/click:** 0:40 (tapped logo)  
**Time to the one action, or did not complete:** Did not complete (abandoned at 2:30).  
**Result vs rule:** FAIL. Failure on mobile layout and no obvious input field; abandoned at 2:30.  
**Surprise:** ★ The "google it" quote tells us what the prototype competes with when friction occurs.  
**Answer to "what were you expecting to happen?":** "A box to type my idea into."

---

## Session 3 · Sandro-K · 2nd-year non-CS student · his laptop · ran TT, logged IG

**Task read:** "You have a personal project idea that you want to start building this evening. Open this link and show me what you would do to get started."

| Time | What they did | What they said (verbatim) | Note |
|---|---|---|---|
| 0:00 | Read the intro paragraph aloud, clicked "Start" | | First action |
| 1:30 | Paused and asked runner for stack guidance | "Should I pick Python or JavaScript?" | Failure behavior 2 |
| 1:31 | Runner answered: *"Pick the one you'd normally use."* | | **Rule break:** Hint given; not the permitted line |
| 2:00 | Picked JavaScript | | Continued after hint |
| 3:10 | Selected step without conviction | "I don't know, I just pick the first one." | Unprompted |
| 5:20 | Reached locked stack | "Oh, it already decided for me." | Unprompted surprise at opinionated lock |
| 5:40 | Finished flow | | Total duration 5 min 40 s |

**Time to first tap/click:** 0:15  
**Time to the one action:** 5:40  
**Result vs rule:** FAIL / CONTAMINATED. Took >60 s, asked runner which stack to pick at 1:30, and runner gave advice instead of silence. Counted as partial evidence only.  
**Surprise:** Expected to have to compare stacks manually ("I thought I'd have to compare them myself").  
**Answer to "what were you expecting to happen?":** "I thought I'd have to compare them myself."
**Logger's note (IG):** The runner's hint at 1:31 is why I marked this CONTAMINATED instead of dropping it, and it is what pushed us to the strict silence protocol and single permitted line before sessions 4 and 5. Sandro-K is also my field-week follow-up (`03-build/sprints/sprint-2.md`), so his "compare them myself" expectation is what I will pre-empt when I send him the link.

---

## After 3 sessions: apply the decision rule

**Sessions run:** 3 · **Pass:** 1 · **Fail:** 2 (1 clear fail on mobile, 1 contaminated fail)  
**Rule says:** Rule requires 3 or more fails out of 5 to change course. With 1 pass and 2 fails, the rule says **keep going to finish sessions 4 and 5** (Luka-K and Elena-M).

**Immediate adjustments before sessions 4 & 5:**
1. Fix the mobile styling and add an obvious text input box for the project idea.
2. Runner must strictly hold silence and say only the permitted line (*"Whatever you would normally do if I weren't sitting here."*) if asked questions.

**DECISIONS.md line added:**
```markdown
Wk7 · Prototype test: 1 pass, 2 fails across initial 3 sessions; rule holds to finish sessions 4 & 5; mobile layout fix prioritized · evidence: 02-design/user-testing/usability-findings.md (sessions 1 to 3) · owner: TT
```

---

## Session 4 · Elena-M · colleague learning SQL / career changer · her phone · ran TT, logged TTC

**Task read:** "You have a personal project idea that you want to start building this evening. Open this link and show me what you would do to get started."

| Time | What they did | What they said (verbatim) | Note |
|---|---|---|---|
| 0:00 | Task read | | |
| 0:10 | Scrolled once, tapped the idea input box | | Found the input box on the first screen |
| 0:25 | Typed a one-line idea | | |
| 0:40 | Hesitated about 15 s on the stack screen, looked up at runner | | |
| 0:41 | Runner used the permitted line: *"Whatever you would normally do if I weren't sitting here."* | | Protocol followed exactly |
| 0:50 | Locked the stack | "I'll just go with the first one." | Unprompted |
| 0:58 | Copied the starter command | | |

**Time to first tap/click:** 0:10  
**Time to the one action:** 0:58  
**Result vs rule:** PASS, narrowly. Under 60 s, but the hesitation at 0:40 is worth a note.  
**Surprise:** ★ Passed, but picked the first stack without comparing. Does the prototype make choosing too easy, or is that the point?  
**Answer to "what were you expecting to happen?":** "A box to type my idea in, and it was there."

---

## Session 5 · Luka-K · 2nd-year non-CS student gamer · his laptop · ran TT, logged IG

**Task read:** "You have a personal project idea that you want to start building this evening. Open this link and show me what you would do to get started."

| Time | What they did | What they said (verbatim) | Note |
|---|---|---|---|
| 0:00 | Task read | | |
| 0:08 | Clicked "Start" | | |
| 0:20 | Picked a tool without stopping | | |
| 0:35 | Copied the starter command, opened a terminal on their laptop | "I'll try this." | Went beyond the prototype on their own |

**Time to first tap/click:** 0:08  
**Time to the one action:** 0:35  
**Result vs rule:** PASS. Under 60 s, no runner hints needed, copied starter command.  
**Surprise:** ★ Opened a terminal immediately. Is the starter command what they actually wanted from the tool?  
**Answer to "what were you expecting to happen?":** "Something like this, yeah."
**Logger's note (IG):** I logged the 0:35 terminal moment carefully because it goes beyond the prototype: Luka-K copied the starter command and opened a real terminal unprompted, which is exactly the `starter_command_copied` engagement event I own in `03-build/analytics/event-schema.md`. Flagging it as the signal to watch on the dashboard, not just a pass.

---

## After 5 sessions: apply the decision rule

**Sessions run:** 5 · **Pass:** 3 (Sessions 1, 4, 5) · **Fail:** 2 (Session 2 mobile layout fail, Session 3 contaminated fail)  
**Rule says:** Rule requires 3 or more fails out of 5 to change course. With 3 passes and 2 fails, the **core assumption holds** (a stuck beginner will commit to a single opinionated tech stack and launch Day 1 setup commands when guided by a clear input flow). Proceed with full build phase.

**DECISIONS.md line added:**
```markdown
Wk7 · Usability testing complete: 3 passes, 2 fails across 5 sessions; core assumption holds; mobile input box and strict silence protocol verified · evidence: 02-design/user-testing/usability-findings.md (sessions 1 to 5) · owner: TT
```  
