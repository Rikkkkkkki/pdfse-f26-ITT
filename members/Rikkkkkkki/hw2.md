# Homework 2 · Tatia Tkeshelashvili (@Rikkkkkkki) · ITT

## 1. Ship report

What I personally built, wired, deployed, tested, or reviewed since Lab 6.

| What I shipped | Story or rung | Commit link(s), from my account | Live at the production URL? | Walked or checked by |
|---|---|---|---|---|
| Ran prototype usability sessions 1 to 3 as runner and logged findings | S4 / Test Plan | [41ae9fb](https://github.com/Rikkkkkkki/pdfse-f26-ITT/commit/41ae9fb), [05ed20e](https://github.com/Rikkkkkkki/pdfse-f26-ITT/commit/05ed20e) | Yes | TTC and IG (logged and reviewed) |
| Ran and logged sessions 4 and 5 findings, and applied the decision rule across all 5 | S4 / Test Plan | [90cfd51](https://github.com/Rikkkkkkki/pdfse-f26-ITT/commit/90cfd51) | Yes | TTC (read the log) |
| Production walk on my phone over mobile data (rungs 1 and 2), reconciled with TTC against PostHog (3 = 3) | Rung 1, 2, 4 | No separate commit; recorded in 03-build/analytics/event-schema.md (Gate reconcile) | Yes | TTC (checked Activity) |
| Reviewed S1 and S2 as reviewer and reported mobile title wrapping and padding defects | S1, S2 (reviewer) | [4a6aa65](https://github.com/Rikkkkkkki/pdfse-f26-ITT/commit/4a6aa65) | Yes, after Tornike's fix | Tornike fixed it in [500011d](https://github.com/Rikkkkkkki/pdfse-f26-ITT/commit/500011d) |
| Linked the live Vercel URL in the README and the test plan | Rung 5 / Docs | [d861939](https://github.com/Rikkkkkkki/pdfse-f26-ITT/commit/d861939) | Yes | Self |

The piece I am least sure works for a real person, and how I will know by Lab 8: The mobile landing screen and idea input. In Session 2, Konstantin-T stalled on his phone because the font was tiny and he could not see where to type, and said: "I'd probably just google it at this point". By Lab 8 I will look at learner_opens_app against learner_selects_category in PostHog for mobile visitors; opens with no category selected means the landing view is losing them.

One thing I did that was not my assigned story: Wrote up the mobile layout breakdown from Session 2 in 02-design/user-testing/usability-findings.md and worked with Tornike on responsive font sizes and spacing before sending links for field week.

## 2. Pattern journal, Weeks 5 to 7

### Week 5 · One metric that matters
[CONFIRM] My part of the metric work was the acquisition end: I wrote the event spec for learner_opens_app (properties source and referrer, owner TT in 03-build/analytics/event-schema.md), so we could tell where field-week learners arrive from. In logs 01 and 05 learners described hoarding tutorials for weeks, so I backed Tornike's case that browsing metrics would not show a real decision. Beyond my lane: I read the schema against our interview logs to check that no event needed personal data. Hack: I walked the planned events on paper wireframes with dummy inputs before any code existed.

### Week 6 · The smallest complete journey
My piece was the frozen test plan, not the cut list (02-design/user-testing/test-plan.md). I set a 60-second completion threshold and wrote down the observable failure behaviors, so the test could not be bent after we saw results. I used Log 06's nine-column comparison spreadsheet as the evidence that comparison tools feed starting paralysis, which supported the cut in 03-build/mvp-boundary.md. Beyond my lane: I tightened the test plan's task wording after we froze the MVP. Hack: I rehearsed the task script as a voice memo to remove leading intonation.

### Week 7 · Ship to learn
As runner for sessions 1 to 3 I saw real behavior replace our assumptions. Session 1 passed under 60 seconds (Giorgi-K, 40 seconds). Session 2 showed the mobile screen failing: Konstantin-T gave up and said he would google it. In Session 3 I broke the silence protocol: Sandro-K asked which stack to pick and I answered "Pick the one you'd normally use" instead of the permitted line, so the log marks it FAIL / CONTAMINATED and partial evidence only. From then on I used the permitted line, and sessions 4 and 5 followed the protocol. Beyond my lane: I did the production walk on mobile data to check rungs 1 to 4 for the gate reconcile. Hack: I ran it with Wi-Fi off in incognito to rule out caching.

## 3. My DECISIONS.md lines

Wk7 · Prototype test: 1 pass, 2 fails across initial 3 sessions; rule holds to finish sessions 4 & 5; mobile layout fix prioritized · evidence: 02-design/user-testing/usability-findings.md (sessions 1 to 3) · owner: TT


I ran the first 3 sessions and applied the decision rule to them in usability-findings.md.

Wk7 · Usability testing complete: 3 passes, 2 fails across 5 sessions; core assumption holds; mobile input box and strict silence protocol verified · evidence: 02-design/user-testing/usability-findings.md (sessions 1 to 5) · owner: TT


I finished the log and applied the rule across all 5 sessions: 3 passes, 2 fails (one mobile, one contaminated), so we keep going.

## 4. My person this week

The field-week person I am responsible for: Mariam-T, frontend switcher (log 06) · how and when the link reaches them: a Messenger message on Friday at 19:00 with https://pdfse-f26-itt.vercel.app, then a message on Saturday to see whether she reached the Day 1 setup commands.