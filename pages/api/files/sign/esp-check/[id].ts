import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse<null>) {
  const { id } = req.query;

  if (req.method !== "POST" || id == null) {
    return res.status(400).json(null);
  }

  const response = await fetch(`${process.env.BACKEND_API_URL}/ws/files/esp-check/${id}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: req.headers["server-cookie"]?.toString() ?? "",
    },
    body: JSON.stringify({
      data: req.body,
    }),
  });

  if (!response.ok) {
    return res.status(response.status).json(null);
  }

  const responseData = await response.json();

  return res.status(200).json(responseData);
}
