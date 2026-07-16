# Frontend Task Plan

## 1. Task contract

This is the source of truth for planned frontend work. Hierarchy is **Milestone → Epic → Task**. Each implementation task should normally affect 1–8 files; if discovery shows a larger change, split it before coding. Status values are limited to `Not Started`, `Ready`, `In Progress`, `Review`, `Blocked`, and `Done`.

Branch names are proposals; every temporary branch starts from the latest `develop`. `Coord: Yes` means the task changes or establishes shared files and must be announced before editing. Dependencies are task IDs or approved external decisions. Acceptance criteria are intentionally testable and do not authorize installing packages or changing Git.

Ownership: D1 = Developer 1, D2 = Developer 2, TBD = assigned jointly after core modules. Owner-admin assignments remain TBD until the first major modules stabilize.

## M1. Documentation

**Epic: Product and delivery specification**

| Task | Work | Owner | Branch | Dependencies | Acceptance criteria | Status | Coord |
|---|---|---|---|---|---|---|:---:|
| DOC-001 | Create final PRD | D1 | `feature/frontend-documentation` | Approved plan, PDFs | Requirements follow source priority; unknown business details remain open | Review | Yes |
| DOC-002 | Create frontend architecture | D1 | same | DOC-001 terminology | Layers, imports, mocks, guards, testing, ownership defined | Review | Yes |
| DOC-003 | Create 93-screen wireframe registry | D1 | same | DOC-001 | Every MVP screen has ID, route, mode, role, states, responsive behavior | Review | Yes |
| DOC-004 | Create flows and RBAC | D1 | same | DOC-001, DOC-003 | Required flows, roles, matrix, guard outcomes defined | Review | Yes |
| DOC-005 | Create task plan | D1 | same | DOC-002–004 | Tasks are bounded and include required metadata | Review | Yes |
| DOC-006 | Create developer guide | D1 | same | DOC-002, DOC-005 | Git, ownership, Codex, coding, testing, review practices defined | Review | Yes |
| DOC-007 | Resolve review comments and freeze documentation | D1 + D2 | `feature/frontend-documentation` | DOC-001–006, stakeholder review | Decisions incorporated; open questions retained; freeze recorded in task status | Not Started | Yes |

## M2. Repository setup

**Epic: Reproducible React workspace**

| Task | Work | Owner | Branch | Dependencies | Acceptance criteria | Status | Coord |
|---|---|---|---|---|---|---|:---:|
| FOUND-001 | Initialize Vite React TypeScript project and pnpm manifest | D1 | `feature/foundation-ui` | DOC-007, dependency approval | App starts; only approved dependencies; existing PDFs/docs untouched | Not Started | Yes |
| FOUND-002 | Enable strict TypeScript and path aliases | D1 | same | FOUND-001 | Strict checks pass; aliases match layer rules | Not Started | Yes |
| FOUND-003 | Configure ESLint and Prettier | D1 | same | FOUND-001 | Lint/format commands run and exclude generated artifacts | Not Started | Yes |
| FOUND-004 | Configure Vitest/RTL and Playwright skeletons | D1 | same | FOUND-001 | One smoke test per runner passes | Not Started | Yes |
| FOUND-005 | Add validated public environment config | D1 | same | FOUND-002 | Startup validation; no secrets; mock-mode flag documented in guide/config comments | Not Started | Yes |

## M3. Design system

**Epic: Tokens and accessible primitives**

| Task | Work | Owner | Branch | Dependencies | Acceptance criteria | Status | Coord |
|---|---|---|---|---|---|---|:---:|
| DS-001 | Add semantic light/dark design tokens | D1 | `feature/foundation-ui` | FOUND-001 | No feature colors; contrast reviewed; theme variables defined | Not Started | Yes |
| DS-002 | Add typography, spacing, radius, shadow, motion tokens | D1 | same | DS-001 | Tokens cover shared layouts and reduced motion | Not Started | Yes |
| DS-003 | Create Button and Badge source components | D1 | same | DS-001 | Variants, keyboard/focus, disabled/loading states tested | Not Started | Yes |
| DS-004 | Create Input, Textarea, Select, Checkbox, Radio, Switch | D1 | same | DS-001 | Label/error/description contract and tests | Not Started | Yes |
| DS-005 | Create Card, Avatar, separator and surface primitives | D1 | same | DS-001 | Semantic variants and responsive usage examples in tests/stories if approved | Not Started | Yes |

