import { FC } from 'react'

import type { Metadata } from 'next'
import Heading from '@/components/ui/Heading'
import Paragraph from '@/components/ui/Paragraph'
import DocTabs from '@/components/DocTabs'

import "simplebar-react/dist/simplebar.min.css"

export const metadata: Metadata = {
  title: 'Documentation',
  description: 'Open source'
}
const page: FC = () => {
  return <div className="container max-w-6xl mx-auto mt-12">
    <div className="flex flex-col items-center gap-6">
      <Heading>Making a request</Heading>
      <Paragraph>api/v1/parallel</Paragraph>

      <DocTabs />
    </div>
  </div>
}

export default page