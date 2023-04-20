import Heading from "@/components/ui/Heading";
import Paragraph from "@/components/ui/Paragraph";
import { authOptions } from "@/lib/auth";
import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Open source",
};

export default async function BillingPage() {
  const currentUser = await getServerSession(authOptions);

  if (!currentUser) {
    redirect("/login")
  }

  return (
    <>
      <Heading>Billing</Heading>
      <Paragraph>Manage billing and your subscription plan.</Paragraph>
      <BillingPanel /> 
    </>
  )
}