import Heading from '@/components/ui/Heading'
import Paragraph from '@/components/ui/Paragraph'
import Link from 'next/link'
import type { Metadata } from 'next'
import Image from 'next/image'

export const metadata: Metadata = {
  title: 'Parallel API | Home',
  description: 'Open source'
}

export default function Home() {
  return (
    <div className="relative h-screen flex items-center justify-center overflow-x-hidden">
      <div className="container pt-32 max-w-7xl mx-auto w-full h-full">
          <div className="h-full gap-6 flex flex-col justify-start lg:justify-center items-center lg:items-start">
            <div>
              <Heading size="lg" className='text-black dark:text-light'>
                Determine <br /> text similarity within seconds
              </Heading>

              <Paragraph className="max-w-xl lg:text-left">
                With the text similarity API, you can easily determine the similarity between two phrases with a free {' '}
                <Link href="/login" className="underline underline-offset-2 text-black dark:text-light">API key</Link>.
              </Paragraph>
            </div>

            <div className='relative w-full max-w-lg lg:max-w-3xl lg:left-1/2 aspect-square lg:absolute'>
              <Image
                priority
                className="img-shadow"
                quality={100}
                style={{objectFit: 'contain'}}
                fill
                src="/original-painting-faces.jpeg"
                alt="original painting"   
              />
            </div>
          </div>
      </div>
    </div>
  )
}
