# Abjad Billing — QA Test Plan

> [!INFO] Document Info
> **Version:** 1.0 · **Date:** 2026-06-23
> **Environment:** Local / Staging (Moyasar Test Mode)
> **Scope:** All payment flows, subscription states, and UI surfaces

---

## 💳 Test Card Credentials

> [!NOTE] Moyasar Sandbox Cards
> Use these on the Moyasar card form. **Name on card:** anything (e.g. `Test User`).
> Apple Pay and STC Pay cannot be tested in a desktop browser — mark as N/A.

| Network | Card Number | Expiry | CVV | Result |
|---|---|---|---|---|
| Visa | `4111 1111 1111 1111` | 12/26 | 123 | ✅ Success |
| Mastercard | `5200 0000 0000 0007` | 12/26 | 123 | ✅ Success |
| Mada | `4464 0400 1000 0010` | 12/26 | 123 | ✅ Success |
| Visa — Declined | `4000 0000 0000 0002` | 12/26 | 123 | ❌ Declined |
| Visa — Expired | `4000 0000 0000 0069` | 12/26 | 123 | ❌ Expired |
| Visa — Bad CVV | `4000 0000 0000 0127` | 12/26 | 999 | ❌ Wrong CVV |

---

## 🔐 OTP for Test Accounts

> [!WARNING] How to get the OTP
> These are fake email addresses — no inbox exists. The OTP is printed to the **backend terminal** every time a code is sent.
> Look for this in the server logs:
> ```
> 📧 [DEV] OTP Email
>    To:   teacher.free@abjad.test
>    Code: 847291
> ```
> Share terminal access with testers, or replace `.abjad.test` with a real inbox.

---

## 👤 Test User Accounts

> [!TIP] Setup
> Create all users before the test session. Each email maps to a specific billing state.

### Teacher Accounts

| ID | Email | Billing State | Setup |
|---|---|---|---|
| U1 | `teacher.free@abjad.test` | No subscription | Fresh signup |
| U2 | `teacher.trial@abjad.test` | Active trial (>2 days) | Start trial via `/billing/plans` |
| U3 | `teacher.trial.urgent@abjad.test` | Trial ≤ 2 days left | Start trial → set `trialEndsAt` to tomorrow in DB |
| U4 | `teacher.monthly@abjad.test` | Active — Monthly | Checkout `teacher_premium_monthly` |
| U5 | `teacher.annual@abjad.test` | Active — Annual | Checkout `teacher_premium_annual` |
| U6 | `teacher.cancelled@abjad.test` | Cancelled (still in period) | Pay → cancel |
| U7 | `teacher.expired@abjad.test` | Expired | Pay → set `currentPeriodEnd` to past in DB |
| U8 | `teacher.legacy@abjad.test` | Legacy / grandfathered | Set `isLegacy=true` in DB |

### School Accounts

| ID | Email | Billing State | Setup |
|---|---|---|---|
| U9 | `school.free@abjad.test` | No subscription | Fresh signup |
| U10 | `school.trial@abjad.test` | Active trial | Start trial |
| U11 | `school.monthly@abjad.test` | Active — Monthly | Checkout `school_monthly` |
| U12 | `school.annual@abjad.test` | Active — Annual | Checkout `school_annual` |
| U13 | `school.cancelled@abjad.test` | Cancelled | Pay → cancel |
| U14 | `school.bank@abjad.test` | Bank transfer pending | Choose Bank Transfer at checkout |
| U15 | `school.pastdue@abjad.test` | Past due | Pay → set `status=past_due` in DB |

---

## 📦 Plans Reference

| Plan Code | Audience | Duration | Price (excl. VAT) | Total incl. 15% VAT |
|---|---|---|---|---|
| `teacher_premium_monthly` | Teacher | 1 month | 60 SAR | **69.00 SAR** |
| `teacher_premium_6month` | Teacher | 6 months | 300 SAR | **345.00 SAR** |
| `teacher_premium_annual` | Teacher | 12 months | 480 SAR | **552.00 SAR** |
| `school_monthly` | School | 1 month | 1,300 SAR | **1,495.00 SAR** |
| `school_6month` | School | 6 months | 7,300 SAR | **8,395.00 SAR** |
| `school_annual` | School | 12 months | 13,000 SAR | **14,950.00 SAR** |

---

## 🧪 Test Cases

### Section 1 — Plans Page

---

