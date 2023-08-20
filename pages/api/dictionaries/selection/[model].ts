import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { model } = req.query;

  if (req.method !== "POST" || model == null) {
    return res.status(400).json(null);
  }

  const criteria: Record<string, string | number>[] = [];

  const response = await fetch(process.env.BACKEND_API_URL + `/ws/selection/${model}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: req.headers["server-cookie"]?.toString() ?? "",
    },
    body: JSON.stringify({
      fields: ["title", "value"],
      translate: true,
      data: {
        criteria,
      },
    }),
  });

  if (!response.ok) {
    return res.status(response.status).json(null);
  }

  const responseData = await response.json();

  return res.status(200).json(responseData);
}
