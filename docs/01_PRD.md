# Product Requirements Document

**Product:** GPS Tracking, Group Management and Speed Limit Web Application  
**Phase:** UI-first frontend planning  
**Status:** Draft for stakeholder review  

## 1. Purpose and source policy

This document is the source of truth for product scope, behavior, business rules, and acceptance. It guides a responsive React web UI built with mock data before backend or mobile integration. Requirements are resolved in this order: latest client meeting clarification, product requirement PDF, then the approved architecture plan. Technical implementation belongs in `02_ARCHITECTURE.md`; screen details in `03_WIREFRAME.md`; permissions and flows in `04_FLOW_RBAC.md`.

## 2. Product summary and goals

The product offers two independently guarded experiences: collaborative location tracking with group management and speed assistance, and a private speed-assistance-only experience. A separate platform-owner workspace governs groups, users, payments, subscriptions, reports, and support.

Business goals:

- Enable people and organizations to create and participate in multiple governed groups.
- Give group owners configurable tracking, visibility, joining, and delegated-administration controls.
- Provide speed, navigation, trip, hazard, and safety experiences both inside group mode and independently.
- Ensure paid groups remain inactive until reviewed by the platform owner.
- Establish an interface architecture ready for later web APIs and mobile clients.

Success for this phase means stakeholders can review all MVP workflows responsively using mock data without implying that GPS, payments, maps, OTP, messaging, or notifications are live.

## 3. Target users and problems

| User | Problem addressed |
|---|---|
| Families and friends | Coordinating location, safety, trips, and alerts with controlled visibility |
| Fleet, delivery, school, security, and other organizations | Governing membership, tracking requirements, roles, reports, and routes |
| Individual drivers | Receiving speed, route, hazard, trip, and driving feedback without joining a group |
| Group owners/admins | Delegating administration while retaining control of sensitive permissions |
| Platform operations staff | Reviewing groups, users, billing records, reports, and support activity |

## 4. Application modes and user types

### 4.1 Tracking and Group Mode

Includes groups, member tracking, live map, speed-limit functionality, navigation, trips, alerts, SOS, reports, subscriptions, profile, and settings. Users may create and join multiple groups. A selected group supplies group-scoped context.

### 4.2 Speed Limit Only Mode

Includes onboarding, passwordless authentication, payment/entitlement UI, speed dashboard, navigation, alerts, hazards, trips, reports, profile, and settings. It excludes group creation/joining, invitations, roles, members, member visibility, and member tracking. Ordinary users cannot see other users and are not visible to them; legitimate platform oversight remains governed by policy.

### 4.3 Platform owner administration

Separate protected workspace for Platform Owner and delegated Platform Super Admin roles.

### 4.4 Shared functionality

Language, registration, OTP/device verification, notifications, profile, theme, privacy, account lifecycle, billing history, and accessible responsive foundations are shared where entitled.

## 5. Capabilities by user type

### Platform Owner

View all groups and users; approve, reject, suspend, and restore groups; review payments, subscriptions, reports, road reports, and support tickets; export user information to Excel; configure delegated platform administration; and later monitor integration usage. The owner is the final group-activation authority.

### Platform Super Admin

Performs only platform permissions delegated by the Platform Owner. Delegation never implicitly grants ownership-only actions.

### Group Owner

Creates multiple groups; edits settings; chooses public/private visibility and public join method; configures tracking, location requirement, visibility, nearby radius, invite expiry, and permissions; appoints sub-owner/super-admin/admin/moderator roles; manages members and invitations; views permitted map/report data; and controls group route updates with authorized sub-owners.

### Group Admin and Moderator

Exercise only explicit group-scoped permissions. Multiple administrators are supported. They never inherit platform authority. The client confirmed that group administrators govern tracking and visibility configuration subject to the permission policy; route updates remain owner/sub-owner only.

### Member and Guest

Participate in approved groups, use permitted tracking/map/speed/safety features, manage their own profile and consent, and perform only actions granted by role and group policy.

### Speed-Only User

Uses private speed, navigation, alert, trip, report, subscription, profile, and settings experiences without group features.

## 6. Functional requirements by module

### 6.1 Onboarding and language

- Present splash, language, welcome, mode selection, and permission introduction.
- Support multiple languages; exact list and RTL support remain undecided.
- Persist the chosen mode and language locally through abstractions that can later sync to an account.
- Permit later mode switching only when the unresolved entitlement rules allow it.

### 6.2 Authentication and OTP

- Registration requires first name, last name, mobile number, language, and terms acceptance. Email is optional and may be added later in profile.
- Authentication is passwordless. The older PDF references to optional passwords and forgot-password behavior are superseded by the meeting transcript.
- OTP is required for first registration/setup and device change, and may be invoked when an explicitly defined authentication flow requires verification.
- Group creation verification reuses the already verified device state; it must not demand OTP for every group. First setup/group creation on an unverified device may trigger it.
- UI must cover send, resend cooldown, invalid, expired, attempt limit, success, and service-unavailable mock states.
- Device verification records are future server concerns; the UI uses a mock authentication service.

### 6.3 Group creation and activation

Required sequence:

