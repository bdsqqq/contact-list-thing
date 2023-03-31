import { client } from "~/server/api/client";

import { NextApiRequest, NextApiResponse } from "next"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const response = await client.list.create.mutate({ name: req.body.name });
  res.status(200).json({ response });
}
