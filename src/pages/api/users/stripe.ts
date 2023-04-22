import { proPlan } from "@/config/subscriptions";
import { withMethods } from "@/lib/api-middlewares/with-method";
import { authOptions } from "@/lib/auth";
import { stripe } from "@/lib/stripe";
import { getUserSubscriptionPlan } from "@/lib/subscription";
import { absoluteUrl } from "@/lib/utils";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";

const billUrl = absoluteUrl("/dashboard/billing")

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    try {
      const session = await getServerSession(req, res, authOptions)
      const user = session?.user
      // console.log("user", user)

      if (!user || !user.email) {
        throw new Error("User not found.")
      }

      /*
      const subscriptionPlan = await getUserSubscriptionPlan(user.id)
      if (subscriptionPlan.onPro && subscriptionPlan.stripeCustomerId) {
        const stripeSession = await stripe.billingPortal.sessions.create({
          customer: subscriptionPlan.stripeCustomerId,
          return_url: billUrl
        })

        return res.json({ url: stripeSession.url })
      }
      */

      const subscriptionPlan = await getUserSubscriptionPlan(user.id)
      console.log("subscriptionPlan", subscriptionPlan)
      if (subscriptionPlan.onPro && subscriptionPlan.stripeCustomerId) {
        if (typeof subscriptionPlan.stripeCustomerId === 'string') {
          const stripeSession = await stripe.billingPortal.sessions.create({
            customer: subscriptionPlan.stripeCustomerId,
            return_url: billUrl
          })

          return res.json({ url: stripeSession.url })
        } else {
          console.log('stripeCustomerId is not a string');
        }
      }

      const stripeSession = await stripe.checkout.sessions.create({
        success_url: billUrl,
        cancel_url: billUrl,
        payment_method_types: ["card"],
        mode: "subscription",
        billing_address_collection: "auto",
        customer_email: user.email,
        line_items: [
          {
            price: proPlan.stripePriceId,
            quantity: 1
          }
        ],
        metadata: {
          userId: user.id
        }
      })
      console.log(stripeSession)
      return res.json({ url: stripeSession.url })
    } catch (error) {
      return res.status(500).end()
    }
  }
}

export default withMethods(["GET"], handler)