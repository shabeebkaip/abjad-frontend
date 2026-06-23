# Abjad Billing — QA Test Plan

**Version:** 1.0  
**Date:** 2026-06-23  
**Environment:** Staging / Local (Moyasar Test Mode)  
**Scope:** All payment flows, subscription states, UI surfaces

---

## Test Card Credentials (Moyasar Sandbox)

| Network | Card Number | Expiry | CVV | Expected Result |
|---|---|---|---|---|
| Visa | `4111 1111 1111 1111` | 12/26 | 123 | ✅ Payment success |
| Mastercard | `5200 0000 0000 0007` | 12/26 | 123 | ✅ Payment success |
| Mada | `4464 0400 1000 0010` | 12/26 | 123 | ✅ Payment success |
| Visa (declined) | `4000 0000 0000 0002` | 12/26 | 123 | ❌ Card declined |
| Visa (expired) | `4000 0000 0000 0069` | 12/26 | 123 | ❌ Card expired |
| Visa (wrong CVV) | `4000 0000 0000 0127` | 12/26 | 999 | ❌ Security code error |

**Name on card:** Any value (e.g. `Test User`)  
**Note:** Apple Pay and STC Pay cannot be tested in a browser sandbox — skip or mark N/A.

---

## Test User Accounts

Create these accounts before testing. Each maps to a billing state that is hard to reproduce on-the-fly.

| # | Email | Role | Billing State | How to Set Up |
|---|---|---|---|---|
| U1 | `teacher.free@abjad.test` | Teacher | No subscription | Fresh signup, never started trial |
| U2 | `teacher.trial@abjad.test` | Teacher | Active trial (>2 days left) | Start trial via `/billing/plans` |
| U3 | `teacher.trial.urgent@abjad.test` | Teacher | Trial expiring (≤2 days left) | Start trial, then manually set `trialEndsAt` to tomorrow in DB |
| U4 | `teacher.premium.monthly@abjad.test` | Teacher | Active paid — Monthly | Complete checkout with `teacher_premium_monthly` |
| U5 | `teacher.premium.annual@abjad.test` | Teacher | Active paid — Annual | Complete checkout with `teacher_premium_annual` |
| U6 | `teacher.cancelled@abjad.test` | Teacher | Cancelled (still active until period end) | Pay, then cancel |
| U7 | `teacher.expired@abjad.test` | Teacher | Expired | Pay, then set `currentPeriodEnd` to past in DB |
| U8 | `teacher.legacy@abjad.test` | Teacher | Legacy / grandfathered | Set `isLegacy=true` on subscription in DB |
| U9 | `school.free@abjad.test` | School | No subscription | Fresh signup |
| U10 | `school.trial@abjad.test` | School | Active trial | Start trial |
| U11 | `school.monthly@abjad.test` | School | Active paid — Monthly | Complete checkout with `school_monthly` |
| U12 | `school.annual@abjad.test` | School | Active paid — Annual | Complete checkout with `school_annual` |
| U13 | `school.cancelled@abjad.test` | School | Cancelled | Pay, then cancel |
| U14 | `school.bank@abjad.test` | School | Bank transfer pending | Pick Bank Transfer at checkout |
| U15 | `school.pastdue@abjad.test` | School | Past due | Pay, then set `status=past_due` in DB |

---

## Plans Reference

| Plan Code | Audience | Duration | Price (excl. VAT) | Total incl. 15% VAT |
|---|---|---|---|---|
| `teacher_premium_monthly` | Teacher | 1 month | 60 SAR | 69.00 SAR |
| `teacher_premium_6month` | Teacher | 6 months | 300 SAR | 345.00 SAR |
| `teacher_premium_annual` | Teacher | 12 months | 480 SAR | 552.00 SAR |
| `school_monthly` | School | 1 month | 1,300 SAR | 1,495.00 SAR |
| `school_6month` | School | 6 months | 7,300 SAR | 8,395.00 SAR |
| `school_annual` | School | 12 months | 13,000 SAR | 14,950.00 SAR |

---

## Section 1 — Plans Page

### TC-001 Teacher plans page loads
- **User:** U1 (teacher, no subscription)
- **URL:** `/billing/plans`
- **Steps:** Navigate to the page
- **Expected:**
  - 3 plan cards shown: Monthly, 6-month, Annual
  - Prices correct with VAT note
  - "Most popular" highlight on the correct plan
  - "Start free trial" CTA visible

