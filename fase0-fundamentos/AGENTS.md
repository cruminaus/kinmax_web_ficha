# Prototype Instructions

Run the local server yourself and open the preview in the browser available to this environment. Do not give the user server-start instructions when you can run it.

Before making substantial visual changes, use the Product Design plugin's `get-context` skill when the visual source is unclear or no longer matches the current goal. When the user gives durable prototype-specific design feedback, preferences, or decisions, record them in `AGENTS.md`.

When implementing from a selected generated mock, treat that image as the source of truth for layout, component anatomy, density, spacing, color, typography, visible content, and hierarchy.

Build app UI in `src/`. Keep `.openai/hosting.json`, `worker/index.js`, `scripts/prepare-sites-build.mjs`, and `tests/sites-worker.test.mjs` intact so the same local prototype can be handed to Sites. Before a Sites handoff, run `npm run build` and `npm run test:sites`; the build must leave `dist/client/index.html`, `dist/server/index.js`, and `dist/.openai/hosting.json`.

## Selected visual direction

- The user selected ideation option 3, "Contexto Primero", for Phase 0.
- Preserve the dominant patient/episode safety header, compact E1-E6 navigator, single-column clinical task flow, and explicit meaningful-empty-state controls.
- Tablet is the priority viewport; desktop is a responsive extension of the same design language.

## Approved foundation and Phase 1

- The user approved Phase 0 on 2026-10-03.
- Phase 1 implements E4 · Sesión y evolución inside the same prototype, reusing the approved components, visual style, and tokens.
- E4 must prioritize fast entry without automatic copying, keep plan/precautions/previous-session context compact, and visibly block validation when required clinical or configurable consent data is missing.
- The user approved Phase 1 (E4) on 2026-10-03.
- Phase 2 implements E2 · Evaluación inicial inside the same prototype.
- Reuse the E4 header, record-state language, Medición, and Escala con nombre. Any shared-component change must be documented and justified.
- E2 must keep the three-state safety panel visible, show section states without completion percentages, support specialty modules, and preserve partial work when an evaluation is interrupted.
- Stop after the complete E2 deliverable; do not start E1 until the user approves Phase 2.
- The user approved Phase 2 (E2) on 2026-10-03.
- Phase 3 implements E1 · Ingreso y apertura inside the same prototype.
- Reuse the persistent header, record states, meaningful empty values, Documento adjunto, Selector de episodio, and Aclaración vinculada. Document and justify any shared-component change.
- E1 must optimize reception speed, require explicit duplicate decisions without automatic merging, separate administrative and clinical visibility, support minors and non-RUT documents as normal flows, distinguish new patient from new episode, and label referral content as received information.
- Stop after the complete E1 deliverable; do not start E3 until the user approves Phase 3.
- The user approved Phase 3 (E1) on 2026-10-03.
- Phase 4 implements E3 · Planificación y acuerdo inside the same prototype.
- Reuse the persistent header, record states, meaningful empty values, Measurement, Dose Indicator, Document Attachment, Linked Clarification, and the Phase 0 Consent Block. Document and justify shared-component changes.
- E3 must connect every objective to E2 conclusions and baseline values, keep planned work distinct from performed work, surface E2 precautions before the plan, support accepts/rejects/defers and minors, block execution when configurable written consent is missing, provide a plain-language patient summary, warn when indicators change, and preserve plan version history.
- Procedures requiring written consent remain configurable and pending clinic definition.
- Stop after the complete E3 deliverable; do not start E5 until the user approves Phase 4.
- The user approved Phase 4 (E3) on 2026-10-04.
- Phase 5 implements E5 · Reevaluación y ajuste inside the same prototype.
- Reuse the persistent header, record states, meaningful empty values, Measurement, the comparison table, E3 objectives, E4 attention timeline, Linked Clarification, and the E3 Consent Block. Document and justify shared-component changes.
- E5 must support contextual comparison variants, multiple clinical triggers without a universal session count, an episode summary that never becomes current state, protected E3 objectives with evidence, explicit interpretation and a dominant decision, branching to E4/E6 or referral, patient participation, absence without creating an E5, and distinct authorship.
- The Phase 0 Comparison Table is extended in place to support same instrument, different instrument, and unavailable baseline while retaining its five shared states.
- Stop after the complete E5 deliverable; do not start E6 until the user approves Phase 5.
- The user approved Phase 5 (E5) on 2026-10-04.
- Phase 6 implements E6 · Alta o cierre del episodio and the final F0–F6 consistency review.
- Reuse the persistent header, episode timeline, record states, meaningful empty values, E5 Comparison Table, Document Attachment, E3 objective pattern, and Linked Clarification.
- E6 must keep evaluated and non-evaluated closure routes distinct, never infer recovery, exclude absences from effective sessions, require reason-specific information, preserve report delivery traceability, expose pending-record warnings, and keep closed episodes consultable without silently reopening or editing them.
- Proposed permissions remain pending clinic confirmation: kinesiology validates closures; reception may record delivery and view administrative closure data.
- Open decisions must remain explicit: whether a closed episode can reopen and the inactivity threshold for administrative closure.