## M4. Shared UI

**Epic: Reusable composed controls and feedback**

| Task | Work | Owner | Branch | Dependencies | Acceptance criteria | Status | Coord |
|---|---|---|---|---|---|---|:---:|
| SHARED-001 | Create PhoneInput composition | D1 | `feature/foundation-ui` | DS-004 | Labeled, normalized-value boundary, error state tested | Not Started | Yes |
| SHARED-002 | Create OTPInput | D1 | same | DS-004 | Paste, arrows, backspace, focus, error behavior tested | Not Started | Yes |
| SHARED-003 | Create search/filter and StepIndicator components | D1 | same | DS-003–005 | Responsive and accessible; no feature imports | Not Started | Yes |
| SHARED-004 | Create Loading/Empty/Error/Success states | D1 | same | DS-003–005 | Consistent actions, announcements, retry behavior | Not Started | Yes |
| SHARED-005 | Create Alert, Toast, ConfirmDialog | D1 | same | DS-003–005 | Focus trap/restore, live announcements, destructive confirmation tested | Not Started | Yes |
| SHARED-006 | Create responsive DataTable/Pagination foundation | D1 | same | DS-003–005 | Mobile fallback and keyboard-accessible table controls | Not Started | Yes |

## M5. Application shell

**Epic: Mode-aware responsive layouts**

| Task | Work | Owner | Branch | Dependencies | Acceptance criteria | Status | Coord |
|---|---|---|---|---|---|---|:---:|
| SHELL-001 | Create AuthLayout and FullScreenLayout | D1 | `feature/foundation-ui` | DS-001, SHARED-004 | Works at 360px/tablet/desktop; semantic landmarks | Not Started | Yes |
| SHELL-002 | Create TopHeader and PageHeader | D1 | same | DS-001 | Accessible menus/actions and overflow behavior | Not Started | Yes |
| SHELL-003 | Create DesktopSidebar and tablet rail | D1 | same | SHELL-002 | Active state, collapse, keyboard, mode-filter metadata | Not Started | Yes |
| SHELL-004 | Create MobileBottomNavigation | D1 | same | SHELL-002 | Safe-area spacing; prohibited mode links absent | Not Started | Yes |
| SHELL-005 | Compose AppShell and owner shell variant | D1 | same | SHELL-002–004 | All shells render placeholder routes without duplication | Not Started | Yes |

## M6. Routing and guards

**Epic: Typed navigation and access outcomes**

| Task | Work | Owner | Branch | Dependencies | Acceptance criteria | Status | Coord |
|---|---|---|---|---|---|---|:---:|
| ROUTE-001 | Create modular router root and lazy route convention | D1 | `feature/foundation-ui` | FOUND-002, SHELL-005 | Public/app/owner groups compose; screen metadata typed | Not Started | Yes |
| ROUTE-002 | Implement session/account guards | D1 | same | ROUTE-001, MOCK-002 | Return target sanitized; blocked user state tested | Not Started | Yes |
| ROUTE-003 | Implement ModeGate and mode-filtered navigation | D1 | same | ROUTE-001 | Speed mode cannot resolve group routes; tests pass | Not Started | Yes |
| ROUTE-004 | Implement PermissionGate and group/platform capability helpers | D1 | same | ROUTE-001, MOCK-003 | Platform and group authority stay separate; reason codes tested | Not Started | Yes |
| ROUTE-005 | Implement subscription/group lifecycle/location guards | D1 | same | ROUTE-001, MOCK-003 | Every denial maps to specified recovery UI | Not Started | Yes |

## M7. Mock architecture

**Epic: Replaceable service contracts**

