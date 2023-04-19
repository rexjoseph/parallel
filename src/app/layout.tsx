import '@/styles/globals.css'
import { Rubik } from 'next/font/google'
import { absoluteUrl, cn } from '@/lib/utils'
import Providers from '@/components/Providers'
import Navbar from '@/components/Navbar'
import { Toaster } from '@/components/ui/Toast'
import { webConfig } from '@/config/web'

const rubik = Rubik({subsets: ['latin']})

export const metadata = {
  title: {
    default: webConfig.title,
    template: `%s | ${webConfig.title}`
  },
  description: webConfig.description,
  keywords: [
    "Paralegal",
    "Legal",
    "Law",
    "Subpoena"
  ],
  authors: [
    {
      name: "Rex Joseph",
      url: "https://rexjoseph.github.io/portfolio"
    }
  ],
  creator: "Rex",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: webConfig.url,
    title: webConfig.title,
    description: webConfig.description,
    siteName: webConfig.title,
    images: [
      {
        url: absoluteUrl("/og.jpg"),
        width: 1200,
        height: 630,
        alt: webConfig.title
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: webConfig.title,
    description: webConfig.description,
    images: [`${webConfig.url}/og.jpg`],
    creator: "@jvorex_",
  },
  icons: {
    icon: "favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png"
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={cn(
    'bg-white text-slate-900 antialiased', rubik.className
    )}>
      <head />
      <body className='min-h-screen bg-white dark:bg-black antialiased'>
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
