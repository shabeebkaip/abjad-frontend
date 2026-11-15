// Bank transfer is hidden until operations supplies real bank details
// (QA_FIX_PLAN D14-b). Flip to true to re-enable checkout option, pricing
// mark and bank details on the pending-invoice view.
export const BANK_TRANSFER_ENABLED = false;

// Client feedback R1 §8.2–8.3: hide all pricing, plans, trials and payment UI
// until the business is ready to charge. Billing code stays dormant; flip to
// true (together with BILLING_ENFORCED in abjad-backend) to bring it back.
export const BILLING_UI_ENABLED = false;
