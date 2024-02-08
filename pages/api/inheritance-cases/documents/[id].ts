import type { NextApiRequest, NextApiResponse } from "next";

import { ApiNotaryResponse } from "@/models/notaries";

export default async function handler(req: NextApiRequest, res: NextApiResponse<ApiNotaryResponse | null>) {
  const { id } = req.query;

  if (req.method !== "POST" && id == null) {
    return res.status(400).json(null);
  }

  const response = await fetch(process.env.BACKEND_API_URL + "/ws/rest/com.axelor.dms.db.DMSFile/search", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: req.headers["server-cookie"]?.toString() ?? "",
    },
    body: JSON.stringify({
      fields: ["fileName", "fileType", "fieldSizeText", "createdOn", "archived"],
      data: {
        criteria: [
          {
            operator: "and",
            criteria: [
              {
                fieldName: "fileName",
                operator: "notLike",
                value: "SaleOrderQRCode_",
              },
              {
                fieldName: "relatedId",
                operator: "=",
                value: id,
              },
              {
                fieldName: "relatedModel",
                operator: "=",
                value: "com.axelor.apps.sale.db.SaleOrder",
              },
              {
                operator: "or",
                criteria: [
                  {
                    fieldName: "archived",
                    operator: "=",
                    value: false,
                  },
                  {
                    fieldName: "archived",
                    operator: "isNull",
                    value: true,
                  },
                ],
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
