"use client"

import { cn, formatDate } from "@/lib/utils"
import { UserSubscriptionPlan } from "@/types"
import * as React from "react"
import { buttonVariants } from "./Button"
import { Card } from "./Card"
import { toast } from "./Toast"

interface BillingPanelProps extends React.HTMLAttributes<HTMLFormElement> {
  subscriptionPlan: UserSubscriptionPlan & {
    isCanceled: boolean
  }
}

export function BillingPanel({
  subscriptionPlan,
  className,
  ...props
}: BillingPanelProps) {
  const [isFetching, setIsFetching] = React.useState<boolean>(false)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsFetching(!isFetching)

    // access stripe session URL
    const res = await fetch("/api/users/stripe");
    console.log(res)

    if (!res?.ok) {
      return toast({
        title: "Something went wrong.",
        message: "Please refresh the page and try again.",
        type: "error",
      })
    }

    // let's redirect to stripe session
    const session = await res.json()
    if (session) {
      window.location.href = session.url
    }
  }

  return (
    <form className={cn(className)} onSubmit={handleSubmit} {...props}>
      <Card>
        <Card.Header>
          <Card.Title>Plan</Card.Title>
          <Card.Description>
            You are currently on the <strong>{subscriptionPlan.name}</strong>{" "}
            plan.
          </Card.Description>
        </Card.Header>
        <Card.Content>{subscriptionPlan.description}</Card.Content>
        <Card.Footer className="flex flex-col items-start space-y-2 md:flex-row md:justify-between md:space-x-0">
          <button
            type="submit"
            className={cn(buttonVariants())}
            disabled={isFetching}
          >
            {isFetching && (
              <div className="mr-2 h-4 w-4 animate-spin">...</div>
            )}
            {subscriptionPlan.onPro ? "Manage Subscription" : "Upgrade to PRO"}
          </button>
          {subscriptionPlan.onPro ? (
            <p className="rounded-full text-xs font-medium">
              {subscriptionPlan.isCanceled
                ? "Your plan will be canceled on "
                : "Your plan renews on "}
              {formatDate(subscriptionPlan.stripeCurrentPeriodEnd)}.
            </p>
          ) : null}
        </Card.Footer>
      </Card>
    </form>
  )
}