1. Group details and purpose
2. Privacy and public join method
3. Tracking and location requirement
4. Visibility and nearby-member configuration
5. Roles and permissions
6. Invitation options
7. Review and terms acceptance
8. OTP when the device/flow requires it
9. Payment when required
10. Platform-owner review
11. Activation, rejection, or resubmission

Users may create multiple groups. Group name, description/purpose, logo, and category are captured; upload implementation remains mocked. Payment alone never activates a group.

### 6.4 Public groups

- Discoverable before or after authentication as product policy permits, while joining requires authentication.
- Configurable join method: auto approval or administrator approval.
- Search, filter, details, join confirmation, request state, approval/rejection, and membership state are represented.

### 6.5 Private groups and invitations

- Not discoverable publicly.
- Join only through invite link, QR code, or direct invitation.
- Invitation links have a configurable expiry (**Provisional**).
- Support WhatsApp sharing for invitations and permitted location-related sharing.
- Expired, revoked, invalid, already-used, already-member, wrong-account, and approval-required states must be designed.

### 6.6 Membership, roles, and administration

- Owners may appoint multiple administrators and a delegated sub-owner/super-admin role.
- Permission changes are auditable in the future service contract.
- Authorized admins may invite, approve/reject join requests, remove, block, and later unblock members.
- Members can belong to multiple groups; all group actions are explicitly group-scoped.
- Permission details and precedence are defined in `04_FLOW_RBAC.md`.

### 6.7 Tracking and visibility

- Tracking modes: continuous, optional, background, or disabled; accuracy and refresh interval are configurable.
- The group administrator chooses continuous versus optional behavior.
- Location access is mandatory or optional per group.
- When mandatory access is denied or disabled, tracking-mode functionality is blocked with explanation and a route to device/browser settings. The app does not bypass operating-system consent.
- Visibility modes: everyone sees everyone; only administrators see everyone; configurable scoped visibility; invisible-member mode; hidden-administrator mode.
- Members must be able to see any authorized group member regardless of geographic distance when the configured policy is everyone-visible. Nearby-only remains a separate configurable policy with a **Provisional** configurable radius.
- Visibility is enforced in data/service responses later, not merely hidden in UI.

### 6.8 Live map

- Provider-independent map container with a useful mock fallback and no map SDK dependency.
- Current user/member pins, selection cards or mobile bottom sheets, address, current speed, battery, signal, last seen, distance, tracking status, filters, compass, traffic/satellite controls, and navigation entry where data is available.
- Loading, no permission, no members, stale locations, partial data, offline, and provider failure states.
- Accessibility requires a non-map list alternative for essential member information.

### 6.9 Speed-limit functionality

- Available in both application modes.
- Show current speed, road speed limit, overspeed state, voice-warning preference, danger/school/camera/hazard states, speed history, and trip summary.
- Never claim authoritative speed limits when data is unknown or stale.
- Warnings must not rely on color alone and must avoid unsafe interaction demands while driving.

### 6.10 Navigation and road alerts

- Route preview, destination entry, turn-by-turn presentation, traffic, alternatives, ETA, construction, closures, parking/fuel stop discovery when supported later.
- Only Group Owner or authorized sub-owner may update a group route; ordinary group admins cannot.
- Users can submit construction, flood, accident, closure, police checkpoint, or road damage reports.
- Road report states are **Provisional**: pending, verified, rejected, expired.
- Route recalculation based on verified closures is a future provider/backend integration.

### 6.11 SOS and emergency

- Prominent SOS entry, confirmation to prevent accidental triggering, emergency contacts, live-location share, emergency call/message presentation, and active/cancelled/completed states.
- WhatsApp may be offered for emergency/location sharing, without representing it as delivered during the mock phase.
- Crash detection and automated escalation are future scope until recipients, evidence, and escalation rules are approved.

### 6.12 Trips and reports

- Trip list/detail, distance, duration, average/max speed, overspeed events, alerts, route summary, and driving score.
- Daily, weekly, and monthly report views.
- PDF and Excel export states are included; mock exports must be clearly labeled.
- Platform Owner can export permitted user directory data (such as name and mobile number) to Excel, subject to the future privacy policy.

### 6.13 Payments and subscriptions

- Support required/not-required, pending, successful, failed, cancelled, duplicate-under-review, and history/invoice states.
- Failed payment offers retry and cancel (**Provisional**).
- Duplicate payment enters review (**Provisional**).
- Group payment proceeds to owner approval, never activation.
- The client transcript mentions configurable durations and no-payment options, but prices, currencies, plans, taxes, providers, and billing unit remain open.

### 6.14 Notifications

- In-app center and preferences for speed warnings, join requests, invitations, member changes, payment reminders, SOS, route/road alerts, announcements, and system status.
- Read/unread, filter, mark-all-read, deep-link, empty, and failure states.
- External channels are not selected.

### 6.15 Profile and settings

- Edit names, optional email, photo placeholder, mobile verification state, language, light/dark theme, notification preferences, GPS/tracking settings, privacy, subscription, payment history, account deletion/recovery, and logout.
- Account deletion is recoverable according to the transcript, but recovery window and data policy remain open. UI must not promise restoration duration.