### TC-002 School plans page loads
- **User:** U9 (school, no subscription)
- **URL:** `/school/billing/plans`
- **Steps:** Navigate to the page
- **Expected:**
  - 3 plan cards shown
  - Prices match table above
  - "Start 5-day free trial" option visible

### TC-003 Active subscriber sees current plan highlighted
- **User:** U5 (teacher, annual)
- **URL:** `/billing/plans`
- **Expected:** Current plan card shows "Current plan" badge; clicking it does not go to checkout

---

## Section 2 — Checkout Form

### TC-010 Checkout page loads for teacher
- **User:** U1
- **URL:** `/billing/checkout/teacher_premium_monthly`
- **Expected:**
  - Method picker shows 5 options: Mada, Apple Pay, STC Pay, Visa/Mastercard, Bank Transfer
  - Mada is selected by default
  - Order summary shows Monthly plan, correct SAR amounts, VAT line, total
  - "Back to plans" link works

### TC-011 Checkout page loads for school
- **User:** U9
- **URL:** `/school/billing/checkout/school_annual`
- **Expected:** Same as TC-010 with school plan values

### TC-012 Invalid plan code
- **User:** U1
- **URL:** `/billing/checkout/nonexistent_plan`
- **Expected:** Error state shown ("Plan not found"), Back to plans link visible

### TC-013 Moyasar JS loads before user clicks Continue
- **User:** U1
- **URL:** `/billing/checkout/teacher_premium_monthly`
- **Steps:** Open DevTools Network tab, navigate to page
- **Expected:** `moyasar.js` and `moyasar.css` requests appear on page load (before clicking Continue), not after

---

## Section 3 — Card Payment (Visa / Mastercard)

### TC-020 Successful Visa payment — Teacher Monthly
- **User:** U1
- **Method:** Visa / Mastercard
- **Card:** `4111 1111 1111 1111`, 12/26, 123
- **Steps:**
  1. Go to `/billing/checkout/teacher_premium_monthly`
  2. Select Visa/Mastercard
  3. Click "Continue to payment"
  4. Moyasar card form appears
  5. Fill card details, click Pay SAR 69.00
- **Expected:**
  - Redirected to `/billing/success`
  - Spinner shows "Verifying payment"
  - After webhook/reconcile: "Subscription activated!" screen
  - Header "Start trial" pill disappears
  - Navigate to `/billing` — shows PREMIUM badge, Renews in 30d
  - Invoice INV-XXXX-XXXXX shows as PAID with correct amount

### TC-021 Successful Visa payment — Teacher Annual
- **User:** U1 (or fresh account)
- **Plan:** `teacher_premium_annual`
- **Card:** `4111 1111 1111 1111`
- **Expected:**
  - Total = 552.00 SAR
  - Billing page shows "Renews in 365d"

### TC-022 Successful Mastercard payment — School Monthly
- **User:** U9
- **Plan:** `school_monthly`
- **Card:** `5200 0000 0000 0007`
- **Expected:** Total = 1,495.00 SAR, subscription active

### TC-023 Successful Mastercard payment — School Annual
- **User:** U9 (or fresh)
- **Plan:** `school_annual`
- **Card:** `5200 0000 0000 0007`
- **Expected:** Total = 14,950.00 SAR, subscription active, Renews in 365d

### TC-024 6-month plan checkout — Teacher
- **User:** U1
- **Plan:** `teacher_premium_6month`
- **Expected:** Total = 345.00 SAR, Renews in ~180d

### TC-025 6-month plan checkout — School
- **User:** U9
- **Plan:** `school_6month`
- **Expected:** Total = 8,395.00 SAR

---

## Section 4 — Mada Payment

### TC-030 Successful Mada payment — Teacher
- **User:** U1
- **Method:** Mada
- **Card:** `4464 0400 1000 0010`, 12/26, 123
- **Expected:**
  - Moyasar form shows Mada logo on card field
  - Payment succeeds, subscription activates
  - Invoice shows `mada` as payment method

### TC-031 Successful Mada payment — School Annual
- **User:** U9
- **Method:** Mada
- **Expected:** Total = 14,950.00 SAR, invoice shows `mada`

---

## Section 5 — Payment Failure Scenarios

### TC-040 Declined card
- **User:** U1
- **Card:** `4000 0000 0000 0002`
- **Expected:**
  - Moyasar form shows decline error message
  - User remains on checkout page (NOT redirected to /success)
  - No subscription created

### TC-041 Expired card
- **Card:** `4000 0000 0000 0069`, 01/20
- **Expected:** Moyasar form shows "Card expired" error

### TC-042 Wrong CVV
- **Card:** `4000 0000 0000 0127`, CVV: 999
- **Expected:** Moyasar form shows security code error

