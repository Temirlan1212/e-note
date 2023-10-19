import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(400).json(null);
  }

  const response = await fetch(process.env.BACKEND_API_URL + "/login/esi-link", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) {
    return res.status(response.status).json(null);
  }

  return res.status(200).json({ status: 0, data: { url: await response.text() } });
}
