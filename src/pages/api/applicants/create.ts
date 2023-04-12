import { withMethods } from "@/lib/api-middlewares/with-method";
import { db } from "@/lib/db";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  // console.log("Request", req.body);
  const { email } = req.body;

  const existApplicant = await db.emailSubscribers.findFirst({
    where: {
      email: email,
    },
  });

  if (existApplicant) {
    return res.status(400).json({ message: "You are already on the list" });
  }
  try {
    const createdApplicant = await db.emailSubscribers.create({
      data: {
        email: email,
      },
    });
    return res.status(200).json({ message: "You've been added to the list 👋", createdApplicant });
  } catch (err) {
    res.status(500).json({ message: "Some error occured", err });
  }
};

export default withMethods(["POST"], handler);
