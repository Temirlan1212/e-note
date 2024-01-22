import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (req.method !== "POST") {
    return res.status(400).json(null);
  }

  const response = await fetch(
    process.env.BACKEND_OPEN_API_URL + `/read/com.axelor.apps.notary.db.NotaryAction/${id}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        data: {
          criteria: [
            {
              fieldName: "id",
              operator: "=",
              value: id,
            },
          ],
        },
      }),
    }
  );

  if (!response.ok) {
    return res.status(response.status).json(null);
  }

  const responseData = await response.json();

  return res.status(200).json(responseData);
}