### 6.16 Platform administration

- Dashboard; pending approval queue; group review, approve, reject, suspend, restore; active/suspended groups; users; payments; subscriptions; reports; road reports; support tickets; settings.
- Rejection captures a reason. Refund/resubmission behavior remains open.
- API usage monitoring is planned for later integration and is not part of UI-first MVP unless separately prioritized.

## 7. Non-functional requirements

### Responsive and compatibility

- Mobile-first from 360px; tablet and desktop layouts.
- **Provisional:** latest two versions of Chrome, Edge, Safari, and Firefox.
- No horizontal page scrolling at supported widths; tables provide deliberate responsive alternatives.

### Accessibility

- **Provisional:** WCAG 2.2 AA.
- Semantic regions/headings, keyboard operation, visible focus, labels/instructions, programmatic errors, sufficient contrast, reduced motion, screen-reader announcements, 44px touch targets where practical, and non-color status cues.
- Maps and charts require textual/tabular alternatives.

### Quality, performance, and resilience

- Strict TypeScript; no unnecessary `any`; reusable bounded components; centralized tokens.
- Lazy-load feature routes and heavy visualization areas.
- Provide loading, empty, error, disabled, offline/stale, and success states.
- Avoid real personal/location/payment data in mocks and logs.
- No direct API calls in presentational components.

### Security and privacy

- Frontend checks improve UX but never replace server authorization.
- No secrets, tokens, or credentials in source.
- Minimize display of mobile/location data; prevent sensitive values in client logs.
- Explicit consent and clear permission recovery; no covert tracking.

## 8. MVP scope

MVP is a responsive, navigable mock frontend covering the registered screens and states for both modes and owner administration, including guards, group lifecycle, membership/RBAC, mock map/speed/navigation, trips/reports, payment/approval states, notifications, profile/settings, support tickets, PDF/Excel export states, and light/dark themes.

## 9. Future scope

- Real authentication/OTP, backend APIs, realtime GPS, background mobile tracking, map/routing/traffic/speed providers, payments, WhatsApp Business API, push notifications, export generation, crash detection, analytics, API-cost monitoring, native mobile apps, store publication, offline/PWA behavior, and production security/compliance.

## 10. Out of scope for the UI-first phase

- Backend, database, real authentication, live GPS, real map SDK, real navigation, real payments, real QR validation, real OTP, WhatsApp delivery, push notifications, legal text, provider contracts, app stores, production deployment, pricing, and infrastructure cost estimates.

## 11. Assumptions, constraints, dependencies, and risks

### Assumptions

- A user has one account and may hold multiple group-scoped roles.
- Platform role, group role, user mode, subscription, group status, and location permission are separate dimensions.
- Full workflows use routes; confirmations use modals; mobile filters/secondary settings use drawers; member details use cards/bottom sheets; result states generally remain on the current route (**Provisional UI defaults**).
- Mock services emulate latency and failures without external calls.

### Constraints and dependencies

- UI-first approval precedes API integration.
- Provider and commercial decisions are deliberately deferred.
- Browser location and tracking remain subject to user consent and platform policy.
- Final navigation/speed accuracy depends on third-party data not yet selected.

### Risks

- Sensitive location visibility if policy enforcement is incomplete.
- Driver distraction or overreliance on speed/navigation data.
- Scope pressure from the large screen registry.
- Ambiguous billing, rejection/refund, retention, SOS, and mode-switch rules.
- Map/traffic/provider cost and coverage variation.
- Cross-feature coupling if group context and guards are not centralized.

## 12. Product acceptance criteria

1. Both modes are selectable and their navigation never exposes prohibited group features in speed-only mode.
2. Passwordless registration validates required fields and models first-device/device-change OTP; email remains optional.
3. A user can mock-create multiple groups through the ordered workflow.
4. Public auto-join and approval-required paths, plus private link/QR/direct invitation paths, are represented.
5. Payment success leads to pending owner approval, not active status.
6. Owner administration can approve, reject, suspend, and restore through guarded mock flows.
7. Tracking and visibility configurations are understandable and permission-gated.
8. Mandatory location denial blocks tracking features while preserving an explanatory recovery path.
9. Speed, navigation, hazard, SOS, trip, report, PDF/Excel export, notification, support, profile, billing, and theme states are represented.
10. Every registered route has responsive mobile/tablet/desktop behavior and loading/empty/error/success coverage where applicable.
11. Keyboard and screen-reader fundamentals meet the provisional WCAG target.
12. No real integration, credential, invented commercial term, or hardcoded provider dependency is introduced.

## 13. Open questions

1. Exact supported languages and RTL requirement
2. Target countries and regions
3. Currency, plans, prices, and taxes
4. Payment provider
5. Per-account, per-group, or per-member billing
6. Mode-switching rules
7. Group and member limits
8. Nearby-member radius
9. Invite expiry policy
10. SOS recipients and escalation rules
11. Final maps, routing, traffic, and speed-limit providers
12. Group rejection, refund, and resubmission rules
13. Data-retention and account-deletion policy
14. Legal disclaimers
15. PWA/offline requirement