| Task | Work | Owner | Branch | Dependencies | Acceptance criteria | Status | Coord |
|---|---|---|---|---|---|---|:---:|
| MOCK-001 | Configure QueryClient and typed service error model | D1 | `feature/foundation-ui` | FOUND-001 | Retry policy and error mapping tested | Not Started | Yes |
| MOCK-002 | Create auth/session/profile service ports and mocks | D1 | same | MOCK-001 | Deterministic latency/success/error/device states | Not Started | Yes |
| MOCK-003 | Create shared permission/mode/lifecycle fixtures | D1 | same | MOCK-001 | Covers all guard conditions without real personal data | Not Started | Yes |
| MOCK-004 | Create service registry/injection selection | D1 | same | MOCK-001–003 | Features depend on interfaces; mock/HTTP switch point is explicit | Not Started | Yes |
| MOCK-005 | Create group/tracking service port skeletons with D2 review | D1 + D2 | same | MOCK-004 | Contracts support IDs, pagination, lifecycle, field visibility | Not Started | Yes |

## M8. Onboarding

**Epic: First-launch experience**

| Task | Work | Owner | Branch | Dependencies | Acceptance criteria | Status | Coord |
|---|---|---|---|---|---|---|:---:|
| ONB-001 | Build splash/bootstrap route | D1 | `feature/auth-onboarding-ui` | ROUTE-001, MOCK-002 | Session/mode/error redirects match ONB-001 | Not Started | No |
| ONB-002 | Build language selection | D1 | same | ONB-001 | Selection/search/save states; RTL-ready logical layout | Not Started | No |
| ONB-003 | Build welcome and mode selection | D1 | same | ONB-002, ROUTE-003 | Mode descriptions accurate; selection validated | Not Started | No |
| ONB-004 | Build permission introduction | D1 | same | ONB-003 | Consent-first content and optional/mandatory explanation | Not Started | No |
| ONB-005 | Add onboarding integration/accessibility tests | D1 | same | ONB-001–004 | Keyboard, 360px, redirects, announcements pass | Not Started | No |

## M9. Authentication

**Epic: Passwordless account access**

| Task | Work | Owner | Branch | Dependencies | Acceptance criteria | Status | Coord |
|---|---|---|---|---|---|---|:---:|
| AUTH-001 | Create login form/page | D1 | `feature/auth-onboarding-ui` | SHARED-001, MOCK-002 | Mobile validation and OTP request states; no password UI | Not Started | No |
| AUTH-002 | Create registration form/page | D1 | same | AUTH-001 | Required names/mobile/language/terms; optional email | Not Started | No |
| AUTH-003 | Create OTP verification page | D1 | same | SHARED-002, AUTH-001 | Invalid/expired/cooldown/attempt/success states | Not Started | No |
| AUTH-004 | Create device verification and recovery pages | D1 | same | AUTH-003 | Device change routes to OTP; recovery avoids enumeration | Not Started | No |
| AUTH-005 | Create terms placeholder and location permission page | D1 | same | ROUTE-005 | No invented legal content; mandatory denial recovery works | Not Started | No |
| AUTH-006 | Add passwordless auth E2E tests | D1 | same | AUTH-001–005 | Registration, known device, changed device, denial paths pass | Not Started | No |

## M10. Group creation

**Epic: Validated group wizard and lifecycle submission**

| Task | Work | Owner | Branch | Dependencies | Acceptance criteria | Status | Coord |
|---|---|---|---|---|---|---|:---:|
| GRP-001 | Create group draft types, schema, bounded store | D2 | `feature/group-wizard-ui` | MOCK-005 | Versioned resettable draft; aggregate validation tests | Not Started | No |
| GRP-002 | Build basic information step | D2 | same | GRP-001, DS-004 | Required fields and mocked logo state | Not Started | No |
| GRP-003 | Build privacy/public join step | D2 | same | GRP-001 | Auto/admin approval and private behavior validated | Not Started | No |
| GRP-004 | Build tracking/location step | D2 | same | GRP-001 | Continuous/optional and mandatory/optional combinations | Not Started | No |
| GRP-005 | Build visibility step | D2 | same | GRP-001 | All policies; configurable nearby radius without invented value | Not Started | No |
| GRP-006 | Build roles/permission step | D2 | same | GRP-001, ROUTE-004 | No platform grants; protected permissions cannot be removed | Not Started | No |
| GRP-007 | Build invitation options step | D2 | same | GRP-001 | Link/QR/direct and configurable expiry | Not Started | No |
| GRP-008 | Build review and OTP gate | D2 | same | GRP-002–007, AUTH-003 | Edit links work; OTP skipped on verified device | Not Started | Yes |
| GRP-009 | Add wizard route composition and save/exit | D1 + D2 | same | ROUTE-001, GRP-002–008 | Deep links guarded; draft retained/reset correctly | Not Started | Yes |
| GRP-010 | Add wizard integration tests | D2 | same | GRP-009 | Ordered validation and submission paths pass | Not Started | No |

