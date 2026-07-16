# MVP Screen Registry and Low-Fidelity Wireframes

## 1. How to read this registry

This document is the source of truth for MVP screens and responsive presentation. It registers **93 screens**. A screen is a route-level view or a full workflow state; confirmations normally use modals, mobile filters use drawers, member detail may use a bottom sheet, and loading/empty/error/success outcomes remain states of the same screen.

Every registry row supplies the required specification fields through these columns:

- **Identity:** Screen ID, name, module, route, application mode, allowed roles, priority.
- **Flow:** purpose, entry points, exit points.
- **UI:** header, desktop/mobile navigation, main sections, fields, buttons, actions.
- **Rules/states:** validation, loading, empty, error, success, permission restrictions.
- **Delivery:** mock data, future service, mobile/tablet/desktop layout, dependencies, notes.

Priority: `P0` is necessary to complete a core workflow; `P1` supports MVP operations; `P2` may follow core workflow stabilization. “Tracking” means Tracking/Group Mode, “Speed” means Speed Limit Only Mode, “Shared” means both user modes, and “Owner” means the platform workspace.

Unless a row states otherwise:

- Header shows back/breadcrumb where needed, localized title, notification access, and account menu.
- Desktop uses the relevant sidebar; mobile uses mode-filtered bottom navigation plus overflow/drawer; tablet uses a rail/drawer.
- Loading uses a skeleton/progress state; errors show a safe message and retry; success is announced accessibly; unavailable actions are hidden or disabled with a reason.
- Forms have visible labels, keyboard operation, inline errors, submit focus management, and unsaved-change protection.
- Mobile is single-column from 360px; tablet may use two panes; desktop constrains forms and uses list/detail or map/detail splits.
- Mock data is fictional and deterministic. Future service names are architectural ports, not selected providers.

## 2. Shell wireframes

### Desktop application shell

```text
+------------------------------------------------------------------+
| Logo | Page title / context          Alerts       Profile / Menu |
+------+-----------------------------------------------------------+
| Side | Breadcrumbs / Page actions                                |
| bar  | +----------------------+  +-----------------------------+ |
|      | | Primary content      |  | Optional detail/map panel   | |
|      | | cards/form/list      |  |                             | |
|      | +----------------------+  +-----------------------------+ |
+------+-----------------------------------------------------------+
```

### Mobile application shell

```text
+----------------------------------+
| Back / Title       Alert / Menu  |
+----------------------------------+
| Status or context strip          |
| Main content                     |
| Cards / form / list / mock map   |
|                                  |
+----------------------------------+
| Mode-aware bottom navigation     |
+----------------------------------+
```

### Wizard

```text
+------------------------------------------------+
| Create group                     Save & exit    |
| Step 3 of 7  [====------]                       |
+------------------------------------------------+
| Step title                                     |
| Explanation / fields / preview                 |
|                                                |
+------------------------------------------------+
| Back                           Continue         |
+------------------------------------------------+
```

### Map

```text
+------------------------------------------------+
| Group / status | Search | Filters | Controls   |
+-------------------------------+----------------+
| Accessible member list        | Mock map       |
| status / last seen / speed    | pins / route   |
| selected member detail        | alerts         |
+-------------------------------+----------------+
```

On mobile the map fills the route beneath controls; member details open as a bottom sheet and an accessible list view remains available.

## 3. Onboarding (`ONB`)

| Identity | Flow | UI | Rules and states | Delivery |
|---|---|---|---|---|
| **ONB-001 Splash** · Onboarding · `/` · Shared · Guest · P0 | Establish brand and resolve saved session/mode. Entry: launch. Exit: language, welcome, dashboard, or owner login redirect. | Full-screen logo, product name, progress indicator; no nav or fields; retry if initialization fails. | Validate stored state shape; loading is primary; error offers retry/reset; success redirects; never reveal protected data. | Mock bootstrap/session; future `BootstrapService`; centered at all sizes; depends on app providers. Keep brief and reduced-motion safe. |
| **ONB-002 Language Selection** · `/onboarding/language` · Shared · Guest/User · P0 | Choose UI language. Entry: first launch or settings. Exit: welcome or prior settings route. | Language search/list, current choice, Continue/Save. | Require one supported option; empty search, load failure, saved success; exact languages and RTL are open. | Mock locale list; future `LocaleService`; mobile list, tablet/desktop centered card. |
| **ONB-003 Welcome** · `/onboarding/welcome` · Shared · Guest · P0 | Explain two experiences and consent-first design. Entry: language. Exit: mode selection, login. | Benefit cards, privacy note, Continue, Sign in. | No input; content load fallback; mode-specific claims must be accurate. | Static localized content; future CMS optional; stacked mobile, two-column desktop. |
| **ONB-004 Mode Selection** · `/onboarding/mode` · Shared · Guest/User · P0 | Select Tracking/Group or Speed Only. Entry: welcome/settings when switching allowed. Exit: permission intro or mode dashboard. | Two radio cards with included/excluded features; Continue. | Require selection; block unauthorized switching with explanation; no groups shown in Speed card. | Mock entitlement; future `EntitlementService`; stacked mobile, side-by-side tablet/desktop. Mode-switch rules open. |
| **ONB-005 Permission Introduction** · `/onboarding/permissions` · Shared · Guest/User · P0 | Explain location/notification needs before native prompts. Entry: mode selection. Exit: auth or location permission. | Permission cards, why/when copy, Continue, Not now where optional. | Must not claim permission before browser result; mandatory implications shown; failure is informational. | Mock permission capability; future browser/mobile adapters; single column with illustration optional. |

