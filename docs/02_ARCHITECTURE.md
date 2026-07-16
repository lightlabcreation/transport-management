# Frontend Architecture

## 1. Scope and goals

This is the source of truth for frontend structure and technical boundaries. The architecture must support a responsive mock-first React UI, strict mode/role separation, future API/mobile reuse, provider-independent maps, small feature-owned changes, and migration without rewriting screens.

Goals: strict typing; feature isolation; predictable imports; accessibility; explicit async states; replaceable integrations; centralized tokens; small pages; safe parallel ownership; and no business authorization implied solely by client guards.

## 2. Technology stack

| Concern | Choice |
|---|---|
| Runtime/build | React, TypeScript strict mode, Vite, pnpm |
| Styling | Tailwind CSS, CSS custom-property design tokens, shadcn/ui-style source components |
| Routing | React Router |
| Server-style state | TanStack Query |
| Client global state | Zustand |
| Forms/validation | React Hook Form and Zod |
| Icons/data display | Lucide React, Recharts, TanStack Table, date-fns |
| Unit/component tests | Vitest, React Testing Library, user-event, jest-dom |
| E2E | Playwright |
| Quality | ESLint and Prettier |

Exact versions and Radix packages are selected during the separately approved scaffold task. No map SDK is installed for the mock phase.

## 3. Directory design

```text
src/
├── app/
│   ├── App.tsx
│   ├── config/          # environment parsing, navigation metadata
│   ├── guards/          # route-level access composition
│   ├── providers/       # query, router, theme, error boundary
│   └── router/          # root composition and route groups
├── assets/{icons,images,logos}/
├── components/
│   ├── ui/              # design-system primitives
│   ├── common/          # domain-neutral composed controls
│   ├── layout/          # shells and navigation
│   ├── feedback/        # async/result states
│   └── maps/            # provider-independent map contracts/fallbacks
├── features/
│   ├── onboarding/ auth/ dashboard/ groups/ tracking/ speed-limit/
│   ├── navigation/ trips/ alerts/ reports/ payments/ subscriptions/
│   └── notifications/ profile/ settings/ owner-admin/
├── hooks/               # cross-feature hooks only
├── lib/                 # configured third-party adapters
├── mocks/               # cross-feature fixtures and mock runtime
├── services/            # cross-feature ports/client primitives
├── store/               # minimal cross-feature client stores
├── styles/              # tokens, globals, themes
├── types/               # genuinely cross-feature types
└── utils/               # pure domain-neutral helpers
```

Standard feature:

```text
features/groups/
├── components/
├── pages/
├── routes/
├── schemas/
├── services/            # feature ports and implementation selection
├── store/               # only if client state spans group pages
├── types/
├── mocks/
└── index.ts             # intentionally small public API
```

Do not create empty directories merely to match the diagram; add each subfolder when its first owned file is approved.

## 4. Entry point and providers

`main.tsx` mounts `<App />`. `App` contains no feature logic and composes providers in this order:

```text
StrictMode
└─ AppErrorBoundary
   └─ EnvironmentProvider
      └─ QueryClientProvider
         └─ ThemeProvider
            └─ AuthSessionProvider/adapter
               └─ RouterProvider
                  └─ Toast/AnnouncementViewport
```

Providers expose stable application concepts, not vendor SDK objects. Query defaults distinguish retryable reads from non-retryable mock mutations. Development-only tools are lazy and excluded from production builds.

## 5. Router structure

Route modules are composed rather than placed in one file:

- Public: `/`, `/onboarding/*`, `/auth/*`, `/legal/*`, invitation landing.
- Protected shared: `/app/dashboard`, notifications, profile, settings, billing.
- Tracking/group: `/app/groups/*`, `/app/tracking/*`, `/app/navigation/*`, alerts, SOS, trips, reports.
- Speed-only: `/app/speed/*`, navigation, alerts, trips, reports, subscription.
- Owner administration: `/owner/*`.

