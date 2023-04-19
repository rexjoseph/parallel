import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { CreateApiData } from "@/types/api"
import { NextApiRequest, NextApiResponse } from "next"
import { getServerSession } from "next-auth"
import { nanoid } from "nanoid"
import { z } from "zod"
import { withMethods } from "@/lib/api-middlewares/with-method"

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<CreateApiData>
  ) => {
    try {
      const user = await getServerSession(req, res, authOptions).then((res) => res?.user)
      if (!user) {
        return res.status(401).json({
          error: "Unauthorized access",
          createdApiKey: null
        })
      }
      const existApiKey = await db.apiKey.findFirst({
        where: {
          userId: user.id, enabled: true
        }
      })
      if (existApiKey) {
        return res.status(400).json({
          error: "You already have an active API",
          createdApiKey: null
        })
      }
      const createdApiKey = await db.apiKey.create({
        data: {
          userId: user.id,
          key: nanoid()
        }
      })
      return res.status(200).json({error: null, createdApiKey})
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({error: err.issues, createdApiKey: null})
      }
      return res.status(500).json({
        error: 'Internal server error',
        createdApiKey: null
      })
    }
}

export default withMethods(['GET'], handler) 