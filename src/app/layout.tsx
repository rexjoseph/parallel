import '@/styles/globals.css'
import { Rubik } from 'next/font/google'
import { cn } from '@/lib/utils'
import Providers from '@/components/Providers'
import Navbar from '@/components/Navbar'
import { Toaster } from '@/components/ui/Toast'

const rubik = Rubik({subsets: ['latin']})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={cn(
    'bg-white text-slate-900 antialiased', rubik.className
    )}>
      <body className='min-h-screen bg-white dark:bg-dark antialiased'>
        <Providers>
          {/* @ts-expect-error Server Component */}
          <Navbar />
          <Toaster position="bottom-right" />
          <main className="relative w-full hero-section">{children}</main>
        </Providers>

        {/* Add height on mobile */}
        {/* <div className='h-40 md:hidden' /> */}
      </body>
    </html>
  )
}
