import { FC } from "react";
import type { Metadata } from "next";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import RequestApiKey from "@/components/RequestApiKey";
import ApiDashboard from "@/components/ApiDashboard";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "",
};

const page = async () => {
  const currentUser = await getServerSession(authOptions);
  if (!currentUser) return notFound();

  const apiKey = await db.apiKey.findFirst({
    where: { userId: currentUser.user.id, enabled: true },
  });
  return (
    <div className="max-w-6xl mx-auto mt-16">
      {apiKey ? (
        // @ts-expect-error Server Component
        <ApiDashboard />
      ) : (
        <RequestApiKey />
      )}
    </div>
  );
};

export default page;
