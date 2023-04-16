"use client"

import { createApiKey } from "@/constants/createApiKey";
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@/ui/DropdownMenu";
import { Loader2 } from "lucide-react";
import { FC, useState } from "react";
import { Button } from "./ui/Button";
import { DropdownMenuContent, DropdownMenuItem } from "./ui/DropdownMenu";
import { toast } from "./ui/Toast";
import { useRouter } from "next/navigation"
import { revokeApiKey } from "@/constants/revokeApiKey";

interface ApiKeyOptionsProps {
  apiKeyId: string;
  apiKeyK: string;
}

const ApiKeyOptions: FC<ApiKeyOptionsProps> = ({ apiKeyId, apiKeyK }) => {
  const [isCreatingNew, setIsCreatingNew] = useState<boolean>(false);
  const [isRevoking, setIsRevoking] = useState<boolean>(false);
  const router = useRouter()

  const createNewApiKey = async () => {
    setIsCreatingNew(true);

    try {
      await revokeApiKey({keyId: apiKeyId})
      await createApiKey()
      router.refresh()

    } catch(err) {
      toast({
        title: "Error creating API key",
        message: "Please try that again",
        type: "error"
      })
    } finally {
      setIsCreatingNew(false)
    }
  }

  const revokeCurrentApiKey = async () => {
    setIsRevoking(true)

    try {
      await revokeApiKey({keyId: apiKeyId})
      router.refresh()
    } catch(err) {
      toast({
        title: "Error revoking API key",
        message: "Please try that again",
        type: "error"
      })
    } finally {
      setIsRevoking(false)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger disabled={isCreatingNew || isRevoking} asChild>
        <Button variant="ghost" className="flex gap-2 items-center">
          <p className="border-black">
            {isCreatingNew
              ? "Creating key"
              : isRevoking
              ? "Revoking key"
              : "Options"}
          </p>
          {isCreatingNew || isRevoking ? (
            <Loader2 className="animate-spin h-4 w-4" />
          ) : null}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent>
        <DropdownMenuItem
          onClick={() => {
            navigator.clipboard.writeText(apiKeyK);

            toast({
              title: "Copied",
              message: "API key copied to clipboard",
              type: "success",
            });
          }}
        >
          Copy
        </DropdownMenuItem>

        <DropdownMenuItem onClick={createNewApiKey}>
          Create new key
        </DropdownMenuItem>

        <DropdownMenuItem onClick={revokeCurrentApiKey}>
          Revoke key
        </DropdownMenuItem>

      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ApiKeyOptions;
