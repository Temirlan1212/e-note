import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(400).json(null);
  }

  const { relationshipType, notaryProductId, partnerType, notaryPowerAttorneyTerm, currencyId } = req.body.body;

  const response = await fetch(process.env.BACKEND_API_URL + "/ws/rest/com.axelor.apps.base.db.PriceListLine/search", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: req.headers["server-cookie"]?.toString() ?? "",
    },
    body: JSON.stringify({
      fields: ["reward"],
      data: {
        criteria: [
          {
            operator: "and",
            criteria: [
              {
                fieldName: "notaryProduct.id",
                operator: "=",
                value: notaryProductId,
              },
              {
                fieldName: "relationshipType",
                operator: "=",
                value: relationshipType,
              },
              {
                fieldName: "faces",
                operator: "=",
                value: partnerType,
              },
              {
                fieldName: "notaryStateDutyTerm",
                operator: "=",
                value: notaryPowerAttorneyTerm,
              },
              {
                fieldName: "currency.id",
                operator: "=",
                value: currencyId,
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