**TC-001 — Teacher plans page loads**
- **User:** U1 · **URL:** `/billing/plans`
- [x] 3 plan cards visible: Monthly / 6-month / Annual
- [x] Prices match the table above (incl. VAT note)
- [x] "Most popular" highlight on correct plan
- [x] CTA links to `/billing/checkout/<planCode>`
- [x] Feature list visible (fallback bullets added 2026-06-23)

---

**TC-002 — School plans page loads**
- **User:** U9 · **URL:** `/school/billing/plans`
- [ ] 3 plan cards visible with correct SAR amounts
- [ ] "Start 5-day free trial" option shown

---

**TC-003 — Active subscriber sees current plan highlighted**
- **User:** U5 · **URL:** `/billing/plans`
- [ ] Current plan shows "Current plan" badge
- [ ] No checkout redirect on clicking it

---

### Section 2 — Checkout Form

---

**TC-010 — Checkout loads for teacher**
- **User:** U1 · **URL:** `/billing/checkout/teacher_premium_monthly`
- [ ] 5 methods shown: Mada, Apple Pay, STC Pay, Visa/Mastercard, Bank Transfer
- [ ] Mada selected by default
- [ ] Order summary shows correct amounts and VAT line
- [ ] "Back to plans" link works

---

**TC-011 — Checkout loads for school**
- **User:** U9 · **URL:** `/school/billing/checkout/school_annual`
- [ ] Same as TC-010 with school plan values (14,950.00 SAR total)

---

**TC-012 — Invalid plan code shows error**
- **User:** U1 · **URL:** `/billing/checkout/nonexistent_plan`
- [ ] Error state shown ("Plan not found")
- [ ] "Back to plans" link visible — no crash

---

**TC-013 — Moyasar JS loads before user clicks Continue**
- **User:** U1 · **URL:** `/billing/checkout/teacher_premium_monthly`
- [ ] Open DevTools → Network tab
- [ ] `moyasar.js` and `moyasar.css` requests appear on page load
- [ ] Both requests fire **before** clicking Continue

---

### Section 3 — Card Payments (Visa / Mastercard)

---

**TC-020 — Successful Visa — Teacher Monthly**
- **User:** U1 · **Method:** Visa/Mastercard · **Card:** `4111 1111 1111 1111`
- [ ] Moyasar form appears after clicking Continue
- [ ] Pay button shows **SAR 69.00**
- [ ] Redirected to `/billing/success` after paying
- [ ] "Subscription activated!" screen shown
- [ ] Header "Start trial" pill disappears
- [ ] `/billing` shows PREMIUM badge + Renews in ~30d
- [ ] Invoice shows PAID · 69.00 SAR

---

**TC-021 — Successful Visa — Teacher Annual**
- **User:** U1 (fresh) · **Card:** `4111 1111 1111 1111` · **Plan:** `teacher_premium_annual`
- [ ] Pay button shows **SAR 552.00**
- [ ] Billing page shows Renews in **365d**

---

**TC-022 — Successful Mastercard — School Monthly**
- **User:** U9 · **Card:** `5200 0000 0000 0007` · **Plan:** `school_monthly`
- [ ] Pay button shows **SAR 1,495.00**
- [ ] Subscription active after payment

---

**TC-023 — Successful Mastercard — School Annual**
- **User:** U9 (fresh) · **Card:** `5200 0000 0000 0007` · **Plan:** `school_annual`
- [ ] Pay button shows **SAR 14,950.00**
- [ ] Renews in **365d**

---

**TC-024 — Teacher 6-month plan**
- **User:** U1 · **Plan:** `teacher_premium_6month`
- [ ] Total = **345.00 SAR**
- [ ] Renews in ~180d

---

**TC-025 — School 6-month plan**
- **User:** U9 · **Plan:** `school_6month`
- [ ] Total = **8,395.00 SAR**

---

### Section 4 — Mada Payments

---

**TC-030 — Successful Mada — Teacher**
- **User:** U1 · **Method:** Mada · **Card:** `4464 0400 1000 0010`
- [ ] Moyasar form shows **Mada logo** on card number field
- [ ] Payment succeeds, subscription activates
- [ ] Invoice shows payment method as `mada`

---

**TC-031 — Successful Mada — School Annual**
- **User:** U9 · **Method:** Mada
- [ ] Total = **14,950.00 SAR**
- [ ] Invoice shows `mada` as payment method

---

### Section 5 — Payment Failure Scenarios

---