## 4. Authentication (`AUTH`)

| Identity | Flow | UI | Rules and states | Delivery |
|---|---|---|---|---|
| **AUTH-001 Login** · Auth · `/auth/login` · Shared · Guest · P0 | Start passwordless login. Entry: welcome, protected redirect, invite. Exit: OTP, device verification, registration. | Mobile number/country-code fields, Continue, Register, Terms link; auth header, no app nav. | Required valid normalized mobile; sending/unknown-number/rate-limit/network/sent states; no password or forgot-password link. | Mock auth records; `AuthService.requestOtp`; centered card; invite return URL sanitized. |
| **AUTH-002 Registration** · `/auth/register` · Shared · Guest · P0 | Create account setup. Entry: login/welcome. Exit: OTP. | First/last name, mobile, optional email, language, terms checkbox; Create account. | Names/mobile/language/terms required; email format only if supplied; duplicate/rate-limit/service errors. | Mock user/languages; `AuthService.register`; single mobile, two-column name fields desktop. |
| **AUTH-003 OTP Verification** · `/auth/verify` · Shared · Guest · P0 | Verify first setup or explicit auth challenge. Entry: login/register/group verification gate. Exit: intended route. | Masked mobile, OTP cells, countdown, Verify, Resend, Change number. | Length/digits, expiry, attempts, cooldown; invalid/expired/locked/sent/verified; never log OTP. | Mock challenge; `AuthService.verifyOtp`; compact centered card; announce countdown sparingly. |
| **AUTH-004 Device Verification** · `/auth/device-verification` · Shared · Guest · P0 | Explain and verify changed device. Entry: login risk response. Exit: OTP then intended route. | Device summary, security explanation, Send OTP, Cancel/logout. | Challenge required only on changed device; unavailable/expired/verified states; protect device details. | Mock device; future device/auth service; centered card. |
| **AUTH-005 Account Access Recovery** · `/auth/recover` · Shared · Guest · P1 | Recover access through verified mobile; replaces password recovery. Entry: login/help. Exit: OTP or support. | Mobile field, Recover, Contact support. | Valid mobile; unknown account response avoids enumeration; rate-limit and success states. | Mock recovery; `AuthService.recover`; centered card. No password reset. |
| **AUTH-006 Terms** · `/legal/terms` · Shared · Guest/User · P0 | Review required terms placeholder. Entry: registration/group review/settings. Exit: caller. | Document title/version placeholder, scrollable content, Back/Accept when invoked in flow. | Acceptance enabled only after content available; legal wording not invented; load/error/version states. | Mock legal metadata; future `LegalContentService`; readable max width. |
| **AUTH-007 Location Permission** · `/auth/location-permission` · Shared · User · P0 | Request or recover location consent. Entry: permission intro/guard/settings. Exit: dashboard/requested feature. | Requirement status, purpose, Allow, Open settings, Continue without where optional. | Mandatory denial blocks tracking; optional denial permits nontracking areas; requesting/denied/unavailable/granted states. | Mock permission; future browser/mobile adapter; card plus troubleshooting; depends on group policy. |

## 5. Dashboards (`DASH`)

| Identity | Flow | UI | Rules and states | Delivery |
|---|---|---|---|---|
| **DASH-001 Tracking Dashboard** · Dashboard · `/app/dashboard` · Tracking · authenticated tracking users · P0 | Summarize selected group and personal status. Entry: login/nav. Exit: map, groups, alerts, trips, reports. | Group switcher; GPS/tracking status; current location/speed/group; online members; alerts; notifications; quick actions. | Group/permission-aware; pending/rejected/suspended cards; mandatory-location block; no-group empty CTA. | Mock dashboard aggregates; dashboard/group/tracking services; card grid mobile, denser grid desktop. |
| **DASH-002 Speed Dashboard** · `/app/speed/dashboard` · Speed · Speed-Only User · P0 | Driving-focused home without group data. Entry: login/nav. Exit: current speed, navigation, trips, reports. | Speed gauge, limit card, warning/voice state, route action, recent trip/alerts. | Subscription/location guards as applicable; unknown speed limit clearly shown; no group/member content. | Mock telemetry; speed/navigation services; driving-safe large controls, two-column desktop. |

