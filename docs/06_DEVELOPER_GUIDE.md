# Two-Developer Working Guide

## 1. Purpose and team structure

This is the source of truth for how Developer 1, Developer 2, and Codex collaborate. Product decisions live in `01_PRD.md`; technical boundaries in `02_ARCHITECTURE.md`; screens in `03_WIREFRAME.md`; access rules in `04_FLOW_RBAC.md`; work status in `05_TASKS.md`.

- **Developer 1 (D1):** Frontend Lead and Integration Owner. Owns documentation coordination, foundation, shared UI, app/router integration, onboarding/auth, notifications, profile/settings, package and build configuration.
- **Developer 2 (D2):** Frontend Feature Developer. Owns groups, wizard, members, group roles, tracking/map consumers, speed, navigation, trips, alerts/SOS, and reports.
- **Codex:** Works on one explicit bounded task at a time, within the assigned ownership and change list.
- **Platform owner administration:** assigned after foundation and major domain contracts stabilize.

Ownership establishes primary review responsibility; it does not permit uncoordinated edits to another owner’s files.

## 2. Folder ownership

| Folder/area | Primary owner | Rule |
|---|---|---|
| `docs/` | D1 | Product/RBAC changes require D2 and stakeholder review |
| package, Vite, TypeScript, Tailwind, lint/test config | D1 | Always coordination required |
| `src/app/` | D1 | Feature developers export routes; D1 performs central composition |
| `src/components/ui`, `common`, `layout`, `feedback` | D1 | Request change before editing; preserve public contracts |
| `src/styles/` | D1 | Token changes always coordinated |
| onboarding, auth, notifications, profile, settings | D1 | D2 reviews shared domain impacts |
| groups, tracking, speed-limit, navigation, trips, alerts, reports | D2 | D1 reviews shared route/service impacts |
| `src/components/maps` | D1 contract + D2 consumer review | Provider-independent changes always coordinated |
| cross-feature `services`, `store`, `types`, `mocks`, `hooks`, `lib` | D1 integration owner | Joint design before creation/change |
| owner-admin | TBD | D1 retains route/shared integration |

Feature-specific code stays inside its feature. Promote code to shared only after a demonstrated second use and explicit owner agreement.

## 3. Branch strategy

Permanent branches:

- `main`: stable, approved releases only.
- `develop`: integrated UI work ready for combined testing.

Never push directly to either. Every task uses a temporary branch created from the latest `develop` and merged through a reviewed Pull Request. Delete the temporary branch after merge.

Approved patterns:

```text
feature/foundation-ui
feature/auth-onboarding-ui
feature/group-wizard-ui
feature/groups-members-ui
feature/live-map-ui
feature/speed-mode-ui
feature/trips-reports-ui
feature/profile-settings-ui
feature/owner-admin-ui
fix/<short-kebab-description>
refactor/<short-kebab-description>
docs/<short-kebab-description>
test/<short-kebab-description>
chore/<short-kebab-description>
```

Prefer one task or a tightly related small task set per branch. Do not keep permanent personal branches. Never rewrite shared branch history after review starts without notifying the reviewer.

## 4. Starting and updating work

Before starting:

1. Confirm the task is `Ready` in `05_TASKS.md` and assigned to you.
2. Read all six documents, then re-read the task’s relevant requirements/screens/flows.
3. Inspect existing code and working-tree status; preserve unrelated or uncommitted work.
4. Identify exact files to create/modify and whether any are shared.
5. Coordinate shared files and dependency changes before editing.
6. Update local `develop` through the team’s approved non-destructive workflow.
7. Create the feature branch from that latest `develop`.

While a branch is active, update from `develop` regularly for long-running work. Prefer merging `develop` into the feature branch unless the team has explicitly agreed to rebase and no shared history will be disrupted. Resolve conflicts on the feature branch, run all relevant checks, and have the owner of the conflicted shared file review the resolution.

## 5. Task naming and scope

Use the task ID in issue/PR titles and working notes, for example:

```text
[AUTH-003] Add OTP verification page
[GRP-005] Add visibility-settings wizard step
```

A normal task touches approximately 1–8 files. Stop and split the task when it begins to:

- introduce unrelated screens;
- alter multiple feature boundaries;
- require an unapproved dependency;
- rewrite shared primitives;
- mix refactoring with feature behavior; or
- require a product decision from the Open Questions list.

## 6. Commit messages

Use:

```text
feat(scope): description
fix(scope): description
refactor(scope): description
docs(scope): description
test(scope): description
chore(scope): description
```

Examples:

```text
feat(auth): add responsive login screen
feat(groups): add privacy step to group wizard
fix(layout): correct mobile bottom navigation spacing
docs(architecture): document mock service strategy
test(rbac): cover suspended group guard
```

