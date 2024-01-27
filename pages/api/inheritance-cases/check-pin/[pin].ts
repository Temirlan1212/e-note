import type { NextApiRequest, NextApiResponse } from "next";

import { ApiNotaryResponse } from "@/models/notaries";

export default async function handler(req: NextApiRequest, res: NextApiResponse<ApiNotaryResponse | null>) {
  const { pin } = req.query;

  if (req.method !== "POST" && pin == null) {
    return res.status(400).json(null);
  }

  const response = await fetch(process.env.BACKEND_API_URL + `/ws/rest/com.axelor.apps.sale.db.SaleOrder/search`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: req.headers["server-cookie"]?.toString() ?? "",
    },
    body: JSON.stringify({
      fields: [
        "notaryUniqNumber",
        "requester.fullName",
        "requester.deathDate",
        "company.name",
        "company.id",
        "requester.birthDate",
      ],
      data: {
        criteria: [
          {
            operator: "and",
            criteria: [
              {
                fieldName: "notaryIsInheritance",
                operator: "=",
                value: true,
              },
              {
                fieldName: "saleOrderRef",
                operator: "isNull",
                value: true,
              },
              {
                fieldName: "requester.personalNumber",
                operator: "=",
                value: pin,
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