## 6. Groups (`GRP`)

| Identity | Flow | UI | Rules and states | Delivery |
|---|---|---|---|---|
| **GRP-001 Group Basic Information** · Groups · `/app/groups/new/details` · Tracking · User · P0 | Start group draft. Entry: Create Group. Exit: privacy/save-exit. | Wizard header; name, description/purpose, logo mock, category; Back/Continue/Save. | Name/description/category required; length/file mock rules; duplicate/error/draft-saved. | Mock categories/draft; `GroupDraftService`; single form, preview desktop. |
| **GRP-002 Privacy and Joining** · `/app/groups/new/privacy` · Tracking · draft owner · P0 | Choose public/private and public join method. | Privacy radios; auto/admin approval; invite-only explanation; Back/Continue. | Public requires join method; private disables discovery; draft states. | Draft mock/service; responsive cards; depends GRP-001. |
| **GRP-003 Tracking Settings** · `/app/groups/new/tracking` · Tracking · draft owner · P0 | Configure continuous/optional/background/disabled, mandatory/optional location, accuracy, refresh interval. | Radios/selects/switches, policy impact summary. | Compatible combinations; mandatory denial consequence; no invented interval limits. | Mock option catalog; draft service; form plus summary. |
| **GRP-004 Visibility Settings** · `/app/groups/new/visibility` · Tracking · draft owner · P0 | Define who sees whom. | Visibility radios, invisible/hidden admin controls, nearby radius input when selected. | Radius required for nearby policy but value undecided; warn about privacy impact; permission conflicts. | Mock policies; draft service; cards mobile, policy/preview desktop. |
| **GRP-005 Roles and Permissions** · `/app/groups/new/roles` · Tracking · draft owner · P0 | Configure role templates and delegated limits. | Role tabs/table, permission switches, reset template, impact summary. | Cannot remove owner essentials or grant platform rights; owner/sub-owner route-update rule fixed. | Mock permission catalog; draft/permission service; cards mobile, matrix desktop. |
| **GRP-006 Invitation Options** · `/app/groups/new/invitations` · Tracking · draft owner · P1 | Configure link/QR/direct invitation and expiry. | Method toggles, expiry control, WhatsApp availability preview. | Private group requires at least one method; expiry configurable but policy open. | Mock invite config; invitation service; stacked form. |
| **GRP-007 Group Review** · `/app/groups/new/review` · Tracking · draft owner · P0 | Review all steps and accept terms. | Section summaries/Edit links, terms/privacy/location acknowledgement, Submit. | Required acknowledgements and aggregate schema; invalid sections link back; submit progress/error. | Draft mock; group/legal services; single column with sticky action desktop. |
| **GRP-008 Group OTP Gate** · `/app/groups/new/verify` · Tracking · draft owner · P0 | Apply OTP only if current device/setup requires it. | Reason, OTP component or “already verified” continuation. | Must skip when device already verified; standard OTP states. | Auth challenge mock/service; compact step; depends GRP-007. |
| **GRP-009 Group Payment** · `/app/groups/new/payment` · Tracking · draft owner · P0 | Handle required/no-payment decision and payment mock. | Order summary without invented amounts, method placeholder, Pay/Retry/Cancel. | Required fields provider-dependent later; failed retry/cancel; duplicate review; success never activates. | Mock payment intent; `PaymentService`; summary/form split desktop. |
| **GRP-010 Waiting for Approval** · `/app/groups/:groupId/pending` · Tracking · Group Owner/Admin with view · P0 | Explain paid/submitted pending review. | Timeline, submitted/payment status, group summary, Dashboard/Support. | Read-only; polling/loading/review-delay error; no activation action. | Mock lifecycle; group/support services; centered status plus details. |
| **GRP-011 Approved Group** · `/app/groups/:groupId/approved` · Tracking · group members · P0 | Confirm activation and next steps. | Success status, activation details, Open Group/Invite/Map actions by permission. | Only active status; actions permission-gated. | Mock group; group service; success panel. |
| **GRP-012 Rejected Group** · `/app/groups/:groupId/rejected` · Tracking · Group Owner/authorized admin · P0 | Show rejection reason and allowed options. | Reason, review details, Edit/Resubmit/Support. | Read-only until resubmission allowed; refund/resubmit rules open; no payment promise. | Mock rejection; group/support services; status plus affected sections. |
| **GRP-013 Group Resubmission** · `/app/groups/:groupId/resubmit` · Tracking · Group Owner/authorized admin · P1 | Correct rejected details and resubmit. | Editable flagged sections, response note, Review/Submit. | Only rejected/resubmittable group; validate changed fields; conflict/error/submitted. | Mock review findings; group service; form/detail split. |
| **GRP-014 My Groups** · `/app/groups` · Tracking · User · P0 | List memberships/owned groups and lifecycle. | Search, filters, group cards/table, group switch, Create. | Empty CTA; status/role filters; blocked/suspended visibility rules. | Mock group list; group service; cards mobile/table desktop. |
| **GRP-015 Public Groups** · `/app/groups/discover` · Tracking · Guest browse/User join · P0 | Discover public groups. | Search, category filters, join-method badges, cards, View/Join. | Private groups never appear; join requires auth; empty/error/results. | Mock catalog; group discovery service; responsive grid. |
| **GRP-016 Group Details** · `/app/groups/:groupId` · Tracking · permitted user/public preview · P0 | Present overview and permitted actions. | Header/status, purpose, admins, counts, policies summary, Join/Open Map/Settings. | Redact private/member data; lifecycle and membership gates. | Mock details; group service; overview plus side actions. |
| **GRP-017 Group Members** · `/app/groups/:groupId/members` · Tracking · permitted group roles · P0 | Search/manage member roster. | Search/filter, member list/table, Invite, bulk action where allowed. | View/remove/block permissions; empty/loading/error; suspended view-only. | Mock members; member service; cards/table. |
| **GRP-018 Member Details** · `/app/groups/:groupId/members/:memberId` · Tracking · permitted roles · P0 | View authorized status/location/role and actions. | Identity, role, tracking/last seen, speed/battery/signal when permitted; Navigate/Call/Message/Block/Unblock/Remove. | Field-level visibility; confirmation modals; cannot modify superior role. | Mock member; member/tracking services; page desktop, reusable bottom-sheet content on map mobile. |
| **GRP-019 Join Request Review** · `/app/groups/:groupId/requests/:requestId` · Tracking · join-manage permission · P0 | Approve/reject applicant. | Applicant summary, request note, policy, Approve/Reject. | Pending only; rejection reason optional/required policy undecided; conflict if already handled. | Mock request; membership service; detail card. |
| **GRP-020 Join Request Status** · `/app/groups/requests/:requestId/status` · Tracking · applicant · P0 | Track pending/approved/rejected request. | Timeline, group summary, Cancel/Open Group/Discover. | Applicant-only; state-specific actions; no admin data. | Mock request; membership service; centered status. |
| **GRP-021 Invitations** · `/app/groups/:groupId/invitations` · Tracking · invite permission · P1 | List/create/revoke invitations. | Status filters, invite table/cards, Create Direct/Link/QR. | Expiry/revocation; private policy; suspended view-only. | Mock invites; invitation service; cards/table. |
| **GRP-022 QR Invitation** · `/app/groups/:groupId/invitations/qr` · Tracking · invite permission · P1 | Create/display mock QR invitation. | Expiry, QR placeholder, Copy/Share WhatsApp/Revoke. | Valid expiry; never imply real scannability in mock; expired/revoked states. | Mock token/QR; invitation/share services; centered card. |
| **GRP-023 Invite-Link Sharing** · `/app/groups/:groupId/invitations/link` · Tracking · invite permission · P0 | Create and share invite link. | Expiry, link placeholder, Copy, WhatsApp Share, Revoke. | Sanitize URL; configurable expiry; copy/share unavailable errors. | Mock invitation/share adapter; compact form. |
| **GRP-024 Group Settings** · `/app/groups/:groupId/settings` · Tracking · edit-group permission · P0 | Edit group info, privacy, tracking, visibility, join and status-sensitive settings. | Section navigation, forms, Save, archive/delete request where permitted. | Per-section permission; suspended view-only; confirmation for high impact; server conflict later. | Mock group config; group service; mobile sections, desktop settings sidebar. |
| **GRP-025 Role Management** · `/app/groups/:groupId/roles` · Tracking · assign-role/edit-permission capabilities · P0 | Assign multiple admins and maintain role permissions. | Role/member tabs, matrix, Assign/Remove role, Save. | Hierarchy and ownership safeguards; no platform grants; audit note; conflict states. | Mock roles/permissions; permission service; cards mobile, matrix desktop. |