Full workflows are routes. Confirmation actions are normally dialogs; mobile filters and secondary settings are drawers; member details may be desktop cards/mobile bottom sheets; loading/results remain route states (**Provisional**).

Each feature exports a route object or lazy route factory. A route handle may hold screen ID, title key, mode, breadcrumb, and navigation metadata. Router errors use bounded feature/root error elements.

## 6. Guard model

Guards compose explicit facts:

```text
RequireSession
→ RequireActiveUser
→ RequireMode
→ RequirePlatformPermission or RequireGroupPermission
→ RequireSubscription
→ RequireGroupLifecycleState
→ RequireLocationPermission
```

`RouteGuard` selects the appropriate denial experience. `PermissionGate` may hide or disable actions with an explanation, but services must still reject unauthorized mutations. `ModeGate`, `SubscriptionGate`, and `LocationPermissionGate` share typed reason codes. Avoid boolean soup: permissions are named capabilities and group context includes a group ID.

## 7. Application shell and responsive navigation

- Mobile (360px+): compact header, main content, context-aware bottom navigation, safe-area spacing; drawers for secondary destinations.
- Tablet: collapsible rail or drawer, wider content panes, map/list split where space permits.
- Desktop: persistent sidebar, top header, breadcrumbs/page actions, constrained forms and responsive data tables.
- Owner admin uses a distinct navigation set but shared primitives.
- Navigation items are derived from typed metadata and filtered by mode/permission; screens must still be guarded independently.

Planned shared layout components: `AppShell`, `DesktopSidebar`, `MobileBottomNavigation`, `TopHeader`, `PageHeader`, `AuthLayout`, and `FullScreenLayout`.

## 8. State strategy

| State | Tool | Examples |
|---|---|---|
| URL/navigation | Router/search params | selected tab, filters worth sharing, wizard step |
| Server-style async | TanStack Query | groups, members, trips, reports, payments |
| Form state | React Hook Form | registration, settings, group wizard steps |
| Local UI | React state | open dialog, hover/selection, temporary disclosure |
| Small cross-page client state | Zustand | session projection, selected mode/group, UI preferences |

Do not mirror query data into Zustand. Do not store entire forms globally. The group wizard may use a bounded draft store with schema version, explicit reset, and no sensitive persistence. Query keys are feature-owned factories and always include group/account scope when applicable.

## 9. Forms and validation

- Zod schemas are the reusable validation source; React Hook Form owns interaction state.
- Labels, hints, required indicators, field-level errors, summary/focus behavior, and async submit state are mandatory.
- Validation separates UI formatting from domain constraints and translates error keys.
- Wizard steps validate before advancing; final review validates the aggregate draft.
- Server errors map through typed problem codes rather than parsing arbitrary strings.
- Mobile number normalization and exact rules remain service/domain decisions; mocks use clearly fictional values.

## 10. Mock and service architecture

Presentational components receive data/callback props and never import services. Feature hooks call ports:

```ts
export interface GroupService {
  list(input: ListGroupsInput): Promise<Page<GroupSummary>>;
  get(groupId: GroupId): Promise<GroupDetails>;
  create(input: CreateGroupInput): Promise<Group>;
  updateStatus(input: UpdateGroupStatusInput): Promise<Group>;
}
```

Feature service selection is injected/configured:

```text
page → query/mutation hook → service interface → mock implementation now
                                           └→ HTTP implementation later
```

Mocks are organized by domain, use deterministic IDs/dates, contain no real personal data, simulate latency and typed failures, and cover happy/empty/error/permission/lifecycle states. Mock handlers enforce important transitions (for example, paid → pending approval, never directly active).

Future API services share normalized domain models but may use DTO mappers. Transport concerns—base URL, headers, refresh, cancellation, problem details, correlation IDs—belong in `services/`, not feature components.

## 11. Map abstraction

