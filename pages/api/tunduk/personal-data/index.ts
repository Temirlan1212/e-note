import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { pin, series, number } = req.query;

  if (req.method !== "POST" || pin == null || series == null || number == null) {
    return res.status(400).json(null);
  }

  const response = await fetch(
    process.env.BACKEND_API_URL + `/ws/tunduk/individual?pin=${pin}&series=${series}&number=${number}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Basic YWRtaW46YWRtaW4=",
      },
    }
  );

  if (!response.ok) {
    return res.status(response.status).json(null);
  }

  const responseData = await response.json();

  return res.status(200).json(responseData);
}