## M11. Group management

**Epic: Discovery, membership, invitations, and configuration**

| Task | Work | Owner | Branch | Dependencies | Acceptance criteria | Status | Coord |
|---|---|---|---|---|---|---|:---:|
| GRP-011 | Implement mock group/member/invitation services | D2 | `feature/groups-members-ui` | MOCK-005 | Pagination, lifecycle, invitation and conflicts covered | Not Started | No |
| GRP-012 | Build My Groups and public discovery | D2 | same | GRP-011 | Search/filter/empty; private never appears publicly | Not Started | No |
| GRP-013 | Build group details and join flows | D2 | same | GRP-012 | Auto-join and approval request/status paths | Not Started | No |
| GRP-014 | Build members list and member details | D2 | same | GRP-011 | Field/action permission gating; responsive list/table | Not Started | No |
| GRP-015 | Build join request review | D2 | same | GRP-013 | Approve/reject/conflict states | Not Started | No |
| GRP-016 | Build invitations list, QR, link and WhatsApp handoff | D2 | same | GRP-011 | Expired/revoked/share-opened states; no delivery claim | Not Started | No |
| GRP-017 | Build group settings sections | D2 | same | GRP-011 | Suspended view-only; high-impact confirmation | Not Started | No |
| GRP-018 | Build role assignment and permission matrix | D2 | same | GRP-014, ROUTE-004 | Multiple admins; hierarchy and route-update restriction tested | Not Started | No |
| GRP-019 | Add group management E2E tests | D2 | same | GRP-012–018 | Public/private join, block/unblock, roles pass | Not Started | No |

## M12. Live tracking

**Epic: Provider-independent map experience**

| Task | Work | Owner | Branch | Dependencies | Acceptance criteria | Status | Coord |
|---|---|---|---|---|---|---|:---:|
| MAP-001 | Define shared map adapter/types and placeholder | D1 + D2 | `feature/live-map-ui` | DS-001, MOCK-005 | No vendor imports; selectable mock markers; list alternative | Not Started | Yes |
| MAP-002 | Implement tracking/location mocks and hooks | D2 | same | MAP-001 | Stale/offline/permission/visibility scenarios | Not Started | No |
| MAP-003 | Build live map route and accessible member list | D2 | same | MAP-002 | Field visibility and location guard applied before data | Not Started | No |
| MAP-004 | Build member card/bottom sheet and filters | D2 | same | MAP-003 | Responsive detail and zero-filter-results behavior | Not Started | No |
| MAP-005 | Build tracking status and route preview | D2 | same | MAP-002 | Continuous policy locks stop; owner/sub-owner edit only | Not Started | No |
| MAP-006 | Add map/tracking integration tests | D2 | same | MAP-003–005 | No permission, stale, hidden member, suspended cases pass | Not Started | No |

## M13. Speed mode

**Epic: Shared speed assistance and isolated speed-only UX**

