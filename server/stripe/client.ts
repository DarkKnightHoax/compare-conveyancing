import Stripe from "stripe";
import { ENV } from "../_core/env";

if (!ENV.stripeSecretKey) {
  console.warn("[Stripe] STRIPE_SECRET_KEY is not set — payment features will be disabled.");
}

export const stripe = new Stripe(ENV.stripeSecretKey || "sk_test_placeholder", {
  apiVersion: "2026-02-25.clover",
});
