import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(400).json(null);
  }

  const response = await fetch(process.env.BACKEND_API_URL + "/esd", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      data: {
        ...req.body,
      },
    }),
  });

  if (!response.ok) {
    return res.status(response.status).json(null);
  }

  res.setHeader("cookie", response.headers.get("set-cookie") ?? "");

  return res.status(200).json({ username: response.headers.get("username") });
}