| Task | Work | Owner | Branch | Dependencies | Acceptance criteria | Status | Coord |
|---|---|---|---|---|---|---|:---:|
| SPD-001 | Create speed telemetry/limit service contracts and mocks | D2 | `feature/speed-mode-ui` | MOCK-004 | Known/unknown/stale/overspeed cases | Not Started | No |
| SPD-002 | Build SpeedGauge and SpeedLimitCard | D2 | same | DS-001, SPD-001 | Non-color states and large driving-safe layout | Not Started | Yes |
| SPD-003 | Build tracking-mode speed view and speed dashboard | D2 | same | SPD-002, ROUTE-003 | Shared functionality; speed-only has no group data | Not Started | No |
| SPD-004 | Build overspeed and voice preference states | D2 | same | SPD-001 | Unknown limit suppresses warning; mock audio labeled | Not Started | No |
| SPD-005 | Build speed history and tests | D2 | same | SPD-001 | Chart table alternative and event links; mode isolation tested | Not Started | No |

## M14. Trips

**Epic: Trip history and details**

| Task | Work | Owner | Branch | Dependencies | Acceptance criteria | Status | Coord |
|---|---|---|---|---|---|---|:---:|
| TRP-001 | Create trip service and fixtures | D2 | `feature/trips-reports-ui` | MOCK-004 | Own/group scopes, processing, empty/error cases | Not Started | No |
| TRP-002 | Build trip list | D2 | same | TRP-001 | Date/status/group filters and responsive layouts | Not Started | No |
| TRP-003 | Build trip details | D2 | same | TRP-001, MAP-001 | Map fallback, metrics/events, field permissions | Not Started | No |
| TRP-004 | Add trip tests | D2 | same | TRP-002–003 | Scope, incomplete trip, keyboard flows pass | Not Started | No |

## M15. Alerts and SOS

**Epic: Road reporting and emergency UX**

| Task | Work | Owner | Branch | Dependencies | Acceptance criteria | Status | Coord |
|---|---|---|---|---|---|---|:---:|
| ALT-001 | Create alert/road-report service mocks | D2 | `feature/alerts-sos-ui` | MOCK-004 | Provisional lifecycle and duplicates covered | Not Started | No |
| ALT-002 | Build alerts center and road-report form/status | D2 | same | ALT-001, MAP-001 | Mode-safe list; pending success; safe-use guidance | Not Started | No |
| ALT-003 | Create emergency-contact and SOS mock contracts | D2 | same | MOCK-004 | Per-channel simulated outcomes; no delivery claim | Not Started | No |
| ALT-004 | Build SOS and confirmation | D2 | same | ALT-003, SHARED-005 | Accidental activation prevented; cancel/failure accessible | Not Started | No |
| ALT-005 | Build emergency contacts | D2 | same | ALT-003 | Add/edit/delete, validation, empty state | Not Started | No |
| ALT-006 | Add alerts/SOS tests | D2 | same | ALT-002, ALT-004–005 | Report lifecycle and confirm/cancel/channel failure pass | Not Started | No |

## M16. Reports

**Epic: Period reports, score, and exports**

| Task | Work | Owner | Branch | Dependencies | Acceptance criteria | Status | Coord |
|---|---|---|---|---|---|---|:---:|
| RPT-001 | Create report/export service and fixtures | D2 | `feature/trips-reports-ui` | TRP-001 | Daily/weekly/monthly/score/export job states | Not Started | No |
| RPT-002 | Build report overview and period pages | D2 | same | RPT-001 | Scope/date validation and no-data states | Not Started | No |
| RPT-003 | Build Driving Score view | D2 | same | RPT-001 | Methodology uncertainty disclosed; table alternative | Not Started | No |
| RPT-004 | Build PDF/Excel export center | D2 | same | RPT-001 | Queued/processing/ready/failed/expired; mock label | Not Started | No |
| RPT-005 | Add reports tests | D2 | same | RPT-002–004 | Permissions, formats, incomplete periods pass | Not Started | No |

## M17. Payments and subscriptions

**Epic: Mock billing and group approval handoff**

