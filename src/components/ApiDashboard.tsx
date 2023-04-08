import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { getServerSession } from 'next-auth'
import { notFound } from 'next/navigation'
import { FC } from 'react'
import { formatDistance } from 'date-fns'

const ApiDashboard = async () => {
  const user = await getServerSession(authOptions)
  if (!user) notFound()

  const apiKeys = await db.apiKey.findMany({
    where: {
      userId: user.user.id
    }
  })

  const activeApiKey = apiKeys.find((apiKey) => apiKey.enabled)

  if (!activeApiKey) notFound()

  const userRequests = await db.apiRequest.findMany({
    where: {
      apiKeyId: {
        in: apiKeys.map((key) => key.id),

      }
    }
  })

  const serializeableRequests = userRequests.map((req) => ({
    ...req,
    timestamp: formatDistance(new Date(req.timestamp), new Date())
  }))

  return <div>ApiDashboard</div>
}

export default ApiDashboard