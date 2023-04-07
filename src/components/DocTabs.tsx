"use client"

import { FC } from 'react'
import Code from '@/components/Code'
import SimpleBar from "simplebar-react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from './ui/Tabs'
import { nodejs, python } from '@/constants/documentation'

const DocTabs: FC = ({}) => {
  return <Tabs defaultValue='nodejs' className="max-width-2xl w-full">
    <TabsList>
      <TabsTrigger value="nodejs">Node.js</TabsTrigger>
      <TabsTrigger value="python">Python</TabsTrigger>
    </TabsList>
    <TabsContent value="nodejs">
      <SimpleBar>
        <Code animated language="javascript" code={nodejs} show />
      </SimpleBar>
    </TabsContent>
    <TabsContent value="python">
      <SimpleBar>
        <Code animated language="python" code={python} show />
      </SimpleBar>
    </TabsContent>
  </Tabs>
}

export default DocTabs