## 7. Tracking and maps (`MAP`)

| Identity | Flow | UI | Rules and states | Delivery |
|---|---|---|---|---|
| **MAP-001 Live Map** · Tracking · `/app/tracking/:groupId/map` · Tracking · map-view permission · P0 | View authorized live group context. | Group/status controls, mock map, accessible member list, filters, selected card, speed/alerts, navigation. | Mandatory location and lifecycle guards; field-level visibility; stale/offline/no-members/provider-error states. | Mock locations; tracking/map adapters; full mobile map + sheet, split tablet/desktop. |
| **MAP-002 Member Map Card** · `/app/tracking/:groupId/member/:memberId` · Tracking · member-view permission · P1 | Deep-linkable map-focused member detail. | Map context, photo/name, speed, battery, signal, last seen, distance, Navigate/Call/Message. | Visibility and action permissions; unknown/stale values explicit. | Mock member/location; tracking service; bottom sheet mobile, side card desktop. |
| **MAP-003 Map Filters** · `/app/tracking/:groupId/filters` · Tracking · map-view permission · P1 | Filter pins/list by status/role/alerts. | Search, status/role/tracking filters, Apply/Clear. | Valid filter combinations; zero-result state; URL/search-param sync. | Mock facets; tracking query; drawer mobile, popover/panel desktop. |
| **MAP-004 Tracking Status** · `/app/tracking/status` · Tracking · User · P0 | Explain own permission, policy, accuracy, background and last-update status. | Status cards, policy summary, Start/Stop when optional, Open settings. | Continuous group policy prevents optional stop and blocks tracking features when denied; browser limitations stated. | Mock status/permission adapter; card layout. |
| **MAP-005 Route Preview** · `/app/tracking/:groupId/routes/:routeId` · Tracking · route-view permission · P1 | Preview group route before navigation. | Mock polyline, stops, ETA/distance placeholders, alerts, Start Navigation/Edit if owner/sub-owner. | Edit restricted to owner/sub-owner; unavailable provider and stale route states. | Mock route; routing service; stacked mobile, map/details split. |
| **MAP-006 Map Road Alert Report** · `/app/tracking/:groupId/report-road` · Tracking · road-report permission · P1 | Submit hazard from map context. | Location preview, type, description, optional image mock, Submit. | Location/type required; consent and safe-use notice; duplicate/offline errors; submitted pending state. | Mock location/report; road-alert service; bottom sheet/mobile page, modal/side panel desktop. |