**TC-040 — Declined card**
- **Card:** `4000 0000 0000 0002` · **Expiry:** 12/26 · **CVV:** 123
- [ ] Moyasar form shows a decline error message
- [ ] User stays on checkout page — NOT redirected to /success
- [ ] No subscription is created

---

**TC-041 — Expired card**
- **Card:** `4000 0000 0000 0069` · **Expiry:** 01/20
- [ ] Moyasar form shows "Card expired" error

---

**TC-042 — Wrong CVV**
- **Card:** `4000 0000 0000 0127` · **CVV:** 999
- [ ] Moyasar form shows security code error

---

**TC-043 — User closes tab mid-payment**
- [ ] Close tab after reaching Moyasar form (before paying)
- [ ] Reopen `/billing` — no subscription activated
- [ ] No invoice stuck in PAID state

---

**TC-044 — User hits back button mid-payment**
- [ ] Click browser back from the Moyasar form
- [ ] Navigate back to the checkout URL
- [ ] Method picker shown again (fresh state, not a stuck form)
- [ ] Fresh "Continue to payment" works normally

---

### Section 6 — Bank Transfer Flow

---

**TC-050 — Bank transfer pending page**
- **User:** U14 · **Method:** Bank Transfer · **Plan:** `school_annual`
- [ ] Redirected to `/school/billing/pending/<invoiceId>` after clicking Continue
- [ ] Al Rajhi Bank details displayed (IBAN, SWIFT, account name)
- [ ] Invoice number shown as reference — highlighted in amber
- [ ] Transfer amount = **14,950.00 SAR**
- [ ] Invoice status on `/school/billing` shows **PENDING**

---

**TC-051 — Copy buttons on pending page**
- [ ] Click each "Copy" button (Bank, Account name, IBAN, SWIFT, Reference, Amount)
- [ ] Clipboard receives the correct value
- [ ] "Copied ✓" flash appears briefly

---

**TC-052 — PDF download on pending page**
- [ ] Click "Download PDF"
- [ ] PDF opens/downloads with invoice details and correct amounts

---

### Section 7 — Success Page Behaviour

---

**TC-060 — Fast activation (webhook received)**
- [ ] After payment, success page shows "Verifying payment…" spinner
- [ ] Within ~5 seconds: changes to "Subscription activated!" with green checkmark
- [ ] Plan code and invoice reference visible
- [ ] "Go to dashboard" and "Manage subscription" buttons work

---

**TC-061 — Missed webhook fallback (localhost)**
- **Context:** Moyasar cannot POST to localhost — reconcile endpoint compensates
- [ ] 2nd poll tick (after ~1.5s) calls `POST /api/payments/:id/reconcile`
- [ ] Subscription activates within **5 seconds** on local dev

---

**TC-062 — 20-second timeout fallback**
- [ ] Block network after payment to simulate missed webhook
- [ ] After ~20s: "Payment is processing" screen shown (not an error crash)
- [ ] "Go to billing" button visible

---

**TC-063 — Success page with no query params**
- **URL:** `/billing/success` (no ?paymentId or ?invoiceId)
- [ ] Page renders without crash
- [ ] Shows processing state after timeout

---

### Section 8 — Trial Flow

---

**TC-070 — Teacher with no subscription sees upgrade banner**
- **User:** U1 · **URL:** `/dashboard`
- [x] Amber "Upgrade to Premium Teacher" banner at top
- [x] "Upgrade now" CTA links to `/billing/plans`

---

**TC-071 — School with no subscription sees trial banner**
- **User:** U9 · **URL:** `/school/dashboard`
- [ ] "Start your 5-day free trial" banner shown
- [ ] "See plans" CTA present

---

**TC-072 — Active trial shows days remaining**
- **User:** U2 (teacher, trial > 2 days)
- [ ] Amber banner: "X days left in your trial"

---

**TC-073 — Trial urgent (≤2 days) shows red banner**
- **User:** U3 (trial ≤ 2 days)
- [ ] **Red** banner instead of amber
- [ ] "Last day" or "1 day" copy

---

**TC-074 — School 5-day trial banner**
- **User:** U10
- [ ] School-specific trial copy shown

---

### Section 9 — Header Plan Badge

---

**TC-080 — No subscription → "Start trial" amber pill**
- **User:** U1
- [x] Amber "🌟 Start trial" pill in top-right header

---

**TC-081 — Active trial → "Trial · Xd" pill**
- **User:** U2
- [ ] Amber "Trial · Xd" pill (X = days remaining)