Shared map code defines domain-neutral interfaces such as `MapViewport`, `MapMarker`, `MapRoute`, `MapControl`, `MapEvent`, and `MapAdapter`. Feature code supplies presentation-safe marker models; it never imports Google/TomTom/Mapbox objects.

`MapContainer` renders an injected adapter or `MapPlaceholder`. The fallback supports marker selection, list alternative, mock zoom/filter controls, route polyline representation, and provider-unavailable state. Candidate providers are Google Maps, TomTom, Mapbox, and an OpenStreetMap-based fallback; selection remains open. Routing, traffic, geocoding, and speed limits may use different providers behind separate ports.

## 12. Authentication and permission abstraction

`AuthService` supports request OTP, verify OTP, inspect session/device state, logout, and account recovery initiation. There is no password contract. `Session` contains identity and platform permissions but group memberships remain query data. Authorization utilities accept typed context and return `{ allowed, reason }`; they never infer platform permission from group role.

Mode, subscription, group lifecycle, block state, invitation state, payment state, OTP/device state, and location permission each have explicit enums/unions. This makes denial states testable and prevents one ambiguous `isActive` flag.

## 13. Errors, loading, empty states, and notifications

- Root error boundary handles unexpected render errors with recovery and correlation reference.
- Feature error boundaries isolate lazy routes/maps/charts.
- Typed service errors: unauthenticated, forbidden, validation, conflict, not-found, rate-limited, unavailable, offline, unknown.
- Use skeletons for structurally predictable reads, progress indicators for actions, and plain loading state when layout is unknown.
- Empty states explain context and offer only permitted next actions.
- Toasts acknowledge transient actions; inline alerts explain blocking issues; persistent workflow outcomes remain in content.
- Notifications use a feature service and deep-link registry; toasts are not the notification inbox.

## 14. Design tokens and shared components

Tokens live as semantic CSS variables for color, typography, spacing, radius, shadow, z-index, motion, and responsive layout. Feature code uses semantic classes (`bg-background`, `text-danger`) and never hardcoded colors.

Shared plan:

- Inputs: `Input`, `PhoneInput`, `PasswordInput` only if future scope changes (not MVP auth), `OTPInput`, `Textarea`, `Select`, `SearchInput`, `Checkbox`, `RadioGroup`, `Switch`.
- Feedback: `Alert`, `Toast`, `Skeleton`, `LoadingState`, `EmptyState`, `ErrorState`, `SuccessState`, `ConfirmDialog`.
- Display: `Card`, `StatCard`, `Badge`, `Avatar`, `DataTable`, `Pagination`, `FilterBar`, `StepIndicator`.
- Maps/tracking: `MapContainer`, `MapPlaceholder`, `MapControls`, `MemberMapCard`, `TrackingStatus`, `SpeedGauge`, `SpeedLimitCard`.
- Access: route and permission/mode/subscription/location gates.

Create shared components only after a real reuse case or foundation task; do not build the entire catalog upfront.

## 15. Boundaries, imports, and dependency rules

Allowed dependencies:

```text
app → features → components/hooks/lib/services/store/styles/types/utils
features → own internals + shared layers
components → lower shared layers only
services/lib/store → types/utils (and approved libraries)
types/utils → no feature/app imports
```

Rules:

- Features cannot deep-import another feature. Cross-feature composition occurs in `app` or through an approved public export/contract.
- Shared layers cannot import features or `app`.
- `ui` primitives are domain-neutral; `common` components may compose primitives but not own feature rules.
- Feature types stay local unless two independent features truly share the concept.
- No global barrel exporting the whole application; feature barrels expose a minimal API.
- Use path aliases for layer roots, not to disguise boundary violations.
- Avoid circular dependencies and giant `types`, `routes`, `mocks`, or `constants` files.