## 8. Speed (`SPD`)

| Identity | Flow | UI | Rules and states | Delivery |
|---|---|---|---|---|
| **SPD-001 Current Speed** · Speed Limit · `/app/speed/current` · Shared · entitled user · P0 | Primary speed display. | Large gauge, units, GPS confidence, current limit, warning state, Start/Stop trip. | Unknown/stale/permission/offline states; no unsafe accuracy claim. | Mock telemetry; speed service; driving-safe full viewport. |
| **SPD-002 Road Speed Limit** · `/app/speed/limit` · Shared · entitled user · P0 | Explain detected limit and data confidence. | Limit sign card, road/context, last updated, Report issue. | Unknown/unsupported/stale values; provider undecided. | Mock limit; speed-limit service; card plus map preview. |
| **SPD-003 Overspeed Warning** · `/app/speed/warning` · Shared · entitled user · P0 | Present active overspeed warning without color-only cues. | Current vs allowed speed, audible/voice status, Dismiss/Acknowledge according to policy. | Threshold policy/provider open; reduced distraction; active/resolved states. | Mock event; warning service; large high-contrast overlay state. |
| **SPD-004 Voice Warning Settings** · `/app/speed/voice` · Shared · entitled user · P1 | Configure voice alerts. | Enable, volume/system guidance, preview voice mock, warning types. | Unsupported audio/permission errors; preview labeled mock; persist success. | Mock preference; settings/voice adapter; form card. |
| **SPD-005 Speed History** · `/app/speed/history` · Shared · entitled user · P1 | Review speed events over time. | Date filters, chart plus table alternative, event list, trip links. | Valid range; empty/error/export link by permission. | Mock events; trip/report service; list mobile, chart/table desktop. |

## 9. Navigation (`NAV`)

| Identity | Flow | UI | Rules and states | Delivery |
|---|---|---|---|---|
| **NAV-001 Navigation Search and Preview** · Navigation · `/app/navigation` · Shared · entitled user · P0 | Choose destination and compare route preview. | Origin/destination, recent places mock, alternatives, traffic/hazards, Start. | Destination required; no-route/provider/permission states; group route edit absent here. | Mock geocoding/routes; navigation service; form/map split desktop. |
| **NAV-002 Active Navigation** · `/app/navigation/active` · Shared · entitled user · P0 | Present turn guidance, ETA, speed limit and alerts. | Next maneuver, mock map, ETA, alternatives, report hazard, End. | Driving-safe controls; location/provider loss; rerouting state; no real navigation claim. | Mock route/telemetry; navigation/speed/alert services; full viewport. |

## 10. Alerts and SOS (`ALT`)