| Task | Work | Owner | Branch | Dependencies | Acceptance criteria | Status | Coord |
|---|---|---|---|---|---|---|:---:|
| PAY-001 | Define payment/subscription ports and lifecycle mocks | D1 | `feature/payments-subscriptions-ui` | MOCK-004 | No price/provider assumptions; duplicate review covered | Not Started | Yes |
| PAY-002 | Build checkout and payment result | D1 | same | PAY-001 | Retry/cancel; group success → pending approval only | Not Started | No |
| PAY-003 | Integrate group payment/pending/approved/rejected routes | D1 + D2 | same | GRP-009, PAY-002 | Lifecycle transition tests prevent direct activation | Not Started | Yes |
| PAY-004 | Build subscription and payment history | D1 | same | PAY-001 | Approved terms only; empty/filter/redaction states | Not Started | No |
| PAY-005 | Add billing E2E tests | D1 | same | PAY-002–004 | Failure, duplicate, pending approval, no-payment fixture pass | Not Started | No |

## M18. Notifications

**Epic: In-app events and preferences**

| Task | Work | Owner | Branch | Dependencies | Acceptance criteria | Status | Coord |
|---|---|---|---|---|---|---|:---:|
| NOT-001 | Create notification port, mock inbox, deep-link registry | D1 | `feature/profile-settings-ui` | MOCK-004, ROUTE-001 | Mode/permission-safe links and unread mutation | Not Started | Yes |
| NOT-002 | Build notification center | D1 | same | NOT-001 | Filters/read/empty/error/mark-all states | Not Started | No |
| NOT-003 | Build notification preferences | D1 | same | NOT-001 | Category settings; no unselected external channel | Not Started | No |
| NOT-004 | Add notification tests | D1 | same | NOT-002–003 | Invalid deep link and optimistic conflict handled | Not Started | No |

## M19. Profile and settings

**Epic: Account preferences and lifecycle**

| Task | Work | Owner | Branch | Dependencies | Acceptance criteria | Status | Coord |
|---|---|---|---|---|---|---|:---:|
| PRO-001 | Build profile service/form | D1 | `feature/profile-settings-ui` | MOCK-002, DS-004 | Required names; optional email; verified mobile display | Not Started | No |
| SET-001 | Build settings navigation, language and theme | D1 | same | DS-001, ROUTE-003 | Light/dark, mode-filtered settings, saved states | Not Started | No |
| SET-002 | Build privacy and tracking settings | D1 | same | ROUTE-005, MAP-002 | Group policy locks; consent recovery | Not Started | No |
| SET-003 | Build billing settings entry | D1 | same | PAY-004 | Links preserve billing context | Not Started | No |
| SET-004 | Build delete/recover account and logout | D1 | same | MOCK-002 | No invented recovery window; caches cleared on logout | Not Started | No |
| SET-005 | Add profile/settings tests | D1 | same | PRO-001, SET-001–004 | Theme, optional email, locked tracking, logout pass | Not Started | No |

## M20. Owner administration

**Epic: Platform operations (ownership assigned later)**

| Task | Work | Owner | Branch | Dependencies | Acceptance criteria | Status | Coord |
|---|---|---|---|---|---|---|:---:|
| ADM-001 | Define owner-admin ports, permissions, fixtures | TBD | `feature/owner-admin-ui` | GRP-011, PAY-001, RPT-001 | Queue/user/payment/support states; delegated capabilities | Not Started | Yes |
| ADM-002 | Build owner shell routes and dashboard | TBD | same | ADM-001, SHELL-005 | Platform-only guard and responsive summaries | Not Started | Yes |
| ADM-003 | Build pending approvals and review detail | TBD | same | ADM-001 | Full configuration/payment review; concurrent decision state | Not Started | No |
| ADM-004 | Build approve/reject flow | TBD | same | ADM-003 | Reason/confirm/audit mock; approval activates only here | Not Started | No |
| ADM-005 | Build active/suspended group lists and restore | TBD | same | ADM-001 | Suspension/restore permission and view-only user outcome | Not Started | No |
| ADM-006 | Build users and Excel export job | TBD | same | ADM-001, RPT-004 | Redacted allowed fields; job states | Not Started | No |
| ADM-007 | Build payments/subscriptions admin views | TBD | same | ADM-001 | Separate view/manage permissions; duplicate review | Not Started | No |
| ADM-008 | Build report/road-verification workspace | TBD | same | ADM-001, ALT-001 | Verify/reject/expire and export capability checks | Not Started | No |
| ADM-009 | Build support tickets and admin settings | TBD | same | ADM-001 | Sensitive text handling; cannot remove last owner | Not Started | No |
| ADM-010 | Add owner-admin E2E tests | TBD | same | ADM-002–009 | Approval, rejection, suspend/restore, export, support pass | Not Started | No |

