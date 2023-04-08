"use client"

import { Copy } from 'lucide-react'
import { ButtonHTMLAttributes, FC } from 'react'
import { Button } from './Button'
import { toast } from './Toast'

interface CopyBtnProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  dataToCopy: string
}

const CopyBtn: FC<CopyBtnProps> = ({
  dataToCopy,
  className,
  ...props
}) => {

  return <Button {...props} onClick={() => {
    navigator.clipboard.writeText(dataToCopy)

    toast({
      title: "Copied",
      message: "API key copied to clipboard",
      type: "success"
    })
  }} variant="ghost"
  className={className}>
    <Copy className="h-5 w-5" />
   </Button>
}

export default CopyBtn