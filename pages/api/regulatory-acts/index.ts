import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(400).json(null);
  }

  const response = await fetch(
    process.env.BACKEND_OPEN_API_URL + "/search/axelor-erp/com.axelor.apps.notary.db.Reference",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        offset: 0,
        limit: 100,
        fields: ["title", "$t:title", "url", "category"],
        data: {
          translate: true,
          criteria: [
            {
              fieldName: "category",
              operator: "=",
              value: "regulatory-acts",
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