| Identity | Flow | UI | Rules and states | Delivery |
|---|---|---|---|---|
| **ALT-001 Alerts Center** · Alerts · `/app/alerts` · Shared · User · P0 | View road, speed, safety, and group alerts allowed by mode. | Tabs/filters, alert cards, map/list toggle, mark read. | Mode/permission filtering; empty and stale alerts. | Mock alerts; alert service; list mobile, list/map desktop. |
| **ALT-002 Road Hazard Report** · `/app/alerts/report` · Shared · User · P0 | Submit construction/flood/accident/closure/checkpoint/damage. | Type, location, description, image mock, Submit. | Type/location required; duplicate and offline; success is pending. | Mock report; road-report service; form/map split. |
| **ALT-003 Road Report Status** · `/app/alerts/reports/:reportId` · Shared · reporter/permitted reviewer · P1 | Track pending/verified/rejected/expired report. | Timeline, evidence summary, map preview, withdraw if permitted. | State-specific actions and visibility; statuses provisional. | Mock report; road-report service; detail layout. |
| **ALT-004 SOS** · Safety · `/app/sos` · Shared · User · P0 | Enter emergency workflow. | Large SOS control, contacts summary, sharing channels, safety guidance. | Requires confirmation; permission/network/channel failures; do not imply delivery. | Mock emergency config; SOS/share adapters; distraction-safe full screen. |
| **ALT-005 Emergency Confirmation** · `/app/sos/confirm` · Shared · User · P0 | Prevent accidental SOS and choose action. | Countdown/confirm, Cancel, Call/Share options. | Explicit confirmation and cancellation; active/failed/sent-mock states; recipients open. | Mock SOS; SOS service; modal-like full route on mobile, dialog desktop deep-link safe. |
| **ALT-006 Emergency Contacts** · `/app/sos/contacts` · Shared · User · P1 | Add/edit/reorder emergency contacts. | Name, relationship, mobile, preferred channel; Add/Save/Delete. | Valid fields, duplicate confirmation, empty state; escalation rules open. | Mock contacts; emergency-contact service; list/form split desktop. |

## 11. Trips (`TRP`)

| Identity | Flow | UI | Rules and states | Delivery |
|---|---|---|---|---|
| **TRP-001 Trip List** · Trips · `/app/trips` · Shared · User/report-permitted admin · P0 | Browse trips by date/status/group where allowed. | Search/date filters, trip cards/table, report links. | Scope by identity/group permission; empty/range errors. | Mock trips; trip service; cards/table. |
| **TRP-002 Trip Details** · `/app/trips/:tripId` · Shared · trip owner/permitted group role · P0 | Review route, distance, duration, speed and events. | Mock route, metrics, overspeed/hazard timeline, score, Report/Export. | Field-level scope; incomplete processing state; export permission. | Mock trip/events; trip/report services; stacked mobile, map/metrics desktop. |

## 12. Reports (`RPT`)

| Identity | Flow | UI | Rules and states | Delivery |
|---|---|---|---|---|
| **RPT-001 Reports Overview** · Reports · `/app/reports` · Shared · User/report-view permission · P0 | Select report period/type and see headline metrics. | Date/group selectors, summary cards, daily/weekly/monthly links, Export. | Valid scope/range; permission and no-data states. | Mock aggregates; report service; card grid. |
| **RPT-002 Daily Report** · `/app/reports/daily` · Shared · permitted user · P1 | Daily trips, distance, speed, events. | Date, metrics, timeline/table, trip links, Export. | One-day range; no data; scope guard. | Mock report; report service; stacked/table. |
| **RPT-003 Weekly Report** · `/app/reports/weekly` · Shared · permitted user · P1 | Weekly trend and comparison. | Week picker, charts plus tables, events, Export. | Valid week; incomplete-period label. | Mock aggregates; report service; chart/table responsive. |
| **RPT-004 Monthly Report** · `/app/reports/monthly` · Shared · permitted user · P1 | Monthly trend and summary. | Month picker, charts/tables, trips/events, Export. | Valid month; large result pagination where needed. | Mock aggregates; report service. |
| **RPT-005 Driving Score** · `/app/reports/driving-score` · Shared · permitted user · P1 | Explain score and contributing behaviors. | Score, factor cards, trend, improvement guidance. | Unknown methodology clearly provisional; no unsupported safety claim. | Mock score; scoring/report service; cards plus chart alternative. |
| **RPT-006 Export Center** · `/app/reports/exports` · Shared · export-report permission · P1 | Request and track PDF/Excel exports. | Report/scope/format fields, Generate, jobs list, Retry/Download mock. | PDF/Excel only for confirmed MVP; permission, failed/expired/ready states; mock downloads labeled. | Mock export jobs; export service; form/list split. |

