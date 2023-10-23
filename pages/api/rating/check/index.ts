import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(400).json(null);
  }

  const companyId = req.body["companyId"];
  const requesterId = req.body["requesterId"];
  const applicationId = req.body["applicationId"];

  const response = await fetch(process.env.BACKEND_API_URL + "/ws/rest/com.axelor.apps.sale.db.Rating/search/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: req.headers["server-cookie"]?.toString() ?? "",
    },
    body: JSON.stringify({
      fields: ["grade"],
      data: {
        criteria: [
          {
            operator: "and",
            criteria: [
              {
                fieldName: "partner.id",
                operator: "=",
                value: requesterId,
              },
              {
                fieldName: "saleOrder.id",
                operator: "=",
                value: applicationId,
              },
              {
                fieldName: "company.id",
                operator: "=",
                value: companyId,
              },
            ],
          },
        ],
      },
    }),
  });

  if (!response.ok) {
    return res.status(response.status).json(null);
  }

  const responseData = await response.json();

  return res.status(200).json(responseData);
}
