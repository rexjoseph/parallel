const client = require("twilio")(
  process.env.ACCOUNT_SID!,
  process.env.AUTH_TOKEN!
);
import { withMethods } from "@/lib/api-middlewares/with-method";
import { db } from "@/lib/db";
import { openai } from "@/lib/openai";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const apiKey = req.headers.authorization;
  if (!apiKey) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  const { number } = req.body;
  const validApiKey = await db.apiKey.findFirst({
    where: {
      key: apiKey,
      enabled: true,
    },
  });

  if (!validApiKey) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const start = new Date();

  try {
    const phone_number = await client.lookups.v2.phoneNumbers(number).fetch({ fields: 'line_type_intelligence' });
    const duration = new Date().getTime() - start.getTime();

      // Persist request
      await db.apiRequest.create({
        data: {
          duration,
          method: req.method as string,
          path: req.url as string,
          status: 200,
          apiKeyId: validApiKey.id,
          usedApiKey: validApiKey.key,
        },
      });
      return res.status(200).json({ success: true, data: phone_number.lineTypeIntelligence.carrier_name });
  } catch (error) {
    res.status(500).json({ message: "Please provide a valid phone number" });
  }
};

export default withMethods(["POST"], handler);
