"use client"

import { FC, useState } from 'react'
import { Button } from '@/ui/Button'
import { signOut } from 'next-auth/react'
import { toast } from './ui/Toast'

interface SignOutButtonProps {
  
}

const SignOutButton: FC<SignOutButtonProps> = ({}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const signOutUser = async () => {
    setIsLoading(true);

    try {
      await signOut()
    } catch (err) {
       toast({
         title: 'Error signing out',
         message: 'There was an issue. Please try again',
         type: 'error'
       })
    }
  }
  
  return <Button onClick={signOutUser} isLoading={isLoading}>
    Sign out
  </Button>
}

export default SignOutButton