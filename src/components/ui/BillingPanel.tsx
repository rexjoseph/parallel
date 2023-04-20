"use client"

import { cn } from "@/lib/utils"
import { UserSubscriptionPlan } from "@/types"
import * as React from "react"
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

  async function handleSubmit(event) {
    event.preventDefault()
    setIsFetching(!isFetching)

    // access stripe session URL
    const res = await fetch("/api/users/stripe");

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
      
    </form>
  )
}