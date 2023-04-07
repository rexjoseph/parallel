"use client"

import { useTheme } from 'next-themes'
import { FC } from 'react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/ui/DropdownMenu'
import { Button } from '@/ui/Button'
import { Sun } from 'lucide-react'

interface ThemeToggleProps {
  
}

const ThemeToggle: FC<ThemeToggleProps> = ({}) => {
  const {setTheme} = useTheme()

  return <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button variant="ghost" size="sm">
          <Icons.Sun className='rotate-0 scale-100 transition-all hover:text-slate-900 dark:-rotate-90 dark:scale-0 dark:text-slate-400 dark:hover:text-slate-100' />
          <Icons.Moon className='absolute rotate-90 scale-0 transition-all hover:text-slate-900 dark:rotate-0 dark:scale-100 dark:text-slate-400 dark:hover:text-slate-100' />
          <span className='sr-only'>Toggle theme</span>
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align='end' forceMount>
      <DropdownMenuItem></DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
}

export default ThemeToggle