## 13. Payments and subscriptions (`PAY`)

| Identity | Flow | UI | Rules and states | Delivery |
|---|---|---|---|---|
| **PAY-001 Subscription** · Payments · `/app/subscription` · Shared · User · P0 | View entitlement and undecided plan choices. | Current status, plan placeholders, renewal/cancel actions only when policy exists. | Never invent price/currency/limits; inactive/grace/pending states only after decisions. | Mock entitlement; subscription service; cards. |
| **PAY-002 Checkout** · `/app/payments/checkout` · Shared · payer · P0 | Complete mock account/group payment. | Context summary, provider placeholder, Pay/Cancel. | Amount/provider supplied by future service; failure retry/cancel; duplicate review; accessibility. | Mock payment intent; payment service; centered form/summary. |
| **PAY-003 Payment Result** · `/app/payments/:paymentId/result` · Shared · payer · P0 | Show pending/success/failed/cancelled/duplicate-review result. | Status, reference, Retry/Return/Support. | Group success routes to pending approval, never activation; state-specific actions. | Mock payment; payment service; status panel. |
| **PAY-004 Payment History** · `/app/payments` · Shared · User · P1 | View payments/invoices. | Search/date/status filters, records, invoice/download mock. | Account scope; empty/error; sensitive data redacted. | Mock records; payment service; cards/table. |

## 14. Notifications (`NOT`)

| Identity | Flow | UI | Rules and states | Delivery |
|---|---|---|---|---|
| **NOT-001 Notification Center** · Notifications · `/app/notifications` · Shared · User · P0 | Review and deep-link from in-app events. | Filters, read/unread list, Mark all read, notification actions. | Mode/permission-safe deep links; empty/error/optimistic conflict states. | Mock notifications; notification service; list with detail desktop optional. |
| **NOT-002 Notification Preferences** · `/app/settings/notifications` · Shared · User · P1 | Configure categories/channels available in MVP. | Category switches, quiet behavior placeholder, Save. | At least critical-category constraints only if policy approved; external channels undecided. | Mock preferences; notification settings service; form sections. |

## 15. Profile (`PRO`)

| Identity | Flow | UI | Rules and states | Delivery |
|---|---|---|---|---|
| **PRO-001 Profile** · Profile · `/app/profile` · Shared · User · P0 | View/edit identity and optional email. | Photo mock, first/last names, verified mobile read-only/change flow placeholder, optional email, language, Save. | Names required; email optional/valid if entered; mobile change requires verification later. | Mock profile; profile/auth services; form with summary desktop. |

## 16. Settings (`SET`)

| Identity | Flow | UI | Rules and states | Delivery |
|---|---|---|---|---|
| **SET-001 Settings Home** · Settings · `/app/settings` · Shared · User · P0 | Navigate account/app settings. | Section list for language, theme, privacy, tracking, notifications, billing, account. | Mode filters group-only settings. | Static metadata + mock badges; services per destination; list/cards. |
| **SET-002 Language** · `/app/settings/language` · Shared · User · P1 | Change locale. | Same selector behavior as ONB-002, Save. | Exact languages/RTL open; preview/save/error. | Locale service; centered list. |
| **SET-003 Theme** · `/app/settings/theme` · Shared · User · P1 | Select light, dark, or system behavior. | Preview cards/radios, Save. | Light and dark required; contrast must remain AA; system option provisional UI convenience. | Theme store/service; cards. |
| **SET-004 Privacy** · `/app/settings/privacy` · Shared · User · P0 | Explain/manage personal privacy controls within group policy. | Visibility summary, sharing controls, consent links, data/account actions. | Cannot override mandatory group/server policy; warnings for impact. | Mock privacy; privacy service; sections. |
| **SET-005 Tracking Settings** · `/app/settings/tracking` · Tracking · User · P0 | Manage own tracking when group policy permits. | Permission/status, background/accuracy preferences, group policy summaries. | Continuous mandatory policy locks conflicting controls; no covert tracking. | Mock tracking prefs; tracking/permission adapters. |
| **SET-006 Subscription and Billing** · `/app/settings/billing` · Shared · User · P1 | Entry to entitlement/payment history. | Status, billing context, Manage/History/Support. | No invented commercial details. | Subscription/payment services; summary cards. |
| **SET-007 Delete and Recover Account** · `/app/settings/account` · Shared · User · P0 | Request deletion and explain recoverability without invented window. | Consequences, confirmation text, Delete, recovery/help entry when signed out. | Reauthentication/OTP may be required; typed confirmation; policy/window open; cancel/error/requested. | Mock account lifecycle; auth/account service; destructive-action card and modal. |
| **SET-008 Logout** · `/app/logout` · Shared · User · P0 | Confirm logout and clear scoped client state. | Confirmation, Cancel/Log out. | Prevent accidental action; clear query/store/account data; failure-safe local exit policy defined later. | Auth service; dialog or deep-link-safe page. |