---

**TC-082 — Trial urgent → red pill**
- **User:** U3
- [ ] Red "Trial · 1d" or "Trial · Last day" pill

---

**TC-083 — Active paid → NO pill shown**
- **User:** U5 (annual, active)
- [ ] **No pill** in header (happy path — subscription is healthy)

---

**TC-084 — Renewing within 14 days → "Renews soon · Xd"**
- Set `currentPeriodEnd` to 10 days from now in DB
- [ ] Amber "Renews soon · 10d" pill

---

**TC-085 — Past due → red "Past due" pill**
- **User:** U15
- [ ] Red "Past due" pill

---

**TC-086 — Cancelled → grey "Cancelled" pill**
- **User:** U6
- [ ] Grey "Cancelled" pill

---

**TC-087 — Expired → grey "Expired" pill**
- **User:** U7
- [ ] Grey "Expired" pill

---

**TC-088 — Legacy → NO pill shown**
- **User:** U8 (`isLegacy=true`)
- [ ] No pill (grandfathered users are silently excluded)

---

**TC-089 — Badge updates after checkout (no page reload)**
- **User:** U1 → complete payment → navigate to `/dashboard`
- [ ] "Start trial" pill is gone after navigation
- [ ] No full page reload required

---

### Section 10 — Billing Overview Page

---

**TC-090 — Active subscription card — teacher**
- **User:** U5 · **URL:** `/billing`
- [ ] "PREMIUM" green badge
- [ ] Plan name: **Teacher Premium Annual**
- [ ] "480 SAR / 12 months · excl. 15% VAT"
- [ ] "Renews in 365d"
- [ ] "Change plan" and "Cancel Premium" buttons present
- [ ] At least 1 invoice row showing PAID

---

**TC-091 — No subscription — billing page**
- **User:** U1 · **URL:** `/billing`
- [ ] No active plan card
- [ ] Prompt or link to plans page shown

---

**TC-092 — School active subscription card**
- **User:** U12 · **URL:** `/school/billing`
- [ ] "ACTIVE" badge · "School Annual" · 13,000 SAR / 12 months

---

**TC-093 — Refresh button re-fetches data**
- [ ] Click "Refresh" on `/billing`
- [ ] Page fetches fresh subscription and invoices — no full reload

---

**TC-094 — Invoice list shows PAID and PENDING states**
- **User:** U14 (has PENDING bank invoice + prior PAID ones)
- [ ] PAID = green badge · PENDING = amber badge
- [ ] Both visible in the same list

---

**TC-095 — Invoice PDF download**
- [ ] Click download icon on any invoice row
- [ ] PDF opens with Abjad branding, invoice number, SAR amount, VAT breakdown, Hijri date

---

### Section 11 — Cancel Subscription

---

**TC-100 — Cancel subscription — teacher**
- **User:** U4 (teacher monthly active) · **URL:** `/billing`
- [ ] Click "Cancel Premium" → confirm
- [ ] Status shows "Cancelled" badge
- [ ] Plan stays active until period end (`cancelAtPeriodEnd = true`)
- [ ] Header shows grey "Cancelled" pill
- [ ] Dashboard banner shows "Re-subscribe" CTA

---

**TC-101 — Cancel subscription — school**
- **User:** U11 · **URL:** `/school/billing`
- [ ] Same behaviour as TC-100

---

**TC-102 — Re-subscribe after cancellation**
- **User:** U6 (cancelled teacher) → go to `/billing/plans` → pick a plan
- [ ] Checkout completes, subscription reactivates
- [ ] "Cancelled" badge disappears
- [ ] New period starts

---

### Section 12 — Plan Change / Upgrade

---

**TC-110 — Upgrade from Monthly to Annual — teacher**
- **User:** U4 · **URL:** `/billing` → "Change plan" → Annual
- [ ] New invoice created for Annual (552.00 SAR)
- [ ] Subscription updates to annual period

---

**TC-111 — Downgrade Annual to Monthly — school**
- **User:** U12 → "Change plan" → Monthly
- [ ] Subscription moves to monthly on next renewal

---

### Section 13 — Paywall Modal

---

**TC-120 — Paywall triggers for non-subscriber**
- **User:** U9 (school, no subscription) → attempt a gated action (e.g. post a job)
- [ ] PaywallModal appears with lock icon
- [ ] Title: "Upgrade to continue"
- [ ] Bullet list of plan benefits shown
- [ ] "See plans" CTA links to `/school/billing/plans`
- [ ] Clicking outside the modal closes it