Use imperative, lowercase descriptions without a trailing period. One commit should tell one coherent story. Do not include generated artifacts, secrets, unrelated formatting, or another developer’s work without attribution and coordination. Reference the task in the PR; include it in the commit body when useful.

## 7. Pull Request workflow

1. Reconcile with latest `develop` and resolve conflicts locally.
2. Run format, lint, typecheck, relevant tests, and production build.
3. Review your own diff for unrelated files, secrets, hardcoded values, and generated artifacts.
4. Open a PR into `develop`; never into `main` for feature work.
5. Title with task ID and outcome.
6. Describe scope, exact files, screenshots/viewports, test evidence, accessibility checks, mock states, risks, and any shared-file coordination.
7. Request review from the other developer and the shared-file owner.
8. Address comments with new commits unless an agreed cleanup is needed.
9. Resolve all actionable comments and rerun checks.
10. Merge only after approval and required checks pass; delete the branch.

Suggested PR body:

```text
Task:
Outcome:
Created files:
Modified files:
Shared files / coordination:
Responsive states checked:
Accessibility checked:
Tests and commands:
Known limitations / open questions:
Screenshots:
```

## 8. Code review rules

Review behavior before style. Check:

- requirement and screen-ID compliance;
- mode, platform-role, group-role, lifecycle, subscription, block, invitation, OTP, and location behavior;
- no prohibited group data/navigation in Speed Only Mode;
- payment never directly activates a group;
- no password UI and optional email behavior;
- type safety and feature/import boundaries;
- presentational components do not call services;
- all relevant loading/empty/error/success/disabled states;
- mobile/tablet/desktop behavior from 360px;
- keyboard, focus, semantics, labels, announcements, contrast, and non-color cues;
- no real integration claims, personal mock data, secrets, invented prices/providers/legal text;
- tests prove risky logic rather than implementation details.

Comments should state observed evidence, risk, and requested outcome. Mark optional suggestions clearly. Authors should answer with evidence and avoid silently changing scope.

## 9. Merge rules

- Never merge your own PR without the required other-developer review.
- Shared-file PRs need the primary owner’s approval.
- Do not merge with failing required checks, unresolved conflicts, or unresolved actionable review threads.
- Use the repository’s agreed merge method consistently; do not change history policy during a feature.
- `develop` contains integrated UI work; `main` receives only explicitly approved releases through a separate release PR.
- Hotfixes still use a branch and PR.

## 10. Conflict prevention and resolution

Before shared work, announce task ID, files, public contract change, and expected duration. Prefer additive exports and small adapters over rewriting shared code. Avoid drive-by formatting.

When a conflict occurs:

1. Stop editing the conflicted area.
2. Compare both intents and consult the file owner.
3. Preserve valid behavior from both branches; do not choose “ours/theirs” blindly.
4. Re-run focused tests plus lint/typecheck/build.
5. Summarize the resolution in the PR.
6. If product behavior conflicts, return to document priority and ask the stakeholder rather than inventing a compromise.

## 11. Dependency installation rules

- No dependency is installed without D1 and user/stakeholder approval.
- State the package, exact purpose, alternatives considered, runtime/dev classification, bundle/security implications, and files affected.
- Use `pnpm`; never mix npm/yarn lockfiles.
- Prefer existing dependencies and platform capabilities.
- shadcn/ui-style components are source files; add only required Radix primitives, not the whole catalog.
- No map, payment, OTP, WhatsApp, analytics, or notification SDK during UI-first work.
- Commit manifest and lockfile together only in the approved dependency task.
- Review licenses and known advisories through the team-approved process.

## 12. Codex usage rules

For every implementation task, Codex must:

1. Receive one clear task ID and outcome.
2. Read all six Markdown files before implementation.
3. Inspect existing code, conventions, working-tree state, and relevant tests.
4. List planned files before editing.
5. State assumptions, missing decisions, shared-file impact, and proposed dependencies.
6. Wait for approval for large changes, dependencies, or meaningful scope expansion.
7. Stay inside the assigned folder/task and preserve unrelated work.
8. Never change branches, commit, push, merge, rewrite Git history, or delete work unless explicitly authorized for that exact action.
9. Never add credentials or real integrations.
10. Use existing shared components before adding new ones and never rewrite them without owner approval.
11. Run proportionate format/lint/typecheck/tests/build after changes.
12. Report exact created/modified files, checks, warnings, unresolved questions, and risks.
13. Stop when the assigned task is complete; do not begin the next task automatically.

Codex should ask only when local evidence and safe assumptions cannot resolve a material choice. A provisional default documented in the six files may be used but must remain labeled where surfaced.

## 13. TypeScript conventions

