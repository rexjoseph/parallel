"use client"

import { createApiKey } from '@/constants/createApiKey';
import { Key } from 'lucide-react';
import { FC, FormEvent, useState } from 'react'
import Heading from '@/ui/Heading';
import { toast } from '@/ui/Toast';
import Paragraph from '@/ui/Paragraph';
import CopyBtn from '@/ui/CopyBtn';
import { Input } from '@/ui/Input';
import { Button } from '@/ui/Button';

const RequestApiKey: FC = () => {
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [apiKey, setApiKey] = useState<string | null>(null);

  const createNewApiKey = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    setIsCreating(true)

    try {
      const generatedApiKey = await createApiKey();
      setApiKey(generatedApiKey)
    } catch (err) {
      if (err instanceof Error) {
        toast({
          title: "Error while generating key",
          message: err.message,
          type: "error"
        })
        return
      }
      toast({
        title: "Error",
        message: "Some error occurred",
        type: "error"
      })
    } finally {
      setIsCreating(false)
    }
  } 

  return <div className="container md:max-w-2xl">
    <div className="flex flex-col gap-6 items-center">
      <Key className="mx-auto h-12 w-12 text-gray-400" />
      <Heading>Request API key</Heading>
      <Paragraph>You haven&apos;t requested an API key recently</Paragraph>
    </div>

    <form onSubmit={createNewApiKey} className="mt-6 sm:flex sm:items-center" action='#'>
      <div className="relative rounded-md shadow-dm sm:min-w-0 sm:flex-1">
        {
          apiKey ? (
            <CopyBtn dataToCopy={apiKey} className="absolute inset-y-0 right-0 animate-in fade-in duration-300" />
            ) : null
          }
          <Input readOnly value={apiKey ?? ""} placeholder="Request an API key to display it here" />
      </div>
      <div className="mt-3 flex justify-center sm:mt-0 sm:ml-4 sm:flex-shrink-0">
        <Button disabled={!!apiKey} isLoading={isCreating}>Request key</Button>
      </div>
    </form>
  </div>
}

export default RequestApiKey