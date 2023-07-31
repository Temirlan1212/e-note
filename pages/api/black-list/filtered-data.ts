import { IFilteredData } from "@/models/black-list/filtered-data";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse<IFilteredData | null>) {
  if (req.method !== "POST") {
    return res.status(400).json(null);
  }
  const criteria = req.body["filterFields"];
  const operator = req.body["operator"];

  const response = await fetch(process.env.BACKEND_API_URL + "/ws/rest/com.axelor.apps.base.db.Blocking/search", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: req.headers["server-cookie"]?.toString() ?? "",
    },
    body: JSON.stringify({
      offset: 0,
      limit: 10,
      fields: [
        "partner.personalNumber",
        "partner.birthDate",
        "partner.fullName",
        "createdOn",
        "createdBy.fullName",
        "blockingReason.name",
      ],
      data: {
        operator: operator,
        criteria: criteria,
      },
    }),
  });
  if (!response.ok) {
    return res.status(response.status).json(null);
  }

  const responseData = await response.json();

  return res.status(200).json(responseData);
}