### TC-043 User closes tab mid-payment
- **Steps:**
  1. Get to Moyasar card form
  2. Close the tab
  3. Reopen `/billing` in a new tab
- **Expected:** No subscription activated, no orphaned invoice in PAID state

### TC-044 User hits back button mid-payment
- **Steps:**
  1. Get to Moyasar card form
  2. Click browser back
  3. Navigate back to `/billing/checkout/teacher_premium_monthly`
- **Expected:**
  - Checkout form shows method picker again (not a stuck Moyasar form)
  - Fresh initiate call made on next "Continue to payment"

---

## Section 6 — Bank Transfer Flow

### TC-050 Bank transfer — pending page
- **User:** U14 (school.bank)
- **Steps:**
  1. Go to `/school/billing/checkout/school_annual`
  2. Select Bank Transfer
  3. Click "Continue to payment"
- **Expected:**
  - Redirected to `/school/billing/pending/<invoiceId>`
  - Shows Al Rajhi Bank details (IBAN, SWIFT, account name)
  - Invoice number displayed as reference — highlighted in amber
  - Invoice amount = 14,950.00 SAR
  - "Copy" button next to each field copies to clipboard
  - "Download PDF" link present
  - Invoice status on `/school/billing` shows PENDING

### TC-051 Bank transfer — copy buttons work
- **Steps:** Click each "Copy" button on the pending page
- **Expected:** Text copied to clipboard, "Copied" confirmation flash appears

### TC-052 Bank transfer — PDF download
- **Steps:** Click "Download PDF" on pending page
- **Expected:** PDF opens/downloads with invoice details

---

## Section 7 — Success Page Behaviour

### TC-060 Success page polling — fast activation
- **Steps:**
  1. Complete a card payment
  2. Watch the success page
- **Expected:**
  - "Verifying payment…" spinner shown initially
  - Within ~5s, changes to "Subscription activated!" with green checkmark
  - Plan code and invoice reference shown
  - "Go to dashboard" and "Manage subscription" buttons present

### TC-061 Success page — missed webhook (localhost reconcile)
- **Context:** On localhost, Moyasar cannot POST to the webhook endpoint
- **Expected:**
  - Second poll tick (after 1.5s) calls `POST /api/payments/:id/reconcile`
  - Reconcile pulls status from Moyasar directly and activates subscription
  - Total time to activation < 5s on local dev

### TC-062 Success page — 20s timeout fallback
- **Steps:** Disconnect network after payment completes to simulate missed webhook
- **Expected:**
  - After ~20s of failed polls: "Payment is processing" state shown
  - "Go to billing" button visible
  - No error crash

### TC-063 Success page — no payment ID in URL
- **URL:** `/billing/success` (no query params)
- **Expected:** Page renders without crash; polling runs but shows processing state after timeout

---

## Section 8 — Trial Flow

### TC-070 Teacher — no subscription, sees "Start trial" banner on dashboard
- **User:** U1 (teacher, no subscription)
- **URL:** `/dashboard`
- **Expected:** Amber "Upgrade to Premium Teacher" banner at top; "Upgrade now" CTA links to `/billing/plans`

### TC-071 School — no subscription, sees "Start 5-day trial" banner
- **User:** U9 (school, no subscription)
- **URL:** `/school/dashboard`
- **Expected:** "Start your 5-day free trial" banner, "See plans" CTA

### TC-072 Active trial — days remaining shown in banner
- **User:** U2 (teacher, trial with >2 days)
- **Expected:** Amber banner shows e.g. "3 days left in your trial"

### TC-073 Trial urgent (≤2 days) — red banner
- **User:** U3 (teacher, trial ≤2 days)
- **Expected:** Red banner instead of amber, "Last day" or "1 day" copy

### TC-074 School trial — 5-day default
- **User:** U10 (school, trial started)
- **Expected:** Trial banner shows school-specific copy

---

## Section 9 — Header Plan Badge (PlanBadge)

### TC-080 No subscription — "Start trial" badge in header
- **User:** U1
- **Expected:** Amber "Start trial" pill visible in top-right header

### TC-081 Active trial — "Trial · Xd" badge
- **User:** U2
- **Expected:** Amber "Trial · Xd" pill (X = days remaining)

### TC-082 Trial urgent — red badge
- **User:** U3
- **Expected:** Red "Trial · 1d" or "Trial · Last day" pill

### TC-083 Active paid — NO badge
- **User:** U5 (teacher, annual active)
- **Expected:** No pill in header (happy path — subscription stable)