- Keep `strict` enabled; do not weaken compiler flags to make code pass.
- Avoid `any`. Use `unknown` at untrusted boundaries and narrow it.
- Model states with discriminated unions rather than parallel booleans.
- Use branded/string alias IDs when they prevent cross-domain confusion.
- Keep feature types inside the feature; promote only genuinely shared contracts.
- Infer form types from Zod where it avoids duplication.
- Make impossible states hard to represent: platform permission, group permission, mode, lifecycle, and permission status are distinct types.
- Prefer named exports and explicit return types on public service boundaries.
- Do not use non-null assertions to bypass unresolved loading or route-param states.
- Validate environment and external data at runtime.

## 14. Component conventions

- Pages orchestrate queries, mutations, access decisions, and layout; they stay small.
- Presentational components receive typed data and callbacks and never import service implementations.
- Hooks encapsulate reusable stateful logic, not markup.
- One component should have one clear responsibility; split complex tables/forms/maps by stable concept.
- Use semantic HTML before ARIA; do not make a `div` behave like a button.
- Use centralized semantic tokens; no hardcoded feature colors.
- Support disabled, loading, empty, error, success, and permission-denied behavior where relevant.
- Do not duplicate buttons, inputs, dialogs, alerts, tables, or status components.
- Avoid premature generic components. A feature-local component is preferable until reuse is real.
- Keep data formatting and policy decisions out of UI primitives.

## 15. Form conventions

- React Hook Form owns form interaction; Zod owns reusable validation.
- Every control has a visible/programmatic label, hint when needed, and associated error.
- Required status is conveyed in text/semantics, not color alone.
- Submission disables duplicate actions and communicates progress.
- Focus the first invalid field or error summary after failure.
- Wizard steps validate before advancing; final review validates the full draft.
- Protect meaningful unsaved changes and provide explicit reset/cancel.
- Keep local form state local; do not put ordinary forms in Zustand.
- Do not invent validation limits. When product limits are undecided, enforce only safe structural validation documented in the PRD.

## 16. State management

- Router/search params: navigable step/tab/filter/selection state.
- TanStack Query: all asynchronous server-style data, including mocks.
- Zustand: only lightweight cross-page client state such as selected mode/group and UI preference.
- React state: dialog/drawer/temporary component state.
- React Hook Form: form state.

Never copy query results into Zustand, store sensitive OTP/location data unnecessarily, or use global state to avoid proper component boundaries. Reset account/group-scoped state and query caches on logout/account change.

## 17. Service layer and mock data

- Components call feature query/mutation hooks; hooks call typed service interfaces.
- Mock and future HTTP implementations satisfy the same domain contract.
- DTO mapping belongs in API adapters; do not expose vendor DTOs to components.
- Use typed error codes and lifecycle transitions.
- Mocks use deterministic fictional data, IDs, dates/clocks, latency, and explicit failure controls.
- Keep mocks per feature; do not create one giant data file.
- Cover happy, empty, error, permission, stale/offline, and lifecycle cases.
- Enforce critical mock rules, especially paid → pending approval and visibility filtering.
- Never include real names, mobile numbers, coordinates, invite tokens, OTPs, or payment details.
- Label simulated QR/download/share/navigation/payment/notification outcomes.

## 18. Routing rules

- Route declarations are feature-owned and composed in `src/app/router`.
- Full workflows use routes; confirmations generally use dialogs; mobile filters use drawers; member map details use bottom sheets/cards; result states remain on the route.
- Every route carries a screen ID and access metadata where practical.
- Use lazy boundaries for features/maps/charts/admin tables.
- Sanitize return URLs and reject external/open redirects.
- Navigation filtering never replaces route/service authorization.
- Preserve intended return paths through login/OTP only when safe.
- Do not place all routes in one file.

## 19. Permissions and sensitive features

- Check authentication, account status, mode, entitlement, group lifecycle, group context, platform/group capabilities, block/invitation/payment/OTP state, and location permission as separate dimensions.
- Never infer platform authority from group role.
- Prefer capability checks (`canApproveGroup`) over title checks (`role === admin`).
- Hide irrelevant actions; disable discoverable-but-unavailable actions with an explanation when that helps users.
- Apply field-level visibility to member/location records.
- Mandatory location denial blocks tracking features but never bypasses consent.
- Ordinary Group Admin cannot update shared routes; Group Owner/authorized sub-owner can.
- Suspended groups are view-only to normal users (**Provisional**).
- Backend enforcement remains mandatory later.

## 20. Responsive rules