Naming: components/pages/types use PascalCase; hooks `useX`; schemas `xSchema`; services `xService`; test files colocate as `*.test.ts(x)`; E2E uses screen/task-oriented names. Named exports are preferred; route-level lazy modules may use a documented adapter if the router requires default exports.

## 16. Accessibility and responsive implementation

Target is **Provisional WCAG 2.2 AA** and latest two major versions of Chrome, Edge, Safari, Firefox from 360px. Use semantic HTML first, logical properties where RTL may apply, visible focus, focus restoration for dialogs/drawers, live regions for async results, reduced-motion preferences, and textual alternatives for charts/maps. Responsive behavior is component-specific, not just breakpoint shrinking.

## 17. Testing strategy

- Unit: pure permission decisions, reducers/stores, schemas, formatters, DTO mappers, lifecycle transitions.
- Component: keyboard/focus behavior, fields/errors, async states, permission gates, responsive semantics.
- Integration: route guards, wizard persistence/validation, group payment-to-approval sequence, invitation states, mock queries/mutations.
- E2E: first launch/auth, create group, public/private join, owner approval/rejection, mandatory-location denial, speed-only isolation, SOS confirmation, report export state, theme.
- Accessibility: automated checks plus manual keyboard, screen-reader spot checks, zoom/reflow, contrast, reduced motion.
- Visual/responsive review at mobile/tablet/desktop widths.

Tests use service doubles and deterministic clocks; they do not assert Tailwind implementation details.

## 18. Environment and configuration

Only `VITE_` public variables may reach the client. A Zod-backed config module parses values at startup. Expected future variables include application environment, service base URL, mock mode, logging level, and selected adapter IDs—not secrets. `.env.example` is created only in a later approved scaffold task. Provider credentials require a secure delivery design and restrictions; they are never committed.

## 19. Logging and observability

Use a thin logger with levels and structured context. Production logs redact mobile numbers, OTPs, tokens, precise coordinates, invite tokens, payment details, and free-text support content. User-facing errors carry safe reference IDs. Analytics and vendor telemetry are future adapters requiring consent and policy decisions.

## 20. Performance

- Lazy feature routes, maps, charts, and admin tables.
- Paginate/virtualize large lists when metrics justify it.
- Debounce search through shared utilities and cancel stale requests.
- Keep query caches scoped and choose stale times by data volatility.
- Optimize images and avoid loading map SDKs outside map routes.
- Prevent broad Zustand subscriptions and unnecessary context rerenders.
- Establish budgets during scaffold/performance tasks rather than inventing numbers.

## 21. Frontend security considerations

Treat all client data as untrusted; encode output through React; avoid raw HTML; validate redirects and invite links; protect against stale cross-account caches; clear account-scoped state on logout; use safe external-link attributes; avoid tokens in URLs where possible; and model CSRF/session strategy with the backend later. UI guards are never the enforcement boundary.

## 22. Mock-to-API migration

1. Freeze domain/service contracts with mock use cases.
2. Agree API schemas and error vocabulary.
3. Generate or hand-write typed DTOs separately from domain models.
4. Add HTTP adapters and mappers behind existing interfaces.
5. Run shared contract tests against mock and HTTP adapters.
6. Switch per environment/feature flag.
7. Add realtime/location providers behind separate ports.
8. Remove obsolete fixtures only after parity and UI regression testing.

## 23. Developer ownership

| Area | Primary | Coordination |
|---|---|---|
| Docs, package/build, app, router/providers/guards | Developer 1 | Required for shared files |
| UI/common/layout/feedback/styles | Developer 1 | Required before shared changes |
| Onboarding, auth, notifications, profile, settings | Developer 1 | Route integration coordinated |
| Groups, roles, members, tracking, speed, navigation, trips, alerts, SOS, reports | Developer 2 | Shared/map contracts coordinated |
| Owner admin | Assigned after foundation | Developer 1 integrates routes |

Ownership is review responsibility, not an exclusive right to edit. Shared changes are announced before work and kept in dedicated tasks.
