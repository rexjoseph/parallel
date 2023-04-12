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
    <div className="container max-w-5xl mx-auto mt-16">
      {apiKey ? (
        <div className="container flex flex-col gap-6">
          <Heading style={{ textAlign: "left" }}>Hey 👋,</Heading>
          <p className="text-slate-700 dark:text-slate-300 mb-2">
            Jared here 😃. I run your subpoena errands - my current average lead
            time is 7.5s. Give me a number
          </p>
          <PromptForm apiKey={apiKey} />
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

export default page;
