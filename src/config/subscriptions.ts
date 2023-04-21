import { SubscriptionPlan } from "@/types"

export const freePlan: SubscriptionPlan = {
  name: "Free",
  description: "The free plan is limited to 10 requests per hour. Upgrade to the PRO plan for a higher limit.",
  stripePriceId: ""
}

export const proPlan: SubscriptionPlan = {
  name: "PRO",
  description: "The PRO plan has 50 requests per hour.",
  stripePriceId: process.env.STRIPE_PRO_MONTHLY_PLAN || ""
}