import { cosineParallel } from "@/constants/cosine-parallel";
import { withMethods } from "@/lib/api-middlewares/with-method";
import { db } from "@/lib/db";
import { openai } from "@/lib/openai";
import { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";

const reqSchema = z.object({
  sample1: z.string().max(1100),
  sample2: z.string().max(1100),
});

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const body = req.body as unknown;

  const apiKey = req.headers.authorization;
  if (!apiKey) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const { sample1, sample2 } = reqSchema.parse(body);
    const validApikey = await db.apiKey.findFirst({
      where: {
        key: apiKey,
        enabled: true,
      },
    });
    if (!validApikey) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const start = new Date()
    const embeddings = await Promise.all(
      [sample1, sample2].map(async (text) => {
        const res = await openai.createEmbedding({
          model: "text-embedding-ada-002",
          input: text
        })
        return res.data.data[0].embedding
      })
    )

    const parallel = cosineParallel(embeddings[0], embeddings[1])
    const duration = new Date().getTime() - start.getTime()

    // persist req
    await db.apiRequest.create({
      data: {
        duration,
        method: req.method as string,
        path: req.url as string,
        status: 200,
        apiKeyId: validApikey.id,
        usedApiKey: validApikey.key
      }
    })
    return res.status(200).json({success: true, sample1, sample2, parallel})
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ error: err.issues });
    }

    return res.status(500).json({ error: "Internal server error" });
  }
};

export default withMethods(["POST"], handler);