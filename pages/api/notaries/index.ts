import type { NextApiRequest, NextApiResponse } from "next";

import { INotaryData } from "@/models/notaries";

export default async function handler(req: NextApiRequest, res: NextApiResponse<INotaryData | null>) {
  if (req.method !== "POST" && req.body == null) {
    return res.status(400).json(null);
  }

  const pageSize = Number.isInteger(Number(req.body["pageSize"])) ? Number(req.body["pageSize"]) : 8;
  const page = Number.isInteger(Number(req.body["page"])) ? (Number(req.body["page"]) - 1) * pageSize : 0;

  const response = await fetch(process.env.BACKEND_API_URL + "/ws/rest/com.axelor.apps.base.db.Company/search", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: req.headers["server-cookie"]?.toString() ?? "",
    },
    body: JSON.stringify({
      offset: page,
      limit: pageSize,
      fields: [
        "partner.simpleFullName",
        "partner.rating",
        "logo.fileName",
        "address.region",
        "address.district",
        "address.city",
      ],
      data: {
        criteria: req.body["criteria"] ?? [],
        sortBy: req.body["sortBy"] ?? [],
      },
      ...req.body,
    }),
  });

  if (!response.ok) {
    return res.status(response.status).json(null);
  }

  const responseData = await response.json();

  return res.status(200).json(responseData);
}
