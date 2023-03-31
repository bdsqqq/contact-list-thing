import { client } from "~/server/api/client";

import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const response = await client.subscriber.parseAndCreateMany.mutate({
    listId: req.body.listid,
    csvData: req.body.csvData,
    overrides: req.body.overrides,
  });
  res.status(200).json({ response });
}