- Start at 360px; progressively enhance tablet and desktop.
- Test content growth, localization, keyboard zoom, safe areas, orientation, and touch targets.
- Mobile: one column, bottom navigation, drawers/bottom sheets, card alternatives to wide tables.
- Tablet: rail/drawer and optional two-pane layouts.
- Desktop: persistent sidebar, constrained forms, tables, list/detail or map/detail split.
- Do not merely hide essential data on mobile. Reformat it.
- Avoid horizontal page scrolling; intentionally scrollable tables/controls need labels and affordances.
- Driving views prioritize glanceable information and large controls.

## 21. Accessibility rules

The target is **Provisional WCAG 2.2 AA**.

- Logical heading order and semantic landmarks.
- Full keyboard access with visible focus.
- Dialog/drawer focus trap, escape behavior, and focus restoration.
- Text labels for icons; accessible names for controls.
- Errors associated with fields and announced after submit.
- Status changes announced without excessive live-region noise.
- Contrast in both themes; status never uses color alone.
- Respect reduced motion and avoid flashing.
- Map/chart information has a list/table/text equivalent.
- Test reflow/zoom and screen-reader fundamentals.
- Do not use autoplay audio; voice warning behavior respects user/platform controls.

## 22. Testing rules

For each task, choose tests based on risk:

- Unit: permission functions, schemas, state transitions, formatters, mappers.
- Component: inputs, forms, dialogs, filters, cards, tables, map fallback.
- Integration: page + hooks + mock service + guard behavior.
- E2E: critical multi-route product flows.
- Manual: responsive, keyboard, screen reader spot check, themes, driving-safe layouts.

Tests must be deterministic, use fictional fixtures, and assert user-visible behavior. Do not test Tailwind class strings unless the class itself is the contract. Every bug fix should add a regression test when reasonably possible.

Minimum pre-PR commands after scaffold approval:

```text
pnpm format:check
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm playwright test   # when the task affects an E2E flow
```

Use the scripts actually defined by the approved repository; do not invent/install tools mid-task.

## 23. Definition of done

- Task acceptance criteria satisfied without scope creep.
- Screen ID and requirement/flow behavior matched.
- Exact created/modified files reviewed.
- No unrelated changes, secrets, real integrations, or invented business details.
- Types, imports, services, mocks, and components follow architecture.
- Loading, empty, error, disabled, success, permission, and lifecycle states covered as applicable.
- Mobile/tablet/desktop and both themes checked.
- Keyboard/accessibility checks completed.
- Relevant tests plus lint/typecheck/build pass.
- Shared changes coordinated and documented.
- PR includes evidence, known limitations, and open questions.

## 24. Reviewer checklist

- [ ] Task is bounded and correct owner/reviewer participated.
- [ ] Source priority and confirmed/provisional/open decisions are respected.
- [ ] Both modes and prohibited Speed Only functionality are correct.
- [ ] Platform and group roles are distinct.
- [ ] Payment cannot activate a group without platform approval.
- [ ] OTP is first setup/device change; no password; email optional.
- [ ] Location consent and mandatory denial are correct.
- [ ] Service/mock boundaries and typed errors are used.
- [ ] No hardcoded colors, secrets, personal mock data, or provider coupling.
- [ ] Responsive and accessibility behavior is demonstrated.
- [ ] Tests cover high-risk behavior and checks pass.
- [ ] Documentation/task status is updated only when authorized.

## 25. Common mistakes

- Using one `role` for platform and group authority.
- Treating Speed Only as a visual toggle while group queries still run.
- Activating a group after checkout success.
- Asking for OTP on every login or every new group.
- Adding password fields from the older PDF.
- Making email required.
- Hiding unauthorized buttons but still executing the mutation.
- Calling services directly from display components.
- Putting query/form data into global state.
- Coupling pins/routes to a chosen map vendor.
- Showing stale coordinates/speed as live.
- Treating WhatsApp handoff, export, payment, SOS, or notification mocks as delivered.
- Hardcoding colors or unapproved limits/prices/providers.
- Building one large page/router/mock/types file.
- Editing shared files without coordination.
- Installing a package to solve a small problem already covered by the platform/repository.

## 26. Do and do not

### Do

- Read the six documents and inspect the current code before each task.
- Use screen/task IDs in implementation and review context.
- Keep changes small, typed, responsive, accessible, and mock-first.
- Use service ports and capability-based guards.
- Preserve all user work and disclose assumptions.
- Ask for product decisions only when they materially change the result.
- Report exact files and verification evidence.

### Do not

- Do not build backend or real integrations during UI-first work.
- Do not install dependencies, alter Git branches/history, commit, push, or merge without explicit authority.
- Do not modify unrelated folders, delete work, or rewrite shared components silently.
- Do not invent language lists, countries, prices, currencies, taxes, limits, providers, legal wording, or retention/SOS policies.
- Do not expose group/member features in Speed Only Mode.
- Do not rely on frontend guards as production security.
- Do not begin the next task automatically after completing the assigned one.
