import { User } from "@prisma/client"

export type WebConfig = {
  title: string
  description: string
  url: string
  ogImage: string
  links: {
    twitter: string
    github: string
  }
}

export type SubscriptionPlan = {
  name: string
  description: string
  stripePriceId: string
}

export type UserSubscriptionPlan = SubscriptionPlan &
Pick<User, "stripeCustomerId" | "stripeSubscriptionId"> & {
  stripeCurrentPeriodEnd: number
  isPro: boolean
}