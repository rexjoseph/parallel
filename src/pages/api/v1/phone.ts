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
    // return res.status(200).json(phone_number.lineTypeIntelligence);
    /* const response = await client.lookups.v2
      .phoneNumbers(number)
      .fetch({ fields: "line_type_intelligence" });
    const companyToContact = response.lineTypeIntelligence.carrier_name; */
    // console.log(companyToContact)
    /* if (response.valid === true) {
      const newResponse = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: `Write a subpoena to ${companyToContact} asking for phone records, and possible call logs as well as recordings for this phone number ${number}`,
        temperature: 0.7,
        max_tokens: 100,
        top_p: 1,
        frequency_penalty: 0.0,
        presence_penalty: 0.6,
      });
      const data = newResponse.data.choices[0].text;

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

      return res.status(200).json({ success: true, data });
    } else {
      return res.status(400).json({ message: "Invalid number provided" });
    } */
  } catch (error) {
    res.status(500).json({ message: "Some error occured" });
  }
};

export default withMethods(["POST"], handler);
