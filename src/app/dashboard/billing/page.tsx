import { BillingPanel } from "@/components/ui/BillingPanel";
import Heading from "@/components/ui/Heading";
import Paragraph from "@/components/ui/Paragraph";
import { authOptions } from "@/lib/auth";
import { getCurrentUser } from "@/lib/session";
import { stripe } from "@/lib/stripe";
import { getUserSubscriptionPlan } from "@/lib/subscription";
import { Metadata } from "next";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Billing",
  description: "Open source",
};

export default async function BillingPage() {
  const currentUser = await getCurrentUser()

  if (!currentUser) {
    redirect("/login");
  }

  const subscriptionPlan = await getUserSubscriptionPlan(currentUser.id);

  /*
  let isCanceled = false;
  if (subscriptionPlan.onPro && subscriptionPlan.stripeSubscriptionId) {
    const stripePlan = await stripe.subscriptions.retrieve(
      subscriptionPlan.stripeSubscriptionId
    );
    isCanceled = stripePlan.cancel_at_period_end;
  }
  */
  let isCanceled = false;
  if (subscriptionPlan.onPro && subscriptionPlan.stripeSubscriptionId) {
    if (typeof subscriptionPlan.stripeSubscriptionId === 'string') {
      const stripePlan = await stripe.subscriptions.retrieve(
        subscriptionPlan.stripeSubscriptionId
      );
      isCanceled = stripePlan.cancel_at_period_end;
    } else {
      console.log('stripeSubscriptionId is not a string');
    }
  }

  return (
    <div style={{marginTop: "30px"}} className="container max-w-7xl mx-auto w-full">
      <Heading style={{textAlign: "left"}}>Billing</Heading>
      <Paragraph style={{textAlign: "left"}}>Manage billing and your subscription plan.</Paragraph>
      <BillingPanel
        subscriptionPlan={{
          ...subscriptionPlan,
          isCanceled,
        }}
      />
    </div>
  );
}