### TC-084 Renewing soon (≤14 days) — "Renews soon · Xd"
- **User:** Any paid user with period end within 14 days (set in DB)
- **Expected:** Amber "Renews soon · Xd" pill

### TC-085 Past due — "Past due" badge
- **User:** U15 (school, past_due status)
- **Expected:** Red "Past due" pill

### TC-086 Cancelled — "Cancelled" badge
- **User:** U6 (teacher, cancelled)
- **Expected:** Grey "Cancelled" pill

### TC-087 Expired — "Expired" badge
- **User:** U7 (teacher, expired)
- **Expected:** Grey "Expired" pill

### TC-088 Legacy — NO badge
- **User:** U8 (teacher, legacy)
- **Expected:** No pill (isLegacy = true, PlanBadge returns null)

### TC-089 Badge updates after checkout (no page reload)
- **User:** U1 (teacher, no subscription)
- **Steps:**
  1. Note "Start trial" badge in header
  2. Complete a successful card payment
  3. Navigate back to `/dashboard`
- **Expected:** "Start trial" badge is gone — replaced by nothing (active, >14d to expiry)

---

## Section 10 — Billing Overview Page

### TC-090 Billing page — active subscription
- **User:** U5 (teacher, annual)
- **URL:** `/billing`
- **Expected:**
  - "PREMIUM" green badge
  - Plan name: "Teacher Premium Annual"
  - "480 SAR / 12 months · excl. 15% VAT"
  - "Renews in 365d" (approximately)
  - "Change plan" and "Cancel Premium" buttons
  - Recent invoices section with at least 1 PAID entry

### TC-091 Billing page — no subscription
- **User:** U1
- **URL:** `/billing`
- **Expected:** No subscription card; shows "No active subscription" or redirect prompt to plans

### TC-092 Billing page — school active
- **User:** U12 (school, annual)
- **URL:** `/school/billing`
- **Expected:** "ACTIVE" badge, "School Annual", 13,000 SAR / 12 months, correct renewal

### TC-093 Refresh button on billing page
- **Steps:** Click the "Refresh" button on `/billing`
- **Expected:** Page re-fetches subscription and invoice data, shows updated state

### TC-094 Invoice list — PAID and PENDING states visible
- **User:** U14 (school.bank — has a PENDING bank invoice + previous PAID ones)
- **Expected:** Separate PAID badge (green) and PENDING badge (amber/orange) for different invoices

### TC-095 Invoice PDF download
- **Steps:** Click the download icon on any invoice row
- **Expected:** PDF receipt opens with Abjad branding, invoice number, SAR amount, VAT breakdown, Hijri date

---

## Section 11 — Cancel Subscription

### TC-100 Cancel subscription flow — teacher
- **User:** U4 (teacher, monthly active)
- **Steps:**
  1. Go to `/billing`
  2. Click "Cancel Premium"
  3. Confirm cancellation
- **Expected:**
  - Status shows "Cancelled" badge
  - Plan remains active until period end (cancelAtPeriodEnd = true)
  - Header shows grey "Cancelled" pill
  - Trial banner on dashboard shows "Your subscription has ended" with "Re-subscribe" CTA

### TC-101 Cancel subscription — school
- **User:** U11 (school, monthly active)
- **Steps:** Same as TC-100 via `/school/billing`
- **Expected:** Same behaviour for school

### TC-102 Re-subscribe after cancellation
- **User:** U6 (teacher, cancelled)
- **Steps:**
  1. Click "Re-subscribe" or go to `/billing/plans`
  2. Pick a plan and complete payment
- **Expected:** Subscription reactivated, new period starts, Cancelled badge disappears

---

## Section 12 — Plan Change / Upgrade

### TC-110 Upgrade from Monthly to Annual — teacher
- **User:** U4 (teacher, monthly active)
- **Steps:**
  1. Click "Change plan" on `/billing`
  2. Select Annual plan
  3. Complete payment
- **Expected:**
  - New invoice created for Annual
  - Subscription updates to annual period
  - Old monthly plan superseded

### TC-111 Downgrade from Annual to Monthly — school
- **User:** U12 (school, annual)
- **Steps:** Change plan → Monthly
- **Expected:** Subscription moves to monthly on next renewal (or immediately depending on backend logic)

---

## Section 13 — Paywall Modal

### TC-120 School paywall triggers on gated action
- **User:** U9 (school, no subscription)
- **Steps:** Attempt to post a job (or view candidates beyond trial limit)
- **Expected:**
  - PaywallModal appears with lock icon
  - Title: "Upgrade to continue"
  - Bullet list of plan benefits
  - "See plans" CTA links to `/school/billing/plans`
  - Clicking outside the modal closes it

