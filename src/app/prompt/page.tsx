import { getServerSession } from "next-auth";
import type { Metadata } from "next";
import PromptForm from "@/components/PromptForm";
import { authOptions } from "@/lib/auth";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import Heading from "@/components/ui/Heading";
import Paragraph from "@/components/ui/Paragraph";
import { buttonVariants } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Parallel - Your personal assistant for Legal Requests ⚡️",
  description: "Open source",
};

const page = async () => {
  const currentUser = await getServerSession(authOptions);
  if (!currentUser) return notFound();

  const apiKey = await db.apiKey.findFirst({
    where: { userId: currentUser.user.id, enabled: true },
  });

  return (
    <>
      {
      apiKey ? (
        <PromptForm apiKey={apiKey} />
      ) : null
    }
    </>
   
  );
};

export default page;
