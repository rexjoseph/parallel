import { withMethods } from "@/lib/api-middlewares/with-method";
import { db } from "@/lib/db";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { apiKey, duration, path } = req.body;
  // console.log(req.body)
  // Send back response to client
  // res.status(200).json({message: "success", data: req.body});
  try {
    const validApiKey = await db.apiKey.findFirst({
      where: {
        key: apiKey,
        enabled: true,
      },
    });

    if (!validApiKey) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    await db.apiRequest.create({
      data: {
        duration,
        method: req.method as string,
        path: path as string,
        status: 200,
        apiKeyId: validApiKey.id,
        usedApiKey: validApiKey.key,
      },
    })

    return res.status(200).json({ success: true })
  } catch (err) {
    return res.status(500).json({ error: "Internal server error" });
  }
}

export default withMethods(["POST"], handler);