### TC-121 Paywall does NOT appear for paid user
- **User:** U12 (school, active paid)
- **Steps:** Perform the same gated action
- **Expected:** Action proceeds without modal

---

## Section 14 — Localisation (Arabic)

### TC-130 Checkout in Arabic
- **Steps:**
  1. Switch language to Arabic
  2. Navigate to `/billing/checkout/teacher_premium_monthly`
- **Expected:**
  - All text in Arabic
  - Layout is RTL
  - Currency shows SAR correctly
  - Payment method labels in Arabic (مدى, آبل باي, etc.)

### TC-131 Success page in Arabic
- **Steps:** Complete a payment in Arabic mode
- **Expected:** "تم تفعيل اشتراكك!" success heading, RTL layout

### TC-132 Bank pending page in Arabic
- **Steps:** Select Bank Transfer in Arabic mode
- **Expected:** Bank details page in Arabic, IBAN/SWIFT labels translated

---

## Section 15 — Edge Cases & Regression

### TC-140 Double-click "Continue to payment" button
- **Steps:** Click "Continue to payment" rapidly twice
- **Expected:** Only one initiate API call is made (button disabled during submission)

### TC-141 Navigate away mid-Moyasar form, come back
- **Steps:**
  1. Reach Moyasar card form
  2. Navigate to `/billing`, then back to checkout
- **Expected:** Method picker shown again (fresh checkout), not a stuck/frozen Moyasar form

### TC-142 Moyasar script loads after user clicks Continue
- **Steps:** Throttle network to Slow 3G in DevTools, click Continue immediately
- **Expected:** Loading spinner shown until script loads, then form appears — never stuck permanently

### TC-143 Two tabs — same user, simultaneous checkout
- **Steps:**
  1. Open two browser tabs, both on checkout for same plan
  2. Submit payment in Tab 1
  3. Submit payment in Tab 2 (within seconds)
- **Expected:** Only one subscription created; second payment either fails gracefully or creates a second invoice handled by backend idempotency

### TC-144 Authenticated user visits /login directly
- **User:** U5 (logged in)
- **URL:** `/login`
- **Expected:** Redirected to `/dashboard` (not stuck on login page)

### TC-145 Authenticated school visits /login
- **User:** U12 (logged in as school)
- **URL:** `/login`
- **Expected:** Redirected to `/school/dashboard`

### TC-146 Expired session during checkout
- **Steps:**
  1. Start checkout flow
  2. Let access token expire (wait 15min or clear the token in-memory)
  3. Click "Continue to payment"
- **Expected:** Silent token refresh happens, checkout proceeds; OR user redirected to login with `?next=` param

### TC-147 Invoice number format
- **Expected:** All invoices follow `INV-YYYY-NNNNN` format (e.g. `INV-2026-00025`)

### TC-148 Hijri date on invoice
- **Steps:** Open any invoice PDF
- **Expected:** Hijri date shown alongside Gregorian date

---

## Test Execution Checklist

Before signing off, confirm:

- [ ] All TC-02x (card payments) pass for both Teacher and School
- [ ] TC-030 and TC-031 (Mada) pass
- [ ] TC-04x (failure scenarios) show correct error messages — no silent failures
- [ ] TC-050 (bank transfer) landing page renders with all copy fields
- [ ] TC-060 (success page polling) activates subscription within 10s on local
- [ ] TC-089 (badge updates without reload) confirmed working
- [ ] TC-100 (cancel) and TC-102 (re-subscribe) work end-to-end
- [ ] TC-130–132 (Arabic) renders RTL with no layout breaks
- [ ] TC-140 (double-click guard) — no duplicate API calls
- [ ] TC-144–145 (login redirect) — no loop

---

## Known Limitations (Not Blocking)

| Item | Notes |
|---|---|
| Apple Pay / STC Pay | Cannot be simulated in desktop browser sandbox. Test on a real device with Moyasar live keys. |
| IBAN placeholder | `SA00 0000 0000 0000 0000 0000` is a placeholder — replace with real Abjad bank IBAN before launch. |
| Webhook on localhost | Moyasar cannot POST to localhost; reconcile endpoint compensates. Confirm webhook works on staging server. |
| ZATCA e-invoice | PDF receipts are ZATCA-ready structurally; full ZATCA certification is a post-launch step. |
| Auto-renewal | Renewal cron is not yet wired in production. Manual re-subscription is the current path. |
