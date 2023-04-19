"use client"

import { FC, useState } from 'react'
import { Button } from './Button'
import { signIn } from 'next-auth/react'
import { toast } from './Toast'

interface SignInButtonProps {
  
}

const SignInButton: FC<SignInButtonProps> = ({}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const signInWithGoogle = async () => {
    try {
      setIsLoading(true);
      await signIn('google')
    } catch (err) {
       toast({
         title: 'Error signing in',
         message: 'Please try again later',
         type: 'error'
       })
    }
  }
  
  return <Button onClick={signInWithGoogle} isLoading={isLoading}>
    Sign in
  </Button>
}

export default SignInButton