---

**TC-121 — Paywall does NOT appear for paid user**
- **User:** U12 (school, active paid) → same gated action
- [ ] Action proceeds without modal

---

### Section 14 — Arabic / RTL

---

**TC-130 — Checkout page in Arabic**
- [ ] Switch language to Arabic → navigate to `/billing/checkout/teacher_premium_monthly`
- [ ] All text in Arabic, layout is RTL
- [ ] Payment method labels in Arabic (مدى، آبل باي، فيزا / ماستركارد…)
- [ ] Currency and amounts display correctly

---

**TC-131 — Success page in Arabic**
- [ ] Complete a payment in Arabic mode
- [ ] "تم تفعيل اشتراكك!" heading shown, RTL layout

---

**TC-132 — Bank pending page in Arabic**
- [ ] Select Bank Transfer in Arabic mode
- [ ] Bank details page in Arabic, no broken layout

---

### Section 15 — Edge Cases

---

**TC-140 — Double-click "Continue to payment" button**
- [ ] Click the button rapidly twice
- [ ] Only **one** initiate API call is made (button disables during submission)

---

**TC-141 — Navigate away mid-Moyasar form then return**
- [ ] Reach the Moyasar card form → navigate to `/billing` → go back to checkout URL
- [ ] Method picker shown again (fresh state)
- [ ] A new "Continue to payment" works correctly

---

**TC-142 — Moyasar script loads after user clicks Continue**
- [ ] Throttle to Slow 3G in DevTools → click Continue immediately
- [ ] Loading spinner shown while script loads
- [ ] Form appears once script is ready — never permanently stuck

---

**TC-143 — Two tabs, simultaneous checkout (same user)**
- [ ] Open two tabs on checkout for the same plan
- [ ] Submit payment in Tab 1, then Tab 2 within seconds
- [ ] Only one subscription created — second payment handled gracefully

---

**TC-144 — Authenticated teacher visits /login**
- **User:** U5 (logged in)
- [ ] Navigating to `/login` redirects to `/dashboard` immediately

---

**TC-145 — Authenticated school visits /login**
- **User:** U12 (logged in as school)
- [ ] Navigating to `/login` redirects to `/school/dashboard`

---

**TC-146 — Expired session during checkout**
- [ ] Start checkout → wait for access token to expire (15 min) → click Continue
- [ ] Silent token refresh happens, checkout proceeds OR user sent to `/login?next=…`

---

**TC-147 — Invoice number format**
- [ ] All invoices follow `INV-YYYY-NNNNN` format (e.g. `INV-2026-00025`)

---

**TC-148 — Hijri date on invoice PDF**
- [ ] Open any invoice PDF → Hijri date shown alongside Gregorian date

---

## ✅ Sign-off Checklist

Before marking QA complete, confirm every item below is checked:

- [ ] **TC-020 to TC-025** — All card payment combinations pass
- [ ] **TC-030, TC-031** — Mada payments pass for teacher and school
- [ ] **TC-040 to TC-042** — Failure cards show correct error messages (no silent failures)
- [ ] **TC-050 to TC-052** — Bank transfer pending page renders fully, copy works, PDF downloads
- [ ] **TC-060** — Success page activates subscription within 10s on local
- [ ] **TC-089** — Plan badge updates after checkout without a page reload
- [ ] **TC-100, TC-102** — Cancel and re-subscribe work end-to-end
- [ ] **TC-110** — Plan upgrade creates new invoice and updates subscription
- [ ] **TC-120** — Paywall modal appears and closes correctly
- [ ] **TC-130 to TC-132** — Arabic mode renders RTL with no layout breaks
- [ ] **TC-140** — Double-click guard prevents duplicate API calls
- [ ] **TC-144, TC-145** — Authenticated users are redirected away from /login

---

## ⚠️ Known Limitations

| Item | Notes |
|---|---|
| Apple Pay / STC Pay | Cannot simulate in desktop browser. Test on a real device with live keys. |
| IBAN placeholder | `SA00 0000 0000 0000 0000 0000` is a placeholder — replace before launch. |
| Moyasar webhook on localhost | Cannot reach localhost; reconcile endpoint compensates. Verify webhook on staging. |
| Auto-renewal | Renewal cron not wired in production yet. Manual re-subscription is current path. |
| ZATCA full certification | Invoices are structurally compliant; full ZATCA certification is post-launch. |