## M21. Responsive testing

**Epic: Mobile, tablet, and desktop verification**

| Task | Work | Owner | Branch | Dependencies | Acceptance criteria | Status | Coord |
|---|---|---|---|---|---|---|:---:|
| QA-001 | Create viewport test matrix and representative snapshots | D1 | `fix/responsive-review` | Major screens complete | 360px/mobile/tablet/desktop matrix covers both modes/admin | Not Started | Yes |
| QA-002 | Fix shell/forms/tables overflow and safe areas | D1 | same | QA-001 | No unintended horizontal page scroll | Not Started | Yes |
| QA-003 | Fix map/speed/navigation responsive interactions | D2 | same | QA-001 | Bottom sheets/controls usable at all target widths | Not Started | No |
| QA-004 | Run latest-two-browser manual matrix | D1 + D2 | same | QA-002–003 | Provisional browser target results recorded in task/PR | Not Started | Yes |

## M22. Accessibility

**Epic: Provisional WCAG 2.2 AA review**

| Task | Work | Owner | Branch | Dependencies | Acceptance criteria | Status | Coord |
|---|---|---|---|---|---|---|:---:|
| A11Y-001 | Automated accessibility pass on representative routes | D1 | `fix/accessibility-review` | QA-002 | No known critical automated violations | Not Started | Yes |
| A11Y-002 | Keyboard/focus/dialog/drawer review | D1 | same | A11Y-001 | Full workflows usable without pointer | Not Started | Yes |
| A11Y-003 | Map/chart/list alternatives and driving warnings review | D2 | same | A11Y-001 | Essential data available without map/chart/color/audio | Not Started | No |
| A11Y-004 | Zoom, reflow, contrast, reduced motion, screen-reader spot check | D1 + D2 | same | A11Y-002–003 | Findings fixed or explicitly blocked by approved decision | Not Started | Yes |

## M23. Final UI review

**Epic: Integrated stakeholder-ready frontend**

| Task | Work | Owner | Branch | Dependencies | Acceptance criteria | Status | Coord |
|---|---|---|---|---|---|---|:---:|
| QA-005 | Run format, lint, typecheck, unit/component and E2E suites | D1 | `fix/final-ui-review` | M21–M22 | All approved checks pass; failures triaged | Not Started | Yes |
| QA-006 | Audit mode/role/lifecycle/location matrices | D1 + D2 | same | QA-005 | No prohibited navigation/data/action leakage | Not Started | Yes |
| QA-007 | Audit mock/provider labeling and unknown business details | D1 + D2 | same | QA-005 | No real-integration claim or invented commercial/legal detail | Not Started | Yes |
| QA-008 | Stakeholder walkthrough and defect task creation | D1 | same | QA-006–007 | Each finding has bounded task/owner/status | Not Started | Yes |

## M24. UI freeze

**Epic: Approved baseline for API planning**

| Task | Work | Owner | Branch | Dependencies | Acceptance criteria | Status | Coord |
|---|---|---|---|---|---|---|:---:|
| FREEZE-001 | Resolve approved UI-blocking defects | D1 + D2 | scoped `fix/*` branches | QA-008 | All freeze blockers done/reviewed | Not Started | Yes |
| FREEZE-002 | Re-run release checks and document results in PR | D1 | `chore/ui-freeze` | FREEZE-001 | Clean install/build/check matrix passes | Not Started | Yes |
| FREEZE-003 | Approve UI freeze and service-contract review point | D1 + D2 + stakeholder | same | FREEZE-002 | Stakeholder approval; deferred items identified without new docs | Not Started | Yes |
| FREEZE-004 | Prepare next approved mock-to-API task list | D1 + D2 | future scoped branch | FREEZE-003, backend decisions | No API work begins; contracts/gaps are bounded tasks | Not Started | Yes |
