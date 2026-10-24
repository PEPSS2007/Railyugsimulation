# Railyug — Detailed Architecture and Build Specification
Build spec for IMPACTX 2026 · Challenge 01 · All demo data is simulated

## Preface & Objective
Build a polished, demo-ready SIMULATION of Railyug, a railway journey-management assistant for the IMPACTX 2026 challenge "Reimagining Railway Travel". This is a hackathon prototype with fixed simulated data. It must never claim to book trains, cancel real tickets or move real money.

### Honesty Rules
- Label all data simulated. Never imply SIM-202 is delayed. Never present synthetic estimates as calibrated. Never use wording that says booked, cancelled or refunded for real.
- Do not add decorative controls that do nothing. Do not add dependencies unnecessarily.

### Definition of Done
The app runs without errors, all sections work by keyboard and pointer, the delay changes the journey state, the unsafe split is blocked with an explanation, plans re-rank and can be selected, refund states and audit events update visibly, the Tatkal hold works, simulated data is labelled everywhere, and you have summarised files changed, interactions built, verification you actually did, and any remaining issues.

---

## 1. What This Spec Changes From the Suggestion Prompt
- Brand colours come from your logo, not navy and teal: Indigo `#1B0F4A`, Plum `#7A2455`, Orange `#F28C38`, Amber `#FDBA4A` on Canvas `#FBF8F4`.
- Navigation grows from five to seven sections: Overview, Passengers, Plan Options, Tatkal Hold, Refunds, Activity Log, Journey Pack, plus More (Roadmap and Compliance, Data Card, Settings).
- One concrete scenario with fixed times, distances and amounts, so the 55-minute delay produces the same result every run.
- Family split planner lets an evaluator try an unsafe split and see it blocked with plain reason and fix.
- Tatkal fair-booking hold is a full feature (Processing label, 3-minute payment window, automatic release).
- Every feature in your list of 46 plus Tatkal is assigned a level: Full, Lite or Roadmap.
- Compliance note says Railyug, not RailSaathi.

---

## 2. Design System (Derived From the Logo)
- `--brand-indigo`: `#1B0F4A` (Headings, body text on light, sidebar background, primary buttons)
- `--brand-plum`: `#7A2455` (Secondary accents, selected states, charts)
- `--brand-orange`: `#F28C38` (Primary call-to-action fill - always with indigo text, highlights)
- `--brand-amber`: `#FDBA4A` (Small highlights, focus ring accent)
- `--canvas`: `#FBF8F4` (Page background)
- `--surface`: `#FFFFFF` (Cards, tables)
- `--border`: `#E7E1EA` (Card and table borders)
- `--success`: `#1F7A4D` (Confirmed, feasible, safe)
- `--warning`: `#B45309` on `#FEF3C7` (Waitlisted, at risk, unknown)
- `--danger`: `#B3261E` on `#FDECEA` (Missed connection, blocked plan)

### Design Rules
- White text on orange fails contrast. Orange fills always carry indigo text (`#1B0F4A`).
- Brand orange is decoration and call-to-action only. Status warnings use the warning token plus an icon and the word "At risk".
- Every status uses icon + word + colour. Never colour alone.
- Typography: Montserrat for headings, Inter for body and tables.
- Radius 12px on cards, 8px on controls. One subtle shadow. No decorative gradients.
- Focus ring: 3px indigo with 2px white inner gap, visible on every interactive element.
- Header tagline: "Tickets & Comfort".
- Badges:
  - OFFICIAL: Solid indigo, shield icon, authoritative railway information.
  - CROWD: Plum outline, people icon, passenger reports (advisory only, shows report count).
  - PREDICTED: Dashed outline, trend line icon, model estimate (always shows a range).

---

## 3. Information Architecture and Navigation
One Next.js page with client-side section switching:
1. Overview: The whole story at a glance (Journey timeline, connection-risk meter, delay button, alert banner, plan summary, passenger strip).
2. Passengers: Safety rules and family planning (Five passenger cards, rules panel with live status, family split planner, seat-swap consent demo).
3. Plan Options: Compare and choose (Priority selector, 3 ranked plans + 1 rejected example, Why this plan panel, consequence preview dialog, leg dependency comparison).
4. Tatkal Hold: No-overlap seat reservation (Seat grid, Processing label, countdown, second-user simulator).
5. Refunds: Per-passenger ledger (Ledger table, four-step tracker, cancellation impact, reconciliation).
6. Activity Log: Audit trail (Append-only event list with filters).
7. Journey Pack: Offline essentials (Coach and seat, fallback plan, contacts, entitlements, sync status).
More: Roadmap and Compliance, Data Card, Settings.