## 17. Platform owner administration (`ADM`)

| Identity | Flow | UI | Rules and states | Delivery |
|---|---|---|---|---|
| **ADM-001 Admin Dashboard** · Owner Admin · `/owner` · Owner · Platform Owner/Super Admin with dashboard permission · P0 | Operational summary. | Pending groups, active/suspended counts, users, payment/subscription/report/support summaries, quick actions. | Platform permission only; data may be partially unavailable. | Mock aggregates; admin services; responsive grid. |
| **ADM-002 Pending Group Approvals** · `/owner/groups/pending` · Owner · approve/review permission · P0 | Triage submitted/paid groups. | Search/filters/table, age/status, Open Review. | Only pending-review groups; payment status visible but not sufficient. | Mock queue; admin group service; cards/table. |
| **ADM-003 Group Approval Details** · `/owner/groups/:groupId/review` · Owner · approve/reject permission · P0 | Review full group/payment/policies before decision. | Section checklist, owner info, payment state, risks, Approve/Reject/Request clarification. | Approve only eligible paid/no-payment-approved group; confirmations; conflict if already handled. | Mock review; admin group/payment services; detail with sticky decision panel. |
| **ADM-004 Group Rejection** · `/owner/groups/:groupId/reject` · Owner · reject permission · P0 | Capture rejection decision. | Reason category, detailed reason, refund/resubmit notice placeholder, Confirm/Cancel. | Reason required; rules open; no invented refund promise; audit record. | Mock reasons; admin group service; modal on desktop/full route mobile. |
| **ADM-005 Active Groups** · `/owner/groups/active` · Owner · group-view/suspend permission · P1 | Search active groups and inspect/suspend. | Filters/table, status, owner, Open/Suspend. | Suspension confirmation/reason; permissions; empty/error. | Mock groups; admin group service. |
| **ADM-006 Suspended Groups** · `/owner/groups/suspended` · Owner · group-view/restore permission · P1 | Review and restore suspended groups. | Filters/table, reason/date, Open/Restore. | Normal users remain view-only; restore confirmation and audit. | Mock groups; admin group service. |
| **ADM-007 Users** · `/owner/users` · Owner · user-view/export permission · P0 | Search platform users and export allowed directory fields to Excel. | Filters/table, user detail link, Export Excel. | Permission/redaction; export job state; no unapproved fields; blocked status. | Mock users/export jobs; admin user/export services. |
| **ADM-008 Payments** · `/owner/payments` · Owner · payment-view/manage permission · P1 | Review payment states and duplicates. | Filters/table, duplicate review, reference/status, action by permission. | No full sensitive instrument data; manage separate from view; audit actions. | Mock payments; admin payment service. |
| **ADM-009 Subscriptions** · `/owner/subscriptions` · Owner · subscription-manage permission · P1 | Review entitlements and future plan configuration. | Filters/table, status/actions; plan editor placeholder only after decisions. | Commercial fields remain open; audit changes. | Mock subscriptions; admin subscription service. |
| **ADM-010 Reports and Road Reports** · `/owner/reports` · Owner · report/road-verify permission · P1 | Review platform reports and verify/reject/expire road reports. | Type/status filters, queues, detail panel, Verify/Reject/Expire/Export where permitted. | Separate view/export/verify permissions; provisional road states; confirmation/audit. | Mock reports; admin report/road services; tabs mobile, split view desktop. |
| **ADM-011 Support Tickets** · `/owner/support` · Owner · support permission · P1 | Triage support tickets including group/payment issues. | Status/priority filters, list/detail, assign/respond/status actions. | Free text treated sensitive; permission and audit; channel delivery mocked. | Mock tickets; support service; list/detail responsive. |
| **ADM-012 Admin Settings** · `/owner/settings` · Owner · Platform Owner or delegated settings permission · P2 | Configure delegated admin access and future operational settings. | Admin list, permission sets, road/report defaults placeholders, Save. | Cannot remove last owner or self-escalate; provider/budget/legal settings deferred. | Mock platform admins/config; admin settings service; section sidebar desktop. |

## 18. Cross-screen dependency notes

- All `/app` screens depend on authenticated session and mode resolution.
- Group-scoped screens depend on selected/explicit group ID, membership, group lifecycle, and permission query.
- Map/speed/navigation screens depend on mock permission and telemetry adapters and must remain usable without a real SDK.
- Payment result feeds group lifecycle; only owner approval feeds activation.
- Route/UI denial behavior is specified in `04_FLOW_RBAC.md`.
- Screen task sequencing and ownership are specified in `05_TASKS.md`.
