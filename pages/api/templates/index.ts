import { ITemplateData } from "@/models/black-list/template-data";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse<ITemplateData | null>) {
  if (req.method !== "POST") {
    return res.status(400).json(null);
  }

  const operator = req.body["operator"];
  const criteria = req.body["criteria"];

  const response = await fetch(process.env.BACKEND_API_URL + "/ws/rest/com.axelor.apps.base.db.Product/search", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: req.headers["server-cookie"]?.toString() ?? "",
    },
    body: JSON.stringify({
      data: {
        operator: operator,
        criteria: criteria,
      },
      translate: true,
      ...req.body,
    }),
  });

  if (!response.ok) {
    return res.status(response.status).json(null);
  }

  const responseData = await response.json();

  return res.status(200).json(responseData);
}
