/**
 * Stripe product definitions for Compare the Conveyancing Market.
 * The "initial payment on account" is a dynamic amount set at checkout time
 * based on the quote (search packs + AML fees + £100 file opening fee).
 * We use a custom price (price_data) rather than a fixed Stripe Price ID so
 * the amount can vary per quote.
 */

export const STRIPE_PRODUCT = {
  /** Display name shown on the Stripe Checkout page */
  name: "Initial Payment on Account",
  /** Description shown on the Stripe Checkout page */
  description:
    "Covers your search pack fees, Anti-Money Laundering checks, and file opening fee. Paid directly to your chosen conveyancer.",
  /** Currency — always GBP for UK conveyancing */
  currency: "gbp",
} as const;
