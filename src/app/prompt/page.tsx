import { getServerSession } from "next-auth";
import type { Metadata } from "next";
import PromptForm from "@/components/PromptForm";
import { authOptions } from "@/lib/auth";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";

export const metadata: Metadata = {
  title: "Parallel - Your personal assistant for Legal Requests ⚡️",
  description: "Open source",
};

const page = async () => {
  const currentUser = await getServerSession(authOptions);
  if (!currentUser) return notFound();
  // console.log(currentUser)

  const apiKey = await db.apiKey.findFirst({
    where: { userId: currentUser.user.id, enabled: true },
  });

  // Shape the currentUser object to match the expected structure in PromptProps
  const shapedUser = {
    name: currentUser.user.name || undefined,
    email: currentUser.user.email || undefined,
    image: currentUser.user.image || undefined,
  };

  return (
    <>
      {
      apiKey ? (
        <PromptForm apiKey={apiKey} currentUser={shapedUser} />
      ) : null
    }
    </>
   
  );
};

export default page;