Top Bar: Page title, persistent SIMULATED DATA pill, rule-set version rules-v1.0, low-bandwidth toggle, Reset scenario button.
Global Live Region: aria-live="polite" element for updates, role="alert" for delays and blocked plans.

---

## 4. Scenario Dataset (Fixed Numbers)
- Origin, junction, destination: Sample City A (SCA) -> Central Junction (CJN) -> Sample City B (SCB).
- Leg 1: SIM-101, SCA 06:00 to CJN 11:20, ticket CONFIRMED.
- Leg 2: SIM-202, CJN 12:00 to SCB 17:30, ticket WAITLISTED, estimated confirmation 38 to 55% from 214 similar synthetic cases ("Synthetic, not calibrated").
- Scheduled connection: 40 minutes (11:20 to 12:00), arrival platform 2, departure platform 9, distance 420m.
- Delay scenario: Train 1 runs 55 minutes late (arrival 12:15, missed connection by 15 minutes). SIM-202 is NOT delayed. Clock starts 07:00 and jumps to 10:30 on delay announcement.
- Passengers:
  - P1: Older passenger, limited mobility, needs step-free route (ramp/lift), lower berth, never separated from P2.
  - P2: Caregiver, designated caregiver of P1, hard-linked to P1.
  - P3: Child under five, dependent, requires guardian (P2, P4, or P5), luggage/care buffer.
  - P4: Screen-reader user, assistive technology, keyboard & screen-reader flows.
  - P5: Adult family member, flexible, candidate for splitting.
- Fares: Leg 1 1,100; Leg 2 1,450; Child 0. Demo refund rule: fare minus 60 clerkage.
- Plans:
  - Plan A: Stay on booked trains (SIM-101 + SIM-202).
  - Plan B: Re-route together on SIM-303 from CJN 13:10, arrives SCB 18:50 (range 18:50 to 19:20), confirmed seats, ramp & lift known, extra cost 6,200.
  - Plan C: Re-route together on SIM-505 from CJN 13:40, arrives SCB 19:55 (range 19:55 to 20:40), cheaper (extra cost 3,400), arrival platform ramp status Unknown.
  - Plan D (rejected example): Fastest split: P2, P3, P4, P5 on SIM-303; P1 on SIM-505 (P1 separated from P2, Blocked by R1).

---

## 5. Engine Rules & Formulas
- Transfer feasibility:
  `walk = distance / speed`
  `required = walk * (1 + luggageFactor 0.10) + (liftWait 4 min or stairsPenalty) + childCareBuffer`
  `group = max(required) + regroupBuffer 5 min`
  `available = scheduledConnection - delay`
  `margin = available - group`
  Fixture: P1 walking speed 0.5 m/s, carried child 0.7 m/s, others 1.2 m/s. P1 walk = 420 / 0.5 = 14m * 1.1 = 15.4 + 4 + 5 = 24.4m -> 24 min (range 21 to 29). On-time margin: 40 - 24 = 16 min (Feasible). Delayed: -15 min (Infeasible).
- Waitlist estimator: Wilson 95% interval on synthetic cases. Low data warning if n < 30.
- Constraint solver:
  - R1: P1 and P2 never separated.
  - R2: P3 always with at least one guardian (P2, P4, P5).
  - R3: Known step-free failure rejects plan; Unknown accessibility flags plan with 0.85 multiplier. Infeasible connection rejects plan.
- Ranker:
  - Factors: Arrival (1 - clamp((expected - earliest) / 180)), Reliability (1 - clamp(width / 120)), Transfer (clamp(margin / 30)), Confirmation (lower bound), Cost (1 - clamp(extra cost / 7000)).
  - Presets: Balanced (0.30/0.10/0.15/0.20/0.25), Lowest cost (0.10/0.05/0.10/0.25/0.50), Fastest arrival (0.50/0.10/0.15/0.20/0.05), Lowest risk (0.10/0.25/0.30/0.30/0.05).
  - Tie-breakers: higher score -> earlier latest arrival -> lower cost -> plan id.
- Tatkal Hold:
  - 3-minute payment countdown (or 20s demo mode), single atomic hold, all-or-nothing group hold, conflict rejection for competing user ("Seat just taken"), automatic release on expiry.
- Refund State Machine:
  - 4 states strictly in order: Cancellation -> Refund initiated -> Refund processing -> Final credit. Advance moves 1 step. Total reconciled to ₹5,560 for Leg 2 cancellation.
